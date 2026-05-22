import { localStorageManager } from '../utils/localStorageManager';
import { hubAgeBandForAge } from './hubAgeBands';
import {
  HUB_FAMILY_STORAGE_KEY,
  type HubFamilyMember,
} from './hubFamilyMembers';
import type { FamilyMember } from '../contexts/FamilyContext';
import { logger } from '../lib/logger';

const HUB_FAMILY_DEFAULT_NAME = 'My Family';

interface StoredFamily {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  members: FamilyMember[];
}

export function stableHubNumericId(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const n = Math.abs(hash);
  return n > 0 ? n : Date.now();
}

export function hubEmailForMemberId(hubId: number): string {
  return `hub+${hubId}@device.local`;
}

export function contextRoleFromHubRole(role: string): 'parent' | 'child' {
  const normalized = role.toLowerCase();
  return normalized === 'parent' || normalized === 'guardian' ? 'parent' : 'child';
}

export function hubRoleFromContextRole(role: 'parent' | 'child'): string {
  return role === 'parent' ? 'Parent' : 'Child';
}

export function splitDisplayName(name: string): { firstName: string; lastName: string } {
  const trimmed = name.trim();
  if (!trimmed) {
    return { firstName: 'Family', lastName: 'Member' };
  }
  const parts = trimmed.split(/\s+/);
  const firstName = parts[0] ?? 'Family';
  const lastName = parts.slice(1).join(' ') || 'Member';
  return { firstName, lastName };
}

export function defaultAgeForRole(role: 'parent' | 'child'): number {
  return role === 'parent' ? 35 : 10;
}

export function loadHubMembers(): HubFamilyMember[] {
  try {
    const raw = localStorage.getItem(HUB_FAMILY_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as HubFamilyMember[]) : [];
  } catch {
    return [];
  }
}

export function saveHubMembers(members: HubFamilyMember[]): void {
  localStorage.setItem(HUB_FAMILY_STORAGE_KEY, JSON.stringify(members));
}

export function contextMemberToHub(member: FamilyMember): HubFamilyMember {
  const name = `${member.first_name} ${member.last_name}`.trim() || 'Family Member';
  const age = member.profile_data?.age ?? defaultAgeForRole(member.role);
  return {
    id: stableHubNumericId(member.id),
    name,
    age,
    role: hubRoleFromContextRole(member.role),
    privacyScore: 0,
    completedActivities: 0,
    badges: [],
    lastActive: member.updated_at || new Date().toISOString(),
    contextMemberId: member.id,
    userId: member.user_id,
  };
}

export function createHubMemberDraft(name: string, age: number, role: string): HubFamilyMember {
  const id = Date.now();
  return {
    id,
    name: name.trim(),
    age,
    role,
    privacyScore: 0,
    completedActivities: 0,
    badges: [],
    lastActive: new Date().toISOString(),
  };
}

async function readStoredFamily(): Promise<StoredFamily | null> {
  const data = await localStorageManager.getFamilyData();
  if (!data || typeof data !== 'object') {
    return null;
  }
  const family = data as StoredFamily;
  if (!Array.isArray(family.members)) {
    return null;
  }
  return family;
}

async function writeStoredFamily(family: StoredFamily): Promise<void> {
  family.updated_at = new Date().toISOString();
  await localStorageManager.saveFamilyData(family);
}

