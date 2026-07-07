import { describe, expect, it } from 'vitest';
import { STORIES } from './stories';
import {
  CAST_TIER_LABELS,
  FOREST_CHARACTERS,
  STORY_CAST_PATH,
  getCastGalleryCharacters,
  getCharactersDebutingInEpisode,
  getCharactersForStory,
  roleFromCharacterLabel,
} from './forestCharacters';

describe('forestCharacters', () => {
  it('maps story character labels to canonical roles', () => {
    expect(roleFromCharacterLabel('Mika the Owl')).toBe('mika');
    expect(roleFromCharacterLabel('Billy the Beaver')).toBe('billy');
    expect(roleFromCharacterLabel('Sage the Crane')).toBe('sage');
    expect(roleFromCharacterLabel('Po the Panda')).toBe('po');
  });

  it('exposes portrait URLs for all eleven forest characters', () => {
    const roles = FOREST_CHARACTERS.map((character) => character.id).sort();
    expect(roles).toHaveLength(11);
    for (const character of FOREST_CHARACTERS) {
      expect(character.portraitUrl).toMatch(/\/images\/characters\/\w+-portrait\.webp$/);
    }
    expect(FOREST_CHARACTERS.find((character) => character.id === 'sage')?.emoji).toBe('🦢');
  });

  it('returns cast for each story with at least the lead character', () => {
    for (const story of STORIES) {
      const cast = getCharactersForStory(story);
      expect(cast.some((character) => character.id === story.leadCharacter)).toBe(true);
    }
  });

  it('includes Sage on episode 16 cast and debut panels', () => {
    const ep16 = STORIES.find((story) => story.episodeNumber === 16);
    expect(ep16).toBeDefined();
    const cast = getCharactersForStory(ep16!);
    expect(cast.map((character) => character.id)).toEqual(
      expect.arrayContaining(['po', 'tao', 'sage']),
    );
    expect(getCharactersDebutingInEpisode(16).map((character) => character.id)).toContain('sage');
  });

  it('lists all eleven characters in gallery debut order', () => {
    const gallery = getCastGalleryCharacters();
    expect(gallery).toHaveLength(FOREST_CHARACTERS.length);
    expect(gallery[0].id).toBe('po');
    expect(gallery[gallery.length - 1].id).toBe('sage');
  });

  it('documents cast page path and tier labels', () => {
    expect(STORY_CAST_PATH).toBe('/stories/cast');
    expect(CAST_TIER_LABELS[1]).toMatch(/Core friends/);
    expect(CAST_TIER_LABELS[3]).toMatch(/elders/i);
  });

  it('flags episode debuts for Billy (Ep 3) and Vex (Ep 10)', () => {
    expect(getCharactersDebutingInEpisode(3).map((character) => character.id)).toContain('billy');
    expect(getCharactersDebutingInEpisode(10).map((character) => character.id)).toEqual(
      expect.arrayContaining(['vex', 'fiona']),
    );
  });
});
