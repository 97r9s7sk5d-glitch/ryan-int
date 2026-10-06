import type {NextConfig} from 'next';

// Old Duda URLs → new structure, so existing links, Instagram bio and Google results keep working.
const nextConfig: NextConfig = {
  reactStrictMode: true,
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
