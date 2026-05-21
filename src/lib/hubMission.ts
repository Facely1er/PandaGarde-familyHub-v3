import {
  flattenAgeBasedActivities,
  getFeaturedAgeBasedActivities,
  type FlattenedAgeBasedActivity,
} from '../data/ageBasedActivities';

export const HUB_ORIGIN_KEY = 'pandagarde_hub_origin';
export const HUB_LAST_MISSION_KEY = 'pandagarde_hub_last_mission';
export const HUB_STREAK_KEY = 'pandagarde_hub_streak';
export const HUB_LAST_ACTIVE_KEY = 'pandagarde_hub_last_active_date';

export type HubOrigin = 'standalone' | 'web';

/** Completion key — matches ProgressContext / ActivityManager */
export function getCompletionId(activity: Pick<FlattenedAgeBasedActivity, 'id' | 'activityManagerId'>): string {
  return activity.activityManagerId ?? activity.id;
}

function todayDateKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayDateKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function getHubOrigin(): HubOrigin {
  if (typeof window === 'undefined') {
    return 'standalone';
  }
  const raw = window.localStorage.getItem(HUB_ORIGIN_KEY);
  return raw === 'web' ? 'web' : 'standalone';
}

export function setHubOrigin(origin: HubOrigin): void {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(HUB_ORIGIN_KEY, origin);
}

export function getHubStreak(): number {
  if (typeof window === 'undefined') {
    return 0;
  }
  const raw = window.localStorage.getItem(HUB_STREAK_KEY);
  const n = raw ? Number.parseInt(raw, 10) : 0;
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

/** Call when user completes any hub mission or opens hub on a new calendar day */
export function touchHubStreak(): number {
  if (typeof window === 'undefined') {
    return 0;
  }

  const today = todayDateKey();
  const lastActive = window.localStorage.getItem(HUB_LAST_ACTIVE_KEY);
  let streak = getHubStreak();

  if (lastActive === today) {
    return streak;
  }

  if (lastActive === yesterdayDateKey()) {
    streak += 1;
  } else {
    streak = 1;
  }

  window.localStorage.setItem(HUB_STREAK_KEY, String(streak));
  window.localStorage.setItem(HUB_LAST_ACTIVE_KEY, today);
  return streak;
}

export function setLastMissionId(activityId: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(HUB_LAST_MISSION_KEY, activityId);
}

export function getLastMissionId(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return window.localStorage.getItem(HUB_LAST_MISSION_KEY);
}

function matchesAge(activity: FlattenedAgeBasedActivity, ageRange?: string): boolean {
  if (!ageRange || ageRange === 'all') {
    return true;
  }
  return activity.groupAgeRange === ageRange;
}

function isIncomplete(activity: FlattenedAgeBasedActivity, completedIds: Set<string>): boolean {
  return !completedIds.has(getCompletionId(activity));
}

/**
 * Picks the best mission for "today" — featured incomplete first, then any incomplete for age band.
 */
export function pickTodaysMission(
  completedIds: Set<string>,
  preferredAgeRange?: string
): FlattenedAgeBasedActivity | null {
  const all = flattenAgeBasedActivities();
  const pool = all.filter((a) => matchesAge(a, preferredAgeRange) && isIncomplete(a, completedIds));

  if (pool.length === 0) {
    const anyIncomplete = all.filter((a) => isIncomplete(a, completedIds));
    return anyIncomplete[0] ?? all[0] ?? null;
  }

  const featured = getFeaturedAgeBasedActivities(pool);
  if (featured.length > 0) {
    return featured[0];
  }

  const lastId = getLastMissionId();
  if (lastId) {
    const resume = pool.find((a) => a.id === lastId);
    if (resume) {
      return resume;
    }
  }

  return pool[0];
}

/**
 * Next mission after the current one (same age band when possible).
 */
export function pickNextMission(
  current: FlattenedAgeBasedActivity,
  completedIds: Set<string>
): FlattenedAgeBasedActivity | null {
  const all = flattenAgeBasedActivities();
  const sameAge = all.filter(
    (a) =>
      a.groupAgeRange === current.groupAgeRange &&
      a.id !== current.id &&
      isIncomplete(a, completedIds)
  );
  if (sameAge.length > 0) {
    return sameAge[0];
  }

  const any = all.filter((a) => a.id !== current.id && isIncomplete(a, completedIds));
  return any[0] ?? null;
}

export function findActivityById(activityId: string): FlattenedAgeBasedActivity | null {
  return flattenAgeBasedActivities().find((a) => a.id === activityId) ?? null;
}

/** Preferred age band from youngest child in family (for mission picks) */
export function preferredAgeFromFamily(
  members: { age: number; role?: string }[]
): string | undefined {
  const children = members.filter((m) => m.role === 'Child' && m.age >= 5 && m.age <= 17);
  if (children.length === 0) {
    return undefined;
  }
  const youngest = Math.min(...children.map((c) => c.age));
  if (youngest <= 8) {
    return '5-8';
  }
  if (youngest <= 12) {
    return '9-12';
  }
  return '13-17';
}

export function recordMissionComplete(activity: FlattenedAgeBasedActivity): number {
  setLastMissionId(activity.id);
  return touchHubStreak();
}
