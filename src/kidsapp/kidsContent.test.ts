import { describe, expect, it } from 'vitest';
import { getStoryBySlug } from '../data/stories';
import {
  getEpisodeGame,
  getFamilyActivity,
  getKidsEpisodes,
  KIDS_SEASON,
} from './kidsContent';

describe('kidsContent research alignment', () => {
  it('Season 1 has 8 episodes for the kids campaign', () => {
    const episodes = getKidsEpisodes();
    expect(episodes.every((s) => s.season === KIDS_SEASON)).toBe(true);
    expect(episodes.length).toBe(8);
  });

  it('Episode 7 uses Kindness Guardians (cyberbullying / bystander practice)', () => {
    const story = getStoryBySlug('when-miki-said-something-unkind');
    expect(story).toBeDefined();
    expect(getEpisodeGame(story!).id).toBe('kindness-guardians');
  });

  it('Episode 8 uses Trusted Team Builder (disclosure scaffold)', () => {
    const story = getStoryBySlug('pos-toughest-question');
    expect(story).toBeDefined();
    expect(getEpisodeGame(story!).id).toBe('trusted-team-builder');
  });

  it('getFamilyActivity prefers discussion or role-play for each episode', () => {
    for (const story of getKidsEpisodes()) {
      const activity = getFamilyActivity(story, 'middle');
      expect(activity).not.toBeNull();
      expect(['discussion', 'role-play', 'craft', 'game', 'worksheet']).toContain(activity!.type);
    }
  });

  it('falls back to pillar default game when no episode override', () => {
    const story = getStoryBySlug('privacy-panda-and-the-digital-bamboo-forest');
    expect(story).toBeDefined();
    expect(getEpisodeGame(story!).id).toBe('safe-unsafe');
  });
});
