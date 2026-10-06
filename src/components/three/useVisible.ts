'use client';
import {useEffect, useRef, useState} from 'react';

/** True while the element is on screen — lets us pause the WebGL loop off-screen. */
export function useVisible<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {rootMargin: '120px'});
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return {ref, visible};
}

export function useQuality(): 'high' | 'low' {
  const [q, setQ] = useState<'high' | 'low'>('low');
  useEffect(() => {
    const forced = new URLSearchParams(window.location.search).get('quality');
    if (forced === 'low' || forced === 'high') return setQ(forced);
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const small = window.innerWidth < 900;
    const cores = navigator.hardwareConcurrency || 4;
    setQ(!coarse && !small && cores >= 4 ? 'high' : 'low');
  }, []);
  return q;
}

export function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}
