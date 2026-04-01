import { encryptData, decryptData, generateUserPassword, isEncryptionAvailable } from '../lib/encryption';

export interface UserProgress {
  id: string;
  name: string;
  ageGroup: '5-8' | '9-12' | '13-17';
  totalXP: number;
  currentLevel: number;
  completedMissions: string[];
  unlockedAchievements: string[];
  currentStreak: number;
  lastActive: string;
  createdAt: string;
}

export class LocalStorageManager {
  private static readonly STORAGE_KEY = 'pandagarde_user_progress';
  private static readonly FAMILY_KEY = 'pandagarde_family_data';
  private static readonly ENCRYPTED_FLAG = '__encrypted__';
  
  // Fields that contain PII and should be encrypted
  private static readonly PII_FIELDS = ['email', 'first_name', 'last_name', 'name', 'phone', 'address'];

  /**
   * Save user progress to localStorage
   */
  saveUserProgress(userId: string, progress: UserProgress): void {
    try {
      const allProgress = this.getAllUsers();
      allProgress[userId] = progress;
      localStorage.setItem(LocalStorageManager.STORAGE_KEY, JSON.stringify(allProgress));
    } catch (error) {
      console.error('Error saving user progress:', error);
      throw new Error('Failed to save user progress');
    }
  }

  /**
   * Get user progress from localStorage
   */
  getUserProgress(userId: string): UserProgress | null {
    try {
      const allProgress = this.getAllUsers();
      return allProgress[userId] || null;
    } catch (error) {
      console.error('Error getting user progress:', error);
      return null;
    }
  }

