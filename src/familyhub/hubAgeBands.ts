/** Age-band visuals for Family Hub — aligned with ageBasedActivities groups */

export type HubAgeRange = '5-8' | '9-12' | '13-17';

export interface HubAgeBand {
  range: HubAgeRange;
  label: string;
  shortLabel: string;
  emoji: string;
  tagline: string;
  missionCount: number;
  cardClass: string;
  chipClass: string;
  avatarClass: string;
}

export const HUB_AGE_BANDS: HubAgeBand[] = [
  {
    range: '5-8',
    label: 'Little Explorers',
    shortLabel: 'Ages 5–8',
    emoji: '🐼',
    tagline: 'First steps in safe sharing',
    missionCount: 6,
    cardClass:
      'border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 dark:border-emerald-700/50 dark:from-emerald-900/25 dark:to-teal-900/20',
    chipClass:
      'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200 dark:hover:bg-emerald-900/50',
    avatarClass: 'from-emerald-400 to-teal-500',
  },
  {
    range: '9-12',
    label: 'Privacy Detectives',
    shortLabel: 'Ages 9–12',
    emoji: '🕵️',
    tagline: 'Games, chats & scams',
    missionCount: 6,
    cardClass:
      'border-sky-200 bg-gradient-to-br from-sky-50 to-indigo-50 dark:border-sky-700/50 dark:from-sky-900/25 dark:to-indigo-900/20',
    chipClass:
      'border-sky-200 bg-sky-50 text-sky-800 hover:bg-sky-100 dark:border-sky-700 dark:bg-sky-900/30 dark:text-sky-200 dark:hover:bg-sky-900/50',
    avatarClass: 'from-sky-400 to-indigo-500',
  },
  {
    range: '13-17',
    label: 'Digital Citizens',
    shortLabel: 'Ages 13–17',
    emoji: '🌐',
    tagline: 'Social life & future you',
    missionCount: 6,
    cardClass:
      'border-violet-200 bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:border-violet-700/50 dark:from-violet-900/25 dark:to-fuchsia-900/20',
    chipClass:
      'border-violet-200 bg-violet-50 text-violet-800 hover:bg-violet-100 dark:border-violet-700 dark:bg-violet-900/30 dark:text-violet-200 dark:hover:bg-violet-900/50',
    avatarClass: 'from-violet-400 to-fuchsia-500',
  },
];

export function hubAgeBandForAge(age: number): HubAgeBand | undefined {
  if (age >= 5 && age <= 8) return HUB_AGE_BANDS[0];
  if (age >= 9 && age <= 12) return HUB_AGE_BANDS[1];
  if (age >= 13 && age <= 17) return HUB_AGE_BANDS[2];
  return undefined;
}

export function hubAgeBandByRange(range: HubAgeRange): HubAgeBand {
  return HUB_AGE_BANDS.find((b) => b.range === range) ?? HUB_AGE_BANDS[0];
}
