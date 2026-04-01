import { localStorageManager, UserProgress } from './localStorageManager';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  requirement: AchievementRequirement;
  unlockedAt?: string;
  category: 'privacy' | 'security' | 'learning' | 'streak' | 'social' | 'exploration';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface AchievementRequirement {
  type: 'xp_threshold' | 'missions_completed' | 'streak_days' | 'tools_used' | 'privacy_score' | 'custom';
  value: number;
  description: string;
  toolId?: string; // For tool-specific achievements
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  ageGroup: '5-8' | '9-12' | '13-17';
  xpReward: number;
  duration: number; // minutes
  prerequisites: string[];
  toolId: string; // links to tool component
  category: 'daily' | 'weekly' | 'special' | 'learning';
  difficulty: 'easy' | 'medium' | 'hard';
  completedAt?: string;
  isActive: boolean;
}

export interface LevelInfo {
  level: number;
  xpRequired: number;
  xpToNext: number;
  title: string;
  description: string;
  rewards: string[];
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  streakBonus: number; // XP multiplier
}

export interface GamificationStats {
  totalXP: number;
  currentLevel: number;
  achievementsUnlocked: number;
  missionsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  toolsUsed: string[];
  privacyScore: number;
  lastActive: string;
}

// Achievement definitions
export const ACHIEVEMENTS: Achievement[] = [
  // XP-based achievements
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Earn your first 100 XP',
    icon: '👶',
    xpReward: 50,
    category: 'learning',
    rarity: 'common',
    requirement: {
      type: 'xp_threshold',
      value: 100,
      description: 'Reach 100 total XP'
    }
  },
  {
    id: 'privacy_novice',
    name: 'Privacy Novice',
    description: 'Earn 500 XP',
    icon: '🎓',
    xpReward: 100,
    category: 'learning',
    rarity: 'uncommon',
    requirement: {
      type: 'xp_threshold',
      value: 500,
      description: 'Reach 500 total XP'
    }
  },
  {
    id: 'privacy_expert',
    name: 'Privacy Expert',
    description: 'Earn 1000 XP',
    icon: '🏆',
    xpReward: 200,
    category: 'learning',
    rarity: 'rare',
    requirement: {
      type: 'xp_threshold',
      value: 1000,
      description: 'Reach 1000 total XP'
    }
  },
  {
    id: 'privacy_master',
    name: 'Privacy Master',
    description: 'Earn 2500 XP',
    icon: '👑',
    xpReward: 500,
    category: 'learning',
    rarity: 'epic',
    requirement: {
      type: 'xp_threshold',
      value: 2500,
      description: 'Reach 2500 total XP'
    }
  },
  {
    id: 'privacy_legend',
    name: 'Privacy Legend',
    description: 'Earn 5000 XP',
    icon: '🌟',
    xpReward: 1000,
    category: 'learning',
    rarity: 'legendary',
    requirement: {
      type: 'xp_threshold',
      value: 5000,
      description: 'Reach 5000 total XP'
    }
  },

  // Mission-based achievements
  {
    id: 'mission_starter',
    name: 'Mission Starter',
    description: 'Complete your first mission',
    icon: '🚀',
    xpReward: 75,
    category: 'learning',
    rarity: 'common',
    requirement: {
      type: 'missions_completed',
      value: 1,
      description: 'Complete 1 mission'
    }
  },
  {
    id: 'mission_marathon',
    name: 'Mission Marathon',
    description: 'Complete 10 missions',
    icon: '🏃‍♂️',
    xpReward: 150,
    category: 'learning',
    rarity: 'uncommon',
    requirement: {
      type: 'missions_completed',
      value: 10,
      description: 'Complete 10 missions'
    }
  },
  {
    id: 'mission_master',
    name: 'Mission Master',
    description: 'Complete 25 missions',
    icon: '🎯',
    xpReward: 300,
    category: 'learning',
    rarity: 'rare',
    requirement: {
      type: 'missions_completed',
      value: 25,
      description: 'Complete 25 missions'
    }
  },

  // Streak achievements
  {
    id: 'daily_learner',
    name: 'Daily Learner',
    description: 'Maintain a 3-day learning streak',
    icon: '📅',
    xpReward: 100,
    category: 'streak',
    rarity: 'uncommon',
    requirement: {
      type: 'streak_days',
      value: 3,
      description: 'Maintain a 3-day streak'
    }
  },
  {
    id: 'week_warrior',
    name: 'Week Warrior',
    description: 'Maintain a 7-day learning streak',
    icon: '⚔️',
    xpReward: 200,
    category: 'streak',
    rarity: 'rare',
    requirement: {
      type: 'streak_days',
      value: 7,
      description: 'Maintain a 7-day streak'
    }
  },
  {
    id: 'streak_champion',
    name: 'Streak Champion',
    description: 'Maintain a 30-day learning streak',
    icon: '🏅',
    xpReward: 500,
    category: 'streak',
    rarity: 'epic',
    requirement: {
      type: 'streak_days',
      value: 30,
      description: 'Maintain a 30-day streak'
    }
  },

  // Tool-specific achievements
  {
    id: 'app_analyzer',
    name: 'App Analyzer',
    description: 'Use the App Permissions Analyzer',
    icon: '📱',
    xpReward: 50,
    category: 'privacy',
    rarity: 'common',
    requirement: {
      type: 'tools_used',
      value: 1,
      description: 'Use the App Permissions Analyzer tool',
      toolId: 'app-permissions-analyzer'
    }
  },
  {
    id: 'footprint_tracker',
    name: 'Footprint Tracker',
    description: 'Use the Digital Footprint Timeline',
    icon: '👣',
    xpReward: 50,
    category: 'privacy',
    rarity: 'common',
    requirement: {
      type: 'tools_used',
      value: 1,
      description: 'Use the Digital Footprint Timeline tool',
      toolId: 'digital-footprint-timeline'
    }
  },
  {
    id: 'privacy_explorer',
    name: 'Privacy Explorer',
    description: 'Use 5 different privacy tools',
    icon: '🔍',
    xpReward: 200,
    category: 'exploration',
    rarity: 'rare',
    requirement: {
      type: 'tools_used',
      value: 5,
      description: 'Use 5 different privacy tools'
    }
  },

  // Privacy score achievements
  {
    id: 'privacy_conscious',
    name: 'Privacy Conscious',
    description: 'Achieve a privacy score of 80+',
    icon: '🛡️',
    xpReward: 150,
    category: 'privacy',
    rarity: 'uncommon',
    requirement: {
      type: 'privacy_score',
      value: 80,
      description: 'Achieve a privacy score of 80 or higher'
    }
  },
  {
    id: 'privacy_champion',
    name: 'Privacy Champion',
    description: 'Achieve a privacy score of 95+',
    icon: '🥇',
    xpReward: 300,
    category: 'privacy',
    rarity: 'epic',
    requirement: {
      type: 'privacy_score',
      value: 95,
      description: 'Achieve a privacy score of 95 or higher'
    }
  }
];

