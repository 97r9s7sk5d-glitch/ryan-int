'use client';

import Link from 'next/link';
import {useEffect, useRef, useState} from 'react';
import gsap from 'gsap';

const ARIA = 'Ryan McGinty Interiors brand reel: kitchens, libraries and furniture, handmade in Malton';
/** The opening logo + headline end here; the intro hands over to the page at this point in the reel. */
const INTRO_UNTIL = 6.4;

/** Picks the phone or desktop file and starts it. Used by the inline script below and, after client-side navigation, by the effect. */
const PICK = `function(v){if(!v||v.querySelector('source'))return;var k=matchMedia('(max-width:767px)').matches?'portrait':'wide';v.poster='/video/site-'+k+'.jpg';['mp4','webm'].forEach(function(e){var s=document.createElement('source');s.src='/video/site-'+k+'.'+e;s.type='video/'+e;v.appendChild(s)});v.load();var p=v.play();if(p&&p.catch)p.catch(function(){})}`;

// The <video> is plain HTML with an inline script right after it. The script runs while the page is still being parsed,
// so the correct file starts downloading and playing before React has hydrated.
const VIDEO_HTML = `<video id="reel-hero" class="absolute inset-0 h-full w-full" autoplay muted loop playsinline preload="auto" aria-label="${ARIA}"></video><script>(${PICK})(document.getElementById('reel-hero'))</script>`;

/**
 * Landing. First visit of a session: the reel fills the screen for its opening (logo + headline), then shrinks into
 * its place on the page while the site opens around it. Afterwards (or on any later visit) it simply plays in place.
 */
export function ReelHero() {
  const holder = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const finishIntro = useRef<(() => void) | null>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = box.current;
    const v = el?.querySelector('video');
    const html = document.documentElement;
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
        if (html.dataset.intro === '1') return; // intro is playing full screen
        if (e.isIntersecting && !reduced) v.play().catch(() => {});
        else v.pause();
      },
      {threshold: 0.35},
    );
    io.observe(el);

    // ---- first-visit intro ----
    let timer = 0;
    let done = false;
    if (html.dataset.intro === '1') {
      window.__lenis?.stop();
      const end = () => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        const s = stage.current;
        const h = holder.current;
        const release = () => {
          s?.removeAttribute('style');
          html.removeAttribute('data-intro');
          html.style.overflow = '';
          window.__lenis?.start();
          try {
            sessionStorage.setItem('rm-intro', '1');
          } catch {}
        };
        if (!s || !h) return release();
        const r = h.getBoundingClientRect();
        // the stage is position:fixed (CSS); animate its box back to where the page keeps the reel
        gsap.to(s, {top: r.top, left: r.left, width: r.width, height: r.height, duration: 1.3, ease: 'expo.inOut', onComplete: release});
      };
      finishIntro.current = end;
      v.addEventListener('timeupdate', () => v.currentTime >= INTRO_UNTIL && end());
      timer = window.setTimeout(end, 9000); // never trap a visitor if the video cannot play
    }

    return () => {
      clearTimeout(timer);
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

      {/* reserves the reel's place in the page; the stage inside it is the thing that animates */}
      <div ref={holder} className="relative aspect-[9/16] max-h-[100svh] w-full md:aspect-video">
        <div id="reel-stage" ref={stage} className="absolute inset-0 bg-ink">
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
      </div>

      {/* shown only while the intro is playing (CSS keys off <html data-intro>) */}
      <button
        onClick={() => finishIntro.current?.()}
        className="intro-skip fixed bottom-6 right-6 z-[95] bg-ink/60 px-5 py-3 text-[0.65rem] uppercase tracking-[0.26em] backdrop-blur-sm transition-colors hover:text-brass-hi sm:bottom-8 sm:right-8"
      >
        Skip intro →
      </button>

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
