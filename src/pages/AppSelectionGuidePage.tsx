import React, { useEffect } from 'react';
import { Smartphone, Star, Shield, AlertTriangle, CheckCircle, Search, Download } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const AppSelectionGuidePage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const appCategories = [
    {
      id: 'educational',
      title: 'Educational Apps',
      description: 'Apps that teach while entertaining',
      icon: Star,
      ageGroup: 'All Ages',
      examples: ['Khan Academy Kids', 'Duolingo', 'Scratch Jr', 'ABCmouse'],
      criteria: [
        'Clear learning objectives',
        'Age-appropriate content',
        'No in-app purchases',
        'Positive reinforcement'
      ]
    },
    {
      id: 'creative',
      title: 'Creative Apps',
      description: 'Apps that encourage creativity and expression',
      icon: Download,
      ageGroup: 'Ages 5+',
      examples: ['Procreate', 'GarageBand', 'Canva', 'Tinkercad'],
      criteria: [
        'Safe sharing options',
        'No inappropriate content',
        'Encourages creativity',
        'Parental controls available'
      ]
    },
    {
      id: 'social',
      title: 'Social Apps',
      description: 'Apps for communication and social interaction',
      icon: Smartphone,
      ageGroup: 'Ages 13+',
      examples: ['Discord', 'WhatsApp', 'Zoom', 'FaceTime'],
      criteria: [
        'Privacy settings available',
        'Report/block features',
        'Age verification',
        'Parental monitoring'
      ]
    },
    {
      id: 'entertainment',
      title: 'Entertainment Apps',
      description: 'Apps for fun and relaxation',
      icon: Star,
      ageGroup: 'Varies',
      examples: ['Netflix Kids', 'YouTube Kids', 'Spotify', 'PBS Kids'],
      criteria: [
        'Content filtering',
        'Time limits available',
        'No inappropriate ads',
        'Educational value'
      ]
    }
  ];

  const redFlags = [
    {
      title: 'Excessive In-App Purchases',
      description: 'Apps that constantly push for purchases or subscriptions',
      icon: AlertTriangle,
      severity: 'High'
    },
    {
      title: 'Poor Privacy Policy',
      description: 'Apps that collect excessive data or share with third parties',
      icon: Shield,
      severity: 'High'
    },
    {
      title: 'Inappropriate Content',
      description: 'Apps with violence, adult themes, or inappropriate language',
      icon: AlertTriangle,
      severity: 'Critical'
    },
    {
      title: 'No Parental Controls',
      description: 'Apps without options for parents to monitor or restrict usage',
      icon: Shield,
      severity: 'Medium'
    },
    {
      title: 'Excessive Data Collection',
      description: 'Apps that request unnecessary permissions or personal information',
      icon: AlertTriangle,
      severity: 'High'
    },
    {
      title: 'Poor Reviews',
      description: 'Apps with consistently negative reviews from parents',
      icon: Star,
      severity: 'Medium'
    }
  ];

  const ageRecommendations = [
    {
      age: 'Ages 2-5',
      recommendations: [
        'Simple, colorful interfaces',
        'No text-based communication',
        'Educational content only',
        'Parental controls essential'
      ]
    },
    {
      age: 'Ages 6-8',
      recommendations: [
        'Basic reading skills required',
        'Limited social features',
        'Educational games preferred',
        'Supervised usage recommended'
      ]
    },
    {
      age: 'Ages 9-12',
      recommendations: [
        'More complex games allowed',
        'Limited social interaction',
        'Educational value important',
        'Regular monitoring needed'
      ]
    },
    {
      age: 'Ages 13+',
      recommendations: [
        'Social apps with restrictions',
        'More independence allowed',
        'Privacy education crucial',
        'Open communication essential'
      ]
    }
  ];

  return (
    <PageLayout
      title="Choosing Child-Safe Apps"
      subtitle="Comprehensive guide to selecting appropriate digital content and apps for children of all ages. Learn what to look for and what to avoid."
      icon={Smartphone}
      badge="PARENT GUIDE"
      breadcrumbs={true}
    >
      <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
        {/* Introduction */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
            Making Smart App Choices
          </h2>
          <p className="text-lg leading-relaxed mb-8" style={{ color: 'var(--gray-600)' }}>
            With millions of apps available, choosing the right ones for your children can be overwhelming. This guide provides clear criteria and recommendations to help you make informed decisions.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8" style={{ backgroundColor: 'var(--light)' }}>
            <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--primary)' }}>
              📱 App Selection Principles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1" style={{ color: 'var(--primary)' }}>Age Appropriateness</h4>
                  <p className="text-sm" style={{ color: 'var(--gray-600)' }}>Content and complexity match your child's developmental stage</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1" style={{ color: 'var(--primary)' }}>Educational Value</h4>
                  <p className="text-sm" style={{ color: 'var(--gray-600)' }}>Apps should teach, inspire, or develop skills</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1" style={{ color: 'var(--primary)' }}>Privacy Protection</h4>
                  <p className="text-sm" style={{ color: 'var(--gray-600)' }}>Strong privacy policies and minimal data collection</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1" style={{ color: 'var(--primary)' }}>Parental Controls</h4>
                  <p className="text-sm" style={{ color: 'var(--gray-600)' }}>Options for monitoring and restricting usage</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* App Categories */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: 'var(--primary)' }}>
            App Categories & Recommendations
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {appCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <div
                  key={category.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  style={{ backgroundColor: 'var(--card-color)' }}
                >
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <IconComponent size={24} className="text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold" style={{ color: 'var(--primary)' }}>
                          {category.title}
                        </h3>
                        <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
                          {category.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                        Examples:
                      </h4>
                      <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
                        {category.examples.join(', ')}
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                        Selection Criteria:
                      </h4>
                      <ul className="text-sm space-y-1" style={{ color: 'var(--gray-600)' }}>
                        {category.criteria.map((criterion, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle size={14} className="text-green-600 mt-1 flex-shrink-0" />
                            {criterion}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {category.ageGroup}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Red Flags */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: 'var(--primary)' }}>
            Red Flags to Avoid
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {redFlags.map((flag, index) => {
              const IconComponent = flag.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
                  style={{ backgroundColor: 'var(--card-color)' }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      flag.severity === 'Critical' ? 'bg-red-100' :
                      flag.severity === 'High' ? 'bg-orange-100' :
                      'bg-yellow-100'
                    }`}>
                      <IconComponent size={24} className={
                        flag.severity === 'Critical' ? 'text-red-600' :
                        flag.severity === 'High' ? 'text-orange-600' :
                        'text-yellow-600'
                      } />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold" style={{ color: 'var(--primary)' }}>
                          {flag.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          flag.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                          flag.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {flag.severity}
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
                        {flag.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Age Recommendations */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: 'var(--primary)' }}>
            Age-Specific Recommendations
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ageRecommendations.map((rec, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
                style={{ backgroundColor: 'var(--card-color)' }}
              >
                <h3 className="text-lg font-bold mb-4 text-center" style={{ color: 'var(--primary)' }}>
                  {rec.age}
                </h3>
                <ul className="space-y-2">
                  {rec.recommendations.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2 text-sm" style={{ color: 'var(--gray-600)' }}>
                      <CheckCircle size={14} className="text-green-600 mt-1 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* App Review Process */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-6">
              How to Review Apps Before Downloading
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Research Phase:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Search size={16} />
                    Read app store reviews from parents
                  </li>
                  <li className="flex items-center gap-2">
                    <Search size={16} />
                    Check age ratings and content warnings
                  </li>
                  <li className="flex items-center gap-2">
                    <Search size={16} />
                    Research the developer's reputation
                  </li>
                  <li className="flex items-center gap-2">
                    <Search size={16} />
                    Look for educational endorsements
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Testing Phase:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} />
                    Download and test yourself first
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} />
                    Check all settings and permissions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} />
                    Monitor initial usage with child
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} />
                    Set up parental controls immediately
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: 'var(--primary)' }}>
            Related Resources
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/guides/device-setup"
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
              style={{ backgroundColor: 'var(--card-color)' }}
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Shield size={24} className="text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                Device Setup Guide
              </h3>
              <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
                Learn how to configure devices with appropriate controls
              </p>
            </Link>

            <Link
              to="/guides/modeling-behavior"
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
              style={{ backgroundColor: 'var(--card-color)' }}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Star size={24} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                Modeling Behavior
              </h3>
              <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
                Tips for demonstrating healthy online behavior
              </p>
            </Link>

            <Link
              to="/parent-resources"
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
              style={{ backgroundColor: 'var(--card-color)' }}
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Smartphone size={24} className="text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                Parent Resources
              </h3>
              <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
                Additional tools and resources for parents
              </p>
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AppSelectionGuidePage;