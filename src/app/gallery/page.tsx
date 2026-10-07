import type {Metadata} from 'next';
import {Suspense} from 'react';
import {PageHero} from '@/components/PageHero';
import {Gallery} from '@/components/Gallery';
import {CtaBand} from '@/components/CtaBand';
import {GALLERY} from '@/lib/content';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'An ever-expanding gallery of bespoke kitchens, wardrobes, bathrooms, libraries and furniture handmade by Ryan McGinty Interiors.',
  alternates: {canonical: '/gallery'},
};

export default function GalleryPage() {
  return (
    <>
      <PageHero eyebrow="Gallery" title="Our work," em="in detail.">
        <p>Five chapters, {GALLERY.length} photographs: kitchens, bedrooms, bathrooms, studies and furniture, made by hand in Malton and fitted in homes from Yorkshire to London.</p>
      </PageHero>
      <section className="bg-ink pb-28">
        <div className="wrap"><Suspense fallback={<div className="min-h-[60svh]" />}><Gallery /></Suspense></div>
      </section>
      <CtaBand />
    </>
  );
}
