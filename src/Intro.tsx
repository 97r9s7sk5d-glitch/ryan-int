import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const Intro: React.FC<{title: string; subtitle: string}> = ({title, subtitle}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const scale = spring({frame, fps, config: {damping: 12}});
  const subOpacity = interpolate(frame, [30, 60], [0, 1], {extrapolateRight: 'clamp'});
  const fadeOut = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0f172a, #4f46e5)',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'sans-serif',
        color: 'white',
        opacity: fadeOut,
      }}
    >
      <h1 style={{fontSize: 160, margin: 0, transform: `scale(${scale})`}}>{title}</h1>
      <p style={{fontSize: 56, opacity: subOpacity}}>{subtitle}</p>
    </AbsoluteFill>
  );
};
