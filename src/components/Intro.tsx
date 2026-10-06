import Link from 'next/link';
import {roomImages, full} from '@/lib/content';
import {ParallaxImage, Reveal} from './Reveal';
import {Counter} from './Counter';

export function Intro() {
  return (
    <section id="intro" className="paper relative overflow-hidden py-28 lg:py-44">
      <div className="wrap grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6 lg:pt-10">
          <Reveal><p className="eyebrow mb-6">Who we are</p></Reveal>
          <Reveal delay={0.05}>
            <h2 className="display text-5xl sm:text-6xl lg:text-[5.4rem]">
              Home of <em className="italic text-[#8a6a37]">bespoke</em> living spaces.
            </h2>
          </Reveal>
          <div className="mt-10 max-w-xl space-y-5 text-[1.05rem] text-[#3a3a3c]">
            <Reveal delay={0.1}>
              <p>
                Ryan McGinty Interiors is a small, respected business offering a personal and professional service for all your interior woodworking needs.
                The key to our success is the ability to combine highly skilled, traditional workmanship and quality materials with an inspirational eye to make your vision come to life.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p>
                Led by Ryan McGinty, with over 18 years’ experience both in the workshop creating and hand making, and fitting at the highest standard in the homes of his customers.
                Whatever your vision, from a handcrafted, traditional kitchen to a sleek modern finish, we can make it come to life.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.2} className="mt-10"><Link href="/about" className="btn">Our story</Link></Reveal>

          <div className="mt-20 grid max-w-xl grid-cols-3 gap-6 border-t border-black/15 pt-8">
            <Counter to={18} suffix="+" label="Years of craft" />
            <Counter to={1} label="Point of contact" />
            <Counter to={100} suffix="%" label="Made in our workshop" />
          </div>
        </div>

        <div className="relative lg:col-span-6">
          <ParallaxImage src={full(roomImages.workshop)} alt="Hand-painted shaker kitchen, Malton" ratio="4 / 5" className="lg:w-[78%]" />
          <div className="mt-6 w-[62%] lg:absolute lg:-bottom-20 lg:right-0 lg:mt-0 lg:w-[46%]">
            <ParallaxImage src={full(roomImages.craft)} alt="Dovetailed oak drawer stamped RM Interiors" ratio="1 / 1" amount={8} />
            <p className="mt-3 text-xs uppercase tracking-[0.22em] text-[#6b665c]">Dovetailed oak, stamped by hand</p>
          </div>
        </div>
      </div>
    </section>
  );
}
