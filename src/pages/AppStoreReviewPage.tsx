import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Smartphone, 
  Shield, 
  Users, 
  Gamepad2,
  Award,
  BarChart3,
  ArrowLeft,
  ExternalLink,
  Download
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const AppStoreReviewPage: React.FC = () => {
  const reviewSteps = [
    {
      step: 1,
      title: 'App Installation',
      description: 'Install the app from the provided link or app store listing.',
      checks: [
        'App installs successfully',
        'App launches without crashes',
        'Splash screen displays correctly',
        'App loads to dashboard'
      ]
    },
    {
      step: 2,
      title: 'Family Management',
      description: 'Test the family member management features.',
      checks: [
        'Add a new family member',
        'View family dashboard',
        'Switch between family members',
        'View individual progress'
      ]
    },
    {
      step: 3,
      title: 'Activity Features',
      description: 'Test the interactive privacy education activities.',
      checks: [
        'Access activities screen',
        'Launch at least 3 different activities',
        'Complete an activity',
        'Verify activity completion is saved',
        'Test touch controls (mobile)'
      ]
    },
    {
      step: 4,
      title: 'Progress Tracking',
      description: 'Verify progress tracking and achievement system.',
      checks: [
        'View progress screen',
        'Check activity completion status',
        'View achievement badges',
        'Generate a certificate',
        'Verify progress persists after app restart'
      ]
    },
    {
      step: 5,
      title: 'Privacy & Security',
      description: 'Verify privacy and security features.',
      checks: [
        'Confirm no external tracking',
        'Verify data stored locally only',
        'Test offline functionality',
        'Check privacy policy accessibility',
        'Verify COPPA compliance features'
      ]
    },
    {
      step: 6,
      title: 'Mobile Optimization',
      description: 'Test mobile-specific features and optimization.',
      checks: [
        'Test touch interactions',
        'Verify responsive design',
        'Test PWA installation (if applicable)',
        'Check offline functionality',
        'Verify app performance'
      ]
    }
  ];

  const technicalDetails = {
    platform: 'iOS, Android, PWA',
    minVersion: {
      ios: 'iOS 13.0',
      android: 'Android 6.0 (API 23)'
    },
    permissions: [
      'No special permissions required',
      'All data stored locally',
      'No network access required for core features'
    ],
    dataStorage: 'Local storage only (localStorage/IndexedDB)',
    tracking: 'No external tracking or analytics',
    compliance: [
      'COPPA Compliant',
      'GDPR Compliant',
      'No in-app purchases',
      'No advertisements'
    ]
  };

  const activities = [
    'Privacy Panda Coloring',
    'Information Sorting Game',
    'Safe Online Journey Maze',
    'Privacy Word Search',
    'Privacy Shield Connect Dots',
    'Privacy Symbol Matching',
    'Privacy Memory Game',
    'Privacy Quiz'
  ];

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-green-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-green-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to="/app-features"
              className="inline-flex items-center text-teal-100 hover:text-white mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to App Features
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              App Store Reviewer Guide
            </h1>
            <p className="text-xl text-teal-100">
              Step-by-step guide for verifying PandaGarde Family Hub app features
            </p>
          </div>
        </div>

        {/* Quick Info */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">App Name</h3>
                <p className="text-gray-900">Privacy Panda Family Hub</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Category</h3>
                <p className="text-gray-900">Education / Family</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Age Rating</h3>
                <p className="text-gray-900">Ages 4+ (Family Friendly)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Review Steps */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {reviewSteps.map((step) => (
              <div key={step.step} className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-start mb-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-xl mr-4">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {step.title}
                    </h2>
                    <p className="text-gray-600 mb-4">{step.description}</p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Verification Checklist:
                      </h3>
                      <ul className="space-y-2">
                        {step.checks.map((check, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle2 className="w-5 h-5 text-teal-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{check}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Details */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Technical Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Platform & Versions</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="font-semibold text-gray-700">Platform</dt>
                    <dd className="text-gray-600">{technicalDetails.platform}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-700">Minimum iOS Version</dt>
                    <dd className="text-gray-600">{technicalDetails.minVersion.ios}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-700">Minimum Android Version</dt>
                    <dd className="text-gray-600">{technicalDetails.minVersion.android}</dd>
                  </div>
                </dl>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Privacy & Data</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="font-semibold text-gray-700">Data Storage</dt>
                    <dd className="text-gray-600">{technicalDetails.dataStorage}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-700">Tracking</dt>
                    <dd className="text-gray-600">{technicalDetails.tracking}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-700">Permissions</dt>
                    <dd className="text-gray-600">
                      <ul className="list-disc list-inside space-y-1 mt-1">
                        {technicalDetails.permissions.map((perm, i) => (
                          <li key={i}>{perm}</li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Compliance</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {technicalDetails.compliance.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <Shield className="w-5 h-5 text-teal-600 mr-2" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Activities List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Available Activities</h2>
            <p className="text-gray-600 mb-6">
              The app includes 8 interactive privacy education activities:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {activities.map((activity, index) => (
                <div
                  key={index}
                  className="bg-teal-50 rounded-lg p-4 border border-teal-200"
                >
                  <div className="flex items-center">
                    <Gamepad2 className="w-5 h-5 text-teal-600 mr-2" />
                    <span className="font-semibold text-gray-900">{activity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Summary */}
        <div className="bg-teal-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8">Key Features Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <Users className="w-8 h-8 mb-4" />
                <h3 className="font-bold text-lg mb-2">Family Management</h3>
                <p className="text-teal-100 text-sm">
                  Manage multiple family members and track individual progress
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <Gamepad2 className="w-8 h-8 mb-4" />
                <h3 className="font-bold text-lg mb-2">8 Activities</h3>
                <p className="text-teal-100 text-sm">
                  Interactive privacy education games and activities
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <Award className="w-8 h-8 mb-4" />
                <h3 className="font-bold text-lg mb-2">Achievements</h3>
                <p className="text-teal-100 text-sm">
                  Certificates, badges, and progress milestones
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <BarChart3 className="w-8 h-8 mb-4" />
                <h3 className="font-bold text-lg mb-2">Progress Tracking</h3>
                <p className="text-teal-100 text-sm">
                  Detailed analytics and progress monitoring
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Download Links */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Download the App
            </h2>
            <p className="text-gray-600 mb-6">
              Test the app features directly on your device
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://play.google.com/store/apps"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                <Download className="w-5 h-5 mr-2" />
                Google Play Store
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <Download className="w-5 h-5 mr-2" />
                Apple App Store
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">
              Questions about the app? Contact us at{' '}
              <a href="mailto:support@pandagarde.com" className="text-teal-600 hover:underline">
                support@pandagarde.com
              </a>
            </p>
            <Link to="/" className="text-teal-600 hover:text-teal-700 font-semibold">
              ← Back to PandaGarde Website
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AppStoreReviewPage;


