import { describe, expect, it } from 'vitest';
import {
  ORIGIN_STORY_SLUG,
  STORIES,
  getContinuationStories,
  getFoundationStory,
  getNextScheduledStory,
  getPublishedStories,
  getStoryBySlug,
  isFoundationStory,
  isStoryPublished,
} from './stories';
import { foundationStoryScenes, storyScenes } from './storyScenes';

describe('stories registry', () => {
  it('exposes the origin story slug and foundation story', () => {
    const foundation = getFoundationStory();
    expect(foundation?.slug).toBe(ORIGIN_STORY_SLUG);
    expect(isFoundationStory(foundation!)).toBe(true);
  });

  it('registers sixteen episodes across two seasons', () => {
    expect(STORIES).toHaveLength(16);
    expect(STORIES.map((s) => s.episodeNumber)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
    ]);
  });

  it('uses canonical Season 1 slugs for episodes 1–4', () => {
    const slugs = STORIES.slice(0, 4).map((s) => s.slug);
    expect(slugs).toEqual([
      'privacy-panda-and-the-digital-bamboo-forest',
      'miki-and-the-photo-that-flew-away',
      'billys-invisible-collection',
      'mika-and-the-sneaky-settings',
    ]);
  });

  it('publishes episodes without a future scheduledAt', () => {
    const published = getPublishedStories();
    expect(published.length).toBeGreaterThanOrEqual(13);
    expect(published.every((s) => isStoryPublished(s))).toBe(true);
    expect(published.some((s) => s.slug === 'billys-invisible-collection')).toBe(true);
  });

  it('lists continuation episodes without the foundation story', () => {
    const continuation = getContinuationStories();
    expect(continuation.every((s) => !isFoundationStory(s))).toBe(true);
    expect(continuation[0]?.episodeNumber).toBe(2);
  });

  it('returns the next scheduled story when future episodes exist', () => {
    const next = getNextScheduledStory();
    expect(next?.slug).toBe('lumis-light');
  });

  it('resolves slugs for all registry entries', () => {
    for (const story of STORIES) {
      expect(getStoryBySlug(story.slug)?.id).toBe(story.id);
    }
  });
});

describe('storyScenes assets', () => {
  it('keeps storyScenes as an alias for foundation episode scenes', () => {
    expect(storyScenes).toBe(foundationStoryScenes);
  });

  it('references a unique image path for every scene', () => {
    const urls = foundationStoryScenes.map((s) => s.imageUrl).filter(Boolean);
    expect(urls.length).toBe(foundationStoryScenes.length);
    expect(new Set(urls).size).toBe(urls.length);
    for (const url of urls) {
      expect(url).toMatch(/^\/images\/story\/[\w-]+\.png$/);
    }
  });
});
