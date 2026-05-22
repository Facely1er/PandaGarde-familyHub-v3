import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  contextMemberToHub,
  hubEmailForMemberId,
  loadHubMembers,
  reconcileHubAndContext,
  saveHubMembers,
  splitDisplayName,
  stableHubNumericId,
  addHubMemberToStores,
  updateHubMemberInStores,
} from './hubFamilySync';
import { HUB_FAMILY_STORAGE_KEY } from './hubFamilyMembers';
import type { FamilyMember } from '../contexts/FamilyContext';

vi.mock('../utils/localStorageManager', () => {
  const store: Record<string, string> = {};
  const progressByUser: Record<string, { name: string }> = {};

  return {
    localStorageManager: {
      getFamilyData: vi.fn(async () => {
        const raw = store['pandagarde_family_data'];
        return raw ? JSON.parse(raw) : null;
      }),
      saveFamilyData: vi.fn(async (data: unknown) => {
        store['pandagarde_family_data'] = JSON.stringify(data);
      }),
      createUserProgress: vi.fn((userId: string, name: string) => {
        progressByUser[userId] = { name };
        return { id: userId, name };
      }),
      getUserProgress: vi.fn((userId: string) => progressByUser[userId] ?? null),
      saveUserProgress: vi.fn((userId: string, progress: { name: string }) => {
        progressByUser[userId] = progress;
      }),
      deleteUser: vi.fn((userId: string) => {
        delete progressByUser[userId];
      }),
    },
  };
});

describe('hubFamilySync', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('splitDisplayName parses first and last names', () => {
    expect(splitDisplayName('Alex Kim')).toEqual({ firstName: 'Alex', lastName: 'Kim' });
    expect(splitDisplayName('Sam')).toEqual({ firstName: 'Sam', lastName: 'Member' });
  });

  it('stableHubNumericId is deterministic', () => {
    expect(stableHubNumericId('member_abc')).toBe(stableHubNumericId('member_abc'));
  });

  it('contextMemberToHub maps encrypted family rows to Hub shape', () => {
    const contextMember: FamilyMember = {
      id: 'member_ctx_1',
      user_id: 'user_ctx_1',
      family_id: 'family_1',
      role: 'child',
      first_name: 'Jamie',
      last_name: 'Lee',
      email: 'jamie@example.com',
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-02T00:00:00.000Z',
      profile_data: { age: 11 },
    };

    const hub = contextMemberToHub(contextMember);
    expect(hub.name).toBe('Jamie Lee');
    expect(hub.age).toBe(11);
    expect(hub.role).toBe('Child');
    expect(hub.contextMemberId).toBe('member_ctx_1');
    expect(hub.userId).toBe('user_ctx_1');
  });

  it('reconcileHubAndContext imports context members when Hub list is empty', async () => {
    const { localStorageManager } = await import('../utils/localStorageManager');
    await localStorageManager.saveFamilyData({
      id: 'family_1',
      name: 'Test',
      created_by: 'user_1',
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-01T00:00:00.000Z',
      members: [
        {
          id: 'member_1',
          user_id: 'user_child',
          family_id: 'family_1',
          role: 'child',
          first_name: 'Riley',
          last_name: 'Test',
          email: 'riley@test.com',
          created_at: '2026-01-01T00:00:00.000Z',
          updated_at: '2026-01-01T00:00:00.000Z',
          profile_data: { age: 10 },
        },
      ],
    });

    const merged = await reconcileHubAndContext();
    expect(merged).toHaveLength(1);
    expect(merged[0].name).toBe('Riley Test');
    expect(loadHubMembers()).toHaveLength(1);
  });

  it('addHubMemberToStores links Hub member with placeholder email in family data', async () => {
    const linked = await addHubMemberToStores('Taylor Smith', 12, 'Child');
    expect(linked.contextMemberId).toBeDefined();
    expect(hubEmailForMemberId(linked.id)).toBe(`hub+${linked.id}@device.local`);

    const { localStorageManager } = await import('../utils/localStorageManager');
    const family = (await localStorageManager.getFamilyData()) as {
      members: { email: string; profile_data?: { age?: number } }[];
    };
    expect(family.members.some((m) => m.email === hubEmailForMemberId(linked.id))).toBe(true);
    expect(loadHubMembers().some((m) => m.id === linked.id)).toBe(true);
  });

  it('updateHubMemberInStores updates Hub list and context profile age', async () => {
    const linked = await addHubMemberToStores('Sam Park', 8, 'Child');
    const updated = await updateHubMemberInStores(linked, { name: 'Sam Park', age: 9, role: 'Child' });

    expect(updated.age).toBe(9);
    expect(loadHubMembers().find((m) => m.id === linked.id)?.age).toBe(9);

    const { localStorageManager } = await import('../utils/localStorageManager');
    const family = (await localStorageManager.getFamilyData()) as {
      members: { id: string; profile_data?: { age?: number } }[];
    };
    const ctx = family.members.find((m) => m.id === linked.contextMemberId);
    expect(ctx?.profile_data?.age).toBe(9);
  });

  it('reconcileHubAndContext pushes Hub-only members into family data', async () => {
    saveHubMembers([
      {
        id: 4242,
        name: 'Casey Jones',
        age: 9,
        role: 'Child',
        privacyScore: 0,
        completedActivities: 0,
        badges: [],
        lastActive: new Date().toISOString(),
      },
    ]);

    const merged = await reconcileHubAndContext();
    expect(merged.some((m) => m.name === 'Casey Jones' && m.contextMemberId)).toBe(true);
    expect(localStorage.getItem(HUB_FAMILY_STORAGE_KEY)).toContain('Casey Jones');
  });
});
