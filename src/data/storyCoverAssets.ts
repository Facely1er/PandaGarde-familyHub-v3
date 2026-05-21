import type { Story } from './stories';
import coverEp1 from '../assets/story-covers/episode-1-bamboo-forest.svg?url';
import coverEp2 from '../assets/story-covers/episode-2-photo-consent.svg?url';
import coverEp3 from '../assets/story-covers/episode-3-sneaky-settings.svg?url';

/** Bundled cover URLs (Vite resolves at build time). */
export const STORY_COVER_BY_SLUG: Record<string, string> = {
  'privacy-panda-and-the-digital-bamboo-forest': coverEp1,
  'miki-and-the-photo-that-flew-away': coverEp2,
  'owen-and-the-sneaky-settings': coverEp3,
};

export function getStoryCoverUrl(story: Story): string | undefined {
  return STORY_COVER_BY_SLUG[story.slug] ?? story.coverImage;
}
