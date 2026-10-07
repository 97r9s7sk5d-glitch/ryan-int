'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import {useState} from 'react';
import {DEFAULT_SPEC, HARDWARE, PAINTS, STYLES, TOPS, paintName, type Spec} from '@/lib/palette';
import {Reveal} from './Reveal';
import {useNear} from './three/useVisible';

const Scene = dynamic(() => import('./three/ConfiguratorScene'), {ssr: false});

function Group({label, children}: {label: string; children: React.ReactNode}) {
  return (
    <div className="border-t border-line py-5">
      <p className="eyebrow mb-3">{label}</p>
      {children}
    </div>
  );
}

const chip = (on: boolean) =>
  `px-4 py-2 text-[0.7rem] tracking-[0.18em] uppercase border transition-colors duration-500 ${
    on ? 'bg-brass text-ink border-brass' : 'border-line text-ivory/80 hover:border-brass/70'
  }`;

export function Configurator() {
  const {ref: sceneSlot, near} = useNear<HTMLDivElement>();
  const [spec, setSpec] = useState<Spec>(DEFAULT_SPEC);
  const set = <K extends keyof Spec>(k: K, v: Spec[K]) => setSpec((s) => ({...s, [k]: v}));
  const hw = HARDWARE.find((h) => h.id === spec.hardware)!;
  const top = TOPS.find((t) => t.id === spec.top)!;
  const style = STYLES.find((s) => s.id === spec.style)!;

  const summary = `${style.name} doors in ${paintName(spec.paint)}, ${hw.name.toLowerCase()} ironmongery, ${top.name.toLowerCase()} worktop.`;
  const href = `/contact?spec=${encodeURIComponent(summary)}#enquiry`;

  return (
    <section id="design" className="relative bg-coal py-28 lg:py-40">
      <div className="wrap">
        <div className="mb-14 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <Reveal>
            <p className="eyebrow mb-5">Design studio</p>
            <h2 className="display text-5xl sm:text-6xl lg:text-7xl">
              Start with the <em className="text-brass-hi not-italic italic">door.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-md text-muted">
              Every kitchen begins with a conversation, but you can start the thinking here. Choose a paint, an ironmongery, a worktop,
              then turn the room. Send it to Ryan and he’ll take it from there.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-px overflow-hidden border border-line bg-line lg:grid-cols-[1.7fr_1fr]">
          <div ref={sceneSlot} className="relative aspect-[4/3] min-h-[360px] bg-ink lg:aspect-auto lg:min-h-[640px]">
            {near && <Scene spec={spec} />}
            <div className="pointer-events-none absolute left-5 top-5 text-[0.65rem] uppercase tracking-[0.28em] text-muted">
              Drag to turn · Scroll to zoom
            </div>
            <div className="pointer-events-none absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
              <p className="max-w-xs text-sm text-ivory/80">{summary}</p>
            </div>
          </div>

          <div className="bg-coal p-6 sm:p-8 lg:p-10">
            <Group label={`Paint — ${paintName(spec.paint)}`}>
              <div className="flex flex-wrap gap-3">
                {PAINTS.map((p) => (
                  <button
                    key={p.hex}
                    aria-label={p.name}
                    title={p.name}
                    onClick={() => set('paint', p.hex)}
                    className={`h-9 w-9 rounded-full border-2 transition-transform duration-500 hover:scale-110 ${
                      spec.paint === p.hex ? 'border-brass-hi scale-110' : 'border-transparent ring-1 ring-white/15'
                    }`}
                    style={{background: p.hex}}
                  />
                ))}
              </div>
            </Group>
            <Group label="Door style">
              <div className="flex flex-wrap gap-2">
                {STYLES.map((s) => (
                  <button key={s.id} className={chip(spec.style === s.id)} onClick={() => set('style', s.id)}>{s.name}</button>
                ))}
              </div>
            </Group>
            <Group label="Ironmongery">
              <div className="flex flex-wrap gap-2">
                {HARDWARE.map((h) => (
                  <button key={h.id} className={chip(spec.hardware === h.id)} onClick={() => set('hardware', h.id)}>{h.name}</button>
                ))}
              </div>
            </Group>
            <Group label="Worktop">
              <div className="flex flex-wrap gap-2">
                {TOPS.map((t) => (
                  <button key={t.id} className={chip(spec.top === t.id)} onClick={() => set('top', t.id)}>{t.name}</button>
                ))}
              </div>
            </Group>
            <div className="border-t border-line pt-6">
              <Link href={href} className="btn btn-solid w-full justify-center">Send this to Ryan →</Link>
              <p className="mt-3 text-xs text-muted">Illustrative preview. Your real colours, timbers and stone are chosen together, in person.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
