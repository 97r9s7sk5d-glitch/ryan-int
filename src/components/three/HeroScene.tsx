'use client';

import {useEffect, useMemo, useRef, useState} from 'react';
import {PerformanceMonitor} from '@react-three/drei';
import {Canvas, useFrame, useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {Kitchen} from './Kitchen';
import {Stage} from './Stage';
import {hasWebGL, useQuality, useVisible} from './useVisible';
import {preloadCore} from './pbr';
import {PAINTS, type Spec} from '@/lib/palette';

const CYCLE = ['Bold Teal', 'Stone', 'Midnight', 'Sage', 'Deep Slate'];
const SEQUENCE = CYCLE.map((n) => PAINTS.find((p) => p.name === n)!);

function Rig({reduced}: {reduced: boolean}) {
  const {camera, pointer} = useThree();
  const look = useMemo(() => new THREE.Vector3(0, 0.95, -0.6), []);
  const cur = useMemo(() => new THREE.Vector3(0, 1.5, 6.4), []);
  useFrame((state, dt) => {
    const sy = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
    const t = state.clock.elapsedTime;
    const drift = reduced ? 0 : 1;
    // dolly in + down + slightly right as the user scrolls through the hero
    const wide = window.innerWidth >= 1024;
    const narrow = window.innerWidth / window.innerHeight < 0.8; // portrait phones: park the scene in the top half
    const shift = wide ? -0.85 : 0; // push the island to the right of the headline on desktop
    const tx = THREE.MathUtils.lerp(shift * 0.6, 1.0, sy) + pointer.x * 0.35 * drift + Math.sin(t * 0.18) * 0.25 * drift;
    const ty = THREE.MathUtils.lerp(narrow ? 1.8 : 1.45, 1.05, sy) + pointer.y * 0.12 * drift;
    const tz = THREE.MathUtils.lerp(wide ? 5.3 : narrow ? 10.5 : 7.2, 2.8, sy);
    cur.x += (tx - cur.x) * (1 - Math.exp(-dt * 2.5));
    cur.y += (ty - cur.y) * (1 - Math.exp(-dt * 2.5));
    cur.z += (tz - cur.z) * (1 - Math.exp(-dt * 2.5));
    camera.position.copy(cur);
    look.set(THREE.MathUtils.lerp(shift, 0.45, sy), THREE.MathUtils.lerp(narrow ? -0.45 : 0.85, 0.8, sy), -0.6);
    camera.lookAt(look);
  });
  return null;
}

export default function HeroScene({onPaint, onReady}: {onPaint?: (name: string) => void; onReady?: () => void}) {
  const {ref, visible} = useVisible<HTMLDivElement>();
  const [quality, degrade] = useQuality();
  const [i, setI] = useState(0);
  const [ok, setOk] = useState(true);
  const reduced = useMemo(
    () => (typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false),
    [],
  );

  useEffect(() => setOk(hasWebGL()), []);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setI((n) => (n + 1) % SEQUENCE.length), 5200);
    return () => clearInterval(id);
  }, [reduced]);
  useEffect(() => onPaint?.(SEQUENCE[i].name), [i, onPaint]);

  const spec: Spec = {paint: SEQUENCE[i].hex, hardware: 'brass', top: 'marble', style: 'shaker'};
  const [gl, setGl] = useState(false);
  const [tex, setTex] = useState(false);
  useEffect(() => {
    preloadCore().then(() => setTex(true), () => setTex(true)); // never block the reveal on a failed texture
  }, []);
  // reveal the 3D only once the scene AND its scanned materials are ready, so nothing pops in
  useEffect(() => {
    if (gl && tex) onReady?.();
  }, [gl, tex, onReady]);

  if (!ok) return <div ref={ref} className="absolute inset-0" />;
  return (
    <div ref={ref} className="absolute inset-0">
      <Canvas
        shadows={quality === 'high'}
        dpr={[1, quality === 'high' ? 1.75 : 1.25]}
        frameloop={visible ? 'always' : 'never'}
        camera={{position: [0, 1.45, 5.6], fov: 32, near: 0.1, far: 40}}
        gl={{antialias: false, powerPreference: 'high-performance'}}
        onCreated={() => setGl(true)}
      >
        <PerformanceMonitor onDecline={degrade} flipflops={2} />
        <Stage quality={quality} />
        <Kitchen spec={spec} />
        <Rig reduced={reduced} />
      </Canvas>
    </div>
  );
}
