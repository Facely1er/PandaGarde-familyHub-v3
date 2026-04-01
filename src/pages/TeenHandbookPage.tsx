import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Shield, Lock, CheckCircle, Star, Trophy, Clock, BookOpen, Users, Globe, Settings } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

interface Chapter {
  id: string;
  title: string;
  description: string;
  category: 'social-media' | 'privacy' | 'security' | 'reputation' | 'rights' | 'tools';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  completed: boolean;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  topics: string[];
  practicalTips: string[];
}

const TeenHandbookPage: React.FC = () => {
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [showChapter, setShowChapter] = useState(false);
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const chapters: Chapter[] = [
    {
      id: 'social-media-privacy',
      title: 'Social Media Privacy Mastery',
      description: 'Comprehensive guide to protecting your privacy on all major social media platforms.',
      category: 'social-media',
      difficulty: 'Intermediate',
      duration: '30 mins',
      completed: false,
      icon: Users,
      topics: [
        'Facebook privacy settings deep dive',
        'Instagram story and post privacy',
        'Twitter account security',
        'TikTok data collection and controls',
        'Snapchat privacy features',
        'LinkedIn professional privacy'
      ],
      practicalTips: [
        'Review your privacy settings monthly',
        'Use strong, unique passwords for each platform',
        'Enable two-factor authentication everywhere',
        'Be selective about friend/follower requests',
        'Regularly audit your posts and photos'
      ]
    },
    {
      id: 'data-rights',
      title: 'Understanding Your Data Rights',
      description: 'Learn about your rights under privacy laws and how to exercise them effectively.',
      category: 'rights',
      difficulty: 'Advanced',
      duration: '25 mins',
      completed: false,
      icon: Globe,
      topics: [
        'GDPR and your rights as a teen',
        'CCPA and California privacy rights',
        'COPPA and under-13 protections',
        'How to request your data',
        'Right to deletion and correction',
        'Opting out of data collection'
      ],
      practicalTips: [
        'Keep records of your data requests',
        'Use privacy rights request templates',
        'Understand what data companies collect',
        'Know when you can legally consent',
        'Document privacy violations'
      ]
    },
    {
      id: 'online-reputation',
      title: 'Online Reputation Management',
      description: 'Build and maintain a positive digital presence that reflects your best self.',
      category: 'reputation',
      difficulty: 'Intermediate',
      duration: '28 mins',
      completed: false,
      icon: Star,
      topics: [
        'Understanding digital reputation impact',
        'Google search result management',
        'Social media content strategy',
        'Handling negative content',
        'Building professional online presence',
        'Long-term reputation planning'
      ],
      practicalTips: [
        'Google yourself regularly',
        'Create positive content consistently',
                'Address negative content professionally',
        'Use privacy settings strategically',
        'Think before you post - always'
      ]
    },
    {
      id: 'privacy-tools',
      title: 'Advanced Privacy Tools',
      description: 'Master the tools and techniques that privacy experts use to protect their data.',
      category: 'tools',
      difficulty: 'Advanced',
      duration: '35 mins',
      completed: false,
      icon: Settings,
      topics: [
        'VPN setup and configuration',
        'Password manager implementation',
        'Encrypted messaging apps',
        'Private browsing techniques',
        'Ad blockers and tracking protection',
        'Secure file sharing methods'
      ],
      practicalTips: [
        'Use a reputable VPN service',
        'Generate unique passwords for everything',
        'Enable end-to-end encryption',
        'Regularly update all privacy tools',
        'Test your privacy setup regularly'
      ]
    },
    {
      id: 'cyber-security',
      title: 'Cybersecurity for Teens',
      description: 'Protect yourself from hackers, scammers, and other online threats.',
      category: 'security',
      difficulty: 'Intermediate',
      duration: '32 mins',
      completed: false,
      icon: Shield,
      topics: [
        'Recognizing phishing attempts',
        'Malware protection strategies',
        'Secure Wi-Fi practices',
        'Mobile device security',
        'Social engineering awareness',
        'Incident response planning'
      ],
      practicalTips: [
        'Never click suspicious links',
        'Keep all software updated',
        'Use public Wi-Fi cautiously',
        'Enable device encryption',
        'Have a security incident plan'
      ]
    },
    {
      id: 'privacy-fundamentals',
      title: 'Privacy Fundamentals for Teens',
      description: 'Core privacy concepts every teenager should understand in the digital age.',
      category: 'privacy',
      difficulty: 'Beginner',
      duration: '22 mins',
      completed: false,
      icon: Lock,
      topics: [
        'What is personal information?',
        'How data collection works',
        'Understanding privacy policies',
        'Consent and your rights',
        'Data sharing and third parties',
        'Privacy by design principles'
      ],
      practicalTips: [
        'Read privacy policies before signing up',
        'Minimize data sharing when possible',
        'Understand what you\'re agreeing to',
        'Ask questions about data use',
        'Be skeptical of "free" services'
      ]
    }
  ];

  const categories = [
    { id: 'all', label: 'All Chapters', icon: BookOpen },
    { id: 'social-media', label: 'Social Media', icon: Users },
    { id: 'privacy', label: 'Privacy Basics', icon: Lock },
    { id: 'security', label: 'Cybersecurity', icon: Shield },
    { id: 'reputation', label: 'Reputation', icon: Star },
    { id: 'rights', label: 'Data Rights', icon: Globe },
    { id: 'tools', label: 'Privacy Tools', icon: Settings }
  ];

  const filteredChapters = activeCategory === 'all'
    ? chapters
    : chapters.filter(chapter => chapter.category === activeCategory);

  useEffect(() => {
    // Load completed chapters from localStorage
    const savedCompleted = localStorage.getItem('teen_handbook_completed');
    if (savedCompleted) {
      setCompletedChapters(JSON.parse(savedCompleted));
    }
  }, []);

  const handleChapterStart = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setShowChapter(true);
  };

  const handleChapterComplete = (chapterId: string) => {
    if (!completedChapters.includes(chapterId)) {
      const newCompleted = [...completedChapters, chapterId];
      setCompletedChapters(newCompleted);
      localStorage.setItem('teen_handbook_completed', JSON.stringify(newCompleted));
    }
    setShowChapter(false);
    setSelectedChapter(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryInfo = categories.find(cat => cat.id === category);
    return categoryInfo ? categoryInfo.icon : BookOpen;
  };

  return (
    <PageLayout
      title="Ages 13-17"
      subtitle="Comprehensive privacy guide for teenagers covering social media, data rights, online reputation, and advanced security concepts. Take control of your digital life!"
      icon={Smartphone}
      badge="TEEN PRIVACY HANDBOOK - AGES 13-17"
      breadcrumbs={true}
    >
      <div style={{ maxWidth: '75rem', margin: '0 auto' }}>
        {/* Progress Section */}
        <section style={{ padding: 'clamp(2rem, 4vw, 3rem) 0' }}>
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12" style={{
          backgroundColor: 'var(--card-color)',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
              Your Learning Journey
            </h2>
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">{completedChapters.length}</div>
                <div className="text-sm text-gray-600">Chapters Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{chapters.length}</div>
                <div className="text-sm text-gray-600">Total Chapters</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {Math.round((completedChapters.length / chapters.length) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Overall Progress</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="h-4 rounded-full transition-all duration-500 bg-gradient-to-r from-indigo-500 to-purple-600"
                style={{ width: `${Math.round((completedChapters.length / chapters.length) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="container mx-auto px-6 mb-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
            Browse by Category
          </h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                    activeCategory === category.id
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={{
                    backgroundColor: activeCategory === category.id ? 'var(--primary-light)' : undefined,
                    color: activeCategory === category.id ? 'white' : undefined
                  }}
                >
                  <Icon size={16} />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Chapters Grid */}
      <section className="container mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredChapters.map((chapter) => {
            const Icon = chapter.icon;
            const CategoryIcon = getCategoryIcon(chapter.category);
            const isCompleted = completedChapters.includes(chapter.id);

            return (
              <div
                key={chapter.id}
                className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer border-2 ${
                  isCompleted ? 'border-green-500' : 'border-transparent'
                }`}
                style={{
                  backgroundColor: 'var(--card-color)',
                  boxShadow: 'var(--shadow-md)'
                }}
                onClick={() => handleChapterStart(chapter)}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                      <Icon size={24} />
                    </div>
                    {isCompleted && (
                      <CheckCircle size={24} className="text-green-500" />
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <CategoryIcon size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-500 capitalize">{chapter.category.replace('-', ' ')}</span>
                  </div>

                  <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--primary)' }}>
                    {chapter.title}
                  </h3>

                  <p className="mb-4 leading-relaxed" style={{ color: 'var(--gray-600)' }}>
                    {chapter.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(chapter.difficulty)}`}>
                      {chapter.difficulty}
                    </span>
                    <span className="text-sm font-medium" style={{ color: 'var(--gray-500)' }}>
                      {chapter.duration}
                    </span>
                  </div>

                  <button
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChapterStart(chapter);
                    }}
                  >
                    {isCompleted ? 'Review Chapter' : 'Start Learning'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Chapter Modal */}
      {showChapter && selectedChapter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>
                  {selectedChapter.title}
                </h3>
                <button
                  onClick={() => setShowChapter(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="mb-6">
                <p className="text-lg mb-6" style={{ color: 'var(--gray-600)' }}>
                  {selectedChapter.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="font-semibold mb-4" style={{ color: 'var(--primary)' }}>
                      Topics Covered:
                    </h4>
                    <ul className="list-disc pl-6 space-y-2" style={{ color: 'var(--gray-600)' }}>
                      {selectedChapter.topics.map((topic, index) => (
                        <li key={index}>{topic}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h4 className="font-semibold mb-4" style={{ color: 'var(--primary)' }}>
                      Practical Tips:
                    </h4>
                    <ul className="list-disc pl-6 space-y-2" style={{ color: 'var(--gray-600)' }}>
                      {selectedChapter.practicalTips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock size={16} />
                      {selectedChapter.duration}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(selectedChapter.difficulty)}`}>
                      {selectedChapter.difficulty}
                    </span>
                  </div>

                  <button
                    onClick={() => handleChapterComplete(selectedChapter.id)}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all"
                  >
                    Mark as Complete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

        {/* Call to Action */}
        <section style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)',
          color: 'white',
          padding: 'clamp(3rem, 6vw, 4rem) 0',
          marginTop: 'clamp(2rem, 4vw, 3rem)',
          textAlign: 'center'
        }}>
          <h2 style={{ 
            fontSize: 'clamp(1.875rem, 3vw, 2.25rem)', 
            fontWeight: 700, 
            marginBottom: '1rem'
          }}>
            Ready to Take Control of Your Privacy?
          </h2>
          <p style={{ 
            fontSize: '1.125rem', 
            marginBottom: '2rem', 
            opacity: 0.9,
            maxWidth: '42rem',
            margin: '0 auto 2rem',
            lineHeight: 1.6
          }}>
            Start your journey to becoming a privacy-savvy teenager. Learn the skills you need to protect yourself and your data online.
          </p>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '1rem', 
            justifyContent: 'center' 
          }}>
            <Link
              to="/privacy-tools"
              style={{
                background: 'white',
                color: '#4f46e5',
                padding: '0.875rem 1.5rem',
                borderRadius: '12px',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Settings size={20} />
              Privacy Tools
            </Link>
            <Link 
              to="/family-hub"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                padding: '0.875rem 1.5rem',
                borderRadius: '12px',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                border: '2px solid white',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Users size={20} />
              Family Hub
            </Link>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default TeenHandbookPage;