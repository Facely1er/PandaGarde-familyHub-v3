import { ORIGIN_STORY_SLUG } from '../data/stories';

const PREFIX = 'pandagarde';

export function storyProgressKey(slug: string): string {
  return `${PREFIX}:story-progress:${slug}`;
}

export function storyChoicesKey(slug: string): string {
  return `${PREFIX}:story-choices:${slug}`;
}

/** One-time migration from legacy global keys (episode 1 only). */
export function migrateLegacyStoryStorage(slug: string): void {
  if (slug !== ORIGIN_STORY_SLUG) {
    return;
  }

  const legacyProgress = localStorage.getItem('story-progress');
  const scopedProgress = storyProgressKey(slug);
  if (legacyProgress && !localStorage.getItem(scopedProgress)) {
    localStorage.setItem(scopedProgress, legacyProgress);
  }
  if (legacyProgress) {
    localStorage.removeItem('story-progress');
  }

  const legacyChoices = localStorage.getItem('story-choices');
  const scopedChoices = storyChoicesKey(slug);
  if (legacyChoices && !localStorage.getItem(scopedChoices)) {
    localStorage.setItem(scopedChoices, legacyChoices);
  }
  if (legacyChoices) {
    localStorage.removeItem('story-choices');
  }
}
