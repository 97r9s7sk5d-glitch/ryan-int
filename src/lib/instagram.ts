import {SITE} from './site';

export interface IgPost {
  id: string;
  permalink: string;
  image: string;
  video: boolean;
  caption: string;
}

/**
 * Latest posts for the "Follow the work" section.
 *
 * Instagram has no public, login-free feed, so the site reads a JSON feed from a service Ryan connects to his
 * own account (e.g. Behold, free tier). Set INSTAGRAM_FEED_URL in Vercel → Environment Variables to switch it on;
 * until then the section falls back to photos from the site's own gallery. Never throws: a failed fetch just uses the fallback.
 */
const https = (u: unknown) => {
  try {
    const x = new URL(String(u));
    return x.protocol === 'https:' ? x.href : '';
  } catch {
    return '';
  }
};
const igLink = (u: unknown) => {
  const x = https(u);
  return x && /(^|\.)instagram\.com$/.test(new URL(x).hostname) ? x : SITE.instagram;
};

export async function getInstagramPosts(limit = 6): Promise<IgPost[] | null> {
  const url = process.env.INSTAGRAM_FEED_URL;
  if (!url) return null;
  try {
    if (!https(url)) return null;
    const res = await fetch(url, {next: {revalidate: 3600}, signal: AbortSignal.timeout(8000)});
    if (!res.ok) return null;
    const data = await res.json();
    const list: Record<string, unknown>[] = Array.isArray(data) ? data : data.posts ?? data.data ?? [];
    const posts = list
      .map((p) => {
        const sizes = p.sizes as {medium?: {mediaUrl?: string}} | undefined;
        const image = (p.thumbnailUrl as string) || sizes?.medium?.mediaUrl || (p.mediaUrl as string) || (p.media_url as string);
        return {
          id: String(p.id),
          permalink: igLink(p.permalink),
          image: https(image),
          video: String(p.mediaType ?? p.media_type ?? '').toUpperCase() === 'VIDEO',
          caption: String(p.caption ?? '').slice(0, 140),
        };
      })
      .filter((p) => p.image)
      .slice(0, limit);
    return posts.length ? posts : null;
  } catch {
    return null;
  }
}
