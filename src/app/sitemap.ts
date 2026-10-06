import type {MetadataRoute} from 'next';
import {SITE} from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['', '/services', '/kitchens', '/bedrooms', '/bathrooms', '/studies', '/furniture', '/gallery', '/about', '/testimonials', '/contact'];
  return paths.map((p) => ({url: `${SITE.url}${p}`, changeFrequency: 'monthly', priority: p === '' ? 1 : 0.7}));
}
