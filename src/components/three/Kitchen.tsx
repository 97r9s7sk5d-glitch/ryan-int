'use client';

import {useMemo, useRef} from 'react';
import * as THREE from 'three';
import {useFrame} from '@react-three/fiber';
import type {Spec} from '@/lib/palette';
import {marbleTexture, oakTexture, stoneTexture} from './textures';

const T = 0.022; // door thickness

function useMaterials(spec: Spec) {
  const marble = useMemo(() => marbleTexture(), []);
  const stone = useMemo(() => stoneTexture(), []);
  const oak = useMemo(() => oakTexture(), []);

  const paint = useMemo(
    () => new THREE.MeshPhysicalMaterial({color: spec.paint, roughness: 0.52, clearcoat: 0.22, clearcoatRoughness: 0.55}),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const panel = useMemo(() => paint.clone(), [paint]);
  const target = useRef(new THREE.Color(spec.paint));
  target.current.set(spec.paint);

  const hw = useMemo(() => {
    switch (spec.hardware) {
      case 'brass':
        return new THREE.MeshStandardMaterial({color: '#b08a4e', metalness: 1, roughness: 0.3});
      case 'nickel':
        return new THREE.MeshStandardMaterial({color: '#cfcfd2', metalness: 1, roughness: 0.22});
      case 'black':
        return new THREE.MeshStandardMaterial({color: '#141414', metalness: 0.6, roughness: 0.45});
      case 'oak':
        return new THREE.MeshStandardMaterial({map: oak, roughness: 0.55, metalness: 0});
    }
  }, [spec.hardware, oak]);

  const top = useMemo(() => {
    if (spec.top === 'marble') return new THREE.MeshPhysicalMaterial({map: marble, color: '#d6d3cd', roughness: 0.22, clearcoat: 0.35, clearcoatRoughness: 0.2});
    if (spec.top === 'slate') return new THREE.MeshPhysicalMaterial({map: stone, roughness: 0.28, clearcoat: 0.3, color: '#bbbbbb'});
    return new THREE.MeshStandardMaterial({map: oak, roughness: 0.5});
  }, [spec.top, marble, stone, oak]);

  const dark = useMemo(() => new THREE.MeshStandardMaterial({color: '#0e0e10', roughness: 0.7}), []);
  const wall = useMemo(() => new THREE.MeshStandardMaterial({color: '#2b2d31', roughness: 0.9}), []);
  const splash = useMemo(() => new THREE.MeshPhysicalMaterial({map: marble, color: '#c9c9cc', roughness: 0.3, clearcoat: 0.2}), [marble]);

  useFrame((_, dt) => {
    paint.color.lerp(target.current, 1 - Math.exp(-dt * 5));
    panel.color.copy(paint.color).multiplyScalar(0.8);
  });

  return {paint, panel, hw, top, dark, wall, splash};
}

type Mats = ReturnType<typeof useMaterials>;

const knobGeo = (() => {
  const pts = [
    [0, 0], [0.013, 0], [0.013, 0.005], [0.008, 0.011], [0.016, 0.019], [0.021, 0.027], [0.018, 0.038], [0.01, 0.045], [0, 0.047],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const g = new THREE.LatheGeometry(pts, 28);
  g.rotateX(Math.PI / 2);
  return g;
})();

function Hardware({m, style, w, h, x, y, drawer}: {m: Mats; style: Spec['style']; w: number; h: number; x: number; y: number; drawer?: boolean}) {
  if (style === 'slab') {
    // vertical/horizontal bar handle
    const horizontal = !!drawer || w > h;
    const len = Math.min(0.2, (horizontal ? w : h) * 0.5);
    return (
      <group position={[x, y, T / 2]}>
        <mesh material={m.hw} rotation-z={horizontal ? Math.PI / 2 : 0} position-z={0.022} castShadow>
          <cylinderGeometry args={[0.0075, 0.0075, len, 16]} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} material={m.hw} rotation-x={Math.PI / 2} position={horizontal ? [s * len * 0.4, 0, 0.011] : [0, s * len * 0.4, 0.011]}>
            <cylinderGeometry args={[0.005, 0.005, 0.022, 10]} />
          </mesh>
        ))}
      </group>
    );
  }
  return <mesh geometry={knobGeo} material={m.hw} position={[x, y, T / 2]} castShadow />;
}

