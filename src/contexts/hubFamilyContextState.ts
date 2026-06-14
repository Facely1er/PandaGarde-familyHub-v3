import { createContext } from 'react';
import type { HubFamilyMember } from '../familyhub/hubFamilyMembers';

export interface HubFamilyContextValue {
  members: HubFamilyMember[];
  syncing: boolean;
  addMember: (name: string, age: number, role: string) => Promise<HubFamilyMember | null>;
  updateMember: (
    member: HubFamilyMember,
    updates: { name: string; age: number; role: string }
  ) => Promise<HubFamilyMember | null>;
  removeMember: (member: HubFamilyMember) => Promise<void>;
  replaceMembers: (next: HubFamilyMember[]) => void;
  refreshFromStores: () => Promise<void>;
}

export const HubFamilyContext = createContext<HubFamilyContextValue | undefined>(undefined);
