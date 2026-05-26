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
      resumePath: '/service-catalog',
    }));
    expect(state.phases).toHaveLength(4);
    expect(state.phases.every((phase) => !phase.completed && !phase.visited)).toBe(true);
  });

  it('falls back safely when saved state is invalid JSON', () => {
    window.localStorage.setItem(DFA_JOURNEY_STORAGE_KEY, '{bad-json');

    const state = loadDfaJourneyState();

    expect(state).toEqual(expect.objectContaining({
      progressPercent: 0,
      resumePath: '/service-catalog',
    }));
    expect(state.phases).toHaveLength(4);
  });

  it('updates a phase and recalculates progress plus resume path', () => {
    const updated = updateDfaJourneyPhase('dfa', {
      visited: true,
      completed: true,
      resumePath: '/stories',
    });

    expect(updated.progressPercent).toBe(50);
    expect(updated.resumePath).toBe('/stories');

    const dfaPhase = updated.phases.find((phase) => phase.key === 'dfa');
    expect(dfaPhase).toEqual(expect.objectContaining({
      visited: true,
      completed: true,
    }));

    const reloaded = loadDfaJourneyState();
    expect(reloaded.progressPercent).toBe(50);
    expect(reloaded.resumePath).toBe('/stories');
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

    expect(state.progressPercent).toBe(50);
    expect(state.resumePath).toBe('/digital-footprint');
    expect(state.phases.find((phase) => phase.key === 'profile')?.completed).toBe(true);
    expect(state.phases.find((phase) => phase.key === 'plan')?.optional).toBe(true);
  });

  it('migrates legacy /get-started resume paths to the next core phase', () => {
    window.localStorage.setItem(
      DFA_JOURNEY_STORAGE_KEY,
      JSON.stringify({
        resumePath: '/get-started',
      })
    );

    const state = loadDfaJourneyState();

    expect(state.resumePath).toBe('/service-catalog');
  });

  it('does not count optional Family Hub toward progress or resume path', () => {
    window.localStorage.setItem(
      DFA_JOURNEY_STORAGE_KEY,
      JSON.stringify({
        phases: [
          { key: 'profile', visited: true, completed: true },
          { key: 'dfa', visited: true, completed: true },
          { key: 'plan', visited: true, completed: true },
          { key: 'hub', visited: true, completed: true },
        ],
      })
    );

    const state = loadDfaJourneyState();

    expect(state.progressPercent).toBe(100);
    expect(state.resumePath).toBe('/digital-footprint');
    expect(state.phases.find((phase) => phase.key === 'hub')?.optional).toBe(true);
  });
});
