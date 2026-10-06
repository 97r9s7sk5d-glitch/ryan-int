import {Hero} from '@/components/Hero';
import {Marquee} from '@/components/Marquee';
import {Intro} from '@/components/Intro';
import {Rooms} from '@/components/Rooms';
import {Configurator} from '@/components/Configurator';
import {Process} from '@/components/Process';
import {Featured} from '@/components/Featured';
import {Testimonials} from '@/components/Testimonials';
import {CtaBand} from '@/components/CtaBand';
import {roomImages} from '@/lib/content';

export default function Home() {
  return (
    <>
      <Hero poster={roomImages.hero} />
      <Marquee />
      <Intro />
      <Rooms />
      <Configurator />
      <Process />
      <Featured />
      <Testimonials />
      <CtaBand />
    </>
  );
}
