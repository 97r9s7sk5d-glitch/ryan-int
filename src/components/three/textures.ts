import * as THREE from 'three';

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function finish(c: HTMLCanvasElement, repeat = 1) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, repeat);
  t.anisotropy = 8;
  t.needsUpdate = true;
  return t;
}

/** Quartz / marble with soft grey veining — the look specified on most of Ryan's kitchens. */
export function marbleTexture(base = '#f1efea', vein = '#7f8288', seed = 7) {
  const size = 1024;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d')!;
  const r = rng(seed);
  g.fillStyle = base;
  g.fillRect(0, 0, size, size);
  // faint clouding
  for (let i = 0; i < 40; i++) {
    const grd = g.createRadialGradient(r() * size, r() * size, 0, r() * size, r() * size, 200 + r() * 260);
    grd.addColorStop(0, `rgba(160,160,165,${0.03 + r() * 0.05})`);
    grd.addColorStop(1, 'rgba(160,160,165,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, size, size);
  }
  const drawVein = (x: number, y: number, ang: number, len: number, w: number, a: number, depth: number) => {
    g.beginPath();
    g.moveTo(x, y);
    let px = x, py = y, pa = ang, turn = 0;
    for (let i = 0; i < len; i++) {
      turn = turn * 0.88 + (r() - 0.5) * 0.16; // momentum → flowing, not jittery
      pa += turn;
      px += Math.cos(pa) * 8;
      py += Math.sin(pa) * 8;
      g.lineTo(px, py);
      if (depth < 2 && r() < 0.02) drawVein(px, py, pa + (r() - 0.5) * 1.3, len * 0.35, w * 0.5, a * 0.7, depth + 1);
    }
    g.strokeStyle = vein;
    g.globalAlpha = a;
    g.lineWidth = w;
    g.lineCap = 'round';
    g.lineJoin = 'round';
    g.stroke();
    g.globalAlpha = 1;
  };
  g.filter = 'blur(6px)';
  for (let i = 0; i < 6; i++) drawVein(r() * size, -20, 1.25 + r() * 0.5, 150, 9 + r() * 10, 0.07, 1);
  g.filter = 'blur(1.4px)';
  for (let i = 0; i < 7; i++) drawVein(r() * size, -20, 1.2 + r() * 0.6, 150, 0.7 + r() * 1.6, 0.22 + r() * 0.3, 0);
  g.filter = 'none';
  return finish(c);
}

export function stoneTexture(base = '#2b2c2f', seed = 3) {
  const size = 512;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d')!;
  const r = rng(seed);
  g.fillStyle = base;
  g.fillRect(0, 0, size, size);
  for (let i = 0; i < 9000; i++) {
    const v = Math.floor(30 + r() * 60);
    g.fillStyle = `rgba(${v},${v},${v + 3},${0.05 + r() * 0.1})`;
    g.fillRect(r() * size, r() * size, 1 + r() * 2, 1 + r() * 2);
  }
  return finish(c);
}

export function oakTexture(tone = '#b98d57', seed = 11) {
  const w = 512, h = 1024;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d')!;
  const r = rng(seed);
  g.fillStyle = tone;
  g.fillRect(0, 0, w, h);
  for (let i = 0; i < 260; i++) {
    const x = r() * w;
    g.beginPath();
    g.moveTo(x, 0);
    for (let y = 0; y <= h; y += 32) g.lineTo(x + Math.sin(y * 0.01 + i) * 6 + (r() - 0.5) * 3, y);
    g.strokeStyle = r() > 0.5 ? `rgba(70,40,15,${0.06 + r() * 0.12})` : `rgba(255,225,170,${0.05 + r() * 0.1})`;
    g.lineWidth = 0.6 + r() * 2.4;
    g.stroke();
  }
  return finish(c);
}
