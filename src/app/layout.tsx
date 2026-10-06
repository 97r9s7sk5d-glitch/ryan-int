import type {Metadata, Viewport} from 'next';
import {Suspense} from 'react';
import './globals.css';
import {Header} from '@/components/Header';
import {Footer} from '@/components/Footer';
import {SmoothScroll} from '@/components/SmoothScroll';
import {SITE} from '@/lib/site';

const description =
  'Bespoke handmade kitchens, bedrooms, bathrooms, libraries and furniture, designed, built and fitted by Ryan McGinty and his team. Workshop in Malton, North Yorkshire, working in homes from Yorkshire to London.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {default: 'Ryan McGinty Interiors — Bespoke handmade kitchens, bedrooms & furniture', template: '%s | Ryan McGinty Interiors'},
  description,
  alternates: {canonical: '/'},
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: 'Ryan McGinty Interiors — Bespoke, beautiful craftsmanship',
    description,
    url: SITE.url,
    locale: 'en_GB',
    images: [{url: '/og.jpg', width: 1200, height: 630}],
  },
  twitter: {card: 'summary_large_image', images: ['/og.jpg']},
  icons: {icon: '/icon.png', apple: '/icon.png'},
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
    <html lang="en-GB">
      <body className="grain">
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}} />
        <SmoothScroll />
        <Header />
        <main>
          <Suspense>{children}</Suspense>
        </main>
        <Footer />
      </body>
    </html>
  );
}
