import type {Metadata} from 'next';
import {Suspense} from 'react';
import {PageHero} from '@/components/PageHero';
import {ContactForm} from '@/components/ContactForm';
import {SITE, tel} from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact Ryan McGinty Interiors to request a quote. Workshop at Pyramid Estate, Showfield Lane, Malton YO17 6BT.',
  alternates: {canonical: '/contact'},
};

export default function Contact() {
  const a = SITE.address;
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${a.street}, ${a.town} ${a.postcode}`)}`;
  return (
    <>
      <PageHero eyebrow="Contact" title="Contact us" em="today.">
        <p>For more information about our services or to request a quote, please fill in your contact details and enquiry and we’ll get back to you.</p>
      </PageHero>
      <section className="bg-ink pb-28">
        <div className="wrap grid gap-16 lg:grid-cols-[1.4fr_1fr] lg:gap-24">
          <Suspense fallback={<div className="min-h-[36rem]" />}><ContactForm /></Suspense>
          <aside className="space-y-10 lg:pt-2">
            <div>
              <p className="eyebrow mb-3">Workshop &amp; showroom</p>
              <address className="not-italic text-ivory/85">
                {a.street}<br />{a.town}, {a.region}<br />{a.postcode}
              </address>
              <a href={maps} target="_blank" rel="noopener noreferrer" className="link-u mt-3 inline-block text-sm text-brass-hi">Open in Maps ↗</a>
            </div>
            <div>
              <p className="eyebrow mb-3">Call Ryan</p>
              <p><a className="link-u" href={tel(SITE.mobile)}>{SITE.mobile}</a></p>
              <p><a className="link-u" href={tel(SITE.phone)}>{SITE.phone}</a></p>
            </div>
            <div>
              <p className="eyebrow mb-3">Email</p>
              <a className="link-u" href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </div>
            <div>
              <p className="eyebrow mb-3">Follow the work</p>
              <a className="link-u" href={SITE.instagram} target="_blank" rel="noopener noreferrer">@ryanmcgintyinteriors</a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
