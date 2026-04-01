import { useState } from 'react';

// Check if localStorage is available
const isLocalStorageAvailable = (): boolean => {
  try {
    if (typeof window === 'undefined') {return false;}
    if (!window.localStorage) {return false;}
    
    // Test localStorage access
    const testKey = '__localStorage_test__';
    window.localStorage.setItem(testKey, 'test');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

export const useLocalStorage = <T,>(key: string, initialValue: T, expectedType?: string): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (!isLocalStorageAvailable()) {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (!item) {return initialValue;}
      
      const parsed = JSON.parse(item);
      return parsed;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      
      if (isLocalStorageAvailable()) {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      // If quota exceeded, try to clear old data and retry
      if (error instanceof DOMException && error.code === 22) {
        try {
          // Clear oldest entries and retry
          const keys = Object.keys(localStorage);
          const familyHubKeys = keys.filter(k => k.startsWith('pandagarde_family') || k.startsWith('privacyPanda_'));
          if (familyHubKeys.length > 0) {
            localStorage.removeItem(familyHubKeys[0]);
            window.localStorage.setItem(key, JSON.stringify(value));
          }
        } catch (retryError) {
          console.warn('Could not save to localStorage even after cleanup:', retryError);
        }
      }
    }
  };

  return [storedValue, setValue];
};

