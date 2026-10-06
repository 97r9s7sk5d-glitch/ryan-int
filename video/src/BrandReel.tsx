import {AbsoluteFill, Easing, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, DISPLAY, SANS} from './theme';
import {loadFonts} from './fonts';

loadFonts();

const FPS = 30;
const s = (sec: number) => Math.round(sec * FPS);

/** Real project copy, from ryanmcgintyinteriors.co.uk */
interface Card {
  img: string;
  eyebrow: string;
  title: string;
  dur: number;
}
const KITCHENS: Card[] = [
  {img: 'kitchen-hampstead', eyebrow: 'Hampstead, North London', title: 'Shaker, in a bold blue', dur: s(2)},
  {img: 'kitchen-hovingham', eyebrow: 'Hovingham, North Yorkshire', title: 'An Aga, framed', dur: s(2)},
  {img: 'kitchen-malton', eyebrow: 'Malton, North Yorkshire', title: 'Hand-painted, bi-fold bright', dur: s(2)},
];
const STUDIES: Card[] = [
  {img: 'library-brass', eyebrow: 'Hampstead Way, London', title: 'The brass library', dur: s(2)},
  {img: 'media-suite', eyebrow: 'Golders Green, London', title: 'Media suite, hidden bar', dur: s(2)},
];
const FURNITURE: Card[] = [
  {img: 'banquette', eyebrow: 'Furniture', title: 'Banquette seating', dur: s(2)},
  {img: 'pub-bar', eyebrow: 'Furniture', title: 'Pub bar installation', dur: s(2)},
];

const ease = Easing.bezier(0.19, 1, 0.22, 1);

/** Opacity envelope for a scene: quick fade in, fade out at the end. */
function useFade(dur: number, inF = 12, outF = 12) {
  const f = useCurrentFrame();
  return interpolate(f, [0, inF, dur - outF, dur], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
}

function Rise({children, delay = 0, style}: {children: React.ReactNode; delay?: number; style?: React.CSSProperties}) {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f - delay, fps, config: {damping: 200}});
  return <div style={{opacity: p, transform: `translateY(${(1 - p) * 40}px)`, ...style}}>{children}</div>;
}

const Mark = () => (
  <Img src={staticFile('rm-mark-white.png')} style={{position: 'absolute', top: 70, left: 70, width: 150, opacity: 0.95}} />
);

/** A photograph with a slow push-in, caption underneath (portrait) or lower-left (wide). */
function PhotoScene({card}: {card: Card}) {
  const f = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const wide = width > height;
  const fade = useFade(card.dur);
  const p = f / card.dur;
  const scale = 1 + 0.1 * p;
  const x = interpolate(p, [0, 1], [-18, 18]);
  const reveal = interpolate(f, [0, 22], [100, 0], {easing: ease, extrapolateRight: 'clamp'});

  if (wide) {
    return (
      <AbsoluteFill style={{opacity: fade, background: C.ink}}>
        <Img src={staticFile(`reel/${card.img}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale}) translateX(${x}px)`}} />
        <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(10,11,12,.88), rgba(10,11,12,.1) 55%, rgba(10,11,12,.35))'}} />
        <Mark />
        <div style={{position: 'absolute', left: 110, bottom: 110}}>
          <Rise delay={8}><div style={{fontFamily: SANS, fontWeight: 600, fontSize: 24, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.brassHi}}>{card.eyebrow}</div></Rise>
          <Rise delay={14}><div style={{fontFamily: DISPLAY, fontWeight: 500, fontSize: 120, lineHeight: 1, color: C.ivory, marginTop: 14}}>{card.title}</div></Rise>
        </div>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{opacity: fade, background: C.ink}}>
      <Img src={staticFile(`reel/bg-${card.img}.jpg`)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} />
      <Mark />
      {/* the photo, framed */}
      <div style={{position: 'absolute', left: 70, top: 300, width: 940, height: 1130, clipPath: `inset(0 0 ${reveal}% 0)`, outline: `1px solid ${C.brass}`, outlineOffset: 14}}>
        <Img src={staticFile(`reel/${card.img}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale}) translateX(${x}px)`}} />
      </div>
      <div style={{position: 'absolute', left: 70, right: 70, top: 1500}}>
        <Rise delay={10}><div style={{fontFamily: SANS, fontWeight: 600, fontSize: 28, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.brassHi}}>{card.eyebrow}</div></Rise>
        <Rise delay={16}><div style={{fontFamily: DISPLAY, fontWeight: 500, fontSize: 104, lineHeight: 1.02, color: C.ivory, marginTop: 16}}>{card.title}</div></Rise>
      </div>
    </AbsoluteFill>
  );
}

