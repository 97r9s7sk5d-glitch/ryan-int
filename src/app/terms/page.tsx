import type {Metadata} from 'next';
import Link from 'next/link';
import {PageHero} from '@/components/PageHero';
import {SITE} from '@/lib/site';

export const metadata: Metadata = {
  title: 'Terms & conditions',
  description: 'The terms for using the Ryan McGinty Interiors website, how quotes and projects work, and how we handle content, links and liability.',
  alternates: {canonical: '/terms'},
};

export default function Terms() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms &" em="conditions.">
        <p>Last updated 7 October 2026.</p>
      </PageHero>
      <section className="bg-ink pb-28">
        <div className="wrap max-w-3xl space-y-6 text-ivory/80 [&_h2]:display [&_h2]:mt-10 [&_h2]:text-3xl [&_h2]:text-ivory">
          <p>These terms cover your use of this website, operated by {SITE.name} of {SITE.address.street}, {SITE.address.town}, {SITE.address.region} {SITE.address.postcode} (“we”, “us”). By using the site you accept them. If you don’t, please don’t use it.</p>
          <h2>About this website</h2>
          <p>The site shows our bespoke kitchens, bedrooms, bathrooms, studies, libraries and furniture, and lets you contact us. We take care to keep it accurate, but we don’t promise it is always complete, up to date or free from errors, and it may change or be unavailable from time to time.</p>
          <h2>Images, colours and the design studio</h2>
          <p>Photographs show real projects, but screens vary, so colours and finishes will look different in person. The 3D showroom and design studio are illustrations to help you imagine a finish; they are not a design, specification or price. Some of the short motion sequences on the site are created digitally from photographs of our projects and are for atmosphere only.</p>
          <h2>Enquiries, quotes and projects</h2>
          <p>Sending an enquiry doesn’t create a contract. Any quote is based on the information you give us and a survey where needed, and every project is governed by the written quotation and any signed agreement we issue for it, which sets out the price, payment schedule, timescale and your statutory rights. Nothing on this website is an offer capable of acceptance.</p>
          <h2>Our content</h2>
          <p>The photographs, designs, text, logos and video on this site belong to us or are used with permission, and are protected by copyright. You may view the site and share its links for personal, non-commercial use. Please don’t copy, republish or reuse our content, designs or branding without our written permission.</p>
          <h2>Using the site properly</h2>
          <p>Please don’t misuse the site: no attempts to break or overload it, gain unauthorised access, send spam through the enquiry form, or submit anything unlawful or untrue.</p>
          <h2>Links to other sites</h2>
          <p>We link to third-party sites such as Instagram and the site’s designer. We don’t control them and aren’t responsible for their content or privacy practices.</p>
          <h2>Liability</h2>
          <p>Nothing in these terms limits liability that can’t lawfully be limited, including for death or personal injury caused by negligence, for fraud, or for your statutory consumer rights. Otherwise, and as far as the law allows, we aren’t liable for loss arising from your use of, or reliance on, this website. The information here is general and is not professional advice.</p>
          <h2>Your personal information</h2>
          <p>How we use your information, and your choices about analytics, are explained in our <Link href="/privacy" className="link-u text-brass-hi">privacy policy</Link>.</p>
          <h2>Changes and governing law</h2>
          <p>We may update these terms, and the date above shows the latest version. They are governed by the laws of England and Wales, and the courts of England and Wales have jurisdiction, although if you live elsewhere in the UK you may also have the right to bring a claim in your home courts.</p>
          <h2>Contact</h2>
          <p>Questions about these terms? Email <a className="link-u text-brass-hi" href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
        </div>
      </section>
    </>
  );
}
