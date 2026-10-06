import type {Metadata} from 'next';
import Link from 'next/link';
import {PageHero} from '@/components/PageHero';
import {Reveal} from '@/components/Reveal';
import {CtaBand} from '@/components/CtaBand';
import {ROOMS, ROOM_ORDER} from '@/lib/content';

export const metadata: Metadata = {
  title: 'Services',
  description: 'From design stage, to building your project in the workshop, to fitting: bespoke kitchens, bedrooms, bathrooms, studies, libraries and furniture.',
  alternates: {canonical: '/services'},
};

const PILLARS = [
  ['Outstanding service', 'We dedicate ourselves to every project and ensure we deliver a first class service from start to finish.'],
  ['Expert team', 'Your project will be handled by experienced professionals who are dedicated to perfection.'],
  ['Quality guaranteed', 'Our team will ensure that things run smoothly. We’re here to help you with any questions.'],
];

export default function Services() {
  return (
    <>
      <PageHero eyebrow="Services" title="We offer bespoke services for a" em="completely unique experience.">
        <p>We offer the very best services in our field. We never settle for second best, and always have your satisfaction as our top priority.</p>
      </PageHero>

      <section className="paper py-24 lg:py-36">
        <div className="wrap grid gap-16 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow mb-5">What we do</p>
            <h2 className="display mb-8 text-4xl sm:text-5xl">Design, workshop and fitting, <em className="italic text-[#8a6a37]">under one roof.</em></h2>
            <div className="space-y-5 text-[#3a3a3c]">
              <p>We work closely with you, the customer. We can offer the very highest level of craftsmanship from design stage, to building your project in the workshop, to fitting.</p>
              <p>We don’t use salesmen to hook you in, we don’t need to. Ryan is the first and last point of contact. He liaises with you, listens to you, advises and then works to bring your vision to life. Ryan and his trusted team ensure individual attention is maintained.</p>
              <p>We started out predominantly focussing on bespoke kitchens; we have branched out over the last two years to offer a wider service catering for other bespoke requirements in the home. We find that people are looking for media suites, the perfect bedroom wardrobes or even stylish vanity units to finish off the kitchen.</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="eyebrow mb-5">How we do it</p>
            <h2 className="display mb-8 text-4xl sm:text-5xl">A small team, <em className="italic text-[#8a6a37]">trusted completely.</em></h2>
            <div className="space-y-5 text-[#3a3a3c]">
              <p>RM Interiors achieves the highest standards because Ryan has a trusted and talented small team working alongside him. He fully understands that if a customer is investing in their home he has to invest fully in their vision, and offers professional levels of service at all times.</p>
              <p>He has trusted suppliers, ensuring he is only working with quality materials. He has his own workshop where he and his experienced team work on your project. Ryan can monitor progress on a daily basis to make sure it will be of the highest standard and meet your expectations.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-ink py-24 lg:py-32">
        <div className="wrap grid gap-px bg-line md:grid-cols-3">
          {PILLARS.map(([t, d], i) => (
            <Reveal key={t} delay={i * 0.08} className="bg-ink p-8 lg:p-12">
              <p className="display text-3xl text-brass-hi">{t}</p>
              <p className="mt-4 text-muted">{d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-coal py-24">
        <div className="wrap">
          <p className="eyebrow mb-8">Explore by room</p>
          <ul className="divide-y divide-line border-y border-line">
            {ROOM_ORDER.map((r) => (
              <li key={r}>
                <Link href={`/${r}`} className="group flex items-center justify-between py-7 transition-all hover:pl-4">
                  <span className="display text-4xl sm:text-6xl">{ROOMS[r].title}</span>
                  <span className="hidden max-w-sm text-sm text-muted md:block">{ROOMS[r].tagline}</span>
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
