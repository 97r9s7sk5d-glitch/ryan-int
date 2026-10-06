'use client';

import Link from 'next/link';
import {useEffect, useRef, useState} from 'react';

const ARIA = 'Ryan McGinty Interiors brand reel: kitchens, libraries and furniture, handmade in Malton';

/** Picks the phone or desktop file and starts it. Used by the inline script below and, after client-side navigation, by the effect. */
const PICK = `function(v){if(!v||v.querySelector('source'))return;var k=matchMedia('(max-width:767px)').matches?'portrait':'wide';v.poster='/video/site-'+k+'.jpg';['mp4','webm'].forEach(function(e){var s=document.createElement('source');s.src='/video/site-'+k+'.'+e;s.type='video/'+e;v.appendChild(s)});v.load();var p=v.play();if(p&&p.catch)p.catch(function(){})}`;

// The <video> is plain HTML with an inline script right after it. The script runs while the page is still being parsed,
// so the correct file starts downloading and playing before React has hydrated (no waiting on JavaScript, no wrong-file swap on phones).
const VIDEO_HTML = `<video id="reel-hero" class="absolute inset-0 h-full w-full object-contain" autoplay muted loop playsinline preload="auto" aria-label="${ARIA}"></video><script>(${PICK})(document.getElementById('reel-hero'))</script>`;

/** Landing: the brand reel, full width, autoplaying muted; pauses while scrolled away. */
export function ReelHero() {
  const box = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = box.current;
    const v = el?.querySelector('video');
    if (!el || !v) return;
    // after a client-side navigation the inline script does not run; start the video here instead
    (new Function(`(${PICK})(arguments[0])`) as (v: HTMLVideoElement) => void)(v);

    const sync = () => setPaused(v.paused);
    v.addEventListener('play', sync);
    v.addEventListener('pause', sync);
    sync();

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) v.pause();
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !reduced) v.play().catch(() => {});
        else v.pause();
      },
      {threshold: 0.35},
    );
    io.observe(el);
    return () => {
      io.disconnect();
      v.removeEventListener('play', sync);
      v.removeEventListener('pause', sync);
    };
  }, []);

  return (
    <section aria-label="Brand reel" className="relative bg-ink">
      {/* fetch the right first frame immediately */}
      <link rel="preload" as="image" href="/video/site-wide.jpg" media="(min-width: 768px)" />
      <link rel="preload" as="image" href="/video/site-portrait.jpg" media="(max-width: 767px)" />

      <h1 className="sr-only">Ryan McGinty Interiors: bespoke handmade kitchens, bedrooms and furniture, made in Malton, North Yorkshire</h1>

      <div className="relative aspect-[9/16] max-h-[100svh] w-full md:aspect-video">
        <div ref={box} className="absolute inset-0" suppressHydrationWarning dangerouslySetInnerHTML={{__html: VIDEO_HTML}} />

        {/* keeps the nav legible over bright photos */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/70 to-transparent" />

        {/* only appears if the browser blocks autoplay (e.g. phone in low-power mode) */}
        {paused && (
          <button
            onClick={() => box.current?.querySelector('video')?.play().catch(() => {})}
            aria-label="Play the reel"
            className="group absolute inset-0 grid place-items-center"
          >
            <span className="grid h-24 w-24 place-items-center rounded-full border border-brass bg-ink/50 text-brass-hi backdrop-blur-sm transition-transform duration-500 group-hover:scale-110">
              <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden><path d="M7 4.5v15l13-7.5z" fill="currentColor" /></svg>
            </span>
          </button>
        )}
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
