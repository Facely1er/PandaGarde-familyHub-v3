import { useState, useEffect, useCallback } from 'react';
import { useFamily } from '../contexts/FamilyContext';

export interface JourneyStepStatus {
  step: number;
  completed: boolean;
  completedAt?: Date;
  visited: boolean;
  visitedAt?: Date;
}

export interface JourneyProgress {
  step1: JourneyStepStatus; // Join Platform
  step2: JourneyStepStatus; // Service Catalog
  step3: JourneyStepStatus; // Privacy Panda
  step4: JourneyStepStatus; // Advanced Features
  overallProgress: number; // 0-100
  nextRecommendedStep: number;
}

const STORAGE_KEY = 'pandagarde_journey_progress';

const getDefaultProgress = (): JourneyProgress => ({
  step1: { step: 1, completed: false, visited: false },
  step2: { step: 2, completed: false, visited: false },
  step3: { step: 3, completed: false, visited: false },
  step4: { step: 4, completed: false, visited: false },
  overallProgress: 0,
  nextRecommendedStep: 1,
});

const loadProgress = (): JourneyProgress => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      Object.keys(parsed).forEach(key => {
        if (key.startsWith('step') && parsed[key]) {
          if (parsed[key].completedAt) {
            parsed[key].completedAt = new Date(parsed[key].completedAt);
          }
          if (parsed[key].visitedAt) {
            parsed[key].visitedAt = new Date(parsed[key].visitedAt);
          }
        }
      });
      return parsed;
    }
  } catch (error) {
    console.error('Error loading journey progress:', error);
  }
  return getDefaultProgress();
};

const saveProgress = (progress: JourneyProgress): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving journey progress:', error);
  }
};

export const useJourneyProgress = () => {
  const { currentFamily, familyMembers } = useFamily();
  const [progress, setProgress] = useState<JourneyProgress>(loadProgress);

  // Calculate overall progress
  const calculateProgress = useCallback((currentProgress: JourneyProgress): number => {
    const steps = [currentProgress.step1, currentProgress.step2, currentProgress.step3, currentProgress.step4];
    const completedCount = steps.filter(s => s.completed).length;
    return (completedCount / 4) * 100;
  }, []);

  // Determine next recommended step
  const getNextRecommendedStep = useCallback((currentProgress: JourneyProgress): number => {
    if (!currentProgress.step1.completed) {return 1;}
    if (!currentProgress.step2.completed) {return 2;}
    if (!currentProgress.step3.completed) {return 3;}
    if (!currentProgress.step4.completed) {return 4;}
    return 4; // All completed
  }, []);

  // Mark step as visited
  const markStepVisited = useCallback((step: number) => {
    setProgress(prev => {
      const updated = { ...prev };
      const stepKey = `step${step}` as keyof JourneyProgress;
      const stepStatus = updated[stepKey] as JourneyStepStatus;
      
      if (!stepStatus.visited) {
        stepStatus.visited = true;
        stepStatus.visitedAt = new Date();
        updated.overallProgress = calculateProgress(updated);
        updated.nextRecommendedStep = getNextRecommendedStep(updated);
        saveProgress(updated);
      }
      
      return updated;
    });
  }, [calculateProgress, getNextRecommendedStep]);

  // Mark step as completed
  const markStepCompleted = useCallback((step: number) => {
    setProgress(prev => {
      const updated = { ...prev };
      const stepKey = `step${step}` as keyof JourneyProgress;
      const stepStatus = updated[stepKey] as JourneyStepStatus;
      
      if (!stepStatus.completed) {
        stepStatus.completed = true;
        stepStatus.completedAt = new Date();
        stepStatus.visited = true;
        stepStatus.visitedAt = new Date();
        updated.overallProgress = calculateProgress(updated);
        updated.nextRecommendedStep = getNextRecommendedStep(updated);
        saveProgress(updated);
      }
      
      return updated;
    });
  }, [calculateProgress, getNextRecommendedStep]);

  // Check step completion based on actual state
  useEffect(() => {
    setProgress(prev => {
      const updated = { ...prev };
      let changed = false;

      // Step 1: Join Platform - completed if family exists
      if (currentFamily && !updated.step1.completed) {
        updated.step1.completed = true;
        updated.step1.completedAt = new Date();
        updated.step1.visited = true;
        updated.step1.visitedAt = new Date();
        changed = true;
      }

      // Step 2: Service Catalog - completed if services added
      const totalServices = familyMembers.reduce((count, member) => {
        const memberServices = (member as any).services || [];
        return count + memberServices.length;
      }, 0);
      
      if (totalServices >= 3 && !updated.step2.completed) {
        updated.step2.completed = true;
        updated.step2.completedAt = new Date();
        updated.step2.visited = true;
        updated.step2.visitedAt = new Date();
        changed = true;
      }

      // Step 3: Privacy Panda - mark as visited if user has accessed it
      // This would be tracked when user visits /privacy-panda
      // For now, we'll check localStorage for privacy panda activity
      const privacyPandaVisited = localStorage.getItem('pandagarde_privacy_panda_visited');
      if (privacyPandaVisited && !updated.step3.visited) {
        updated.step3.visited = true;
        updated.step3.visitedAt = new Date(privacyPandaVisited);
        changed = true;
      }

      // Step 4: Advanced Features - completed if user has accessed digital footprint
      const footprintVisited = localStorage.getItem('pandagarde_digital_footprint_visited');
      if (footprintVisited && totalServices >= 3 && !updated.step4.completed) {
        updated.step4.completed = true;
        updated.step4.completedAt = new Date(footprintVisited);
        updated.step4.visited = true;
        updated.step4.visitedAt = new Date(footprintVisited);
        changed = true;
      }

      if (changed) {
        updated.overallProgress = calculateProgress(updated);
        updated.nextRecommendedStep = getNextRecommendedStep(updated);
        saveProgress(updated);
      }

      return updated;
    });
  }, [currentFamily, familyMembers, calculateProgress, getNextRecommendedStep]);

  // Reset progress
  const resetProgress = useCallback(() => {
    const defaultProgress = getDefaultProgress();
    setProgress(defaultProgress);
    saveProgress(defaultProgress);
  }, []);

  return {
    progress,
    markStepVisited,
    markStepCompleted,
    resetProgress,
    isStepCompleted: (step: number) => {
      const stepKey = `step${step}` as keyof JourneyProgress;
      return (progress[stepKey] as JourneyStepStatus).completed;
    },
    isStepVisited: (step: number) => {
      const stepKey = `step${step}` as keyof JourneyProgress;
      return (progress[stepKey] as JourneyStepStatus).visited;
    },
  };
};

