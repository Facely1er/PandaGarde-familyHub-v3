/**
 * Utility functions to integrate game/journey completion with Family Progress tracking
 * This connects game completion events to the FamilyProgressContext
 */

import React, { createContext, useContext } from 'react';
import { useFamilyProgress } from '../contexts/FamilyProgressContext';
import { HUB_CURRENT_MEMBER_KEY } from '../familyhub/hubFamilyMembers';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { logger } from '../lib/logger';

/**
 * When true, games are embedded in MissionShell via ActivityManager.
 * MissionShell records journey progress with the mission id — games must not
 * also write a separate game record (avoids duplicate per-child history).
 */
const MissionShellGameContext = createContext(false);

export const MissionShellGameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) =>
  React.createElement(MissionShellGameContext.Provider, { value: true }, children);

export const useIsMissionShellGame = () => useContext(MissionShellGameContext);

/**
 * Hook to record game completion
 * Use this in game components when a game is completed
 */
export const useGameCompletion = () => {
  const { recordActivityCompletion } = useFamilyProgress();
  const [currentMemberId] = useLocalStorage<number | null>(HUB_CURRENT_MEMBER_KEY, null);
  const isMissionShellGame = useIsMissionShellGame();

  const recordGameCompletion = (
    gameId: string,
    gameName: string,
    score: number,
    maxScore: number = 100,
    additionalData?: Record<string, unknown>
  ) => {
    if (isMissionShellGame) {
      return;
    }

    if (!currentMemberId) {
      logger.warn('No active family member selected. Progress not recorded.');
      return;
    }

    recordActivityCompletion(
      currentMemberId,
      gameId,
      gameName,
      'game',
      score,
      maxScore,
      additionalData
    );
  };

  return { recordGameCompletion, currentMemberId };
};

/**
 * Hook to record journey activity completion
 * Use this in journey components when an activity is completed
 */
export const useJourneyCompletion = () => {
  const { recordActivityCompletion } = useFamilyProgress();
  const [currentMemberId] = useLocalStorage<number | null>(HUB_CURRENT_MEMBER_KEY, null);

  const recordJourneyActivity = (
    activityId: string,
    activityName: string,
    score: number,
    maxScore: number = 100,
    additionalData?: Record<string, unknown>
  ) => {
    if (!currentMemberId) {
      logger.warn('No active family member selected. Progress not recorded.');
      return;
    }

    recordActivityCompletion(
      currentMemberId,
      activityId,
      activityName,
      'journey',
      score,
      maxScore,
      additionalData
    );
  };

  return { recordJourneyActivity, currentMemberId };
};

/**
 * Helper to set the active family member
 * Call this when a user selects which family member is playing
 */
export const useActiveMember = () => {
  const [currentMemberId, setCurrentMemberId] = useLocalStorage<number | null>(
    HUB_CURRENT_MEMBER_KEY,
    null
  );

  const setActiveMember = (memberId: number | null) => {
    setCurrentMemberId(memberId);
  };

  return { currentMemberId, setActiveMember };
};

