import { describe, it, expect, beforeEach } from 'vitest';
import {
  HUB_CURRENT_MEMBER_KEY,
  HUB_FAMILY_PROGRESS_KEY,
  clearActiveMemberIfMatches,
  removeMemberProgressFromStorage,
} from './hubFamilyMembers';

describe('hubFamilyMembers storage helpers', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('removeMemberProgressFromStorage deletes progress for a member', () => {
    localStorage.setItem(
      HUB_FAMILY_PROGRESS_KEY,
      JSON.stringify({
        '42': { memberId: 42, activities: [], totalScore: 0, completedCount: 0, lastActive: '' },
        '99': { memberId: 99, activities: [], totalScore: 0, completedCount: 0, lastActive: '' },
      })
    );

    removeMemberProgressFromStorage(42);

    const remaining = JSON.parse(localStorage.getItem(HUB_FAMILY_PROGRESS_KEY) || '{}') as Record<string, unknown>;
    expect(remaining['42']).toBeUndefined();
    expect(remaining['99']).toBeDefined();
  });

  it('clearActiveMemberIfMatches clears selection only for removed member', () => {
    localStorage.setItem(HUB_CURRENT_MEMBER_KEY, JSON.stringify(7));
    clearActiveMemberIfMatches(7);
    expect(localStorage.getItem(HUB_CURRENT_MEMBER_KEY)).toBeNull();

    localStorage.setItem(HUB_CURRENT_MEMBER_KEY, JSON.stringify(7));
    clearActiveMemberIfMatches(8);
    expect(localStorage.getItem(HUB_CURRENT_MEMBER_KEY)).toBe(JSON.stringify(7));
  });
});
