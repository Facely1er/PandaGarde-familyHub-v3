import { describe, expect, it } from 'vitest';

import { findMissionByActivityManagerId, resolveLegacyActivitiesPath } from './legacyActivitiesRedirect';

describe('legacyActivitiesRedirect', () => {
  it('maps maze slug to a hub mission that uses the same game', () => {
    const target = resolveLegacyActivitiesPath('safe-online-journey');
    expect(target.path).toBe('/family-hub/activities');
    const mazeMission = findMissionByActivityManagerId('maze');
    expect(mazeMission).toBeTruthy();
    expect(target.state?.startMissionId).toBe(mazeMission?.id);
  });

  it('sends unknown slugs to the missions list without startMissionId', () => {
    const target = resolveLegacyActivitiesPath('not-a-real-slug');
    expect(target.path).toBe('/family-hub/activities');
    expect(target.state).toBeUndefined();
  });
});
