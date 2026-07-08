import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { FamilyProgressProvider } from '../contexts/FamilyProgressContext';
import { HUB_CURRENT_MEMBER_KEY, HUB_FAMILY_PROGRESS_KEY } from '../familyhub/hubFamilyMembers';
import {
  MissionShellGameProvider,
  useGameCompletion,
} from './familyProgressIntegration';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <FamilyProgressProvider>{children}</FamilyProgressProvider>
);

const missionWrapper = ({ children }: { children: React.ReactNode }) => (
  <FamilyProgressProvider>
    <MissionShellGameProvider>{children}</MissionShellGameProvider>
  </FamilyProgressProvider>
);

describe('familyProgressIntegration', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(HUB_CURRENT_MEMBER_KEY, JSON.stringify(7));
  });

  it('records standalone game completion for the active member', () => {
    const { result } = renderHook(() => useGameCompletion(), { wrapper });

    act(() => {
      result.current.recordGameCompletion('privacy-decoder', 'Privacy Policy Decoder', 80, 100);
    });

    const stored = JSON.parse(localStorage.getItem(HUB_FAMILY_PROGRESS_KEY) || '{}') as Record<
      string,
      { activities: { activityId: string; activityType: string }[] }
    >;
    expect(stored['7']?.activities).toHaveLength(1);
    expect(stored['7']?.activities[0]?.activityId).toBe('privacy-decoder');
    expect(stored['7']?.activities[0]?.activityType).toBe('game');
  });

  it('skips game-level recording when embedded in MissionShell', () => {
    const { result } = renderHook(() => useGameCompletion(), { wrapper: missionWrapper });

    act(() => {
      result.current.recordGameCompletion('privacy-decoder', 'Privacy Policy Decoder', 80, 100);
    });

    const stored = JSON.parse(localStorage.getItem(HUB_FAMILY_PROGRESS_KEY) || '{}') as Record<string, unknown>;
    expect(stored['7']).toBeUndefined();
  });
});
