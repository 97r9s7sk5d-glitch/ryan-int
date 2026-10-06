import {PROCESS} from '@/lib/content';
import {Reveal} from './Reveal';

export function Process() {
  return (
    <section className="relative bg-ink py-28 lg:py-40">
      <div className="wrap">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <p className="eyebrow mb-5">How we do it</p>
            <h2 className="display text-5xl sm:text-6xl lg:text-7xl">Made by the <em className="italic text-brass-hi">people</em> who fit it.</h2>
            <p className="mt-8 max-w-md text-muted">
              Ryan fully understands that if a customer is investing in their home he has to invest fully in their vision.
              He has trusted suppliers, ensuring he only works with quality materials, and his own workshop where he and his experienced team work on your project.
            </p>
          </Reveal>
          <ol className="divide-y divide-line border-y border-line">
            {PROCESS.map((p, i) => (
              <Reveal as="li" key={p.n} delay={i * 0.05} className="group grid grid-cols-[4rem_1fr] gap-6 py-9 sm:grid-cols-[6rem_1fr_2fr] sm:items-baseline">
                <span className="display text-3xl text-brass sm:text-4xl">{p.n}</span>
                <h3 className="display text-3xl sm:text-4xl">{p.title}</h3>
                <p className="col-span-2 text-muted sm:col-span-1">{p.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
