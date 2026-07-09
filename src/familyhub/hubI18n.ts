import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t, i18n } = useTranslation();

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
    (id: string, field: MissionTextField, fallback: string) => missionText(t, id, field, fallback),
    [t]
  );
  const getMissionList = useCallback(
    (id: string, field: 'keyLearnings' | 'discussionPrompts', fallback: string[]) =>
      missionList(t, id, field, fallback),
    [t]
  );
  const getMissionName = useCallback(
    (activity: Pick<FlattenedAgeBasedActivity, 'id' | 'name'>) => localizedMissionName(t, activity),
    [t]
  );
  const getAgeGroupDescription = useCallback(
    (range: string, fallback: string) => localizedAgeGroupDescription(t, range, fallback),
    [t]
  );
  const getDifficultyLabel = useCallback((difficulty: ActivityDifficulty) => difficultyLabel(t, difficulty), [t]);
  const getFamilyModeLabel = useCallback((mode: FamilyMode) => familyModeLabel(t, mode), [t]);
  const getRoleLabel = useCallback((role: string) => roleLabel(t, role), [t]);
  const getDurationLabel = useCallback((duration: string) => durationLabel(t, duration), [t]);
  const getCelebrationLine = useCallback(
    (characterId: string, fallback: string) => celebrationLine(t, characterId, fallback),
    [t]
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
