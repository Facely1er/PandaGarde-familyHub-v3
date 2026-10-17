import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { appStorage } from '../lib/storageAdapter';
import type { QuestPillar } from '../data/stories';
import { getKidsEpisodesBySeason, type KidAgeBand, type KidsSeason } from './kidsContent';

/** All kids-app persistence is anonymous and device-local (no name, no email). */
const KIDS_PROFILE_KEY = 'pandagarde-kids-profile';
const KIDS_EPISODES_KEY = 'pandagarde-kids-episodes';
const KIDS_TRUSTED_TEAM_KEY = 'pandagarde-kids-trusted-team';
const KIDS_CAMP_KEY = 'pandagarde-kids-camp';

export type TentThemeId = 'bamboo' | 'stream' | 'lantern' | 'moss';

export interface KidsCampState {
  tentTheme: TentThemeId;
  /** Optional free-text notes the child adds (no PII expected). */
  journalNotes: string[];
}

export const TENT_THEMES: { id: TentThemeId; label: string; emoji: string; campClass: string }[] = [
  { id: 'bamboo', label: 'Bamboo Grove', emoji: '🎋', campClass: 'from-emerald-100 to-lime-50 dark:from-emerald-950/50 dark:to-gray-900' },
  { id: 'stream', label: 'Crystal Stream', emoji: '💧', campClass: 'from-sky-100 to-cyan-50 dark:from-sky-950/50 dark:to-gray-900' },
  { id: 'lantern', label: 'Lantern Glow', emoji: '🏮', campClass: 'from-amber-100 to-orange-50 dark:from-amber-950/50 dark:to-gray-900' },
  { id: 'moss', label: 'Moss Hollow', emoji: '🍃', campClass: 'from-green-100 to-teal-50 dark:from-green-950/50 dark:to-gray-900' },
];

const DEFAULT_CAMP: KidsCampState = { tentTheme: 'bamboo', journalNotes: [] };

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

/** Disclosure scaffold (research §1.4): generic roles + a code word — never names. */
export interface TrustedTeam {
  roleIds: string[];
  codeWord: string;
}

interface KidsProgressContextType {
  profile: KidProfile | null;
  setProfile: (profile: KidProfile) => void;
  resetAll: () => void;
  episodes: EpisodeMap;
  markStoryRead: (slug: string, pillar: QuestPillar) => void;
  markEpisodeComplete: (slug: string, pillar: QuestPillar, gameScore?: number) => void;
  isEpisodeComplete: (slug: string) => boolean;
  earnedBadges: { slug: string; pillar: QuestPillar; completedAt: string }[];
  /** True when Season 1 (Privacy Grove) is fully complete. */
  seasonComplete: boolean;
  season1Complete: boolean;
  season2Complete: boolean;
  isSeasonComplete: (season: KidsSeason) => boolean;
  camp: KidsCampState;
  setTentTheme: (theme: TentThemeId) => void;
  addJournalNote: (note: string) => void;
  trustedTeam: TrustedTeam | null;
  setTrustedTeam: (team: TrustedTeam) => void;
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
  const [trustedTeam, setTrustedTeamState] = useState<TrustedTeam | null>(() =>
    appStorage.get<TrustedTeam | null>(KIDS_TRUSTED_TEAM_KEY, null)
  );
  const [camp, setCampState] = useState<KidsCampState>(() =>
    appStorage.get<KidsCampState>(KIDS_CAMP_KEY, DEFAULT_CAMP)
  );

  const setTrustedTeam = useCallback((team: TrustedTeam) => {
    setTrustedTeamState(team);
    appStorage.set(KIDS_TRUSTED_TEAM_KEY, team);
  }, []);

  const setProfile = useCallback((next: KidProfile) => {
    setProfileState(next);
    appStorage.set(KIDS_PROFILE_KEY, next);
  }, []);

  const setTentTheme = useCallback((tentTheme: TentThemeId) => {
    setCampState((prev) => {
      const next = { ...prev, tentTheme };
      appStorage.set(KIDS_CAMP_KEY, next);
      return next;
    });
  }, []);

  const addJournalNote = useCallback((note: string) => {
    const trimmed = note.trim().slice(0, 280);
    if (!trimmed) {
      return;
    }
    setCampState((prev) => {
      const next = { ...prev, journalNotes: [trimmed, ...prev.journalNotes].slice(0, 12) };
      appStorage.set(KIDS_CAMP_KEY, next);
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    setProfileState(null);
    setEpisodes({});
    setTrustedTeamState(null);
    setCampState(DEFAULT_CAMP);
    appStorage.remove(KIDS_PROFILE_KEY);
    appStorage.remove(KIDS_EPISODES_KEY);
    appStorage.remove(KIDS_TRUSTED_TEAM_KEY);
    appStorage.remove(KIDS_CAMP_KEY);
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

  const isSeasonComplete = useCallback(
    (season: KidsSeason) => {
      const seasonEpisodes = getKidsEpisodesBySeason(season);
      return (
        seasonEpisodes.length > 0 &&
        seasonEpisodes.every((story) => Boolean(episodes[story.slug]?.completedAt))
      );
    },
    [episodes]
  );

  const season1Complete = useMemo(() => isSeasonComplete(1), [isSeasonComplete]);
  const season2Complete = useMemo(() => isSeasonComplete(2), [isSeasonComplete]);
  /** Backward-compatible alias: Season 1 Privacy Grove graduation. */
  const seasonComplete = season1Complete;

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
      season1Complete,
      season2Complete,
      isSeasonComplete,
      camp,
      setTentTheme,
      addJournalNote,
      trustedTeam,
      setTrustedTeam,
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
      season1Complete,
      season2Complete,
      isSeasonComplete,
      camp,
      setTentTheme,
      addJournalNote,
      trustedTeam,
      setTrustedTeam,
    ]
  );

  return <KidsProgressContext.Provider value={value}>{children}</KidsProgressContext.Provider>;
};
