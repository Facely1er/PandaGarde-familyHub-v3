import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Smartphone, 
  Users, 
  Gamepad2, 
  Award, 
  BarChart3, 
  Shield,
  Download,
  ExternalLink,
  CheckCircle2,
  Star
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const AppFeaturesPage: React.FC = () => {
  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Family Management',
      description: 'Keep everyone in one place. Add each family member, see how each child is doing, and switch between profiles quickly.',
      highlights: [
        'Add everyone in your family',
        'See each child’s progress',
        'One simple dashboard',
        'Switch profiles in one tap'
      ]
    },
    {
      icon: <Gamepad2 className="w-8 h-8" />,
      title: 'Interactive Activities',
      description: 'Engage children with 8 different privacy education activities including coloring, mazes, word searches, quizzes, and memory games.',
      highlights: [
        '8 unique activity types',
        'Age-appropriate content',
        'Touch-optimized controls',
        'Offline play support'
      ]
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Achievement System',
      description: 'Motivate learning with certificates, badges, and achievement tracking. Celebrate milestones and completed activities.',
      highlights: [
        'Customizable certificates',
        'Achievement badges',
        'Progress milestones',
        'Downloadable certificates'
      ]
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Progress Tracking',
      description: 'See what your kids have learned. Check which activities they’ve done, their scores, and how much time they’ve spent.',
      highlights: [
        'See progress as they go',
        'Track scores and completion',
        'See time spent learning',
        'Export or move progress if you need to'
      ]
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Privacy & Security',
      description: 'We put your family’s privacy first. Everything stays on your device—we don’t track you or share your data. We follow child privacy laws so it’s safe for kids.',
      highlights: [
        'Data stays on your device',
        'Safe for kids (meets child privacy laws)',
        'No tracking or ads',
        'Strong privacy practices'
      ]
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: 'Works on Phones & Tablets',
      description: 'Use it on any device. Add it to your home screen to use like an app, and many features work when you’re offline.',
      highlights: [
        'Add to home screen like an app',
        'Works offline',
        'Easy to use on touch screens',
        'Works on phones, tablets, and computers'
      ]
    }
  ];

  const activities = [
    {
      name: 'Privacy Panda Coloring',
      description: 'Creative coloring activity with password protection concepts',
      ageRange: 'Ages 5-8'
    },
    {
      name: 'Information Sorting Game',
      description: 'Learn to distinguish between safe and private information',
      ageRange: 'Ages 7-12'
    },
    {
      name: 'Safe Online Journey Maze',
      description: 'Navigate online safety scenarios with interactive controls',
      ageRange: 'Ages 8-12'
    },
    {
      name: 'Privacy Word Search',
      description: 'Build vocabulary related to digital privacy',
      ageRange: 'Ages 9-13'
    },
    {
      name: 'Privacy Shield Connect Dots',
      description: 'Learn protection symbols and security concepts',
      ageRange: 'Ages 6-10'
    },
    {
      name: 'Privacy Symbol Matching',
      description: 'Understand digital interface symbols',
      ageRange: 'Ages 7-11'
    },
    {
      name: 'Privacy Memory Game',
      description: 'Match privacy concepts and learn through play',
      ageRange: 'Ages 6-12'
    },
    {
      name: 'Privacy Quiz',
      description: 'Test knowledge with interactive quizzes',
      ageRange: 'Ages 10-17'
    }
  ];

  return (
    <PageLayout
      title="PandaGarde Family Hub App"
      subtitle="Mobile app features for app store reviewers"
      icon={Smartphone}
      badge="APP FEATURES"
      breadcrumbs={true}
    >
      <div className="min-h-screen" style={{ backgroundColor: 'var(--white)' }}>
        {/* App Store Links Section */}
        <div className="mb-8 text-center">
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://play.google.com/store/apps"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-600 to-green-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              <Download className="w-5 h-5 mr-2" />
              Google Play Store
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
            <a
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-600 to-green-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              <Download className="w-5 h-5 mr-2" />
              Apple App Store
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div className="py-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
              App Features
            </h2>
            <p className="text-lg max-w-3xl mx-auto" style={{ color: 'var(--gray-600)' }}>
              The Family Hub app provides a comprehensive mobile experience for families
              to learn about digital privacy together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                style={{
                  backgroundColor: 'var(--card-color)',
                  boxShadow: 'var(--shadow-lg)'
                }}
              >
                <div className="mb-4" style={{ color: 'var(--primary-light)' }}>{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--primary)' }}>
                  {feature.title}
                </h3>
                <p className="mb-4" style={{ color: 'var(--gray-600)' }}>{feature.description}</p>
                <ul className="space-y-2">
                  {feature.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-start text-sm" style={{ color: 'var(--gray-700)' }}>
                      <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: 'var(--primary-light)' }} />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Activities Section */}
        <div className="py-8" style={{ backgroundColor: 'var(--light)' }}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
              Interactive Activities
            </h2>
            <p className="text-lg max-w-3xl mx-auto" style={{ color: 'var(--gray-600)' }}>
              Eight engaging activities designed to teach digital privacy concepts
              through interactive gameplay.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activities.map((activity, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                style={{
                  backgroundColor: 'var(--card-color)',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="text-xs font-semibold px-2 py-1 rounded" style={{
                    color: 'var(--primary-light)',
                    backgroundColor: 'var(--light)'
                  }}>
                    {activity.ageRange}
                  </span>
                </div>
                <h3 className="font-bold mb-2" style={{ color: 'var(--primary)' }}>
                  {activity.name}
                </h3>
                <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
                  {activity.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* App Store Information */}
        <div className="py-8">
          <div className="rounded-xl shadow-lg p-8" style={{
            backgroundColor: 'var(--card-color)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
              App Store Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--primary)' }}>
                  App Details
                </h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="font-semibold" style={{ color: 'var(--gray-700)' }}>App Name</dt>
                    <dd style={{ color: 'var(--gray-600)' }}>Privacy Panda Family Hub</dd>
                  </div>
                  <div>
                    <dt className="font-semibold" style={{ color: 'var(--gray-700)' }}>Category</dt>
                    <dd style={{ color: 'var(--gray-600)' }}>Education / Family</dd>
                  </div>
                  <div>
                    <dt className="font-semibold" style={{ color: 'var(--gray-700)' }}>Age Rating</dt>
                    <dd style={{ color: 'var(--gray-600)' }}>Ages 4+ (Family Friendly)</dd>
                  </div>
                  <div>
                    <dt className="font-semibold" style={{ color: 'var(--gray-700)' }}>Platform</dt>
                    <dd style={{ color: 'var(--gray-600)' }}>iOS, Android, or add to home screen in a browser</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--primary)' }}>
                  Key Highlights
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" style={{ color: 'var(--primary-light)' }} />
                    <span style={{ color: 'var(--gray-700)' }}>COPPA compliant - safe for children</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" style={{ color: 'var(--primary-light)' }} />
                    <span style={{ color: 'var(--gray-700)' }}>No in-app purchases or ads</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" style={{ color: 'var(--primary-light)' }} />
                    <span style={{ color: 'var(--gray-700)' }}>Works offline - no internet required</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" style={{ color: 'var(--primary-light)' }} />
                    <span style={{ color: 'var(--gray-700)' }}>Privacy-first - all data stored locally</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" style={{ color: 'var(--primary-light)' }} />
                    <span style={{ color: 'var(--gray-700)' }}>Content supports what schools teach about being safe online</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Reviewer Guide Section */}
        <div className="py-8 rounded-xl" style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
          color: 'white'
        }}>
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              For App Store Reviewers
            </h2>
            <p className="text-xl opacity-90">
              Quick guide to verify app features and functionality
            </p>
          </div>

          <div className="rounded-xl p-8 max-w-4xl mx-auto" style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 className="text-2xl font-bold mb-6">Feature Verification Checklist</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Family member management (add/remove members)',
                'Activity selection and completion',
                'Progress tracking and statistics',
                'Certificate generation',
                'Offline functionality',
                'Touch controls and mobile optimization',
                'Data privacy (local storage only)',
                'Age-appropriate content filtering'
              ].map((item, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.3)' }}>
              <Link
                to="/app-store-review"
                className="inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-colors"
                style={{
                  backgroundColor: 'white',
                  color: 'var(--primary)'
                }}
              >
                View Detailed Reviewer Guide
                <ExternalLink className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>

        {/* Back to Website */}
        <div className="py-8">
          <div className="text-center">
            <Link
              to="/"
              className="inline-flex items-center font-semibold"
              style={{ color: 'var(--primary)' }}
            >
              ← Back to PandaGarde Website
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AppFeaturesPage;


