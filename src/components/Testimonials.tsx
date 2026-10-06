'use client';

import {useEffect, useState} from 'react';
import {TESTIMONIALS} from '@/lib/content';
import {Reveal} from './Reveal';

export function Testimonials() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI((n) => (n + 1) % TESTIMONIALS.length), 8000);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <section className="relative overflow-hidden bg-coal py-28 lg:py-44" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <span aria-hidden className="display pointer-events-none absolute -left-4 -top-10 select-none text-[28rem] leading-none text-brass/10">“</span>
      <div className="wrap relative">
        <Reveal><p className="eyebrow mb-10">What people say</p></Reveal>
        <div className="relative min-h-[22rem] sm:min-h-[19rem]">
          {TESTIMONIALS.map((t, n) => (
            <figure
              key={t.who}
              aria-hidden={n !== i}
              className={`absolute inset-0 transition-all duration-[1100ms] ease-[var(--ease-lux)] ${n === i ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'}`}
            >
              <blockquote className="display max-w-5xl text-[1.7rem] leading-[1.18] sm:text-4xl lg:text-[3.2rem]">“{t.quote}”</blockquote>
              <figcaption className="mt-8 text-sm uppercase tracking-[0.22em] text-muted">
                <span className="text-ivory">{t.who}</span>{t.where && <> — {t.where}</>}
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-6 flex gap-3">
          {TESTIMONIALS.map((t, n) => (
            <button key={t.who} onClick={() => setI(n)} aria-label={`Testimonial ${n + 1}`} className="group py-3">
              <span className={`block h-px transition-all duration-700 ${n === i ? 'w-14 bg-brass' : 'w-6 bg-white/25 group-hover:bg-white/60'}`} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
