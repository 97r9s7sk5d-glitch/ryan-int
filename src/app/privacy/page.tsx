import type {Metadata} from 'next';
import {PageHero} from '@/components/PageHero';
import {SITE} from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy policy',
  description: 'How Ryan McGinty Interiors collects and uses your personal information, our use of privacy-friendly analytics and your rights.',
  alternates: {canonical: '/privacy'},
};

export default function Privacy() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy" em="policy.">
        <p>Last updated 7 October 2026.</p>
      </PageHero>
      <section className="bg-ink pb-28">
        <div className="wrap max-w-3xl space-y-6 text-ivory/80 [&_h2]:display [&_h2]:mt-10 [&_h2]:text-3xl [&_h2]:text-ivory">
          <p>{SITE.name} (“we”, “us”) respects your privacy. This page explains what personal information we collect through this website and how we use it.</p>
          <h2>What we collect</h2>
          <p>If you contact us through the enquiry form, we collect the details you provide: your name, email address, phone number (optional), the type of project and your message. If you email or phone us, we hold the details you give us.</p>
          <h2>How we use it</h2>
          <p>Our lawful basis is your request (taking steps at your request before a contract) and our legitimate interest in running and improving the business; for analytics it is your consent. We use your information only to respond to your enquiry, to provide a quote and, if you become a customer, to deliver and fit your project. We do not sell or rent your information and we do not use it for third-party marketing.</p>
          <h2 id="cookies">Cookies, analytics and your choices</h2>
          <p>This website sets no advertising or tracking cookies. When you first visit we ask whether you’re happy for us to measure visits and page speed with Vercel Web Analytics and Speed Insights. These record anonymous, aggregated information, such as which pages are viewed, the type of device and the country, without cookies and without identifying you or following you across other websites. They only load if you press “Accept”, and you can change your mind at any time with “Cookie settings” in the footer.</p>
          <p>The site also stores two small items in your browser to work properly: your cookie choice (so we don’t keep asking) and, for the length of your visit, a note that you have already seen the opening film. Neither is sent to us.</p>
          <h2>Who we share it with</h2>
          <p>Enquiries are sent from our server to us by email, through a delivery service acting on our behalf. The website is hosted by Vercel Inc., which processes basic technical data (such as your IP address) to deliver pages and keep the site secure, and, if you accept, provides the analytics described above. We may share information with suppliers or fitters only where needed to complete your project, or where the law requires it. We don’t sell your data.</p>
          <h2>How long we keep it</h2>
          <p>We keep enquiry and project records for as long as needed to provide our services and meet legal and accounting obligations, then delete them.</p>
          <h2>Your rights</h2>
          <p>You may ask to see, correct, export or erase the personal information we hold about you, object to or restrict how we use it, or complain to the Information Commissioner’s Office (ico.org.uk). To exercise these rights, email <a className="link-u text-brass-hi" href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
        </div>
      </section>
    </>
  );
}
