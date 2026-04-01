import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, BookOpen, Book, Settings, Award, TrendingUp, Clock, CheckCircle, ArrowLeft, ArrowRight, User, Shield as Child, UserCheck, Star, Play, Download, Plus, UserPlus, LogOut, Globe, Shield, Target, UserCircle } from 'lucide-react';
import Logo from '../components/Logo';
import { useAuth } from './family-hub/AuthWrapper';
import { useFamily } from '../contexts/FamilyContext';
import { useProgress } from '../contexts/ProgressContext';
import DigitalFootprintVisualizer from '../components/DigitalFootprintVisualizer';
import FamilyPrivacyAssessment from '../components/FamilyPrivacyAssessment';
import PrivacyGoals from '../components/PrivacyGoals';
import AdaptiveResources from '../components/AdaptiveResources';
import EmailCaptureInline from '../components/EmailCaptureInline';
import { FamilyPersonaProfiles } from '../data/familyPersonaProfiles';


interface Activity {
  id: string;
  title: string;
  type: 'story' | 'activity' | 'game' | 'assessment';
  ageGroups: string[];
  duration: string;
  completed: boolean;
  icon: React.ComponentType<any>;
}

const FamilyHubPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'activities' | 'progress' | 'resources' | 'family'>('dashboard');
  const [showCreateFamily, setShowCreateFamily] = useState(false);
  const [showJoinFamily, setShowJoinFamily] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newFamilyName, setNewFamilyName] = useState('');
  const [joinFamilyId, setJoinFamilyId] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberFirstName, setNewMemberFirstName] = useState('');
  const [newMemberLastName, setNewMemberLastName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'parent' | 'child'>('child');

  const { isAuthenticated } = useAuth();
  const { 
    currentFamily, 
    familyMembers, 
    loading, 
    createFamily, 
    joinFamily, 
    leaveFamily, 
    addFamilyMember 
  } = useFamily();
  const { getOverallProgress } = useProgress();
  const [familyPersona, setFamilyPersona] = useState<string | null>(null);

  // Load family persona from localStorage
  useEffect(() => {
    const storedPersona = localStorage.getItem('pandagarde_family_persona');
    if (storedPersona) {
      try {
        const personaData = JSON.parse(storedPersona);
        setFamilyPersona(personaData.primary || null);
      } catch (e) {
        console.error('Error parsing persona data:', e);
      }
    }
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/family-hub/login');
    }
  }, [isAuthenticated, navigate]);

  const recentActivities: Activity[] = [
    {
      id: '1',
      title: 'Privacy Panda Story',
      type: 'story',
      ageGroups: ['5-8', '9-12'],
      duration: '10 min',
      completed: true,
      icon: Book
    },
    {
      id: '2',
      title: 'Password Safety Game',
      type: 'activity',
      ageGroups: ['5-8'],
      duration: '15 min',
      completed: false,
      icon: Play
    },
    {
      id: '3',
      title: 'Social Media Privacy',
      type: 'activity',
      ageGroups: ['13-17'],
      duration: '20 min',
      completed: false,
      icon: Users
    }
  ];

  const quickActions = [
    {
      title: 'Start Learning Path',
      description: 'Begin age-appropriate privacy education',
      icon: Play,
      action: 'start-path',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'View Progress Report',
      description: 'See detailed progress for all family members',
      icon: TrendingUp,
      action: 'view-progress',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Generate Certificates',
      description: 'Create achievement certificates and badges',
      icon: Award,
      action: 'certificates',
      color: 'from-purple-500 to-purple-600',
      url: '/family-hub/certificates'
    },
    {
      title: 'PrivacyPanda App',
      description: 'Access the full PrivacyPanda mobile application',
      icon: Star,
      action: 'app-link',
      color: 'from-orange-500 to-orange-600',
      url: '/family-hub'
    },
    {
      title: 'Digital Footprint',
      description: 'Analyze your family\'s online presence and privacy exposure',
      icon: Globe,
      action: 'footprint',
      color: 'from-indigo-500 to-indigo-600',
      url: '/digital-footprint'
    },
    {
      title: 'Privacy Assessment',
      description: 'Evaluate your family\'s privacy practices and get recommendations',
      icon: Shield,
      action: 'assessment',
      color: 'from-blue-500 to-blue-600',
      url: '/privacy-assessment'
    },
    {
      title: 'Privacy Goals',
      description: 'Set and track privacy improvement goals for your family',
      icon: Target,
      action: 'goals',
      color: 'from-purple-500 to-purple-600',
      url: '/privacy-goals'
    }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getAgeGroupIcon = (ageGroup: string) => {
    switch (ageGroup) {
      case '5-8': return Child;
      case '9-12': return User; 
      case '13-17': return UserCheck;
      default: return User;
    }
  };

  const handleCreateFamily = async () => {
    if (!newFamilyName.trim()) {return;}
    
    const { error } = await createFamily(newFamilyName);
    if (error) {
      alert(`Error creating family: ${error}`);
    } else {
      setShowCreateFamily(false);
      setNewFamilyName('');
    }
  };

  const handleJoinFamily = async () => {
    if (!joinFamilyId.trim()) {return;}
    
    const { error } = await joinFamily(joinFamilyId);
    if (error) {
      alert(`Error joining family: ${error}`);
    } else {
      setShowJoinFamily(false);
      setJoinFamilyId('');
    }
  };

  const handleAddMember = async () => {
    if (!newMemberEmail.trim() || !newMemberFirstName.trim() || !newMemberLastName.trim()) {return;}
    
    const { error } = await addFamilyMember(
      newMemberEmail,
      newMemberRole,
      newMemberFirstName,
      newMemberLastName
    );
    
    if (error) {
      alert(`Error adding family member: ${error}`);
    } else {
      setShowAddMember(false);
      setNewMemberEmail('');
      setNewMemberFirstName('');
      setNewMemberLastName('');
      setNewMemberRole('child');
    }
  };

  const handleLeaveFamily = async () => {
    if (window.confirm('Are you sure you want to leave this family? This action cannot be undone.')) {
      const { error } = await leaveFamily();
      if (error) {
        alert(`Error leaving family: ${error}`);
      }
    }
  };

  const getOverallProgressPercentage = () => {
    const overall = getOverallProgress();
    return overall.percentage;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--light)', color: 'var(--gray-800)' }}>
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 via-green-500 to-green-600 text-white py-12 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><pattern id='grain' width='100' height='100' patternUnits='userSpaceOnUse'><circle cx='20' cy='20' r='1' fill='rgba(255,255,255,0.1)'/><circle cx='80' cy='40' r='1' fill='rgba(255,255,255,0.05)'/><circle cx='40' cy='80' r='1' fill='rgba(255,255,255,0.1)'/></pattern></defs><rect width='100%' height='100%' fill='url(%23grain)'/></svg>")`
          }} />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex items-center justify-center mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20">
              <Logo />
            </div>
          </div>
          
          <div className="text-center">
            <h1 className="font-bold mb-4 sm:mb-6 leading-tight" style={{ fontSize: 'clamp(1.875rem, 5vw, 3rem)' }}>
              PandaGarde
              <span className="block text-yellow-300 mt-1">Family Hub</span>
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl opacity-90 max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
              Your central dashboard for family privacy education, progress tracking, and personalized learning paths.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm px-4">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Users size={14} className="sm:w-4 sm:h-4" />
                <span className="font-medium">{familyMembers.length} Family {familyMembers.length === 1 ? 'Member' : 'Members'}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Award size={14} className="sm:w-4 sm:h-4" />
                <span className="font-medium">{getOverallProgressPercentage()}% Progress</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Clock size={14} className="sm:w-4 sm:h-4" />
                <span className="font-medium">Active Learning</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-3 md:py-4 gap-3 md:gap-0">
            <div className="flex items-center gap-2 sm:gap-4 w-full md:w-auto justify-between md:justify-start">
              <Link 
                to="/"
                className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors text-sm sm:text-base"
                style={{ color: 'var(--primary-light)' }}
              >
                <ArrowLeft size={16} />
                <span className="hidden sm:inline">Back to Main Site</span>
                <span className="sm:hidden">Back</span>
              </Link>
              
              <Link
                to="/family-hub/profile"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors text-sm sm:text-base"
              >
                <User size={16} />
                <span className="hidden sm:inline">Profile</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2 lg:gap-4">
              {[
                { key: 'dashboard', label: 'Dashboard', icon: Users },
                { key: 'activities', label: 'Activities', icon: BookOpen },
                { key: 'progress', label: 'Progress', icon: TrendingUp },
                { key: 'family', label: 'Family', icon: UserPlus },
                { key: 'resources', label: 'Resources', icon: Download }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as 'dashboard' | 'activities' | 'progress' | 'family' | 'resources')}
                  className={`flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-2 rounded-lg font-medium transition-all text-sm lg:text-base ${
                    activeTab === key 
                      ? 'bg-green-100 text-green-700' 
                      : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
                  }`}
                  style={{
                    backgroundColor: activeTab === key ? 'var(--secondary)' : undefined,
                    color: activeTab === key ? 'var(--primary)' : undefined
                  }}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </button>
              ))}
            </nav>

            {/* Mobile Navigation - Improved Dropdown Style */}
            <nav className="md:hidden w-full">
              <div className="grid grid-cols-5 gap-1">
                {[
                  { key: 'dashboard', icon: Users, shortLabel: 'Home' },
                  { key: 'activities', icon: BookOpen, shortLabel: 'Learn' },
                  { key: 'progress', icon: TrendingUp, shortLabel: 'Progress' },
                  { key: 'family', icon: UserPlus, shortLabel: 'Family' },
                  { key: 'resources', icon: Download, shortLabel: 'Resources' }
                ].map(({ key, icon: Icon, shortLabel }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key as 'dashboard' | 'activities' | 'progress' | 'family' | 'resources')}
                    className={`flex flex-col items-center justify-center gap-1 px-2 py-3 rounded-lg font-medium transition-all touch-manipulation ${
                      activeTab === key 
                        ? 'bg-green-100 text-green-700 shadow-sm' 
                        : 'text-gray-600 bg-gray-50 active:bg-gray-100'
                    }`}
                    style={{
                      backgroundColor: activeTab === key ? 'var(--secondary)' : undefined,
                      color: activeTab === key ? 'var(--primary)' : undefined,
                      minHeight: '64px',
                      minWidth: '64px',
                      WebkitTapHighlightColor: 'transparent'
                    }}
                  >
                    <Icon size={20} />
                    <span className="text-xs font-semibold leading-tight text-center">{shortLabel}</span>
                  </button>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-12">
        
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-12">
            
            {/* Family Members Overview */}
            <section>
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <h2 className="font-bold" style={{ fontSize: 'clamp(1.5rem, 4vw, 1.875rem)', color: 'var(--primary)' }}>
                  Family Progress Overview
                </h2>
                {currentFamily && (
                  <button
                    onClick={() => setShowAddMember(true)}
                    className="hidden sm:inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                  >
                    <Plus size={16} />
                    Add Member
                  </button>
                )}
              </div>
              
              {!currentFamily ? (
                <div className="text-center py-12 sm:py-16 bg-white rounded-xl border-2 border-dashed border-gray-300" style={{ backgroundColor: 'var(--card-color)' }}>
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users size={32} className="sm:w-10 sm:h-10 text-gray-400" />
                  </div>
                  <h3 className="font-bold mb-3" style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', color: 'var(--primary)' }}>
                    No Family Yet
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto px-4">
                    Create a family or join an existing one to start tracking progress together.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                    <button
                      onClick={() => setShowCreateFamily(true)}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-sm hover:shadow-md active:scale-[0.98]"
                    >
                      Create Family
                    </button>
                    <button
                      onClick={() => setShowJoinFamily(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-sm hover:shadow-md active:scale-[0.98]"
                    >
                      Join Family
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {familyMembers.map((member) => {
                    const AgeIcon = getAgeGroupIcon(member.profile_data?.age ? 
                      member.profile_data.age <= 8 ? '5-8' : 
                      member.profile_data.age <= 12 ? '9-12' : '13-17' : '5-8');
                    return (
                      <div 
                        key={member.id}
                        className="bg-white rounded-xl p-5 sm:p-6 shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-green-200"
                        style={{ 
                          backgroundColor: 'var(--card-color)',
                          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                        }}
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-sm">
                            {member.first_name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-base sm:text-lg sm:truncate break-words" style={{ color: 'var(--primary)' }}>
                              {member.first_name} {member.last_name}
                            </h3>
                            <div className="flex items-center gap-1.5 text-xs sm:text-sm" style={{ color: 'var(--gray-500)' }}>
                              <AgeIcon size={14} />
                              <span className="font-medium">{member.role === 'parent' ? 'Parent' : 'Child'}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-xs sm:text-sm pt-4 border-t border-gray-100" style={{ borderColor: 'var(--light)' }}>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">Email</span>
                            <span className="font-medium sm:truncate break-words ml-2" style={{ color: 'var(--gray-700)' }}>{member.email}</span>
                          </div>
                          {member.profile_data?.age && (
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500">Age</span>
                              <span className="font-medium" style={{ color: 'var(--gray-700)' }}>{member.profile_data.age} years</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Add Member Card */}
                  <button
                    onClick={() => setShowAddMember(true)}
                    className="bg-white rounded-xl p-5 sm:p-6 border-2 border-dashed border-gray-300 hover:border-green-400 hover:bg-green-50 transition-all flex flex-col items-center justify-center min-h-[160px] text-center group sm:hidden"
                    style={{ backgroundColor: 'var(--card-color)' }}
                  >
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3 group-hover:bg-green-200 transition-colors">
                      <Plus size={24} className="text-green-600" />
                    </div>
                    <span className="font-semibold text-sm" style={{ color: 'var(--primary)' }}>Add Family Member</span>
                  </button>
                </div>
              )}
            </section>

            {/* Digital Footprint Widget */}
            <section>
              <div className="bg-white rounded-xl p-6 border-2 border-indigo-200 dark:border-indigo-800" style={{ backgroundColor: 'var(--card-color)' }}>
                <DigitalFootprintVisualizer compact={true} />
              </div>
            </section>

            {/* Privacy Assessment Widget */}
            <section>
              <div className="bg-white rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800" style={{ backgroundColor: 'var(--card-color)' }}>
                <FamilyPrivacyAssessment compact={true} />
              </div>
            </section>

            {/* Privacy Goals Widget */}
            <section>
              <div className="bg-white rounded-xl p-6 border-2 border-purple-200 dark:border-purple-800" style={{ backgroundColor: 'var(--card-color)' }}>
                <PrivacyGoals compact={true} />
              </div>
            </section>

            {/* Recommended Resources (Compact) */}
            {familyPersona && (
              <section>
                <div className="bg-white rounded-xl p-6 border-2 border-green-200 dark:border-green-800" style={{ backgroundColor: 'var(--card-color)' }}>
                  <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
                    Recommended for You
                  </h3>
                  <AdaptiveResources 
                    personaId={familyPersona}
                    {...(FamilyPersonaProfiles[familyPersona]?.dashboardPriorities && {
                      priorities: FamilyPersonaProfiles[familyPersona].dashboardPriorities
                    })}
                    compact={true}
                  />
                </div>
              </section>
            )}

            {/* Quick Actions */}
            <section>
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <h2 className="font-bold" style={{ fontSize: 'clamp(1.5rem, 4vw, 1.875rem)', color: 'var(--primary)' }}>
                  Quick Actions
                </h2>
                <span className="text-sm text-gray-500 hidden sm:inline">Tap any card to get started</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {quickActions.map((action, index) => {
                  const IconComponent = action.icon;
                  
                  if (action.url) {
                    // Check if it's an internal route (starts with /) or external
                    if (action.url.startsWith('/')) {
                      return (
                        <Link
                          key={index}
                          to={action.url}
                          className="group bg-white rounded-xl p-5 sm:p-6 text-left hover:shadow-xl transition-all block touch-manipulation border-2 border-transparent hover:border-green-200 active:scale-[0.98]"
                          style={{ 
                            backgroundColor: 'var(--card-color)', 
                            minHeight: '140px',
                            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                          }}
                        >
                          <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                            <IconComponent size={24} className="sm:w-7 sm:h-7" />
                          </div>
                          <h3 className="font-bold mb-2 text-base sm:text-lg leading-tight" style={{ color: 'var(--primary)' }}>
                            {action.title}
                          </h3>
                          <p className="text-xs sm:text-sm leading-relaxed mb-3" style={{ color: 'var(--gray-600)' }}>
                            {action.description}
                          </p>
                          <div className="flex items-center text-green-600 text-xs sm:text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            Get started <ArrowRight size={14} className="ml-1" />
                          </div>
                        </Link>
                      );
                    }
                    return (
                      <a
                        key={index}
                        href={action.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-white rounded-xl p-5 sm:p-6 text-left hover:shadow-xl transition-all block touch-manipulation border-2 border-transparent hover:border-green-200 active:scale-[0.98]"
                        style={{ 
                          backgroundColor: 'var(--card-color)', 
                          minHeight: '140px',
                          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                        }}
                      >
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                          <IconComponent size={24} className="sm:w-7 sm:h-7" />
                        </div>
                        <h3 className="font-bold mb-2 text-base sm:text-lg leading-tight" style={{ color: 'var(--primary)' }}>
                          {action.title}
                        </h3>
                        <p className="text-xs sm:text-sm leading-relaxed mb-3" style={{ color: 'var(--gray-600)' }}>
                          {action.description}
                        </p>
                        <div className="flex items-center text-green-600 text-xs sm:text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          Open <ArrowRight size={14} className="ml-1" />
                        </div>
                      </a>
                    );
                  }
                  
                  return (
                    <button
                      key={index}
                      className="group bg-white rounded-xl p-5 sm:p-6 text-left hover:shadow-xl transition-all touch-manipulation w-full border-2 border-transparent hover:border-green-200 active:scale-[0.98]"
                      style={{ 
                        backgroundColor: 'var(--card-color)', 
                        minHeight: '140px',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                      }}
                    >
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                        <IconComponent size={24} className="sm:w-7 sm:h-7" />
                      </div>
                      <h3 className="font-bold mb-2 text-base sm:text-lg leading-tight" style={{ color: 'var(--primary)' }}>
                        {action.title}
                      </h3>
                      <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--gray-600)' }}>
                        {action.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Recent Activities */}
            <section>
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <h2 className="font-bold" style={{ fontSize: 'clamp(1.5rem, 4vw, 1.875rem)', color: 'var(--primary)' }}>
                  Continue Learning
                </h2>
                <Link 
                  to="/activities" 
                  className="text-sm text-green-600 hover:text-green-700 font-medium hidden sm:inline-flex items-center gap-1"
                >
                  View all <ArrowRight size={14} />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {recentActivities.map((activity) => {
                  const IconComponent = activity.icon;
                  return (
                    <div 
                      key={activity.id}
                      className="group bg-white rounded-xl p-6 hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-green-200 active:scale-[0.98]"
                      style={{ 
                        backgroundColor: 'var(--card-color)',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                      }}
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                          <IconComponent size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold mb-2 leading-tight" style={{ color: 'var(--primary)' }}>
                            {activity.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm mb-2" style={{ color: 'var(--gray-500)' }}>
                            <Clock size={14} />
                            <span>{activity.duration}</span>
                            {activity.completed && (
                              <span className="flex items-center gap-1 text-green-600">
                                <CheckCircle size={14} />
                                <span className="text-xs font-medium">Completed</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-4 flex-wrap">
                        {activity.ageGroups.map((group) => (
                          <span 
                            key={group}
                            className="px-2.5 py-1 bg-gray-100 rounded-md text-xs font-medium"
                            style={{ backgroundColor: 'var(--light)', color: 'var(--gray-600)' }}
                          >
                            Ages {group}
                          </span>
                        ))}
                      </div>
                      
                      <button className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-sm hover:shadow-md active:scale-[0.98]">
                        {activity.completed ? 'Review Activity' : 'Start Activity'}
                      </button>
                    </div>
                  );
                })}
              </div>
              
              {/* Mobile View All Link */}
              <div className="mt-4 sm:hidden text-center">
                <Link 
                  to="/activities" 
                  className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium text-sm"
                >
                  View all activities <ArrowRight size={14} />
                </Link>
              </div>
            </section>
          </div>
        )}

        {/* Activities Tab */}
        {activeTab === 'activities' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="font-bold mb-4" style={{ fontSize: 'clamp(1.875rem, 3vw, 2.25rem)', color: 'var(--primary)' }}>
                Learning Activities
              </h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--gray-600)' }}>
                Explore our comprehensive library of age-appropriate privacy education activities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Link to="/activity-book" className="block">
                <div className="bg-white rounded-xl p-8 text-center hover:shadow-lg transition-all"
                     style={{ backgroundColor: 'var(--card-color)' }}>
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white mx-auto mb-6">
                    <BookOpen size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--primary)' }}>
                    Interactive Activity Book
                  </h3>
                  <p className="mb-4" style={{ color: 'var(--gray-600)' }}>
                    6 interactive activities teaching privacy fundamentals
                  </p>
                  <div className="text-green-600 font-semibold">
                    Start Activities →
                  </div>
                </div>
              </Link>

              <Link to="/story" className="block">
                <div className="bg-white rounded-xl p-8 text-center hover:shadow-lg transition-all"
                     style={{ backgroundColor: 'var(--card-color)' }}>
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white mx-auto mb-6">
                    <Book size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--primary)' }}>
                    Digital Bamboo Forest Story
                  </h3>
                  <p className="mb-4" style={{ color: 'var(--gray-600)' }}>
                    Follow Privacy Panda's adventure learning about digital safety
                  </p>
                  <div className="text-blue-600 font-semibold">
                    Read Story →
                  </div>
                </div>
              </Link>

              <Link to="/privacy-tools" className="block">
                <div className="bg-white rounded-xl p-8 text-center hover:shadow-lg transition-all"
                     style={{ backgroundColor: 'var(--card-color)' }}>
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white mx-auto mb-6">
                    <Award size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--primary)' }}>
                    Privacy Tools & Challenges
                  </h3>
                  <p className="mb-4" style={{ color: 'var(--gray-600)' }}>
                    Advanced privacy tools and challenges for older children
                  </p>
                  <div className="text-purple-600 font-semibold">
                    Explore Tools →
                  </div>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="font-bold mb-4" style={{ fontSize: 'clamp(1.875rem, 3vw, 2.25rem)', color: 'var(--primary)' }}>
                Family Progress Tracking
              </h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--gray-600)' }}>
                Monitor learning progress and achievements across all family members.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8" style={{ backgroundColor: 'var(--card-color)' }}>
              <div className="text-center mb-8">
                <h3 className="font-bold mb-4" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'var(--primary)' }}>
                  Overall Family Progress
                </h3>
                <div className="w-32 h-32 mx-auto relative">
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="font-bold" style={{ fontSize: 'clamp(1.875rem, 3vw, 2.25rem)', color: 'var(--primary)' }}>
                        {getOverallProgressPercentage()}%
                      </div>
                      <div className="text-sm" style={{ color: 'var(--gray-600)' }}>
                        Complete
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {familyMembers.map((member) => {
                  const memberName = `${member.first_name} ${member.last_name}`.trim();
                  const progress = (member as any).progress || 0;
                  const completedActivities = (member as any).completedActivities || 0;
                  const totalActivities = (member as any).totalActivities || 0;
                  
                  return (
                    <div key={member.id} className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white">
                        {member.avatar ? (
                          <span className="text-2xl">{member.avatar}</span>
                        ) : (
                          <UserCircle size={32} className="text-white" />
                        )}
                      </div>
                      <h4 className="font-bold mb-2" style={{ color: 'var(--primary)' }}>
                        {memberName || 'Family Member'}
                      </h4>
                      <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="text-sm font-medium" style={{ color: 'var(--gray-600)' }}>
                        {completedActivities}/{totalActivities} activities
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Family Tab */}
        {activeTab === 'family' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="font-bold mb-4" style={{ fontSize: 'clamp(1.875rem, 3vw, 2.25rem)', color: 'var(--primary)' }}>
                Family Management
              </h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--gray-600)' }}>
                Manage your family members and settings.
              </p>
            </div>

            {!currentFamily ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
                  No Family Yet
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Create a family or join an existing one to start managing family members.
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => setShowCreateFamily(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Create Family
                  </button>
                  <button
                    onClick={() => setShowJoinFamily(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Join Family
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Family Info */}
                <div className="bg-white rounded-xl p-6" style={{ backgroundColor: 'var(--card-color)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold" style={{ color: 'var(--primary)' }}>
                      {currentFamily.name}
                    </h3>
                    <button
                      onClick={handleLeaveFamily}
                      className="text-red-600 hover:text-red-700 flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Leave Family
                    </button>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Family ID: {currentFamily.id}
                  </p>
                  <p className="text-sm text-gray-500">
                    Created on {new Date(currentFamily.created_at).toLocaleDateString()}
                  </p>
                </div>

                {/* Family Members */}
                <div className="bg-white rounded-xl p-6" style={{ backgroundColor: 'var(--card-color)' }}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold" style={{ color: 'var(--primary)' }}>
                      Family Members ({familyMembers.length})
                    </h3>
                    <button
                      onClick={() => setShowAddMember(true)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Add Member
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {familyMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white font-bold">
                            {member.first_name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-medium" style={{ color: 'var(--primary)' }}>
                              {member.first_name} {member.last_name}
                            </h4>
                            <p className="text-sm text-gray-600">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            member.role === 'parent' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {member.role === 'parent' ? 'Parent' : 'Child'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
                Personalized Resources
              </h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--gray-600)' }}>
                {familyPersona 
                  ? `Resources tailored for ${FamilyPersonaProfiles[familyPersona]?.name || 'your family'}`
                  : 'Resources tailored to your family\'s privacy needs'}
              </p>
            </div>
            
            {/* Adaptive Resources Component */}
            <AdaptiveResources 
              {...(familyPersona && { personaId: familyPersona })}
              compact={false}
            />
            
            {/* Email Capture for Updates */}
            <div className="mt-8">
              <EmailCaptureInline
                title="Stay Updated on Child Safety"
                description="Get notified about important child safety alerts, privacy updates, and new educational resources."
                purpose="safety-alerts"
                compact={false}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Link 
                to="/family-hub"
                className="bg-white rounded-xl p-6 hover:shadow-lg transition-all block"
                style={{ backgroundColor: 'var(--card-color)' }}
              >
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Star size={24} className="text-orange-600" />
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--primary)' }}>
                  PrivacyPanda Mobile App
                </h3>
                <p className="mb-4" style={{ color: 'var(--gray-600)' }}>
                  Access the full PrivacyPanda mobile application with advanced features and offline capabilities.
                </p>
                <div className="text-orange-600 font-semibold hover:text-orange-700 transition-colors">
                  Launch App →
                </div>
              </Link>

              <div className="bg-white rounded-xl p-6" style={{ backgroundColor: 'var(--card-color)' }}>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Download size={24} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--primary)' }}>
                  Printable Activities
                </h3>
                <p className="mb-4" style={{ color: 'var(--gray-600)' }}>
                  Coloring sheets, certificates, and offline activities for screen-free learning.
                </p>
                <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                  Download Resources →
                </button>
              </div>

              <div className="bg-white rounded-xl p-6" style={{ backgroundColor: 'var(--card-color)' }}>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Users size={24} className="text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--primary)' }}>
                  Discussion Guides
                </h3>
                <p className="mb-4" style={{ color: 'var(--gray-600)' }}>
                  Conversation starters and questions for family privacy discussions.
                </p>
                <Link to="/#parent-resources" className="text-purple-600 font-semibold hover:text-purple-700 transition-colors">
                  View Guides →
                </Link>
              </div>

              <div className="bg-white rounded-xl p-6" style={{ backgroundColor: 'var(--card-color)' }}>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Settings size={24} className="text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--primary)' }}>
                  Privacy Tools
                </h3>
                <p className="mb-4" style={{ color: 'var(--gray-600)' }}>
                  Practical tools and settings guides for family devices and apps.
                </p>
                <button className="text-green-600 font-semibold hover:text-green-700 transition-colors">
                  Access Tools →
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Create Family Modal */}
      {showCreateFamily && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowCreateFamily(false)} />
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
                Create New Family
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Family Name</label>
                  <input
                    type="text"
                    value={newFamilyName}
                    onChange={(e) => setNewFamilyName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter family name"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleCreateFamily}
                    disabled={!newFamilyName.trim() || loading}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    {loading ? 'Creating...' : 'Create Family'}
                  </button>
                  <button
                    onClick={() => setShowCreateFamily(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Join Family Modal */}
      {showJoinFamily && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowJoinFamily(false)} />
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
                Join Existing Family
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Family ID</label>
                  <input
                    type="text"
                    value={joinFamilyId}
                    onChange={(e) => setJoinFamilyId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter family ID"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleJoinFamily}
                    disabled={!joinFamilyId.trim() || loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    {loading ? 'Joining...' : 'Join Family'}
                  </button>
                  <button
                    onClick={() => setShowJoinFamily(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowAddMember(false)} />
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
                Add Family Member
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <input
                      type="text"
                      value={newMemberFirstName}
                      onChange={(e) => setNewMemberFirstName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <input
                      type="text"
                      value={newMemberLastName}
                      onChange={(e) => setNewMemberLastName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Last name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Role</label>
                  <select
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value as 'parent' | 'child')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="child">Child</option>
                    <option value="parent">Parent</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleAddMember}
                    disabled={!newMemberEmail.trim() || !newMemberFirstName.trim() || !newMemberLastName.trim() || loading}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    {loading ? 'Adding...' : 'Add Member'}
                  </button>
                  <button
                    onClick={() => setShowAddMember(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyHubPage;