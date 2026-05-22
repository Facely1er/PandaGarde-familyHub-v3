import { flattenAgeBasedActivities } from '../data/ageBasedActivities';

/** Total missions/activities in the Family Hub catalog (single source for progress %). */
export function getHubActivityCatalogCount(): number {
  return flattenAgeBasedActivities().length;
}