async function ensureStoredFamily(): Promise<StoredFamily> {
  const existing = await readStoredFamily();
  if (existing) {
    return existing;
  }

  let currentUserId = localStorage.getItem('pandagarde_current_user_id');
  if (!currentUserId) {
    currentUserId = `user_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    localStorage.setItem('pandagarde_current_user_id', currentUserId);
  }

  const familyId = `family_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  const now = new Date().toISOString();
  const family: StoredFamily = {
    id: familyId,
    name: HUB_FAMILY_DEFAULT_NAME,
    created_by: currentUserId,
    created_at: now,
    updated_at: now,
    members: [
      {
        id: `member_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
        user_id: currentUserId,
        family_id: familyId,
        role: 'parent',
        first_name: 'Parent',
        last_name: 'User',
        email: 'parent@device.local',
        created_at: now,
        updated_at: now,
        profile_data: { age: 35 },
      },
    ],
  };

  await writeStoredFamily(family);
  localStorageManager.createUserProgress(currentUserId, 'Parent User', '13-17');
  return family;
}

function ageGroupForAge(age: number): '5-8' | '9-12' | '13-17' {
  const band = hubAgeBandForAge(age);
  return band?.range ?? '9-12';
}

async function appendContextMember(
  family: StoredFamily,
  hubMember: HubFamilyMember
): Promise<HubFamilyMember> {
  const email = hubEmailForMemberId(hubMember.id);
  if (family.members.some((m) => m.email === email || m.id === hubMember.contextMemberId)) {
    const existing = family.members.find(
      (m) => m.email === email || m.id === hubMember.contextMemberId
    );
    if (existing) {
      return {
        ...hubMember,
        contextMemberId: existing.id,
        userId: existing.user_id,
      };
    }
  }

  const ctxRole = contextRoleFromHubRole(hubMember.role);
  const { firstName, lastName } = splitDisplayName(hubMember.name);
  const userId = `user_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  const now = new Date().toISOString();
  const contextMember: FamilyMember = {
    id: `member_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
    user_id: userId,
    family_id: family.id,
    role: ctxRole,
    first_name: firstName,
    last_name: lastName,
    email,
    created_at: now,
    updated_at: now,
    profile_data: { age: hubMember.age },
  };

  family.members.push(contextMember);
  localStorageManager.createUserProgress(
    userId,
    hubMember.name,
    ageGroupForAge(hubMember.age)
  );

  return {
    ...hubMember,
    contextMemberId: contextMember.id,
    userId: contextMember.user_id,
  };
}

async function syncHubMemberToContext(hubMember: HubFamilyMember): Promise<HubFamilyMember> {
  if (hubMember.contextMemberId) {
    return hubMember;
  }
  const family = await ensureStoredFamily();
  const linked = await appendContextMember(family, hubMember);
  await writeStoredFamily(family);
  return linked;
}

async function syncHubListToContext(members: HubFamilyMember[]): Promise<HubFamilyMember[]> {
  const family = await ensureStoredFamily();
  const linked: HubFamilyMember[] = [];
  for (const member of members) {
    linked.push(await appendContextMember(family, member));
  }
  await writeStoredFamily(family);
  return linked;
}

async function removeContextMember(contextMemberId: string, userId?: string): Promise<void> {
  const family = await readStoredFamily();
  if (!family) {
    return;
  }
  family.members = family.members.filter((m) => m.id !== contextMemberId);
  await writeStoredFamily(family);
  if (userId) {
    localStorageManager.deleteUser(userId);
  }
}

/**
 * Merge Hub list (`pandagarde_family`) with encrypted family store (`pandagarde_family_data`).
 * Safe to call on each Hub session start.
 */
export async function reconcileHubAndContext(): Promise<HubFamilyMember[]> {
  let hub = loadHubMembers();
  const family = await readStoredFamily();

  if (!family) {
    if (hub.length > 0) {
      hub = await syncHubListToContext(hub);
      saveHubMembers(hub);
    }
    return hub;
  }

  if (hub.length === 0 && family.members.length > 0) {
    hub = family.members.map(contextMemberToHub);
    saveHubMembers(hub);
    return hub;
  }

  const linkedContextIds = new Set(
    hub.map((m) => m.contextMemberId).filter((id): id is string => Boolean(id))
  );

  for (const contextMember of family.members) {
    if (!linkedContextIds.has(contextMember.id)) {
      hub.push(contextMemberToHub(contextMember));
    }
  }

  const needsContextSync = hub.some((m) => !m.contextMemberId);
  if (needsContextSync) {
    const familyForSync = await ensureStoredFamily();
    hub = await Promise.all(
      hub.map(async (member) => {
        if (member.contextMemberId) {
          return member;
        }
        const linked = await appendContextMember(familyForSync, member);
        return linked;
      })
    );
    await writeStoredFamily(familyForSync);
  }

  saveHubMembers(hub);
  return hub;
}

export async function addHubMemberToStores(
  name: string,
  age: number,
  role: string
): Promise<HubFamilyMember> {
  const draft = createHubMemberDraft(name, age, role);
  const linked = await syncHubMemberToContext(draft);
  const members = [...loadHubMembers(), linked];
  saveHubMembers(members);
  return linked;
}

export async function removeHubMemberFromStores(member: HubFamilyMember): Promise<HubFamilyMember[]> {
  if (member.contextMemberId) {
    await removeContextMember(member.contextMemberId, member.userId);
  }
  const members = loadHubMembers().filter((m) => m.id !== member.id);
  saveHubMembers(members);
  return members;
}

export async function updateHubMemberInStores(
  member: HubFamilyMember,
  updates: { name: string; age: number; role: string }
): Promise<HubFamilyMember> {
  const trimmedName = updates.name.trim();
  const { firstName, lastName } = splitDisplayName(trimmedName);
  const ctxRole = contextRoleFromHubRole(updates.role);
  let linked = member;

  if (member.contextMemberId) {
    const family = await readStoredFamily();
    if (family) {
      const index = family.members.findIndex((m) => m.id === member.contextMemberId);
      if (index >= 0) {
        const existing = family.members[index];
        family.members[index] = {
          ...existing,
          first_name: firstName,
          last_name: lastName,
          role: ctxRole,
          updated_at: new Date().toISOString(),
          profile_data: {
            ...existing.profile_data,
            age: updates.age,
          },
        };
        await writeStoredFamily(family);
      }
    }

    if (member.userId) {
      const progress = localStorageManager.getUserProgress(member.userId);
      if (progress) {
        progress.name = trimmedName;
        localStorageManager.saveUserProgress(member.userId, progress);
      }
    }
  } else {
    linked = await syncHubMemberToContext({
      ...member,
      name: trimmedName,
      age: updates.age,
      role: updates.role,
    });
  }

  const updated: HubFamilyMember = {
    ...linked,
    name: trimmedName,
    age: updates.age,
    role: updates.role,
    lastActive: new Date().toISOString(),
  };

  const members = loadHubMembers().map((m) => (m.id === updated.id ? updated : m));
  saveHubMembers(members);
  return updated;
}

/** After website Family Hub adds a member via FamilyContext */
export function appendHubMemberFromContext(contextMember: FamilyMember): void {
  const hub = loadHubMembers();
  if (hub.some((m) => m.contextMemberId === contextMember.id)) {
    return;
  }
  hub.push(contextMemberToHub(contextMember));
  saveHubMembers(hub);
}
