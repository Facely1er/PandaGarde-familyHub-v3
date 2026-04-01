import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Shield, Users, MessageCircle, CheckCircle, Phone, FileText } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const PrivacyConcernsGuidePage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const commonConcerns = [
    {
      id: 'data-breach',
      title: 'Data Breach',
      description: 'When personal information is exposed due to security failures',
      icon: AlertTriangle,
      severity: 'High',
      signs: [
        'Unusual account activity',
        'Emails about password changes you didn\'t make',
        'Suspicious login attempts',
        'Unexpected charges or transactions'
      ],
      actions: [
        'Change passwords immediately',
        'Enable two-factor authentication',
        'Monitor accounts for suspicious activity',
        'Contact affected services'
      ]
    },
    {
      id: 'identity-theft',
      title: 'Identity Theft',
      description: 'When someone uses personal information fraudulently',
      icon: Shield,
      severity: 'Critical',
      signs: [
        'New accounts opened in your name',
        'Credit report shows unknown accounts',
        'Bills for services you didn\'t use',
        'Denied credit applications'
      ],
      actions: [
        'Contact credit bureaus immediately',
        'File a police report',
        'Place fraud alerts on credit reports',
        'Monitor all financial accounts'
      ]
    },
    {
      id: 'cyberbullying',
      title: 'Cyberbullying',
      description: 'Online harassment, intimidation, or threats',
      icon: Users,
      severity: 'High',
      signs: [
        'Sudden changes in behavior',
        'Avoiding devices or social media',
        'Emotional distress after online activity',
        'Declining school performance'
      ],
      actions: [
        'Document all evidence',
        'Block and report the perpetrator',
        'Contact school administrators',
        'Seek professional support if needed'
      ]
    },
    {
      id: 'online-predators',
      title: 'Online Predators',
      description: 'Adults seeking inappropriate relationships with minors',
      icon: AlertTriangle,
      severity: 'Critical',
      signs: [
        'Secretive online behavior',
        'Receiving gifts from unknown sources',
        'Meeting requests from strangers',
        'Inappropriate conversations or content'
      ],
      actions: [
        'Contact law enforcement immediately',
        'Preserve all evidence',
        'Block all communication',
        'Seek professional counseling'
      ]
    },
    {
      id: 'phishing-scams',
      title: 'Phishing Scams',
      description: 'Fraudulent attempts to obtain sensitive information',
      icon: MessageCircle,
      severity: 'Medium',
      signs: [
        'Urgent requests for personal information',
        'Suspicious emails or messages',
        'Links to fake websites',
        'Requests for passwords or payment'
      ],
      actions: [
        'Don\'t click suspicious links',
        'Verify sender identity',
        'Report to appropriate authorities',
        'Educate family about scam tactics'
      ]
    },
    {
      id: 'reputation-damage',
      title: 'Reputation Damage',
      description: 'Negative information affecting online reputation',
      icon: FileText,
      severity: 'Medium',
      signs: [
        'Negative search results',
        'Inappropriate photos or posts',
        'False information circulating',
        'Professional or social consequences'
      ],
      actions: [
        'Document all negative content',
        'Contact platforms for removal',
        'Create positive content to counterbalance',
        'Consider professional reputation management'
      ]
    }
  ];

  const responseSteps = [
    {
      step: 1,
      title: 'Stay Calm',
      description: 'Take a deep breath and don\'t panic. Most privacy issues can be resolved with quick action.',
      icon: CheckCircle
    },
    {
      step: 2,
      title: 'Assess the Situation',
      description: 'Determine the scope and severity of the privacy concern. What information is at risk?',
      icon: AlertTriangle
    },
    {
      step: 3,
      title: 'Secure Accounts',
      description: 'Change passwords, enable two-factor authentication, and review account settings.',
      icon: Shield
    },
    {
      step: 4,
      title: 'Document Everything',
      description: 'Screenshot evidence, save emails, and keep records of all communications.',
      icon: FileText
    },
    {
      step: 5,
      title: 'Report and Seek Help',
      description: 'Contact appropriate authorities, platforms, or professionals for assistance.',
      icon: Phone
    },
    {
      step: 6,
      title: 'Monitor and Follow Up',
      description: 'Continue monitoring the situation and take additional steps as needed.',
      icon: CheckCircle
    }
  ];

  const preventionTips = [
    {
      category: 'Account Security',
      tips: [
        'Use strong, unique passwords for each account',
        'Enable two-factor authentication everywhere possible',
        'Regularly review and update privacy settings',
        'Use a password manager to generate and store passwords'
      ]
    },
    {
      category: 'Information Sharing',
      tips: [
        'Think before sharing personal information online',
        'Be cautious about what you post on social media',
        'Don\'t share sensitive information in public forums',
        'Regularly audit your online presence'
      ]
    },
    {
      category: 'Device Security',
      tips: [
        'Keep all devices and software updated',
        'Use antivirus and security software',
        'Be cautious about public Wi-Fi networks',
        'Enable device tracking and remote wipe capabilities'
      ]
    },
    {
      category: 'Communication Safety',
      tips: [
        'Be skeptical of unsolicited messages',
        'Verify the identity of people you communicate with',
        'Don\'t click on suspicious links or attachments',
        'Educate family members about online safety'
      ]
    }
  ];

  return (
    <PageLayout
      title="Responding to Privacy Concerns"
      subtitle="When privacy issues arise, quick and appropriate action is crucial. This guide helps you recognize, respond to, and recover from various privacy concerns."
      icon={AlertTriangle}
      badge="EMERGENCY GUIDE"
      breadcrumbs={true}
    >
      <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
        {/* Introduction */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
            Quick Response is Key
          </h2>
          <p className="text-lg leading-relaxed mb-8" style={{ color: 'var(--gray-600)' }}>
            Privacy concerns can range from minor inconveniences to serious threats. The key is to recognize the signs early and take appropriate action quickly. This guide covers the most common privacy issues and how to respond effectively.
          </p>
          
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8" style={{ backgroundColor: 'var(--light)' }}>
            <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--primary)' }}>
              🚨 Emergency Contacts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start gap-3">
                <Phone size={20} className="text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1" style={{ color: 'var(--primary)' }}>Law Enforcement</h4>
                  <p className="text-sm" style={{ color: 'var(--gray-600)' }}>Contact local police for serious privacy violations</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={20} className="text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1" style={{ color: 'var(--primary)' }}>FBI Internet Crime</h4>
                  <p className="text-sm" style={{ color: 'var(--gray-600)' }}>Report online crimes at ic3.gov</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={20} className="text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1" style={{ color: 'var(--primary)' }}>National Center for Missing & Exploited Children</h4>
                  <p className="text-sm" style={{ color: 'var(--gray-600)' }}>1-800-THE-LOST for child safety concerns</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={20} className="text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1" style={{ color: 'var(--primary)' }}>Crisis Text Line</h4>
                  <p className="text-sm" style={{ color: 'var(--gray-600)' }}>Text HOME to 741741 for immediate support</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Common Concerns */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: 'var(--primary)' }}>
            Common Privacy Concerns
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {commonConcerns.map((concern) => {
              const IconComponent = concern.icon;
              return (
                <div
                  key={concern.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  style={{ backgroundColor: 'var(--card-color)' }}
                >
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        concern.severity === 'Critical' ? 'bg-red-100' :
                        concern.severity === 'High' ? 'bg-orange-100' :
                        'bg-yellow-100'
                      }`}>
                        <IconComponent size={24} className={
                          concern.severity === 'Critical' ? 'text-red-600' :
                          concern.severity === 'High' ? 'text-orange-600' :
                          'text-yellow-600'
                        } />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold" style={{ color: 'var(--primary)' }}>
                            {concern.title}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            concern.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                            concern.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {concern.severity}
                          </span>
                        </div>
                        <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
                          {concern.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                        Warning Signs:
                      </h4>
                      <ul className="text-sm space-y-1" style={{ color: 'var(--gray-600)' }}>
                        {concern.signs.map((sign, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <AlertTriangle size={14} className="text-orange-600 mt-1 flex-shrink-0" />
                            {sign}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                        Immediate Actions:
                      </h4>
                      <ul className="text-sm space-y-1" style={{ color: 'var(--gray-600)' }}>
                        {concern.actions.map((action, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle size={14} className="text-green-600 mt-1 flex-shrink-0" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Response Steps */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: 'var(--primary)' }}>
            General Response Steps
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {responseSteps.map((step) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={step.step}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
                  style={{ backgroundColor: 'var(--card-color)' }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold">{step.step}</span>
                    </div>
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <IconComponent size={20} className="text-blue-600" />
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--primary)' }}>
                    {step.title}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Prevention Tips */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: 'var(--primary)' }}>
            Prevention Strategies
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {preventionTips.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
                style={{ backgroundColor: 'var(--card-color)' }}
              >
                <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--primary)' }}>
                  {category.category}
                </h3>
                <ul className="space-y-2">
                  {category.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start gap-2 text-sm" style={{ color: 'var(--gray-600)' }}>
                      <CheckCircle size={14} className="text-green-600 mt-1 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Recovery Resources */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-6">
              Recovery and Support Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Professional Support:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Users size={16} />
                    Family counseling services
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield size={16} />
                    Identity theft recovery services
                  </li>
                  <li className="flex items-center gap-2">
                    <MessageCircle size={16} />
                    Cyberbullying support groups
                  </li>
                  <li className="flex items-center gap-2">
                    <FileText size={16} />
                    Legal assistance for privacy violations
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Online Resources:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} />
                    Federal Trade Commission (FTC) identity theft resources
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} />
                    National Cyber Security Alliance
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} />
                    Stop.Think.Connect. campaign resources
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} />
                    Platform-specific safety centers
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
                Prevent issues with proper device configuration
              </p>
            </Link>

            <Link
              to="/guides/modeling-behavior"
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
              style={{ backgroundColor: 'var(--card-color)' }}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Users size={24} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                Modeling Behavior
              </h3>
              <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
                Teach children to recognize and avoid risks
              </p>
            </Link>

            <Link
              to="/support"
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
              style={{ backgroundColor: 'var(--card-color)' }}
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Phone size={24} className="text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                Support Center
              </h3>
              <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
                Get help and support for privacy concerns
              </p>
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default PrivacyConcernsGuidePage;