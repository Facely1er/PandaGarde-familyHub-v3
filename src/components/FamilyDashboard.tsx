import { useState, useEffect } from 'react';
import { 
  Users, Shield, Award, Plus, Trash2, CheckCircle, X, MessageSquare, Eye, Clock, Gamepad2, Play, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useFamilyProgress } from '../contexts/FamilyProgressContext';
import { trackEvent, AnalyticsEvents } from '../lib/analytics';
import ChildProgressDetail from './ChildProgressDetail';
import FeedbackForm from './FeedbackForm';
import { 
  validateFamilyMember, 
  validateGoal, 
  sanitizeInput,
  detectSuspiciousActivity,
  logSecurityEvent
} from '../lib/familyHubSecurity';
import { useActiveMember } from '../utils/familyProgressIntegration';

interface FamilyMember {
  id: number;
  name: string;
  age: number;
  role: string;
  privacyScore: number;
  completedActivities: number;
  badges: string[];
  lastActive: string;
}

interface FamilyGoal {
  id: number;
  title: string;
  description: string;
  targetDate: string;
  priority: string;
  completed: boolean;
  createdDate: string;
  progress: number;
}

// Demo data for demonstration purposes
const demoFamilyMembers: FamilyMember[] = [
  {
    id: 1,
    name: 'Emma',
    age: 8,
    role: 'Child',
    privacyScore: 72,
    completedActivities: 4,
    badges: ['Password Pro', 'Safe Surfer'],
    lastActive: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Lucas',
    age: 12,
    role: 'Child',
    privacyScore: 78,
    completedActivities: 7,
    badges: ['Password Pro', 'Privacy Champion', 'Phishing Fighter'],
    lastActive: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Sarah',
    age: 15,
    role: 'Teen',
    privacyScore: 85,
    completedActivities: 10,
    badges: ['Password Pro', 'Privacy Champion', 'Social Media Expert', 'Digital Citizen'],
    lastActive: new Date().toISOString()
  }
];

