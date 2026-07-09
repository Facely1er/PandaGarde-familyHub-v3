import type { FlattenedAgeBasedActivity, ActivityDifficulty, FamilyMode } from '../data/ageBasedActivities';
import type { TFunction } from 'i18next';

export type MissionTextField =
  | 'name'
  | 'description'
  | 'realLifeScenario'
  | 'learningObjective'
  | 'familyPrompt'
  | 'nextStep';

const DIFFICULTY_KEYS: Record<ActivityDifficulty, string> = {
  Beginner: 'beginner',
  Intermediate: 'intermediate',
  Advanced: 'advanced',
};

const FAMILY_MODE_KEYS: Record<FamilyMode, string> = {
  'Play together': 'playTogether',
  'Talk together': 'talkTogether',
  'Teen-led reflection': 'teenLedReflection',
};

const ROLE_KEYS: Record<string, string> = {
  Parent: 'parent',
  Child: 'child',
  Teen: 'teen',
  Guardian: 'guardian',
};

export function missionText(
  t: TFunction,
  id: string,
  field: MissionTextField,
  fallback: string
): string {
  return t(`hub.missions.${id}.${field}`, { defaultValue: fallback });
}

export function missionList(
  t: TFunction,
  id: string,
  field: 'keyLearnings' | 'discussionPrompts',
  fallback: string[]
): string[] {
  const translated = t(`hub.missions.${id}.${field}`, { returnObjects: true, defaultValue: fallback });
  return Array.isArray(translated) ? (translated as string[]) : fallback;
}

export function localizedMissionName(t: TFunction, activity: Pick<FlattenedAgeBasedActivity, 'id' | 'name'>): string {
  return missionText(t, activity.id, 'name', activity.name);
}

export function localizedAgeGroupDescription(
  t: TFunction,
  range: string,
  fallback: string
): string {
  return t(`hub.ageGroupDescriptions.${range}`, { defaultValue: fallback });
}

export function difficultyLabel(t: TFunction, difficulty: ActivityDifficulty): string {
  return t(`hub.difficulty.${DIFFICULTY_KEYS[difficulty]}`);
}

export function familyModeLabel(t: TFunction, mode: FamilyMode): string {
  return t(`hub.familyMode.${FAMILY_MODE_KEYS[mode]}`);
}

export function roleLabel(t: TFunction, role: string): string {
  const key = ROLE_KEYS[role];
  return key ? t(`hub.roles.${key}`) : role;
}

export function durationLabel(t: TFunction, duration: string): string {
  const minutes = Number.parseInt(duration, 10);
  if (!Number.isFinite(minutes) || minutes <= 0) {
    return duration;
  }
  return t('hub.common.minutesShort', { count: minutes });
}

export function celebrationLine(
  t: TFunction,
  characterId: string,
  fallback: string
): string {
  return t(`hub.celebrationLines.${characterId}`, { defaultValue: fallback });
}
