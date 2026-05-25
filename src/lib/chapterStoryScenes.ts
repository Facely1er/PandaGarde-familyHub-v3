import type { StorySceneData } from '../data/storyScenes';
import type { CharacterRole, Story, StoryChapter } from '../data/stories';
import { getStoryCoverUrl } from '../data/storyCoverAssets';

const CHARACTER_BY_ROLE: Partial<Record<CharacterRole, StorySceneData['character']>> = {
  po: 'panda',
  tao: 'turtle',
  miki: 'monkey',
  ruby: 'rabbit',
  billy: 'beaver',
  mika: 'owl',
  kai: 'fox',
  fiona: 'fox',
  lumi: 'owl',
};

const MOOD_BY_BEAT: StorySceneData['mood'][] = ['peaceful', 'tense', 'mysterious', 'peaceful'];
const ANIM_BY_BEAT: StorySceneData['animation'][] = ['appear', 'shake', 'nod', 'wave'];

function backgroundForZone(zone: Story['forestZone']): StorySceneData['background'] {
  if (zone === 'crystal-stream') return 'river';
  if (zone === 'taos-hollow') return 'cave';
  if (zone === 'great-archive') return 'digital';
  return 'forest';
}

function sceneDuration(chapter: StoryChapter): number {
  const words = chapter.content.split(/\s+/).filter(Boolean).length;
  return Math.min(28, Math.max(10, Math.round(words / 12)));
}

/** Map published chapter copy into linear interactive scenes (Episodes 2+). */
export function chaptersToStoryScenes(story: Story): StorySceneData[] {
  const coverUrl = getStoryCoverUrl(story);
  const character = CHARACTER_BY_ROLE[story.leadCharacter] ?? 'panda';
  const background = backgroundForZone(story.forestZone);

  return story.chapters.map((chapter, index) => ({
    id: chapter.id,
    title: chapter.title,
    content: chapter.content,
    imageUrl: coverUrl,
    character,
    animation: ANIM_BY_BEAT[index] ?? 'nod',
    background,
    timeOfDay: index < 2 ? 'afternoon' : 'evening',
    weather: 'sunny',
    mood: MOOD_BY_BEAT[index] ?? 'peaceful',
    duration: sceneDuration(chapter),
  }));
}
