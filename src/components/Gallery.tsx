'use client';

import {useCallback, useEffect, useMemo, useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {GALLERY, ROOMS, ROOM_ORDER, dims, full, thumb, type Room} from '@/lib/content';

const ALT: Record<Room, string> = {
  kitchens: 'Bespoke handmade kitchen',
  bedrooms: 'Bespoke fitted wardrobes',
  bathrooms: 'Bespoke bathroom vanity unit',
  studies: 'Bespoke study, library or media unit',
  furniture: 'Bespoke furniture',
};

export function Gallery() {
  const params = useSearchParams();
  const initial = (params.get('room') as Room) || 'all';
  const [filter, setFilter] = useState<Room | 'all'>(ROOM_ORDER.includes(initial as Room) ? (initial as Room) : 'all');
  const [open, setOpen] = useState<number | null>(null);
  const items = useMemo(() => (filter === 'all' ? GALLERY : GALLERY.filter((g) => g.room === filter)), [filter]);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((d: number) => setOpen((o) => (o === null ? o : (o + d + items.length) % items.length)), [items.length]);

  useEffect(() => {
    if (open === null) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', k);
    window.__lenis?.stop();
    document.documentElement.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', k);
      window.__lenis?.start();
      document.documentElement.style.overflow = '';
    };
  }, [open, close, step]);

  const pill = (on: boolean) =>
    `px-5 py-2.5 text-[0.7rem] uppercase tracking-[0.22em] border transition-colors duration-500 ${on ? 'border-brass bg-brass text-ink' : 'border-line text-ivory/80 hover:border-brass/70'}`;

  return (
    <>
      <div className="mb-12 flex flex-wrap gap-3" role="tablist">
        <button className={pill(filter === 'all')} onClick={() => setFilter('all')}>All · {GALLERY.length}</button>
        {ROOM_ORDER.map((r) => (
          <button key={r} className={pill(filter === r)} onClick={() => setFilter(r)}>
            {r === 'studies' ? 'Studies' : ROOMS[r].title} · {GALLERY.filter((g) => g.room === r).length}
          </button>
        ))}
      </div>

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {items.map((g, i) => {
          const [w, h] = dims(g.src);
          return (
            <button key={g.src} onClick={() => setOpen(i)} className="group img-wrap block w-full" aria-label={`Open image ${i + 1}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumb(g.src)}
                width={w}
                height={h}
                alt={`${ALT[g.room]} by Ryan McGinty Interiors`}
                loading="lazy"
                decoding="async"
                className="grade !h-auto transition-transform duration-[1400ms] ease-[var(--ease-lux)] group-hover:scale-[1.05]"
              />
              <span className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/25" />
            </button>
          );
        })}
      </div>

      {open !== null && items[open] && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 backdrop-blur-md"
          onClick={close}
          onTouchStart={(e) => ((window as unknown as {_tx: number})._tx = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            const dx = e.changedTouches[0].clientX - (window as unknown as {_tx: number})._tx;
            if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={items[open].src} src={full(items[open].src)} alt={ALT[items[open].room]} className="max-h-[88vh] max-w-[94vw] object-contain" onClick={(e) => e.stopPropagation()} />
          <button onClick={close} aria-label="Close" className="absolute right-5 top-5 p-3 text-xs uppercase tracking-[0.25em]">Close ✕</button>
          <button onClick={(e) => {e.stopPropagation(); step(-1);}} aria-label="Previous" className="absolute left-2 top-1/2 -translate-y-1/2 p-4 text-3xl text-brass-hi sm:left-8">←</button>
          <button onClick={(e) => {e.stopPropagation(); step(1);}} aria-label="Next" className="absolute right-2 top-1/2 -translate-y-1/2 p-4 text-3xl text-brass-hi sm:right-8">→</button>
          <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[0.68rem] uppercase tracking-[0.28em] text-muted">{open + 1} / {items.length}</p>
        </div>
      )}
    </>
  );
}
