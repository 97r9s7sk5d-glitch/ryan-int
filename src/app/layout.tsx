import type {Metadata, Viewport} from 'next';
import {Suspense} from 'react';
import './globals.css';
import {Header} from '@/components/Header';
import {Footer} from '@/components/Footer';
import {SmoothScroll} from '@/components/SmoothScroll';
import {ScrollEffects} from '@/components/ScrollEffects';
import {ScrollProgress} from '@/components/ScrollProgress';
import {Consent} from '@/components/Consent';
import {SITE} from '@/lib/site';

const description =
  'Bespoke handmade kitchens, bedrooms, bathrooms, libraries and furniture, designed, built and fitted from our Malton workshop. Serving Yorkshire to London.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {default: 'Ryan McGinty Interiors | Bespoke Kitchens & Furniture, Yorkshire', template: '%s | Ryan McGinty Interiors'},
  description,
  alternates: {canonical: '/'},
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    locale: 'en_GB',
    images: [{url: '/og.jpg', width: 1200, height: 630, alt: 'Ryan McGinty Interiors: bespoke handmade kitchens, bedrooms and furniture'}],
  },
  twitter: {card: 'summary_large_image', images: ['/og.jpg']},
  icons: {
    icon: [{url: '/favicon.ico', sizes: '48x48'}, {url: '/icon.png', type: 'image/png', sizes: '512x512'}],
    apple: [{url: '/apple-touch-icon.png', sizes: '180x180'}],
  },
};

export const viewport: Viewport = {themeColor: '#0a0b0c', width: 'device-width', initialScale: 1};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  name: SITE.name,
  url: SITE.url,
  image: `${SITE.url}/og.jpg`,
  description,
  telephone: SITE.phone,
  email: SITE.email,
  founder: {'@type': 'Person', name: 'Ryan McGinty'},
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.town,
    addressRegion: SITE.address.region,
    postalCode: SITE.address.postcode,
    addressCountry: 'GB',
  },
  areaServed: ['Yorkshire', 'London', 'United Kingdom'],
  sameAs: [SITE.instagram],
  knowsAbout: ['Bespoke kitchens', 'Fitted wardrobes', 'Bathroom vanity units', 'Home libraries', 'Bespoke furniture'],
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <head>
        {/* first visit of a session, on the home page: flag it before paint so the reel opens full screen with no flash */}
        <script dangerouslySetInnerHTML={{__html: "try{if(location.pathname==='/'&&!sessionStorage.getItem('rm-intro')&&!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.setAttribute('data-intro','1')}catch(e){}"}} />
      </head>
      <body className="grain">
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}} />
        <SmoothScroll />
        <ScrollProgress />
        <aside aria-label="Website credit" className="pointer-events-none absolute inset-x-0 top-0 z-[85]">
          <div className="wrap">
            <a href="https://thechairman.org.uk" target="_blank" rel="noopener" className="pointer-events-auto inline-block rounded-b-lg bg-black px-3 py-1 text-[11px] leading-5 text-[#c0c0c0] transition-colors hover:text-white">
              Website designed by <span className="font-semibold">The Chairman</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </aside>
        <Header />
        <main>
          <Suspense>
            {children}
            {/* after the page content, so the DOM is hydrated before headings are split into words */}
            <ScrollEffects />
          </Suspense>
        </main>
        <Footer />
        <Consent />
      </body>
    </html>
  );
}
