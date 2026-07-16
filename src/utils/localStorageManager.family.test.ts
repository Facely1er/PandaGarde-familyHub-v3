import { describe, it, expect, beforeEach } from 'vitest';
import { localStorageManager } from './localStorageManager';

describe('localStorageManager family data', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('round-trips encrypted family members with readable PII fields', async () => {
    const family = {
      id: 'family_1',
      name: 'Test Family',
      created_by: 'user_1',
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-01T00:00:00.000Z',
      members: [
        {
          id: 'member_1',
          user_id: 'user_child',
          family_id: 'family_1',
          role: 'child',
          first_name: 'Alex',
          last_name: 'Kim',
          email: 'alex@device.local',
          created_at: '2026-01-01T00:00:00.000Z',
          updated_at: '2026-01-01T00:00:00.000Z',
          profile_data: { age: 9 },
        },
      ],
    };

    await localStorageManager.saveFamilyData(family);
    const loaded = (await localStorageManager.getFamilyData()) as typeof family;

    expect(loaded.members[0].first_name).toBe('Alex');
    expect(loaded.members[0].last_name).toBe('Kim');
    expect(loaded.members[0].profile_data?.age).toBe(9);
  });

  it('keeps encryption user ids aligned with hub family sync key', async () => {
    localStorage.setItem('pandagarde_current_user_id', 'user_sync_test');
    await localStorageManager.saveFamilyData({ id: 'family_x', members: [] });

    expect(localStorage.getItem('pandagarde_user_id')).toBe('user_sync_test');
  });
});
