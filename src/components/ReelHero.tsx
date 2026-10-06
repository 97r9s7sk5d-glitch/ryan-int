'use client';

import Link from 'next/link';
import {useEffect, useRef, useState} from 'react';

/** Landing: the brand reel, full width. Loads at once, autoplays muted while on screen, pauses when scrolled away. */
export function ReelHero() {
  const box = useRef<HTMLDivElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const [kind, setKind] = useState<'wide' | 'portrait'>('wide');
  const [paused, setPaused] = useState(true);

  useEffect(() => {
    setKind(window.matchMedia('(max-width: 767px)').matches ? 'portrait' : 'wide');
  }, []);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const io = new IntersectionObserver(
      ([e]) => {
        const v = vid.current;
        if (!v) return;
        if (e.isIntersecting && !reduced) v.play().catch(() => {});
        else v.pause();
      },
      {threshold: 0.35},
    );
    io.observe(el);
    return () => io.disconnect();
  }, [kind]);

  const toggle = () => {
    const v = vid.current;
    if (v) v.paused ? v.play().catch(() => {}) : v.pause();
  };
  const fullscreen = () => {
    const v = vid.current as (HTMLVideoElement & {webkitEnterFullscreen?: () => void}) | null;
    if (!v) return;
    if (v.requestFullscreen) v.requestFullscreen().catch(() => {});
    else v.webkitEnterFullscreen?.(); // iOS Safari
  };

  return (
    <section aria-label="Brand reel" className="relative bg-ink">
      <h1 className="sr-only">Ryan McGinty Interiors: bespoke handmade kitchens, bedrooms and furniture, made in Malton, North Yorkshire</h1>

      <div ref={box} className="relative aspect-[9/16] max-h-[100svh] w-full md:aspect-video">
        <video
          ref={vid}
          key={kind}
          className="absolute inset-0 h-full w-full object-contain"
          poster={`/video/reel-${kind}.jpg`}
          muted
          loop
          playsInline
          preload="auto"
          aria-label="Ryan McGinty Interiors brand reel: kitchens, libraries and furniture, handmade in Malton"
          onPlay={() => setPaused(false)}
          onPause={() => setPaused(true)}
        >
          <source src={`/video/reel-${kind}.mp4`} type="video/mp4" />
          <source src={`/video/reel-${kind}.webm`} type="video/webm" />
        </video>

        {/* keeps the nav legible over bright photos */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/70 to-transparent" />

        {paused && (
          <button onClick={toggle} aria-label="Play the reel" className="group absolute inset-0 grid place-items-center">
            <span className="grid h-24 w-24 place-items-center rounded-full border border-brass bg-ink/50 text-brass-hi backdrop-blur-sm transition-transform duration-500 group-hover:scale-110">
              <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden><path d="M7 4.5v15l13-7.5z" fill="currentColor" /></svg>
            </span>
          </button>
        )}
        <div className="absolute bottom-4 right-4 flex gap-2">
          {!paused && <button onClick={toggle} className="bg-ink/60 px-4 py-2 text-[0.65rem] uppercase tracking-[0.24em] backdrop-blur-sm transition-colors hover:text-brass-hi">Pause</button>}
          <button onClick={fullscreen} className="bg-ink/60 px-4 py-2 text-[0.65rem] uppercase tracking-[0.24em] backdrop-blur-sm transition-colors hover:text-brass-hi">Full screen</button>
        </div>
      </div>

      <div className="wrap flex flex-col items-center justify-between gap-6 py-8 sm:flex-row">
        <p className="eyebrow text-center sm:text-left">Bespoke kitchens · Bedrooms · Libraries · Furniture</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/gallery" className="btn btn-solid">View our work</Link>
          <a href="#design" className="btn">Design yours</a>
          <Link href="/contact" className="btn max-sm:hidden">Request a quote</Link>
        </div>
      </div>
    </section>
  );
}
