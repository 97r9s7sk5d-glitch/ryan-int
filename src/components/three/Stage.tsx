'use client';

import {useEffect, useMemo, useRef} from 'react';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {ContactShadows, Environment} from '@react-three/drei';
import {Bloom, EffectComposer, N8AO, ToneMapping, Vignette} from '@react-three/postprocessing';
import {ToneMappingMode} from 'postprocessing';
import {tiled, usePBR} from './pbr';

function Floor() {
  const parquet = usePBR('herringbone_parquet');
  const mat = useMemo(() => {
    const size = 30;
    const tile = 1.5;
    const arm = tiled(parquet.arm, size, size, tile);
    return new THREE.MeshPhysicalMaterial({
      color: '#d4c3ae',
      map: tiled(parquet.diff, size, size, tile),
      normalMap: tiled(parquet.nor, size, size, tile),
      normalScale: new THREE.Vector2(0.8, 0.8),
      roughnessMap: arm,
      roughness: 1,
      clearcoat: 0.35,
      clearcoatRoughness: 0.28, // lacquered boards pick up the window
    });
  }, [parquet]);
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, 0, -1.5]} receiveShadow material={mat}>
      <planeGeometry args={[30, 30]} />
    </mesh>
  );
}

/** Photographic lighting (real interior HDRI), parquet floor and a filmic post chain shared by hero + configurator. */
export function Stage({quality}: {quality: 'high' | 'low'}) {
  const high = quality === 'high';
  const {size, viewport} = useThree();
  const composer = useRef<{setSize: (w: number, h: number) => void} | null>(null);
  // The HDRI loads async; once it lands the composer's buffers can be out of sync with the canvas. Re-sync them.
  useEffect(() => {
    const t = [300, 1200, 2500].map((ms) => setTimeout(() => composer.current?.setSize(size.width * viewport.dpr, size.height * viewport.dpr), ms));
    return () => t.forEach(clearTimeout);
  }, [size.width, size.height, viewport.dpr]);
  return (
    <>
      <color attach="background" args={['#0d0e10']} />
      <fog attach="fog" args={['#0d0e10', 10, 22]} />

      {/* real daylight-through-a-window environment — the main source of realistic reflections */}
      <Environment files="/3d/hdr/lebombo_1k.hdr" environmentIntensity={1.0} environmentRotation={[0, Math.PI * 0.55, 0]} />

      {/* key: warm, soft, from the front-right (casts the shaker-door shadow lines on high) */}
      <spotLight
        position={[2.8, 5, 3.8]}
        angle={0.55}
        penumbra={1}
        intensity={high ? 150 : 115}
        color="#fff1de"
        castShadow={high}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0003}
        shadow-radius={5}
        target-position={[0, 0.8, -1]}
      />
      <directionalLight position={[-4, 3, 3]} intensity={0.55} color="#d6e2ff" />
      <ambientLight intensity={0.22} />
      {/* wash the back wall */}
      <spotLight position={[0, 3.6, -0.5]} angle={0.9} penumbra={1} intensity={high ? 16 : 12} color="#ffe3c0" target-position={[0, 1.4, -3.4]} />

      <Floor />
      <ContactShadows position={[0, 0.003, -0.5]} opacity={0.6} scale={8} blur={2.6} far={2.4} resolution={512} />

      <EffectComposer ref={composer as never} multisampling={0} enableNormalPass={false}>
        {high ? <N8AO aoRadius={0.55} distanceFalloff={0.9} intensity={2.6} quality="medium" halfRes /> : <></>}
        <Bloom intensity={0.45} luminanceThreshold={1.1} luminanceSmoothing={0.25} mipmapBlur />
        <ToneMapping mode={ToneMappingMode.NEUTRAL} />
        <Vignette eskil={false} offset={0.25} darkness={0.7} />
      </EffectComposer>
    </>
  );
}
