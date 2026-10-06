import Link from 'next/link';
import {FEATURED, full} from '@/lib/content';
import {Reveal} from './Reveal';

const LAYOUT = [
  'lg:col-span-7 lg:aspect-[16/11]',
  'lg:col-span-5 lg:aspect-[4/5]',
  'lg:col-span-4 lg:aspect-[4/5]',
  'lg:col-span-4 lg:aspect-[4/5] lg:mt-16',
  'lg:col-span-4 lg:aspect-[4/5]',
  'lg:col-span-12 lg:aspect-[21/9]',
];

export function Featured() {
  return (
    <section className="paper py-28 lg:py-40">
      <div className="wrap">
        <div className="mb-16 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <Reveal>
            <p className="eyebrow mb-5">Selected work</p>
            <h2 className="display text-5xl sm:text-6xl lg:text-7xl">Homes from <em className="italic text-[#8a6a37]">Yorkshire to London.</em></h2>
          </Reveal>
          <Reveal delay={0.1}><Link href="/gallery" className="btn">The full gallery</Link></Reveal>
        </div>
        <div className="grid gap-5 lg:grid-cols-12 lg:gap-6">
          {FEATURED.map((f, i) => (
            <Reveal key={f.src} delay={(i % 3) * 0.08} className={`group relative aspect-[4/3] overflow-hidden bg-black/10 ${LAYOUT[i]}`}>
              <Link href="/gallery" aria-label={`${f.room} — ${f.label}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={full(f.src)} alt={`${f.room}, ${f.label}`} loading="lazy" data-parallax className="grade absolute inset-0 h-full w-full object-cover transition-transform duration-[1800ms] ease-[var(--ease-lux)] group-hover:scale-105" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-5 pt-16 text-ivory">
                  <p className="text-[0.66rem] uppercase tracking-[0.28em] text-brass-hi">{f.room}</p>
                  <p className="display text-3xl">{f.label}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
