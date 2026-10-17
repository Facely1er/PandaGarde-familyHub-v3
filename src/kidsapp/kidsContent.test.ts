import { describe, expect, it } from 'vitest';
import { getStoryBySlug } from '../data/stories';
import {
  getEpisodeGame,
  getFamilyActivity,
  getKidsEpisodes,
  getKidsEpisodesBySeason,
  isKidsEpisodeUnlocked,
  KIDS_SEASON,
  KIDS_SEASONS,
} from './kidsContent';

describe('kidsContent research alignment', () => {
  it('includes Season 1 and Season 2 (16 episodes) on the forest path', () => {
    const episodes = getKidsEpisodes();
    expect(KIDS_SEASONS).toEqual([1, 2]);
    expect(getKidsEpisodesBySeason(KIDS_SEASON)).toHaveLength(8);
    expect(getKidsEpisodesBySeason(2)).toHaveLength(8);
    expect(episodes).toHaveLength(16);
    expect(episodes[0].season).toBe(1);
    expect(episodes[8].season).toBe(2);
  });

  it('unlocks Season 2 only after Season 1 is complete', () => {
    const noneComplete = () => false;
    const season1Done = (slug: string) =>
      getKidsEpisodesBySeason(1).some((story) => story.slug === slug);

    expect(isKidsEpisodeUnlocked('privacy-panda-and-the-digital-bamboo-forest', noneComplete)).toBe(
      true,
    );
    expect(isKidsEpisodeUnlocked('the-echo-chamber', noneComplete)).toBe(false);
    expect(isKidsEpisodeUnlocked('the-echo-chamber', season1Done)).toBe(true);
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

  it('Season 2 Echo Chamber reuses Kindness Guardians', () => {
    const story = getStoryBySlug('the-echo-chamber');
    expect(story).toBeDefined();
    expect(getEpisodeGame(story!).id).toBe('kindness-guardians');
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