// Mission definitions
export const MISSIONS: Mission[] = [
  // Daily missions
  {
    id: 'daily_app_check',
    title: 'Daily App Check',
    description: 'Review permissions for one app on your device',
    ageGroup: '13-17',
    xpReward: 25,
    duration: 5,
    prerequisites: [],
    toolId: 'app-permissions-analyzer',
    category: 'daily',
    difficulty: 'easy',
    isActive: true
  },
  {
    id: 'daily_footprint_review',
    title: 'Daily Footprint Review',
    description: 'Check your digital footprint for the day',
    ageGroup: '13-17',
    xpReward: 30,
    duration: 10,
    prerequisites: [],
    toolId: 'digital-footprint-timeline',
    category: 'daily',
    difficulty: 'easy',
    isActive: true
  },
  {
    id: 'privacy_setting_update',
    title: 'Privacy Setting Update',
    description: 'Update privacy settings on one social media platform',
    ageGroup: '13-17',
    xpReward: 40,
    duration: 15,
    prerequisites: [],
    toolId: 'app-permissions-analyzer',
    category: 'daily',
    difficulty: 'medium',
    isActive: true
  },

  // Weekly missions
  {
    id: 'weekly_permission_audit',
    title: 'Weekly Permission Audit',
    description: 'Review and clean up permissions for all your apps',
    ageGroup: '13-17',
    xpReward: 100,
    duration: 30,
    prerequisites: ['daily_app_check'],
    toolId: 'app-permissions-analyzer',
    category: 'weekly',
    difficulty: 'medium',
    isActive: true
  },
  {
    id: 'weekly_footprint_cleanup',
    title: 'Weekly Footprint Cleanup',
    description: 'Clean up your digital footprint and delete old posts',
    ageGroup: '13-17',
    xpReward: 120,
    duration: 45,
    prerequisites: ['daily_footprint_review'],
    toolId: 'digital-footprint-timeline',
    category: 'weekly',
    difficulty: 'medium',
    isActive: true
  },

  // Special missions
  {
    id: 'privacy_research_project',
    title: 'Privacy Research Project',
    description: 'Research privacy policies of 3 popular apps',
    ageGroup: '13-17',
    xpReward: 200,
    duration: 60,
    prerequisites: ['privacy_explorer'],
    toolId: 'app-permissions-analyzer',
    category: 'special',
    difficulty: 'hard',
    isActive: true
  },
  {
    id: 'digital_detox_challenge',
    title: 'Digital Detox Challenge',
    description: 'Complete a 24-hour digital detox and track the experience',
    ageGroup: '13-17',
    xpReward: 300,
    duration: 1440, // 24 hours
    prerequisites: ['week_warrior'],
    toolId: 'digital-footprint-timeline',
    category: 'special',
    difficulty: 'hard',
    isActive: true
  }
];

