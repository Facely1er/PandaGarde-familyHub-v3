import '@testing-library/jest-dom/vitest';
import '../i18n';

/** jsdom sometimes exposes a broken localStorage without clear(); polyfill for tests. */
if (typeof window !== 'undefined') {
  const storage = window.localStorage;
  if (!storage || typeof storage.clear !== 'function') {
    const store = new Map<string, string>();
    const shim: Storage = {
      get length() {
        return store.size;
      },
      clear() {
        store.clear();
      },
      getItem(key: string) {
        return store.has(key) ? store.get(key)! : null;
      },
      key(index: number) {
        return Array.from(store.keys())[index] ?? null;
      },
      removeItem(key: string) {
        store.delete(key);
      },
      setItem(key: string, value: string) {
        store.set(key, String(value));
      },
    };
    Object.defineProperty(window, 'localStorage', { value: shim, writable: true });
  }
}

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// @ts-expect-error test shim
window.ResizeObserver = ResizeObserverMock;
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
window.URL.revokeObjectURL = vi.fn();
