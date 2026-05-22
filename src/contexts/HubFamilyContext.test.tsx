import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { HubFamilyProvider, useHubFamilyMembers } from './HubFamilyContext';
import { FamilyProvider } from './FamilyContext';
import { HUB_FAMILY_STORAGE_KEY } from '../familyhub/hubFamilyMembers';

vi.mock('../familyhub/hubFamilySync', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../familyhub/hubFamilySync')>();
  return {
    ...actual,
    reconcileHubAndContext: vi.fn(async () => actual.loadHubMembers()),
  };
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <FamilyProvider>
    <HubFamilyProvider>{children}</HubFamilyProvider>
  </FamilyProvider>
);

describe('HubFamilyProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('reconciles once and shares members across hook instances', async () => {
    const { reconcileHubAndContext } = await import('../familyhub/hubFamilySync');

    const { result } = renderHook(
      () => {
        const first = useHubFamilyMembers();
        const second = useHubFamilyMembers();
        return { first, second };
      },
      { wrapper }
    );

    await waitFor(() => {
      expect(reconcileHubAndContext).toHaveBeenCalledTimes(1);
    });

    expect(result.current.first.members).toEqual(result.current.second.members);
  });

  it('updateMember persists to Hub storage', async () => {
    localStorage.setItem(
      HUB_FAMILY_STORAGE_KEY,
      JSON.stringify([
        {
          id: 1001,
          name: 'Alex',
          age: 10,
          role: 'Child',
          privacyScore: 0,
          completedActivities: 0,
          badges: [],
          lastActive: new Date().toISOString(),
        },
      ])
    );

    const { result } = renderHook(() => useHubFamilyMembers(), { wrapper });

    await waitFor(() => {
      expect(result.current.members.length).toBeGreaterThan(0);
    });

    const member = result.current.members.find((m) => m.id === 1001);
    expect(member).toBeDefined();

    await result.current.updateMember(member!, { name: 'Alex Kim', age: 11, role: 'Child' });

    const stored = JSON.parse(localStorage.getItem(HUB_FAMILY_STORAGE_KEY) || '[]') as { name: string; age: number }[];
    expect(stored.find((m) => m.name === 'Alex Kim')?.age).toBe(11);
  });
});