// Level definitions
export const LEVELS: LevelInfo[] = [
  { level: 1, xpRequired: 0, xpToNext: 100, title: 'Privacy Beginner', description: 'Just starting your privacy journey', rewards: ['Basic privacy tips'] },
  { level: 2, xpRequired: 100, xpToNext: 150, title: 'Privacy Learner', description: 'Learning the basics of digital privacy', rewards: ['App permission guide'] },
  { level: 3, xpRequired: 250, xpToNext: 200, title: 'Privacy Explorer', description: 'Exploring different privacy tools', rewards: ['Digital footprint tracker'] },
  { level: 4, xpRequired: 450, xpToNext: 250, title: 'Privacy Student', description: 'Studying privacy best practices', rewards: ['Advanced privacy settings'] },
  { level: 5, xpRequired: 700, xpToNext: 300, title: 'Privacy Apprentice', description: 'Applying privacy knowledge', rewards: ['Privacy audit tools'] },
  { level: 6, xpRequired: 1000, xpToNext: 350, title: 'Privacy Practitioner', description: 'Practicing privacy protection', rewards: ['Custom privacy plan'] },
  { level: 7, xpRequired: 1350, xpToNext: 400, title: 'Privacy Guardian', description: 'Protecting your digital life', rewards: ['Privacy monitoring'] },
  { level: 8, xpRequired: 1750, xpToNext: 450, title: 'Privacy Expert', description: 'Expert in digital privacy', rewards: ['Advanced security tools'] },
  { level: 9, xpRequired: 2200, xpToNext: 500, title: 'Privacy Master', description: 'Master of privacy protection', rewards: ['Privacy consulting'] },
  { level: 10, xpRequired: 2700, xpToNext: 0, title: 'Privacy Legend', description: 'Legendary privacy protector', rewards: ['Privacy mentor badge'] }
];

export class GamificationSystem {
  private static instance: GamificationSystem;
  private achievements: Map<string, Achievement> = new Map();
  private missions: Map<string, Mission> = new Map();

  constructor() {
    // Initialize achievements and missions
    ACHIEVEMENTS.forEach(achievement => {
      this.achievements.set(achievement.id, achievement);
    });
    MISSIONS.forEach(mission => {
      this.missions.set(mission.id, mission);
    });
  }

