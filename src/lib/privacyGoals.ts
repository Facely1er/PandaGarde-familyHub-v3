/**
 * Privacy Goal Setting System
 * Allows families to set and track privacy improvement goals
 */

export interface PrivacyGoal {
  id: string;
  title: string;
  description: string;
  category: 'data-sharing' | 'privacy-settings' | 'online-behavior' | 'device-security' | 'parental-controls' | 'overall';
  targetScore?: number; // For score-based goals
  targetDate: string; // ISO date string
  status: 'active' | 'completed' | 'overdue';
  progress: number; // 0-100
  createdAt: string;
  completedAt?: string;
  actionItems: string[];
  resources?: Array<{ label: string; url: string }>;
}

export interface GoalProgress {
  goalId: string;
  currentValue: number;
  targetValue: number;
  percentage: number;
  lastUpdated: string;
}

export class PrivacyGoalManager {
  private readonly STORAGE_KEY = 'pandagarde_privacy_goals';

  /**
   * Get all goals
   */
  getGoals(): PrivacyGoal[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) {return [];}
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error loading goals:', error);
      return [];
    }
  }

  /**
   * Create a new goal
   */
  createGoal(goal: Omit<PrivacyGoal, 'id' | 'createdAt' | 'status' | 'progress'>): PrivacyGoal {
    const newGoal: PrivacyGoal = {
      ...goal,
      id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      status: this.calculateStatus(goal.targetDate),
      progress: 0
    };

    const goals = this.getGoals();
    goals.push(newGoal);
    this.saveGoals(goals);

    return newGoal;
  }

  /**
   * Update a goal
   */
  updateGoal(goalId: string, updates: Partial<PrivacyGoal>): PrivacyGoal | null {
    const goals = this.getGoals();
    const index = goals.findIndex(g => g.id === goalId);
    
    if (index === -1) {return null;}

    const updatedGoal: PrivacyGoal = {
      ...goals[index],
      ...updates,
      id: goals[index].id, // Preserve ID
      createdAt: goals[index].createdAt // Preserve creation date
    };

    // Recalculate status if target date changed
    if (updates.targetDate) {
      updatedGoal.status = this.calculateStatus(updates.targetDate);
    }

    // Mark as completed if progress is 100
    if (updatedGoal.progress >= 100 && updatedGoal.status !== 'completed') {
      updatedGoal.status = 'completed';
      updatedGoal.completedAt = new Date().toISOString();
    }

    goals[index] = updatedGoal;
    this.saveGoals(goals);

    return updatedGoal;
  }

  /**
   * Delete a goal
   */
  deleteGoal(goalId: string): boolean {
    const goals = this.getGoals();
    const filtered = goals.filter(g => g.id !== goalId);
    
    if (filtered.length === goals.length) {return false;}

    this.saveGoals(filtered);
    return true;
  }

  /**
   * Update goal progress
   */
  updateProgress(goalId: string, progress: number, assessmentScore?: number): PrivacyGoal | null {
    const goal = this.getGoals().find(g => g.id === goalId);
    if (!goal) {return null;}

    // If it's a score-based goal and we have an assessment score
    if (goal.targetScore && assessmentScore !== undefined) {
      const calculatedProgress = Math.min(100, Math.round((assessmentScore / goal.targetScore) * 100));
      return this.updateGoal(goalId, { progress: calculatedProgress });
    }

    // Otherwise use the provided progress
    return this.updateGoal(goalId, { progress: Math.min(100, Math.max(0, progress)) });
  }

  /**
   * Get goals by status
   */
  getGoalsByStatus(status: PrivacyGoal['status']): PrivacyGoal[] {
    return this.getGoals().filter(g => g.status === status);
  }

  /**
   * Get goals by category
   */
  getGoalsByCategory(category: PrivacyGoal['category']): PrivacyGoal[] {
    return this.getGoals().filter(g => g.category === category);
  }

  /**
   * Get active goals
   */
  getActiveGoals(): PrivacyGoal[] {
    const goals = this.getGoals();
    // Update statuses before returning
    return goals.map(goal => {
      const newStatus = this.calculateStatus(goal.targetDate);
      if (newStatus !== goal.status && goal.status !== 'completed') {
        this.updateGoal(goal.id, { status: newStatus });
        return { ...goal, status: newStatus };
      }
      return goal;
    }).filter(g => g.status === 'active' || g.status === 'overdue');
  }

  /**
   * Calculate goal status based on target date
   */
  private calculateStatus(targetDate: string): 'active' | 'completed' | 'overdue' {
    const target = new Date(targetDate);
    const now = new Date();
    
    if (target < now) {
      return 'overdue';
    }
    return 'active';
  }

  /**
   * Save goals to localStorage
   */
  private saveGoals(goals: PrivacyGoal[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(goals));
    } catch (error) {
      console.error('Error saving goals:', error);
    }
  }

  /**
   * Generate suggested goals based on assessment results
   */
  generateSuggestedGoals(
    assessmentResult: {
      overallScore: number;
      categoryScores: Record<string, number>;
      weaknesses: string[];
    }
  ): Omit<PrivacyGoal, 'id' | 'createdAt' | 'status' | 'progress'>[] {
    const suggestions: Omit<PrivacyGoal, 'id' | 'createdAt' | 'status' | 'progress'>[] = [];

    // Overall score goal
    if (assessmentResult.overallScore < 75) {
      const targetScore = Math.min(100, assessmentResult.overallScore + 15);
      suggestions.push({
        title: `Improve Overall Privacy Score to ${targetScore}`,
        description: `Work towards improving your family's overall privacy practices from ${assessmentResult.overallScore} to ${targetScore}.`,
        category: 'overall',
        targetScore,
        targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days
        actionItems: [
          'Review all category recommendations',
          'Focus on highest priority improvements',
          'Take assessment again in 90 days to measure progress'
        ],
        resources: [
          { label: 'Privacy Assessment', url: '/privacy-assessment' },
          { label: 'Digital Footprint', url: '/digital-footprint' }
        ]
      });
    }

    // Category-specific goals
    Object.entries(assessmentResult.categoryScores).forEach(([category, score]) => {
      if (score < 70) {
        const targetScore = Math.min(100, score + 20);
        const categoryName = category.split('-').map(w => 
          w.charAt(0).toUpperCase() + w.slice(1)
        ).join(' ');

        suggestions.push({
          title: `Improve ${categoryName} Score`,
          description: `Focus on improving your ${categoryName.toLowerCase()} practices from ${score} to ${targetScore}.`,
          category: category as PrivacyGoal['category'],
          targetScore,
          targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days
          actionItems: [
            `Review ${categoryName} recommendations`,
            'Implement suggested improvements',
            'Monitor progress regularly'
          ],
          resources: [
            { label: 'Privacy Assessment', url: '/privacy-assessment' },
            { label: 'Service Catalog', url: '/service-catalog' }
          ]
        });
      }
    });

    return suggestions;
  }
}

export const privacyGoalManager = new PrivacyGoalManager();

