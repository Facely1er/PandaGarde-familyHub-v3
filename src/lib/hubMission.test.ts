import { describe, it, expect, beforeEach } from 'vitest';
import {
  getCompletionId,
  pickTodaysMission,
  pickNextMission,
  touchHubStreak,
  getHubStreak,
  HUB_STREAK_KEY,
  HUB_LAST_ACTIVE_KEY,
} from './hubMission';
import { flattenAgeBasedActivities } from '../data/ageBasedActivities';

describe('hubMission', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('getCompletionId prefers activityManagerId', () => {
    expect(
      getCompletionId({ id: 'pack-digital-backpack', activityManagerId: 'sorting' })
    ).toBe('sorting');
    expect(getCompletionId({ id: 'conversation-only' })).toBe('conversation-only');
  });

  it('pickTodaysMission returns featured incomplete first', () => {
    const all = flattenAgeBasedActivities();
    const featured = all.find((a) => a.featured);
    expect(featured).toBeDefined();
    const completed = new Set<string>();
    const pick = pickTodaysMission(completed, featured!.groupAgeRange);
    expect(pick?.featured).toBe(true);
  });

  it('pickNextMission skips current and completed', () => {
    const all = flattenAgeBasedActivities();
    const current = all[0];
    const completed = new Set([getCompletionId(current)]);
    const next = pickNextMission(current, completed);
    expect(next?.id).not.toBe(current.id);
  });

  it('touchHubStreak increments on new days', () => {
    expect(getHubStreak()).toBe(0);
    expect(touchHubStreak()).toBe(1);
    expect(touchHubStreak()).toBe(1);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    localStorage.setItem(HUB_LAST_ACTIVE_KEY, yesterday.toISOString().slice(0, 10));
    localStorage.setItem(HUB_STREAK_KEY, '3');
    expect(touchHubStreak()).toBe(4);
  });
});
