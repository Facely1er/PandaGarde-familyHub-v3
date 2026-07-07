import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import {
  getStoriesBySeason,
  type Activity,
  type QuestPillar,
  type Story,
} from '../data/stories';

/** Season 1 — The Privacy Grove — is the kids app v1 campaign. */
export const KIDS_SEASON = 1 as const;

export function getKidsEpisodes(): Story[] {
  return getStoriesBySeason(KIDS_SEASON);
}

export type KidAgeBand = 'early' | 'middle' | 'older';

export const KID_AGE_BANDS: { id: KidAgeBand; label: string; emoji: string }[] = [
  { id: 'early', label: '5–7 years', emoji: '🌱' },
  { id: 'middle', label: '8–10 years', emoji: '🌿' },
  { id: 'older', label: '11–13 years', emoji: '🎋' },
];

export interface KidAvatar {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
}

/** Tier 1 cast from docs/STORYLINE_BIBLE.md §3 — no real names collected. */
export const KID_AVATARS: KidAvatar[] = [
  { id: 'po', name: 'Po the Panda', emoji: '🐼', tagline: 'The Curious Leader' },
  { id: 'ruby', name: 'Ruby the Bunny', emoji: '🐰', tagline: 'The Kind Friend' },
  { id: 'mika', name: 'Mika the Owl', emoji: '🦉', tagline: 'The Smart Thinker' },
  { id: 'tao', name: 'Tao the Turtle', emoji: '🐢', tagline: 'The Wise Guide' },
  { id: 'billy', name: 'Billy the Beaver', emoji: '🦫', tagline: 'The Clever Builder' },
];

export function getAvatar(avatarId: string | null): KidAvatar {
  return KID_AVATARS.find((a) => a.id === avatarId) ?? KID_AVATARS[0];
}

export interface PillarMeta {
  label: string;
  badgeName: string;
  emoji: string;
  chipClass: string;
}

export const PILLAR_META: Record<QuestPillar, PillarMeta> = {
  wisdom: {
    label: 'Path of Wisdom',
    badgeName: 'Wisdom Badge',
    emoji: '🐼',
    chipClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200',
  },
  connection: {
    label: 'Path of Connection',
    badgeName: 'Connection Badge',
    emoji: '🐰',
    chipClass: 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-200',
  },
  memory: {
    label: 'Path of Memory',
    badgeName: 'Memory Badge',
    emoji: '🦉',
    chipClass: 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-200',
  },
  protection: {
    label: 'Path of Protection',
    badgeName: 'Protection Badge',
    emoji: '🐢',
    chipClass: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200',
  },
  creation: {
    label: 'Path of Creation',
    badgeName: 'Creation Badge',
    emoji: '🦊',
    chipClass: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200',
  },
};

/**
 * Family reinforcement pick: research shows family-engaged interventions are
 * more durable, so each episode ends with one adult-child activity. Prefers
 * discussion/role-play types matched to the kid's age band, then falls back
 * to any age-appropriate activity.
 */
export function getFamilyActivity(story: Story, ageBand: KidAgeBand): Activity | null {
  const togetherTypes: Activity['type'][] = ['discussion', 'role-play'];
  const forAge = story.activities.filter((a) => a.ageGroups.includes(ageBand));
  const preferred = forAge.find((a) => togetherTypes.includes(a.type));
  if (preferred) {
    return preferred;
  }
  if (forAge.length > 0) {
    return forAge[0];
  }
  return story.activities.find((a) => togetherTypes.includes(a.type)) ?? story.activities[0] ?? null;
}

export interface GameComponentProps {
  onBack: () => void;
  onComplete?: (score?: number) => void;
}

export interface KidsGame {
  id: string;
  name: string;
  emoji: string;
  description: string;
  Component: LazyExoticComponent<ComponentType<GameComponentProps>>;
}

/** One kid-friendly mini-game per quest pillar (all support onComplete). */
export const PILLAR_GAMES: Record<QuestPillar, KidsGame> = {
  wisdom: {
    id: 'safe-unsafe',
    name: 'Safe vs Unsafe Sorting',
    emoji: '✅',
    description: 'Sort choices into safe and unsafe!',
    Component: lazy(() => import('../components/games/SafeUnsafeSorting')),
  },
  connection: {
    id: 'phishing-detective',
    name: 'Phishing Detective',
    emoji: '🔍',
    description: 'Spot the tricky messages!',
    Component: lazy(() => import('../components/games/PhishingDetective')),
  },
  memory: {
    id: 'digital-footprint',
    name: 'Digital Footprint Visualizer',
    emoji: '👣',
    description: 'See the trail you leave online!',
    Component: lazy(() => import('../components/games/DigitalFootprintVisualizer')),
  },
  protection: {
    id: 'password-fortress',
    name: 'Password Fortress Builder',
    emoji: '🏰',
    description: 'Build an unbreakable fortress!',
    Component: lazy(() => import('../components/games/PasswordFortressBuilder')),
  },
  creation: {
    id: 'privacy-settings',
    name: 'Privacy Settings Trainer',
    emoji: '⚙️',
    description: 'Become a settings master!',
    Component: lazy(() => import('../components/games/PrivacySettingsTrainer')),
  },
};

/**
 * Per-episode game overrides, keyed by story slug. Used where an episode's
 * theme calls for a topic-specific game rather than the pillar default —
 * notably the cyberbullying and trusted-adults episodes (research §1.4, §4.4).
 */
export const EPISODE_GAME_OVERRIDES: Record<string, KidsGame> = {
  // Episode 7 — "When Miki Said Something Unkind" (digital kindness)
  'when-miki-said-something-unkind': {
    id: 'kindness-guardians',
    name: 'Kindness Guardians',
    emoji: '💚',
    description: 'Spot unkindness and choose the guardian move!',
    Component: lazy(() => import('./games/KindnessGuardians')),
  },
  // Episode 8 — "Po's Toughest Question" (trusted adults & disclosure)
  'pos-toughest-question': {
    id: 'trusted-team-builder',
    name: 'Build Your Tao Circle',
    emoji: '🛡️',
    description: 'Choose your trusted grown-ups and a family code word!',
    Component: lazy(() => import('./games/TrustedTeamBuilder')),
  },
  // Season 2 episode 9 — "The Echo Chamber" (bystander's choice) reuses the
  // kindness game if/when Season 2 ships in the kids app.
  'the-echo-chamber': {
    id: 'kindness-guardians',
    name: 'Kindness Guardians',
    emoji: '💚',
    description: 'Spot unkindness and choose the guardian move!',
    Component: lazy(() => import('./games/KindnessGuardians')),
  },
};

export function getEpisodeGame(story: Story): KidsGame {
  return EPISODE_GAME_OVERRIDES[story.slug] ?? PILLAR_GAMES[story.questPillar];
}
