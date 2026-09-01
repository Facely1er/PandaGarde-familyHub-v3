import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, CheckCircle, BookOpen, Users, Smartphone, Globe, Clock, Video as LucideIcon } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

interface Guide {
  id: string;
  title: string;
  description: string;
  category: 'basics' | 'advanced' | 'tools' | 'social';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  completed: boolean;
  icon: LucideIcon;
  content: string[];
}

const PrivacyHandbookPage: React.FC = () => {
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [completedGuides, setCompletedGuides] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const guides: Guide[] = [
    {
      id: 'password-basics',
      title: 'Password Protection Basics',
      description: 'Learn how to create and manage strong passwords that keep your accounts safe.',
      category: 'basics',
      difficulty: 'Beginner',
      duration: '15 mins',
      completed: false,
      icon: Lock,
      content: [
        'What makes a password strong?',
        'How to create memorable but secure passwords',
        'Using password managers safely',
        'Two-factor authentication explained',
        'What to do if your password is compromised'
      ]
    },
    {
      id: 'privacy-settings',
      title: 'Privacy Settings Mastery',
      description: 'Master the art of configuring privacy settings across different platforms and apps.',
      category: 'tools',
      difficulty: 'Intermediate',
      duration: '20 mins',
      completed: false,
      icon: Eye,
      content: [
        'Understanding privacy settings on social media',
        'Browser privacy configurations',
        'Mobile device privacy controls',
        'Location sharing best practices',
        'Data collection opt-out strategies'
      ]
    },
    {
      id: 'social-media-safety',
      title: 'Social Media Safety Guide',
      description: 'Navigate social media platforms safely while protecting your personal information.',
      category: 'social',
      difficulty: 'Intermediate',
      duration: '18 mins',
      completed: false,
      icon: Users,
      content: [
        'What information to never share publicly',
        'How to spot fake accounts and scams',
        'Managing your social media presence',
        'Dealing with cyberbullying and harassment',
        'Creating positive online relationships'
      ]
    },
    {
      id: 'data-protection',
      title: 'Personal Data Protection',
      description: 'Understand what data companies collect and how to protect your personal information.',
      category: 'advanced',
      difficulty: 'Advanced',
      duration: '25 mins',
      completed: false,
      icon: Shield,
      content: [
        'Understanding data collection practices',
        'Your rights under privacy laws',
        'How to request data deletion',
        'Protecting your digital footprint',
        'Using encryption and secure communication'
      ]
    },
    {
      id: 'mobile-privacy',
      title: 'Mobile Device Privacy',
      description: 'Secure your smartphone and tablet to protect your personal information on the go.',
      category: 'tools',
      difficulty: 'Intermediate',
      duration: '22 mins',
      completed: false,
      icon: Smartphone,
      content: [
        'App permissions and what they mean',
        'Securing your mobile device',
        'Safe app downloading practices',
        'Mobile payment security',
        'Protecting your location data'
      ]
    },
    {
      id: 'online-reputation',
      title: 'Managing Your Online Reputation',
      description: 'Build and maintain a positive digital presence that reflects your best self.',
      category: 'advanced',
      difficulty: 'Advanced',
      duration: '30 mins',
      completed: false,
      icon: Globe,
      content: [
        'Understanding digital reputation',
        'Monitoring your online presence',
        'Responding to negative content',
        'Building a positive digital identity',
        'Long-term reputation management'
      ]
    }
  ];

  const categories = [
    { id: 'all', label: 'All Guides', icon: BookOpen },
    { id: 'basics', label: 'Basics', icon: Lock },
    { id: 'tools', label: 'Tools & Settings', icon: Eye },
    { id: 'social', label: 'Social Media', icon: Users },
    { id: 'advanced', label: 'Advanced', icon: Shield }
  ];

  const filteredGuides = activeCategory === 'all'
    ? guides
    : guides.filter(guide => guide.category === activeCategory);

  useEffect(() => {
    // Load completed guides from localStorage
    const savedCompleted = localStorage.getItem('privacy_handbook_completed');
    if (savedCompleted) {
      setCompletedGuides(JSON.parse(savedCompleted));
    }
  }, []);

  const handleGuideStart = (guide: Guide) => {
    setSelectedGuide(guide);
    setShowGuide(true);
  };

  const handleGuideComplete = (guideId: string) => {
    if (!completedGuides.includes(guideId)) {
      const newCompleted = [...completedGuides, guideId];
      setCompletedGuides(newCompleted);
      localStorage.setItem('privacy_handbook_completed', JSON.stringify(newCompleted));
    }
    setShowGuide(false);
    setSelectedGuide(null);
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
      title="Ages 9-12"
      subtitle="Hands-on guides for tweens who want to protect their personal info online. Pick a project below to get started."
      breadcrumbs={true}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <section>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 sm:p-8">
            <div className="mb-6 text-center">
              <h2 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100">
                Your learning progress
              </h2>
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{completedGuides.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Guides completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{guides.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Total guides</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {Math.round((completedGuides.length / guides.length) * 100)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Overall progress</div>
              </div>
            </div>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-6 text-center">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100">
              Browse by category
            </h2>
          <div className="flex flex-wrap gap-3 justify-center">
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
          {filteredGuides.map((guide) => {
            const Icon = guide.icon;
            const CategoryIcon = getCategoryIcon(guide.category);
            const isCompleted = completedGuides.includes(guide.id);

            return (
              <div
                key={guide.id}
                role="button"
                tabIndex={0}
                className={`cursor-pointer rounded-2xl border bg-white p-0 transition-colors dark:bg-gray-800 ${
                  isCompleted
                    ? 'border-green-600 dark:border-green-500'
                    : 'border-gray-200 hover:border-green-400 dark:border-gray-700 dark:hover:border-green-500'
                }`}
                onClick={() => handleGuideStart(guide)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleGuideStart(guide);
                  }
                }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white">
                      <Icon size={24} />
                    </div>
                    {isCompleted && (
                      <CheckCircle size={24} className="text-green-500" />
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <CategoryIcon size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-500 capitalize">{guide.category}</span>
                  </div>

                  <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-gray-100">
                    {guide.title}
                  </h3>

                  <p className="mb-4 leading-relaxed text-gray-600 dark:text-gray-300">
                    {guide.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(guide.difficulty)}`}>
                      {guide.difficulty}
                    </span>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {guide.duration}
                    </span>
                  </div>

                  <button
                    className="w-full bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-500 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGuideStart(guide);
                    }}
                  >
                    {isCompleted ? 'Review Guide' : 'Start Learning'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        </section>

        {/* Guide Modal */}
      {showGuide && selectedGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {selectedGuide.title}
                </h3>
                <button
                  onClick={() => setShowGuide(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="mb-6">
                <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
                  {selectedGuide.description}
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <h4 className="mb-4 font-semibold text-gray-900 dark:text-gray-100">
                    What You'll Learn:
                  </h4>
                  <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    {selectedGuide.content.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock size={16} />
                      {selectedGuide.duration}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(selectedGuide.difficulty)}`}>
                      {selectedGuide.difficulty}
                    </span>
                  </div>

                  <button
                    onClick={() => handleGuideComplete(selectedGuide.id)}
                    className="bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-500 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
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
            Ready for a privacy conversation?
          </h2>
          <p className="mx-auto mb-6 max-w-2xl text-base leading-relaxed text-green-50">
            Use these guides, then try a Family Hub mission when you want hands-on practice on this device.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/family-hub/activities"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-white px-5 py-2.5 font-semibold text-green-800 hover:bg-green-50"
            >
              <Shield size={20} aria-hidden />
              Privacy missions
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

export default PrivacyHandbookPage;