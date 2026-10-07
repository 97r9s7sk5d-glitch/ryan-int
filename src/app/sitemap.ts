import type {MetadataRoute} from 'next';
import {SITE} from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const main = ['', '/services', '/kitchens', '/bedrooms', '/bathrooms', '/studies', '/furniture', '/gallery', '/about', '/testimonials', '/contact'];
  const legal = ['/privacy', '/terms'];
  return [
    ...main.map((p) => ({url: `${SITE.url}${p}`, lastModified, changeFrequency: 'monthly' as const, priority: p === '' ? 1 : 0.7})),
    ...legal.map((p) => ({url: `${SITE.url}${p}`, lastModified, changeFrequency: 'yearly' as const, priority: 0.2})),
  ];
}
