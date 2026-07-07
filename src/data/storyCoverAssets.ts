import type { Story } from './stories';

/** Grid order → slug (Ep 1–16). Art may be thematic placeholder until panels are remapped. */
const EPISODE_SLUGS = [
  'privacy-panda-and-the-digital-bamboo-forest',
  'miki-and-the-photo-that-flew-away',
  'billys-invisible-collection',
  'mika-and-the-sneaky-settings',
  'ruby-and-the-very-friendly-stranger',
  'the-day-the-password-was-too-short',
  'when-miki-said-something-unkind',
  'pos-toughest-question',
  'the-echo-chamber',
  'vex-and-the-borrowed-face',
  'what-mika-forgot-to-forget',
  'kais-accidental-machine',
  'the-night-the-stream-went-dark',
  'lumis-light',
  'the-weight-of-a-screenshot',
  'the-forest-agreement',
] as const;

const coverModules = import.meta.glob('../assets/story-covers/episode-*-cover.webp', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

function coverUrlForEpisode(episodeNumber: number): string | undefined {
  if (episodeNumber < 1 || episodeNumber > EPISODE_SLUGS.length) {
    return undefined;
  }
  const key = `../assets/story-covers/episode-${episodeNumber}-cover.webp`;
  return coverModules[key];
}

/** Bundled cover URLs keyed by story slug (Episodes 1–16 when webp assets exist). */
export const STORY_COVER_BY_SLUG: Record<string, string> = Object.fromEntries(
  EPISODE_SLUGS.flatMap((slug, index) => {
    const url = coverUrlForEpisode(index + 1);
    return url ? [[slug, url] as const] : [];
  }),
);

export function hasStoryBundledCover(story: Story): boolean {
  return Boolean(STORY_COVER_BY_SLUG[story.slug]);
}

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
  return 'center';
}
