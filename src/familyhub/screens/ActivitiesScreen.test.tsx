import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ProgressProvider } from '../../contexts/ProgressContext';
import { FamilyProgressProvider } from '../../contexts/FamilyProgressContext';
import { FamilyProvider } from '../../contexts/FamilyContext';
import ActivitiesScreen from './ActivitiesScreen';

const renderScreen = () =>
  render(
    <MemoryRouter>
      <FamilyProvider>
        <ProgressProvider>
          <FamilyProgressProvider>
            <ActivitiesScreen />
          </FamilyProgressProvider>
        </ProgressProvider>
      </FamilyProvider>
    </MemoryRouter>
  );

describe('ActivitiesScreen', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows rich card metadata and completion cues', async () => {
    localStorage.setItem(
      'pandagarde_progress',
      JSON.stringify({
        completedActivities: ['pack-digital-backpack'],
        activityDetails: {
          'pack-digital-backpack': {
            activityId: 'pack-digital-backpack',
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

    expect(screen.getByRole('heading', { name: /All missions/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Real-life situation/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Start mission/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Completed · 88%/i).length).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/Help younger children tell the difference between friendly facts and private details\./i)
        .length
    ).toBeGreaterThan(0);
  });

  it('keeps age and goal filters visible after selection', async () => {
    const user = userEvent.setup();

    renderScreen();

    await user.click(screen.getByRole('tab', { name: /Digital Citizens/i }));
    expect(screen.getByRole('tab', { name: /Digital Citizens/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'All goals' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Account security' }));
    expect(screen.getByRole('tab', { name: /Digital Citizens/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Account security' })).toBeInTheDocument();
  });

  it('filters activities by age and learning goal', async () => {
    const user = userEvent.setup();

    renderScreen();

    await user.click(screen.getByRole('button', { name: 'Account security' }));
    await user.click(screen.getByRole('tab', { name: /Digital Citizens/i }));

    expect(screen.getAllByText(/Password Fortress Builder/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Pack Your Digital Backpack/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Privacy Rights Challenge/i)).not.toBeInTheDocument();
  });

  it('opens mission shell intro with family talk content for footprint activities', async () => {
    const user = userEvent.setup();

    renderScreen();

    await user.click(screen.getAllByRole('button', { name: /Start activity: Digital Footprint Trail/i })[0]);

    expect(screen.getByRole('heading', { level: 2, name: /Digital Footprint Trail/i })).toBeInTheDocument();
    expect(screen.getByText(/Read & talk/i)).toBeInTheDocument();
    expect(screen.getByText(/Family prompt/i)).toBeInTheDocument();
    expect(screen.getByText(/Discussion starters/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Pick one favourite app together and list what it probably knows/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/After this mission/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Start interactive activity/i })
    ).toBeInTheDocument();
  });

  it('shows personalized scenario when premium and parent sets app name', async () => {
    localStorage.setItem(
      'pandagarde_premium_entitlement',
      JSON.stringify({ active: true, source: 'pilot-code' })
    );
    localStorage.setItem(
      'pandagarde_mission_scenario_overrides',
      JSON.stringify({
        'digital-footprint-trail': { appName: 'Minecraft', childName: 'Sam', usageFrequency: 'every weekend' },
      })
    );

    renderScreen();

    expect(screen.getAllByText(/Sam has played Minecraft every weekend/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Personalized/i).length).toBeGreaterThan(0);
  });
});
