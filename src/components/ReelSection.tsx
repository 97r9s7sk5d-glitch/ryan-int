'use client';

import {useEffect, useRef, useState} from 'react';
import {Reveal} from './Reveal';

/** The brand reel as a cinematic band: loads when close, autoplays muted while on screen, pauses off screen. */
export function ReelSection() {
  const box = useRef<HTMLDivElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const [kind, setKind] = useState<'wide' | 'portrait'>('wide');
  const [near, setNear] = useState(false);
  const [paused, setPaused] = useState(true);

  useEffect(() => {
    setKind(window.matchMedia('(max-width: 767px)').matches ? 'portrait' : 'wide');
  }, []);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const load = new IntersectionObserver(([e]) => e.isIntersecting && (setNear(true), load.disconnect()), {rootMargin: '400px'});
    const watch = new IntersectionObserver(
      ([e]) => {
        const v = vid.current;
        if (!v) return;
        if (e.isIntersecting && !reduced) v.play().catch(() => {});
        else v.pause();
      },
      {threshold: 0.4},
    );
    load.observe(el);
    watch.observe(el);
    return () => {
      load.disconnect();
      watch.disconnect();
    };
  }, []);

  const toggle = () => {
    const v = vid.current;
    if (!v) return;
    v.paused ? v.play().catch(() => {}) : v.pause();
  };
  const fullscreen = () => {
    const v = vid.current as (HTMLVideoElement & {webkitEnterFullscreen?: () => void}) | null;
    if (!v) return;
    if (v.requestFullscreen) v.requestFullscreen().catch(() => {});
    else v.webkitEnterFullscreen?.(); // iOS Safari
  };

  return (
    <section className="relative bg-ink py-24 lg:py-36">
      <div className="wrap">
        <div className="mb-12 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <Reveal>
            <p className="eyebrow mb-5">Watch</p>
            <h2 className="display text-5xl sm:text-6xl lg:text-7xl">See the work, <em className="italic text-brass-hi">in motion.</em></h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-md text-muted">Thirty seconds from the workshop in Malton: hand-painted kitchens, brass-and-oak libraries and the details that make them.</p>
          </Reveal>
        </div>

        <Reveal>
          <div ref={box} className="group relative mx-auto aspect-[9/16] max-h-[82svh] overflow-hidden bg-slate md:aspect-video md:max-h-none">
            <video
              ref={vid}
              key={kind}
              className="absolute inset-0 h-full w-full object-cover"
              poster={`/video/reel-${kind}.jpg`}
              muted
              loop
              playsInline
              preload="none"
              aria-label="Ryan McGinty Interiors brand reel: kitchens, libraries and furniture, handmade in Malton"
              onPlay={() => setPaused(false)}
              onPause={() => setPaused(true)}
            >
              {near && (
                <>
                  <source src={`/video/reel-${kind}.mp4`} type="video/mp4" />
                  <source src={`/video/reel-${kind}.webm`} type="video/webm" />
                </>
              )}
            </video>
            {paused && (
              <button onClick={toggle} aria-label="Play the reel" className="absolute inset-0 grid place-items-center bg-ink/20 transition-colors hover:bg-ink/10">
                <span className="grid h-24 w-24 place-items-center rounded-full border border-brass bg-ink/50 text-brass-hi backdrop-blur-sm transition-transform duration-500 group-hover:scale-110">
                  <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden><path d="M7 4.5v15l13-7.5z" fill="currentColor" /></svg>
                </span>
              </button>
            )}
            <div className="absolute bottom-4 right-4 flex gap-2">
              {!paused && (
                <button onClick={toggle} className="bg-ink/60 px-4 py-2 text-[0.65rem] uppercase tracking-[0.24em] backdrop-blur-sm transition-colors hover:text-brass-hi">Pause</button>
              )}
              <button onClick={fullscreen} className="bg-ink/60 px-4 py-2 text-[0.65rem] uppercase tracking-[0.24em] backdrop-blur-sm transition-colors hover:text-brass-hi">Full screen</button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
