import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Monitor, Tablet, Shield, Settings, CheckCircle, AlertTriangle } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const DeviceSetupGuidePage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const deviceTypes = [
    {
      id: 'smartphone',
      title: 'Smartphone Setup',
      description: 'Configure smartphones for safe child use',
      icon: Smartphone,
      ageGroup: 'Ages 8+',
      steps: [
        'Enable parental controls',
        'Set up screen time limits',
        'Turn on app restrictions',
        'Enable safe browsing',
        'Review location sharing settings'
      ]
    },
    {
      id: 'tablet',
      title: 'Tablet Configuration',
      description: 'Set up tablets for educational and safe use',
      icon: Tablet,
      ageGroup: 'Ages 5+',
      steps: [
        'Create child user accounts',
        'Enable guided access',
        'Set content restrictions',
        'Configure app permissions',
        'Enable safe search'
      ]
    },
    {
      id: 'computer',
      title: 'Computer Safety',
      description: 'Secure computers for family use',
      icon: Monitor,
      ageGroup: 'Ages 6+',
      steps: [
        'Set up user accounts',
        'Enable parental controls',
        'Configure browser settings',
        'Install security updates',
        'Set up family user accounts'
      ]
    }
  ];

  const safetyFeatures = [
    {
      title: 'Content Filtering',
      description: 'Block inappropriate content automatically',
      icon: Shield,
      importance: 'High'
    },
    {
      title: 'Screen Time Limits',
      description: 'Control how long children can use devices',
      icon: Settings,
      importance: 'High'
    },
    {
      title: 'App Restrictions',
      description: 'Control which apps children can access',
      icon: Smartphone,
      importance: 'Medium'
    },
    {
      title: 'Location Sharing',
      description: 'Decide whether apps can see your child\'s location—and turn it off when not needed',
      icon: Monitor,
      importance: 'Medium'
    },
    {
      title: 'Purchase Controls',
      description: 'Prevent unauthorized app purchases',
      icon: AlertTriangle,
      importance: 'High'
    },
    {
      title: 'Privacy Settings',
      description: 'Review what each app is allowed to access (camera, contacts, microphone)',
      icon: Shield,
      importance: 'Medium'
    }
  ];

  return (
    <PageLayout
      title="Child-Friendly Device Setup"
      subtitle="Set up parental controls and privacy settings on phones, tablets, and computers. Pick your device type below to see step-by-step instructions."
      breadcrumbs={true}
    >
      <div className="max-w-4xl mx-auto">
        {/* Introduction */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-6 text-primary">
            Pick your device to get started
          </h2>
          <p className="text-lg leading-relaxed mb-8 text-gray-600 dark:text-gray-300">
            Each guide walks you through the settings that matter most. Plan about 15 minutes per device.
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8 bg-light">
            <h3 className="text-xl font-semibold mb-4 text-primary">
              🛡️ Why Device Setup Matters
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1 text-primary">Prevents Accidents</h4>
                  <p className="text-sm text-gray-600">Blocks inappropriate content before children encounter it</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1 text-primary">Teaches Boundaries</h4>
                  <p className="text-sm text-gray-600">Helps children understand digital limits and rules</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1 text-primary">Builds Trust</h4>
                  <p className="text-sm text-gray-600">Shows children you care about their safety</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1 text-primary">Peace of Mind</h4>
                  <p className="text-sm text-gray-600">Gives parents confidence in their children's online safety</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Device Setup Guides */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center text-primary">
            Device-Specific Setup Guides
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {deviceTypes.map((device) => {
              const IconComponent = device.icon;
              return (
                <div
                  key={device.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-shadow hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="aspect-w-4 aspect-h-3 bg-gray-100">
                    <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                      <IconComponent size={48} className="text-blue-600" />
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold text-primary">
                        {device.title}
                      </h3>
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800 dark:bg-green-900/40 dark:text-green-200">
                        {device.ageGroup}
                      </span>
                    </div>
                    
                    <p className="text-sm mb-4 text-gray-600">
                      {device.description}
                    </p>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-2 text-primary">
                        Setup Steps:
                      </h4>
                      <ul className="text-sm space-y-1 text-gray-600">
                        {device.steps.map((step, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="font-bold text-green-700 dark:text-green-400">{index + 1}.</span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <button className="w-full rounded-lg bg-green-700 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-500">
                      View Detailed Guide
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Safety Features */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center text-primary">
            Essential Safety Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {safetyFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent size={24} className="text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-primary">
                          {feature.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          feature.importance === 'High' ? 'bg-red-100 text-red-800' :
                          feature.importance === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {feature.importance}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Setup Checklist */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-6">
              Quick Setup Checklist
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Before Setup:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} />
                    Research age-appropriate apps and content
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} />
                    Decide how much screen time feels right
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} />
                    Choose which apps and settings to restrict
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">After Setup:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} />
                    Test all restrictions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} />
                    Walk through the settings with your child
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} />
                    Check in monthly—adjust as they grow
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} />
                    Update settings as needed
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center text-primary">
            Related Resources
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/guides/app-selection"
              className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-md transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Smartphone size={24} className="text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-primary">
                App Selection Guide
              </h3>
              <p className="text-sm text-gray-600">
                Learn how to choose safe and educational apps
              </p>
            </Link>

            <Link
              to="/downloads/family-agreement"
              className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-md transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Shield size={24} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-primary">
                Family Agreement
              </h3>
              <p className="text-sm text-gray-600">
                Create a family internet agreement
              </p>
            </Link>

            <Link
              to="/for-families"
              className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-md transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Settings size={24} className="text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-primary">
                Parent Resources
              </h3>
              <p className="text-sm text-gray-600">
                Additional tools and resources for parents
              </p>
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default DeviceSetupGuidePage;