function Door({m, w, h, x, y, z = 0, style, knob = 'tl', drawer}: {
  m: Mats; w: number; h: number; x: number; y: number; z?: number; style: Spec['style']; knob?: 'tl' | 'tr' | 'bl' | 'br' | 'c' | 'none'; drawer?: boolean;
}) {
  const s = drawer ? 0.05 : 0.07;
  const strips = useMemo(() => {
    const n = Math.max(3, Math.floor(w / 0.026));
    return Array.from({length: n}, (_, i) => -w / 2 + (i + 0.5) * (w / n));
  }, [w]);

  // knob position
  const inset = Math.min(0.07, w / 2 - 0.03);
  const kx = knob === 'tl' || knob === 'bl' ? -w / 2 + inset : knob === 'tr' || knob === 'br' ? w / 2 - inset : 0;
  const ky = knob === 'tl' || knob === 'tr' ? h / 2 - 0.08 : knob === 'bl' || knob === 'br' ? -h / 2 + 0.08 : 0;

  return (
    <group position={[x, y, z + T / 2]}>
      {style === 'shaker' ? (
        <>
          <mesh material={m.paint} position={[0, h / 2 - s / 2, 0]} castShadow receiveShadow><boxGeometry args={[w, s, T]} /></mesh>
          <mesh material={m.paint} position={[0, -h / 2 + s / 2, 0]} castShadow receiveShadow><boxGeometry args={[w, s, T]} /></mesh>
          <mesh material={m.paint} position={[-w / 2 + s / 2, 0, 0]} castShadow receiveShadow><boxGeometry args={[s, h - 2 * s, T]} /></mesh>
          <mesh material={m.paint} position={[w / 2 - s / 2, 0, 0]} castShadow receiveShadow><boxGeometry args={[s, h - 2 * s, T]} /></mesh>
          <mesh material={m.panel} position={[0, 0, -T / 2 + 0.004]} receiveShadow><boxGeometry args={[w - 2 * s + 0.012, h - 2 * s + 0.012, 0.01]} /></mesh>
        </>
      ) : (
        <mesh material={m.paint} castShadow receiveShadow><boxGeometry args={[w, h, T]} /></mesh>
      )}
      {style === 'reeded' && strips.map((sx, i) => (
        <mesh key={i} material={m.paint} position={[sx, 0, T / 2 + 0.002]} castShadow>
          <boxGeometry args={[w / strips.length - 0.006, h - 0.04, 0.008]} />
        </mesh>
      ))}
      {knob !== 'none' && (
        <group position-z={style === 'reeded' ? 0.008 : 0}>
          <Hardware m={m} style={style} w={w} h={h} x={drawer ? 0 : kx} y={drawer ? 0 : ky} drawer={drawer} />
        </group>
      )}
    </group>
  );
}

function Pendant({x, m}: {x: number; m: Mats}) {
  return (
    <group position={[x, 0, -0.5]}>
      <mesh position={[0, 3.1, 0]}><cylinderGeometry args={[0.004, 0.004, 2.7, 6]} /><meshStandardMaterial color="#111" /></mesh>
      <mesh position={[0, 1.78, 0]}>
        <cylinderGeometry args={[0.05, 0.17, 0.22, 40, 1, true]} />
        <meshStandardMaterial color="#b08a4e" metalness={1} roughness={0.28} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 1.72, 0]}>
        <sphereGeometry args={[0.055, 24, 24]} />
        <meshStandardMaterial color="#ffe3b0" emissive="#ffcf8a" emissiveIntensity={5} toneMapped={false} />
      </mesh>
      <pointLight position={[0, 1.6, 0]} intensity={2.2} distance={3.4} decay={2} color="#ffd9a0" />
      <mesh position={[0, 1.88, 0]} material={m.dark}><cylinderGeometry args={[0.03, 0.03, 0.05, 16]} /></mesh>
    </group>
  );
}

