'use client';

import {useEffect, useState} from 'react';
import {Canvas} from '@react-three/fiber';
import {OrbitControls, PerformanceMonitor} from '@react-three/drei';
import {Kitchen} from './Kitchen';
import {Stage} from './Stage';
import {hasWebGL, useQuality, useVisible} from './useVisible';
import type {Spec} from '@/lib/palette';

export default function ConfiguratorScene({spec}: {spec: Spec}) {
  const {ref, visible} = useVisible<HTMLDivElement>();
  const [quality, degrade] = useQuality();
  const [ok, setOk] = useState(true);
  useEffect(() => setOk(hasWebGL()), []);
  if (!ok) return <div ref={ref} className="absolute inset-0 grid place-items-center text-muted">3D preview needs WebGL.</div>;
  return (
    <div ref={ref} className="absolute inset-0 cursor-grab active:cursor-grabbing">
      <Canvas
        shadows={quality === 'high'}
        dpr={[1, quality === 'high' ? 1.75 : 1.25]}
        frameloop={visible ? 'always' : 'never'}
        camera={{position: [2.4, 1.5, 3.4], fov: 34, near: 0.1, far: 40}}
        gl={{antialias: false, powerPreference: 'high-performance'}}
      >
        <PerformanceMonitor onDecline={degrade} flipflops={2} />
        <Stage quality={quality} />
        <Kitchen spec={spec} />
        <OrbitControls
          target={[0, 0.85, -0.7]}
          enablePan={false}
          enableDamping
          dampingFactor={0.07}
          minDistance={1.6}
          maxDistance={6}
          minPolarAngle={0.9}
          maxPolarAngle={1.52}
          minAzimuthAngle={-1.1}
          maxAzimuthAngle={1.1}
        />
      </Canvas>
    </div>
  );
}
