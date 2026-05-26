import { describe, expect, it } from 'vitest';

import { isChunkLoadError } from './lazyWithRetry';

describe('isChunkLoadError', () => {
  it('detects dynamic import fetch failures', () => {
    expect(isChunkLoadError(new TypeError('Failed to fetch dynamically imported module'))).toBe(true);
    expect(isChunkLoadError(new TypeError('Failed to fetch'))).toBe(true);
  });

  it('ignores unrelated errors', () => {
    expect(isChunkLoadError(new Error('Cannot read properties of undefined'))).toBe(false);
    expect(isChunkLoadError('string')).toBe(false);
  });
});
