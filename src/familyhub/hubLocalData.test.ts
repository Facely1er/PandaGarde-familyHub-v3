import { describe, it, expect, beforeEach } from 'vitest';
import {
  AUTH_STORAGE_KEY,
  clearAllHubLocalData,
  HUB_LOCAL_DATA_KEYS,
} from './hubLocalData';

describe('hubLocalData', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('removes all hub local data keys', () => {
    for (const key of HUB_LOCAL_DATA_KEYS) {
      localStorage.setItem(key, 'test');
    }
    localStorage.setItem('pandagarde-theme', 'dark');
    localStorage.setItem('pandagarde-language', 'en');

    clearAllHubLocalData();

    for (const key of HUB_LOCAL_DATA_KEYS) {
      expect(localStorage.getItem(key)).toBeNull();
    }
    expect(localStorage.getItem('pandagarde-theme')).toBe('dark');
    expect(localStorage.getItem('pandagarde-language')).toBe('en');
  });

  it('clears auth so the login screen appears after sign-out', () => {
    localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    clearAllHubLocalData();
    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull();
  });
});
