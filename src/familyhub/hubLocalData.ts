import { MISSION_SCENARIO_OVERRIDES_KEY } from '../lib/missionScenarioConfig';
import { PREMIUM_ENTITLEMENT_STORAGE_KEY } from '../lib/premiumEntitlement';
import {
  HUB_LAST_ACTIVE_KEY,
  HUB_LAST_MISSION_KEY,
  HUB_ORIGIN_KEY,
  HUB_STREAK_KEY,
} from '../lib/hubMission';
import { HUB_WELCOMED_KEY } from './constants';
import {
  HUB_CURRENT_MEMBER_KEY,
  HUB_FAMILY_PROGRESS_KEY,
  HUB_FAMILY_STORAGE_KEY,
} from './hubFamilyMembers';

export const AUTH_STORAGE_KEY = 'pandagarde_local_auth_v1';
export const PROFILE_STORAGE_KEY = 'pandagarde_local_profile_v1';

/** Hub user data keys — theme and language preferences are intentionally excluded. */
export const HUB_LOCAL_DATA_KEYS = [
  AUTH_STORAGE_KEY,
  PROFILE_STORAGE_KEY,
  HUB_WELCOMED_KEY,
  HUB_FAMILY_STORAGE_KEY,
  HUB_FAMILY_PROGRESS_KEY,
  HUB_CURRENT_MEMBER_KEY,
  'pandagarde_progress',
  'pandagarde_user_progress',
  'pandagarde_family_data',
  PREMIUM_ENTITLEMENT_STORAGE_KEY,
  MISSION_SCENARIO_OVERRIDES_KEY,
  HUB_ORIGIN_KEY,
  HUB_LAST_MISSION_KEY,
  HUB_STREAK_KEY,
  HUB_LAST_ACTIVE_KEY,
  'pandagarde_hub_welcome_dismissed',
  'pandagarde_hub_mission_hint_dismissed',
  'pandagarde_hub_tour_done',
  'pandagarde_family_goals',
  'pandagarde_current_user_id',
  'pandagarde_privacy_goals',
] as const;

/** Remove all Family Hub profiles, progress, and personalization from local storage. */
export function clearAllHubLocalData(): void {
  if (typeof window === 'undefined') {
    return;
  }
  for (const key of HUB_LOCAL_DATA_KEYS) {
    window.localStorage.removeItem(key);
  }
}
