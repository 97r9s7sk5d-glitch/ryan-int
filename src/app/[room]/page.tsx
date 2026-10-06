import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {PageHero} from '@/components/PageHero';
import {ParallaxImage, Reveal} from '@/components/Reveal';
import {CtaBand} from '@/components/CtaBand';
import {ROOMS, ROOM_ORDER, full, thumb, type Room} from '@/lib/content';

export const dynamicParams = false;
export const generateStaticParams = () => ROOM_ORDER.map((room) => ({room}));

export async function generateMetadata({params}: {params: Promise<{room: string}>}): Promise<Metadata> {
  const {room} = await params;
  const r = ROOMS[room as Room];
  if (!r) return {};
  return {
    title: `Bespoke ${r.title.toLowerCase()}`,
    description: `${r.intro} ${r.lead}`.slice(0, 300),
    alternates: {canonical: `/${r.slug}`},
    openGraph: {images: [full(r.hero)]},
  };
}

export default async function RoomPage({params}: {params: Promise<{room: string}>}) {
  const {room} = await params;
  const r = ROOMS[room as Room];
  if (!r) notFound();
  const others = ROOM_ORDER.filter((x) => x !== r.slug);

  return (
    <>
      <PageHero eyebrow="Bespoke" title={r.title} image={thumb(r.hero)}>
        <p>{r.tagline}</p>
      </PageHero>

      <section className="paper py-24 lg:py-36">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7"><p className="display text-3xl leading-[1.15] sm:text-5xl">{r.intro}</p></Reveal>
          <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9"><p className="muted text-lg">{r.lead}</p></Reveal>
        </div>
      </section>

      <section className="bg-ink py-24 lg:py-36">
        <div className="wrap space-y-28 lg:space-y-44">
          <Reveal><p className="eyebrow">Case studies</p></Reveal>
          {r.cases.map((c, i) => {
            const [lead, ...rest] = c.images;
            const flip = i % 2 === 1;
            return (
              <article key={c.title} className="grid gap-10 lg:grid-cols-12 lg:gap-16">
                <div className={`lg:col-span-7 ${flip ? 'lg:order-2' : ''}`}>
                  <ParallaxImage src={full(lead)} alt={`${c.title}, ${c.place}`} ratio="4 / 3" amount={7} />
                  {rest.length > 0 && (
                    <div className={`mt-4 grid gap-4 ${rest.length === 1 ? 'grid-cols-1' : rest.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                      {rest.slice(0, 3).map((s) => (
                        <Reveal key={s} className="img-wrap aspect-[4/3]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={thumb(s)} alt={`${c.title}, detail`} loading="lazy" className="grade transition-transform duration-[1400ms] hover:scale-105" />
                        </Reveal>
                      ))}
                    </div>
                  )}
                </div>
                <div className={`flex flex-col justify-center lg:col-span-5 ${flip ? 'lg:order-1' : ''}`}>
                  <Reveal>
                    <p className="eyebrow mb-4">0{i + 1} · {c.place}</p>
                    <h2 className="display text-4xl sm:text-5xl lg:text-6xl">{c.title}</h2>
                    <p className="mt-7 text-muted">{c.text}</p>
                  </Reveal>
                </div>
              </article>
            );
          })}
          <Reveal className="text-center">
            <Link href={`/gallery?room=${r.slug}`} className="btn">See the full {r.title.toLowerCase()} gallery</Link>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line bg-coal py-20">
        <div className="wrap">
          <p className="eyebrow mb-8">Also from the workshop</p>
          <ul className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
            {others.map((o) => (
              <li key={o}>
                <Link href={`/${o}`} className="group flex h-full items-center justify-between bg-coal p-7 transition-colors hover:bg-slate">
                  <span className="display text-3xl">{ROOMS[o].title}</span>
                  <span className="text-brass transition-transform duration-500 group-hover:translate-x-2">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
