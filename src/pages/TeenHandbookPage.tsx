import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, CheckCircle, Star, Clock, BookOpen, Users, Globe, Settings } from 'lucide-react';
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
      subtitle="Practical privacy tips for teens—social media settings, passwords, and online reputation. Open the section that matches what you want to fix today."
      breadcrumbs={true}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <section>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 sm:p-8">
          <div className="mb-6 text-center">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
              Your learning journey
            </h2>
            <div className="mb-6 flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-700 dark:text-green-400">{completedChapters.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Chapters completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{chapters.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Total chapters</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-700 dark:text-green-400">
                  {Math.round((completedChapters.length / chapters.length) * 100)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Overall progress</div>
              </div>
            </div>
            <div className="h-4 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-4 rounded-full bg-green-700 transition-all duration-500 dark:bg-green-500"
                style={{ width: `${Math.round((completedChapters.length / chapters.length) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-6 text-center">
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
            Browse by category
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  aria-pressed={activeCategory === category.id}
                  className={`flex min-h-[44px] items-center gap-2 rounded-full px-4 py-2 font-medium transition-colors ${
                    activeCategory === category.id
                      ? 'bg-green-700 text-white dark:bg-green-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon size={16} />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredChapters.map((chapter) => {
            const Icon = chapter.icon;
            const CategoryIcon = getCategoryIcon(chapter.category);
            const isCompleted = completedChapters.includes(chapter.id);

            return (
              <div
                key={chapter.id}
                role="button"
                tabIndex={0}
                className={`cursor-pointer rounded-2xl border bg-white dark:bg-gray-800 ${
                  isCompleted
                    ? 'border-green-600 dark:border-green-500'
                    : 'border-gray-200 hover:border-green-400 dark:border-gray-700 dark:hover:border-green-500'
                }`}
                onClick={() => handleChapterStart(chapter)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleChapterStart(chapter);
                  }
                }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-700 text-white">
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

                  <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-gray-100">
                    {chapter.title}
                  </h3>

                  <p className="mb-4 leading-relaxed text-gray-600 dark:text-gray-300">
                    {chapter.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(chapter.difficulty)}`}>
                      {chapter.difficulty}
                    </span>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {chapter.duration}
                    </span>
                  </div>

                  <button
                    className="w-full rounded-lg bg-green-700 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-500"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
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
                <p className="text-lg mb-6 text-gray-600">
                  {selectedChapter.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="font-semibold mb-4 text-primary">
                      Topics Covered:
                    </h4>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                      {selectedChapter.topics.map((topic, index) => (
                        <li key={index}>{topic}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h4 className="font-semibold mb-4 text-primary">
                      Practical Tips:
                    </h4>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
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
                    className="rounded-lg bg-green-700 px-6 py-2 font-semibold text-white transition-colors hover:bg-green-800 dark:bg-green-600"
                  >
                    Mark as Complete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

        <section className="rounded-2xl bg-green-700 p-6 text-center text-white sm:p-8 dark:bg-green-800">
          <h2 className="mb-3 text-2xl font-bold sm:text-3xl">
            Ready to take one privacy action this week?
          </h2>
          <p className="mx-auto mb-6 max-w-2xl text-base leading-relaxed text-green-50">
            Pick a chapter, then try one action—passwords, posts, or app settings. Family Hub missions are optional practice on this device.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/for-families"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-white px-5 py-2.5 font-semibold text-green-800 hover:bg-green-50"
            >
              <Settings size={20} aria-hidden />
              Guides &amp; stories
            </Link>
            <Link
              to="/family-hub"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border-2 border-white px-5 py-2.5 font-semibold text-white hover:bg-white/10"
            >
              <Users size={20} aria-hidden />
              Family Hub
            </Link>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default TeenHandbookPage;