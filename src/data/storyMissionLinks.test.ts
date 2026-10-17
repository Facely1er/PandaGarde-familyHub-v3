import { describe, expect, it } from 'vitest';
import { getPublishedStories } from './stories';
import {
  getMissionsForStory,
  getPrimaryMissionForStory,
  getStorySlugForMission,
  MISSION_STORY_LINKS,
  STORY_MISSION_LINKS,
} from './storyMissionLinks';

describe('storyMissionLinks', () => {
  it('maps every hub mission to a story slug', () => {
    const missionIds = Object.keys(MISSION_STORY_LINKS);
    expect(missionIds).toHaveLength(18);
    for (const id of missionIds) {
      expect(getStorySlugForMission(id)).toBeTruthy();
    }
  });

  it('links every published story to at least one hub mission', () => {
    for (const story of getPublishedStories()) {
      expect(
        STORY_MISSION_LINKS[story.slug]?.length ?? 0,
        `${story.slug} should have a mission link`,
      ).toBeGreaterThan(0);
      expect(getPrimaryMissionForStory(story.slug)).toBeTruthy();
    }
  });

  it('resolves primary mission for season 1 stories', () => {
    expect(getPrimaryMissionForStory('mika-and-the-sneaky-settings')).toBe('app-permission-inspector');
    expect(getPrimaryMissionForStory('pos-toughest-question')).toBe('trusted-adults-online');
  });

  it('resolves primary mission for previously unlinked season 2 stories', () => {
    expect(getPrimaryMissionForStory('vex-and-the-borrowed-face')).toBe('phishing-patrol');
    expect(getPrimaryMissionForStory('kais-accidental-machine')).toBe('app-permission-inspector');
    expect(getPrimaryMissionForStory('the-night-the-stream-went-dark')).toBe('password-strength-lab');
    expect(getPrimaryMissionForStory('lumis-light')).toBe('online-reputation-audit');
  });

  it('returns all missions linked to a story', () => {
    expect(getMissionsForStory('the-day-the-password-was-too-short')).toEqual([
      'secret-keeper-club',
      'password-strength-lab',
      'password-fortress-builder',
    ]);
  });

  it('returns empty when story has no mission link', () => {
    expect(getMissionsForStory('unknown-slug')).toEqual([]);
    expect(getPrimaryMissionForStory('unknown-slug')).toBeUndefined();
  });
});
