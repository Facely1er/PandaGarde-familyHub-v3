export type DfaJourneyPhaseKey = 'profile' | 'dfa' | 'plan' | 'hub';

/** Parent-led DFA on PandaGarde: catalog + footprint only (assessment lives on SocialCaution). */
export const DFA_CORE_PHASE_KEYS: readonly DfaJourneyPhaseKey[] = ['profile', 'dfa'];

export interface DfaJourneyPhase {
  id: number;
  key: DfaJourneyPhaseKey;
  title: string;
  description: string;
  path: string;
  completed: boolean;
  visited: boolean;
  /** When true, phase is not counted toward DFA completion % or resume path. */
  optional?: boolean;
  updatedAt?: string;
}

export const isCoreDfaPhase = (phase: Pick<DfaJourneyPhase, 'key' | 'optional'>): boolean =>
  !phase.optional && DFA_CORE_PHASE_KEYS.includes(phase.key);

export const getCoreDfaPhases = (phases: DfaJourneyPhase[]): DfaJourneyPhase[] =>
  phases.filter(isCoreDfaPhase);

export const getOptionalDfaPhases = (phases: DfaJourneyPhase[]): DfaJourneyPhase[] =>
  phases.filter((phase) => phase.optional);

export interface DfaJourneyState {
  phases: DfaJourneyPhase[];
  progressPercent: number;
  resumePath: string;
  lastUpdated: string;
}

export const DFA_JOURNEY_STORAGE_KEY = 'pandagarde_dfa_journey_v1';
export const DFA_JOURNEY_CHANGE_EVENT = 'pandagarde-dfa-journey-change';

const phaseBlueprint: Omit<DfaJourneyPhase, 'completed' | 'visited' | 'updatedAt'>[] = [
  {
    id: 1,
    key: 'profile',
    title: 'Set your starting point',
    description: 'Choose your family context and add the apps or services you want PandaGarde to analyze.',
    path: '/service-catalog',
  },
  {
    id: 2,
    key: 'dfa',
    title: 'Run Digital Footprint Analysis',
    description: 'See where exposure is building across school, home, and everyday services.',
    path: '/digital-footprint',
  },
  {
    id: 3,
    key: 'plan',
    title: 'Stories & follow-through',
    description:
      'Optional: Privacy Panda stories, Family Hub missions, and guides—when your family has time and energy.',
    path: '/stories',
    optional: true,
  },
  {
    id: 4,
    key: 'hub',
    title: 'Family Hub (optional)',
    description:
      'Separate workspace for age-matched privacy missions and kids’ progress — not required to finish parent Digital Footprint Analysis.',
    path: '/family-hub/dashboard',
    optional: true,
  },
];

export const getDefaultDfaJourneyState = (): DfaJourneyState => ({
  phases: phaseBlueprint.map((phase) => ({ ...phase, completed: false, visited: false })),
  progressPercent: 0,
  resumePath: '/service-catalog',
  lastUpdated: new Date().toISOString(),
});

/** Stable default for SSR and useSyncExternalStore server snapshots. */
export const DEFAULT_DFA_JOURNEY_STATE: DfaJourneyState = getDefaultDfaJourneyState();

const journeySnapshotFingerprint = (state: DfaJourneyState): string =>
  JSON.stringify({
    progressPercent: state.progressPercent,
    resumePath: state.resumePath,
    phases: state.phases.map((phase) => ({
      key: phase.key,
      visited: phase.visited,
      completed: phase.completed,
    })),
  });

let cachedJourneySnapshot: DfaJourneyState = DEFAULT_DFA_JOURNEY_STATE;
let cachedJourneyFingerprint = journeySnapshotFingerprint(DEFAULT_DFA_JOURNEY_STATE);

/** Returns a referentially stable snapshot when journey data has not changed. */
export const getDfaJourneySnapshot = (): DfaJourneyState => {
  const loaded = loadDfaJourneyState();
  const fingerprint = journeySnapshotFingerprint(loaded);
  if (fingerprint !== cachedJourneyFingerprint) {
    cachedJourneyFingerprint = fingerprint;
    cachedJourneySnapshot = loaded;
  }
  return cachedJourneySnapshot;
};

const normalizeState = (raw: Partial<DfaJourneyState> | null | undefined): DfaJourneyState => {
  const fallback = getDefaultDfaJourneyState();
  if (!raw) {return fallback;}

  const rawPhases = Array.isArray(raw.phases) ? raw.phases : [];
  const phases = phaseBlueprint.map((phase) => {
    const matched = rawPhases.find((item) => item?.key === phase.key || item?.id === phase.id);
    return {
      ...phase,
      optional: phase.optional ?? false,
      completed: Boolean(matched?.completed),
      visited: Boolean(matched?.visited),
      updatedAt: matched?.updatedAt,
    };
  });

  const corePhases = getCoreDfaPhases(phases);
  const completedCoreCount = corePhases.filter((phase) => phase.completed).length;
  const nextIncompleteCore = corePhases.find((phase) => !phase.completed);
  const defaultResumePath =
    nextIncompleteCore?.path ??
    (completedCoreCount >= corePhases.length ? '/digital-footprint' : '/service-catalog');

  const legacyAssessmentPaths = new Set(['/privacy-assessment', '/assessment', '/quick-assessment']);
  const storedResume =
    raw?.resumePath === '/get-started' || !raw?.resumePath
      ? defaultResumePath
      : legacyAssessmentPaths.has(raw.resumePath)
        ? defaultResumePath
        : raw.resumePath;

  return {
    phases,
    progressPercent:
      corePhases.length > 0 ? Math.round((completedCoreCount / corePhases.length) * 100) : 0,
    resumePath: storedResume,
    lastUpdated: raw.lastUpdated || new Date().toISOString(),
  };
};

export const loadDfaJourneyState = (): DfaJourneyState => {
  if (typeof window === 'undefined') {return getDefaultDfaJourneyState();}
  try {
    const raw = window.localStorage.getItem(DFA_JOURNEY_STORAGE_KEY);
    if (!raw) {return getDefaultDfaJourneyState();}
    return normalizeState(JSON.parse(raw) as Partial<DfaJourneyState>);
  } catch {
    return getDefaultDfaJourneyState();
  }
};

export const saveDfaJourneyState = (state: DfaJourneyState): void => {
  if (typeof window === 'undefined') {return;}
  window.localStorage.setItem(DFA_JOURNEY_STORAGE_KEY, JSON.stringify(state));
  const fingerprint = journeySnapshotFingerprint(state);
  if (fingerprint !== cachedJourneyFingerprint) {
    cachedJourneyFingerprint = fingerprint;
    cachedJourneySnapshot = state;
  }
  window.dispatchEvent(new Event(DFA_JOURNEY_CHANGE_EVENT));
};

export const updateDfaJourneyPhase = (
  phaseKey: DfaJourneyPhase['key'],
  updates: Partial<Pick<DfaJourneyPhase, 'visited' | 'completed'>> & { resumePath?: string }
): DfaJourneyState => {
  const current = loadDfaJourneyState();
  const next = normalizeState({
    ...current,
    phases: current.phases.map((phase) =>
      phase.key === phaseKey
        ? {
            ...phase,
            visited: updates.visited ?? phase.visited,
            completed: updates.completed ?? phase.completed,
            updatedAt: new Date().toISOString(),
          }
        : phase
    ),
    resumePath: updates.resumePath || current.resumePath,
    lastUpdated: new Date().toISOString(),
  });

  saveDfaJourneyState(next);
  return next;
};
