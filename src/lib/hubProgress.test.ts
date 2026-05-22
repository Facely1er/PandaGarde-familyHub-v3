import { describe, it, expect } from 'vitest';
import { getHubActivityCatalogCount } from './hubProgress';
import { flattenAgeBasedActivities } from '../data/ageBasedActivities';

describe('hubProgress', () => {
  it('getHubActivityCatalogCount matches flattenAgeBasedActivities length', () => {
    expect(getHubActivityCatalogCount()).toBe(flattenAgeBasedActivities().length);
    expect(getHubActivityCatalogCount()).toBeGreaterThan(0);
  });
});
