import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProgressProvider } from '../../contexts/ProgressContext';
import { FamilyProgressProvider } from '../../contexts/FamilyProgressContext';
import { HUB_CURRENT_MEMBER_KEY, HUB_FAMILY_PROGRESS_KEY } from '../hubFamilyMembers';
import type { FlattenedAgeBasedActivity } from '../../data/ageBasedActivities';
import { getCompletionId } from '../../lib/hubMission';
import MissionShell from './MissionShell';

const conversationOnlyMission: FlattenedAgeBasedActivity = {
  id: 'test-conversation-mission',
  name: 'Test Conversation Mission',
  icon: '🐼',
  description: 'Test mission for progress attribution.',
  realLifeScenario: 'A friend asks for your password.',
  learningObjective: 'Never share passwords.',
  keyLearnings: ['Passwords stay private'],
  discussionPrompts: ['What would you do?'],
  familyPrompt: 'Talk about passwords at dinner.',
  nextStep: 'Review device settings together.',
  duration: '5 min',
  difficulty: 'Beginner',
  focus: 'Safe sharing',
  familyMode: 'Talk together',
  featured: false,
  groupAgeRange: '9-12',
  groupLabel: 'Ages 9–12',
  groupIcon: '🕵️',
};

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ProgressProvider>
    <FamilyProgressProvider>{children}</FamilyProgressProvider>
  </ProgressProvider>
);

describe('MissionShell', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('records per-child progress when an active member is selected', async () => {
    const user = userEvent.setup();
    localStorage.setItem(HUB_CURRENT_MEMBER_KEY, JSON.stringify(12));

    render(
      <Wrapper>
        <MissionShell
          activity={conversationOnlyMission}
          completedIds={new Set()}
          onExit={() => undefined}
        />
      </Wrapper>
    );

    await user.click(screen.getByRole('button', { name: /let's go/i }));
    await user.click(screen.getByRole('button', { name: /we had our family conversation/i }));

    const familyProgress = JSON.parse(localStorage.getItem(HUB_FAMILY_PROGRESS_KEY) || '{}') as Record<
      string,
      { activities: { activityId: string; score: number }[] }
    >;
    expect(familyProgress['12']).toBeDefined();
    expect(familyProgress['12'].activities[0].activityId).toBe(getCompletionId(conversationOnlyMission));
    expect(familyProgress['12'].activities[0].score).toBe(100);
  });
});
