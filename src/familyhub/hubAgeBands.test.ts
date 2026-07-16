import { describe, it, expect } from 'vitest';
import { getHubAgeGroupMeta } from './hubAgeBands';

describe('getHubAgeGroupMeta', () => {
  const labelFor = (range: '5-8' | '9-12' | '13-17') => `Band ${range}`;

  it('returns metadata for mission ages', () => {
    const meta = getHubAgeGroupMeta(9, labelFor);
    expect(meta?.range).toBe('9-12');
    expect(meta?.label).toBe('Band 9-12');
  });

  it('returns null outside mission ages', () => {
    expect(getHubAgeGroupMeta(4, labelFor)).toBeNull();
    expect(getHubAgeGroupMeta(18, labelFor)).toBeNull();
  });
});
