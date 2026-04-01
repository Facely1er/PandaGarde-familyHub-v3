import React from 'react';
import { Book, Play, Heart, Star, Users, Sparkles, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import InteractiveStoryPlayer from '../components/story/InteractiveStoryPlayer';
import { storyScenes } from '../data/storyScenes';
import PageLayout from '../components/layout/PageLayout';

const StoryPage: React.FC = () => {
  const { theme } = useTheme();

  return (
    <PageLayout
      title="Privacy Panda and the Digital Bamboo Forest"
      subtitle="Join Po the Panda on an adventure through the Digital Bamboo Forest as he learns about privacy, sharing, and staying safe online."
      icon={Book}
      badge="DIGITAL PRIVACY STORY"
      breadcrumbs={true}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Story Introduction */}
        <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-8 rounded-r-lg"
             style={{
               backgroundColor: 'var(--light)',
               borderLeftColor: 'var(--primary-light)'
             }}>
          <h2 className="text-2xl font-bold text-green-800 mb-3" style={{ color: 'var(--primary)' }}>
            About This Story
          </h2>
          <p className="text-gray-700 leading-relaxed" style={{ color: 'var(--gray-600)' }}>
            This story teaches children about digital privacy through the adventures of Po the Panda.
            It covers important concepts like protecting personal information, understanding privacy settings,
            and being careful about what we share online. Perfect for reading together with children ages 5-12.
          </p>
        </div>

        {/* Interactive Story Player with Full Text View */}
        <div className="mb-8">
          <InteractiveStoryPlayer
            scenes={storyScenes}
            initialViewMode="fulltext"
            hideControls={false}
          />
        </div>

          {/* Discussion Questions */}
          <div className="mt-16 bg-gray-50 rounded-lg p-8" style={{ backgroundColor: 'var(--light)' }}>
            <h2 className="text-3xl font-bold mb-6 text-green-800" style={{ color: 'var(--primary)' }}>
              Discussion Questions
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 mt-1"
                      style={{ backgroundColor: 'var(--primary-light)' }}>1</span>
                <p className="text-gray-700" style={{ color: 'var(--gray-700)' }}>
                  What happened when Po accidentally shared all his information? How do you think he felt?
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 mt-1"
                      style={{ backgroundColor: 'var(--primary-light)' }}>2</span>
                <p className="text-gray-700" style={{ color: 'var(--gray-700)' }}>
                  What are some examples of personal information that should be kept private?
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 mt-1"
                      style={{ backgroundColor: 'var(--primary-light)' }}>3</span>
                <p className="text-gray-700" style={{ color: 'var(--gray-700)' }}>
                  How did Privacy Panda help other animals in the forest? What made him a good teacher?
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 mt-1"
                      style={{ backgroundColor: 'var(--primary-light)' }}>4</span>
                <p className="text-gray-700" style={{ color: 'var(--gray-700)' }}>
                  What can you do to create your own "Privacy Shield" when using devices or apps?
                </p>
              </div>
            </div>
          </div>

          {/* Family Hub Integration */}
          <div className="mt-16 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-8" style={{
            backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : '#F0F9FF',
            borderColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.3)' : '#BFDBFE'
          }}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: theme === 'dark' ? '#93C5FD' : '#1E40AF' }}>
                Join Our Family Hub Community
              </h3>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: theme === 'dark' ? '#93C5FD' : '#1E40AF' }}>
                Connect with other families learning about digital privacy together. Share experiences, track progress, and access exclusive resources.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <Heart size={24} className="text-red-500 mx-auto mb-2" />
                <h4 className="font-semibold mb-2">Community Support</h4>
                <p className="text-sm text-gray-600">Connect with other families on the same journey</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <Sparkles size={24} className="text-purple-500 mx-auto mb-2" />
                <h4 className="font-semibold mb-2">Exclusive Resources</h4>
                <p className="text-sm text-gray-600">Access special content and activities</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <Star size={24} className="text-yellow-500 mx-auto mb-2" />
                <h4 className="font-semibold mb-2">Progress Tracking</h4>
                <p className="text-sm text-gray-600">Monitor your family's learning journey</p>
              </div>
            </div>
            
            <div className="text-center">
              <Link to="/family-hub"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
              >
                <Users size={20} />
                Join Family Hub
              </Link>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Continue Learning with Privacy Panda!</h2>
              <p className="text-lg mb-6 opacity-90">
                Explore more activities, games, and resources to help children learn about digital privacy and online safety.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  to="/activity-book"
                  className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
                >
                  <Book size={20} />
                  Activity Book
                </Link>
                <Link
                  to="/privacy-panda"
                  className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors inline-flex items-center gap-2"
                >
                  <Play size={20} />
                  Interactive Story
                </Link>
                <Link
                  to="/classroom-activities"
                  className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
                >
                  <GraduationCap size={20} />
                  Classroom Activities
                </Link>
              </div>
            </div>
          </div>
      </div>
    </PageLayout>
  );
};

export default StoryPage;