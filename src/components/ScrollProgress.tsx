'use client';

import {useEffect, useRef} from 'react';

/** A thin brass line along the top edge that fills as the page is read. */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      el.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    };
    const on = () => raf || (raf = requestAnimationFrame(update));
    update();
    window.addEventListener('scroll', on, {passive: true});
    window.addEventListener('resize', on);
    return () => {
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
      cancelAnimationFrame(raf);
    };
  }, []);
  return <div ref={bar} aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[84] h-[2px] origin-left scale-x-0 bg-brass" />;
}
