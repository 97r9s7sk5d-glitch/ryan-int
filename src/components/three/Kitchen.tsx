'use client';

import {useMemo, useRef, type ComponentProps} from 'react';
import * as THREE from 'three';
import {useFrame} from '@react-three/fiber';
import {RoundedBox} from '@react-three/drei';
import type {Spec} from '@/lib/palette';
import {tiled, usePBR, type PBR} from './pbr';

const T = 0.022; // door thickness

/* ---------- materials ---------- */

function stone(set: PBR, w: number, h: number, size: number, o: {rot?: boolean; clearcoat?: number; normal?: number; color?: string; rough?: number} = {}) {
  const arm = tiled(set.arm, w, h, size, o.rot);
  return new THREE.MeshPhysicalMaterial({
    color: o.color ?? '#ffffff',
    map: tiled(set.diff, w, h, size, o.rot),
    normalMap: tiled(set.nor, w, h, size, o.rot),
    normalScale: new THREE.Vector2(o.normal ?? 0.5, o.normal ?? 0.5),
    roughnessMap: arm,
    aoMap: arm,
    roughness: o.rough ?? 1,
    clearcoat: o.clearcoat ?? 0,
    clearcoatRoughness: 0.12,
  });
}

function useMaterials(spec: Spec) {
  const marble = usePBR('marble019');
  const slate = usePBR('marble017', spec.top === 'slate');
  const oak = usePBR('oak_veneer_01');
  const walnut = usePBR('walnut_veneer', spec.top === 'walnut');
  const plaster = usePBR('white_plaster_02');

  // satin hand-painted finish
  const paint = useMemo(
    () => new THREE.MeshPhysicalMaterial({color: spec.paint, roughness: 0.46, metalness: 0, clearcoat: 0.1, clearcoatRoughness: 0.55}),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const panel = useMemo(() => paint.clone(), [paint]);
  const target = useRef(new THREE.Color(spec.paint));
  target.current.set(spec.paint);

  const hw = useMemo(() => {
    switch (spec.hardware) {
      case 'brass':
        return new THREE.MeshStandardMaterial({color: '#bf9650', metalness: 1, roughness: 0.26});
      case 'nickel':
        return new THREE.MeshStandardMaterial({color: '#d6d6d9', metalness: 1, roughness: 0.2});
      case 'black':
        return new THREE.MeshStandardMaterial({color: '#161616', metalness: 0.7, roughness: 0.4});
      case 'oak':
        return new THREE.MeshStandardMaterial({map: tiled(oak.diff, 0.12, 0.12, 0.3), normalMap: tiled(oak.nor, 0.12, 0.12, 0.3), roughness: 0.5});
    }
  }, [spec.hardware, oak]);

  const brass = useMemo(() => new THREE.MeshStandardMaterial({color: '#bf9650', metalness: 1, roughness: 0.26}), []);

  // worktop + splashback sized to their real dimensions so veining/grain looks right
  const topSet = spec.top === 'slate' ? slate : spec.top === 'walnut' ? walnut : spec.top === 'oak' ? oak : marble;
  const isWood = spec.top === 'oak' || spec.top === 'walnut';
  const mk = (w: number, h: number) =>
    isWood
      ? stone(topSet, w, h, 0.9, {rot: true, normal: 0.7, clearcoat: 0.15, rough: 0.9, color: spec.top === 'walnut' ? '#a8896c' : '#e6d8c4'})
      : stone(topSet, w, h, spec.top === 'slate' ? 2.6 : 1.9, {clearcoat: spec.top === 'slate' ? 0.2 : 0.35, normal: spec.top === 'slate' ? 0.12 : 0.35});
  const islandTop = useMemo(() => mk(2.46, 1.1), [topSet, isWood, spec.top]); // eslint-disable-line react-hooks/exhaustive-deps
  const islandEnd = useMemo(() => mk(1.1, 0.9), [topSet, isWood, spec.top]); // eslint-disable-line react-hooks/exhaustive-deps
  const backTop = useMemo(() => mk(3.24, 0.64), [topSet, isWood, spec.top]); // eslint-disable-line react-hooks/exhaustive-deps
  const splashSet = spec.top === 'slate' ? slate : marble;
  const splash = useMemo(() => stone(splashSet, 3.24, 1.44, 2.3, {clearcoat: 0.25, normal: spec.top === 'slate' ? 0.12 : 0.3}), [splashSet]);

  const wall = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({color: '#d9d2c5', roughness: 0.92});
    m.normalMap = tiled(plaster.nor, 26, 5, 2.4) ?? null;
    m.normalScale.set(0.35, 0.35);
    return m;
  }, [plaster]);

  const carcass = useMemo(() => new THREE.MeshStandardMaterial({color: '#141414', roughness: 0.8}), []);
  const board = useMemo(
    () => new THREE.MeshStandardMaterial({map: tiled(oak.diff, 0.5, 0.32, 0.9, true), normalMap: tiled(oak.nor, 0.5, 0.32, 0.9, true), roughness: 0.55}),
    [oak],
  );
  const ceramic = useMemo(() => new THREE.MeshPhysicalMaterial({color: '#efe9dd', roughness: 0.22, clearcoat: 0.7, clearcoatRoughness: 0.1}), []);
  const glass = useMemo(() => new THREE.MeshPhysicalMaterial({color: '#060606', roughness: 0.06, clearcoat: 1, clearcoatRoughness: 0.03}), []);
  const steel = useMemo(() => new THREE.MeshStandardMaterial({color: '#8d9094', metalness: 1, roughness: 0.38}), []);
  const lemon = useMemo(() => new THREE.MeshStandardMaterial({color: '#e8c52c', roughness: 0.5}), []);

  useFrame((_, dt) => {
    paint.color.lerp(target.current, 1 - Math.exp(-dt * 5));
    panel.color.copy(paint.color).multiplyScalar(0.82);
  });

  return {paint, panel, hw, brass, islandTop, islandEnd, backTop, splash, wall, carcass, board, ceramic, glass, steel, lemon};
}

