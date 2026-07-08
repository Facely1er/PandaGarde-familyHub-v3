/** Service catalog categories missions can target for DFA-driven app picks. */
export type PersonalizationCategory =
  | 'gaming'
  | 'social-media'
  | 'ai'
  | 'messaging'
  | 'streaming'
  | 'edtech'
  | 'education'
  | 'health'
  | 'telecom';

export type ScenarioSource =
  | 'baseline'
  | 'parent-custom'
  | 'parent-template'
  | 'dfa-template'
  | 'generic-template';

export interface ResolvedMissionScenario {
  text: string;
  source: ScenarioSource;
  /** True when premium personalization changed the baseline copy. */
  isPersonalized: boolean;
  appName?: string;
  childName?: string;
}
