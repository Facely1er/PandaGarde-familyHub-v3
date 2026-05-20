import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { logger } from '../lib/logger';
// Frontend-only mode - no authentication or database dependencies

interface ActivityProgress {
  activityId: string;
  completed: boolean;
  score?: number;
  completedAt: Date;
  timeSpent?: number; // in minutes
}

interface UserProgress {
  completedActivities: string[];
  activityDetails: Record<string, ActivityProgress>;
  totalTimeSpent: number;
  achievements: string[];
  lastUpdated: Date;
}

interface ProgressContextType {
  progress: UserProgress;
  markActivityCompleted: (activityId: string, score?: number, timeSpent?: number) => void;
  getActivityProgress: (activityId: string) => ActivityProgress | undefined;
  getOverallProgress: () => {
    completedCount: number;
    totalCount: number;
    percentage: number;
    averageScore: number;
  };
  resetProgress: () => void;
  exportProgress: () => string;
  importProgress: (data: string) => boolean;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

const STORAGE_KEY = 'pandagarde_progress';

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

interface ProgressProviderProps {
  children: React.ReactNode;
}

const parseStoredProgress = (parsed: unknown): UserProgress | null => {
  if (!parsed || typeof parsed !== 'object') {
    return null;
  }

  const data = parsed as {
    completedActivities?: unknown;
    activityDetails?: Record<string, Partial<ActivityProgress>>;
    totalTimeSpent?: unknown;
    achievements?: unknown;
    lastUpdated?: unknown;
  };

  return {
    completedActivities: Array.isArray(data.completedActivities)
      ? data.completedActivities.filter((activityId): activityId is string => typeof activityId === 'string')
      : [],
    activityDetails: Object.fromEntries(
      Object.entries(data.activityDetails ?? {}).map(([key, value]) => [
        key,
        {
          activityId: typeof value.activityId === 'string' ? value.activityId : key,
          completed: Boolean(value.completed),
          score: typeof value.score === 'number' ? value.score : undefined,
          completedAt: value.completedAt ? new Date(value.completedAt) : new Date(),
          timeSpent: typeof value.timeSpent === 'number' ? value.timeSpent : undefined,
        },
      ])
    ),
    totalTimeSpent: typeof data.totalTimeSpent === 'number' ? data.totalTimeSpent : 0,
    achievements: Array.isArray(data.achievements)
      ? data.achievements.filter((achievement): achievement is string => typeof achievement === 'string')
      : [],
    lastUpdated: data.lastUpdated ? new Date(data.lastUpdated) : new Date(),
  };
};

export const ProgressProvider: React.FC<ProgressProviderProps> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress>({
    completedActivities: [],
    activityDetails: {},
    totalTimeSpent: 0,
    achievements: [],
    lastUpdated: new Date()
  });

  useEffect(() => {
    const savedProgress = localStorage.getItem(STORAGE_KEY);
    if (!savedProgress) {
      return;
    }

    try {
      const parsed = JSON.parse(savedProgress) as unknown;
      const processedProgress = parseStoredProgress(parsed);
      if (processedProgress) {
        setProgress(processedProgress);
      }
    } catch (error) {
      logger.error('Error loading progress from localStorage:', error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const markActivityCompleted = useCallback((activityId: string, score?: number, timeSpent?: number) => {
    setProgress(prev => {
      const isAlreadyCompleted = prev.completedActivities.includes(activityId);

      if (isAlreadyCompleted) {
        return prev;
      }

      const newProgress: UserProgress = {
        ...prev,
        completedActivities: [...prev.completedActivities, activityId],
        activityDetails: {
          ...prev.activityDetails,
          [activityId]: {
            activityId,
            completed: true,
            score,
            completedAt: new Date(),
            timeSpent
          }
        },
        totalTimeSpent: prev.totalTimeSpent + (timeSpent || 0),
        lastUpdated: new Date()
      };

      const achievements = [...prev.achievements];

      if (newProgress.completedActivities.length === 1) {
        achievements.push('first_activity');
      }

      if (newProgress.completedActivities.length === 3) {
        achievements.push('getting_started');
      }

      if (newProgress.completedActivities.length === 8) {
        achievements.push('privacy_champion');
      }

      if (newProgress.totalTimeSpent >= 60) {
        achievements.push('dedicated_learner');
      }

      newProgress.achievements = [...new Set(achievements)];

      return newProgress;
    });
  }, []);

  const getActivityProgress = useCallback((activityId: string) => {
    return progress.activityDetails[activityId];
  }, [progress.activityDetails]);

  const getOverallProgress = useCallback(() => {
    const totalCount = 8;
    const completedCount = progress.completedActivities.length;
    const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    const scores = Object.values(progress.activityDetails)
      .map(activity => activity.score)
      .filter((score): score is number => score !== undefined);

    const averageScore = scores.length > 0
      ? Math.round(scores.reduce((sum, currentScore) => sum + currentScore, 0) / scores.length)
      : 0;

    return {
      completedCount,
      totalCount,
      percentage,
      averageScore
    };
  }, [progress.completedActivities, progress.activityDetails]);

  const resetProgress = useCallback(() => {
    setProgress({
      completedActivities: [],
      activityDetails: {},
      totalTimeSpent: 0,
      achievements: [],
      lastUpdated: new Date()
    });
  }, []);

  const exportProgress = useCallback(() => {
    return JSON.stringify(progress, null, 2);
  }, [progress]);

  const importProgress = useCallback((data: string) => {
    try {
      const parsed = JSON.parse(data) as unknown;
      const processedProgress = parseStoredProgress(parsed);
      if (!processedProgress) {
        return false;
      }

      setProgress(processedProgress);
      return true;
    } catch (error) {
      logger.error('Error importing progress:', error);
      return false;
    }
  }, []);

  const value: ProgressContextType = {
    progress,
    markActivityCompleted,
    getActivityProgress,
    getOverallProgress,
    resetProgress,
    exportProgress,
    importProgress
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};
