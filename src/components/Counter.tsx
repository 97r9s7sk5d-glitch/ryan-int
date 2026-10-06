'use client';

import {useEffect, useRef, useState} from 'react';

export function Counter({to, suffix = '', label}: {to: number; suffix?: string; label: string}) {
  const ref = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(to);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setN(0);
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (t: number) => {
        const p = Math.min(1, (t - t0) / 1800);
        setN(Math.round(to * (1 - Math.pow(1 - p, 4))));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return (
    <div ref={ref}>
      <p className="display text-5xl text-[#8a6a37] sm:text-6xl">{n}{suffix}</p>
      <p className="mt-2 text-[0.68rem] uppercase tracking-[0.2em] text-[#6b665c]">{label}</p>
    </div>
  );
}
