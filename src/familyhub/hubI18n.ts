import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { ActivityFocus } from '../data/ageBasedActivities';
import type { HubAgeRange } from './hubAgeBands';

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

  return { t, i18n, ageBandLabel, ageBandShort, ageBandTagline, focusLabel };
}
