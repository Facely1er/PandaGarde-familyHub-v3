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
});
