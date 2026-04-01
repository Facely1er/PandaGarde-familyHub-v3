import React, { createContext, useContext, useCallback, useState, ReactNode } from 'react';

// Simple localStorage hook for Family Hub
const useFamilyLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      setStoredValue((prev) => {
        const newValue = typeof value === 'function' ? (value as (prev: T) => T)(prev) : value;
        window.localStorage.setItem(key, JSON.stringify(newValue));
        return newValue;
      });
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [storedValue, setValue];
};

export interface ActivityResult {
  activityId: string;
  activityName: string;
  activityType: 'game' | 'journey' | 'module';
  score: number;
  maxScore: number;
  completedAt: string;
  timeSpent?: number;
  additionalData?: Record<string, unknown>;
}

export interface FamilyMemberProgress {
  memberId: number;
  activities: ActivityResult[];
  totalScore: number;
  completedCount: number;
  lastActive: string;
}

interface FamilyProgressContextType {
  recordActivityCompletion: (
    memberId: number,
    activityId: string,
    activityName: string,
    activityType: 'game' | 'journey' | 'module',
    score: number,
    maxScore: number,
    additionalData?: Record<string, unknown>
  ) => void;
  getMemberProgress: (memberId: number) => FamilyMemberProgress | null;
  getMemberActivities: (memberId: number) => ActivityResult[];
  calculateMemberScore: (memberId: number) => number;
  getActivityHistory: (memberId: number, limit?: number) => ActivityResult[];
}

const FamilyProgressContext = createContext<FamilyProgressContextType | undefined>(undefined);

export const useFamilyProgress = () => {
  const context = useContext(FamilyProgressContext);
  if (!context) {
    throw new Error('useFamilyProgress must be used within FamilyProgressProvider');
  }
  return context;
};

interface FamilyProgressProviderProps {
  children: ReactNode;
}

export const FamilyProgressProvider: React.FC<FamilyProgressProviderProps> = ({ children }) => {
  const [progressData, setProgressData] = useFamilyLocalStorage<Record<number, FamilyMemberProgress>>(
    'pandagarde_family_progress',
    {}
  );

  const recordActivityCompletion = useCallback((
    memberId: number,
    activityId: string,
    activityName: string,
    activityType: 'game' | 'journey' | 'module',
    score: number,
    maxScore: number,
    additionalData?: Record<string, unknown>
  ) => {
    setProgressData((prev: Record<number, FamilyMemberProgress>) => {
      const memberProgress = prev[memberId] || {
        memberId,
        activities: [],
        totalScore: 0,
        completedCount: 0,
        lastActive: new Date().toISOString()
      };

      // Check if activity already exists (avoid duplicates)
      const existingIndex = memberProgress.activities.findIndex(
        (a: ActivityResult) => a.activityId === activityId && a.activityType === activityType
      );

      const newActivity: ActivityResult = {
        activityId,
        activityName,
        activityType,
        score,
        maxScore,
        completedAt: new Date().toISOString(),
        ...(additionalData && { additionalData })
      };

      let updatedActivities: ActivityResult[];
      if (existingIndex >= 0 && existingIndex < memberProgress.activities.length) {
        // Update existing activity if new score is higher
        updatedActivities = [...memberProgress.activities];
        const existingActivity = updatedActivities[existingIndex];
        if (existingActivity && score > existingActivity.score) {
          updatedActivities[existingIndex] = newActivity;
        }
      } else {
        // Add new activity
        updatedActivities = [...memberProgress.activities, newActivity];
      }

      // Calculate new totals
      const totalScore = updatedActivities.reduce((sum: number, a: ActivityResult) => sum + a.score, 0);
      const totalMaxScore = updatedActivities.reduce((sum: number, a: ActivityResult) => sum + a.maxScore, 0);
      const averageScore = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0;

      return {
        ...prev,
        [memberId]: {
          ...memberProgress,
          activities: updatedActivities,
          totalScore: averageScore,
          completedCount: updatedActivities.length,
          lastActive: new Date().toISOString()
        }
      };
    });
  }, [setProgressData]);

  const getMemberProgress = useCallback((memberId: number): FamilyMemberProgress | null => {
    return progressData[memberId] ?? null;
  }, [progressData]);

  const getMemberActivities = useCallback((memberId: number): ActivityResult[] => {
    const progress = progressData[memberId];
    return progress?.activities || [];
  }, [progressData]);

  const calculateMemberScore = useCallback((memberId: number): number => {
    const progress = progressData[memberId];
    if (!progress || !progress.activities || progress.activities.length === 0) {return 0;}
    return progress.totalScore;
  }, [progressData]);

  const getActivityHistory = useCallback((memberId: number, limit?: number): ActivityResult[] => {
    try {
      const activities = getMemberActivities(memberId);
      if (!activities || !Array.isArray(activities)) {
        return [];
      }
      const sorted = activities
        .filter(a => a && a.completedAt) // Filter out invalid activities
        .sort((a, b) => {
          try {
            const dateA = new Date(a.completedAt).getTime();
            const dateB = new Date(b.completedAt).getTime();
            if (isNaN(dateA) || isNaN(dateB)) {
              return 0;
            }
            return dateB - dateA;
          } catch {
            return 0;
          }
        });
      return limit ? sorted.slice(0, limit) : sorted;
    } catch (error) {
      console.error('Error getting activity history:', error);
      return [];
    }
  }, [getMemberActivities]);

  const value: FamilyProgressContextType = {
    recordActivityCompletion,
    getMemberProgress,
    getMemberActivities,
    calculateMemberScore,
    getActivityHistory
  };

  return (
    <FamilyProgressContext.Provider value={value}>
      {children}
    </FamilyProgressContext.Provider>
  );
};

