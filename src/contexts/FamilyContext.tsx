import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// Frontend-only mode - no authentication or database dependencies
import { localStorageManager, UserProgress } from '../utils/localStorageManager';

export interface ServiceUsage {
  serviceId: string;
  status: 'approved' | 'requested' | 'denied';
  approvedAt?: string;
  notes?: string;
}

interface FamilyMember {
  id: string;
  user_id: string;
  family_id: string;
  role: 'parent' | 'child';
  first_name: string;
  last_name: string;
  email: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
  profile_data?: {
    age?: number;
    grade?: string;
    preferences?: Record<string, unknown>;
  };
  // Local storage specific fields
  progress?: UserProgress;
  privacyScore?: number;
  services?: ServiceUsage[];
}

interface Family {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  members: FamilyMember[];
}

interface FamilyContextType {
  currentFamily: Family | null;
  familyMembers: FamilyMember[];
  loading: boolean;
  createFamily: (name: string) => Promise<{ family: Family | null; error: string | null }>;
  joinFamily: (familyId: string) => Promise<{ success: boolean; error: string | null }>;
  leaveFamily: () => Promise<{ success: boolean; error: string | null }>;
  addFamilyMember: (email: string, role: 'parent' | 'child', firstName: string, lastName: string) => Promise<{ success: boolean; error: string | null }>;
  removeFamilyMember: (memberId: string) => Promise<{ success: boolean; error: string | null }>;
  updateFamilyMember: (memberId: string, updates: Partial<FamilyMember>) => Promise<{ success: boolean; error: string | null }>;
  getFamilyProgress: () => Promise<{ totalActivities: number; completedActivities: number; progressPercentage: number } | null>;
  isParent: boolean;
  isChild: boolean;
  // Service management
  requestService: (memberId: string, serviceId: string) => Promise<{ success: boolean; error: string | null }>;
  addServiceToFamily: (serviceId: string) => Promise<{ success: boolean; error: string | null }>;
  removeServiceFromFamily: (serviceId: string) => Promise<{ success: boolean; error: string | null }>;
  getFamilyServices: () => string[];
  // New methods for localStorage and privacy
  calculateFamilyPrivacyScore: () => number;
  exportFamilyData: () => Promise<string>;
  importFamilyData: (jsonData: string) => boolean;
  getFamilyStorageUsage: () => number;
  clearFamilyData: () => void;
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

export const useFamily = () => {
  const context = useContext(FamilyContext);
  if (!context) {
    throw new Error('useFamily must be used within a FamilyProvider');
  }
  return context;
};

interface FamilyProviderProps {
  children: React.ReactNode;
}

export const FamilyProvider: React.FC<FamilyProviderProps> = ({ children }) => {
  // Frontend-only mode - no authentication
  const [currentFamily, setCurrentFamily] = useState<Family | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(false);

  // Generate a simple user ID for demo purposes
  const getCurrentUserId = () => {
    let userId = localStorage.getItem('pandagarde_current_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('pandagarde_current_user_id', userId);
    }
    return userId;
  };

  // Calculate privacy score for a family member
  const calculateMemberPrivacyScore = (member: FamilyMember, progress?: UserProgress): number => {
    let score = 100; // Start with perfect score

    // Deduct points for incomplete profile
    if (!member.first_name || !member.last_name) {
      score -= 10;
    }
    if (!member.email) {
      score -= 15;
    }
    if (!member.profile_data?.age) {
      score -= 5;
    }

    // Deduct points for lack of progress data
    if (!progress) {
      score -= 20;
    } else {
      // Deduct points for inactive users
      const lastActive = new Date(progress.lastActive);
      const daysSinceActive = (Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceActive > 7) {
        score -= 10;
      }
      if (daysSinceActive > 30) {
        score -= 20;
      }

      // Bonus points for active users
      if (progress.currentStreak > 0) {
        score += Math.min(progress.currentStreak * 2, 20);
      }
      if (progress.completedMissions.length > 0) {
        score += Math.min(progress.completedMissions.length * 3, 15);
      }
    }

    return Math.max(0, Math.min(100, score));
  };

  const loadFamilyMembers = useCallback(async (familyId: string) => {
    console.log('Frontend-only mode: loadFamilyMembers() - using localStorage', familyId);
    try {
      const familyData = await localStorageManager.getFamilyData();
      if (familyData && familyData.id === familyId) {
        const members = familyData.members || [];
        
        // Load progress data for each member
        const membersWithProgress = members.map((member: FamilyMember) => {
          const progress = localStorageManager.getUserProgress(member.user_id);
          return {
            ...member,
            progress: progress || undefined,
            privacyScore: calculateMemberPrivacyScore(member, progress || undefined)
          };
        });
        
        setFamilyMembers(membersWithProgress);
      } else {
        setFamilyMembers([]);
      }
    } catch (error) {
      console.error('Error loading family members:', error);
      setFamilyMembers([]);
    }
  }, []);

  const checkExistingFamily = useCallback(async () => {
    console.log('Frontend-only mode: checkExistingFamily() - using localStorage');
    try {
      const currentUserId = getCurrentUserId();
      const familyData = await localStorageManager.getFamilyData();
      
      if (familyData && familyData.members) {
        const userMember = familyData.members.find((member: FamilyMember) => member.user_id === currentUserId);
        if (userMember) {
          setCurrentFamily(familyData);
          await loadFamilyMembers(familyData.id);
        }
      }
    } catch (error) {
      console.error('Error checking existing family:', error);
    }
  }, [loadFamilyMembers]);

  // Load family data when component mounts - Frontend-only mode
  useEffect(() => {
    console.log('Frontend-only mode: Loading family data from localStorage');
    checkExistingFamily();
  }, [checkExistingFamily]);

  const createFamily = async (name: string) => {
    console.log('Frontend-only mode: createFamily() - using localStorage', name);
    setLoading(true);
    try {
      const currentUserId = getCurrentUserId();
      const familyId = `family_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = new Date().toISOString();

      // Create family data
      const familyData: Family = {
        id: familyId,
        name,
        created_by: currentUserId,
        created_at: now,
        updated_at: now,
        members: []
      };

      // Create creator as parent member
      const creatorMember: FamilyMember = {
        id: `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user_id: currentUserId,
        family_id: familyId,
        role: 'parent',
        first_name: 'Parent',
        last_name: 'User',
        email: 'parent@example.com',
        created_at: now,
        updated_at: now
      };

      familyData.members = [creatorMember];

      // Save family data (with encryption)
      await localStorageManager.saveFamilyData(familyData);

      // Create user progress if it doesn't exist
      let progress = localStorageManager.getUserProgress(currentUserId);
      if (!progress) {
        progress = localStorageManager.createUserProgress(currentUserId, 'Parent User', '13-17');
      }

      setCurrentFamily(familyData);
      await loadFamilyMembers(familyId);

      return { family: familyData, error: null };
    } catch (error) {
      console.error('Error creating family:', error);
      return { family: null, error: 'Failed to create family' };
    } finally {
      setLoading(false);
    }
  };

