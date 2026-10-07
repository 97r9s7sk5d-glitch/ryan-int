import type {NextConfig} from 'next';

// Old Duda URLs → new structure, so existing links, Instagram bio and Google results keep working.
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    const cache = (s: string) => ({key: 'Cache-Control', value: `public, max-age=${s}, stale-while-revalidate=2592000`});
    return [
      {
        source: '/:path*',
        headers: [
          // HTTPS only, for two years, including subdomains (Vercel also redirects http → https)
          {key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload'},
          {key: 'X-Content-Type-Options', value: 'nosniff'},
          {key: 'X-Frame-Options', value: 'SAMEORIGIN'},
          {key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin'},
          {key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'},
        ],
      },
      // big static media: keep for a week in browsers, then refresh quietly in the background
      {source: '/images/:path*', headers: [cache('604800')]},
      {source: '/video/:path*', headers: [cache('604800')]},
      {source: '/3d/:path*', headers: [cache('604800')]},
    ];
  },
  async redirects() {
    return [
      {source: '/newpage', destination: '/studies', permanent: true},
      {source: '/newpage1', destination: '/gallery?room=studies', permanent: true},
      {source: '/kitchens-gallery', destination: '/gallery?room=kitchens', permanent: true},
      {source: '/bedrooms-gallery', destination: '/gallery?room=bedrooms', permanent: true},
      {source: '/bathrooms-gallery', destination: '/gallery?room=bathrooms', permanent: true},
      {source: '/furniture-gallery', destination: '/gallery?room=furniture', permanent: true},
      {source: '/about-us', destination: '/about', permanent: true},
    ];
  },
};

export default nextConfig;
