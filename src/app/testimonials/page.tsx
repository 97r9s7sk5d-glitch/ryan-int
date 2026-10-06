import type {Metadata} from 'next';
import {PageHero} from '@/components/PageHero';
import {Reveal} from '@/components/Reveal';
import {CtaBand} from '@/components/CtaBand';
import {TESTIMONIALS} from '@/lib/content';

export const metadata: Metadata = {
  title: 'Testimonials',
  description: 'Genuine customer testimonials for Ryan McGinty Interiors: bespoke kitchens, wardrobes and furniture across Yorkshire and London.',
  alternates: {canonical: '/testimonials'},
};

export default function Testimonials() {
  return (
    <>
      <PageHero eyebrow="Testimonials" title="What people" em="say about us.">
        <p>Here are a few genuine customer testimonials.</p>
      </PageHero>
      <section className="bg-ink pb-28">
        <div className="wrap grid gap-px bg-line lg:grid-cols-2">
          {TESTIMONIALS.map((t, i) => (
            <Reveal as="article" key={t.who} delay={(i % 2) * 0.08} className="bg-ink p-8 sm:p-12">
              <blockquote className="display text-2xl leading-snug sm:text-3xl">“{t.quote}”</blockquote>
              <p className="mt-8 text-sm uppercase tracking-[0.22em] text-muted"><span className="text-ivory">{t.who}</span>{t.where && <> — {t.where}</>}</p>
            </Reveal>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
