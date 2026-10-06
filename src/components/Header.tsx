'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useEffect, useRef, useState} from 'react';
import {SITE, tel} from '@/lib/site';
import {thumb, ROOMS, ROOM_ORDER, type Room} from '@/lib/content';
import {InstagramIcon} from './InstagramIcon';

const NAVLINK = 'link-u text-[0.72rem] uppercase tracking-[0.24em] transition-colors';

const MENU = [
  {href: '/', label: 'Home'},
  {href: '/services', label: 'Services'},
  {href: '/kitchens', label: 'Kitchens', room: 'kitchens'},
  {href: '/bedrooms', label: 'Bedrooms', room: 'bedrooms'},
  {href: '/bathrooms', label: 'Bathrooms', room: 'bathrooms'},
  {href: '/studies', label: 'Studies & Libraries', room: 'studies'},
  {href: '/furniture', label: 'Furniture', room: 'furniture'},
  {href: '/gallery', label: 'Gallery'},
  {href: '/about', label: 'About'},
  {href: '/testimonials', label: 'Testimonials'},
  {href: '/contact', label: 'Contact'},
] as const;

export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const [hover, setHover] = useState<Room | null>(null);
  const [svc, setSvc] = useState(false);
  const svcRef = useRef<HTMLDivElement>(null);
  const isServices = path === '/services' || ROOM_ORDER.some((r) => path === `/${r}`);

  // close the Services dropdown on navigation, outside click or Escape
  useEffect(() => setSvc(false), [path]);
  useEffect(() => {
    if (!svc) return;
    const away = (e: Event) => !svcRef.current?.contains(e.target as Node) && setSvc(false);
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setSvc(false);
    document.addEventListener('pointerdown', away);
    window.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('pointerdown', away);
      window.removeEventListener('keydown', esc);
    };
  }, [svc]);

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener('scroll', on, {passive: true});
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const l = window.__lenis;
    if (open) l?.stop();
    else l?.start();
    document.documentElement.style.overflow = open ? 'hidden' : '';
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[80] transition-all duration-700 ${
          solid && !open ? 'bg-ink/75 backdrop-blur-xl border-b border-line py-3' : 'py-5 sm:py-7'
        }`}
      >
        <div className="wrap flex items-center justify-between">
          <Link href="/" aria-label={`${SITE.name} — home`} className="relative z-[90] flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/rm-mark-white.png" alt="RM" className="h-9 w-auto sm:h-11" width={600} height={333} />
            <span className="hidden text-[0.68rem] uppercase tracking-[0.34em] text-ivory/80 md:block lg:hidden xl:block">Ryan McGinty<br />Interiors</span>
          </Link>
          <nav className="relative z-[90] flex items-center gap-6 xl:gap-8">
            <Link href="/" className={`${NAVLINK} hidden lg:block ${path === '/' ? 'text-brass-hi' : ''}`}>Home</Link>

            {/* Services — drops down the five rooms */}
            <div
              ref={svcRef}
              className="relative hidden lg:block"
              onMouseEnter={() => setSvc(true)}
              onMouseLeave={() => setSvc(false)}
            >
              <button
                onClick={() => setSvc((s) => !s)}
                aria-expanded={svc}
                aria-haspopup="true"
                className={`${NAVLINK} flex items-center gap-2 ${isServices ? 'text-brass-hi' : ''}`}
              >
                Services
                <svg width="9" height="6" viewBox="0 0 9 6" aria-hidden className={`transition-transform duration-500 ${svc ? 'rotate-180' : ''}`}>
                  <path d="M1 1l3.5 3.5L8 1" fill="none" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </button>
              <div
                className={`absolute left-1/2 top-full w-[23rem] -translate-x-1/2 pt-6 transition-all duration-500 ease-[var(--ease-lux)] ${
                  svc ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
                }`}
              >
                <ul className="border border-line bg-ink/95 p-2 shadow-2xl shadow-black/50 backdrop-blur-xl">
                  <li>
                    <Link href="/services" tabIndex={svc ? 0 : -1} className="group flex items-center justify-between px-5 py-4 text-[0.7rem] uppercase tracking-[0.24em] text-brass-hi hover:bg-white/5">
                      All services <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                    </Link>
                  </li>
                  {ROOM_ORDER.map((r) => (
                    <li key={r} className="border-t border-line">
                      <Link
                        href={`/${r}`}
                        tabIndex={svc ? 0 : -1}
                        className={`group block px-5 py-4 transition-colors hover:bg-white/5 ${path === `/${r}` ? 'bg-white/5' : ''}`}
                      >
                        <span className="display block text-2xl leading-tight transition-colors group-hover:text-brass-hi">{ROOMS[r].title}</span>
                        <span className="mt-0.5 block text-xs text-muted">{ROOMS[r].tagline}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Link href="/gallery" className={`${NAVLINK} hidden sm:block ${path === '/gallery' ? 'text-brass-hi' : ''}`}>Gallery</Link>
            <Link href="/testimonials" className={`${NAVLINK} hidden lg:block ${path === '/testimonials' ? 'text-brass-hi' : ''}`}>Testimonials</Link>
            <Link href="/contact" className={`${NAVLINK} hidden sm:block ${path === '/contact' ? 'text-brass-hi' : ''}`}>Contact</Link>
            <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" aria-label="Ryan McGinty Interiors on Instagram" className="hidden text-ivory/80 transition-colors hover:text-brass-hi lg:block"><InstagramIcon className="h-[1.1rem] w-[1.1rem]" /></a>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="group flex items-center gap-3 text-[0.72rem] uppercase tracking-[0.24em]"
            >
              <span>{open ? 'Close' : 'Menu'}</span>
              <span className="relative block h-3 w-8">
                <span className={`absolute left-0 h-px w-full bg-ivory transition-all duration-500 ${open ? 'top-1.5 rotate-45' : 'top-0'}`} />
                <span className={`absolute left-0 h-px bg-ivory transition-all duration-500 ${open ? 'top-1.5 w-full -rotate-45' : 'top-3 w-5 group-hover:w-8'}`} />
              </span>
            </button>
          </nav>
        </div>
      </header>

      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-[70] bg-ink transition-[clip-path] duration-[900ms] ease-[var(--ease-lux)] ${
          open ? '[clip-path:inset(0_0_0_0)]' : '[clip-path:inset(0_0_100%_0)] pointer-events-none'
        }`}
      >
        <div className="wrap grid h-full items-center gap-10 pt-24 pb-10 lg:grid-cols-[1.2fr_1fr]">
          <ul className="space-y-0.5 sm:space-y-1">
            {MENU.map((m, i) => (
              <li key={m.href} className="overflow-hidden">
                <Link
                  href={m.href}
                  tabIndex={open ? 0 : -1}
                  onMouseEnter={() => setHover('room' in m ? (m.room as Room) : null)}
                  onMouseLeave={() => setHover(null)}
                  className={`display block text-[2rem] leading-[1.08] transition-all duration-700 ease-[var(--ease-lux)] hover:pl-4 hover:text-brass-hi sm:text-5xl lg:text-[3.4rem] ${
                    path === m.href ? 'text-brass-hi' : ''
                  } ${open ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
                  style={{transitionDelay: open ? `${150 + i * 45}ms` : '0ms'}}
                >
                  {m.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="hidden lg:block">
            <div className="img-wrap mb-8 aspect-[4/3]">
              {hover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={hover} src={thumb(ROOMS[hover].hero)} alt="" className="grade animate-[fade_0.8s_ease]" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src="/logo-white.png" alt="" className="!object-contain p-12" />
              )}
            </div>
            <div className="space-y-1 text-sm text-ivory/75">
              <p>{SITE.address.street}, {SITE.address.town}, {SITE.address.postcode}</p>
              <p><a className="link-u" href={tel(SITE.phone)}>{SITE.phone}</a> · <a className="link-u" href={tel(SITE.mobile)}>{SITE.mobile}</a></p>
              <p><a className="link-u" href={`mailto:${SITE.email}`}>{SITE.email}</a></p>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes fade{from{opacity:0;transform:scale(1.04)}to{opacity:1;transform:none}}`}</style>
    </>
  );
}

