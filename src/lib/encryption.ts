/**
 * Encryption utility for protecting PII (Personally Identifiable Information)
 * Uses Web Crypto API for secure encryption/decryption
 * 
 * Note: This provides client-side encryption. For production use with real users,
 * consider implementing server-side encryption with proper key management.
 */

// Generate a key derivation function using PBKDF2
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Generate a random salt
function generateSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(16));
}

// Generate a random IV (Initialization Vector)
function generateIV(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(12));
}

/**
 * Encrypt sensitive data
 * @param data - The data to encrypt (will be JSON stringified)
 * @param password - Password for encryption (should be user-specific)
 * @returns Encrypted data as base64 string with salt and IV prepended
 */
export async function encryptData(data: unknown, password: string): Promise<string> {
  try {
    const salt = generateSalt();
    const iv = generateIV();
    const key = await deriveKey(password, salt);

    const encoder = new TextEncoder();
    const dataString = JSON.stringify(data);
    const dataBuffer = encoder.encode(dataString);

    const encryptedData = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      dataBuffer
    );

    // Combine salt, IV, and encrypted data
    const combined = new Uint8Array(salt.length + iv.length + encryptedData.byteLength);
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(encryptedData), salt.length + iv.length);

    // Convert to base64 for storage
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypt sensitive data
 * @param encryptedData - The encrypted data as base64 string
 * @param password - Password used for encryption
 * @returns Decrypted data (will be parsed from JSON)
 */
export async function decryptData<T>(encryptedData: string, password: string): Promise<T> {
  try {
    // Convert from base64
    const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));

    // Extract salt, IV, and encrypted data
    const salt = combined.slice(0, 16);
    const iv = combined.slice(16, 28);
    const encrypted = combined.slice(28);

    const key = await deriveKey(password, salt);

    const decryptedData = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      encrypted
    );

    const decoder = new TextDecoder();
    const decryptedString = decoder.decode(decryptedData);
    return JSON.parse(decryptedString) as T;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data. Invalid password or corrupted data.');
  }
}

// localStorage key for the per-device random secret.
// Intentionally NOT prefixed with `pandagarde_` so it is never cleared by the
// consent-revocation routine in coppaCompliance.ts (which wipes all
// `pandagarde_*` keys).  Clearing this key would make all previously encrypted
// data permanently unreadable.
const DEVICE_SECRET_KEY = 'pg_device_secret';

/** Convert a Uint8Array to a lowercase hex string. */
function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Return the per-device random secret, creating and persisting one on the
 * first call.  Because this secret is generated locally and never transmitted,
 * knowledge of the source code alone is insufficient to decrypt data stored on
 * any given device.
 *
 * The secret is stored as a cleartext hex string in localStorage.  This is
 * intentional and unavoidable for a purely client-side key: a key must reside
 * unencrypted somewhere so it can be read; encrypting it would only push the
 * problem one level further.  The security benefit is per-device isolation —
 * the secret is different on every device/browser profile, so compromising the
 * source code gives an attacker nothing without physical access to localStorage.
 */
function getOrCreateDeviceSecret(): string {
  try {
    let secret = localStorage.getItem(DEVICE_SECRET_KEY);
    if (!secret) {
      const bytes = new Uint8Array(32);
      crypto.getRandomValues(bytes);
      secret = bytesToHex(bytes);
      localStorage.setItem(DEVICE_SECRET_KEY, secret);
    }
    return secret;
  } catch {
    // localStorage unavailable (e.g., private-browsing restrictions).
    // Fall back to a one-time session secret so encryption still works,
    // even though it won't survive a page reload in this edge case.
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    return bytesToHex(bytes);
  }
}

/**
 * Generate a secure password from user-specific data.
 * Combines the user ID with a randomly-generated per-device secret so that
 * neither the source code nor the user ID alone is sufficient to decrypt
 * any user's stored data.
 */
export function generateUserPassword(userId: string): string {
  const deviceSecret = getOrCreateDeviceSecret();
  return `${userId}-${deviceSecret}`;
}

/**
 * Hash a string for use as a password or key
 * Uses SHA-256 for one-way hashing
 */
export async function hashString(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Check if Web Crypto API is available
 */
export function isEncryptionAvailable(): boolean {
  return typeof crypto !== 'undefined' && 
         typeof crypto.subtle !== 'undefined' &&
         typeof crypto.getRandomValues !== 'undefined';
}

