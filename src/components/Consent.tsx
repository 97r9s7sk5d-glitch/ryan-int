'use client';

import Link from 'next/link';
import {useEffect, useState} from 'react';

const KEY = 'rm-consent';
type Choice = 'granted' | 'denied' | null;

const read = (): Choice => {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    return null;
  }
};

/** Privacy-friendly analytics (Vercel Web Analytics: no cookies, no cross-site tracking) load only after "Accept". */
function loadAnalytics() {
  if (document.querySelector('script[data-rm-analytics]')) return;
  const w = window as unknown as {va?: (...a: unknown[]) => void; vaq?: unknown[]};
  w.va = w.va || ((...a: unknown[]) => (w.vaq = w.vaq || []).push(a));
  for (const src of ['/_vercel/insights/script.js', '/_vercel/speed-insights/script.js']) {
    const s = document.createElement('script');
    s.defer = true;
    s.src = src;
    s.dataset.rmAnalytics = '';
    document.head.appendChild(s);
  }
}

export function Consent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const c = read();
    if (c === 'granted') loadAnalytics();
    setOpen(c === null);
    const reopen = () => setOpen(true);
    window.addEventListener('rm-cookie-settings', reopen);
    return () => window.removeEventListener('rm-cookie-settings', reopen);
  }, []);

  const choose = (c: 'granted' | 'denied') => {
    try {
      localStorage.setItem(KEY, c);
    } catch {}
    if (c === 'granted') loadAnalytics();
    setOpen(false);
  };

  if (!open) return null;
  return (
    <div
      id="consent"
      role="dialog"
      aria-label="Cookie and analytics preferences"
      className="fixed inset-x-3 bottom-3 z-[100] max-w-md border border-line bg-ink/95 p-5 shadow-2xl shadow-black/60 backdrop-blur-xl sm:inset-x-auto sm:bottom-6 sm:left-6"
    >
      <p className="text-sm text-ivory/90">
        We’d like to count visits and page speed with privacy-friendly analytics. It sets no tracking cookies and never identifies you. Your choice is remembered on this device.{' '}
        <Link href="/privacy#cookies" className="link-u text-brass-hi">Find out more</Link>
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button onClick={() => choose('granted')} className="btn btn-solid !px-5 !py-3">Accept</button>
        <button onClick={() => choose('denied')} className="btn !px-5 !py-3">Decline</button>
      </div>
    </div>
  );
}

export function CookieSettingsLink({className}: {className?: string}) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event('rm-cookie-settings'))}>
      Cookie settings
    </button>
  );
}
