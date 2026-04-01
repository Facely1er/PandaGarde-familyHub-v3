import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, CheckCircle, BookOpen, Users, Smartphone, Globe, Clock, LucideIcon } from 'lucide-react';
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
      subtitle="Hands-on projects and practical guides that teach tweens how to protect personal information and navigate online spaces safely. Become a digital privacy expert!"
      icon={Shield}
      badge="PRIVACY PROTECTOR'S GUIDE - AGES 9-12"
      breadcrumbs={true}
    >
      <div style={{ maxWidth: '75rem', margin: '0 auto' }}>
        {/* Progress Section */}
        <section style={{ padding: 'clamp(2rem, 4vw, 3rem) 0' }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            padding: '2rem',
            marginBottom: '3rem'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ 
                fontSize: 'clamp(1.5rem, 3vw, 1.875rem)', 
                fontWeight: 700, 
                marginBottom: '1rem',
                color: '#1B5E20'
              }}>
                Your Learning Progress
              </h2>
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{completedGuides.length}</div>
                <div className="text-sm text-gray-600">Guides Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{guides.length}</div>
                <div className="text-sm text-gray-600">Total Guides</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {Math.round((completedGuides.length / guides.length) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Overall Progress</div>
              </div>
            </div>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section style={{ padding: 'clamp(2rem, 4vw, 3rem) 0' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ 
              fontSize: 'clamp(1.5rem, 3vw, 1.875rem)', 
              fontWeight: 700, 
              marginBottom: '1.5rem',
              color: '#1B5E20'
            }}>
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
                      ? 'bg-green-500 text-white'
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

        {/* Guides Grid */}
        <section style={{ padding: 'clamp(2rem, 4vw, 3rem) 0' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGuides.map((guide) => {
            const Icon = guide.icon;
            const CategoryIcon = getCategoryIcon(guide.category);
            const isCompleted = completedGuides.includes(guide.id);

            return (
              <div
                key={guide.id}
                className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer border-2 ${
                  isCompleted ? 'border-green-500' : 'border-transparent'
                }`}
                style={{
                  backgroundColor: 'var(--card-color)',
                  boxShadow: 'var(--shadow-md)'
                }}
                onClick={() => handleGuideStart(guide)}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center text-white">
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

                  <h3 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: 700, 
                    marginBottom: '0.75rem',
                    color: '#1B5E20'
                  }}>
                    {guide.title}
                  </h3>

                  <p style={{ 
                    marginBottom: '1rem', 
                    lineHeight: 1.6,
                    color: '#64748b'
                  }}>
                    {guide.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(guide.difficulty)}`}>
                      {guide.difficulty}
                    </span>
                    <span className="text-sm font-medium" style={{ color: 'var(--gray-500)' }}>
                      {guide.duration}
                    </span>
                  </div>

                  <button
                    className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-blue-700 transition-all"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>
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
                <p className="text-lg mb-6" style={{ color: 'var(--gray-600)' }}>
                  {selectedGuide.description}
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <h4 className="font-semibold mb-4" style={{ color: 'var(--primary)' }}>
                    What You'll Learn:
                  </h4>
                  <ul className="list-disc pl-6 space-y-2" style={{ color: 'var(--gray-600)' }}>
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
                    className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-blue-700 transition-all"
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
          background: 'linear-gradient(135deg, #1B5E20 0%, #2563eb 100%)',
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
            Ready to Become a Privacy Protector?
          </h2>
          <p style={{ 
            fontSize: '1.125rem', 
            marginBottom: '2rem', 
            opacity: 0.9,
            maxWidth: '42rem',
            margin: '0 auto 2rem',
            lineHeight: 1.6
          }}>
            Start your journey to becoming a digital privacy expert. Learn practical skills that will protect you and your family online.
          </p>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '1rem', 
            justifyContent: 'center' 
          }}>
            <Link
              to="/privacy-explorers"
              style={{
                background: 'white',
                color: '#1B5E20',
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
              <Shield size={20} />
              Try Privacy Explorers
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

export default PrivacyHandbookPage;