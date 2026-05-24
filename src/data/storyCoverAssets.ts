import type { Story } from './stories';

/** Episode order must match crop script grid: row-major 1–8. */
const EPISODE_SLUGS = [
  'privacy-panda-and-the-digital-bamboo-forest',
  'miki-and-the-photo-that-flew-away',
  'billys-invisible-collection',
  'mika-and-the-sneaky-settings',
  'ruby-and-the-very-friendly-stranger',
  'the-day-the-password-was-too-short',
  'when-miki-said-something-unkind',
  'pos-toughest-question',
] as const;

const coverModules = import.meta.glob('../assets/story-covers/episode-*-cover.webp', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

function coverUrlForEpisode(episodeNumber: number): string | undefined {
  const key = `../assets/story-covers/episode-${episodeNumber}-cover.webp`;
  return coverModules[key];
}

/** Bundled cover URLs (Vite resolves at build time). Only existing WebPs are included. */
export const STORY_COVER_BY_SLUG: Record<string, string> = Object.fromEntries(
  EPISODE_SLUGS.flatMap((slug, index) => {
    const url = coverUrlForEpisode(index + 1);
    return url ? [[slug, url] as const] : [];
  }),
);

/** Per-episode object-position hints when poster title chrome was trimmed in crop. */
const COVER_POSITION_BY_SLUG: Record<string, string> = {
  'privacy-panda-and-the-digital-bamboo-forest': '32% center',
  'mika-and-the-photo-that-flew-away': 'center',
  'billys-invisible-collection': 'center',
  'mika-and-the-sneaky-settings': 'center top',
};

export function getStoryCoverUrl(story: Story): string | undefined {
  return STORY_COVER_BY_SLUG[story.slug] ?? story.coverImage;
}

export function getStoryCoverPosition(story: Story, variant: 'hero' | 'card'): string {
  if (variant === 'hero' && story.coverHeroImagePosition) {
    return story.coverHeroImagePosition;
  }
  if (story.coverImagePosition) {
    return story.coverImagePosition;
  }
  return COVER_POSITION_BY_SLUG[story.slug] ?? 'center';
}
