import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { HubFamilyMember } from '../familyhub/hubFamilyMembers';
import {
  addHubMemberToStores,
  loadHubMembers,
  reconcileHubAndContext,
  removeHubMemberFromStores,
  saveHubMembers,
  updateHubMemberInStores,
} from '../familyhub/hubFamilySync';
import { useFamily } from './FamilyContext';
import { logger } from '../lib/logger';
import { HubFamilyContext } from './hubFamilyContextState';

export const HubFamilyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { refreshFamily } = useFamily();
  const [members, setMembers] = useState<HubFamilyMember[]>(() => loadHubMembers());
  const [syncing, setSyncing] = useState(false);
  const reconciledRef = useRef(false);

  const refreshFromStores = useCallback(async () => {
    setSyncing(true);
    try {
      const merged = await reconcileHubAndContext();
      setMembers(merged);
      await refreshFamily();
    } catch (error) {
      logger.error('Failed to reconcile Hub and family stores:', error);
    } finally {
      setSyncing(false);
    }
  }, [refreshFamily]);

  useEffect(() => {
    if (reconciledRef.current) {
      return;
    }
    reconciledRef.current = true;
    void refreshFromStores();
  }, [refreshFromStores]);

  const addMember = useCallback(
    async (name: string, age: number, role: string): Promise<HubFamilyMember | null> => {
      if (!name.trim() || age <= 0) {
        return null;
      }
      setSyncing(true);
      try {
        const linked = await addHubMemberToStores(name, age, role);
        const next = loadHubMembers();
        setMembers(next.length > 0 ? next : [linked]);
        await refreshFamily();
        return linked;
      } catch (error) {
        logger.error('Failed to add Hub family member:', error);
        return null;
      } finally {
        setSyncing(false);
      }
    },
    [refreshFamily]
  );

  const updateMember = useCallback(
    async (
      member: HubFamilyMember,
      updates: { name: string; age: number; role: string }
    ): Promise<HubFamilyMember | null> => {
      if (!updates.name.trim() || updates.age <= 0) {
        return null;
      }
      setSyncing(true);
      try {
        const updated = await updateHubMemberInStores(member, updates);
        setMembers(loadHubMembers());
        await refreshFamily();
        return updated;
      } catch (error) {
        logger.error('Failed to update Hub family member:', error);
        return null;
      } finally {
        setSyncing(false);
      }
    },
    [refreshFamily]
  );

  const removeMember = useCallback(
    async (member: HubFamilyMember): Promise<void> => {
      setSyncing(true);
      try {
        const next = await removeHubMemberFromStores(member);
        setMembers(next);
        await refreshFamily();
      } catch (error) {
        logger.error('Failed to remove Hub family member:', error);
      } finally {
        setSyncing(false);
      }
    },
    [refreshFamily]
  );

  const replaceMembers = useCallback((next: HubFamilyMember[]) => {
    saveHubMembers(next);
    setMembers(next);
  }, []);

  const value = useMemo(
    () => ({
      members,
      syncing,
      addMember,
      updateMember,
      removeMember,
      replaceMembers,
      refreshFromStores,
    }),
    [members, syncing, addMember, updateMember, removeMember, replaceMembers, refreshFromStores]
  );

  return <HubFamilyContext.Provider value={value}>{children}</HubFamilyContext.Provider>;
};
