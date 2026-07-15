import { describe, it, expect, beforeEach } from 'vitest';
import { encryptData, decryptData } from './encryption';

describe('encryption large payloads', () => {
  beforeEach(() => {
    if (typeof crypto === 'undefined') {
      throw new Error('Web Crypto API required for encryption tests');
    }
  });

  it('encrypts and decrypts payloads large enough to overflow spread-based btoa', async () => {
    const largeMembers = Array.from({ length: 24 }, (_, index) => ({
      id: `member_${index}`,
      first_name: `Member${index}`,
      last_name: 'TestFamily',
      email: `member${index}@device.local`,
      profile_data: { age: 8 + (index % 10), notes: 'x'.repeat(400) },
    }));

    const payload = {
      id: 'family_large',
      name: 'Large Family',
      members: largeMembers,
    };
    const password = 'large-payload-test-password';

    const encrypted = await encryptData(payload, password);
    const decrypted = await decryptData<typeof payload>(encrypted, password);

    expect(decrypted.members).toHaveLength(24);
    expect(decrypted.members[0].first_name).toBe('Member0');
  });
});