function Cards({cards}: {cards: Card[]}) {
  let from = 0;
  return (
    <>
      {cards.map((c) => {
        const el = (
          <Sequence key={c.img} from={from} durationInFrames={c.dur}>
            <PhotoScene card={c} />
          </Sequence>
        );
        from += c.dur - 6; // overlap for a soft cross-dissolve
        return el;
      })}
    </>
  );
}

function Title({text, sub, dur}: {text: string; sub?: string; dur: number}) {
  const fade = useFade(dur, 10, 10);
  return (
    <AbsoluteFill style={{opacity: fade, justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 80}}>
      <Rise><div style={{fontFamily: SANS, fontWeight: 600, fontSize: 28, letterSpacing: '0.34em', textTransform: 'uppercase', color: C.brassHi}}>{sub}</div></Rise>
      <Rise delay={6}><div style={{fontFamily: DISPLAY, fontWeight: 500, fontSize: 140, lineHeight: 1, color: C.ivory, marginTop: 24}}>{text}</div></Rise>
    </AbsoluteFill>
  );
}

function Intro() {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dur = s(3);
  const fade = useFade(dur, 6, 14);
  const p = spring({frame: f, fps, config: {damping: 200}});
  const line = interpolate(f, [18, 54], [0, 360], {easing: ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{opacity: fade, justifyContent: 'center', alignItems: 'center'}}>
      <Img src={staticFile('logo-white.png')} style={{width: 560, opacity: p, transform: `scale(${0.94 + 0.06 * p})`}} />
      <div style={{width: line, height: 1, background: C.brass, marginTop: 56}} />
    </AbsoluteFill>
  );
}

function Headline() {
  const {width, height} = useVideoConfig();
  const wide = width > height;
  const dur = s(4);
  const fade = useFade(dur, 8, 14);
  const lines: [string, boolean][] = [['Bespoke.', false], ['Beautiful.', false], ['Craftsmanship.', true]];
  return (
    <AbsoluteFill style={{opacity: fade, justifyContent: 'center', alignItems: wide ? 'flex-start' : 'center', padding: wide ? '0 140px' : 80, textAlign: wide ? 'left' : 'center'}}>
      {lines.map(([t, em], i) => (
        <Rise key={t} delay={i * 12}>
          <div style={{fontFamily: DISPLAY, fontWeight: 500, fontStyle: em ? 'italic' : 'normal', fontSize: wide ? 170 : 150, lineHeight: 1.04, color: em ? C.brassHi : C.ivory}}>{t}</div>
        </Rise>
      ))}
      <Rise delay={48}>
        <div style={{fontFamily: SANS, fontSize: wide ? 34 : 36, color: C.muted, marginTop: 44, maxWidth: wide ? 900 : 800, lineHeight: 1.5}}>
          Get that first class finish from professionals who are leaders in their field.
        </div>
      </Rise>
    </AbsoluteFill>
  );
}

