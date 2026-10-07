import type {MetadataRoute} from 'next';
import {SITE} from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.short,
    description: 'Bespoke handmade kitchens, bedrooms, bathrooms, libraries and furniture from Malton, North Yorkshire.',
    start_url: '/',
    display: 'browser',
    background_color: '#0a0b0c',
    theme_color: '#0a0b0c',
    icons: [
      {src: '/icon-192.png', sizes: '192x192', type: 'image/png'},
      {src: '/icon-512.png', sizes: '512x512', type: 'image/png'},
    ],
  };
}
