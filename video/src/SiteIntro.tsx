import {AbsoluteFill, Easing, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, DISPLAY, SANS} from './theme';
import {loadFonts} from './fonts';

loadFonts();

const FPS = 30;
const s = (sec: number) => Math.round(sec * FPS);
const ease = Easing.bezier(0.19, 1, 0.22, 1);

/**
 * The website's opening: logo, then AI camera moves through Ryan's real rooms (one 5 s clip each, 2 s used).
 * To add a clip: drop it in public/clips and add a row here.
 */
const CLIPS = [
  {file: 'hampstead', eyebrow: 'Hampstead, North London', title: 'Shaker, in a bold blue'},
  {file: 'barnes', eyebrow: 'Barnes, South London', title: 'Sleek, minimal, strong colour'},
  {file: 'library', eyebrow: 'Hampstead Way, London', title: 'The brass library'},
  {file: 'hovingham', eyebrow: 'Hovingham, North Yorkshire', title: 'An Aga, framed'},
  {file: 'banquette', eyebrow: 'Furniture', title: 'Banquette seating'},
  {file: 'malton', eyebrow: 'Malton, North Yorkshire', title: 'Hand-painted, bi-fold bright'},
  {file: 'bedroom', eyebrow: 'Bedrooms', title: 'Fitted wardrobes'},
];

const LOGO = s(1.2);
const CLIP = s(1.8);
const OVERLAP = 6;
const TRIM = s(0.4); // skip the first moments of each clip so the move is already under way
const clipFrom = (i: number) => LOGO - OVERLAP + i * (CLIP - OVERLAP);
export const INTRO_FRAMES = clipFrom(CLIPS.length - 1) + CLIP;

function Rise({children, delay = 0}: {children: React.ReactNode; delay?: number}) {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f - delay, fps, config: {damping: 200}});
  return <div style={{opacity: p, transform: `translateY(${(1 - p) * 34}px)`}}>{children}</div>;
}

function Logo() {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f, fps, config: {damping: 200}});
  const line = interpolate(f, [10, 30], [0, 320], {easing: ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const out = interpolate(f, [LOGO - 10, LOGO], [1, 0], {extrapolateLeft: 'clamp'});
  return (
    <AbsoluteFill style={{opacity: out, justifyContent: 'center', alignItems: 'center'}}>
      <Img src={staticFile('logo-white.png')} style={{width: 520, opacity: p, transform: `scale(${0.95 + 0.05 * p})`}} />
      <div style={{width: line, height: 1, background: C.brass, marginTop: 50}} />
    </AbsoluteFill>
  );
}

function ClipScene({file, eyebrow, title}: (typeof CLIPS)[number]) {
  const f = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const wide = width > height;
  const fade = interpolate(f, [0, OVERLAP, CLIP - OVERLAP, CLIP], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const reveal = interpolate(f, [0, 20], [100, 0], {easing: ease, extrapolateRight: 'clamp'});
  const video = <OffthreadVideo src={staticFile(`clips/${file}.mp4`)} startFrom={TRIM} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />;

  if (wide) {
    return (
      <AbsoluteFill style={{opacity: fade, background: C.ink}}>
        {video}
        <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(10,11,12,.85), rgba(10,11,12,0) 50%)'}} />
        <div style={{position: 'absolute', left: 170, bottom: 150}}>
          <Rise delay={6}><div style={{fontFamily: SANS, fontWeight: 600, fontSize: 24, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.brassHi}}>{eyebrow}</div></Rise>
          <Rise delay={11}><div style={{fontFamily: DISPLAY, fontWeight: 500, fontSize: 108, lineHeight: 1, color: C.ivory, marginTop: 12}}>{title}</div></Rise>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{opacity: fade, background: C.ink}}>
      <div style={{position: 'absolute', left: 70, top: 330, width: 940, height: 1130, clipPath: `inset(0 0 ${reveal}% 0)`, outline: `1px solid ${C.brass}`, outlineOffset: 14}}>{video}</div>
      <div style={{position: 'absolute', left: 70, right: 70, top: 1530}}>
        <Rise delay={6}><div style={{fontFamily: SANS, fontWeight: 600, fontSize: 28, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.brassHi}}>{eyebrow}</div></Rise>
        <Rise delay={11}><div style={{fontFamily: DISPLAY, fontWeight: 500, fontSize: 96, lineHeight: 1.02, color: C.ivory, marginTop: 14}}>{title}</div></Rise>
      </div>
    </AbsoluteFill>
  );
}

export const SiteIntro: React.FC = () => (
  <AbsoluteFill style={{background: C.ink}}>
    <Sequence from={0} durationInFrames={LOGO}><Logo /></Sequence>
    {CLIPS.map((c, i) => (
      <Sequence key={c.file} from={clipFrom(i)} durationInFrames={CLIP}>
        <ClipScene {...c} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
