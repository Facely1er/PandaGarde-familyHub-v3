/** Canonical Family Hub member list (name + age, device-local). */
export const HUB_FAMILY_STORAGE_KEY = 'pandagarde_family';

export const HUB_FAMILY_PROGRESS_KEY = 'pandagarde_family_progress';

export const HUB_CURRENT_MEMBER_KEY = 'pandagarde_currentMember';

export interface HubFamilyMember {
  id: number;
  name: string;
  age: number;
  role: string;
  privacyScore: number;
  completedActivities: number;
  badges: string[];
  lastActive: string;
  /** Linked row in `pandagarde_family_data` (FamilyContext). */
  contextMemberId?: string;
  /** Gamification progress key in `pandagarde_user_progress`. */
  userId?: string;
}

/** Remove one member's activity history from Family Hub progress storage. */
export function removeMemberProgressFromStorage(memberId: number): void {
  try {
    const raw = localStorage.getItem(HUB_FAMILY_PROGRESS_KEY);
    if (!raw) {
      return;
    }
    const data = JSON.parse(raw) as Record<string, unknown>;
    delete data[String(memberId)];
    localStorage.setItem(HUB_FAMILY_PROGRESS_KEY, JSON.stringify(data));
  } catch {
    // ignore corrupt storage
  }
}

/** Clear active child selection when that member is removed. */
export function clearActiveMemberIfMatches(memberId: number): void {
  try {
    const raw = localStorage.getItem(HUB_CURRENT_MEMBER_KEY);
    if (raw === null) {
      return;
    }
    const activeId = JSON.parse(raw) as number;
    if (activeId === memberId) {
      localStorage.removeItem(HUB_CURRENT_MEMBER_KEY);
    }
  } catch {
    localStorage.removeItem(HUB_CURRENT_MEMBER_KEY);
  }
}
