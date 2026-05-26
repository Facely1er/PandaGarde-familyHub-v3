import React, { useState } from 'react';
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
  Download,
  CheckCircle,
  Filter,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import PageLayout from '../components/layout/PageLayout';
import { resolveLegacyActivitiesPath } from '../lib/legacyActivitiesRedirect';
import { setHubOrigin } from '../lib/hubMission';
import {
  HUB_MISSIONS_CTA,
  HUB_MISSIONS_PATH,
  WEBSITE_HUB_BOUNDARY_LEAD,
} from '../data/websiteHubBoundary';

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
  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'difficulty' | 'duration'>('name');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

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


  const openMissionInHub = (activity: Activity) => {
    setHubOrigin('web');
    const target = resolveLegacyActivitiesPath(activity.id);
    navigate(target.path, { state: target.state });
  };

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
      subtitle="Printables and offline ideas from the Digital Bamboo Forest story. Interactive missions and saved progress live in Family Hub—not duplicated here on the website."
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
                <h3 className="font-semibold mb-2 text-base md:text-lg text-primary">📖 Story Connection</h3>
                <p className="text-sm md:text-base text-gray-600">
                  Each activity relates to a part of Po's adventure, reinforcing the privacy lessons he learned.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
                <h3 className="font-semibold mb-2 text-base md:text-lg text-primary">🎯 Learning Goals</h3>
                <p className="text-sm md:text-base text-gray-600">
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

          <div className="rounded-xl border border-teal-200 bg-teal-50/80 p-6 max-w-3xl mx-auto mt-8 dark:border-teal-800 dark:bg-teal-900/20">
            <p className="text-sm leading-relaxed text-teal-900 dark:text-teal-100 mb-4">{WEBSITE_HUB_BOUNDARY_LEAD}</p>
            <Link
              to={HUB_MISSIONS_PATH}
              onClick={() => setHubOrigin('web')}
              className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 min-h-[44px]"
            >
              {HUB_MISSIONS_CTA}
            </Link>
          </div>
        </div>
      </section>

      {/* Activities Grid */}
      <section style={{ padding: '0 0 4rem 0' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div className="text-center mb-6 md:mb-8 max-w-4xl mx-auto">
            <h2 className="font-bold mb-3 md:mb-4" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', color: 'var(--primary)' }}>
              Choose Your Activity
            </h2>
            <p className="text-base md:text-lg lg:text-xl max-w-2xl mx-auto mb-6 md:mb-8 px-4 text-gray-600">
              Each topic below opens the matching mission in Family Hub. Progress and certificates stay in the Hub on this device.
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
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm md:text-base bg-surface"
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
                    className="px-3 md:px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm md:text-base bg-surface"
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
              <h3 className="text-xl font-semibold mb-2 text-primary">
                No activities found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            filteredActivities.map((activity) => {
            const Icon = activity.icon;

            return (
              <div
                key={activity.id}
                className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer border-2 ${
                  'border-transparent'
                }`}
                style={{
                  backgroundColor: 'var(--card-color)',
                  boxShadow: 'var(--shadow-md)'
                }}
                onClick={() => openMissionInHub(activity)}
              >
                <div className="p-4 md:p-6 text-center">
                  <div className="flex items-center justify-center mb-4 relative">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white">
                      <Icon size={20} className="md:w-6 md:h-6" />
                    </div>
                  </div>

                  <h3 className="text-lg md:text-xl font-bold mb-3 text-primary">
                    {activity.title}
                  </h3>

                  <p className="mb-4 leading-relaxed text-sm md:text-base text-gray-600">
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
                        openMissionInHub(activity);
                      }}
                    >
                      {HUB_MISSIONS_CTA}
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

      {/* Parent Resources Section */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--light)' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-bold mb-3 md:mb-4" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'var(--primary)' }}>
              For Parents & Educators
            </h2>
            <p className="text-base md:text-lg max-w-2xl mx-auto px-4 text-gray-600">
              Additional resources to support privacy education and continue the learning at home.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-md text-center" style={{ backgroundColor: 'var(--card-color)' }}>
              <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Download size={20} className="text-blue-600 md:w-6 md:h-6" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-3 text-primary">
                Printable Activities
              </h3>
              <p className="mb-4 text-sm md:text-base text-gray-600">
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
              <h3 className="text-lg md:text-xl font-bold mb-3 text-primary">
                Discussion Guides
              </h3>
              <p className="mb-4 text-sm md:text-base text-gray-600">
                Conversation starters and questions to discuss privacy concepts with your children after activities.
              </p>
              <Link to="/for-families" className="text-green-600 font-semibold hover:text-green-700 transition-colors text-sm md:text-base">
                View Guides →
              </Link>
            </div>

            <div className="bg-white rounded-xl p-4 md:p-6 shadow-md text-center" style={{ backgroundColor: 'var(--card-color)' }}>
              <div className="w-12 h-12 md:w-14 md:h-14 bg-yellow-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Book size={20} className="text-yellow-600 md:w-6 md:h-6" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-3 text-primary">
                Privacy Panda Story
              </h3>
              <p className="mb-4 text-sm md:text-base text-gray-600">
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
              Open Family Hub
            </Link>
          </div>
        </div>
      </section>
      </main>
    </PageLayout>
  );
};

export default ActivityBookPage;