type Mats = ReturnType<typeof useMaterials>;
type RBProps = ComponentProps<typeof RoundedBox>;
const RB = (p: RBProps) => <RoundedBox smoothness={3} radius={0.003} {...p} />;

/* ---------- hardware ---------- */

const knobGeo = (() => {
  const pts = [
    [0, 0], [0.013, 0], [0.013, 0.005], [0.008, 0.011], [0.016, 0.019], [0.021, 0.027], [0.018, 0.038], [0.01, 0.045], [0, 0.047],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const g = new THREE.LatheGeometry(pts, 32);
  g.rotateX(Math.PI / 2);
  return g;
})();

function Hardware({m, style, w, h, x, y, drawer}: {m: Mats; style: Spec['style']; w: number; h: number; x: number; y: number; drawer?: boolean}) {
  if (style === 'slab') {
    const horizontal = !!drawer || w > h;
    const len = Math.min(0.2, (horizontal ? w : h) * 0.5);
    return (
      <group position={[x, y, T / 2]}>
        <mesh material={m.hw} rotation-z={horizontal ? Math.PI / 2 : 0} position-z={0.022} castShadow>
          <cylinderGeometry args={[0.0075, 0.0075, len, 20]} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} material={m.hw} rotation-x={Math.PI / 2} position={horizontal ? [s * len * 0.4, 0, 0.011] : [0, s * len * 0.4, 0.011]}>
            <cylinderGeometry args={[0.005, 0.005, 0.022, 12]} />
          </mesh>
        ))}
      </group>
    );
  }
  return <mesh geometry={knobGeo} material={m.hw} position={[x, y, T / 2]} castShadow />;
}

/* ---------- doors ---------- */

