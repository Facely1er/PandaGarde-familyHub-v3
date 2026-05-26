import { flattenAgeBasedActivities, type FlattenedAgeBasedActivity } from '../data/ageBasedActivities';
import { resolveActivityId } from '../data/privacyActivitiesCatalog';
import { HUB_MISSIONS_PATH } from '../data/websiteHubBoundary';

export type HubActivitiesNavigation = {
  path: string;
  state?: { startMissionId: string };
};

export function findMissionByActivityManagerId(
  activityManagerId: string
): FlattenedAgeBasedActivity | null {
  return (
    flattenAgeBasedActivities().find((a) => a.activityManagerId === activityManagerId) ?? null
  );
}

/** Map legacy /activities/* slugs to a Hub mission when one shares the same game. */
export function resolveLegacyActivitiesPath(slugOrId?: string): HubActivitiesNavigation {
  if (!slugOrId) {
    return { path: HUB_MISSIONS_PATH };
  }

  const managerId = resolveActivityId(slugOrId);
  if (!managerId) {
    return { path: HUB_MISSIONS_PATH };
  }

  const mission = findMissionByActivityManagerId(managerId);
  if (mission) {
    return { path: HUB_MISSIONS_PATH, state: { startMissionId: mission.id } };
  }

  return { path: HUB_MISSIONS_PATH };
}
