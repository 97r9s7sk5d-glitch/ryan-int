'use client';

import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import {Fragment, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {CAPTIONS, GALLERY, ROOMS, ROOM_ORDER, TESTIMONIALS, bg, dims, full, thumb, type Room} from '@/lib/content';
import {ParallaxImage, Reveal} from './Reveal';

const INITIAL = 30;
const ALT: Record<Room, string> = {
  kitchens: 'Bespoke handmade kitchen',
  bedrooms: 'Bespoke fitted wardrobes',
  bathrooms: 'Bespoke bathroom vanity unit',
  studies: 'Bespoke study, library or media unit',
  furniture: 'Bespoke furniture',
};
// a customer voice between chapters, matched to the room just shown
const QUOTE_AFTER: Record<Room, number> = {kitchens: 2, bedrooms: 3, bathrooms: 5, studies: 4, furniture: 1};

interface Item {
  src: string;
  room: Room;
}

/** Tile footprint from the photo's own shape, so rows stay aligned and nothing is letterboxed. */
function span(src: string, i: number) {
  const [w, h] = dims(src);
  const r = w / h;
  if (r < 0.85) return 'row-span-2';
  if (r > 1.2) return i % 7 === 0 ? 'col-span-2 row-span-2 md:col-span-3' : 'col-span-2 row-span-2';
  return '';
}

const lenisTo = (el: HTMLElement) => (window.__lenis ? window.__lenis.scrollTo(el, {offset: -150, duration: 1.4}) : el.scrollIntoView({behavior: 'smooth'}));

export function Gallery() {
  const params = useSearchParams();
  const [open, setOpen] = useState<{room: Room; i: number} | null>(null);
  const [expanded, setExpanded] = useState<Partial<Record<Room, boolean>>>({});
  const [active, setActive] = useState<Room>('kitchens');
  const cursor = useRef<HTMLDivElement>(null);

  // photos of each room, those that belong to a case study first (they have the best framing and a story)
  const chapters = useMemo(
    () =>
      ROOM_ORDER.map((room) => {
        const items = GALLERY.filter((g) => g.room === room);
        const storied = items.filter((g) => CAPTIONS[g.src]);
        return {room, items: [...storied, ...items.filter((g) => !CAPTIONS[g.src])] as Item[]};
      }),
    [],
  );

  // scroll-spy for the chapter navigator
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.getAttribute('data-chapter') as Room)),
      {rootMargin: '-40% 0px -55% 0px'},
    );
    document.querySelectorAll('[data-chapter]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // old links like /gallery?room=kitchens land on that chapter
  useEffect(() => {
    const r = params.get('room');
    if (!r) return;
    const t = setTimeout(() => {
      const el = document.getElementById(`chapter-${r}`);
      if (el) lenisTo(el);
    }, 700);
    return () => clearTimeout(t);
  }, [params]);

  // "View" cursor over tiles (fine pointers only)
  useEffect(() => {
    const el = cursor.current;
    if (!el || !window.matchMedia('(pointer: fine)').matches) return;
    let x = 0, y = 0, cx = 0, cy = 0, raf = 0;
    const loop = () => {
      cx += (x - cx) * 0.18;
      cy += (y - cy) * 0.18;
      el.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const on = !!(e.target as HTMLElement).closest?.('[data-tile]');
      el.style.opacity = on ? '1' : '0';
      el.style.scale = on ? '1' : '0.4';
    };
    window.addEventListener('pointermove', move, {passive: true});
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('pointermove', move);
      cancelAnimationFrame(raf);
    };
  }, []);

  const list = open ? chapters.find((c) => c.room === open.room)!.items : [];
  const step = useCallback((d: number) => setOpen((o) => (o ? {...o, i: (o.i + d + chapters.find((c) => c.room === o.room)!.items.length) % chapters.find((c) => c.room === o.room)!.items.length} : o)), [chapters]);

  return (
    <>
      <div ref={cursor} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[60] grid h-20 w-20 place-items-center rounded-full border border-brass bg-ink/40 text-[0.62rem] uppercase tracking-[0.28em] text-brass-hi opacity-0 backdrop-blur-sm transition-[opacity,scale] duration-500">
        View
      </div>

      {/* sticky chapter navigator */}
      <nav aria-label="Gallery chapters" className="sticky top-[4.6rem] z-40 -mx-5 mb-16 border-y border-line bg-ink/80 px-5 backdrop-blur-xl sm:mx-0 sm:px-0">
        <ul className="hide-scroll flex gap-1 overflow-x-auto py-2 sm:justify-center">
          {chapters.map((c, i) => (
            <li key={c.room}>
              <button
                onClick={() => lenisTo(document.getElementById(`chapter-${c.room}`)!)}
                className={`group flex items-baseline gap-3 whitespace-nowrap px-4 py-3 text-[0.7rem] uppercase tracking-[0.22em] transition-colors duration-500 ${active === c.room ? 'text-brass-hi' : 'text-ivory/60 hover:text-ivory'}`}
              >
                <span className="text-[0.6rem] opacity-60">0{i + 1}</span>
                {c.room === 'studies' ? 'Studies' : ROOMS[c.room].title}
                <span className="text-[0.6rem] opacity-50">{c.items.length}</span>
                <span className={`absolute -mb-9 h-px bg-brass transition-all duration-700 ${active === c.room ? 'w-8' : 'w-0'}`} />
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-28 lg:space-y-44">
        {chapters.map((c, ci) => {
          const room = ROOMS[c.room];
          const showAll = expanded[c.room];
          const visible = showAll ? c.items : c.items.slice(0, INITIAL);
          const q = TESTIMONIALS[QUOTE_AFTER[c.room]];
          return (
            <Fragment key={c.room}>
              <section id={`chapter-${c.room}`} data-chapter={c.room} className="scroll-mt-40">
                {/* chapter opener */}
                <div className="mb-14 grid items-end gap-10 lg:grid-cols-12 lg:gap-14">
                  <div className="lg:col-span-5">
                    <Reveal><p className="eyebrow mb-5">Chapter 0{ci + 1} · {c.items.length} photographs</p></Reveal>
                    <Reveal delay={0.05}><h2 className="display text-5xl sm:text-6xl lg:text-7xl">{room.title}</h2></Reveal>
                    <Reveal delay={0.1}><p className="mt-6 max-w-md text-muted">{room.lead}</p></Reveal>
                    <Reveal delay={0.15} className="mt-8"><Link href={`/${c.room}`} className="btn">Read the case studies</Link></Reveal>
                  </div>
                  <div className="lg:col-span-7">
                    <ParallaxImage src={full(room.hero)} alt={`${room.singular} by Ryan McGinty Interiors`} ratio="16 / 10" amount={6} />
                  </div>
                </div>

                {/* mosaic */}
                <div className="grid auto-rows-[104px] grid-cols-2 gap-2 [grid-auto-flow:dense] sm:auto-rows-[140px] sm:gap-3 md:grid-cols-4 lg:auto-rows-[170px] lg:grid-cols-6">
                  {visible.map((g, i) => (
                    <Tile key={g.src} item={g} i={i} onOpen={() => setOpen({room: c.room, i})} />
                  ))}
                </div>

                {c.items.length > INITIAL && !showAll && (
                  <div className="mt-12 text-center">
                    <button onClick={() => setExpanded((e) => ({...e, [c.room]: true}))} className="btn">
                      Show all {c.items.length} {room.title.toLowerCase()} photographs
                    </button>
                  </div>
                )}
              </section>

              {ci < chapters.length - 1 && (
                <Reveal as="section" className="relative mx-auto max-w-4xl text-center" key={`q-${c.room}`}>
                  <span aria-hidden className="display absolute -top-16 left-1/2 -translate-x-1/2 text-[9rem] leading-none text-brass/15">“</span>
                  <blockquote className="display relative text-3xl leading-[1.18] sm:text-4xl lg:text-5xl">“{q.quote}”</blockquote>
                  <p className="mt-6 text-[0.7rem] uppercase tracking-[0.24em] text-muted"><span className="text-ivory">{q.who}</span>{q.where && <> — {q.where}</>}</p>
                </Reveal>
              )}
            </Fragment>
          );
        })}
      </div>

      {open && list[open.i] && <Lightbox items={list} room={open.room} i={open.i} onStep={step} onPick={(i) => setOpen({room: open.room, i})} onClose={() => setOpen(null)} />}
    </>
  );
}

/* ---------- tile ---------- */

function Tile({item, i, onOpen}: {item: Item; i: number; onOpen: () => void}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [seen, setSeen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const cap = CAPTIONS[item.src];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setSeen(true), io.disconnect()), {rootMargin: '0px 0px -6% 0px'});
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <button
      ref={ref}
      data-tile
      onClick={onOpen}
      aria-label={`Open photograph: ${cap ? `${cap.title}, ${cap.place}` : ALT[item.room]}`}
      className={`group relative overflow-hidden transition-[opacity,transform] duration-[1100ms] ease-[var(--ease-lux)] ${span(item.src, i)} ${seen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
      style={{background: bg(item.src), transitionDelay: seen ? `${(i % 6) * 60}ms` : '0ms'}}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={thumb(item.src)}
        alt={`${ALT[item.room]}${cap ? `, ${cap.place}` : ''} by Ryan McGinty Interiors`}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`grade absolute inset-0 h-full w-full object-cover transition-[transform,opacity] duration-[1600ms] ease-[var(--ease-lux)] group-hover:scale-[1.07] ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
      <span className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100 max-md:opacity-100" />
      <span className="absolute inset-x-0 bottom-0 translate-y-2 p-3 text-left opacity-0 transition-all duration-700 group-hover:translate-y-0 group-hover:opacity-100 max-md:translate-y-0 max-md:opacity-100 sm:p-4">
        {cap ? (
          <>
            <span className="block text-[0.58rem] uppercase tracking-[0.24em] text-brass-hi">{cap.place}</span>
            <span className="display block text-lg leading-tight sm:text-xl">{cap.title}</span>
          </>
        ) : (
          <span className="block text-[0.58rem] uppercase tracking-[0.24em] text-ivory/80">{ROOMS[item.room].title}</span>
        )}
      </span>
    </button>
  );
}

/* ---------- lightbox ---------- */

function Lightbox({items, room, i, onStep, onPick, onClose}: {items: Item[]; room: Room; i: number; onStep: (d: number) => void; onPick: (i: number) => void; onClose: () => void}) {
  const item = items[i];
  const cap = CAPTIONS[item.src];
  const touch = useRef(0);
  const strip = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onStep(1);
      if (e.key === 'ArrowLeft') onStep(-1);
    };
    window.addEventListener('keydown', k);
    window.__lenis?.stop();
    document.documentElement.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', k);
      window.__lenis?.start();
      document.documentElement.style.overflow = '';
    };
  }, [onClose, onStep]);

  // keep the active thumbnail in view
  useEffect(() => {
    strip.current?.querySelector<HTMLElement>('[data-active="true"]')?.scrollIntoView({inline: 'center', block: 'nearest', behavior: 'smooth'});
  }, [i]);

  const spec = `I liked this ${ROOMS[room].singular.toLowerCase()} photo in your gallery${cap ? ` (${cap.title}, ${cap.place})` : ''} and would like something similar.`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Photograph viewer"
      className="fixed inset-0 z-[100] flex flex-col bg-ink/[0.97] backdrop-blur-md"
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - touch.current;
        if (Math.abs(dx) > 50) onStep(dx < 0 ? 1 : -1);
      }}
    >
      <header className="flex items-center justify-between px-5 py-4 sm:px-8">
        <p className="text-[0.68rem] uppercase tracking-[0.28em] text-muted">
          <span className="text-brass-hi">{ROOMS[room].title}</span> · {i + 1} / {items.length}
        </p>
        <button onClick={onClose} aria-label="Close" className="p-2 text-[0.7rem] uppercase tracking-[0.25em]">Close ✕</button>
      </header>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20" onClick={onClose}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={item.src} src={full(item.src)} alt={`${ALT[room]}${cap ? `, ${cap.place}` : ''}`} onClick={(e) => e.stopPropagation()} className="max-h-full max-w-full animate-[lb_0.7s_var(--ease-lux)] object-contain shadow-2xl shadow-black/60" />
        <button onClick={(e) => {e.stopPropagation(); onStep(-1);}} aria-label="Previous" className="absolute left-1 top-1/2 -translate-y-1/2 p-4 text-3xl text-brass-hi sm:left-6">←</button>
        <button onClick={(e) => {e.stopPropagation(); onStep(1);}} aria-label="Next" className="absolute right-1 top-1/2 -translate-y-1/2 p-4 text-3xl text-brass-hi sm:right-6">→</button>
      </div>

      <footer className="px-5 pb-4 pt-3 sm:px-8">
        <div className="mb-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            {cap ? (
              <>
                <p className="text-[0.62rem] uppercase tracking-[0.26em] text-brass-hi">{cap.place}</p>
                <p className="display text-2xl sm:text-3xl">{cap.title}</p>
              </>
            ) : (
              <p className="display text-2xl sm:text-3xl">{ROOMS[room].singular}</p>
            )}
          </div>
          <div className="flex gap-3">
            <Link href={`/contact?spec=${encodeURIComponent(spec)}#enquiry`} onClick={onClose} className="btn btn-solid !px-5 !py-3">Enquire about something like this</Link>
            <Link href={`/${room}`} onClick={onClose} className="btn !px-5 !py-3 max-sm:hidden">Case studies</Link>
          </div>
        </div>
        <div ref={strip} className="hide-scroll flex gap-2 overflow-x-auto pb-1">
          {items.map((t, n) => (
            <button key={t.src} data-active={n === i} onClick={() => onPick(n)} aria-label={`Photograph ${n + 1}`} className={`relative h-14 w-20 shrink-0 overflow-hidden transition-opacity duration-500 sm:h-16 sm:w-24 ${n === i ? 'opacity-100 ring-1 ring-brass' : 'opacity-40 hover:opacity-80'}`} style={{background: bg(t.src)}}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={thumb(t.src)} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </footer>
      <style>{`@keyframes lb{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
