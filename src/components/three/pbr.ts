import {useEffect, useState} from 'react';
import * as THREE from 'three';

/**
 * Scanned PBR materials (CC0): Poly Haven — oak_veneer_01, walnut_veneer, herringbone_parquet, white_plaster_02;
 * ambientCG — Marble019, Marble017. `arm` = R: ambient occlusion · G: roughness · B: metalness.
 */
export type PBRId = 'oak_veneer_01' | 'walnut_veneer' | 'herringbone_parquet' | 'white_plaster_02' | 'marble019' | 'marble017';
export interface PBR {
  diff?: THREE.Texture;
  nor?: THREE.Texture;
  arm?: THREE.Texture;
}

const loader = new THREE.TextureLoader();
const cache = new Map<PBRId, Promise<PBR>>();

function tex(url: string, srgb: boolean) {
  return new Promise<THREE.Texture>((resolve, reject) =>
    loader.load(
      url,
      (t) => {
        t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.anisotropy = 8;
        resolve(t);
      },
      undefined,
      reject,
    ),
  );
}

export function loadPBR(id: PBRId): Promise<PBR> {
  let p = cache.get(id);
  if (!p) {
    p = Promise.all([tex(`/3d/tex/${id}_diff.jpg`, true), tex(`/3d/tex/${id}_nor.jpg`, false), tex(`/3d/tex/${id}_arm.jpg`, false)]).then(
      ([diff, nor, arm]) => ({diff, nor, arm}),
    );
    cache.set(id, p);
  }
  return p;
}

/** The materials the hero needs before it is revealed. */
export const preloadCore = () => Promise.all((['marble019', 'oak_veneer_01', 'herringbone_parquet', 'white_plaster_02'] as PBRId[]).map(loadPBR));

export function usePBR(id: PBRId, enabled = true): PBR {
  const [set, setSet] = useState<PBR>({});
  useEffect(() => {
    if (!enabled) return;
    let live = true;
    loadPBR(id).then((p) => live && setSet(p));
    return () => {
      live = false;
    };
  }, [id, enabled]);
  return set;
}

const clones = new Map<string, THREE.Texture>();

/**
 * Re-uses a texture at real-world scale: a `w × h` metre surface shows `size` metres of material per repeat,
 * so grain and veining aren't stretched across differently sized boxes. `rot` turns the grain 90°.
 */
export function tiled(t: THREE.Texture | undefined, w: number, h: number, size: number, rot = false) {
  if (!t) return undefined;
  const key = `${t.uuid}|${w.toFixed(3)}|${h.toFixed(3)}|${size}|${rot}`;
  let c = clones.get(key);
  if (!c) {
    c = t.clone();
    c.repeat.set(w / size, h / size);
    if (rot) {
      c.center.set(0.5, 0.5);
      c.rotation = Math.PI / 2;
    }
    c.needsUpdate = true;
    clones.set(key, c);
  }
  return c;
}
