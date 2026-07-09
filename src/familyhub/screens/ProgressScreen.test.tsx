import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProgressProvider } from '../../contexts/ProgressContext';
import ProgressScreen from './ProgressScreen';
import { renderWithHubI18n } from '../../test/renderWithHubI18n';

const renderScreen = () =>
  renderWithHubI18n(
    <MemoryRouter>
      <ProgressProvider>
        <ProgressScreen />
      </ProgressProvider>
    </MemoryRouter>
  );

describe('ProgressScreen', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('counts only the completed mission when two missions share the same game', () => {
    localStorage.setItem(
      'pandagarde_progress',
      JSON.stringify({
        completedActivities: ['app-permission-inspector'],
        activityDetails: {
          'app-permission-inspector': {
            activityId: 'app-permission-inspector',
            completed: true,
            score: 88,
            completedAt: '2026-05-20T08:00:00.000Z',
          },
        },
        totalTimeSpent: 8,
        achievements: ['first_activity'],
        lastUpdated: '2026-05-20T08:00:00.000Z',
      })
    );

    renderScreen();

    expect(screen.getByText(/You've finished 1 of \d+ missions/i)).toBeInTheDocument();
    expect(screen.getByText(/App Permission Inspector/i)).toBeInTheDocument();
    expect(screen.queryByText(/Privacy Settings Pro/i)).not.toBeInTheDocument();
  });
});
