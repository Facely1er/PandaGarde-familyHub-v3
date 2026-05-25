import { useMemo } from 'react';
import { Story } from '../../data/stories';
import { chaptersToStoryScenes } from '../../lib/chapterStoryScenes';
import { StoryDualModeExperience } from './StoryDualModeExperience';

interface ChapterStoryExperienceProps {
  story: Story;
}

/** Episodes 2+ — interactive player (chapter scenes) + chapter reader. */
export function ChapterStoryExperience({ story }: ChapterStoryExperienceProps) {
  const scenes = useMemo(() => chaptersToStoryScenes(story), [story]);

  return (
    <StoryDualModeExperience
      story={story}
      scenes={scenes}
      showCoverBanner
      introEyebrow={`Episode ${story.episodeNumber} · ${story.privacyTopic}`}
      introBody="Follow the story scene by scene with narration and your episode cover art, or read the same chapters calmly at your own pace. Switch anytime—family activities appear when you finish either path."
    />
  );
}
