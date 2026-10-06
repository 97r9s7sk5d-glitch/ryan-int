import {Reveal} from './Reveal';

export function PageHero({eyebrow, title, em, children, image}: {eyebrow: string; title: string; em?: string; children?: React.ReactNode; image?: string}) {
  return (
    <section className="relative overflow-hidden bg-ink pb-16 pt-36 sm:pt-44 lg:pb-24">
      {image && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" className="grade absolute inset-0 h-full w-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/50 to-ink" />
        </>
      )}
      <div className="wrap relative">
        <Reveal><p className="eyebrow mb-6">{eyebrow}</p></Reveal>
        <Reveal delay={0.05}>
          <h1 className="display max-w-5xl text-[clamp(3rem,8vw,7.5rem)]">
            {title} {em && <em className="italic text-brass-hi">{em}</em>}
          </h1>
        </Reveal>
        {children && <Reveal delay={0.12} className="mt-10 max-w-2xl text-lg text-ivory/80">{children}</Reveal>}
      </div>
    </section>
  );
}
