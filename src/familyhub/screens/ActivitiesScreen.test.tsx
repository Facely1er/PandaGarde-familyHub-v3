import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ProgressProvider } from '../../contexts/ProgressContext';
import ActivitiesScreen from './ActivitiesScreen';

const renderScreen = () =>
  render(
    <MemoryRouter>
      <ProgressProvider>
        <ActivitiesScreen />
      </ProgressProvider>
    </MemoryRouter>
  );

describe('ActivitiesScreen', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows richer featured metadata and completion cues', async () => {
    localStorage.setItem(
      'pandagarde_progress',
      JSON.stringify({
        completedActivities: ['sorting'],
        activityDetails: {
          sorting: {
            activityId: 'sorting',
            completed: true,
            score: 88,
            completedAt: '2026-05-20T08:00:00.000Z',
          },
        },
        totalTimeSpent: 12,
        achievements: ['first_activity'],
        lastUpdated: '2026-05-20T08:00:00.000Z',
      })
    );

    renderScreen();

    expect(screen.getByRole('heading', { name: /Featured family picks/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Family cue/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Completed · 88%/i).length).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/Help younger children tell the difference between friendly facts and private details\./i)
        .length
    ).toBeGreaterThan(0);
  });

  it('filters activities by age and learning goal', async () => {
    const user = userEvent.setup();

    renderScreen();

    await user.click(screen.getByRole('button', { name: 'Account security' }));
    await user.click(screen.getByRole('tab', { name: '🌐 Ages 13–17' }));

    expect(screen.getAllByText(/Password Fortress Builder/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Pack Your Digital Backpack/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Privacy Rights Challenge/i)).not.toBeInTheDocument();
  });

  it('shows family reflection details for discussion-based activities', async () => {
    const user = userEvent.setup();

    renderScreen();

    await user.click(screen.getAllByRole('button', { name: /Start activity: Digital Footprint Trail/i })[0]);

    expect(screen.getByText(/Family reflection prompts/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Which bits of data would surprise you if an app collected them about our family\?/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Next family step/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Open the privacy settings for one app you use often and review the data controls together\./i)
    ).toBeInTheDocument();
  });
});
