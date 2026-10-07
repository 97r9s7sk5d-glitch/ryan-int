'use client';

import {useSearchParams} from 'next/navigation';
import {useRef, useState, type FormEvent} from 'react';
import {SITE} from '@/lib/site';
import {ENQUIRY_TYPES, validateEnquiry, type Enquiry, type EnquiryErrors} from '@/lib/enquiry';

const field =
  'w-full border-0 border-b border-line bg-transparent py-3 text-ivory placeholder:text-muted outline-none transition-colors focus:border-brass aria-[invalid=true]:border-red-400';

const NAMES = ['first', 'last', 'email', 'phone', 'type', 'message'] as const;

function Err({id, msg}: {id: string; msg?: string}) {
  return msg ? <span id={`${id}-err`} role="alert" className="mt-2 block text-sm text-red-300">{msg}</span> : null;
}

export function ContactForm() {
  const params = useSearchParams();
  const spec = (params.get('spec') ?? '').slice(0, 500);
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'mailto' | 'error'>('idle');
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const opened = useRef(Date.now()); // spam check: real people take more than a few seconds
  const form = useRef<HTMLFormElement>(null);

  const read = (): Enquiry => {
    const f = new FormData(form.current!);
    const v = (k: string) => String(f.get(k) ?? '').trim();
    return {first: v('first'), last: v('last'), email: v('email'), phone: v('phone'), type: v('type'), message: v('message'), spec};
  };

  function checkOne(name: keyof Enquiry) {
    const e = validateEnquiry(read());
    setErrors((prev) => ({...prev, [name]: e[name]}));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === 'sending') return;
    const data = read();
    const found = validateEnquiry(data);
    setErrors(found);
    const firstBad = NAMES.find((n) => found[n]);
    if (firstBad) {
      form.current?.querySelector<HTMLElement>(`[name="${firstBad}"]`)?.focus();
      return;
    }
    setState('sending');
    try {
      const r = await fetch('/api/enquiry', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...data, website: new FormData(form.current!).get('website') ?? '', t: opened.current}),
      });
      if (r.ok) return setState('sent');
      if (r.status === 503) {
        // no delivery service connected yet → hand the enquiry to the visitor's own email app
        const body = `Name: ${data.first} ${data.last}\nEmail: ${data.email}\nPhone: ${data.phone || '-'}\nProject: ${data.type}\n\n${data.message}${spec ? `\n\nStarting point from the website: ${spec}` : ''}`;
        window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(`Enquiry — ${data.type}`)}&body=${encodeURIComponent(body)}`;
        return setState('mailto');
      }
      if (r.status === 422) {
        const j = await r.json().catch(() => null);
        if (j?.errors) setErrors(j.errors);
      }
      setState('error');
    } catch {
      setState('error');
    }
  }

  if (state === 'sent' || state === 'mailto')
    return (
      <div className="border border-brass/50 p-10" role="status">
        <p className="display text-4xl">{state === 'sent' ? 'Thank you.' : 'Almost there.'}</p>
        <p className="mt-3 text-muted">
          {state === 'sent'
            ? `Ryan will be in touch as soon as he can. If it’s urgent, call ${SITE.mobile}.`
            : `Your email app should have opened with your enquiry ready to send. Nothing has been sent until you press send there, or you can email ${SITE.email} directly.`}
        </p>
      </div>
    );

  const a = (n: keyof Enquiry) => ({
    'aria-invalid': errors[n] ? true : undefined,
    'aria-describedby': errors[n] ? `${n}-err` : undefined,
    onBlur: () => checkOne(n),
  });

  return (
    <form ref={form} onSubmit={onSubmit} noValidate className="space-y-7" id="enquiry" aria-label="Enquiry form">
      {/* honeypot: invisible to people, irresistible to bots */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Leave this empty<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <div className="grid gap-7 sm:grid-cols-2">
        <label className="block"><span className="eyebrow">First name</span><input name="first" autoComplete="given-name" maxLength={60} className={field} {...a('first')} /><Err id="first" msg={errors.first} /></label>
        <label className="block"><span className="eyebrow">Last name</span><input name="last" autoComplete="family-name" maxLength={60} className={field} {...a('last')} /><Err id="last" msg={errors.last} /></label>
        <label className="block"><span className="eyebrow">Email</span><input type="email" name="email" autoComplete="email" inputMode="email" maxLength={254} className={field} {...a('email')} /><Err id="email" msg={errors.email} /></label>
        <label className="block"><span className="eyebrow">Phone (optional)</span><input type="tel" name="phone" autoComplete="tel" inputMode="tel" maxLength={20} className={field} {...a('phone')} /><Err id="phone" msg={errors.phone} /></label>
      </div>
      <label className="block">
        <span className="eyebrow">What are you planning?</span>
        <select name="type" className={`${field} appearance-none`} defaultValue={ENQUIRY_TYPES[0]} {...a('type')}>
          {ENQUIRY_TYPES.map((t) => <option key={t} className="bg-ink">{t}</option>)}
        </select>
        <Err id="type" msg={errors.type} />
      </label>
      <label className="block">
        <span className="eyebrow">Tell us about your project</span>
        <textarea name="message" rows={5} maxLength={3000} className={field} placeholder="The room, the style, the timeframe…" {...a('message')} />
        <Err id="message" msg={errors.message} />
      </label>
      {spec && (
        <p className="border-l-2 border-brass pl-4 text-sm text-ivory/80">
          <span className="eyebrow block">Your starting point</span>
          {spec}
        </p>
      )}
      <button className="btn btn-solid" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Send enquiry →'}</button>
      {state === 'error' && (
        <p role="alert" className="text-sm text-red-300">
          {Object.keys(errors).length ? 'Please check the highlighted fields.' : `Something went wrong. Please try again, or email ${SITE.email}.`}
        </p>
      )}
      <p className="text-xs text-muted">We’ll only use your details to reply to your enquiry. See our <a href="/privacy" className="link-u">privacy policy</a>.</p>
    </form>
  );
}
