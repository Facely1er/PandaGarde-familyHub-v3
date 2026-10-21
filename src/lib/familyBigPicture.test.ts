import { beforeEach, describe, expect, it } from 'vitest';
import { PICTURE_AREAS, PICTURE_AREA_ORDER, PICTURE_DATA, PICTURE_KINDS } from '../data/familyBigPicture';
import {
  FAMILY_PICTURE_STORAGE_KEY,
  PICTURE_KIND_ORDER,
  buildFamilyPicture,
  loadFamilyPictureSelection,
  sanitizePictureSelection,
  saveFamilyPictureSelection,
} from './familyBigPicture';

describe('familyBigPicture data', () => {
  it('maps every kind to a known area and known data', () => {
    PICTURE_KIND_ORDER.forEach((id) => {
      expect(PICTURE_AREA_ORDER).toContain(PICTURE_KINDS[id].area);
      PICTURE_KINDS[id].data.forEach((d) => expect(PICTURE_DATA[d]).toBeDefined());
    });
  });

  it('offers exactly three everyday kinds per area so the picker stays short', () => {
    PICTURE_AREA_ORDER.forEach((area) => {
      expect(PICTURE_KIND_ORDER.filter((k) => PICTURE_KINDS[k].area === area)).toHaveLength(3);
    });
  });

  it('keeps parent-facing copy free of numbers and jargon', () => {
    const copy = [
      ...Object.values(PICTURE_DATA).map((d) => d.words),
      ...Object.values(PICTURE_AREAS).flatMap((a) => [a.name, a.decidedBy, a.step, a.askYourChild]),
      ...Object.values(PICTURE_KINDS).map((k) => k.name),
    ].join(' ');
    expect(copy).not.toMatch(/score|exposure|index|metadata|identifier|\/100/i);
  });
});

describe('buildFamilyPicture', () => {
  it('returns nothing to do when nothing is ticked', () => {
    const p = buildFamilyPicture({ ages: [], kinds: [] });
    expect(p.startArea).toBeNull();
    expect(p.steps).toEqual([]);
    expect(p.areas.map((a) => a.level)).toEqual(['none', 'none', 'none', 'none']);
  });

  it('marks exactly one area "start" and orders steps from it', () => {
    const p = buildFamilyPicture({
      ages: [],
      kinds: ['school-classwork', 'school-messaging', 'school-device', 'home-streaming'],
    });
    expect(p.startArea).toBe('school');
    expect(p.areas.filter((a) => a.level === 'start')).toHaveLength(1);
    expect(p.areas.find((a) => a.id === 'home')?.level).toBe('light');
    expect(p.steps[0]).toBe(PICTURE_AREAS.school.step);
    expect(p.steps).toHaveLength(3);
  });

  it('marks close runners-up "worth a look"', () => {
    const p = buildFamilyPicture({ ages: [], kinds: ['social-video', 'play-worlds'] });
    expect(p.areas.filter((a) => a.level === 'start' || a.level === 'look')).toHaveLength(2);
  });

  it('lists what apps usually know in plain words, most sensitive first, capped at four', () => {
    const p = buildFamilyPicture({ ages: [], kinds: ['social-video', 'social-messaging', 'social-ai'] });
    const social = p.areas.find((a) => a.id === 'social');
    expect(social?.knows.length).toBe(4);
    expect(social?.knows[0]).toMatch(/face|where they are|feelings/);
  });

  it('adds age notes only when the ages make them relevant', () => {
    const young = buildFamilyPicture({ ages: ['5-8'], kinds: ['social-video', 'play-worlds', 'school-classwork'] });
    expect(young.ageNotes.map((n) => n.id)).toEqual(['under13-apps', 'young-chat', 'school-consent']);
    const teen = buildFamilyPicture({ ages: ['13-17'], kinds: ['social-video', 'social-ai', 'school-classwork'] });
    expect(teen.ageNotes.map((n) => n.id)).toEqual(['teen-ai']);
  });

  it('flags school so the page can show questions for the school', () => {
    expect(buildFamilyPicture({ ages: [], kinds: ['school-device'] }).hasSchool).toBe(true);
    expect(buildFamilyPicture({ ages: [], kinds: ['home-smart'] }).hasSchool).toBe(false);
  });
});

describe('sanitizePictureSelection', () => {
  it('drops unknown ids (including first-release ids), de-duplicates and orders', () => {
    expect(
      sanitizePictureSelection({ kinds: ['social-ai', 'school-lms', 'play-worlds', 'play-worlds'], ages: ['13-17', '5-8', 'x'] })
    ).toEqual({ kinds: ['play-worlds', 'social-ai'], ages: ['5-8', '13-17'] });
    expect(sanitizePictureSelection(null)).toEqual({ kinds: [], ages: [] });
  });
});

describe('selection storage', () => {
  beforeEach(() => window.localStorage.clear());

  it('round-trips a selection', () => {
    saveFamilyPictureSelection({ ages: ['9-12'], kinds: ['home-smart'] });
    expect(loadFamilyPictureSelection()).toEqual({ ages: ['9-12'], kinds: ['home-smart'] });
  });

  it('recovers from corrupt storage', () => {
    window.localStorage.setItem(FAMILY_PICTURE_STORAGE_KEY, '{oops');
    expect(loadFamilyPictureSelection()).toEqual({ ages: [], kinds: [] });
  });
});
