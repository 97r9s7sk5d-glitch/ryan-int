import Link from 'next/link';
import {SITE, tel} from '@/lib/site';
import {Reveal} from './Reveal';

export function CtaBand() {
  return (
    <section className="relative border-t border-line bg-ink py-28 text-center lg:py-40">
      <div className="wrap">
        <Reveal><p className="eyebrow mb-6">Request a quote</p></Reveal>
        <Reveal delay={0.05}>
          <h2 className="display mx-auto max-w-4xl text-5xl sm:text-6xl lg:text-8xl">
            Tell us about <em className="italic text-brass-hi">your space.</em>
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="mt-12 flex flex-wrap items-center justify-center gap-5">
          <Link href="/contact" className="btn btn-solid">Start a conversation</Link>
          <a href={tel(SITE.mobile)} className="btn">Call {SITE.mobile}</a>
        </Reveal>
      </div>
    </section>
  );
}
