import type { FlattenedAgeBasedActivity } from '../data/ageBasedActivities';
import type { FootprintAnalysis } from './footprintAnalyzer';
import type { ParentScenarioInput } from './missionScenarioConfig';
import type {
  PersonalizationCategory,
  ResolvedMissionScenario,
  ScenarioSource,
} from './missionPersonalizationTypes';

export type { PersonalizationCategory, ResolvedMissionScenario, ScenarioSource } from './missionPersonalizationTypes';

export interface PersonalizeScenarioOptions {
  isPremium: boolean;
  parentInput?: ParentScenarioInput;
  analysis?: FootprintAnalysis | null;
}

const DEFAULT_FREQUENCY = 'regularly';
const GENERIC_APP = 'a favourite app';
const GENERIC_GAME = 'a game you play often';

const pickTopAppForCategory = (
  analysis: FootprintAnalysis | null | undefined,
  category: PersonalizationCategory | undefined
): string | undefined => {
  if (!analysis || !category) {
    return undefined;
  }
  const match = analysis.serviceRisks
    .filter((risk) => risk.category === category)
    .sort((a, b) => b.exposureIndex - a.exposureIndex)[0];
  return match?.serviceName;
};

const applyTokens = (
  template: string,
  tokens: { app: string; childName?: string; frequency: string }
): string => {
  const childPrefix = tokens.childName ? `${tokens.childName} has ` : 'You have ';
  const childWantPhrase = tokens.childName ? `${tokens.childName} wants` : 'You want';
  const childSubject = tokens.childName ?? 'you';
  return template
    .replaceAll('{app}', tokens.app)
    .replaceAll('{topApp}', tokens.app)
    .replaceAll('{topGame}', tokens.app)
    .replaceAll('{childName}', childSubject)
    .replaceAll('{childWantPhrase}', childWantPhrase)
    .replaceAll('{frequency}', tokens.frequency)
    .replaceAll('{childPrefix}', childPrefix);
};

/**
 * Resolve the real-life scenario for a mission.
 * Free users always receive the static baseline (`realLifeScenario`).
 * Premium users get parent input → DFA catalog match → generic template → baseline.
 */
export const resolveMissionScenario = (
  activity: Pick<
    FlattenedAgeBasedActivity,
    'id' | 'realLifeScenario' | 'scenarioTemplate' | 'personalizationCategory'
  >,
  options: PersonalizeScenarioOptions
): ResolvedMissionScenario => {
  const baseline: ResolvedMissionScenario = {
    text: activity.realLifeScenario,
    source: 'baseline',
    isPersonalized: false,
  };

  if (!options.isPremium) {
    return baseline;
  }

  const parent = options.parentInput;

  if (parent?.customScenario) {
    return {
      text: parent.customScenario,
      source: 'parent-custom',
      isPersonalized: true,
      appName: parent.appName,
      childName: parent.childName,
    };
  }

  const template = activity.scenarioTemplate;
  if (!template) {
    return baseline;
  }

  const frequency = parent?.usageFrequency || DEFAULT_FREQUENCY;
  const childName = parent?.childName;

  const dfaApp = pickTopAppForCategory(
    options.analysis,
    activity.personalizationCategory as PersonalizationCategory | undefined
  );

  const appName = parent?.appName || dfaApp;

  if (appName) {
    const source: ScenarioSource = parent?.appName ? 'parent-template' : 'dfa-template';
    return {
      text: applyTokens(template, { app: appName, childName, frequency }),
      source,
      isPersonalized: true,
      appName,
      childName,
    };
  }

  const genericApp =
    activity.personalizationCategory === 'gaming' ? GENERIC_GAME : GENERIC_APP;

  return {
    text: applyTokens(template, { app: genericApp, childName, frequency }),
    source: 'generic-template',
    isPersonalized: true,
    childName,
  };
};
