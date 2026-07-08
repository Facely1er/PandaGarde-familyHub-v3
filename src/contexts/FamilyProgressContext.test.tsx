import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { FamilyProgressProvider, useFamilyProgress } from './FamilyProgressContext';
import { HUB_FAMILY_PROGRESS_KEY } from '../familyhub/hubFamilyMembers';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <FamilyProgressProvider>{children}</FamilyProgressProvider>
);

describe('FamilyProgressContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('removeMemberProgress removes stored activities for that member', () => {
    const { result } = renderHook(() => useFamilyProgress(), { wrapper });

    act(() => {
      result.current.recordActivityCompletion(5, 'quiz', 'Quiz', 'game', 80, 100);
    });

    act(() => {
      result.current.removeMemberProgress(5);
    });

    expect(result.current.getMemberProgress(5)).toBeNull();

    const stored = JSON.parse(localStorage.getItem(HUB_FAMILY_PROGRESS_KEY) || '{}') as Record<string, unknown>;
    expect(stored['5']).toBeUndefined();
  });

  it('updates score when the same journey activity is completed again with a higher score', () => {
    const { result } = renderHook(() => useFamilyProgress(), { wrapper });

    act(() => {
      result.current.recordActivityCompletion(3, 'ai-and-your-privacy', 'AI & Your Privacy', 'journey', 60, 100);
    });
    act(() => {
      result.current.recordActivityCompletion(3, 'ai-and-your-privacy', 'AI & Your Privacy', 'journey', 90, 100);
    });

    const member = result.current.getMemberProgress(3);
    expect(member?.activities).toHaveLength(1);
    expect(member?.activities[0]?.score).toBe(90);
    expect(member?.completedCount).toBe(1);
  });

  it('keeps separate records for missions that share the same game id', () => {
    const { result } = renderHook(() => useFamilyProgress(), { wrapper });

    act(() => {
      result.current.recordActivityCompletion(
        2,
        'app-permission-inspector',
        'App Permission Inspector',
        'journey',
        85,
        100
      );
    });
    act(() => {
      result.current.recordActivityCompletion(
        2,
        'privacy-settings-pro',
        'Privacy Settings Pro',
        'journey',
        92,
        100
      );
    });

    const member = result.current.getMemberProgress(2);
    expect(member?.activities).toHaveLength(2);
    expect(member?.completedCount).toBe(2);
  });
});
