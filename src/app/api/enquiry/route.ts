import {NextResponse} from 'next/server';
import {SITE} from '@/lib/site';
import {validateEnquiry, type Enquiry} from '@/lib/enquiry';

// Server-side so no key, endpoint or address-book detail ever ships to the browser.
//   RESEND_API_KEY + ENQUIRY_FROM (+ optional ENQUIRY_TO) → sent by email through Resend
//   FORM_ENDPOINT                                         → forwarded to Formspree / any webhook
// With neither set the route answers 503 and the form falls back to the visitor's own email app.
export const runtime = 'nodejs';

const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 4;
const hits = new Map<string, number[]>(); // best effort: per server instance

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  return recent.length > MAX_PER_WINDOW;
}

const json = (body: object, status = 200) => NextResponse.json(body, {status, headers: {'Cache-Control': 'no-store'}});

export async function POST(req: Request) {
  // CSRF / cross-site abuse: browsers always send Origin on a fetch POST, and it must be this site.
  // (There are no cookies or sessions to ride on, and JSON bodies can't be sent cross-site without a preflight we never grant.)
  try {
    if (new URL(req.headers.get('origin') ?? '').host !== req.headers.get('host')) return json({error: 'forbidden'}, 403);
  } catch {
    return json({error: 'forbidden'}, 403);
  }
  const site = req.headers.get('sec-fetch-site');
  if (site && site !== 'same-origin') return json({error: 'forbidden'}, 403);
  if (!(req.headers.get('content-type') ?? '').toLowerCase().startsWith('application/json')) return json({error: 'unsupported'}, 415);
  if (Number(req.headers.get('content-length') ?? 0) > 12_000) return json({error: 'too_large'}, 413);

  const raw = await req.text();
  if (raw.length > 12_000) return json({error: 'too_large'}, 413);
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({error: 'bad_request'}, 400);
  }

  // spam traps: a filled honeypot, or a form "submitted" faster than a person can type. Pretend success so bots learn nothing.
  const elapsed = Date.now() - Number(body.t);
  if (body.website || !Number.isFinite(elapsed) || elapsed < 3000) return json({ok: true});

  const ip = req.headers.get('x-real-ip') || (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown';
  if (limited(ip)) return json({error: 'rate_limited'}, 429);

  const errors = validateEnquiry(body as Partial<Enquiry>);
  if (Object.keys(errors).length) return json({errors}, 422);

  // plain text only: drop control characters (keeping line breaks in the message) so nothing can inject headers or odd formatting
  const clean = (v: unknown, multiline = false) =>
    String(v ?? '')
      .replace(multiline ? /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g, ' ')
      .trim();
  const d = Object.fromEntries(['first', 'last', 'email', 'phone', 'type', 'message', 'spec'].map((k) => [k, clean(body[k], k === 'message')])) as unknown as Enquiry;
  const subject = `Website enquiry — ${d.type} — ${d.first} ${d.last}`;
  const text = [
    `Name: ${d.first} ${d.last}`,
    `Email: ${d.email}`,
    `Phone: ${d.phone || '-'}`,
    `Project: ${d.type}`,
    '',
    d.message,
    d.spec ? `\nStarting point from the website: ${d.spec}` : '',
  ].join('\n');

  try {
    const key = process.env.RESEND_API_KEY;
    const endpoint = process.env.FORM_ENDPOINT;
    if (key) {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {Authorization: `Bearer ${key}`, 'Content-Type': 'application/json'},
        signal: AbortSignal.timeout(8000),
        body: JSON.stringify({
          from: process.env.ENQUIRY_FROM ?? `${SITE.name} <onboarding@resend.dev>`,
          to: [process.env.ENQUIRY_TO ?? SITE.email],
          reply_to: d.email,
          subject,
          text,
        }),
      });
      return r.ok ? json({ok: true}) : json({error: 'delivery_failed'}, 502);
    }
    if (endpoint) {
      // destination comes from our own environment, never from the visitor; still insist on https
      if (!/^https:\/\//.test(endpoint)) return json({error: 'not_configured'}, 503);
      const r = await fetch(endpoint, {
        signal: AbortSignal.timeout(8000),
        method: 'POST',
        headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        body: JSON.stringify({...d, _subject: subject, _replyto: d.email}),
      });
      return r.ok ? json({ok: true}) : json({error: 'delivery_failed'}, 502);
    }
  } catch {
    return json({error: 'delivery_failed'}, 502);
  }
  return json({error: 'not_configured'}, 503);
}
