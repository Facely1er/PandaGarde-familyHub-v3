import { foundationStoryScenes } from '../../data/storyScenes';
import { Story } from '../../data/stories';
import { StoryDualModeExperience } from './StoryDualModeExperience';

interface BambooForestStoryExperienceProps {
  story: Story;
}

export function BambooForestStoryExperience({ story }: BambooForestStoryExperienceProps) {
  return (
    <StoryDualModeExperience
      story={story}
      scenes={foundationStoryScenes}
      introEyebrow={`Episode ${story.episodeNumber} · Foundation story`}
      introBody="Two ways through the same Digital Bamboo Forest: follow illustrated scenes with narration, or read chapter-by-chapter at your own pace. Switch anytime—activities unlock when you finish either path."
    />
  );
}
