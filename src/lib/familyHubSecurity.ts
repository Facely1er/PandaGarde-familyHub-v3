/**
 * Enhanced Security Utilities for Family Hub
 * Provides additional security measures beyond the main PandaGarde site
 */

import { encryptData, decryptData } from './encryption';
import { logger } from './logger';

// Input sanitization for family data
export const sanitizeInput = (input: string | number | null | undefined): string => {
  if (input === null || input === undefined) {return '';}
  const str = String(input);
  
  // Remove potentially dangerous characters
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]+>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim()
    .substring(0, 1000); // Limit length
};

// Validate family member data
export const validateFamilyMember = (member: {
  name: string;
  age: number;
  role: string;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Name validation
  const sanitizedName = sanitizeInput(member.name);
  if (!sanitizedName || sanitizedName.length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  if (sanitizedName.length > 50) {
    errors.push('Name must be less than 50 characters');
  }
  if (!/^[a-zA-Z0-9\s\-'.]+$/.test(sanitizedName)) {
    errors.push('Name contains invalid characters');
  }
  
  // Age validation
  if (!member.age || member.age < 1 || member.age > 120) {
    errors.push('Age must be between 1 and 120');
  }
  if (!Number.isInteger(member.age)) {
    errors.push('Age must be a whole number');
  }
  
  // Role validation
  const validRoles = ['Parent', 'Child', 'Teen', 'Guardian'];
  if (!validRoles.includes(member.role)) {
    errors.push('Invalid role selected');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validate goal data
export const validateGoal = (goal: {
  title: string;
  description: string;
  priority: string;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  const sanitizedTitle = sanitizeInput(goal.title);
  if (!sanitizedTitle || sanitizedTitle.length < 3) {
    errors.push('Goal title must be at least 3 characters');
  }
  if (sanitizedTitle.length > 100) {
    errors.push('Goal title must be less than 100 characters');
  }
  
  const sanitizedDescription = sanitizeInput(goal.description);
  if (sanitizedDescription.length > 500) {
    errors.push('Goal description must be less than 500 characters');
  }
  
  const validPriorities = ['Low', 'Medium', 'High'];
  if (!validPriorities.includes(goal.priority)) {
    errors.push('Invalid priority selected');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Rate limiting check (client-side; server should also implement this)
const MAX_REQUESTS = 10;
const TIME_WINDOW = 60000; // 1 minute
const RATE_LIMIT_STORAGE_KEY = 'fh_rate_limit_ts';

// Helpers to persist rate-limit timestamps across page refreshes so that
// reloading the page cannot trivially reset the counter.
const getRateLimitTimestamps = (): number[] => {
  try {
    const stored = localStorage.getItem(RATE_LIMIT_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as number[]) : [];
  } catch {
    return [];
  }
};

const setRateLimitTimestamps = (timestamps: number[]): void => {
  try {
    localStorage.setItem(RATE_LIMIT_STORAGE_KEY, JSON.stringify(timestamps));
  } catch {
    // Ignore write failures; rate limiting degrades gracefully.
  }
};

export const checkRateLimit = (): boolean => {
  const now = Date.now();

  // Load persisted timestamps and prune entries older than the time window.
  const timestamps = getRateLimitTimestamps().filter(ts => now - ts < TIME_WINDOW);

  if (timestamps.length >= MAX_REQUESTS) {
    logger.warn('Rate limit exceeded');
    setRateLimitTimestamps(timestamps);
    return false;
  }

  // Record this request and persist immediately.
  timestamps.push(now);
  setRateLimitTimestamps(timestamps);
  return true;
};

// Secure localStorage operations
export const secureStorage = {
  set: (key: string, value: unknown): void => {
    try {
      const serialized = JSON.stringify(value);
      // Add timestamp for expiration
      const data = {
        value: serialized,
        timestamp: Date.now(),
        expires: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
      };
      localStorage.setItem(`fh_${key}`, JSON.stringify(data));
    } catch (error) {
      logger.error('Failed to save to secure storage:', error);
    }
  },
  
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(`fh_${key}`);
      if (!item) {return null;}
      
      const data = JSON.parse(item);
      
      // Check expiration
      if (Date.now() > data.expires) {
        localStorage.removeItem(`fh_${key}`);
        return null;
      }
      
      return JSON.parse(data.value) as T;
    } catch (error) {
      logger.error('Failed to read from secure storage:', error);
      return null;
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(`fh_${key}`);
    } catch (error) {
      logger.error('Failed to remove from secure storage:', error);
    }
  },
  
  clear: (): void => {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('fh_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      logger.error('Failed to clear secure storage:', error);
    }
  }
};

// Security event logging
export const logSecurityEvent = (event: string, details?: unknown): void => {
  try {
    const logEntry = {
      event,
      details,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    // Log to console in development
    if (import.meta.env.DEV) {
      logger.warn('[Security Event]', logEntry);
    }
    
    // In production, send to monitoring service
    // This should be sent to your security monitoring endpoint
    if (import.meta.env.PROD) {
      // Example: send to Sentry or security monitoring service
      // trackSecurityEvent(logEntry);
    }
  } catch (error) {
    logger.error('Failed to log security event:', error);
  }
};

// Check for suspicious activity patterns
export const detectSuspiciousActivity = (action: string, context?: unknown): boolean => {
  // Check rate limit
  if (!checkRateLimit()) {
    logSecurityEvent('rate_limit_exceeded', { action, context });
    return true;
  }
  
  // Additional checks can be added here
  // - Unusual data access patterns
  // - Multiple failed validation attempts
  // - Unusual time patterns
  
  return false;
};

// Content Security Policy nonce generator (for inline scripts if needed)
let nonceCache: string | null = null;
export const generateNonce = (): string => {
  if (!nonceCache) {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    nonceCache = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  return nonceCache;
};

// Secure data encryption helper – wraps the AES-256-GCM implementation in
// encryption.ts so callers throughout the codebase use a consistent API.
export const encryptSensitiveData = async (data: string, key: string): Promise<string> => {
  try {
    return await encryptData(data, key);
  } catch (error) {
    logger.error('Encryption failed:', error);
    throw new Error('Failed to encrypt data');
  }
};

export const decryptSensitiveData = async (encrypted: string, key: string): Promise<string> => {
  try {
    return await decryptData<string>(encrypted, key);
  } catch (error) {
    logger.error('Decryption failed:', error);
    throw new Error('Failed to decrypt data');
  }
};

