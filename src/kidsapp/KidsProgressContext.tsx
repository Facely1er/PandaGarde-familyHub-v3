import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { appStorage } from '../lib/storageAdapter';
import type { QuestPillar } from '../data/stories';
import { getKidsEpisodes, type KidAgeBand } from './kidsContent';

/** All kids-app persistence is anonymous and device-local (no name, no email). */
const KIDS_PROFILE_KEY = 'pandagarde-kids-profile';
const KIDS_EPISODES_KEY = 'pandagarde-kids-episodes';

export interface KidProfile {
  avatarId: string;
  ageBand: KidAgeBand;
}

export interface EpisodeRecord {
  storyRead: boolean;
  gameScore: number | null;
  completedAt: string | null;
  pillar: QuestPillar;
}

type EpisodeMap = Record<string, EpisodeRecord>;

interface KidsProgressContextType {
  profile: KidProfile | null;
  setProfile: (profile: KidProfile) => void;
  resetAll: () => void;
  episodes: EpisodeMap;
  markStoryRead: (slug: string, pillar: QuestPillar) => void;
  markEpisodeComplete: (slug: string, pillar: QuestPillar, gameScore?: number) => void;
  isEpisodeComplete: (slug: string) => boolean;
  earnedBadges: { slug: string; pillar: QuestPillar; completedAt: string }[];
  seasonComplete: boolean;
}

const KidsProgressContext = createContext<KidsProgressContextType | undefined>(undefined);

export const useKidsProgress = (): KidsProgressContextType => {
  const context = useContext(KidsProgressContext);
  if (!context) {
    throw new Error('useKidsProgress must be used within KidsProgressProvider');
  }
  return context;
};

export const KidsProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfileState] = useState<KidProfile | null>(() =>
    appStorage.get<KidProfile | null>(KIDS_PROFILE_KEY, null)
  );
  const [episodes, setEpisodes] = useState<EpisodeMap>(() =>
    appStorage.get<EpisodeMap>(KIDS_EPISODES_KEY, {})
  );

  const setProfile = useCallback((next: KidProfile) => {
    setProfileState(next);
    appStorage.set(KIDS_PROFILE_KEY, next);
  }, []);

  const resetAll = useCallback(() => {
    setProfileState(null);
    setEpisodes({});
    appStorage.remove(KIDS_PROFILE_KEY);
    appStorage.remove(KIDS_EPISODES_KEY);
  }, []);

  const updateEpisodes = useCallback((updater: (prev: EpisodeMap) => EpisodeMap) => {
    setEpisodes((prev) => {
      const next = updater(prev);
      appStorage.set(KIDS_EPISODES_KEY, next);
      return next;
    });
  }, []);

  const markStoryRead = useCallback(
    (slug: string, pillar: QuestPillar) => {
      updateEpisodes((prev) => ({
        ...prev,
        [slug]: {
          storyRead: true,
          gameScore: prev[slug]?.gameScore ?? null,
          completedAt: prev[slug]?.completedAt ?? null,
          pillar,
        },
      }));
    },
    [updateEpisodes]
  );

  const markEpisodeComplete = useCallback(
    (slug: string, pillar: QuestPillar, gameScore?: number) => {
      updateEpisodes((prev) => ({
        ...prev,
        [slug]: {
          storyRead: true,
          gameScore: gameScore ?? prev[slug]?.gameScore ?? null,
          completedAt: prev[slug]?.completedAt ?? new Date().toISOString(),
          pillar,
        },
      }));
    },
    [updateEpisodes]
  );

  const isEpisodeComplete = useCallback(
    (slug: string) => Boolean(episodes[slug]?.completedAt),
    [episodes]
  );

  const earnedBadges = useMemo(
    () =>
      Object.entries(episodes)
        .filter(([, record]) => record.completedAt !== null)
        .map(([slug, record]) => ({
          slug,
          pillar: record.pillar,
          completedAt: record.completedAt as string,
        }))
        .sort((a, b) => a.completedAt.localeCompare(b.completedAt)),
    [episodes]
  );

  const seasonComplete = useMemo(() => {
    const seasonEpisodes = getKidsEpisodes();
    return (
      seasonEpisodes.length > 0 &&
      seasonEpisodes.every((story) => Boolean(episodes[story.slug]?.completedAt))
    );
  }, [episodes]);

  const value = useMemo(
    () => ({
      profile,
      setProfile,
      resetAll,
      episodes,
      markStoryRead,
      markEpisodeComplete,
      isEpisodeComplete,
      earnedBadges,
      seasonComplete,
    }),
    [
      profile,
      setProfile,
      resetAll,
      episodes,
      markStoryRead,
      markEpisodeComplete,
      isEpisodeComplete,
      earnedBadges,
      seasonComplete,
    ]
  );

  return <KidsProgressContext.Provider value={value}>{children}</KidsProgressContext.Provider>;
};
