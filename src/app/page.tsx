import {Hero} from '@/components/Hero';
import {Marquee} from '@/components/Marquee';
import {Intro} from '@/components/Intro';
import {ReelSection} from '@/components/ReelSection';
import {Rooms} from '@/components/Rooms';
import {Configurator} from '@/components/Configurator';
import {Process} from '@/components/Process';
import {Featured} from '@/components/Featured';
import {Testimonials} from '@/components/Testimonials';
import {InstagramSection} from '@/components/InstagramSection';
import {CtaBand} from '@/components/CtaBand';
import {roomImages} from '@/lib/content';

export const revalidate = 3600; // refresh the Instagram feed hourly when it is connected

export default function Home() {
  return (
    <>
      <Hero poster={roomImages.hero} />
      <Marquee />
      <Intro />
      <ReelSection />
      <Rooms />
      <Configurator />
      <Process />
      <Featured />
      <Testimonials />
      <InstagramSection />
      <CtaBand />
    </>
  );
}