// Demo activity progress data - realistic completed activities for each member
const demoProgressData: Record<number, {
  memberId: number;
  activities: Array<{
    activityId: string;
    activityName: string;
    activityType: 'game' | 'journey' | 'module';
    score: number;
    maxScore: number;
    completedAt: string;
  }>;
  totalScore: number;
  completedCount: number;
  lastActive: string;
}> = {
  // Emma (age 8) - Elementary level games
  1: {
    memberId: 1,
    activities: [
      {
        activityId: 'password-strength',
        activityName: 'Password Strength Lab',
        activityType: 'game',
        score: 85,
        maxScore: 100,
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        activityId: 'password-pet',
        activityName: 'Password Pet Creator',
        activityType: 'game',
        score: 90,
        maxScore: 100,
        completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        activityId: 'safe-unsafe',
        activityName: 'Safe vs Unsafe Sorting',
        activityType: 'game',
        score: 70,
        maxScore: 100,
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        activityId: 'privacy-story',
        activityName: 'Privacy Story Adventure',
        activityType: 'game',
        score: 45,
        maxScore: 100,
        completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    totalScore: 72,
    completedCount: 4,
    lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  // Lucas (age 12) - Middle school level games
  2: {
    memberId: 2,
    activities: [
      {
        activityId: 'password-strength',
        activityName: 'Password Strength Lab',
        activityType: 'game',
        score: 95,
        maxScore: 100,
        completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        activityId: 'safe-unsafe',
        activityName: 'Safe vs Unsafe Sorting',
        activityType: 'game',
        score: 80,
        maxScore: 100,
        completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        activityId: 'phishing-detective',
        activityName: 'Phishing Detective',
        activityType: 'game',
        score: 75,
        maxScore: 100,
        completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        activityId: 'digital-footprint',
        activityName: 'Digital Footprint Visualizer',
        activityType: 'game',
        score: 70,
        maxScore: 100,
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        activityId: 'privacy-settings',
        activityName: 'Privacy Settings Trainer',
        activityType: 'game',
        score: 85,
        maxScore: 100,
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        activityId: 'social-media-audit',
        activityName: 'Social Media Audit',
        activityType: 'game',
        score: 65,
        maxScore: 100,
        completedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        activityId: 'password-fortress',
        activityName: 'Password Fortress Builder',
        activityType: 'game',
        score: 78,
        maxScore: 100,
        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    totalScore: 78,
    completedCount: 7,
    lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  // Sarah (age 15) - High school level including hard games
  3: {
    memberId: 3,
    activities: [
      {
        activityId: 'password-strength',
        activityName: 'Password Strength Lab',
        activityType: 'game',
        score: 100,
        maxScore: 100,
        completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        activityId: 'safe-unsafe',
        activityName: 'Safe vs Unsafe Sorting',
        activityType: 'game',
        score: 95,
        maxScore: 100,
        completedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        activityId: 'phishing-detective',
        activityName: 'Phishing Detective',
        activityType: 'game',
        score: 90,
        maxScore: 100,
        completedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        activityId: 'digital-footprint',
        activityName: 'Digital Footprint Visualizer',
        activityType: 'game',
        score: 85,
        maxScore: 100,
        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        activityId: 'privacy-settings',
        activityName: 'Privacy Settings Trainer',
        activityType: 'game',
        score: 88,
        maxScore: 100,
        completedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        activityId: 'social-media-audit',
        activityName: 'Social Media Audit',
        activityType: 'game',
        score: 82,
        maxScore: 100,
        completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        activityId: 'social-simulator',
        activityName: 'Social Media Simulator',
        activityType: 'game',
        score: 78,
        maxScore: 100,
        completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        activityId: 'password-fortress',
        activityName: 'Password Fortress Builder',
        activityType: 'game',
        score: 92,
        maxScore: 100,
        completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        activityId: 'digital-rights',
        activityName: 'Digital Rights Quiz',
        activityType: 'game',
        score: 70,
        maxScore: 100,
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        activityId: 'privacy-decoder',
        activityName: 'Privacy Policy Decoder',
        activityType: 'game',
        score: 72,
        maxScore: 100,
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    totalScore: 85,
    completedCount: 10,
    lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
};

const demoFamilyGoals: FamilyGoal[] = [
  {
    id: 1,
    title: 'Complete Password Safety Module',
    description: 'All family members learn about creating strong passwords',
    targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'High',
    completed: false,
    createdDate: new Date().toISOString(),
    progress: 50
  },
  {
    id: 2,
    title: 'Family Privacy Discussion',
    description: 'Have a family meeting about online privacy and set ground rules',
    targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'Medium',
    completed: false,
    createdDate: new Date().toISOString(),
    progress: 0
  },
  {
    id: 3,
    title: 'Review Social Media Settings',
    description: 'Check and update privacy settings on all social media accounts',
    targetDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'High',
    completed: true,
    createdDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    progress: 100
  }
];

// Enhanced security: Use security utilities from familyHubSecurity

interface FamilyDashboardProps {
  appMode?: boolean; // When true, hides hero/marketing sections
}

const FamilyDashboard: React.FC<FamilyDashboardProps> = ({ appMode = false }) => {
  const navigate = useNavigate();
  const { calculateMemberScore, getMemberProgress } = useFamilyProgress();
  const { currentMemberId, setActiveMember } = useActiveMember();
  const [familyMembers, setFamilyMembers] = useLocalStorage<FamilyMember[]>('pandagarde_family', []);
  const [familyGoals, setFamilyGoals] = useLocalStorage<FamilyGoal[]>('pandagarde_family_goals', []);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [newMember, setNewMember] = useState({ name: '', age: 0, role: 'Child' });
  const [newGoal, setNewGoal] = useState({ title: '', description: '', targetDate: '', priority: 'Medium' });
  const [memberErrors, setMemberErrors] = useState<string[]>([]);

  useEffect(() => {
    if (familyMembers.length === 0) {
      setActiveMember(null);
      return;
    }
    const stillValid =
      currentMemberId != null && familyMembers.some((m) => m.id === currentMemberId);
    if (!stillValid) {
      setActiveMember(familyMembers[0].id);
    }
  }, [familyMembers, currentMemberId, setActiveMember]);

  // Load demo data for demonstration purposes
  const loadDemoData = () => {
    // Load family members
    setFamilyMembers(demoFamilyMembers);
    // Load family goals
    setFamilyGoals(demoFamilyGoals);
    // Load activity progress data directly to localStorage
    localStorage.setItem('pandagarde_family_progress', JSON.stringify(demoProgressData));
    
    trackEvent(AnalyticsEvents.FAMILY_MEMBER_ADDED, {
      action: 'demo_data_loaded',
      memberCount: demoFamilyMembers.length,
      goalCount: demoFamilyGoals.length,
      activitiesLoaded: Object.values(demoProgressData).reduce((sum, p) => sum + p.completedCount, 0),
      timestamp: new Date().toISOString()
    });
    
    // Force a page reload to sync the progress context with new data
    window.location.reload();
  };

  // Sync progress data with family members
  useEffect(() => {
    if (familyMembers.length > 0) {
      const updatedMembers = familyMembers.map((member: FamilyMember) => {
        const progress = getMemberProgress(member.id);
        const realScore = calculateMemberScore(member.id);
        const completedCount = progress?.completedCount || 0;
        const lastActive = progress?.lastActive || member.lastActive;
        
        return {
          ...member,
          privacyScore: realScore,
          completedActivities: completedCount,
          lastActive
        };
      });
      setFamilyMembers(updatedMembers);
    }
  }, [calculateMemberScore, getMemberProgress]); // Removed setFamilyMembers from deps to avoid infinite loop

  // Calculate family privacy score
  const calculateFamilyScore = () => {
    if (!familyMembers || familyMembers.length === 0) {return 0;}
    const validMembers = familyMembers.filter(m => m && m.id);
    if (validMembers.length === 0) {return 0;}
    const totalScore = validMembers.reduce((sum, member) => {
      try {
        const realScore = calculateMemberScore(member.id);
        return sum + (realScore || 0);
      } catch (error) {
        console.error('Error calculating member score:', error);
        return sum;
      }
    }, 0);
    return Math.round(totalScore / validMembers.length);
  };

  // Add family member
  const addFamilyMember = () => {
    setMemberErrors([]);
    
    // Security check: Detect suspicious activity
    if (detectSuspiciousActivity('add_family_member', { memberCount: familyMembers.length })) {
      logSecurityEvent('suspicious_activity_detected', { action: 'add_family_member' });
      setMemberErrors(['Too many requests. Please wait a moment.']);
      return;
    }
    
    // Enhanced validation using security utilities
    const validation = validateFamilyMember(newMember);
    if (!validation.isValid) {
      setMemberErrors(validation.errors);
      logSecurityEvent('validation_failed', { action: 'add_family_member', errors: validation.errors });
      return;
    }

    // Sanitize input
    const sanitizedName = sanitizeInput(newMember.name);

    const member: FamilyMember = {
      id: Date.now(),
      name: sanitizedName,
      age: newMember.age,
      role: newMember.role,
      privacyScore: 0, // Start at 0, will be calculated from actual activities
      completedActivities: 0,
      badges: [],
      lastActive: new Date().toISOString()
    };
    
    setFamilyMembers([...familyMembers, member]);
    setActiveMember(member.id);
    setNewMember({ name: '', age: 0, role: 'Child' });
    setShowAddMember(false);
    
    // Log security event
    logSecurityEvent('family_member_added', { memberId: member.id, role: member.role });
    
    // Track analytics
    trackEvent(AnalyticsEvents.FAMILY_MEMBER_ADDED, {
      memberId: member.id,
      role: member.role,
      age: member.age,
      timestamp: new Date().toISOString()
    });
  };

  // Remove family member
  const removeFamilyMember = (id: number) => {
    // Security check
    if (detectSuspiciousActivity('remove_family_member', { memberId: id })) {
      logSecurityEvent('suspicious_activity_detected', { action: 'remove_family_member', memberId: id });
      return;
    }
    
    const member = familyMembers.find(m => m.id === id);
    setFamilyMembers(familyMembers.filter(member => member.id !== id));
    
    // Log security event
    if (member) {
      logSecurityEvent('family_member_removed', { memberId: id, role: member.role });
      
      // Track analytics
      trackEvent(AnalyticsEvents.FAMILY_MEMBER_REMOVED, {
        memberId: id,
        role: member.role,
        timestamp: new Date().toISOString()
      });
    }
  };

  // Add family goal
  const addFamilyGoal = () => {
    // Security check
    if (detectSuspiciousActivity('add_family_goal', { goalCount: familyGoals.length })) {
      logSecurityEvent('suspicious_activity_detected', { action: 'add_family_goal' });
      return;
    }
    
    // Enhanced validation
    const validation = validateGoal(newGoal);
    if (!validation.isValid) {
      logSecurityEvent('validation_failed', { action: 'add_family_goal', errors: validation.errors });
      return;
    }
    
    if (newGoal.title) {
      // Sanitize inputs
      const sanitizedTitle = sanitizeInput(newGoal.title);
      const sanitizedDescription = sanitizeInput(newGoal.description);
      
      const goal: FamilyGoal = {
        id: Date.now(),
        title: sanitizedTitle,
        description: sanitizedDescription,
        targetDate: newGoal.targetDate,
        priority: newGoal.priority,
        completed: false,
        createdDate: new Date().toISOString(),
        progress: 0
      };
      setFamilyGoals([...familyGoals, goal]);
      setNewGoal({ title: '', description: '', targetDate: '', priority: 'Medium' });
      setShowAddGoal(false);
      
      // Log security event
      logSecurityEvent('family_goal_added', { goalId: goal.id, priority: goal.priority });
      
      // Track analytics
      trackEvent(AnalyticsEvents.FAMILY_GOAL_ADDED, {
        goalId: goal.id,
        priority: goal.priority,
        hasTargetDate: !!goal.targetDate,
        timestamp: new Date().toISOString()
      });
    }
  };

  // Toggle goal completion
  const toggleGoalCompletion = (id: number) => {
    const goal = familyGoals.find(g => g.id === id);
    const newCompleted = goal ? !goal.completed : false;
    
    setFamilyGoals(familyGoals.map(goal => 
      goal.id === id ? { ...goal, completed: !goal.completed, progress: goal.completed ? 0 : 100 } : goal
    ));
    
    // Track analytics
    if (goal && newCompleted) {
      trackEvent(AnalyticsEvents.FAMILY_GOAL_COMPLETED, {
        goalId: id,
        priority: goal.priority,
        timestamp: new Date().toISOString()
      });
    }
  };

  // Track analytics when viewing child progress
  useEffect(() => {
    if (selectedChildId) {
      const selectedChild = familyMembers.find(m => m.id === selectedChildId);
      if (selectedChild) {
        trackEvent(AnalyticsEvents.CHILD_PROGRESS_VIEWED, {
          memberId: selectedChild.id,
          memberName: selectedChild.name,
          timestamp: new Date().toISOString()
        });
      }
    }
  }, [selectedChildId, familyMembers]);

  // Show child progress detail if selected
  if (selectedChildId) {
    const selectedChild = familyMembers.find(m => m && m.id === selectedChildId);
    if (selectedChild && selectedChild.id && selectedChild.name) {
      return (
        <ChildProgressDetail
          memberId={selectedChild.id}
          memberName={selectedChild.name}
          memberAge={selectedChild.age || 0}
          onBack={() => setSelectedChildId(null)}
        />
      );
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--fh-bg-light, #F0FDFA)', color: 'var(--gray-800)' }}>
      {/* Hero Section - Teal Theme - Hidden in app mode */}
      {!appMode && (
      <section className="bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 text-white py-6 sm:py-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><pattern id='grain' width='100' height='100' patternUnits='userSpaceOnUse'><circle cx='20' cy='20' r='1' fill='rgba(255,255,255,0.1)'/><circle cx='80' cy='40' r='1' fill='rgba(255,255,255,0.05)'/><circle cx='40' cy='80' r='1' fill='rgba(255,255,255,0.1)'/><circle cx='60' cy='60' r='1.5' fill='rgba(255,255,255,0.08)'/></pattern></defs><rect width='100%' height='100%' fill='url(%23grain)'/></svg>")`
          }} />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 leading-tight">
              Welcome to Your Dashboard
            </h1>
            
            <p className="text-base sm:text-lg opacity-90 max-w-2xl mx-auto mb-4 px-4">
              Track your family's privacy learning progress and achievements.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm px-4">
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Users size={14} className="sm:w-4 sm:h-4" />
                <span className="font-medium">{familyMembers.length} Family {familyMembers.length === 1 ? 'Member' : 'Members'}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Award size={14} className="sm:w-4 sm:h-4" />
                <span className="font-medium">{calculateFamilyScore()}/100 Privacy Score</span>
              </div>
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Clock size={14} className="sm:w-4 sm:h-4" />
                <span className="font-medium">Active Learning</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Quick Actions Bar */}
      <div
        className="border-b border-teal-100/80 bg-white/90 backdrop-blur-sm dark:border-teal-900/40 dark:bg-gray-900/80"
        style={{ backgroundColor: 'var(--card-color)' }}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-end py-2.5 sm:py-3">
            <button
              onClick={() => setShowFeedback(true)}
              className="flex items-center justify-center gap-2 rounded-full bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-600/20 transition-all hover:bg-teal-700 hover:shadow-lg active:scale-[0.98] dark:shadow-teal-900/30"
            >
              <MessageSquare size={16} />
              <span>Feedback</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {familyMembers.length > 0 && (
          <div className="relative mb-6 overflow-hidden rounded-2xl p-[1px] shadow-md shadow-teal-900/5 dark:shadow-black/20">
            <div
              className="absolute inset-0 bg-gradient-to-r from-teal-400 via-cyan-500 to-emerald-500 opacity-90 dark:from-teal-600 dark:via-cyan-600 dark:to-emerald-700"
              aria-hidden
            />
            <div className="relative flex flex-col gap-4 rounded-2xl bg-white p-4 dark:bg-gray-900 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div className="flex items-start gap-3 sm:items-center">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-inner">
                  <Gamepad2 size={22} aria-hidden />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Who’s playing?</p>
                  <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                    Game scores and journey steps save for this profile.
                  </p>
                </div>
              </div>
              <label className="w-full sm:w-auto sm:min-w-[220px]">
                <span className="sr-only">Select active family member for games</span>
                <select
                  value={currentMemberId ?? familyMembers[0].id}
                  onChange={(e) => setActiveMember(Number(e.target.value))}
                  className="w-full cursor-pointer appearance-none rounded-xl border-2 border-slate-200 bg-slate-50 py-3 pl-4 pr-10 text-sm font-semibold text-slate-900 shadow-sm transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-teal-400"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                  }}
                >
                  {familyMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} · {m.role} · age {m.age}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        )}
        {/* Family Overview Cards - Teal Theme */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div 
            className="family-hub-card bg-white p-4 sm:p-5 rounded-xl shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-teal-200"
            style={{ 
              backgroundColor: 'var(--card-color)',
              boxShadow: '0 1px 3px 0 rgba(13, 115, 119, 0.08), 0 1px 2px 0 rgba(13, 115, 119, 0.04)'
            }}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="w-9 h-9 sm:w-11 sm:h-11 bg-teal-100 rounded-xl flex items-center justify-center">
                <Users className="text-teal-600" size={18} />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-teal-700">
                {familyMembers.length}
              </span>
            </div>
            <h3 className="font-semibold text-xs sm:text-sm mb-0.5 sm:mb-1 text-teal-700">Family Members</h3>
            <p className="text-xs" style={{ color: 'var(--gray-600)' }}>Active participants</p>
          </div>

          <div 
            className="family-hub-card bg-white p-4 sm:p-5 rounded-xl shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-teal-200"
            style={{ 
              backgroundColor: 'var(--card-color)',
              boxShadow: '0 1px 3px 0 rgba(13, 115, 119, 0.08), 0 1px 2px 0 rgba(13, 115, 119, 0.04)'
            }}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="w-9 h-9 sm:w-11 sm:h-11 bg-cyan-100 rounded-xl flex items-center justify-center">
                <Shield className="text-cyan-600" size={18} />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-teal-700">
                {calculateFamilyScore()}
              </span>
            </div>
            <h3 className="font-semibold text-xs sm:text-sm mb-0.5 sm:mb-1 text-teal-700">Privacy Score</h3>
            <p className="text-xs" style={{ color: 'var(--gray-600)' }}>Family average</p>
          </div>

          <div 
            className="family-hub-card bg-white p-4 sm:p-5 rounded-xl shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-teal-200"
            style={{ 
              backgroundColor: 'var(--card-color)',
              boxShadow: '0 1px 3px 0 rgba(13, 115, 119, 0.08), 0 1px 2px 0 rgba(13, 115, 119, 0.04)'
            }}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="w-9 h-9 sm:w-11 sm:h-11 bg-amber-100 rounded-xl flex items-center justify-center">
                <Award className="text-amber-600" size={18} />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-teal-700">
                {familyMembers.reduce((sum, member) => sum + member.completedActivities, 0)}
              </span>
            </div>
            <h3 className="font-semibold text-xs sm:text-sm mb-0.5 sm:mb-1 text-teal-700">Activities Done</h3>
            <p className="text-xs" style={{ color: 'var(--gray-600)' }}>Total completed</p>
          </div>

          <div 
            className="family-hub-card bg-white p-4 sm:p-5 rounded-xl shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-teal-200"
            style={{ 
              backgroundColor: 'var(--card-color)',
              boxShadow: '0 1px 3px 0 rgba(13, 115, 119, 0.08), 0 1px 2px 0 rgba(13, 115, 119, 0.04)'
            }}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="w-9 h-9 sm:w-11 sm:h-11 bg-orange-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="text-orange-600" size={18} />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-teal-700">
                {familyGoals.filter(goal => goal.completed).length}/{familyGoals.length}
              </span>
            </div>
            <h3 className="font-semibold text-xs sm:text-sm mb-0.5 sm:mb-1 text-teal-700">Goals Achieved</h3>
            <p className="text-xs" style={{ color: 'var(--gray-600)' }}>Privacy goals</p>
          </div>
        </div>

        {/* Learning Hub Quick Access - Teal Theme - Hidden in app mode */}
        {!appMode && (
        <div 
          className="bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 rounded-xl shadow-lg p-5 sm:p-6 mb-6 sm:mb-8 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><pattern id='stars' width='100' height='100' patternUnits='userSpaceOnUse'><circle cx='20' cy='20' r='2' fill='rgba(255,255,255,0.3)'/><circle cx='80' cy='40' r='1' fill='rgba(255,255,255,0.2)'/><circle cx='40' cy='80' r='1.5' fill='rgba(255,255,255,0.3)'/><circle cx='60' cy='10' r='1' fill='rgba(255,255,255,0.2)'/></pattern></defs><rect width='100%' height='100%' fill='url(%23stars)'/></svg>")`
            }} />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Gamepad2 className="text-white" size={28} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="text-yellow-300" size={18} />
                  <h3 className="text-xl sm:text-2xl font-bold">Learning Hub</h3>
                </div>
                <p className="text-white/80 text-sm sm:text-base">
                  Play fun privacy games and activities to boost your family's privacy score!
                </p>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/family-hub/learning')}
              className="flex items-center gap-2 bg-white text-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 hover:text-teal-700 transition-all shadow-md hover:shadow-lg w-full md:w-auto justify-center"
            >
              <Play size={18} />
              <span>Start Learning</span>
            </button>
          </div>
          
          <div className="relative z-10 mt-4 pt-4 border-t border-white/20">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎮</span>
                <span>12 Interactive Games</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                <span>All Ages</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏆</span>
                <span>Earn Badges</span>
              </div>
            </div>
          </div>
        </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Family Members Management */}
          <div 
            className="bg-white rounded-xl shadow-md p-5 sm:p-6"
            style={{ 
              backgroundColor: 'var(--card-color)',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--primary)' }}>Family Members</h2>
              <button 
                onClick={() => setShowAddMember(true)}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 active:bg-teal-800 transition-colors flex items-center justify-center gap-2 touch-manipulation min-h-[44px] w-full sm:w-auto font-medium"
              >
                <Plus size={16} />
                <span>Add Member</span>
              </button>
            </div>

            {familyMembers.length === 0 ? (
              <div className="text-center py-8 sm:py-10">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5">
                  <Users className="text-gray-400" size={28} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3" style={{ color: 'var(--primary)' }}>
                  No Family Members Yet
                </h3>
                <p className="mb-4 sm:mb-6 text-sm sm:text-base" style={{ color: 'var(--gray-600)' }}>Add your first family member to start tracking progress together.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button 
                    onClick={() => setShowAddMember(true)}
                    className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors font-semibold shadow-sm hover:shadow-md active:scale-[0.98]"
                  >
                    Add Your First Member
                  </button>
                  <button 
                    onClick={loadDemoData}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-sm hover:shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <Sparkles size={18} />
                    Load Demo Data
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {familyMembers.map(member => (
                  <div 
                    key={member.id} 
                    className="border-2 border-gray-200 rounded-lg p-4 hover:border-green-300 transition-all"
                    style={{ 
                      backgroundColor: 'var(--light)',
                      borderColor: 'var(--gray-200)'
                    }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-teal-500 to-cyan-600 flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-sm flex-shrink-0">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-base sm:text-lg sm:truncate break-words" style={{ color: 'var(--primary)' }}>
                            {member.name}
                          </h3>
                          <p className="text-sm" style={{ color: 'var(--gray-600)' }}>{member.role} • Age {member.age}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                        <div className="text-right">
                          <div className="text-lg sm:text-xl font-bold" style={{ color: 'var(--primary)' }}>
                            {calculateMemberScore(member.id)}
                          </div>
                          <div className="text-xs" style={{ color: 'var(--gray-600)' }}>Privacy Score</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setActiveMember(member.id);
                              setSelectedChildId(member.id);
                            }}
                            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                            title="View detailed progress"
                          >
                            <Eye size={18} />
                          </button>
                          <button 
                            onClick={() => removeFamilyMember(member.id)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                            title="Remove family member"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Privacy Score Display */}
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t" style={{ borderColor: 'var(--gray-200)' }}>
                      <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                        <span className="text-xs sm:text-sm" style={{ color: 'var(--gray-600)' }}>Privacy Score</span>
                        <span className="text-xs sm:text-sm font-medium" style={{ color: 'var(--gray-700)' }}>
                          {calculateMemberScore(member.id)}/100
                        </span>
                      </div>
                      <div className="w-full h-2 sm:h-2.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            calculateMemberScore(member.id) >= 80 ? 'bg-green-500' :
                            calculateMemberScore(member.id) >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.max(0, Math.min(100, calculateMemberScore(member.id)))}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs mt-1 sm:mt-1.5" style={{ color: 'var(--gray-500)' }}>
                        <span>Needs Work</span>
                        <span>Good</span>
                        <span>Excellent</span>
                      </div>
                      <p className="text-xs mt-1.5 sm:mt-2" style={{ color: 'var(--gray-500)' }}>
                        Score calculated from completed activities
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Family Goals */}
          <div 
            className="bg-white rounded-xl shadow-md p-5 sm:p-6"
            style={{ 
              backgroundColor: 'var(--card-color)',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--primary)' }}>Privacy Goals</h2>
              <button 
                onClick={() => setShowAddGoal(true)}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 active:bg-teal-800 transition-colors flex items-center justify-center gap-2 touch-manipulation min-h-[44px] w-full sm:w-auto font-medium"
              >
                <Plus size={16} />
                <span>Add Goal</span>
              </button>
            </div>

            {familyGoals.length === 0 ? (
              <div className="text-center py-8 sm:py-10">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5">
                  <Award className="text-gray-400" size={28} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3" style={{ color: 'var(--primary)' }}>
                  No Privacy Goals Yet
                </h3>
                <p className="mb-4 sm:mb-6 text-sm sm:text-base" style={{ color: 'var(--gray-600)' }}>Set your first privacy goal to track your family's progress.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button 
                    onClick={() => setShowAddGoal(true)}
                    className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors font-semibold shadow-sm hover:shadow-md active:scale-[0.98]"
                  >
                    Set Your First Goal
                  </button>
                  {familyMembers.length === 0 && (
                    <button 
                      onClick={loadDemoData}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-sm hover:shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <Sparkles size={18} />
                      Load Demo Data
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {familyGoals.map(goal => (
                  <div 
                    key={goal.id} 
                    className="border-2 border-gray-200 rounded-lg p-4 hover:border-green-300 transition-all"
                    style={{ 
                      backgroundColor: 'var(--light)',
                      borderColor: goal.completed ? 'var(--green-200)' : 'var(--gray-200)'
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className={`font-semibold text-base sm:text-lg ${goal.completed ? 'line-through' : ''}`} style={{ 
                            color: goal.completed ? 'var(--gray-500)' : 'var(--primary)' 
                          }}>
                            {goal.title}
                          </h3>
                          <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                            goal.priority === 'High' ? 'bg-red-100 text-red-800' :
                            goal.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {goal.priority}
                          </span>
                        </div>
                        <p className="text-sm mb-2" style={{ color: 'var(--gray-600)' }}>{goal.description}</p>
                        {goal.targetDate && (
                          <p className="text-xs" style={{ color: 'var(--gray-500)' }}>
                            Target: {new Date(goal.targetDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <button 
                        onClick={() => toggleGoalCompletion(goal.id)}
                        className={`p-2.5 rounded-lg transition-colors flex-shrink-0 ${
                          goal.completed 
                            ? 'bg-teal-100 text-teal-600 hover:bg-teal-200' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        title={goal.completed ? 'Mark as incomplete' : 'Mark as complete'}
                      >
                        <CheckCircle size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add Member Modal - Mobile Optimized */}
      {showAddMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div 
            className="rounded-xl max-w-md w-full p-4 sm:p-6 my-auto max-h-[90vh] overflow-y-auto shadow-xl"
            style={{ backgroundColor: 'var(--card-color)' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold" style={{ color: 'var(--primary)' }}>Add Family Member</h3>
              <button 
                onClick={() => setShowAddMember(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              {memberErrors.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-3">
                  <ul className="text-sm text-red-600 dark:text-red-300 space-y-1">
                    {memberErrors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gray-700)' }}>Name</label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  style={{ backgroundColor: 'var(--card-color)', color: 'var(--gray-900)' }}
                  placeholder="Enter family member's name"
                  maxLength={50}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gray-700)' }}>Age</label>
                <input
                  type="number"
                  value={newMember.age || ''}
                  onChange={(e) => setNewMember({...newMember, age: parseInt(e.target.value, 10) || 0})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  style={{ backgroundColor: 'var(--card-color)', color: 'var(--gray-900)' }}
                  placeholder="Enter age"
                  min="1"
                  max="100"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gray-700)' }}>Role</label>
                <select
                  value={newMember.role}
                  onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  style={{ backgroundColor: 'var(--card-color)', color: 'var(--gray-900)' }}
                >
                  <option value="Parent">Parent</option>
                  <option value="Child">Child</option>
                  <option value="Teen">Teen</option>
                  <option value="Guardian">Guardian</option>
                </select>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddMember(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 active:bg-gray-500 transition-colors touch-manipulation min-h-[44px] font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={addFamilyMember}
                  className="flex-1 bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 active:bg-teal-800 transition-colors touch-manipulation min-h-[44px] font-medium"
                >
                  Add Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Goal Modal - Mobile Optimized */}
      {showAddGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div 
            className="rounded-xl max-w-md w-full p-4 sm:p-6 my-auto max-h-[90vh] overflow-y-auto shadow-xl"
            style={{ backgroundColor: 'var(--card-color)' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold" style={{ color: 'var(--primary)' }}>Add Privacy Goal</h3>
              <button 
                onClick={() => setShowAddGoal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gray-700)' }}>Goal Title</label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  style={{ backgroundColor: 'var(--card-color)', color: 'var(--gray-900)' }}
                  placeholder="e.g., Set up 2FA for all accounts"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gray-700)' }}>Description</label>
                <textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  style={{ backgroundColor: 'var(--card-color)', color: 'var(--gray-900)' }}
                  placeholder="Describe what needs to be done..."
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gray-700)' }}>Target Date (Optional)</label>
                <input
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  style={{ backgroundColor: 'var(--card-color)', color: 'var(--gray-900)' }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gray-700)' }}>Priority</label>
                <select
                  value={newGoal.priority}
                  onChange={(e) => setNewGoal({...newGoal, priority: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  style={{ backgroundColor: 'var(--card-color)', color: 'var(--gray-900)' }}
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                </select>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddGoal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 active:bg-gray-500 transition-colors touch-manipulation min-h-[44px] font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={addFamilyGoal}
                  className="flex-1 bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 active:bg-teal-800 transition-colors touch-manipulation min-h-[44px] font-medium"
                >
                  Add Goal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Form Modal */}
      {showFeedback && (
        <FeedbackForm
          onClose={() => setShowFeedback(false)}
          context="family-dashboard"
        />
      )}
    </div>
  );
};

export default FamilyDashboard;

