import { describe, expect, it } from 'vitest';
import {
  NEWSLETTER_RESERVED_SEGMENT_IDS,
  getNewsletterById,
  isNewsletterReservedSegment,
  newsletterArchive,
  newsletterIssuePath,
} from './index';

describe('newsletter archive registry', () => {
  it('resolves every archived issue by id', () => {
    for (const issue of newsletterArchive) {
      expect(getNewsletterById(issue.id)?.title).toBe(issue.title);
      expect(newsletterIssuePath(issue.id)).toBe(`/newsletter/${issue.id}`);
    }
  });

  it('does not treat reserved route segments as issues', () => {
    for (const segment of NEWSLETTER_RESERVED_SEGMENT_IDS) {
      expect(isNewsletterReservedSegment(segment)).toBe(true);
      expect(getNewsletterById(segment)).toBeUndefined();
    }
  });

  it('returns undefined for unknown issue ids', () => {
    expect(getNewsletterById('2099-13')).toBeUndefined();
    expect(getNewsletterById('')).toBeUndefined();
  });
});
