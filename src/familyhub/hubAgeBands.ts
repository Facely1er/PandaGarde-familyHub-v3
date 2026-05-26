/** Age-band visuals for Family Hub — aligned with ageBasedActivities groups */

import { Compass, Globe, Search, type LucideIcon } from 'lucide-react';

export type HubAgeRange = '5-8' | '9-12' | '13-17';

export interface HubAgeBand {
  range: HubAgeRange;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  tagline: string;
  missionCount: number;
  cardClass: string;
  chipClass: string;
  avatarClass: string;
  iconBadgeClass: string;
}

export const HUB_AGE_BANDS: HubAgeBand[] = [
  {
    range: '5-8',
    label: 'Little Explorers',
    shortLabel: 'Ages 5–8',
    icon: Compass,
    tagline: 'First steps in safe sharing',
    missionCount: 6,
    cardClass:
      'border-emerald-200 bg-emerald-50 dark:border-emerald-700/50 dark:bg-emerald-900/20',
    chipClass:
      'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200 dark:hover:bg-emerald-900/50',
    avatarClass: 'bg-emerald-600 text-white dark:bg-emerald-700',
    iconBadgeClass:
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  },
  {
    range: '9-12',
    label: 'Privacy Detectives',
    shortLabel: 'Ages 9–12',
    icon: Search,
    tagline: 'Games, chats & scams',
    missionCount: 6,
    cardClass: 'border-sky-200 bg-sky-50 dark:border-sky-700/50 dark:bg-sky-900/20',
    chipClass:
      'border-sky-200 bg-sky-50 text-sky-800 hover:bg-sky-100 dark:border-sky-700 dark:bg-sky-900/30 dark:text-sky-200 dark:hover:bg-sky-900/50',
    avatarClass: 'bg-sky-600 text-white dark:bg-sky-700',
    iconBadgeClass: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  },
  {
    range: '13-17',
    label: 'Digital Citizens',
    shortLabel: 'Ages 13–17',
    icon: Globe,
    tagline: 'Social life & future you',
    missionCount: 6,
    cardClass:
      'border-violet-200 bg-violet-50 dark:border-violet-700/50 dark:bg-violet-900/20',
    chipClass:
      'border-violet-200 bg-violet-50 text-violet-800 hover:bg-violet-100 dark:border-violet-700 dark:bg-violet-900/30 dark:text-violet-200 dark:hover:bg-violet-900/50',
    avatarClass: 'bg-violet-600 text-white dark:bg-violet-700',
    iconBadgeClass:
      'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
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
