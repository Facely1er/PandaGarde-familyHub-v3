import React, { useEffect } from 'react';
import { Users, Eye, Heart, MessageCircle, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const ModelingBehaviorGuidePage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const modelingAreas = [
    {
      id: 'digital-balance',
      title: 'Digital Balance',
      description: 'Demonstrating healthy screen time habits',
      icon: Eye,
      examples: [
        'Put phones away during meals',
        'Set specific times for checking messages',
        'Take breaks from screens regularly',
        'Engage in offline activities'
      ],
      tips: [
        'Children learn by watching your behavior',
        'Be consistent with your own screen time rules',
        'Explain your digital choices to children',
        'Create device-free zones in your home'
      ]
    },
    {
      id: 'privacy-practices',
      title: 'Privacy Practices',
      description: 'Showing how to protect personal information',
      icon: Shield,
      examples: [
        'Use strong, unique passwords',
        'Enable two-factor authentication',
        'Review privacy settings regularly',
        'Be cautious about sharing personal details'
      ],
      tips: [
        'Explain why you\'re protecting your information',
        'Show children how to check privacy settings',
        'Demonstrate safe password creation',
        'Discuss what information is safe to share'
      ]
    },
    {
      id: 'online-communication',
      title: 'Online Communication',
      description: 'Modeling respectful and safe online interactions',
      icon: MessageCircle,
      examples: [
        'Be kind and respectful in online comments',
        'Think before posting or sharing',
        'Respect others\' privacy online',
        'Handle disagreements maturely'
      ],
      tips: [
        'Show children how to communicate respectfully',
        'Demonstrate how to handle online conflicts',
        'Teach the importance of digital empathy',
        'Model appropriate sharing behavior'
      ]
    },
    {
      id: 'critical-thinking',
      title: 'Critical Thinking',
      description: 'Teaching children to evaluate online information',
      icon: Heart,
      examples: [
        'Question suspicious information',
        'Verify facts before sharing',
        'Recognize clickbait and scams',
        'Evaluate sources of information'
      ],
      tips: [
        'Show children how you fact-check information',
        'Discuss why some sources are more reliable',
        'Demonstrate healthy skepticism',
        'Teach children to ask questions'
      ]
    }
  ];

  const dailyPractices = [
    {
      time: 'Morning',
      practices: [
        'Check devices only after morning routine',
        'Use phones for positive purposes (weather, news)',
        'Avoid checking work emails during family time',
        'Set a good example for screen time limits'
      ]
    },
    {
      time: 'During Work/School',
      practices: [
        'Use technology productively',
        'Take regular breaks from screens',
        'Demonstrate focus and concentration',
        'Show appropriate workplace behavior'
      ]
    },
    {
      time: 'Evening',
      practices: [
        'Put devices away during dinner',
        'Engage in offline family activities',
        'Avoid work calls during family time',
        'Model healthy bedtime routines'
      ]
    },
    {
      time: 'Weekends',
      practices: [
        'Balance screen time with outdoor activities',
        'Use technology for learning and creativity',
        'Demonstrate digital detox practices',
        'Show the value of face-to-face interaction'
      ]
    }
  ];

  const conversationStarters = [
    {
      topic: 'Privacy Settings',
      question: 'Why do you think I\'m checking my privacy settings?',
      discussion: 'Explain how you protect your information and why it matters'
    },
    {
      topic: 'Screen Time',
      question: 'What do you notice about how I use my phone?',
      discussion: 'Discuss your own screen time habits and boundaries'
    },
    {
      topic: 'Online Safety',
      question: 'What would you do if someone asked for personal information online?',
      discussion: 'Share your own safety practices and decision-making process'
    },
    {
      topic: 'Digital Footprint',
      question: 'What do you think people can learn about me from my online activity?',
      discussion: 'Explain how your online presence affects your reputation'
    }
  ];

  return (
    <PageLayout
      title="Modeling Good Digital Citizenship"
      subtitle="Children learn digital behavior by watching adults. This guide shows you how to model healthy online habits and create a positive digital environment for your family."
      icon={Users}
      badge="PARENT GUIDE"
      breadcrumbs={true}
    >
      <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
        {/* Introduction */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
            Leading by Example
          </h2>
          <p className="text-lg leading-relaxed mb-8" style={{ color: 'var(--gray-600)' }}>
            Children are always watching and learning from adult behavior. When it comes to digital citizenship, your actions speak louder than your words. This guide helps you become a positive digital role model.
          </p>
          
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-8" style={{ backgroundColor: 'var(--light)' }}>
            <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--primary)' }}>
              👨‍👩‍👧‍👦 Why Modeling Matters
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start gap-3">
                <Eye size={20} className="text-purple-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1" style={{ color: 'var(--primary)' }}>Children Learn by Watching</h4>
                  <p className="text-sm" style={{ color: 'var(--gray-600)' }}>They observe and imitate adult behavior patterns</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Eye size={20} className="text-purple-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1" style={{ color: 'var(--primary)' }}>Consistency Builds Trust</h4>
                  <p className="text-sm" style={{ color: 'var(--gray-600)' }}>When your actions match your words, children trust your guidance</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Eye size={20} className="text-purple-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1" style={{ color: 'var(--primary)' }}>Creates Family Culture</h4>
                  <p className="text-sm" style={{ color: 'var(--gray-600)' }}>Establishes shared values and expectations</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Eye size={20} className="text-purple-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1" style={{ color: 'var(--primary)' }}>Prevents Hypocrisy</h4>
                  <p className="text-sm" style={{ color: 'var(--gray-600)' }}>Avoids "do as I say, not as I do" situations</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modeling Areas */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: 'var(--primary)' }}>
            Key Areas to Model
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {modelingAreas.map((area) => {
              const IconComponent = area.icon;
              return (
                <div
                  key={area.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  style={{ backgroundColor: 'var(--card-color)' }}
                >
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <IconComponent size={24} className="text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold" style={{ color: 'var(--primary)' }}>
                          {area.title}
                        </h3>
                        <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
                          {area.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                        Examples to Demonstrate:
                      </h4>
                      <ul className="text-sm space-y-1" style={{ color: 'var(--gray-600)' }}>
                        {area.examples.map((example, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle size={14} className="text-green-600 mt-1 flex-shrink-0" />
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                        Teaching Tips:
                      </h4>
                      <ul className="text-sm space-y-1" style={{ color: 'var(--gray-600)' }}>
                        {area.tips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <AlertTriangle size={14} className="text-blue-600 mt-1 flex-shrink-0" />
                            {tip}
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

        {/* Daily Practices */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: 'var(--primary)' }}>
            Daily Modeling Practices
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dailyPractices.map((practice, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
                style={{ backgroundColor: 'var(--card-color)' }}
              >
                <h3 className="text-lg font-bold mb-4 text-center" style={{ color: 'var(--primary)' }}>
                  {practice.time}
                </h3>
                <ul className="space-y-2">
                  {practice.practices.map((item, itemIndex) => (
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

        {/* Conversation Starters */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: 'var(--primary)' }}>
            Conversation Starters
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {conversationStarters.map((starter, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
                style={{ backgroundColor: 'var(--card-color)' }}
              >
                <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--primary)' }}>
                  {starter.topic}
                </h3>
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                    Ask:
                  </h4>
                  <p className="text-sm italic" style={{ color: 'var(--gray-600)' }}>
                    "{starter.question}"
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                    Discuss:
                  </h4>
                  <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
                    {starter.discussion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Common Mistakes */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-6">
              Common Modeling Mistakes to Avoid
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">❌ Don't:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <AlertTriangle size={16} />
                    Use phones during family meals
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle size={16} />
                    Share personal information carelessly
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle size={16} />
                    React emotionally to online content
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle size={16} />
                    Ignore privacy settings
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">✅ Do:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} />
                    Model healthy screen time boundaries
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} />
                    Demonstrate thoughtful sharing
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} />
                    Show calm, rational responses
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} />
                    Regularly review and update settings
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
              to="/guides/privacy-concerns"
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
              style={{ backgroundColor: 'var(--card-color)' }}
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Shield size={24} className="text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                Privacy Concerns Guide
              </h3>
              <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
                Learn how to respond when privacy issues arise
              </p>
            </Link>

            <Link
              to="/guides/device-setup"
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
              style={{ backgroundColor: 'var(--card-color)' }}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Users size={24} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                Device Setup Guide
              </h3>
              <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
                Configure devices with appropriate controls
              </p>
            </Link>

            <Link to="/family-hub"
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
              style={{ backgroundColor: 'var(--card-color)' }}
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Heart size={24} className="text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                Family Hub
              </h3>
              <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
                Track family progress and digital activities
              </p>
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ModelingBehaviorGuidePage;