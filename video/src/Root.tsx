import {Composition} from 'remotion';
import {BrandReel, REEL_FRAMES} from './BrandReel';

export const Root: React.FC = () => (
  <>
    {/* Instagram Reels / Stories / TikTok */}
    <Composition id="BrandReel" component={BrandReel} durationInFrames={REEL_FRAMES} fps={30} width={1080} height={1920} defaultProps={{mark: true}} />
    {/* Website hero, YouTube, LinkedIn */}
    <Composition id="BrandReelWide" component={BrandReel} durationInFrames={REEL_FRAMES} fps={30} width={1920} height={1080} defaultProps={{mark: true}} />
  </>
);
