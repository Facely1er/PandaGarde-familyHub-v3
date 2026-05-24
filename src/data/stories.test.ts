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

  it('publishes all three registry episodes', () => {
    const published = getPublishedStories();
    const slugs = published.map((s) => s.slug);
    expect(slugs).toEqual([
      'privacy-panda-and-the-digital-bamboo-forest',
      'miki-and-the-photo-that-flew-away',
      'owen-and-the-sneaky-settings',
    ]);
    expect(STORIES.every((s) => isStoryPublished(s))).toBe(true);
  });

  it('lists continuation episodes without the foundation story', () => {
    const continuation = getContinuationStories();
    expect(continuation.map((s) => s.episodeNumber)).toEqual([2, 3]);
    expect(continuation.every((s) => !isFoundationStory(s))).toBe(true);
  });

  it('returns no coming-soon story when all episodes are published', () => {
    expect(getNextScheduledStory()).toBeUndefined();
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
