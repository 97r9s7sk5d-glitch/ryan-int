'use client';

import {useEffect, useRef, type CSSProperties, type ReactNode} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

/** Fades + lifts content in as it enters the viewport. */
export function Reveal({
  children,
  delay = 0,
  y = 36,
  className = '',
  as: Tag = 'div',
  style,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'section' | 'li' | 'p' | 'h2' | 'h3' | 'article';
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const tween = gsap.fromTo(
      el,
      {autoAlpha: 0, y},
      {autoAlpha: 1, y: 0, duration: 1.2, delay, ease: 'power3.out', scrollTrigger: {trigger: el, start: 'top 88%', once: true}},
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay, y]);
  const T = Tag as 'div';
  return (
    <T ref={ref as React.RefObject<HTMLDivElement>} className={className} style={style}>
      {children}
    </T>
  );
}

/** Image that is clip-revealed and drifts slightly on scroll. */
export function ParallaxImage({
  src,
  alt,
  className = '',
  ratio = '4 / 5',
  amount = 12,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  ratio?: string;
  amount?: number;
  priority?: boolean;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const w = wrap.current, i = img.current;
    if (!w || !i) return;
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(w, {clipPath: 'inset(12% 0% 12% 0%)'}, {
        clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.out',
        scrollTrigger: {trigger: w, start: 'top 90%', once: true},
      });
      gsap.fromTo(i, {yPercent: -amount, scale: 1.18}, {
        yPercent: amount, scale: 1.18, ease: 'none',
        scrollTrigger: {trigger: w, start: 'top bottom', end: 'bottom top', scrub: true},
      });
    }, w);
    return () => ctx.revert();
  }, [amount]);
  return (
    <div ref={wrap} className={`img-wrap ${className}`} style={{aspectRatio: ratio}}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={img} src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} decoding="async" className="grade" />
    </div>
  );
}
