import type {Metadata} from 'next';
import Link from 'next/link';
import {PageHero} from '@/components/PageHero';
import {ParallaxImage, Reveal} from '@/components/Reveal';
import {CtaBand} from '@/components/CtaBand';
import {Process} from '@/components/Process';
import {full, roomImages} from '@/lib/content';

export const metadata: Metadata = {
  title: 'About Ryan McGinty',
  description: 'A small, respected business with over 18 years of experience creating, hand making and fitting bespoke interiors in homes from Yorkshire to London.',
  alternates: {canonical: '/about'},
};

export default function About() {
  return (
    <>
      <PageHero eyebrow="About" title="We work in homes" em="all over the UK.">
        <p>From Yorkshire to London. We never settle for second best, and always have your satisfaction as our top priority. It’s who we are, and we are proud of it.</p>
      </PageHero>
      <section className="paper py-24 lg:py-40">
        <div className="wrap grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <ParallaxImage src={full(roomImages.workshop)} alt="Shaker kitchen island by Ryan McGinty Interiors" ratio="4 / 5" />
          </div>
          <div className="space-y-6 text-[1.05rem] text-[#3a3a3c] lg:col-span-5 lg:col-start-8 lg:pt-16">
            <Reveal><p className="eyebrow">About us</p></Reveal>
            <Reveal delay={0.05}>
              <p>Ryan McGinty Interiors is a small, respected business offering a personal and professional service for all your interior woodworking needs. The key to our success is the ability to combine highly skilled, traditional workmanship, quality materials with an inspirational eye to make your vision come to life.</p>
            </Reveal>
            <Reveal delay={0.1}>
              <p>Ryan McGinty Interiors is led by Ryan McGinty, with 18 years’ experience both in the workshop creating and hand making as well as fitting at the highest standard in the homes of his customers.</p>
            </Reveal>
            <Reveal delay={0.12}>
              <p>Ryan and his team are highly regarded by their customers, particularly for their quality and finesse; they ensure that all work is completed to perfection and will always make sure that the customer is completely satisfied with the completed work.</p>
            </Reveal>
            <Reveal delay={0.14}>
              <p>Ryan and his team will provide the personal touch from initial consultations to the early designs through to completion. As the customer you will feel confident that you are involved in the whole process; you will be able to communicate at all times, having your ever-changing needs considered.</p>
            </Reveal>
            <Reveal delay={0.16}><Link href="/services" className="btn mt-4">View our services</Link></Reveal>
          </div>
        </div>
      </section>
      <Process />
      <CtaBand />
    </>
  );
}
