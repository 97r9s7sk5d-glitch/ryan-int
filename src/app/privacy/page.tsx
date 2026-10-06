import type {Metadata} from 'next';
import {PageHero} from '@/components/PageHero';
import {SITE} from '@/lib/site';

export const metadata: Metadata = {title: 'Privacy policy', robots: {index: false}, alternates: {canonical: '/privacy'}};

export default function Privacy() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy" em="policy." />
      <section className="bg-ink pb-28">
        <div className="wrap max-w-3xl space-y-6 text-ivory/80 [&_h2]:display [&_h2]:mt-10 [&_h2]:text-3xl [&_h2]:text-ivory">
          <p>{SITE.name} (“we”, “us”) respects your privacy. This page explains what personal information we collect through this website and how we use it.</p>
          <h2>What we collect</h2>
          <p>If you contact us through the enquiry form, we collect the details you provide: your name, email address, phone number (optional), the type of project and your message. If you email or phone us, we hold the details you give us.</p>
          <h2>How we use it</h2>
          <p>We use your information only to respond to your enquiry, to provide a quote and, if you become a customer, to deliver and fit your project. We do not sell or rent your information and we do not use it for third-party marketing.</p>
          <h2>Cookies and tracking</h2>
          <p>This website does not set advertising or analytics cookies. If that changes, we will update this page and ask for your consent where required.</p>
          <h2>Who we share it with</h2>
          <p>Enquiries are delivered to us by email or through a form-handling service acting on our behalf. We may share information with suppliers or fitters only where needed to complete your project, or where the law requires it.</p>
          <h2>How long we keep it</h2>
          <p>We keep enquiry and project records for as long as needed to provide our services and meet legal and accounting obligations, then delete them.</p>
          <h2>Your rights</h2>
          <p>You may ask to see, correct, export or erase the personal information we hold about you, object to or restrict how we use it, or complain to the Information Commissioner’s Office (ico.org.uk). To exercise these rights, email <a className="link-u text-brass-hi" href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
        </div>
      </section>
    </>
  );
}
