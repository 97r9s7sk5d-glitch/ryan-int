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
  // same-origin only
  const origin = req.headers.get('origin');
  if (origin) {
    try {
      if (new URL(origin).host !== req.headers.get('host')) return json({error: 'forbidden'}, 403);
    } catch {
      return json({error: 'forbidden'}, 403);
    }
  }

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

  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown';
  if (limited(ip)) return json({error: 'rate_limited'}, 429);

  const errors = validateEnquiry(body as Partial<Enquiry>);
  if (Object.keys(errors).length) return json({errors}, 422);

  const d = Object.fromEntries(['first', 'last', 'email', 'phone', 'type', 'message', 'spec'].map((k) => [k, String(body[k] ?? '').trim()])) as unknown as Enquiry;
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
      const r = await fetch(endpoint, {
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