export function Kitchen({spec}: {spec: Spec}) {
  const m = useMaterials(spec);
  const st = spec.style;
  const g = 0.004;
  const baseTop = 0.86;
  const plinth = 0.1;
  const bodyH = baseTop - plinth;
  const cy = plinth + bodyH / 2;
  const thick = spec.top === 'oak' ? 0.05 : 0.04;

  return (
    <group>
      {/* ---------- island ---------- */}
      <group>
        <mesh material={m.paint} position={[0, cy, -0.46]} receiveShadow><boxGeometry args={[2.4, bodyH, 0.9]} /></mesh>
        <mesh material={m.dark} position={[0, plinth / 2, -0.4]}><boxGeometry args={[2.3, plinth, 0.78]} /></mesh>

        {/* bay 1 — doors */}
        <Door m={m} style={st} w={0.4 - g} h={bodyH - 0.01} x={-1.0} y={cy} knob="tr" />
        <Door m={m} style={st} w={0.4 - g} h={bodyH - 0.01} x={-0.6} y={cy} knob="tl" />
        {/* bay 2 — drawers */}
        {[0, 1, 2].map((i) => {
          const dh = bodyH / 3 - g;
          return <Door key={i} m={m} style={st} drawer w={0.8 - g} h={dh} x={0} y={plinth + dh / 2 + i * (dh + g) + 0.002} knob="c" />;
        })}
        {/* bay 3 — doors */}
        <Door m={m} style={st} w={0.4 - g} h={bodyH - 0.01} x={0.6} y={cy} knob="tr" />
        <Door m={m} style={st} w={0.4 - g} h={bodyH - 0.01} x={1.0} y={cy} knob="tl" />

        {/* worktop + waterfall ends */}
        <mesh material={m.top} position={[0, baseTop + thick / 2, -0.5]} castShadow receiveShadow><boxGeometry args={[2.46, thick, 1.1]} /></mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} material={m.top} position={[s * 1.225, (baseTop + thick) / 2, -0.5]} castShadow receiveShadow>
            <boxGeometry args={[0.04, baseTop + thick, 1.1]} />
          </mesh>
        ))}
      </group>

      {/* ---------- back run ---------- */}
      <group position={[0, 0, -2.85]}>
        <mesh material={m.paint} position={[0, cy, -0.3]} receiveShadow><boxGeometry args={[3.2, bodyH, 0.6]} /></mesh>
        <mesh material={m.dark} position={[0, plinth / 2, -0.28]}><boxGeometry args={[3.1, plinth, 0.52]} /></mesh>
        {[-1.2, -0.4, 0.4, 1.2].map((bx, i) => {
          const dh = 0.2;
          return (
            <group key={i}>
              <Door m={m} style={st} drawer w={0.8 - g} h={dh} x={bx} y={baseTop - dh / 2 - 0.005} knob="c" />
              <Door m={m} style={st} w={0.8 - g} h={bodyH - dh - 0.015} x={bx} y={plinth + (bodyH - dh - 0.015) / 2} knob={i % 2 ? 'tr' : 'tl'} />
            </group>
          );
        })}
        <mesh material={m.top} position={[0, baseTop + thick / 2, -0.31]} castShadow receiveShadow><boxGeometry args={[3.24, thick, 0.64]} /></mesh>
        {/* full-height splashback */}
        <mesh material={m.splash} position={[0, baseTop + thick + 0.72, -0.595]}><boxGeometry args={[3.24, 1.44, 0.02]} /></mesh>
        {/* tall units */}
        {[-2.05, 2.05].map((tx, i) => (
          <group key={i}>
            <mesh material={m.paint} position={[tx, 1.15, -0.3]} receiveShadow><boxGeometry args={[0.9, 2.3, 0.6]} /></mesh>
            <Door m={m} style={st} w={0.9 - g} h={1.1} x={tx} y={0.12 + 0.55} knob={i ? 'tl' : 'tr'} />
            <Door m={m} style={st} w={0.9 - g} h={1.0} x={tx} y={0.12 + 1.1 + 0.5 + g} knob={i ? 'bl' : 'br'} />
          </group>
        ))}
        <mesh material={m.wall} position={[0, 2.1, -0.62]} receiveShadow><boxGeometry args={[26, 5, 0.04]} /></mesh>
      </group>

      {[-0.8, 0, 0.8].map((px) => <Pendant key={px} x={px} m={m} />)}
    </group>
  );
}
