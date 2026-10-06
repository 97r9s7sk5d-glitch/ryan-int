'use client';

import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

/** Wraps every word (including inside <em>) so it can slide up out of a mask. Returns the inner spans. */
function splitWords(el: HTMLElement) {
  const inners: HTMLElement[] = [];
  const walk = (node: Node) => {
    Array.from(node.childNodes).forEach((c) => {
      if (c.nodeType === 3) {
        const frag = document.createDocumentFragment();
        (c.textContent ?? '').split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) return void frag.append(' ');
          const w = document.createElement('span');
          const i = document.createElement('span');
          w.className = 'w';
          i.className = 'wi';
          i.textContent = part;
          w.append(i);
          frag.append(w);
          inners.push(i);
        });
        c.replaceWith(frag);
      } else if (c.nodeType === 1) walk(c);
    });
  };
  walk(el);
  return inners;
}

/** Scroll-driven motion across the site: word-by-word headings and drifting photography. */
export function ScrollEffects() {
  const path = usePathname();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const restore: (() => void)[] = [];
    const ctx = gsap.context(() => {
      // headings: words rise out of a mask as they enter the viewport
      document.querySelectorAll<HTMLElement>('main h1.display, main h2.display').forEach((h) => {
        if (h.hasAttribute('data-nosplit') || h.closest('.sr-only')) return;
        const original = h.innerHTML;
        const words = splitWords(h);
        restore.push(() => (h.innerHTML = original));
        gsap.fromTo(
          words,
          {yPercent: 115},
          {yPercent: 0, duration: 1.15, ease: 'expo.out', stagger: 0.05, scrollTrigger: {trigger: h, start: 'top 90%', once: true}},
        );
      });

      // photography drifts against the scroll inside its frame
      document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((img) => {
        gsap.fromTo(
          img,
          {yPercent: -7, scale: 1.14},
          {yPercent: 7, scale: 1.14, ease: 'none', scrollTrigger: {trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true}},
        );
      });
    });

    ScrollTrigger.refresh();
    return () => {
      ctx.revert();
      restore.forEach((fn) => fn());
    };
  }, [path]);

  return null;
}
