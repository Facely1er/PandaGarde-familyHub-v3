import { describe, it, expect } from 'vitest';
import { countWords, estimateReadingMinutes, formatReadingTime } from './readingTime';

describe('readingTime', () => {
  it('counts words across segments', () => {
    expect(countWords('one two', 'three')).toBe(3);
  });

  it('estimates at least 4 minutes', () => {
    expect(estimateReadingMinutes('short')).toBe(4);
  });

  it('formats reading time label', () => {
    expect(formatReadingTime(12)).toBe('12 min');
  });
});
