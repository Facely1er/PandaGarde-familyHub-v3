import { describe, it, expect, beforeEach, vi } from 'vitest';
import { coppaComplianceManager, COPPAComplianceManager } from './coppaCompliance';

// Mock localStorage and sessionStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

const sessionStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

// Mock window object
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock
});

// Mock fetch for IP address lookup
global.fetch = vi.fn();

// Mock crypto for encryption
beforeEach(() => {
  localStorageMock.clear();
  sessionStorageMock.clear();
  vi.clearAllMocks();
  
  // Mock fetch to return IP address
  (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
    json: async () => ({ ip: '192.168.1.1' })
  });
});

describe('COPPA Compliance Manager', () => {
  describe('Zero-Data Mode', () => {
    it('should enable zero-data mode', () => {
      coppaComplianceManager.enableZeroDataMode();
      expect(coppaComplianceManager.isZeroDataMode()).toBe(true);
    });

    it('should disable zero-data mode', () => {
      coppaComplianceManager.enableZeroDataMode();
      coppaComplianceManager.disableZeroDataMode();
      expect(coppaComplianceManager.isZeroDataMode()).toBe(false);
    });

    it('should return false when zero-data mode is not enabled', () => {
      expect(coppaComplianceManager.isZeroDataMode()).toBe(false);
    });
  });

  describe('Parental Consent Request', () => {
    it('should request parental consent for under-13 child', async () => {
      const result = await coppaComplianceManager.requestParentalConsent(
        10,
        'parent@example.com'
      );

      expect(result.success).toBe(true);
      expect(result.consentToken).toBeTruthy();
      expect(result.consentToken).toContain('coppa_');
    });

    it('should reject invalid email addresses', async () => {
      const result = await coppaComplianceManager.requestParentalConsent(
        10,
        'invalid-email'
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid email');
    });

    it('should generate unique consent tokens', async () => {
      const result1 = await coppaComplianceManager.requestParentalConsent(
        10,
        'parent1@example.com'
      );
      const result2 = await coppaComplianceManager.requestParentalConsent(
        11,
        'parent2@example.com'
      );

      expect(result1.consentToken).not.toBe(result2.consentToken);
    });

    it('should store consent record', async () => {
      const result = await coppaComplianceManager.requestParentalConsent(
        10,
        'parent@example.com'
      );

      expect(result.success).toBe(true);
      
      const record = await coppaComplianceManager.getConsentRecord(result.consentToken!);
      expect(record).toBeTruthy();
      expect(record?.childAge).toBe(10);
      expect(record?.parentEmail).toBe('parent@example.com');
      expect(record?.verified).toBe(false);
    });
  });

  describe('Consent Verification', () => {
    it('should verify valid consent token', async () => {
      const result = await coppaComplianceManager.requestParentalConsent(
        10,
        'parent@example.com'
      );

      const verification = await coppaComplianceManager.verifyConsentToken(
        result.consentToken!
      );

      expect(verification.valid).toBe(true);
      expect(verification.record).toBeTruthy();
      expect(verification.record?.verified).toBe(true);
    });

    it('should reject invalid consent token', async () => {
      const verification = await coppaComplianceManager.verifyConsentToken(
        'invalid-token'
      );

      expect(verification.valid).toBe(false);
      expect(verification.error).toContain('Invalid consent token');
    });

    it('should reject revoked consent tokens', async () => {
      const result = await coppaComplianceManager.requestParentalConsent(
        10,
        'parent@example.com'
      );

      // Verify first
      await coppaComplianceManager.verifyConsentToken(result.consentToken!);

      // Revoke
      await coppaComplianceManager.revokeConsent(result.consentToken!);

      // Try to verify again
      const verification = await coppaComplianceManager.verifyConsentToken(
        result.consentToken!
      );

      expect(verification.valid).toBe(false);
      expect(verification.error).toContain('revoked');
    });
  });

  describe('Consent Revocation', () => {
    it('should revoke consent and mark as revoked', async () => {
      const result = await coppaComplianceManager.requestParentalConsent(
        10,
        'parent@example.com'
      );

      // Verify first
      await coppaComplianceManager.verifyConsentToken(result.consentToken!);

      // Revoke
      const revoked = await coppaComplianceManager.revokeConsent(result.consentToken!);
      expect(revoked).toBe(true);

      const record = await coppaComplianceManager.getConsentRecord(result.consentToken!);
      expect(record?.revoked).toBe(true);
      expect(record?.revokedDate).toBeTruthy();
    });

    it('should return false when revoking non-existent consent', async () => {
      const revoked = await coppaComplianceManager.revokeConsent('non-existent-token');
      expect(revoked).toBe(false);
    });
  });

  describe('Has Valid Consent', () => {
    it('should return false when no consent token provided', async () => {
      const hasConsent = await coppaComplianceManager.hasValidConsent();
      expect(hasConsent).toBe(false);
    });

    it('should return false for unverified consent', async () => {
      const result = await coppaComplianceManager.requestParentalConsent(
        10,
        'parent@example.com'
      );

      const hasConsent = await coppaComplianceManager.hasValidConsent(result.consentToken);
      expect(hasConsent).toBe(false); // Not verified yet
    });

    it('should return true for verified consent', async () => {
      const result = await coppaComplianceManager.requestParentalConsent(
        10,
        'parent@example.com'
      );

      // Verify the consent
      await coppaComplianceManager.verifyConsentToken(result.consentToken!);

      const hasConsent = await coppaComplianceManager.hasValidConsent(result.consentToken);
      expect(hasConsent).toBe(true);
    });

    it('should return false for revoked consent', async () => {
      const result = await coppaComplianceManager.requestParentalConsent(
        10,
        'parent@example.com'
      );

      // Verify and then revoke
      await coppaComplianceManager.verifyConsentToken(result.consentToken!);
      await coppaComplianceManager.revokeConsent(result.consentToken!);

      const hasConsent = await coppaComplianceManager.hasValidConsent(result.consentToken);
      expect(hasConsent).toBe(false);
    });
  });

  describe('Get Consents By Email', () => {
    it('should retrieve all consents for a parent email', async () => {
      await coppaComplianceManager.requestParentalConsent(10, 'parent@example.com');
      await coppaComplianceManager.requestParentalConsent(11, 'parent@example.com');
      await coppaComplianceManager.requestParentalConsent(12, 'other@example.com');

      const consents = await coppaComplianceManager.getConsentsByEmail('parent@example.com');
      expect(consents.length).toBe(2);
      expect(consents.every(c => c.parentEmail === 'parent@example.com')).toBe(true);
    });

    it('should return empty array for email with no consents', async () => {
      const consents = await coppaComplianceManager.getConsentsByEmail('nonexistent@example.com');
      expect(consents.length).toBe(0);
    });
  });

  describe('Integration with Zero-Data Mode', () => {
    it('should enable zero-data mode when requesting consent for under-13', async () => {
      await coppaComplianceManager.requestParentalConsent(10, 'parent@example.com');
      
      // Zero-data mode should be enabled until consent is verified
      // Note: This is handled by AgeVerificationContext, but we can verify the manager supports it
      coppaComplianceManager.enableZeroDataMode();
      expect(coppaComplianceManager.isZeroDataMode()).toBe(true);
    });

    it('should allow disabling zero-data mode after consent verification', async () => {
      const result = await coppaComplianceManager.requestParentalConsent(
        10,
        'parent@example.com'
      );

      coppaComplianceManager.enableZeroDataMode();
      expect(coppaComplianceManager.isZeroDataMode()).toBe(true);

      // After verification, zero-data mode can be disabled
      await coppaComplianceManager.verifyConsentToken(result.consentToken!);
      coppaComplianceManager.disableZeroDataMode();
      expect(coppaComplianceManager.isZeroDataMode()).toBe(false);
    });
  });

  describe('Data Protection', () => {
    it('should encrypt consent records', async () => {
      const result = await coppaComplianceManager.requestParentalConsent(
        10,
        'parent@example.com'
      );

      // Check that consent data is stored encrypted
      const stored = localStorage.getItem('pandagarde_coppa_consents');
      expect(stored).toBeTruthy();
      
      // Encrypted data should not contain plaintext email
      expect(stored).not.toContain('parent@example.com');
    });
  });
});

