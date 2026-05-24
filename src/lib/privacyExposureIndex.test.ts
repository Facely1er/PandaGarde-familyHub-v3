import { calculatePrivacyExposureIndex } from './privacyExposureIndex';
import { getServiceById } from '../data/childServiceCatalog';

describe('privacyExposureIndex — health category', () => {
  it('returns a score for catalog health services', () => {
    const appleHealth = getServiceById('apple-health');
    expect(appleHealth).toBeDefined();
    expect(appleHealth?.category).toBe('health');

    const index = calculatePrivacyExposureIndex('apple-health');
    expect(index).not.toBeNull();
    expect(index).toBeGreaterThanOrEqual(0);
    expect(index).toBeLessThanOrEqual(100);
  });

  it('scores telehealth higher than meditation wellness apps on average', () => {
    const teladoc = calculatePrivacyExposureIndex('teladoc');
    const calm = calculatePrivacyExposureIndex('calm');
    expect(teladoc).not.toBeNull();
    expect(calm).not.toBeNull();
    expect(teladoc!).toBeGreaterThan(calm!);
  });

  it('returns null for unknown service ids', () => {
    expect(calculatePrivacyExposureIndex('not-a-real-health-app')).toBeNull();
  });
});
