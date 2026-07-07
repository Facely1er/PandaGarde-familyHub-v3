import { logger } from './logger';

/**
 * Shared key-value storage adapter.
 *
 * All builds (web, Family Hub, Kids app) should persist through this adapter
 * instead of touching `localStorage` directly. On the web the driver is
 * `localStorage`; on native (Capacitor) a driver backed by
 * `@capacitor/preferences` can be registered at bootstrap via
 * `setStorageDriver`, which avoids iOS WebView localStorage eviction.
 */
export interface StorageDriver {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const memoryStore = new Map<string, string>();

/** Fallback driver when localStorage is unavailable (private mode, SSR, tests). */
const memoryDriver: StorageDriver = {
  getItem: (key) => memoryStore.get(key) ?? null,
  setItem: (key, value) => {
    memoryStore.set(key, value);
  },
  removeItem: (key) => {
    memoryStore.delete(key);
  },
};

function createLocalStorageDriver(): StorageDriver {
  try {
    const probeKey = '__pandagarde_storage_probe__';
    window.localStorage.setItem(probeKey, '1');
    window.localStorage.removeItem(probeKey);
    return window.localStorage;
  } catch {
    return memoryDriver;
  }
}

let driver: StorageDriver =
  typeof window !== 'undefined' ? createLocalStorageDriver() : memoryDriver;

/** Register a platform-specific driver (e.g. Capacitor Preferences on native). */
export function setStorageDriver(next: StorageDriver): void {
  driver = next;
}

export const appStorage = {
  /** Read and JSON-parse a value; returns `fallback` on missing/corrupt data. */
  get<T>(key: string, fallback: T): T {
    try {
      const raw = driver.getItem(key);
      if (raw === null) {
        return fallback;
      }
      return JSON.parse(raw) as T;
    } catch (error) {
      logger.warn('appStorage.get failed', { key, error });
      return fallback;
    }
  },

  /** JSON-stringify and persist a value. */
  set<T>(key: string, value: T): void {
    try {
      driver.setItem(key, JSON.stringify(value));
    } catch (error) {
      logger.warn('appStorage.set failed', { key, error });
    }
  },

  remove(key: string): void {
    try {
      driver.removeItem(key);
    } catch (error) {
      logger.warn('appStorage.remove failed', { key, error });
    }
  },
};
