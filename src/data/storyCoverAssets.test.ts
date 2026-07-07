import { describe, expect, it } from 'vitest';
import { STORIES } from './stories';
import {
  STORY_COVER_BY_SLUG,
  getStoryCoverUrl,
  hasStoryBundledCover,
} from './storyCoverAssets';

const EXPECTED_COVER_SLUGS = [
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

describe('storyCoverAssets', () => {
  it('wires bundled WebP covers for all 16 episodes (Season 1 + Season 2)', () => {
    expect(Object.keys(STORY_COVER_BY_SLUG).sort()).toEqual([...EXPECTED_COVER_SLUGS].sort());

    for (const story of STORIES) {
      expect(hasStoryBundledCover(story)).toBe(true);
      expect(getStoryCoverUrl(story)).toMatch(/episode-\d+-cover\.webp/);
    }
  });

  it('maps Season 2 slugs to episodes 9–16 in grid order', () => {
    const season2 = STORIES.filter((story) => story.season === 2);
    expect(season2).toHaveLength(8);
    expect(season2.map((story) => story.slug)).toEqual(EXPECTED_COVER_SLUGS.slice(8));
  });
});
