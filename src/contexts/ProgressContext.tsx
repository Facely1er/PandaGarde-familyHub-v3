import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

const STORAGE_KEY = 'pandagarde_progress';

export const ProgressProvider: React.FC<ProgressProviderProps> = ({ children }) => {
  // Frontend-only mode - no authentication
  const isAuthenticated = false;
  const user = null;
  const [progress, setProgress] = useState<UserProgress>({
    completedActivities: [],
    activityDetails: {},
    totalTimeSpent: 0,
    achievements: [],
    lastUpdated: new Date()
  });
  const [, setLoading] = useState(false);

  // Load progress from localStorage - Frontend-only mode
  useEffect(() => {
    const loadProgress = async () => {
      console.log('Frontend-only mode: Loading progress from localStorage only');
      // In frontend-only mode, always load from localStorage
      loadFromLocalStorage();
    };

    const loadFromLocalStorage = () => {
      const savedProgress = localStorage.getItem(STORAGE_KEY);
      if (savedProgress) {
        try {
          const parsed = JSON.parse(savedProgress);
          const processedProgress = {
            ...parsed,
            activityDetails: Object.fromEntries(
              Object.entries(parsed.activityDetails || {}).map(([key, value]: [string, ActivityProgress]) => [
                key,
                {
                  ...value,
                  completedAt: new Date(value.completedAt)
                }
              ])
            ),
            lastUpdated: new Date(parsed.lastUpdated)
          };
          setProgress(processedProgress);
        } catch (error) {
          console.error('Error loading progress from localStorage:', error);
        }
      }
    };

    loadProgress();
  }, [isAuthenticated, user]);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  // Autosave to database - Frontend-only mode (disabled)
  useEffect(() => {
    console.log('Frontend-only mode: Database autosave disabled');
    // In frontend-only mode, no database autosave is needed
  }, [progress]);

  // Periodic autosave - Frontend-only mode (disabled)
  useEffect(() => {
    console.log('Frontend-only mode: Periodic database autosave disabled');
    // In frontend-only mode, no periodic database autosave is needed
  }, [progress]);

  // Save on page unload - Frontend-only mode (localStorage only)
  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log('Frontend-only mode: Progress already saved to localStorage');
      // In frontend-only mode, progress is automatically saved to localStorage
      // No additional action needed on page unload
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [progress]);

  const markActivityCompleted = useCallback(async (activityId: string, score?: number, timeSpent?: number) => {
    console.log('Frontend-only mode: markActivityCompleted() - saving to localStorage only', { activityId, score, timeSpent });
    
    // In frontend-only mode, just update local state (which automatically saves to localStorage)
    setProgress(prev => {
      const isAlreadyCompleted = prev.completedActivities.includes(activityId);
      
      if (isAlreadyCompleted) {
        return prev; // Don't update if already completed
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

      // Check for achievements
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

      newProgress.achievements = [...new Set(achievements)]; // Remove duplicates

      return newProgress;
    });
  }, []);

  const getActivityProgress = useCallback((activityId: string) => {
    return progress.activityDetails[activityId];
  }, [progress.activityDetails]);

  const getOverallProgress = useCallback(() => {
    // Updated to include 8 activities total
    const totalCount = 8;
    const completedCount = progress.completedActivities.length;
    const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
    
    // Calculate average score
    const scores = Object.values(progress.activityDetails)
      .filter(activity => activity.score !== undefined)
      .map(activity => activity.score!);
    
    const averageScore = scores.length > 0 
      ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
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
      const parsed = JSON.parse(data);
      const processedProgress = {
        ...parsed,
        activityDetails: Object.fromEntries(
          Object.entries(parsed.activityDetails || {}).map(([key, value]: [string, ActivityProgress]) => [
            key,
            {
              ...value,
              completedAt: new Date(value.completedAt)
            }
          ])
        ),
        lastUpdated: new Date(parsed.lastUpdated)
      };
      setProgress(processedProgress);
      return true;
    } catch (error) {
      console.error('Error importing progress:', error);
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