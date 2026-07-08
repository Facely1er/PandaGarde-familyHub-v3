import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { buildMissionHubUrl, buildStoriesIndexUrl, buildStoryUrl } from './storyHubLinks';

describe('storyHubLinks', () => {
  const originalEnv = import.meta.env.VITE_HUB_STANDALONE;
  const originalWebsite = import.meta.env.VITE_WEBSITE_URL;

  beforeEach(() => {
    vi.stubEnv('VITE_HUB_STANDALONE', 'false');
    vi.stubEnv('VITE_WEBSITE_URL', 'https://www.pandagarde.com');
  });

  afterEach(() => {
    vi.stubEnv('VITE_HUB_STANDALONE', originalEnv);
    vi.stubEnv('VITE_WEBSITE_URL', originalWebsite);
  });

  it('builds in-app story paths on the marketing site', () => {
    expect(buildStoryUrl('mika-and-the-sneaky-settings')).toBe('/stories/mika-and-the-sneaky-settings');
    expect(buildStoriesIndexUrl()).toBe('/stories');
  });

  it('builds mission deep links with query param', () => {
    expect(buildMissionHubUrl('app-permission-inspector')).toBe(
      '/family-hub/activities?mission=app-permission-inspector'
    );
  });
});

describe('storyHubLinks standalone', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_HUB_STANDALONE', 'true');
    vi.stubEnv('VITE_WEBSITE_URL', 'https://www.pandagarde.com');
  });

  it('builds absolute story URLs for Capacitor', () => {
    expect(buildStoryUrl('pos-toughest-question')).toBe(
      'https://pandagarde.com/stories/pos-toughest-question'
    );
    expect(buildMissionHubUrl('trusted-adults-online')).toBe('/activities?mission=trusted-adults-online');
  });
});
