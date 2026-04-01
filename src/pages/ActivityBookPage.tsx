import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Book,
  Palette,
  Puzzle,
  MapPin,
  Search,
  Target,
  Link as LinkIcon,
  Award,
  Users,
  Play,
  Download,
  CheckCircle,
  Star,
  Filter,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import { useProgress } from '../contexts/ProgressContext';
import ActivityManager from '../components/activities/ActivityManager';
// import CertificateGenerator from '../components/CertificateGenerator'; // Moved to Family Hub
import ProgressDisplay from '../components/ProgressDisplay';
import ParentDashboard from '../components/ParentDashboard';
import PageLayout from '../components/layout/PageLayout';

interface Activity {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  ageGroup: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: string;
  completed?: boolean;
}

const ActivityBookPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { showSuccess } = useToast();
  const { progress, markActivityCompleted, getOverallProgress } = useProgress();
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showActivity, setShowActivity] = useState(false);
  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'difficulty' | 'duration'>('name');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  // const [showCertificates, setShowCertificates] = useState(false); // Moved to Family Hub
  const [showParentDashboard, setShowParentDashboard] = useState(false);

  const activities: Activity[] = [
    {
      id: 'coloring',
      title: 'Privacy Panda Coloring',
      description: 'Color Privacy Panda and learn about protecting your digital treasure! Express your creativity while learning about privacy.',
      icon: Palette,
      ageGroup: '5-8',
      difficulty: 'Easy',
      duration: '10 mins',
    },
    {
      id: 'sorting',
      title: 'Information Sorting Game',
      description: 'Sort information into "safe to share" and "keep private" categories. Learn what information to protect.',
      icon: Puzzle,
      ageGroup: '5-8',
      difficulty: 'Easy',
      duration: '8 mins',
    },
    {
      id: 'maze',
      title: 'Safe Online Journey Maze',
      description: 'Help Privacy Panda navigate through the digital world safely, avoiding privacy dangers.',
      icon: MapPin,
      ageGroup: '6-10',
      difficulty: 'Medium',
      duration: '12 mins',
    },
    {
      id: 'wordsearch',
      title: 'Privacy Word Search',
      description: 'Find important privacy words hidden in the puzzle. Learn key privacy vocabulary.',
      icon: Search,
      ageGroup: '7-12',
      difficulty: 'Medium',
      duration: '15 mins',
    },
    {
      id: 'connectdots',
      title: 'Privacy Shield Connect-the-Dots',
      description: 'Connect the dots to reveal Privacy Panda\'s protection shield, then color it in!',
      icon: Target,
      ageGroup: '5-8',
      difficulty: 'Easy',
      duration: '10 mins',
    },
    {
      id: 'matching',
      title: 'Privacy Symbol Matching',
      description: 'Match privacy symbols with their meanings. Learn to recognize important digital safety signs.',
      icon: LinkIcon,
      ageGroup: '6-10',
      difficulty: 'Medium',
      duration: '8 mins',
    },
    {
      id: 'memory',
      title: 'Privacy Memory Game',
      description: 'Test your memory by matching privacy symbols with their meanings! Challenge yourself to remember important privacy concepts.',
      icon: Award,
      ageGroup: '6-12',
      difficulty: 'Medium',
      duration: '10 mins',
    },
    {
      id: 'quiz',
      title: 'Privacy Knowledge Quiz',
      description: 'Test your knowledge about online privacy and safety! Answer questions and learn from detailed explanations.',
      icon: CheckCircle,
      ageGroup: '8-12',
      difficulty: 'Hard',
      duration: '15 mins',
    },
  ];


  const handleActivityStart = (activity: Activity) => {
    setSelectedActivity(activity);
    setShowActivity(true);
  };

  const handleActivityClose = () => {
    setShowActivity(false);
    setSelectedActivity(null);
  };

  const handleActivityComplete = (activityId: string, score?: number) => {
    markActivityCompleted(activityId, score);
    const activity = activities.find(a => a.id === activityId);
    
    // Add celebration animation
    setTimeout(() => {
      const celebration = document.createElement('div');
      celebration.textContent = '🎉✨🌟';
      celebration.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 48px;
        z-index: 10000;
        pointer-events: none;
        animation: celebrate 2s ease-out forwards;
      `;
      
      const style = document.createElement('style');
      style.textContent = `
        @keyframes celebrate {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1) translateY(-100px); }
        }
      `;
      document.head.appendChild(style);
      document.body.appendChild(celebration);
      
      setTimeout(() => {
        document.body.removeChild(celebration);
        document.head.removeChild(style);
      }, 2000);
    }, 100);
    
    const scoreMessage = score !== undefined ? ` You scored ${score}%!` : '';
    showSuccess('Activity Completed!', `Great job completing "${activity?.title}"!${scoreMessage} Keep up the great work!`);
    setShowActivity(false);
    setSelectedActivity(null);
  };

  const overallProgress = getOverallProgress();

  // Filter and sort activities
  const filteredActivities = activities
    .filter(activity => {
      const matchesFilter = filter === 'all' || activity.difficulty.toLowerCase() === filter;
      const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           activity.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'difficulty': {
          const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        }
        case 'duration': {
          return parseInt(a.duration, 10) - parseInt(b.duration, 10);
        }
        case 'name':
        default: {
          return a.title.localeCompare(b.title);
        }
      }
    });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <PageLayout
      title="Privacy Panda's Activity Adventures"
      subtitle="Continue Po the Panda's journey with interactive activities that reinforce the privacy lessons from the Digital Bamboo Forest story. Learn through fun games, coloring, and puzzles!"
      icon={Book}
      badge="INTERACTIVE ACTIVITY BOOK"
      breadcrumbs={true}
    >
      <main id="main-content" className="min-h-screen" style={{ backgroundColor: 'var(--white)', color: 'var(--gray-800)' }}>

      {/* Story Connection Section */}
      <section style={{ padding: '3rem 0' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6 md:p-8 mb-8 md:mb-12 max-w-5xl mx-auto" style={{
            backgroundColor: theme === 'dark' ? 'rgba(16, 185, 129, 0.1)' : '#F0FDF4',
            borderColor: theme === 'dark' ? 'rgba(16, 185, 129, 0.3)' : '#BBF7D0'
          }}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl md:text-4xl">🐼</span>
              </div>
              <h2 className="font-bold mb-3" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', color: theme === 'dark' ? '#4ADE80' : '#059669' }}>
                Continue Po's Journey
              </h2>
              <p className="text-base md:text-lg lg:text-xl max-w-2xl mx-auto px-4" style={{ color: theme === 'dark' ? '#4ADE80' : '#059669' }}>
                These activities extend the story of Privacy Panda. Practice the privacy concepts Po learned in the Digital Bamboo Forest through hands-on games and exercises.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
              <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
                <h3 className="font-semibold mb-2 text-base md:text-lg" style={{ color: 'var(--primary)' }}>📖 Story Connection</h3>
                <p className="text-sm md:text-base" style={{ color: 'var(--gray-600)' }}>
                  Each activity relates to a part of Po's adventure, reinforcing the privacy lessons he learned.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
                <h3 className="font-semibold mb-2 text-base md:text-lg" style={{ color: 'var(--primary)' }}>🎯 Learning Goals</h3>
                <p className="text-sm md:text-base" style={{ color: 'var(--gray-600)' }}>
                  Develop practical skills for protecting personal information and staying safe online.
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <Link
                to="/privacy-panda"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2 text-sm md:text-base"
              >
                <Book size={20} />
                <span>Read Privacy Panda's Story First</span>
              </Link>
            </div>
          </div>

          <ProgressDisplay
            completedCount={overallProgress.completedCount}
            totalCount={overallProgress.totalCount}
            achievements={progress.achievements}
            totalTimeSpent={progress.totalTimeSpent}
            averageScore={overallProgress.averageScore}
            showDetails={true}
          />

          {overallProgress.percentage === 100 && (
            <div className="text-center bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8 max-w-3xl mx-auto mt-8" style={{
              backgroundColor: theme === 'dark' ? 'rgba(251, 191, 36, 0.1)' : '#FFFBEB',
              borderColor: 'var(--warning)'
            }}>
              <Award className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--warning)' }} />
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--primary)' }}>
                Congratulations! 🎉
              </h3>
              <p style={{ color: 'var(--gray-700)' }}>
                You've completed all activities and earned your Privacy Champion certificate!
              </p>
              <button 
                onClick={() => navigate('/family-hub')}
                className="mt-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105"
              >
                <Award size={20} className="inline mr-2" />
                Generate Certificate
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Activities Grid */}
      <section style={{ padding: '0 0 4rem 0' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div className="text-center mb-6 md:mb-8 max-w-4xl mx-auto">
            <h2 className="font-bold mb-3 md:mb-4" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', color: 'var(--primary)' }}>
              Choose Your Activity
            </h2>
            <p className="text-base md:text-lg lg:text-xl max-w-2xl mx-auto mb-6 md:mb-8 px-4" style={{ color: 'var(--gray-600)' }}>
              Click on any activity to start learning about digital privacy through interactive games and exercises.
            </p>

            {/* Interactive Controls */}
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8 max-w-5xl mx-auto" style={{ backgroundColor: 'var(--card-color)' }}>
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                {/* Search */}
                <div className="flex-1 min-w-0">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search activities..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm md:text-base"
                      style={{ backgroundColor: 'var(--white)' }}
                    />
                  </div>
                </div>

                {/* Filter and Sort */}
                <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-3 md:px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm md:text-base whitespace-nowrap"
                  >
                    <Filter size={16} className="md:w-4 md:h-4" />
                    <span className="hidden sm:inline">Filter</span>
                  </button>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'name' | 'difficulty' | 'duration')}
                    className="px-3 md:px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm md:text-base"
                    style={{ backgroundColor: 'var(--white)' }}
                  >
                    <option value="name">Sort by Name</option>
                    <option value="difficulty">Sort by Difficulty</option>
                    <option value="duration">Sort by Duration</option>
                  </select>
                </div>
              </div>

              {/* Filter Options */}
              {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <button
                      onClick={() => setFilter('all')}
                      className={`px-3 md:px-4 py-2 rounded-lg transition-colors text-sm md:text-base ${
                        filter === 'all' ? 'bg-green-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      All Activities
                    </button>
                    <button
                      onClick={() => setFilter('easy')}
                      className={`px-3 md:px-4 py-2 rounded-lg transition-colors text-sm md:text-base ${
                        filter === 'easy' ? 'bg-green-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      Easy
                    </button>
                    <button
                      onClick={() => setFilter('medium')}
                      className={`px-3 md:px-4 py-2 rounded-lg transition-colors text-sm md:text-base ${
                        filter === 'medium' ? 'bg-green-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      Medium
                    </button>
                    <button
                      onClick={() => setFilter('hard')}
                      className={`px-3 md:px-4 py-2 rounded-lg transition-colors text-sm md:text-base ${
                        filter === 'hard' ? 'bg-green-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      Hard
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredActivities.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                No activities found
              </h3>
              <p style={{ color: 'var(--gray-600)' }}>
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            filteredActivities.map((activity) => {
            const Icon = activity.icon;
            const isCompleted = progress.completedActivities.includes(activity.id);

            return (
              <div
                key={activity.id}
                className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer border-2 ${
                  isCompleted ? 'border-green-500' : 'border-transparent'
                }`}
                style={{
                  backgroundColor: 'var(--card-color)',
                  boxShadow: 'var(--shadow-md)'
                }}
                onClick={() => handleActivityStart(activity)}
              >
                <div className="p-4 md:p-6 text-center">
                  <div className="flex items-center justify-center mb-4 relative">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white">
                      <Icon size={20} className="md:w-6 md:h-6" />
                    </div>
                    {isCompleted && (
                      <CheckCircle size={20} className="text-green-500 absolute -top-1 -right-1 md:w-6 md:h-6" />
                    )}
                  </div>

                  <h3 className="text-lg md:text-xl font-bold mb-3" style={{ color: 'var(--primary)' }}>
                    {activity.title}
                  </h3>

                  <p className="mb-4 leading-relaxed text-sm md:text-base" style={{ color: 'var(--gray-600)' }}>
                    {activity.description}
                  </p>

                  <div className="flex items-center justify-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(activity.difficulty)}`}>
                      {activity.difficulty}
                    </span>
                    <span className="text-sm font-medium" style={{ color: 'var(--gray-500)' }}>
                      {activity.duration}
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-3">
                    <span className="text-sm" style={{ color: 'var(--gray-500)' }}>
                      Ages {activity.ageGroup}
                    </span>
                    <button
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all text-sm md:text-base"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleActivityStart(activity);
                      }}
                    >
                      {isCompleted ? 'Play Again' : 'Start'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
          )}
          </div>
        </div>
      </section>

      {/* Interactive Activity */}
      {showActivity && selectedActivity && (
        <ActivityManager
          activityId={selectedActivity.id}
          onClose={handleActivityClose}
          onComplete={handleActivityComplete}
        />
      )}

      {/* Certificate Generator Modal */}
      {/* Certificate Generation moved to Family Hub */}

      {/* Parent Dashboard Modal */}
      {showParentDashboard && (
        <ParentDashboard
          progress={progress}
          onClose={() => setShowParentDashboard(false)}
        />
      )}

      {/* Parent Resources Section */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--light)' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-bold mb-3 md:mb-4" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'var(--primary)' }}>
              For Parents & Educators
            </h2>
            <p className="text-base md:text-lg max-w-2xl mx-auto px-4" style={{ color: 'var(--gray-600)' }}>
              Additional resources to support privacy education and continue the learning at home.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-md text-center" style={{ backgroundColor: 'var(--card-color)' }}>
              <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Download size={20} className="text-blue-600 md:w-6 md:h-6" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-3" style={{ color: 'var(--primary)' }}>
                Printable Activities
              </h3>
              <p className="mb-4 text-sm md:text-base" style={{ color: 'var(--gray-600)' }}>
                Download coloring sheets, certificates, and offline activities to continue learning away from screens.
              </p>
              <button
                onClick={() => navigate('/downloads/coloring-sheets')}
                className="text-green-600 font-semibold hover:text-green-700 transition-colors text-sm md:text-base"
              >
                Download Resources →
              </button>
            </div>

            <div className="bg-white rounded-xl p-4 md:p-6 shadow-md text-center" style={{ backgroundColor: 'var(--card-color)' }}>
              <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Users size={20} className="text-purple-600 md:w-6 md:h-6" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-3" style={{ color: 'var(--primary)' }}>
                Discussion Guides
              </h3>
              <p className="mb-4 text-sm md:text-base" style={{ color: 'var(--gray-600)' }}>
                Conversation starters and questions to discuss privacy concepts with your children after activities.
              </p>
              <Link to="/#parent-resources" className="text-green-600 font-semibold hover:text-green-700 transition-colors text-sm md:text-base">
                View Guides →
              </Link>
            </div>

            <div className="bg-white rounded-xl p-4 md:p-6 shadow-md text-center" style={{ backgroundColor: 'var(--card-color)' }}>
              <div className="w-12 h-12 md:w-14 md:h-14 bg-yellow-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Book size={20} className="text-yellow-600 md:w-6 md:h-6" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-3" style={{ color: 'var(--primary)' }}>
                Privacy Panda Story
              </h3>
              <p className="mb-4 text-sm md:text-base" style={{ color: 'var(--gray-600)' }}>
                Read the full Digital Bamboo Forest story that teaches privacy concepts through storytelling.
              </p>
              <Link to="/story" className="text-green-600 font-semibold hover:text-green-700 transition-colors text-sm md:text-base">
                Read Story →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section style={{ padding: '4rem 0', background: 'linear-gradient(to right, #16a34a, #22c55e)', color: 'white' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center' }}>
          <h2 className="font-bold mb-3 md:mb-4" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
            Continue Your Privacy Learning Journey
          </h2>
          <p className="text-lg md:text-xl mb-6 md:mb-8 opacity-90 max-w-2xl mx-auto px-4">
            Explore more age-appropriate resources and activities designed to build strong privacy habits for life.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Link
              to="/story"
              className="bg-white text-green-600 px-4 md:px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <Book size={18} className="md:w-5 md:h-5" />
              Read Privacy Panda's Story
            </Link>
            <Link to="/family-hub"
              className="bg-blue-600 text-white px-4 md:px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <Users size={18} className="md:w-5 md:h-5" />
              Join Family Hub
            </Link>
          </div>
        </div>
      </section>
      </main>
    </PageLayout>
  );
};

export default ActivityBookPage;