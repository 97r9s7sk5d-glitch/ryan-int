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

/**
 * Latches true once the element is within `margin` of the viewport, so a heavy 3D scene (and its ~9 MB of
 * textures and lighting) is only fetched when the visitor is about to reach it, not on first load.
 */
export function useNear<T extends HTMLElement>(margin = '900px') {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), {rootMargin: `${margin} 0px`});
    io.observe(el);
    return () => io.disconnect();
  }, [margin, near]);
  return {ref, near};
}

/** Starts 'high' only on capable desktops; the scenes call `degrade()` if the frame rate drops. */
export function useQuality(): ['high' | 'low', () => void] {
  const [q, setQ] = useState<'high' | 'low'>('low');
  useEffect(() => {
    const forced = new URLSearchParams(window.location.search).get('quality');
    if (forced === 'low' || forced === 'high') return setQ(forced);
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const small = window.innerWidth < 900;
    const cores = navigator.hardwareConcurrency || 4;
    let weakGpu = false;
    try {
      const c = document.createElement('canvas');
      const gl = (c.getContext('webgl2') || c.getContext('webgl')) as WebGLRenderingContext | null;
      const ext = gl?.getExtension('WEBGL_debug_renderer_info');
      const name = ext ? String(gl!.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : '';
      weakGpu = /swiftshader|llvmpipe|software|intel\(r\) (hd|uhd) graphics/i.test(name);
    } catch {}
    setQ(!coarse && !small && cores >= 4 && !weakGpu ? 'high' : 'low');
  }, []);
  return [q, () => setQ('low')];
}

export function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}
