import Link from 'next/link';
import {ROOMS, ROOM_ORDER, full} from '@/lib/content';
import {Reveal} from './Reveal';

export function Rooms() {
  return (
    <section className="relative bg-ink py-28 lg:py-40">
      <div className="wrap">
        <div className="mb-16 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <Reveal>
            <p className="eyebrow mb-5">What we make</p>
            <h2 className="display text-5xl sm:text-6xl lg:text-7xl">Every room, <em className="italic text-brass-hi">made to measure.</em></h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-md text-muted">
              We started out predominantly focussing on bespoke kitchens. Over the last few years we’ve branched out to cater for the other bespoke requirements in the home.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="hide-scroll flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 lg:px-[max(3rem,calc((100vw-90rem)/2+3rem))]">
        {ROOM_ORDER.map((r, i) => {
          const room = ROOMS[r];
          return (
            <Link
              key={r}
              href={`/${r}`}
              className="group relative block aspect-[3/4] w-[78vw] shrink-0 snap-start overflow-hidden bg-slate sm:w-[44vw] lg:w-[27vw] lg:min-w-[360px]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={full(room.hero)}
                alt={`${room.singular} by Ryan McGinty Interiors`}
                loading="lazy"
                data-parallax
                className="grade absolute inset-0 h-full w-full object-cover transition-transform duration-[1800ms] ease-[var(--ease-lux)] group-hover:scale-[1.07]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-ink/25" />
              <span className="absolute left-6 top-6 text-[0.7rem] uppercase tracking-[0.3em] text-ivory/80">0{i + 1}</span>
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <h3 className="display text-4xl sm:text-5xl">{room.title}</h3>
                <p className="mt-3 max-w-[18rem] translate-y-3 text-sm text-ivory/75 opacity-0 transition-all duration-700 group-hover:translate-y-0 group-hover:opacity-100 max-lg:translate-y-0 max-lg:opacity-100">
                  {room.tagline}
                </p>
                <span className="mt-5 inline-flex items-center gap-3 text-[0.68rem] uppercase tracking-[0.28em] text-brass-hi">
                  Explore <span className="block h-px w-8 bg-brass-hi transition-all duration-700 group-hover:w-16" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
