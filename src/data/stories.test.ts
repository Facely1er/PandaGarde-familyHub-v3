import { describe, expect, it } from 'vitest';
import {
  ORIGIN_STORY_SLUG,
  STORIES,
  getFoundationStory,
  getNextScheduledStory,
  getPublishedStories,
  getStoryBySlug,
  isFoundationStory,
  isStoryPublished,
} from './stories';
import { storyScenes } from './storyScenes';

describe('stories registry', () => {
  it('exposes the origin story slug and foundation story', () => {
    const foundation = getFoundationStory();
    expect(foundation?.slug).toBe(ORIGIN_STORY_SLUG);
    expect(isFoundationStory(foundation!)).toBe(true);
  });

  it('hides scheduled future episodes from published list', () => {
    const published = getPublishedStories();
    const slugs = published.map((s) => s.slug);
    expect(slugs).toContain('privacy-panda-and-the-digital-bamboo-forest');
    expect(slugs).toContain('miki-and-the-photo-that-flew-away');
    expect(slugs).not.toContain('owen-and-the-sneaky-settings');
  });

  it('returns next scheduled story for coming-soon banner', () => {
    const next = getNextScheduledStory();
    expect(next?.slug).toBe('owen-and-the-sneaky-settings');
    expect(next?.scheduledAt).toBe('2026-09-01');
    expect(isStoryPublished(next!)).toBe(false);
  });

  it('resolves slugs for all registry entries', () => {
    for (const story of STORIES) {
      expect(getStoryBySlug(story.slug)?.id).toBe(story.id);
    }
  });
});

describe('storyScenes assets', () => {
  it('references a unique image path for every scene', () => {
    const urls = storyScenes.map((s) => s.imageUrl).filter(Boolean);
    expect(urls.length).toBe(storyScenes.length);
    expect(new Set(urls).size).toBe(urls.length);
    for (const url of urls) {
      expect(url).toMatch(/^\/images\/story\/[\w-]+\.png$/);
    }
  });
});
