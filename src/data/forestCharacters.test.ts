import { describe, expect, it } from 'vitest';
import { STORIES } from './stories';
import {
  FOREST_CHARACTERS,
  getCastGalleryCharacters,
  getCharactersDebutingInEpisode,
  getCharactersForStory,
  roleFromCharacterLabel,
} from './forestCharacters';

const PORTRAIT_ROLES = [
  'po',
  'ruby',
  'miki',
  'tao',
  'billy',
  'mika',
  'lumi',
  'vex',
  'fiona',
  'kai',
] as const;

describe('forestCharacters', () => {
  it('maps story character labels to canonical roles', () => {
    expect(roleFromCharacterLabel('Mika the Owl')).toBe('mika');
    expect(roleFromCharacterLabel('Billy the Beaver')).toBe('billy');
    expect(roleFromCharacterLabel('Po the Panda')).toBe('po');
  });

  it('exposes portrait URLs for all cast-sheet roles except Sage', () => {
    const withPortraits = FOREST_CHARACTERS.filter((character) => character.portraitUrl);
    expect(withPortraits.map((character) => character.id).sort()).toEqual([...PORTRAIT_ROLES].sort());
    expect(FOREST_CHARACTERS.find((character) => character.id === 'sage')?.portraitUrl).toBe('');
  });

  it('returns cast for each story with at least the lead character when portrait exists', () => {
    for (const story of STORIES) {
      const cast = getCharactersForStory(story);
      const lead = FOREST_CHARACTERS.find((character) => character.id === story.leadCharacter);
      if (lead?.portraitUrl) {
        expect(cast.some((character) => character.id === story.leadCharacter)).toBe(true);
      }
    }
  });

  it('lists gallery characters in debut order', () => {
    const gallery = getCastGalleryCharacters();
    expect(gallery).toHaveLength(PORTRAIT_ROLES.length);
    expect(gallery[0].id).toBe('po');
    expect(gallery[gallery.length - 1].id).toBe('kai');
  });

  it('flags episode debuts for Billy (Ep 3) and Vex (Ep 10)', () => {
    expect(getCharactersDebutingInEpisode(3).map((character) => character.id)).toContain('billy');
    expect(getCharactersDebutingInEpisode(10).map((character) => character.id)).toEqual(
      expect.arrayContaining(['vex', 'fiona']),
    );
  });
});