  static getInstance(): GamificationSystem {
    if (!GamificationSystem.instance) {
      GamificationSystem.instance = new GamificationSystem();
    }
    return GamificationSystem.instance;
  }

  /**
   * Calculate XP required for a specific level
   */
  calculateXPForLevel(level: number): number {
    if (level <= 1) {return 0;}
    if (level > LEVELS.length) {return LEVELS[LEVELS.length - 1].xpRequired;}
    return LEVELS[level - 1].xpRequired;
  }

  /**
   * Calculate level from total XP
   */
  calculateLevelFromXP(totalXP: number): number {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (totalXP >= LEVELS[i].xpRequired) {
        return LEVELS[i].level;
      }
    }
    return 1;
  }

  /**
   * Get level information
   */
  getLevelInfo(level: number): LevelInfo | null {
    return LEVELS.find(l => l.level === level) || null;
  }

  /**
   * Get current level info for user
   */
  getCurrentLevelInfo(userProgress: UserProgress): LevelInfo {
    const currentLevel = userProgress.currentLevel;
    const levelInfo = this.getLevelInfo(currentLevel);
    if (!levelInfo) {
      return LEVELS[0]!; // Fallback to level 1
    }

    // Calculate XP to next level
    const nextLevel = this.getLevelInfo(currentLevel + 1);
    const xpToNext = nextLevel ? nextLevel.xpRequired - userProgress.totalXP : 0;

    return {
      ...levelInfo,
      xpToNext: Math.max(0, xpToNext)
    };
  }

  /**
   * Add XP to user and check for level up
   */
  addXP(userId: string, xp: number, _reason?: string): { newLevel: number; leveledUp: boolean; newAchievements: Achievement[] } {
    const result = localStorageManager.addXP(userId, xp);
    const userProgress = localStorageManager.getUserProgress(userId);
    
    if (!userProgress) {
      throw new Error('User progress not found');
    }

    // Check for new achievements
    const newAchievements = this.checkAchievements(userId, userProgress);

    return {
      newLevel: result.newLevel,
      leveledUp: result.leveledUp,
      newAchievements
    };
  }

  /**
   * Complete a mission
   */
  completeMission(userId: string, missionId: string): { xpGained: number; newAchievements: Achievement[] } {
    const mission = this.missions.get(missionId);
    if (!mission) {
      throw new Error('Mission not found');
    }

    const userProgress = localStorageManager.getUserProgress(userId);
    if (!userProgress) {
      throw new Error('User progress not found');
    }

    // Check prerequisites
    const prerequisitesMet = mission.prerequisites.every(prereq => 
      userProgress.completedMissions.includes(prereq)
    );

    if (!prerequisitesMet) {
      throw new Error('Mission prerequisites not met');
    }

    // Complete mission
    localStorageManager.completeMission(userId, missionId);
    
    // Add XP
    const result = this.addXP(userId, mission.xpReward, `Completed mission: ${mission.title}`);

    return {
      xpGained: mission.xpReward,
      newAchievements: result.newAchievements
    };
  }

  /**
   * Check for new achievements
   */
  checkAchievements(userId: string, userProgress: UserProgress): Achievement[] {
    const newAchievements: Achievement[] = [];
    const unlockedAchievements = userProgress.unlockedAchievements;

    for (const achievement of this.achievements.values()) {
      if (unlockedAchievements.includes(achievement.id)) {
        continue; // Already unlocked
      }

      if (this.isAchievementUnlocked(achievement, userProgress)) {
        localStorageManager.unlockAchievement(userId, achievement.id);
        newAchievements.push({
          ...achievement,
          unlockedAt: new Date().toISOString()
        });
      }
    }

    return newAchievements;
  }

  /**
   * Check if an achievement is unlocked
   */
  private isAchievementUnlocked(achievement: Achievement, userProgress: UserProgress): boolean {
    const { requirement } = achievement;

    switch (requirement.type) {
      case 'xp_threshold':
        return userProgress.totalXP >= requirement.value;
      
      case 'missions_completed':
        return userProgress.completedMissions.length >= requirement.value;
      
      case 'streak_days':
        return userProgress.currentStreak >= requirement.value;
      
      case 'tools_used':
        // This would need to be tracked separately in user progress
        // For now, we'll use a simple check
        return false; // TODO: Implement tool usage tracking
      
      case 'privacy_score':
        // This would need to be calculated from user's privacy activities
        return false; // TODO: Implement privacy score calculation
      
      default:
        return false;
    }
  }

  /**
   * Update user streak
   */
  updateStreak(userId: string): { streakUpdated: boolean; streakBonus: number } {
    const userProgress = localStorageManager.getUserProgress(userId);
    if (!userProgress) {
      throw new Error('User progress not found');
    }

    const today = new Date().toISOString().split('T')[0];
    const lastActive = new Date(userProgress.lastActive).toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let newStreak = userProgress.currentStreak;
    let streakUpdated = false;

    if (lastActive === today) {
      // Already active today, no change
      streakUpdated = false;
    } else if (lastActive === yesterday) {
      // Consecutive day, increment streak
      newStreak += 1;
      streakUpdated = true;
    } else {
      // Streak broken, reset to 1
      newStreak = 1;
      streakUpdated = true;
    }

    localStorageManager.updateStreak(userId, newStreak);
    localStorageManager.updateLastActive(userId);

    // Calculate streak bonus (1.1x for 3+ days, 1.2x for 7+ days, 1.5x for 30+ days)
    let streakBonus = 1;
    if (newStreak >= 30) {streakBonus = 1.5;}
    else if (newStreak >= 7) {streakBonus = 1.2;}
    else if (newStreak >= 3) {streakBonus = 1.1;}

    return { streakUpdated, streakBonus };
  }

  /**
   * Get available missions for user
   */
  getAvailableMissions(userId: string, ageGroup: string): Mission[] {
    const userProgress = localStorageManager.getUserProgress(userId);
    if (!userProgress) {
      return [];
    }

    return Array.from(this.missions.values()).filter(mission => {
      // Filter by age group
      if (mission.ageGroup !== ageGroup) {return false;}
      
      // Filter by active status
      if (!mission.isActive) {return false;}
      
      // Check if already completed
      if (userProgress.completedMissions.includes(mission.id)) {return false;}
      
      // Check prerequisites
      const prerequisitesMet = mission.prerequisites.every(prereq => 
        userProgress.completedMissions.includes(prereq)
      );
      
      return prerequisitesMet;
    });
  }

  /**
   * Get user's gamification stats
   */
  getGamificationStats(userId: string): GamificationStats {
    const userProgress = localStorageManager.getUserProgress(userId);
    if (!userProgress) {
      throw new Error('User progress not found');
    }

    return {
      totalXP: userProgress.totalXP,
      currentLevel: userProgress.currentLevel,
      achievementsUnlocked: userProgress.unlockedAchievements.length,
      missionsCompleted: userProgress.completedMissions.length,
      currentStreak: userProgress.currentStreak,
      longestStreak: userProgress.currentStreak, // TODO: Track longest streak separately
      toolsUsed: [], // TODO: Implement tool usage tracking
      privacyScore: 0, // TODO: Calculate privacy score
      lastActive: userProgress.lastActive
    };
  }

  /**
   * Get achievements by category
   */
  getAchievementsByCategory(category: string): Achievement[] {
    return Array.from(this.achievements.values()).filter(
      achievement => achievement.category === category
    );
  }

  /**
   * Get missions by category
   */
  getMissionsByCategory(category: string): Mission[] {
    return Array.from(this.missions.values()).filter(
      mission => mission.category === category
    );
  }

  /**
   * Get rarity color for achievements
   */
  getRarityColor(rarity: string): string {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100';
      case 'uncommon': return 'text-green-600 bg-green-100';
      case 'rare': return 'text-blue-600 bg-blue-100';
      case 'epic': return 'text-purple-600 bg-purple-100';
      case 'legendary': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }

  /**
   * Get difficulty color for missions
   */
  getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }
}

// Export singleton instance
export const gamificationSystem = GamificationSystem.getInstance();