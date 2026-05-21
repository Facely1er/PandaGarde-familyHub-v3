import {
  DFA_JOURNEY_STORAGE_KEY,
  loadDfaJourneyState,
  updateDfaJourneyPhase,
} from './dfaJourney';

describe('dfaJourney', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('returns the default state when nothing is saved', () => {
    const state = loadDfaJourneyState();

    expect(state).toEqual(expect.objectContaining({
      progressPercent: 0,
      resumePath: '/get-started',
    }));
    expect(state.phases).toHaveLength(4);
    expect(state.phases.every((phase) => !phase.completed && !phase.visited)).toBe(true);
  });

  it('falls back safely when saved state is invalid JSON', () => {
    window.localStorage.setItem(DFA_JOURNEY_STORAGE_KEY, '{bad-json');

    const state = loadDfaJourneyState();

    expect(state).toEqual(expect.objectContaining({
      progressPercent: 0,
      resumePath: '/get-started',
    }));
    expect(state.phases).toHaveLength(4);
  });

  it('updates a phase and recalculates progress plus resume path', () => {
    const updated = updateDfaJourneyPhase('dfa', {
      visited: true,
      completed: true,
      resumePath: '/privacy-assessment',
    });

    expect(updated.progressPercent).toBe(25);
    expect(updated.resumePath).toBe('/service-catalog');

    const dfaPhase = updated.phases.find((phase) => phase.key === 'dfa');
    expect(dfaPhase).toEqual(expect.objectContaining({
      visited: true,
      completed: true,
    }));

    const reloaded = loadDfaJourneyState();
    expect(reloaded.progressPercent).toBe(25);
    expect(reloaded.resumePath).toBe('/service-catalog');
  });

  it('normalizes incomplete saved phases and computes the next incomplete path', () => {
    window.localStorage.setItem(
      DFA_JOURNEY_STORAGE_KEY,
      JSON.stringify({
        phases: [
          { id: 1, key: 'profile', visited: true, completed: true },
          { id: 2, key: 'dfa', visited: true, completed: false },
        ],
      })
    );

    const state = loadDfaJourneyState();

    expect(state.progressPercent).toBe(25);
    expect(state.resumePath).toBe('/digital-footprint');
    expect(state.phases.find((phase) => phase.key === 'profile')?.completed).toBe(true);
    expect(state.phases.find((phase) => phase.key === 'plan')?.visited).toBe(false);
  });
});