  /**
   * Get all users' progress data
   */
  getAllUsers(): Record<string, UserProgress> {
    try {
      const data = localStorage.getItem(LocalStorageManager.STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error getting all users:', error);
      return {};
    }
  }

  /**
   * Delete a specific user's progress
   */
  deleteUser(userId: string): void {
    try {
      const allProgress = this.getAllUsers();
      delete allProgress[userId];
      localStorage.setItem(LocalStorageManager.STORAGE_KEY, JSON.stringify(allProgress));
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user');
    }
  }

  /**
   * Export all data as JSON string
   */
  async exportData(): Promise<string> {
    try {
      const allProgress = this.getAllUsers();
      const familyData = await this.getFamilyData();
      const exportData = {
        userProgress: allProgress,
        familyData: familyData,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      throw new Error('Failed to export data');
    }
  }

  /**
   * Import data from JSON string
   */
  importData(jsonData: string): boolean {
    try {
      const importData = JSON.parse(jsonData);
      
      // Validate the data structure
      if (!importData.userProgress || typeof importData.userProgress !== 'object') {
        throw new Error('Invalid data format: missing userProgress');
      }

      // Import user progress data
      localStorage.setItem(LocalStorageManager.STORAGE_KEY, JSON.stringify(importData.userProgress));

      // Import family data if present
      if (importData.familyData) {
        localStorage.setItem(LocalStorageManager.FAMILY_KEY, JSON.stringify(importData.familyData));
      }

      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  /**
   * Get storage usage in bytes
   */
  getStorageUsage(): number {
    try {
      let totalSize = 0;
      
      // Calculate size of user progress data
      const progressData = localStorage.getItem(LocalStorageManager.STORAGE_KEY);
      if (progressData) {
        totalSize += new Blob([progressData]).size;
      }

      // Calculate size of family data
      const familyData = localStorage.getItem(LocalStorageManager.FAMILY_KEY);
      if (familyData) {
        totalSize += new Blob([familyData]).size;
      }

      return totalSize;
    } catch (error) {
      console.error('Error calculating storage usage:', error);
      return 0;
    }
  }

  /**
   * Clear all data from localStorage
   */
  clearAllData(): void {
    try {
      localStorage.removeItem(LocalStorageManager.STORAGE_KEY);
      localStorage.removeItem(LocalStorageManager.FAMILY_KEY);
    } catch (error) {
      console.error('Error clearing data:', error);
      throw new Error('Failed to clear data');
    }
  }

  /**
   * Get family data from localStorage (with decryption if encrypted)
   */
  async getFamilyData(): Promise<any> {
    try {
      const data = localStorage.getItem(LocalStorageManager.FAMILY_KEY);
      if (!data) {return null;}
      
      // Check if data is encrypted
      if (data.startsWith(LocalStorageManager.ENCRYPTED_FLAG)) {
        if (!isEncryptionAvailable()) {
          console.warn('Encryption not available, cannot decrypt family data');
          return null;
        }
        
        const encryptedData = data.substring(LocalStorageManager.ENCRYPTED_FLAG.length);
        // Use a default user ID for decryption (in production, use actual user ID)
        const userId = this.getCurrentUserId();
        const password = generateUserPassword(userId);
        
        try {
          return await decryptData<any>(encryptedData, password);
        } catch (decryptError) {
          console.error('Error decrypting family data:', decryptError);
          // Try to parse as plain JSON as fallback (for migration)
          try {
            return JSON.parse(encryptedData);
          } catch {
            return null;
          }
        }
      }
      
      return JSON.parse(data);
    } catch (error) {
      console.error('Error getting family data:', error);
      return null;
    }
  }

  /**
   * Save family data to localStorage (with encryption for PII)
   */
  async saveFamilyData(familyData: any): Promise<void> {
    try {
      if (!isEncryptionAvailable()) {
        // Fallback to unencrypted storage if encryption not available
        console.warn('Encryption not available, saving family data unencrypted');
        localStorage.setItem(LocalStorageManager.FAMILY_KEY, JSON.stringify(familyData));
        return;
      }
      
      // Encrypt PII fields in family data
      const encryptedFamilyData = await this.encryptPIIFields(familyData);
      
      // Use a default user ID for encryption (in production, use actual user ID)
      const userId = this.getCurrentUserId();
      const password = generateUserPassword(userId);
      
      // Encrypt the entire family data object
      const encryptedData = await encryptData(encryptedFamilyData, password);
      
      // Store with encryption flag
      localStorage.setItem(
        LocalStorageManager.FAMILY_KEY, 
        LocalStorageManager.ENCRYPTED_FLAG + encryptedData
      );
    } catch (error) {
      console.error('Error saving family data:', error);
      throw new Error('Failed to save family data');
    }
  }

  /**
   * Encrypt PII fields in an object recursively
   */
  private async encryptPIIFields(obj: any): Promise<any> {
    if (obj === null || obj === undefined) {return obj;}
    
    if (Array.isArray(obj)) {
      return Promise.all(obj.map(item => this.encryptPIIFields(item)));
    }
    
    if (typeof obj === 'object') {
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        if (LocalStorageManager.PII_FIELDS.includes(key) && typeof value === 'string' && value) {
          // Encrypt PII field
          const userId = this.getCurrentUserId();
          const password = generateUserPassword(userId);
          try {
            result[key] = await encryptData(value, password);
            result[`${key}_encrypted`] = true;
          } catch (error) {
            console.error(`Error encrypting field ${key}:`, error);
            result[key] = value; // Fallback to unencrypted
          }
        } else if (typeof value === 'object') {
          result[key] = await this.encryptPIIFields(value);
        } else {
          result[key] = value;
        }
      }
      return result;
    }
    
    return obj;
  }

  /**
   * Decrypt PII fields in an object recursively
   */
  private async decryptPIIFields(obj: any): Promise<any> {
    if (obj === null || obj === undefined) {return obj;}
    
    if (Array.isArray(obj)) {
      return Promise.all(obj.map(item => this.decryptPIIFields(item)));
    }
    
    if (typeof obj === 'object') {
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        if (key.endsWith('_encrypted') && obj[key.replace('_encrypted', '')]) {
          // Skip the encrypted flag
          continue;
        }
        
        const encryptedFlag = obj[`${key}_encrypted`];
        if (encryptedFlag && typeof value === 'string' && value) {
          // Decrypt PII field
          const userId = this.getCurrentUserId();
          const password = generateUserPassword(userId);
          try {
            result[key] = await decryptData<string>(value, password);
          } catch (error) {
            console.error(`Error decrypting field ${key}:`, error);
            result[key] = value; // Fallback to encrypted value
          }
        } else if (typeof value === 'object') {
          result[key] = await this.decryptPIIFields(value);
        } else {
          result[key] = value;
        }
      }
      return result;
    }
    
    return obj;
  }

  /**
   * Get current user ID (for encryption key generation)
   */
  private getCurrentUserId(): string {
    // Try to get from localStorage or generate a device-specific ID
    let userId = localStorage.getItem('pandagarde_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('pandagarde_user_id', userId);
    }
    return userId;
  }

  /**
   * Check if localStorage is available
   */
  isStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get storage quota information (approximate)
   */
  getStorageInfo(): { used: number; available: number; percentage: number } {
    try {
      const used = this.getStorageUsage();
      // Most browsers have ~5-10MB localStorage limit
      const estimatedLimit = 5 * 1024 * 1024; // 5MB
      const available = Math.max(0, estimatedLimit - used);
      const percentage = (used / estimatedLimit) * 100;

      return {
        used,
        available,
        percentage: Math.min(percentage, 100)
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return { used: 0, available: 0, percentage: 0 };
    }
  }

  /**
   * Create a new user progress entry
   */
  createUserProgress(userId: string, name: string, ageGroup: '5-8' | '9-12' | '13-17'): UserProgress {
    const now = new Date().toISOString();
    const progress: UserProgress = {
      id: userId,
      name,
      ageGroup,
      totalXP: 0,
      currentLevel: 1,
      completedMissions: [],
      unlockedAchievements: [],
      currentStreak: 0,
      lastActive: now,
      createdAt: now
    };

    this.saveUserProgress(userId, progress);
    return progress;
  }

  /**
   * Update user's last active timestamp
   */
  updateLastActive(userId: string): void {
    const progress = this.getUserProgress(userId);
    if (progress) {
      progress.lastActive = new Date().toISOString();
      this.saveUserProgress(userId, progress);
    }
  }

  /**
   * Add XP to user and potentially level up
   */
  addXP(userId: string, xp: number): { newLevel: number; leveledUp: boolean } {
    const progress = this.getUserProgress(userId);
    if (!progress) {
      throw new Error('User progress not found');
    }

    const oldLevel = progress.currentLevel;
    progress.totalXP += xp;
    
    // Simple level calculation: 100 XP per level
    const newLevel = Math.floor(progress.totalXP / 100) + 1;
    progress.currentLevel = newLevel;
    
    const leveledUp = newLevel > oldLevel;
    
    this.saveUserProgress(userId, progress);
    return { newLevel, leveledUp };
  }

  /**
   * Complete a mission for a user
   */
  completeMission(userId: string, missionId: string): void {
    const progress = this.getUserProgress(userId);
    if (!progress) {
      throw new Error('User progress not found');
    }

    if (!progress.completedMissions.includes(missionId)) {
      progress.completedMissions.push(missionId);
      this.saveUserProgress(userId, progress);
    }
  }

  /**
   * Unlock an achievement for a user
   */
  unlockAchievement(userId: string, achievementId: string): void {
    const progress = this.getUserProgress(userId);
    if (!progress) {
      throw new Error('User progress not found');
    }

    if (!progress.unlockedAchievements.includes(achievementId)) {
      progress.unlockedAchievements.push(achievementId);
      this.saveUserProgress(userId, progress);
    }
  }

  /**
   * Update user's streak
   */
  updateStreak(userId: string, streak: number): void {
    const progress = this.getUserProgress(userId);
    if (!progress) {
      throw new Error('User progress not found');
    }

    progress.currentStreak = streak;
    this.saveUserProgress(userId, progress);
  }
}

// Export a singleton instance
export const localStorageManager = new LocalStorageManager();