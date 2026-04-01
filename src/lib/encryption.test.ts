import { describe, it, expect, beforeEach } from 'vitest';
import {
  encryptData,
  decryptData,
  generateUserPassword,
  hashString,
  isEncryptionAvailable
} from './encryption';

describe('encryption', () => {
  beforeEach(() => {
    // Ensure Web Crypto API is available (should be in test environment)
    if (typeof crypto === 'undefined') {
      // Mock crypto for tests if needed
      global.crypto = {
        subtle: {
          importKey: async () => ({}),
          deriveKey: async () => ({}),
          encrypt: async () => new ArrayBuffer(0),
          decrypt: async () => new ArrayBuffer(0),
          digest: async () => new ArrayBuffer(0),
          deriveBits: async () => new ArrayBuffer(0)
        },
        getRandomValues: (arr: Uint8Array) => {
          for (let i = 0; i < arr.length; i++) {
            arr[i] = Math.floor(Math.random() * 256);
          }
          return arr;
        }
      } as unknown as Crypto;
    }
  });

  describe('isEncryptionAvailable', () => {
    it('should return true when Web Crypto API is available', () => {
      expect(isEncryptionAvailable()).toBe(true);
    });
  });

  describe('generateUserPassword', () => {
    it('should generate a deterministic password from userId', () => {
      const userId = 'test-user-123';
      const password1 = generateUserPassword(userId);
      const password2 = generateUserPassword(userId);
      
      expect(password1).toBe(password2);
      expect(password1).toContain(userId);
      expect(password1.length).toBeGreaterThan(userId.length);
    });

    it('should generate different passwords for different userIds', () => {
      const password1 = generateUserPassword('user1');
      const password2 = generateUserPassword('user2');
      
      expect(password1).not.toBe(password2);
    });
  });

  describe('hashString', () => {
    it('should hash a string consistently', async () => {
      const input = 'test-string';
      const hash1 = await hashString(input);
      const hash2 = await hashString(input);
      
      expect(hash1).toBe(hash2);
      expect(hash1.length).toBe(64); // SHA-256 produces 64 hex characters
    });

    it('should produce different hashes for different inputs', async () => {
      const hash1 = await hashString('input1');
      const hash2 = await hashString('input2');
      
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('encryptData and decryptData', () => {
    it('should encrypt and decrypt simple data', async () => {
      const originalData = { name: 'John Doe', age: 25 };
      const password = 'test-password-123';
      
      const encrypted = await encryptData(originalData, password);
      const decrypted = await decryptData<typeof originalData>(encrypted, password);
      
      expect(decrypted).toEqual(originalData);
      expect(encrypted).not.toContain('John Doe');
      expect(encrypted).not.toContain('25');
    });

    it('should encrypt and decrypt complex nested data', async () => {
      const originalData = {
        user: {
          id: 'user-123',
          profile: {
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane@example.com',
            preferences: {
              theme: 'dark',
              notifications: true
            }
          }
        },
        metadata: {
          createdAt: '2025-01-01',
          updatedAt: '2025-01-02'
        }
      };
      const password = 'complex-password';
      
      const encrypted = await encryptData(originalData, password);
      const decrypted = await decryptData<typeof originalData>(encrypted, password);
      
      expect(decrypted).toEqual(originalData);
    });

    it('should fail to decrypt with wrong password', async () => {
      const originalData = { secret: 'sensitive-data' };
      const correctPassword = 'correct-password';
      const wrongPassword = 'wrong-password';
      
      const encrypted = await encryptData(originalData, correctPassword);
      
      await expect(
        decryptData<typeof originalData>(encrypted, wrongPassword)
      ).rejects.toThrow();
    });

    it('should produce different encrypted output for same data (due to random salt/IV)', async () => {
      const originalData = { message: 'Hello World' };
      const password = 'same-password';
      
      const encrypted1 = await encryptData(originalData, password);
      const encrypted2 = await encryptData(originalData, password);
      
      // Encrypted outputs should be different due to random salt and IV
      expect(encrypted1).not.toBe(encrypted2);
      
      // But both should decrypt to the same data
      const decrypted1 = await decryptData<typeof originalData>(encrypted1, password);
      const decrypted2 = await decryptData<typeof originalData>(encrypted2, password);
      
      expect(decrypted1).toEqual(originalData);
      expect(decrypted2).toEqual(originalData);
    });

    it('should handle empty objects', async () => {
      const originalData = {};
      const password = 'test-password';
      
      const encrypted = await encryptData(originalData, password);
      const decrypted = await decryptData<typeof originalData>(encrypted, password);
      
      expect(decrypted).toEqual(originalData);
    });

    it('should handle arrays', async () => {
      const originalData = [1, 2, 3, 'test', { nested: 'value' }];
      const password = 'test-password';
      
      const encrypted = await encryptData(originalData, password);
      const decrypted = await decryptData<typeof originalData>(encrypted, password);
      
      expect(decrypted).toEqual(originalData);
    });

    it('should handle strings', async () => {
      const originalData = 'simple string';
      const password = 'test-password';
      
      const encrypted = await encryptData(originalData, password);
      const decrypted = await decryptData<typeof originalData>(encrypted, password);
      
      expect(decrypted).toBe(originalData);
    });

    it('should handle numbers', async () => {
      const originalData = 42;
      const password = 'test-password';
      
      const encrypted = await encryptData(originalData, password);
      const decrypted = await decryptData<typeof originalData>(encrypted, password);
      
      expect(decrypted).toBe(originalData);
    });

    it('should handle null values', async () => {
      const originalData = { value: null, other: 'test' };
      const password = 'test-password';
      
      const encrypted = await encryptData(originalData, password);
      const decrypted = await decryptData<typeof originalData>(encrypted, password);
      
      expect(decrypted).toEqual(originalData);
    });

    it('should handle special characters in data', async () => {
      const originalData = {
        special: '!@#$%^&*()_+-=[]{}|;:,.<>?',
        unicode: 'Hello 世界 🌍',
        newlines: 'Line 1\nLine 2\r\nLine 3'
      };
      const password = 'test-password';
      
      const encrypted = await encryptData(originalData, password);
      const decrypted = await decryptData<typeof originalData>(encrypted, password);
      
      expect(decrypted).toEqual(originalData);
    });
  });

  describe('PII protection', () => {
    it('should encrypt family member PII data', async () => {
      const familyMember = {
        id: 'member-123',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        age: 10,
        profile_data: {
          grade: '5th',
          preferences: {}
        }
      };
      const userId = 'user-123';
      const password = generateUserPassword(userId);
      
      const encrypted = await encryptData(familyMember, password);
      
      // Verify PII is not in plaintext
      expect(encrypted).not.toContain('John');
      expect(encrypted).not.toContain('Doe');
      expect(encrypted).not.toContain('john.doe@example.com');
      expect(encrypted).not.toContain('10');
      
      // Verify decryption works
      const decrypted = await decryptData<typeof familyMember>(encrypted, password);
      expect(decrypted).toEqual(familyMember);
    });

    it('should encrypt age verification data', async () => {
      const ageVerification = {
        verified: true,
        under13: true,
        consent: true,
        age: 10,
        timestamp: Date.now()
      };
      const deviceId = 'device-123';
      const password = generateUserPassword(deviceId);
      
      const encrypted = await encryptData(ageVerification, password);
      
      // Verify sensitive data is not in plaintext
      expect(encrypted).not.toContain('10');
      expect(encrypted).not.toContain('true');
      
      // Verify decryption works
      const decrypted = await decryptData<typeof ageVerification>(encrypted, password);
      expect(decrypted).toEqual(ageVerification);
    });
  });
});