function Door({m, w, h, x, y, z = 0, style, knob = 'tl', drawer}: {
  m: Mats; w: number; h: number; x: number; y: number; z?: number; style: Spec['style']; knob?: 'tl' | 'tr' | 'bl' | 'br' | 'c' | 'none'; drawer?: boolean;
}) {
  const s = drawer ? 0.05 : 0.07;
  const strips = useMemo(() => {
    const n = Math.max(3, Math.floor(w / 0.026));
    return Array.from({length: n}, (_, i) => -w / 2 + (i + 0.5) * (w / n));
  }, [w]);

  const inset = Math.min(0.07, w / 2 - 0.03);
  const kx = knob === 'tl' || knob === 'bl' ? -w / 2 + inset : knob === 'tr' || knob === 'br' ? w / 2 - inset : 0;
  const ky = knob === 'tl' || knob === 'tr' ? h / 2 - 0.08 : knob === 'bl' || knob === 'br' ? -h / 2 + 0.08 : 0;

  return (
    <group position={[x, y, z + T / 2]}>
      {style === 'shaker' ? (
        <>
          <RB material={m.paint} position={[0, h / 2 - s / 2, 0]} args={[w, s, T]} castShadow receiveShadow />
          <RB material={m.paint} position={[0, -h / 2 + s / 2, 0]} args={[w, s, T]} castShadow receiveShadow />
          <RB material={m.paint} position={[-w / 2 + s / 2, 0, 0]} args={[s, h - 2 * s, T]} castShadow receiveShadow />
          <RB material={m.paint} position={[w / 2 - s / 2, 0, 0]} args={[s, h - 2 * s, T]} castShadow receiveShadow />
          <mesh material={m.panel} position={[0, 0, -T / 2 + 0.004]} receiveShadow>
            <boxGeometry args={[w - 2 * s + 0.012, h - 2 * s + 0.012, 0.01]} />
          </mesh>
        </>
      ) : (
        <RB material={m.paint} args={[w, h, T]} castShadow receiveShadow />
      )}
      {style === 'reeded' &&
        strips.map((sx, i) => (
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

/* ---------- props & fittings ---------- */

const lathe = (pts: [number, number][], seg = 40) => new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), seg);

const domeGeo = lathe([[0.19, 0], [0.18, 0.04], [0.15, 0.09], [0.1, 0.14], [0.05, 0.18], [0.028, 0.205]], 48);
const domeInnerGeo = lathe([[0.183, 0.004], [0.173, 0.04], [0.145, 0.09], [0.096, 0.14], [0.048, 0.176]], 48);
const bowlGeo = lathe([[0, 0], [0.055, 0], [0.1, 0.02], [0.155, 0.065], [0.17, 0.09], [0.163, 0.09], [0.15, 0.072], [0.09, 0.032], [0, 0.026]]);
const jugGeo = lathe([[0, 0], [0.055, 0], [0.07, 0.03], [0.078, 0.11], [0.066, 0.19], [0.046, 0.225], [0.05, 0.255], [0.068, 0.275], [0.06, 0.272], [0.041, 0.245], [0.038, 0.22], [0.058, 0.18], [0, 0.17]]);

function Pendant({x, m}: {x: number; m: Mats}) {
  return (
    <group position={[x, 0, -0.5]}>
      <mesh position={[0, 3.1, 0]}><cylinderGeometry args={[0.004, 0.004, 2.7, 6]} /><meshStandardMaterial color="#111" /></mesh>
      <mesh position={[0, 1.78, 0]} geometry={domeGeo} castShadow>
        <meshStandardMaterial color="#bf9650" metalness={1} roughness={0.28} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 1.78, 0]} geometry={domeInnerGeo}>
        <meshStandardMaterial color="#f4e6cc" emissive="#ffcf8a" emissiveIntensity={1.4} side={THREE.BackSide} toneMapped={false} />
      </mesh>
      <mesh position={[0, 1.76, 0]}>
        <sphereGeometry args={[0.045, 24, 24]} />
        <meshStandardMaterial color="#fff1d6" emissive="#ffd596" emissiveIntensity={6} toneMapped={false} />
      </mesh>
      <pointLight position={[0, 1.6, 0]} intensity={2.4} distance={3.6} decay={2} color="#ffd9a0" />
    </group>
  );
}

const tapCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0.26, 0), new THREE.Vector3(0, 0.34, 0.025),
  new THREE.Vector3(0, 0.36, 0.1), new THREE.Vector3(0, 0.32, 0.19), new THREE.Vector3(0, 0.29, 0.2),
]);

function Tap({m, position}: {m: Mats; position: [number, number, number]}) {
  return (
    <group position={position}>
      <mesh material={m.brass} position-y={0.012}><cylinderGeometry args={[0.032, 0.036, 0.024, 32]} /></mesh>
      <mesh material={m.brass}><tubeGeometry args={[tapCurve, 48, 0.011, 16, false]} /></mesh>
      <mesh material={m.brass} position={[0.05, 0.26, 0]} rotation-z={Math.PI / 2}><cylinderGeometry args={[0.007, 0.007, 0.1, 12]} /></mesh>
      <mesh material={m.brass} position={[0.1, 0.26, 0]}><sphereGeometry args={[0.014, 16, 16]} /></mesh>
    </group>
  );
}

/* ---------- the room ---------- */

