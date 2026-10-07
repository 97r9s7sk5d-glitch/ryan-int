import Link from 'next/link';
import {SITE, tel} from '@/lib/site';
import {CookieSettingsLink} from './Consent';

export function Footer() {
  const a = SITE.address;
  return (
    <footer className="relative border-t border-line bg-ink pt-24 pb-10">
      <div className="wrap">
        <div className="grid gap-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="eyebrow mb-5">Begin a project</p>
            <Link href="/contact" className="display group block text-5xl sm:text-6xl lg:text-7xl">
              Let’s build something <em className="italic text-brass-hi">that lasts.</em>
              <span className="mt-6 block h-px w-24 bg-brass transition-all duration-700 group-hover:w-48" />
            </Link>
          </div>
          <div>
            <p className="eyebrow mb-5">Workshop</p>
            <address className="space-y-1 text-sm not-italic text-ivory/75">
              <p>{a.street}</p>
              <p>{a.town}, {a.region}</p>
              <p>{a.postcode}</p>
            </address>
          </div>
          <div>
            <p className="eyebrow mb-5">Speak to Ryan</p>
            <ul className="space-y-1 text-sm text-ivory/75">
              <li><a className="link-u inline-block py-1" href={tel(SITE.phone)}>{SITE.phone}</a></li>
              <li><a className="link-u inline-block py-1" href={tel(SITE.mobile)}>{SITE.mobile}</a></li>
              <li><a className="link-u inline-block py-1" href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
              <li><a className="link-u inline-block py-1" href={SITE.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-5">Explore</p>
            <ul className="space-y-1 text-sm text-ivory/75">
              {[['Kitchens', '/kitchens'], ['Bedrooms', '/bedrooms'], ['Bathrooms', '/bathrooms'], ['Studies & Libraries', '/studies'], ['Furniture', '/furniture'], ['Gallery', '/gallery'], ['About', '/about'], ['Testimonials', '/testimonials'], ['Contact', '/contact']].map(([l, h]) => (
                <li key={h}><Link className="link-u inline-block py-1" href={h}>{l}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-24 flex flex-col justify-between gap-3 border-t border-line pt-6 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <p>Bespoke handmade kitchens, bedrooms &amp; furniture · Yorkshire to London</p>
          <p className="flex flex-wrap gap-x-5 gap-y-1">
            <Link href="/privacy" className="link-u inline-block py-1">Privacy policy</Link>
            <Link href="/terms" className="link-u inline-block py-1">Terms &amp; conditions</Link>
            <CookieSettingsLink className="link-u py-1" />
          </p>
        </div>
      </div>
    </footer>
  );
}
