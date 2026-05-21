import { describe, it, expect } from 'vitest';
import { hubPaths } from './hubPaths';

describe('hubPaths (website build)', () => {
  it('uses /family-hub prefix when not standalone', () => {
    expect(hubPaths.dashboard).toBe('/family-hub/dashboard');
    expect(hubPaths.activities).toBe('/family-hub/activities');
  });
});