export function Kitchen({spec}: {spec: Spec}) {
  const m = useMaterials(spec);
  const st = spec.style;
  const g = 0.004;
  const baseTop = 0.86;
  const plinth = 0.1;
  const bodyH = baseTop - plinth;
  const cy = plinth + bodyH / 2;
  const thick = spec.top === 'oak' || spec.top === 'walnut' ? 0.05 : 0.04;
  const top = baseTop + thick;

  return (
    <group>
      {/* ---------- island ---------- */}
      <group>
        <mesh material={m.carcass} position={[0, cy, -0.46]} receiveShadow><boxGeometry args={[2.36, bodyH, 0.9]} /></mesh>
        <mesh material={m.carcass} position={[0, plinth / 2, -0.4]}><boxGeometry args={[2.3, plinth, 0.78]} /></mesh>

        <Door m={m} style={st} w={0.4 - g} h={bodyH - 0.01} x={-1.0} y={cy} knob="tr" />
        <Door m={m} style={st} w={0.4 - g} h={bodyH - 0.01} x={-0.6} y={cy} knob="tl" />
        {[0, 1, 2].map((i) => {
          const dh = bodyH / 3 - g;
          return <Door key={i} m={m} style={st} drawer w={0.8 - g} h={dh} x={0} y={plinth + dh / 2 + i * (dh + g) + 0.002} knob="c" />;
        })}
        <Door m={m} style={st} w={0.4 - g} h={bodyH - 0.01} x={0.6} y={cy} knob="tr" />
        <Door m={m} style={st} w={0.4 - g} h={bodyH - 0.01} x={1.0} y={cy} knob="tl" />

        {/* worktop + waterfall ends */}
        <RB material={m.islandTop} radius={0.004} position={[0, baseTop + thick / 2, -0.5]} args={[2.46, thick, 1.1]} castShadow receiveShadow />
        {[-1, 1].map((s) => (
          <RB key={s} material={m.islandEnd} radius={0.004} position={[s * 1.225, top / 2, -0.5]} args={[0.04, top, 1.1]} castShadow receiveShadow />
        ))}

        {/* induction hob, board, fruit bowl */}
        <mesh material={m.glass} position={[0.5, top + 0.003, -0.5]}><boxGeometry args={[0.62, 0.006, 0.5]} /></mesh>
        {[[-0.15, -0.11], [0.15, -0.11], [-0.15, 0.11], [0.15, 0.11]].map(([hx, hz], i) => (
          <mesh key={i} position={[0.5 + hx, top + 0.0062, -0.5 + hz]} rotation-x={-Math.PI / 2}>
            <ringGeometry args={[0.07, 0.074, 48]} />
            <meshBasicMaterial color="#2c2c2e" />
          </mesh>
        ))}
        <RB material={m.board} radius={0.006} position={[-0.25, top + 0.0135, -0.58]} rotation-y={0.12} args={[0.5, 0.027, 0.32]} castShadow receiveShadow />
        <group position={[-0.82, top, -0.55]}>
          <mesh geometry={bowlGeo} material={m.ceramic} castShadow />
          {[[0, 0.07, 0, 0.3], [0.07, 0.06, 0.03, 1.2], [-0.06, 0.065, 0.05, 2.1], [0.02, 0.06, -0.07, 0.7], [-0.05, 0.07, -0.04, 1.8]].map(([lx, ly, lz, ry], i) => (
            <mesh key={i} material={m.lemon} position={[lx, ly + 0.035, lz]} rotation-y={ry} scale={[1.15, 0.85, 0.85]} castShadow>
              <sphereGeometry args={[0.04, 24, 20]} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ---------- back run ---------- */}
      <group position={[0, 0, -2.85]}>
        <mesh material={m.carcass} position={[0, cy, -0.3]} receiveShadow><boxGeometry args={[3.16, bodyH, 0.6]} /></mesh>
        <mesh material={m.carcass} position={[0, plinth / 2, -0.28]}><boxGeometry args={[3.1, plinth, 0.52]} /></mesh>
        {[-1.2, -0.4, 0.4, 1.2].map((bx, i) => {
          const dh = 0.2;
          return (
            <group key={i}>
              <Door m={m} style={st} drawer w={0.8 - g} h={dh} x={bx} y={baseTop - dh / 2 - 0.005} knob="c" />
              <Door m={m} style={st} w={0.8 - g} h={bodyH - dh - 0.015} x={bx} y={plinth + (bodyH - dh - 0.015) / 2} knob={i % 2 ? 'tr' : 'tl'} />
            </group>
          );
        })}
        <RB material={m.backTop} radius={0.004} position={[0, baseTop + thick / 2, -0.31]} args={[3.24, thick, 0.64]} castShadow receiveShadow />

        {/* sink + tap + jug */}
        <mesh material={m.steel} position={[-0.4, top + 0.002, -0.3]}><boxGeometry args={[0.62, 0.004, 0.4]} /></mesh>
        <mesh material={m.carcass} position={[-0.4, top + 0.0045, -0.3]}><boxGeometry args={[0.56, 0.002, 0.34]} /></mesh>
        <Tap m={m} position={[-0.4, top, -0.52]} />
        <mesh geometry={jugGeo} material={m.ceramic} position={[1.15, top, -0.45]} castShadow />

        {/* full-height splashback */}
        <mesh material={m.splash} position={[0, top + 0.72, -0.595]} receiveShadow><boxGeometry args={[3.24, 1.44, 0.02]} /></mesh>

        {/* tall units */}
        {[-2.05, 2.05].map((tx, i) => (
          <group key={i}>
            <mesh material={m.carcass} position={[tx, 1.15, -0.3]} receiveShadow><boxGeometry args={[0.86, 2.3, 0.6]} /></mesh>
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
