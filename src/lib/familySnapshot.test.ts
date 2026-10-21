import { beforeEach, describe, expect, it } from 'vitest';
import { SNAPSHOT_CONTEXT_ORDER, SNAPSHOT_DATA, SNAPSHOT_KINDS } from '../data/familySnapshot';
import {
  FAMILY_SNAPSHOT_STORAGE_KEY,
  SNAPSHOT_KIND_ORDER,
  analyseFamilySnapshot,
  familySnapshotShareText,
  loadFamilySnapshotSelection,
  sanitizeSelection,
  saveFamilySnapshotSelection,
  snapshotBand,
} from './familySnapshot';

describe('familySnapshot data', () => {
  it('maps every kind to a known context and known data types', () => {
    SNAPSHOT_KIND_ORDER.forEach((id) => {
      const kind = SNAPSHOT_KINDS[id];
      expect(SNAPSHOT_CONTEXT_ORDER).toContain(kind.context);
      kind.data.forEach((d) => expect(SNAPSHOT_DATA[d]).toBeDefined());
    });
  });

  it('offers at least three kinds in each context', () => {
    SNAPSHOT_CONTEXT_ORDER.forEach((ctx) => {
      expect(SNAPSHOT_KIND_ORDER.filter((k) => SNAPSHOT_KINDS[k].context === ctx).length).toBeGreaterThanOrEqual(3);
    });
  });
});

describe('analyseFamilySnapshot', () => {
  it('returns an empty, zero-score result with nothing ticked', () => {
    const a = analyseFamilySnapshot({ ages: [], kinds: [] });
    expect(a.score).toBe(0);
    expect(a.types).toEqual([]);
    expect(a.nextSteps).toEqual([]);
    expect(a.contexts.map((c) => c.id)).toEqual([...SNAPSHOT_CONTEXT_ORDER]);
    expect(a.contexts.every((c) => c.score === 0)).toBe(true);
  });

  it('scores 100 when every kind is ticked', () => {
    const a = analyseFamilySnapshot({ ages: [], kinds: [...SNAPSHOT_KIND_ORDER] });
    expect(a.score).toBe(100);
    expect(a.band.key).toBe('high');
    a.contexts.forEach((c) => expect(c.score).toBe(100));
  });

  it('grows the score as more kinds are ticked', () => {
    const one = analyseFamilySnapshot({ ages: [], kinds: ['home-streaming'] }).score;
    const three = analyseFamilySnapshot({ ages: [], kinds: ['home-streaming', 'play-worlds', 'social-video'] }).score;
    expect(one).toBeGreaterThan(0);
    expect(three).toBeGreaterThan(one);
  });

  it('sorts data types with critical tiers first', () => {
    const a = analyseFamilySnapshot({ ages: [], kinds: ['social-video', 'home-streaming'] });
    const tiers = a.types.map((d) => SNAPSHOT_DATA[d].tier);
    expect([...tiers].sort((x, y) => y - x)).toEqual(tiers);
    expect(a.critical).toEqual(a.types.filter((d) => SNAPSHOT_DATA[d].tier === 4));
  });

  it('counts school-assigned kinds and leads next steps with the highest-scoring context', () => {
    const a = analyseFamilySnapshot({
      ages: ['9-12'],
      kinds: ['school-lms', 'school-comms', 'school-records', 'home-streaming'],
    });
    expect(a.schoolAssignedCount).toBe(3);
    expect(a.nextSteps).toHaveLength(3);
    expect(a.nextSteps[0]).toMatch(/school/i);
  });

  it('fills next steps to three when only one context is ticked', () => {
    const a = analyseFamilySnapshot({ ages: [], kinds: ['play-console'] });
    expect(a.nextSteps).toHaveLength(3);
    expect(new Set(a.nextSteps).size).toBe(3);
  });

  it('raises age flags only when the age band makes them relevant', () => {
    const young = analyseFamilySnapshot({ ages: ['5-8'], kinds: ['social-video', 'play-worlds', 'school-lms'] });
    expect(young.ageFlags.map((f) => f.id)).toEqual(['under13-social', 'young-open-chat', 'school-consent']);

    const teen = analyseFamilySnapshot({ ages: ['13-17'], kinds: ['social-video', 'social-ai', 'school-lms'] });
    expect(teen.ageFlags.map((f) => f.id)).toEqual(['teen-ai']);
  });

  it('detects risk combinations that need every listed data type', () => {
    const a = analyseFamilySnapshot({ ages: [], kinds: ['school-records'] });
    expect(a.combos.map((c) => c.title)).toContain('A school record outside the school');
    const b = analyseFamilySnapshot({ ages: [], kinds: ['home-streaming'] });
    expect(b.combos).toEqual([]);
  });
});

describe('sanitizeSelection', () => {
  it('drops unknown ids, de-duplicates and orders', () => {
    expect(
      sanitizeSelection({ kinds: ['social-ai', 'nope', 'school-lms', 'school-lms'], ages: ['13-17', '99', '5-8'] })
    ).toEqual({ kinds: ['school-lms', 'social-ai'], ages: ['5-8', '13-17'] });
    expect(sanitizeSelection(null)).toEqual({ kinds: [], ages: [] });
    expect(sanitizeSelection('garbage')).toEqual({ kinds: [], ages: [] });
  });
});

describe('snapshotBand', () => {
  it('maps score thresholds to bands', () => {
    expect(snapshotBand(0).key).toBe('contained');
    expect(snapshotBand(35).key).toBe('moderate');
    expect(snapshotBand(55).key).toBe('elevated');
    expect(snapshotBand(80).key).toBe('high');
  });
});

describe('familySnapshotShareText', () => {
  it('summarises score, contexts and school share without naming apps', () => {
    const a = analyseFamilySnapshot({ ages: ['9-12'], kinds: ['school-lms', 'play-worlds'] });
    const text = familySnapshotShareText(a, 'https://example.test/family-snapshot');
    expect(text).toContain(`Exposure: ${a.score}/100`);
    expect(text).toContain('School & learning');
    expect(text).toContain('chosen by the school');
    expect(text).not.toMatch(/Roblox|Google Classroom/);
    expect(text.trim().endsWith('https://example.test/family-snapshot')).toBe(true);
  });
});

describe('selection storage', () => {
  beforeEach(() => window.localStorage.clear());

  it('round-trips a sanitized selection', () => {
    saveFamilySnapshotSelection({ ages: ['13-17'], kinds: ['social-video'] });
    expect(loadFamilySnapshotSelection()).toEqual({ ages: ['13-17'], kinds: ['social-video'] });
  });

  it('recovers from corrupt storage', () => {
    window.localStorage.setItem(FAMILY_SNAPSHOT_STORAGE_KEY, '{not json');
    expect(loadFamilySnapshotSelection()).toEqual({ ages: [], kinds: [] });
  });
});
