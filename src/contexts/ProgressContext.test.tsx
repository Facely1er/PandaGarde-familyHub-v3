import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { ProgressProvider, useProgress } from './ProgressContext';
import { getHubActivityCatalogCount } from '../lib/hubProgress';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ProgressProvider>{children}</ProgressProvider>
);

describe('ProgressContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('marks a mission complete and persists to localStorage', () => {
    const { result } = renderHook(() => useProgress(), { wrapper });

    act(() => {
      result.current.markActivityCompleted('pack-digital-backpack', 88, 5);
    });

    expect(result.current.progress.completedActivities).toContain('pack-digital-backpack');
    expect(result.current.getActivityProgress('pack-digital-backpack')?.score).toBe(88);
    expect(result.current.progress.totalTimeSpent).toBe(5);

    const stored = JSON.parse(localStorage.getItem('pandagarde_progress') || '{}') as {
      completedActivities: string[];
    };
    expect(stored.completedActivities).toContain('pack-digital-backpack');
  });

  it('does not duplicate completion when the same mission is marked again', () => {
    const { result } = renderHook(() => useProgress(), { wrapper });

    act(() => {
      result.current.markActivityCompleted('pack-digital-backpack', 70, 5);
    });
    act(() => {
      result.current.markActivityCompleted('pack-digital-backpack', 95, 10);
    });

    expect(result.current.progress.completedActivities).toEqual(['pack-digital-backpack']);
    expect(result.current.getActivityProgress('pack-digital-backpack')?.score).toBe(70);
    expect(result.current.progress.totalTimeSpent).toBe(5);
  });

  it('awards first_activity on the first completion', () => {
    const { result } = renderHook(() => useProgress(), { wrapper });

    act(() => {
      result.current.markActivityCompleted('secret-keeper-club', 100, 6);
    });

    expect(result.current.progress.achievements).toContain('first_activity');
  });

  it('reports overall progress against the mission catalog', () => {
    const { result } = renderHook(() => useProgress(), { wrapper });
    const catalogCount = getHubActivityCatalogCount();

    act(() => {
      result.current.markActivityCompleted('pack-digital-backpack', 90, 5);
    });

    const overall = result.current.getOverallProgress();
    expect(overall.totalCount).toBe(catalogCount);
    expect(overall.completedCount).toBe(1);
    expect(overall.averageScore).toBe(90);
  });
});
