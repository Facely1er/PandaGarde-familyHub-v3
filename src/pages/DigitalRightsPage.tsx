import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Scale, Globe, Shield, BookOpen, CheckCircle, Star, Trophy, Clock, Users, AlertTriangle, FileText, ExternalLink } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { PRIVACY_PORTAL_URL, PRIVACY_PORTAL_OPT_OUT_URL } from '../config/portal';

interface LawModule {
  id: string;
  title: string;
  description: string;
  category: 'privacy-laws' | 'data-rights' | 'consent' | 'international' | 'enforcement' | 'future';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  completed: boolean;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  keyPoints: string[];
  realWorldExamples: string[];
  yourRights: string[];
}

const DigitalRightsPage: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<LawModule | null>(null);
  const [showModule, setShowModule] = useState(false);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const modules: LawModule[] = [
    {
      id: 'gdpr-basics',
      title: 'GDPR: Your Privacy Rights in Europe',
      description: 'Understand the General Data Protection Regulation and how it protects your personal data.',
      category: 'privacy-laws',
      difficulty: 'Intermediate',
      duration: '25 mins',
      completed: false,
      icon: Globe,
      keyPoints: [
        'GDPR applies to anyone in the EU, regardless of citizenship',
        'You have the right to access your personal data',
        'You can request deletion of your data ("right to be forgotten")',
        'Companies must get clear consent before collecting data',
        'You can object to automated decision-making',
        'Data breaches must be reported within 72 hours'
      ],
      realWorldExamples: [
        'Requesting your data from Facebook or Google',
        'Asking a company to delete your account and data',
        'Opting out of targeted advertising',
        'Getting a copy of your school records',
        'Challenging automated decisions in college admissions'
      ],
      yourRights: [
        'Right to be informed about data collection',
        'Right of access to your personal data',
        'Right to rectification of inaccurate data',
        'Right to erasure ("right to be forgotten")',
        'Right to restrict processing',
        'Right to data portability',
        'Right to object to processing',
        'Rights related to automated decision-making'
      ]
    },
    {
      id: 'ccpa-california',
      title: 'CCPA: California Consumer Privacy Act',
      description: 'Learn about California\'s privacy law and how it affects your rights as a consumer.',
      category: 'privacy-laws',
      difficulty: 'Intermediate',
      duration: '22 mins',
      completed: false,
      icon: Scale,
      keyPoints: [
        'CCPA applies to California residents, regardless of age',
        'You have the right to know what personal information is collected',
        'You can opt out of the sale of personal information',
        'You have the right to delete personal information',
        'You cannot be discriminated against for exercising your rights',
        'Businesses must provide clear privacy notices'
      ],
      realWorldExamples: [
        'Opting out of data sales on websites',
        'Requesting what data companies have about you',
        'Asking companies to delete your information',
        'Understanding why you\'re seeing certain ads',
        'Exercising rights without fear of retaliation'
      ],
      yourRights: [
        'Right to know what personal information is collected',
        'Right to know whether personal information is sold',
        'Right to say no to the sale of personal information',
        'Right to access your personal information',
        'Right to equal service and price',
        'Right to delete personal information'
      ]
    },
    {
      id: 'modpa-maryland',
      title: 'MODPA: Maryland Online Data Privacy Act',
      description: 'Learn about Maryland\'s privacy law and how Maryland residents can exercise opt-out, access, and other rights.',
      category: 'privacy-laws',
      difficulty: 'Beginner',
      duration: '15 mins',
      completed: false,
      icon: Scale,
      keyPoints: [
        'MODPA applies to Maryland residents and certain businesses',
        'You have the right to opt out of sale of personal data and targeted advertising',
        'You can request access, correction, deletion, and portability of your data',
        'Opt-out and consent revocation must be honored within 15–30 days',
        'Schools and EdTech may use a privacy portal for requests'
      ],
      realWorldExamples: [
        'Submitting an opt-out request through your school\'s privacy portal',
        'Requesting a copy of your data from an EdTech provider',
        'Asking to delete your child\'s data from a learning app',
        'Revoking consent for targeted advertising'
      ],
      yourRights: [
        'Right to know what personal data is collected',
        'Right to access your personal data',
        'Right to correct inaccurate data',
        'Right to delete your data',
        'Right to data portability',
        'Right to opt out of sale and targeted advertising',
        'Right to revoke consent (within 30 days)'
      ]
    },
    {
      id: 'coppa-under-13',
      title: 'COPPA: Protection for Kids Under 13',
      description: 'Understand how the Children\'s Online Privacy Protection Act protects younger users.',
      category: 'consent',
      difficulty: 'Beginner',
      duration: '18 mins',
      completed: false,
      icon: Shield,
      keyPoints: [
        'COPPA protects children under 13 years old',
        'Parental consent is required for data collection',
        'Companies cannot collect more data than necessary',
        'Parents have the right to review and delete data',
        'No behavioral advertising to children under 13',
        'Companies must have clear privacy policies'
      ],
      realWorldExamples: [
        'Why some apps require parental permission',
        'How schools handle student data collection',
        'Why some websites block users under 13',
        'Parental controls on devices and apps',
        'Educational apps and data protection'
      ],
      yourRights: [
        'Right to have parental consent before data collection',
        'Right to have data deleted by parents',
        'Right to not be targeted with ads',
        'Right to age-appropriate privacy protections',
        'Right to have data used only for stated purposes'
      ]
    },
    {
      id: 'international-laws',
      title: 'International Privacy Laws',
      description: 'Explore privacy laws around the world and how they affect global internet users.',
      category: 'international',
      difficulty: 'Advanced',
      duration: '30 mins',
      completed: false,
      icon: Globe,
      keyPoints: [
        'Different countries have different privacy standards',
        'Some countries have stronger protections than others',
        'Cross-border data transfers have special rules',
        'Some countries require data to stay within borders',
        'International companies must comply with multiple laws',
        'Privacy laws are constantly evolving'
      ],
      realWorldExamples: [
        'How TikTok handles data differently in different countries',
        'Why some apps aren\'t available in certain regions',
        'Data localization requirements in some countries',
        'Cross-border data transfer agreements',
        'International privacy law enforcement cooperation'
      ],
      yourRights: [
        'Right to know which laws apply to you',
        'Right to data protection regardless of location',
        'Right to understand cross-border data flows',
        'Right to complain to international authorities',
        'Right to consistent privacy protections'
      ]
    },
    {
      id: 'enforcement-complaints',
      title: 'How to Enforce Your Rights',
      description: 'Learn how to file complaints and take action when your privacy rights are violated.',
      category: 'enforcement',
      difficulty: 'Intermediate',
      duration: '28 mins',
      completed: false,
      icon: AlertTriangle,
      keyPoints: [
        'You can file complaints with privacy authorities',
        'Keep records of privacy violations',
        'Many violations can be resolved directly with companies',
        'Legal action may be possible for serious violations',
        'Privacy authorities can investigate and fine companies',
        'You have the right to compensation for damages'
      ],
      realWorldExamples: [
        'Filing a complaint with your country\'s data protection authority',
        'Contacting companies directly about privacy violations',
        'Using privacy rights request templates',
        'Documenting evidence of privacy violations',
        'Seeking legal advice for serious violations'
      ],
      yourRights: [
        'Right to file complaints with authorities',
        'Right to seek legal remedies',
        'Right to compensation for damages',
        'Right to have violations investigated',
        'Right to be informed of investigation outcomes'
      ]
    },
    {
      id: 'future-privacy-laws',
      title: 'The Future of Privacy Law',
      description: 'Explore emerging privacy laws and trends that will shape digital rights in the future.',
      category: 'future',
      difficulty: 'Advanced',
      duration: '32 mins',
      completed: false,
      icon: FileText,
      keyPoints: [
        'New privacy laws are being proposed worldwide',
        'AI and machine learning raise new privacy questions',
        'Biometric data protection is becoming more important',
        'Privacy by design is becoming a legal requirement',
        'Cross-border data flows are being renegotiated',
        'Individual privacy rights are being strengthened'
      ],
      realWorldExamples: [
        'Proposed federal privacy laws in the US',
        'New biometric data protection laws',
        'AI regulation and privacy implications',
        'Privacy-focused technology developments',
        'International privacy law harmonization efforts'
      ],
      yourRights: [
        'Right to participate in privacy law development',
        'Right to be informed about new privacy protections',
        'Right to benefit from stronger privacy laws',
        'Right to have your voice heard in policy debates',
        'Right to expect continued privacy protection'
      ]
    }
  ];

  const categories = [
    { id: 'all', label: 'All Modules', icon: BookOpen },
    { id: 'privacy-laws', label: 'Privacy Laws', icon: Scale },
    { id: 'consent', label: 'Consent & Age', icon: Shield },
    { id: 'international', label: 'International', icon: Globe },
    { id: 'enforcement', label: 'Enforcement', icon: AlertTriangle },
    { id: 'future', label: 'Future Trends', icon: FileText }
  ];

  const filteredModules = activeCategory === 'all'
    ? modules
    : modules.filter(module => module.category === activeCategory);

  useEffect(() => {
    // Load completed modules from localStorage
    const savedCompleted = localStorage.getItem('digital_rights_completed');
    if (savedCompleted) {
      setCompletedModules(JSON.parse(savedCompleted));
    }
  }, []);

  const handleModuleStart = (module: LawModule) => {
    setSelectedModule(module);
    setShowModule(true);
  };

  const handleModuleComplete = (moduleId: string) => {
    if (!completedModules.includes(moduleId)) {
      const newCompleted = [...completedModules, moduleId];
      setCompletedModules(newCompleted);
      localStorage.setItem('digital_rights_completed', JSON.stringify(newCompleted));
    }
    setShowModule(false);
    setSelectedModule(null);
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
      title="Digital Rights & Law"
      subtitle="Understanding privacy legislation and digital rights—including Maryland’s MODPA for residents—and how to exercise your rights as a digital citizen."
      icon={Scale}
      badge="DIGITAL RIGHTS & LAW - AGES 13-17"
      breadcrumbs={true}
    >
      <div style={{ maxWidth: '75rem', margin: '0 auto' }}>
        {/* Maryland (MODPA) – Exercise your rights CTA */}
        <section className="mb-6 rounded-xl border-2 border-teal-200 dark:border-teal-800 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 p-5">
          <h3 className="font-bold text-teal-900 dark:text-teal-100 mb-2">Maryland residents: exercise your privacy rights</h3>
          <p className="text-sm text-teal-800 dark:text-teal-200 mb-3">
            Under the Maryland Online Data Privacy Act (MODPA), you can submit requests for access, correction, deletion, portability, and opt-out of sale or targeted advertising. If your school or organization uses the EduSoluce Privacy Portal, you can submit requests there.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href={PRIVACY_PORTAL_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors text-sm">
              <ExternalLink size={16} />
              Privacy Portal – Data rights
            </a>
            <a href={PRIVACY_PORTAL_OPT_OUT_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-teal-900/50 text-teal-700 dark:text-teal-200 border-2 border-teal-600 dark:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-800/50 font-medium rounded-lg transition-colors text-sm">
              <ExternalLink size={16} />
              Opt-out of sale / targeted ads
            </a>
          </div>
        </section>

        {/* Progress Section */}
        <section style={{ padding: 'clamp(2rem, 4vw, 3rem) 0' }}>
          <div style={{
            backgroundColor: 'var(--card-color)',
            borderRadius: '16px',
            boxShadow: 'var(--shadow-lg)',
            padding: '2rem',
            marginBottom: '3rem'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ 
                fontSize: 'clamp(1.5rem, 3vw, 1.875rem)', 
                fontWeight: 700, 
                marginBottom: '1rem',
                color: 'var(--primary)'
              }}>
                Your Legal Knowledge Progress
              </h2>
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-600">{completedModules.length}</div>
                <div className="text-sm text-gray-600">Modules Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-600">{modules.length}</div>
                <div className="text-sm text-gray-600">Total Modules</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {Math.round((completedModules.length / modules.length) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Overall Progress</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="h-4 rounded-full transition-all duration-500 bg-gradient-to-r from-slate-500 to-gray-600"
                style={{ width: `${Math.round((completedModules.length / modules.length) * 100)}%` }}
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
                      ? 'bg-slate-500 text-white'
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

      {/* Modules Grid */}
      <section className="container mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredModules.map((module) => {
            const Icon = module.icon;
            const CategoryIcon = getCategoryIcon(module.category);
            const isCompleted = completedModules.includes(module.id);

            return (
              <div
                key={module.id}
                className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer border-2 ${
                  isCompleted ? 'border-green-500' : 'border-transparent'
                }`}
                style={{
                  backgroundColor: 'var(--card-color)',
                  boxShadow: 'var(--shadow-md)'
                }}
                onClick={() => handleModuleStart(module)}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-slate-500 to-gray-600 flex items-center justify-center text-white">
                      <Icon size={24} />
                    </div>
                    {isCompleted && (
                      <CheckCircle size={24} className="text-green-500" />
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <CategoryIcon size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-500 capitalize">{module.category.replace('-', ' ')}</span>
                  </div>

                  <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--primary)' }}>
                    {module.title}
                  </h3>

                  <p className="mb-4 leading-relaxed" style={{ color: 'var(--gray-600)' }}>
                    {module.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(module.difficulty)}`}>
                      {module.difficulty}
                    </span>
                    <span className="text-sm font-medium" style={{ color: 'var(--gray-500)' }}>
                      {module.duration}
                    </span>
                  </div>

                  <button
                    className="w-full bg-gradient-to-r from-slate-500 to-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-slate-600 hover:to-gray-700 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleModuleStart(module);
                    }}
                  >
                    {isCompleted ? 'Review Module' : 'Start Learning'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Module Modal */}
      {showModule && selectedModule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>
                  {selectedModule.title}
                </h3>
                <button
                  onClick={() => setShowModule(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="mb-6">
                <p className="text-lg mb-6" style={{ color: 'var(--gray-600)' }}>
                  {selectedModule.description}
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="font-semibold mb-4" style={{ color: 'var(--primary)' }}>
                      Key Points:
                    </h4>
                    <ul className="list-disc pl-6 space-y-2" style={{ color: 'var(--gray-600)' }}>
                      {selectedModule.keyPoints.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h4 className="font-semibold mb-4" style={{ color: 'var(--primary)' }}>
                      Real-World Examples:
                    </h4>
                    <ul className="list-disc pl-6 space-y-2" style={{ color: 'var(--gray-600)' }}>
                      {selectedModule.realWorldExamples.map((example, index) => (
                        <li key={index}>{example}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h4 className="font-semibold mb-4" style={{ color: 'var(--primary)' }}>
                      Your Rights:
                    </h4>
                    <ul className="list-disc pl-6 space-y-2" style={{ color: 'var(--gray-600)' }}>
                      {selectedModule.yourRights.map((right, index) => (
                        <li key={index}>{right}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock size={16} />
                      {selectedModule.duration}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(selectedModule.difficulty)}`}>
                      {selectedModule.difficulty}
                    </span>
                  </div>

                  <button
                    onClick={() => handleModuleComplete(selectedModule.id)}
                    className="bg-gradient-to-r from-slate-500 to-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-slate-600 hover:to-gray-700 transition-all"
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
          background: 'var(--gradient-primary)',
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
            Ready to Know Your Digital Rights?
          </h2>
          <p style={{ 
            fontSize: '1.125rem', 
            marginBottom: '2rem', 
            opacity: 0.9,
            maxWidth: '42rem',
            margin: '0 auto 2rem',
            lineHeight: 1.6
          }}>
            Start your journey to understanding privacy laws and digital rights. Learn how to protect yourself and exercise your rights as a digital citizen.
          </p>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '1rem', 
            justifyContent: 'center' 
          }}>
            <Link
              to="/teen-handbook"
              style={{
                background: 'white',
                color: 'var(--gray-700)',
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
              <BookOpen size={20} />
              Teen Handbook
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

export default DigitalRightsPage;