import type {Metadata} from 'next';
import Link from 'next/link';
import {ROOM_ORDER, ROOMS} from '@/lib/content';

export const metadata: Metadata = {title: 'Page not found', robots: {index: false}};

export default function NotFound() {
  return (
    <section className="grid min-h-[100svh] place-items-center bg-ink px-6 py-40 text-center">
      <div>
        <p className="eyebrow mb-6">Error 404</p>
        <h1 className="display text-6xl sm:text-8xl">
          This page has <em className="italic text-brass-hi">moved on.</em>
        </h1>
        <p className="mx-auto mt-8 max-w-md text-lg text-ivory/80">The link may be out of date or mistyped. Here are the best places to carry on from.</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
          <Link href="/contact" className="btn btn-solid">Request a quote</Link>
          <Link href="/" className="btn">Back to home</Link>
        </div>
        <ul className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-ivory/80">
          {ROOM_ORDER.map((r) => (
            <li key={r}><Link className="link-u" href={`/${r}`}>{ROOMS[r].title}</Link></li>
          ))}
          <li><Link className="link-u" href="/gallery">Gallery</Link></li>
        </ul>
      </div>
    </section>
  );
}