  const joinFamily = async (familyId: string) => {
    console.log('Frontend-only mode: joinFamily() - using localStorage', familyId);
    setLoading(true);
    try {
      const currentUserId = getCurrentUserId();
      const familyData = await localStorageManager.getFamilyData();

      if (!familyData || familyData.id !== familyId) {
        return { success: false, error: 'Family not found' };
      }

      // Check if user is already a member
      const existingMember = familyData.members.find((member: FamilyMember) => member.user_id === currentUserId);
      if (existingMember) {
        return { success: false, error: 'Already a member of this family' };
      }

      // Add user as family member
      const newMember: FamilyMember = {
        id: `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user_id: currentUserId,
        family_id: familyId,
        role: 'child', // Default to child, can be changed by parent
        first_name: 'Child',
        last_name: 'User',
        email: 'child@example.com',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      familyData.members.push(newMember);
      familyData.updated_at = new Date().toISOString();

      // Save updated family data
        await localStorageManager.saveFamilyData(familyData);

      // Create user progress if it doesn't exist
      let progress = localStorageManager.getUserProgress(currentUserId);
      if (!progress) {
        progress = localStorageManager.createUserProgress(currentUserId, 'Child User', '9-12');
      }

      setCurrentFamily(familyData);
      await loadFamilyMembers(familyId);

      return { success: true, error: null };
    } catch (error) {
      console.error('Error joining family:', error);
      return { success: false, error: 'Failed to join family' };
    } finally {
      setLoading(false);
    }
  };

  const leaveFamily = async () => {
    console.log('Frontend-only mode: leaveFamily() - using localStorage');
    if (!currentFamily) {
      return { success: false, error: 'No family to leave' };
    }

    setLoading(true);
    try {
      const currentUserId = getCurrentUserId();
      const familyData = await localStorageManager.getFamilyData();

      if (!familyData || familyData.id !== currentFamily.id) {
        return { success: false, error: 'Family not found' };
      }

      // Remove user from family members
      familyData.members = familyData.members.filter((member: FamilyMember) => member.user_id !== currentUserId);
      familyData.updated_at = new Date().toISOString();

      // If no members left, delete the family
      if (familyData.members.length === 0) {
        localStorageManager.clearAllData();
        setCurrentFamily(null);
        setFamilyMembers([]);
      } else {
        // Save updated family data (with encryption)
        await localStorageManager.saveFamilyData(familyData);
        setCurrentFamily(null);
        setFamilyMembers([]);
      }

      return { success: true, error: null };
    } catch (error) {
      console.error('Error leaving family:', error);
      return { success: false, error: 'Failed to leave family' };
    } finally {
      setLoading(false);
    }
  };

  const addFamilyMember = async (email: string, role: 'parent' | 'child', firstName: string, lastName: string) => {
    console.log('Frontend-only mode: addFamilyMember() - using localStorage', { email, role, firstName, lastName });
    if (!currentFamily) {
      return { success: false, error: 'No family selected' };
    }

    setLoading(true);
    try {
      const familyData = await localStorageManager.getFamilyData();

      if (!familyData || familyData.id !== currentFamily.id) {
        return { success: false, error: 'Family not found' };
      }

      // Check if user already exists
      const existingMember = familyData.members.find((member: FamilyMember) => member.email === email);
      if (existingMember) {
        return { success: false, error: 'User is already a member of this family' };
      }

      // Create new member
      const newMember: FamilyMember = {
        id: `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user_id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        family_id: currentFamily.id,
        role,
        first_name: firstName,
        last_name: lastName,
        email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      familyData.members.push(newMember);
      familyData.updated_at = new Date().toISOString();

      // Save updated family data
        await localStorageManager.saveFamilyData(familyData);

      // Create user progress for the new member
      const ageGroup = role === 'child' ? '9-12' : '13-17';
      localStorageManager.createUserProgress(newMember.user_id, `${firstName} ${lastName}`, ageGroup);

      await loadFamilyMembers(currentFamily.id);
      return { success: true, error: null };
    } catch (error) {
      console.error('Error adding family member:', error);
      return { success: false, error: 'Failed to add family member' };
    } finally {
      setLoading(false);
    }
  };

  const removeFamilyMember = async (memberId: string) => {
    console.log('Frontend-only mode: removeFamilyMember() - using localStorage', memberId);
    if (!currentFamily) {
      return { success: false, error: 'No family selected' };
    }

    setLoading(true);
    try {
      const familyData = await localStorageManager.getFamilyData();

      if (!familyData || familyData.id !== currentFamily.id) {
        return { success: false, error: 'Family not found' };
      }

      // Find the member to remove
      const memberToRemove = familyData.members.find((member: FamilyMember) => member.id === memberId);
      if (!memberToRemove) {
        return { success: false, error: 'Member not found' };
      }

      // Remove member from family
      familyData.members = familyData.members.filter((member: FamilyMember) => member.id !== memberId);
      familyData.updated_at = new Date().toISOString();

      // Save updated family data
        await localStorageManager.saveFamilyData(familyData);

      // Delete user progress data
      localStorageManager.deleteUser(memberToRemove.user_id);

      await loadFamilyMembers(currentFamily.id);
      return { success: true, error: null };
    } catch (error) {
      console.error('Error removing family member:', error);
      return { success: false, error: 'Failed to remove family member' };
    } finally {
      setLoading(false);
    }
  };

  const updateFamilyMember = async (memberId: string, updates: Partial<FamilyMember>) => {
    console.log('Frontend-only mode: updateFamilyMember() - using localStorage', { memberId, updates });
    if (!currentFamily) {
      return { success: false, error: 'No family selected' };
    }

    setLoading(true);
    try {
      const familyData = await localStorageManager.getFamilyData();

      if (!familyData || familyData.id !== currentFamily.id) {
        return { success: false, error: 'Family not found' };
      }

      // Find and update the member
      const memberIndex = familyData.members.findIndex((member: FamilyMember) => member.id === memberId);
      if (memberIndex === -1) {
        return { success: false, error: 'Member not found' };
      }

      familyData.members[memberIndex] = {
        ...familyData.members[memberIndex],
        ...updates,
        updated_at: new Date().toISOString()
      };

      familyData.updated_at = new Date().toISOString();

      // Save updated family data
        await localStorageManager.saveFamilyData(familyData);

      await loadFamilyMembers(currentFamily.id);
      return { success: true, error: null };
    } catch (error) {
      console.error('Error updating family member:', error);
      return { success: false, error: 'Failed to update family member' };
    } finally {
      setLoading(false);
    }
  };

  const getFamilyProgress = async () => {
    console.log('Frontend-only mode: getFamilyProgress() - using localStorage');
    if (!currentFamily) {
      return null;
    }

    try {
      // Calculate family progress from localStorage data
      const totalActivities = familyMembers.length * 10; // Assume 10 activities per member
      let completedActivities = 0;

      familyMembers.forEach((member: FamilyMember) => {
        if (member.progress) {
          completedActivities += member.progress.completedMissions.length;
        }
      });

      const progressPercentage = totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;

      return {
        totalActivities,
        completedActivities,
        progressPercentage
      };
    } catch (error) {
      console.error('Error loading family progress:', error);
      return null;
    }
  };

  const isParent = familyMembers.find((member: FamilyMember) => member.user_id === getCurrentUserId())?.role === 'parent';
  const isChild = familyMembers.find((member: FamilyMember) => member.user_id === getCurrentUserId())?.role === 'child';

  // Calculate family privacy score
  const calculateFamilyPrivacyScore = (): number => {
    if (familyMembers.length === 0) {
      return 0;
    }
    
    const totalScore = familyMembers.reduce((sum: number, member: FamilyMember) => {
      return sum + (member.privacyScore || 0);
    }, 0);
    
    return Math.round(totalScore / familyMembers.length);
  };

  // Export family data
  const exportFamilyData = async (): Promise<string> => {
    return await localStorageManager.exportData();
  };

  // Import family data
  const importFamilyData = (jsonData: string): boolean => {
    const success = localStorageManager.importData(jsonData);
    if (success) {
      // Reload family data after import
      checkExistingFamily();
    }
    return success;
  };

  // Get family storage usage
  const getFamilyStorageUsage = (): number => {
    return localStorageManager.getStorageUsage();
  };

  // Clear family data
  const clearFamilyData = (): void => {
    localStorageManager.clearAllData();
    setCurrentFamily(null);
    setFamilyMembers([]);
  };

  // Request service for a family member
  const requestService = async (memberId: string, serviceId: string): Promise<{ success: boolean; error: string | null }> => {
    console.log('Frontend-only mode: requestService() - using localStorage', { memberId, serviceId });
    if (!currentFamily) {
      return { success: false, error: 'No family selected' };
    }

    setLoading(true);
    try {
      const familyData = await localStorageManager.getFamilyData();

      if (!familyData || familyData.id !== currentFamily.id) {
        return { success: false, error: 'Family not found' };
      }

      // Find the member
      const memberIndex = familyData.members.findIndex((member: FamilyMember) => member.id === memberId);
      if (memberIndex === -1) {
        return { success: false, error: 'Member not found' };
      }

      const member = familyData.members[memberIndex];

      // Initialize services array if it doesn't exist
      if (!member.services) {
        member.services = [];
      }

      // Check if service is already requested or approved
      const existingService = member.services.find((s: ServiceUsage) => s.serviceId === serviceId);
      if (existingService) {
        return { success: false, error: 'Service already requested or approved' };
      }

      // Add service request
      const newService: ServiceUsage = {
        serviceId,
        status: 'requested'
      };

      member.services.push(newService);
      member.updated_at = new Date().toISOString();
      familyData.updated_at = new Date().toISOString();

      // Save updated family data
      await localStorageManager.saveFamilyData(familyData);

      await loadFamilyMembers(currentFamily.id);
      return { success: true, error: null };
    } catch (error) {
      console.error('Error requesting service:', error);
      return { success: false, error: 'Failed to request service' };
    } finally {
      setLoading(false);
    }
  };

  // Add service to family (for Digital Footprint Analysis)
  const addServiceToFamily = async (serviceId: string): Promise<{ success: boolean; error: string | null }> => {
    console.log('Frontend-only mode: addServiceToFamily() - using localStorage', { serviceId });
    
    try {
      // Get or create family services list
      const familyServicesKey = 'pandagarde_family_services';
      let existingServices: string[] = [];
      try {
        const servicesStr = localStorage.getItem(familyServicesKey) || '[]';
        const parsed = JSON.parse(servicesStr);
        existingServices = Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        console.error('Error parsing family services:', error);
        existingServices = [];
      }
      
      // Check if service is already added
      if (existingServices.includes(serviceId)) {
        return { success: false, error: 'Service already added to family' };
      }
      
      // Add the service
      existingServices.push(serviceId);
      localStorage.setItem(familyServicesKey, JSON.stringify(existingServices));
      
      // Also add to all family members as approved (for Digital Footprint Analysis)
      if (currentFamily) {
        const familyData = await localStorageManager.getFamilyData();
        if (familyData) {
          familyData.members.forEach((member: FamilyMember) => {
            if (!member.services) {
              member.services = [];
            }
            // Add as approved if not already exists
            const existing = member.services.find((s: ServiceUsage) => s.serviceId === serviceId);
            if (!existing) {
              member.services.push({
                serviceId,
                status: 'approved',
                approvedAt: new Date().toISOString()
              });
            }
          });
          familyData.updated_at = new Date().toISOString();
          await localStorageManager.saveFamilyData(familyData);
          await loadFamilyMembers(currentFamily.id);
        }
      }
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Error adding service to family:', error);
      return { success: false, error: 'Failed to add service' };
    }
  };

  // Remove service from family
  const removeServiceFromFamily = async (serviceId: string): Promise<{ success: boolean; error: string | null }> => {
    console.log('Frontend-only mode: removeServiceFromFamily() - using localStorage', { serviceId });
    
    try {
      // Get family services list
      const familyServicesKey = 'pandagarde_family_services';
      let existingServices: string[] = [];
      try {
        const servicesStr = localStorage.getItem(familyServicesKey) || '[]';
        const parsed = JSON.parse(servicesStr);
        existingServices = Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        console.error('Error parsing family services:', error);
        existingServices = [];
      }
      
      // Remove the service
      const updatedServices = existingServices.filter((id: string) => id !== serviceId);
      localStorage.setItem(familyServicesKey, JSON.stringify(updatedServices));
      
      // Also remove from all family members
      if (currentFamily) {
        const familyData = await localStorageManager.getFamilyData();
        if (familyData) {
          familyData.members.forEach((member: FamilyMember) => {
            if (member.services) {
              member.services = member.services.filter((s: ServiceUsage) => s.serviceId !== serviceId);
            }
          });
          familyData.updated_at = new Date().toISOString();
          await localStorageManager.saveFamilyData(familyData);
          await loadFamilyMembers(currentFamily.id);
        }
      }
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Error removing service from family:', error);
      return { success: false, error: 'Failed to remove service' };
    }
  };

  // Get list of family services
  const getFamilyServices = (): string[] => {
    const familyServicesKey = 'pandagarde_family_services';
    try {
      const servicesStr = localStorage.getItem(familyServicesKey) || '[]';
      const parsed = JSON.parse(servicesStr);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error parsing family services:', error);
      return [];
    }
  };

  const value: FamilyContextType = {
    currentFamily,
    familyMembers,
    loading,
    createFamily,
    joinFamily,
    leaveFamily,
    addFamilyMember,
    removeFamilyMember,
    updateFamilyMember,
    getFamilyProgress,
    isParent,
    isChild,
    requestService,
    addServiceToFamily,
    removeServiceFromFamily,
    getFamilyServices,
    calculateFamilyPrivacyScore,
    exportFamilyData,
    importFamilyData,
    getFamilyStorageUsage,
    clearFamilyData
  };

  return (
    <FamilyContext.Provider value={value}>
      {children}
    </FamilyContext.Provider>
  );
};