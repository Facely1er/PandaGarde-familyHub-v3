import { describe, expect, it } from 'vitest';
import {
  getMissionsForStory,
  getPrimaryMissionForStory,
  getStorySlugForMission,
  MISSION_STORY_LINKS,
} from './storyMissionLinks';

describe('storyMissionLinks', () => {
  it('maps every hub mission to a story slug', () => {
    const missionIds = Object.keys(MISSION_STORY_LINKS);
    expect(missionIds).toHaveLength(18);
    for (const id of missionIds) {
      expect(getStorySlugForMission(id)).toBeTruthy();
    }
  });

  it('resolves primary mission for season 1 stories', () => {
    expect(getPrimaryMissionForStory('mika-and-the-sneaky-settings')).toBe('app-permission-inspector');
    expect(getPrimaryMissionForStory('pos-toughest-question')).toBe('trusted-adults-online');
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
