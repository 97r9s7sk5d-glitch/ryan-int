'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import {useEffect, useRef, useState} from 'react';
import gsap from 'gsap';
import {full} from '@/lib/content';

const HeroScene = dynamic(() => import('./three/HeroScene'), {ssr: false});

export function Hero({poster}: {poster: string}) {
  const [paint, setPaint] = useState('Bold Teal');
  const [ready, setReady] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.from('[data-line]', {yPercent: 110, duration: 1.5, ease: 'expo.out', stagger: 0.12, delay: 0.25});
      gsap.from('[data-fade]', {autoAlpha: 0, y: 24, duration: 1.2, ease: 'power3.out', stagger: 0.1, delay: 0.9});
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="showroom" className="relative h-[92svh] min-h-[620px] w-full overflow-hidden bg-ink">
      {/* poster: real photography until WebGL is ready (and as the no-WebGL fallback) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={full(poster)}
        alt="Hand-painted shaker kitchen island with marble-vein worktop by Ryan McGinty Interiors"
        className={`absolute inset-0 h-full w-full object-cover grade transition-opacity duration-[1600ms] ${ready ? 'opacity-0' : 'opacity-60'}`}
        fetchPriority="high"
      />
      <div className={`absolute inset-0 transition-opacity duration-[1600ms] ${ready ? 'opacity-100' : 'opacity-0'}`}>
        <HeroScene onPaint={setPaint} onReady={() => setReady(true)} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgb(10_11_12/0.1),rgb(10_11_12/0.65)_75%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink via-ink/60 to-transparent" />

      <div className="wrap pointer-events-none relative z-10 flex h-full flex-col justify-end pb-14 sm:pb-20">
        <p data-fade className="eyebrow mb-6">Step inside the showroom</p>
        <h2 data-nosplit className="display max-w-5xl text-[clamp(3.2rem,8.2vw,8rem)]">
          <span className="block overflow-hidden"><span data-line className="block">Every finish,</span></span>
          <span className="block overflow-hidden"><span data-line className="block italic text-brass-hi">chosen with you.</span></span>
        </h2>
        <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div data-fade className="max-w-md">
            <p className="text-lg text-ivory/85">Hand-painted shaker, marble and oak, watch the room change, then design your own below.</p>
            <div className="pointer-events-auto mt-7 flex flex-wrap gap-4">
              <Link href="/contact" className="btn btn-solid">Request a quote</Link>
              <a href="#design" className="link-u self-center py-3 text-[0.74rem] uppercase tracking-[0.24em]">Design yours ↓</a>
            </div>
          </div>
          <div data-fade className="hidden items-center gap-5 text-[0.68rem] uppercase tracking-[0.28em] text-ivory/70 sm:flex">
            <span className="h-px w-12 bg-brass" />
            <span>Now showing · <span className="text-brass-hi">{paint}</span> · Aged brass</span>
          </div>
        </div>
      </div>
      <a href="#design" aria-label="Scroll to the design studio" className="absolute bottom-6 right-6 z-10 hidden text-[0.62rem] uppercase tracking-[0.3em] text-ivory/60 [writing-mode:vertical-rl] lg:block">
        Scroll
      </a>
    </section>
  );
}
