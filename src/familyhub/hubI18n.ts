import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { TOptions } from 'i18next';
import { HUB_BRAND_I18N_DEFAULTS } from './constants';
import type { ActivityFocus, ActivityDifficulty, FamilyMode, FlattenedAgeBasedActivity } from '../data/ageBasedActivities';
import type { HubAgeRange } from './hubAgeBands';
import type { CharacterRole } from '../data/stories';
import {
  celebrationLine,
  difficultyLabel,
  durationLabel,
  familyModeLabel,
  localizedAgeGroupDescription,
  localizedMissionName,
  missionList,
  missionText,
  roleLabel,
  type MissionTextField,
} from '../lib/hubMissionI18n';

const FOCUS_KEYS: Record<ActivityFocus, string> = {
  'Safe sharing': 'safeSharing',
  'Account security': 'accountSecurity',
  'Spotting scams': 'spottingScams',
  'Privacy settings': 'privacySettings',
  'Digital footprint': 'digitalFootprint',
  'Digital rights': 'digitalRights',
};

export function useHubI18n() {
  const { t: i18nT, i18n } = useTranslation();

  const t = useCallback(
    (key: string, options?: TOptions) => i18nT(key, { ...HUB_BRAND_I18N_DEFAULTS, ...options }),
    [i18nT]
  );

  const ageBandLabel = useCallback((range: HubAgeRange) => t(`hub.ageBands.${range}.label`), [t]);
  const ageBandShort = useCallback((range: HubAgeRange) => t(`hub.ageBands.${range}.shortLabel`), [t]);
  const ageBandTagline = useCallback((range: HubAgeRange) => t(`hub.ageBands.${range}.tagline`), [t]);
  const focusLabel = useCallback(
    (focus: ActivityFocus) => t(`hub.focus.${FOCUS_KEYS[focus]}`),
    [t]
  );
  const characterEpithet = useCallback(
    (id: CharacterRole) => t(`hub.characters.${id}.epithet`, { defaultValue: '' }),
    [t]
  );
  const getMissionText = useCallback(
    (id: string, field: MissionTextField, fallback: string) => missionText(i18nT, id, field, fallback),
    [i18nT]
  );
  const getMissionList = useCallback(
    (id: string, field: 'keyLearnings' | 'discussionPrompts', fallback: string[]) =>
      missionList(i18nT, id, field, fallback),
    [i18nT]
  );
  const getMissionName = useCallback(
    (activity: Pick<FlattenedAgeBasedActivity, 'id' | 'name'>) => localizedMissionName(i18nT, activity),
    [i18nT]
  );
  const getAgeGroupDescription = useCallback(
    (range: string, fallback: string) => localizedAgeGroupDescription(i18nT, range, fallback),
    [i18nT]
  );
  const getDifficultyLabel = useCallback(
    (difficulty: ActivityDifficulty) => difficultyLabel(i18nT, difficulty),
    [i18nT]
  );
  const getFamilyModeLabel = useCallback((mode: FamilyMode) => familyModeLabel(i18nT, mode), [i18nT]);
  const getRoleLabel = useCallback((role: string) => roleLabel(i18nT, role), [i18nT]);
  const getDurationLabel = useCallback((duration: string) => durationLabel(i18nT, duration), [i18nT]);
  const getCelebrationLine = useCallback(
    (characterId: string, fallback: string) => celebrationLine(i18nT, characterId, fallback),
    [i18nT]
  );

  return {
    t,
    i18n,
    ageBandLabel,
    ageBandShort,
    ageBandTagline,
    focusLabel,
    characterEpithet,
    getMissionText,
    getMissionList,
    getMissionName,
    getAgeGroupDescription,
    getDifficultyLabel,
    getFamilyModeLabel,
    getRoleLabel,
    getDurationLabel,
    getCelebrationLine,
  };
}
