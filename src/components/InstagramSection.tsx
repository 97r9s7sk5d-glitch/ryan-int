import Link from 'next/link';
import {SITE} from '@/lib/site';
import {FEATURED, thumb} from '@/lib/content';
import {getInstagramPosts} from '@/lib/instagram';
import {Reveal} from './Reveal';
import {InstagramIcon} from './InstagramIcon';

/** Latest posts from Ryan's Instagram when a feed is connected; otherwise a grid of the site's own photography. */
export async function InstagramSection() {
  const live = await getInstagramPosts(6);
  const tiles = live
    ? live.map((p) => ({key: p.id, href: p.permalink, src: p.image, alt: p.caption || 'Ryan McGinty Interiors on Instagram', video: p.video, external: true}))
    : FEATURED.map((f) => ({key: f.src, href: SITE.instagram, src: thumb(f.src), alt: `${f.room}, ${f.label}`, video: false, external: true}));

  return (
    <section className="relative border-t border-line bg-ink py-24 lg:py-32">
      <div className="wrap">
        <div className="mb-12 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <Reveal>
            <p className="eyebrow mb-5 flex items-center gap-3"><InstagramIcon className="h-4 w-4" /> Instagram</p>
            <h2 className="display text-5xl sm:text-6xl lg:text-7xl">Follow the work, <em className="italic text-brass-hi">as it’s made.</em></h2>
            <p className="mt-6 max-w-lg text-muted">Fresh from the workshop in Malton: new kitchens, fittings and finished rooms, posted as they happen.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-solid">
              <InstagramIcon className="h-4 w-4" /> @ryanmcgintyinteriors
            </a>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6">
          {tiles.map((t, i) => (
            <Reveal key={t.key} delay={(i % 6) * 0.05}>
              <a href={t.href} target="_blank" rel="noopener noreferrer" aria-label={`View on Instagram: ${t.alt}`} className="img-wrap group block aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.src} alt={t.alt} loading="lazy" className="grade transition-transform duration-[1400ms] ease-[var(--ease-lux)] group-hover:scale-[1.08]" />
                <span className="absolute inset-0 grid place-items-center bg-ink/0 text-ivory opacity-0 transition-all duration-500 group-hover:bg-ink/45 group-hover:opacity-100">
                  <InstagramIcon className="h-8 w-8" />
                </span>
                {t.video && <span className="absolute right-3 top-3 text-xs text-ivory drop-shadow">▶</span>}
              </a>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted">
          <Link href="/gallery" className="link-u">Browse the full gallery</Link>
        </p>
      </div>
    </section>
  );
}
