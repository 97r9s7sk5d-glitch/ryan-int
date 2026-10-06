'use client';

import Link from 'next/link';
import {useEffect, useRef, useState} from 'react';
import gsap from 'gsap';

const ARIA = 'Ryan McGinty Interiors brand reel: kitchens, libraries and furniture, handmade in Malton';
/** Where in the reel the page picks up after the intro (the headline scene; the intro already showed the logo). */
const RESUME_AT = 2.5;

/**
 * v = the landing reel, i = the first-visit intro video. Picks the phone or desktop files and starts them.
 * Used by the inline script below (runs while the page parses) and, after client-side navigation, by the effect.
 */
const PICK = `function(v,i){var h=document.documentElement,k=matchMedia('(max-width:767px)').matches?'portrait':'wide',intro=h.getAttribute('data-intro')==='1';function src(el,n){['mp4','webm'].forEach(function(e){var s=document.createElement('source');s.src='/video/'+n+'-'+k+'.'+e;s.type='video/'+e;el.appendChild(s)});el.poster='/video/'+n+'-'+k+'.jpg';el.load()}if(v&&!v.querySelector('source')){if(intro){v.removeAttribute('autoplay');v.pause()}src(v,'site');if(intro){v.addEventListener('loadedmetadata',function(){try{v.currentTime=${RESUME_AT}}catch(e){}})}else{var p=v.play();if(p&&p.catch)p.catch(function(){})}}if(i){if(intro&&!i.querySelector('source')){src(i,'intro');var q=i.play();if(q&&q.catch)q.catch(function(){})}else if(!intro){i.remove()}}}`;

// The videos are plain HTML with an inline script right after them. The script runs while the page is still being parsed,
// so the correct files start downloading and playing before React has hydrated.
const VIDEO_HTML = `<video id="reel-hero" class="absolute inset-0 h-full w-full" ${'loop'} muted playsinline preload="auto" autoplay aria-label="${ARIA}"></video><video id="intro-vid" class="absolute inset-0 h-full w-full" muted playsinline preload="auto" aria-hidden="true"></video><script>(${PICK})(document.getElementById('reel-hero'),document.getElementById('intro-vid'))</script>`;

/**
 * Landing. First visit of a session: an opening sequence (logo + camera moves through Ryan's rooms) fills the screen,
 * then shrinks into the reel's place on the page while the reel picks up at its headline. Afterwards, or on any later
 * visit, the reel just plays in place.
 */
export function ReelHero() {
  const holder = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const finishIntro = useRef<(() => void) | null>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = box.current;
    const v = el?.querySelector<HTMLVideoElement>('#reel-hero');
    const html = document.documentElement;
    if (!el || !v) return;
    // after a client-side navigation the inline script does not run; start the reel here instead
    (new Function(`(${PICK})(arguments[0],null)`) as (v: HTMLVideoElement) => void)(v);

    const sync = () => setPaused(v.paused && html.dataset.intro !== '1');
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
    const iv = el.querySelector<HTMLVideoElement>('#intro-vid');
    if (html.dataset.intro === '1' && iv) {
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
          setPaused(v.paused);
          try {
            sessionStorage.setItem('rm-intro', '1');
          } catch {}
        };
        // hand over: the reel picks up at its headline while the opening fades away
        try {
          v.currentTime = RESUME_AT;
        } catch {}
        v.play().catch(() => {});
        gsap.to(iv, {opacity: 0, duration: 0.9, delay: 0.2, ease: 'power2.out', onComplete: () => iv.remove()});
        if (!s || !h) return release();
        const r = h.getBoundingClientRect();
        // the stage is position:fixed (CSS); animate its box back to where the page keeps the reel
        gsap.to(s, {top: r.top, left: r.left, width: r.width, height: r.height, duration: 1.3, ease: 'expo.inOut', onComplete: release});
      };
      finishIntro.current = end;
      iv.addEventListener('ended', end);
      iv.addEventListener('error', end);
      timer = window.setTimeout(end, 16000); // never trap a visitor if the video cannot play
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
              onClick={() => box.current?.querySelector<HTMLVideoElement>('#reel-hero')?.play().catch(() => {})}
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