function Craft() {
  const f = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const wide = width > height;
  const dur = s(3);
  const fade = useFade(dur);
  const p = f / dur;
  return (
    <AbsoluteFill style={{opacity: fade, background: C.ink}}>
      <Img src={staticFile('reel/dovetail.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.04 + 0.08 * p})`}} />
      <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(10,11,12,.9), rgba(10,11,12,.05) 60%)'}} />
      <Mark />
      <div style={{position: 'absolute', left: wide ? 110 : 70, right: 70, bottom: wide ? 110 : 330}}>
        <Rise delay={8}><div style={{fontFamily: SANS, fontWeight: 600, fontSize: 26, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.brassHi}}>Made by hand in Malton</div></Rise>
        <Rise delay={14}><div style={{fontFamily: DISPLAY, fontWeight: 500, fontSize: wide ? 120 : 104, lineHeight: 1.02, color: C.ivory, marginTop: 16}}>Dovetailed oak, <em style={{color: C.brassHi}}>stamped by hand.</em></div></Rise>
      </div>
    </AbsoluteFill>
  );
}

function Quote() {
  const {width, height} = useVideoConfig();
  const wide = width > height;
  const dur = s(4);
  const fade = useFade(dur, 12, 14);
  return (
    <AbsoluteFill style={{opacity: fade, justifyContent: 'center', padding: wide ? '0 220px' : 90}}>
      <Rise><div style={{fontFamily: DISPLAY, fontSize: 260, lineHeight: 0.6, color: C.brass, opacity: 0.5}}>“</div></Rise>
      <Rise delay={6}>
        <div style={{fontFamily: DISPLAY, fontWeight: 500, fontSize: wide ? 78 : 76, lineHeight: 1.16, color: C.ivory}}>
          For a superb personal service, creative ideas and real craftsmanship I can unreservedly recommend RM Interiors.
        </div>
      </Rise>
      <Rise delay={30}>
        <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 26, letterSpacing: '0.28em', textTransform: 'uppercase', color: C.muted, marginTop: 50}}>
          <span style={{color: C.ivory}}>Ben Smith</span> — West London
        </div>
      </Rise>
    </AbsoluteFill>
  );
}

function Outro() {
  const f = useCurrentFrame();
  const dur = s(4);
  const fade = interpolate(f, [0, 12, dur - 1, dur], [0, 1, 1, 1], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{opacity: fade, justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
      <Rise><Img src={staticFile('logo-white.png')} style={{width: 480}} /></Rise>
      <Rise delay={14}><div style={{fontFamily: SANS, fontWeight: 600, fontSize: 26, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.brassHi, marginTop: 56}}>Malton, North Yorkshire</div></Rise>
      <Rise delay={20}><div style={{fontFamily: DISPLAY, fontWeight: 500, fontSize: 64, color: C.ivory, marginTop: 14}}>Yorkshire to London</div></Rise>
      <Rise delay={30}><div style={{fontFamily: SANS, fontSize: 32, color: C.muted, marginTop: 52, lineHeight: 1.7}}>@ryanmcgintyinteriors<br />ryanmcgintyinteriors.co.uk<br />07737 514395</div></Rise>
    </AbsoluteFill>
  );
}

/* 30 s · 900 frames */
const T = {
  intro: [0, s(3)],
  headline: [s(3), s(4)],
  kitchens: [s(7), s(6) - 12],
  studies: [s(13) - 12, s(4) - 6],
  furniture: [s(17) - 18, s(4) - 6],
  craft: [s(21) - 24, s(3)],
  quote: [s(24) - 24, s(4)],
  outro: [s(28) - 24, s(2) + 24],
} as const;
export const REEL_FRAMES = s(30);

export const BrandReel: React.FC = () => (
  <AbsoluteFill style={{background: C.ink}}>
    <Sequence from={T.intro[0]} durationInFrames={T.intro[1]}><Intro /></Sequence>
    <Sequence from={T.headline[0]} durationInFrames={T.headline[1]}><Headline /></Sequence>
    <Sequence from={T.kitchens[0]} durationInFrames={s(6)}><Cards cards={KITCHENS} /></Sequence>
    <Sequence from={T.studies[0]} durationInFrames={s(4)}><Cards cards={STUDIES} /></Sequence>
    <Sequence from={T.furniture[0]} durationInFrames={s(4)}><Cards cards={FURNITURE} /></Sequence>
    <Sequence from={T.craft[0]} durationInFrames={T.craft[1]}><Craft /></Sequence>
    <Sequence from={T.quote[0]} durationInFrames={T.quote[1]}><Quote /></Sequence>
    <Sequence from={T.outro[0]} durationInFrames={T.outro[1]}><Outro /></Sequence>
  </AbsoluteFill>
);
