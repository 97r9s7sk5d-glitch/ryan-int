import type {Metadata} from 'next';
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
        <p>View our ever expanding photo galleries showcasing our work. {GALLERY.length} photographs of kitchens, bedrooms, bathrooms, studies and furniture.</p>
      </PageHero>
      <section className="bg-ink pb-28">
        <div className="wrap"><Gallery /></div>
      </section>
      <CtaBand />
    </>
  );
}
