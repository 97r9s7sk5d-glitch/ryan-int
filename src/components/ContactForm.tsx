'use client';

import {useSearchParams} from 'next/navigation';
import {useState, type FormEvent} from 'react';
import {SITE} from '@/lib/site';

const TYPES = ['Kitchen', 'Bedroom / wardrobes', 'Bathroom', 'Office, study or library', 'Furniture', 'Something else'];

const field =
  'w-full border-0 border-b border-line bg-transparent py-3 text-ivory placeholder:text-muted/70 outline-none transition-colors focus:border-brass';

export function ContactForm() {
  const params = useSearchParams();
  const spec = params.get('spec') ?? '';
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const data = Object.fromEntries(f.entries()) as Record<string, string>;
    if (data.website) return; // honeypot
    const body = `Name: ${data.first} ${data.last}\nEmail: ${data.email}\nPhone: ${data.phone || '-'}\nProject: ${data.type}\n\n${data.message}${spec ? `\n\nStarting point from the website: ${spec}` : ''}`;
    if (!SITE.formEndpoint) {
      window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(`Enquiry — ${data.type}`)}&body=${encodeURIComponent(body)}`;
      setState('sent');
      return;
    }
    setState('sending');
    try {
      const r = await fetch(SITE.formEndpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        body: JSON.stringify({...data, spec, _subject: `Website enquiry — ${data.type}`}),
      });
      setState(r.ok ? 'sent' : 'error');
    } catch {
      setState('error');
    }
  }

  if (state === 'sent')
    return (
      <div className="border border-brass/50 p-10">
        <p className="display text-4xl">Thank you.</p>
        <p className="mt-3 text-muted">Ryan will be in touch as soon as he can. If it’s urgent, call {SITE.mobile}.</p>
      </div>
    );

  return (
    <form onSubmit={onSubmit} className="space-y-7" id="enquiry">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="grid gap-7 sm:grid-cols-2">
        <label className="block"><span className="eyebrow">First name</span><input required name="first" autoComplete="given-name" className={field} /></label>
        <label className="block"><span className="eyebrow">Last name</span><input required name="last" autoComplete="family-name" className={field} /></label>
        <label className="block"><span className="eyebrow">Email</span><input required type="email" name="email" autoComplete="email" className={field} /></label>
        <label className="block"><span className="eyebrow">Phone (optional)</span><input type="tel" name="phone" autoComplete="tel" className={field} /></label>
      </div>
      <label className="block">
        <span className="eyebrow">What are you planning?</span>
        <select name="type" className={`${field} appearance-none`} defaultValue={TYPES[0]}>
          {TYPES.map((t) => <option key={t} className="bg-ink">{t}</option>)}
        </select>
      </label>
      <label className="block">
        <span className="eyebrow">Tell us about your project</span>
        <textarea required name="message" rows={5} className={field} placeholder="The room, the style, the timeframe…" />
      </label>
      {spec && (
        <p className="border-l-2 border-brass pl-4 text-sm text-ivory/80">
          <span className="eyebrow block">Your starting point</span>
          {spec}
        </p>
      )}
      <button className="btn btn-solid" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Send enquiry →'}</button>
      {state === 'error' && <p className="text-sm text-red-300">Something went wrong. Please try again or email {SITE.email}.</p>}
      <p className="text-xs text-muted">We’ll only use your details to reply to your enquiry. See our <a href="/privacy" className="link-u">privacy policy</a>.</p>
    </form>
  );
}
