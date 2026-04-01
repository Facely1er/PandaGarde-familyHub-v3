import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, Shield, Heart, Brain, CheckCircle } from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';

const AgeSpecificGuidePage: React.FC = () => {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('5-8');

  const ageGroups = [
    {
      id: '5-8',
      label: 'Ages 5-8',
      icon: Heart,
      color: 'green',
      description: 'Early learners who are just beginning to explore digital devices'
    },
    {
      id: '9-12',
      label: 'Ages 9-12',
      icon: Shield,
      color: 'blue',
      description: 'Elementary school children with growing digital independence'
    },
    {
      id: '13-17',
      label: 'Ages 13-17',
      icon: Brain,
      color: 'purple',
      description: 'Teens navigating social media and complex online relationships'
    }
  ];

  const getAgeGroupContent = (ageGroup: string) => {
    switch (ageGroup) {
      case '5-8':
        return {
          title: 'Early Digital Learners (Ages 5-8)',
          concepts: [
            'Personal information is like a secret - only share with trusted adults',
            'The internet is like a big playground - stay where adults can see you',
            'If something online makes you feel uncomfortable, tell an adult',
            'Never share your name, address, or school with strangers'
          ],
          activities: [
            'Privacy Panda coloring activities',
            '"Safe or Unsafe" sorting games',
            'Role-playing scenarios with stuffed animals',
            'Simple password creation games'
          ],
          conversationStarters: [
            'What information about yourself would you tell a stranger at the playground?',
            'If someone online asked for your address, what would you do?',
            'How do you know if a website is safe for kids?'
          ],
          parentalGuidance: [
            'Supervise all online activities',
            'Use child-friendly apps and websites only',
            'Set up parental controls on all devices',
            'Model good digital behavior'
          ]
        };
      case '9-12':
        return {
          title: 'Growing Digital Citizens (Ages 9-12)',
          concepts: [
            'Understanding digital footprints and permanence',
            'Password security and why it matters',
            'Recognizing phishing and suspicious content',
            'Privacy settings and how to use them'
          ],
          activities: [
            'Password strength challenges',
            'Digital footprint mapping',
            'Privacy settings exploration',
            'Safe online research projects'
          ],
          conversationStarters: [
            'What would happen if everyone could see everything you post online?',
            'How can you tell if a website or app is trustworthy?',
            'Why do you think some people try to trick others online?'
          ],
          parentalGuidance: [
            'Monitor online activities regularly',
            'Teach critical thinking about online content',
            'Discuss the permanence of online posts',
            'Encourage questions and open communication'
          ]
        };
      case '13-17':
        return {
          title: 'Digital Natives (Ages 13-17)',
          concepts: [
            'Data privacy and how companies collect information',
            'Social media privacy and reputation management',
            'Cybersecurity threats and protection strategies',
            'Digital rights and responsibilities'
          ],
          activities: [
            'Privacy policy analysis',
            'Social media audit projects',
            'Cybersecurity simulations',
            'Digital citizenship campaigns'
          ],
          conversationStarters: [
            'How do you think social media companies make money?',
            'What would you do if someone posted something embarrassing about you?',
            'How can you protect your friends\' privacy online?'
          ],
          parentalGuidance: [
            'Respect their growing independence while maintaining safety',
            'Discuss real-world consequences of online actions',
            'Help them understand their digital rights',
            'Support their development of critical thinking skills'
          ]
        };
      default:
        return null;
    }
  };

  const content = getAgeGroupContent(selectedAgeGroup);

  if (!content) {
    return null;
  }

  return (
    <PageLayout
      title="Age-Specific Privacy Education Guide"
      subtitle="Tailored privacy education strategies for different age groups. Learn age-appropriate concepts, activities, and conversation starters for children ages 5-17."
      icon={Users}
      badge="AGE-SPECIFIC GUIDE"
      breadcrumbs={true}
    >
      <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
        {/* Header Section */}
        <section style={{ marginBottom: 'clamp(3rem, 6vw, 4rem)' }}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><pattern id='grain' width='100' height='100' patternUnits='userSpaceOnUse'><circle cx='20' cy='20' r='1' fill='rgba(255,255,255,0.1)'/><circle cx='80' cy='40' r='1' fill='rgba(255,255,255,0.05)'/><circle cx='40' cy='80' r='1' fill='rgba(255,255,255,0.1)'/></pattern></defs><rect width='100%' height='100%' fill='url(%23grain)'/></svg>")`
            }} />
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="flex items-center justify-center mb-8">
              <div className="w-20 h-20 mr-4">
                <Users size={40} className="text-green-600" />
              </div>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-6">
                <Users size={16} />
                <span className="text-sm font-semibold">AGE-SPECIFIC GUIDES</span>
              </div>

              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Age-Specific Privacy Guides
              </h1>

              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Tailored guides for different age groups, covering developmentally appropriate concepts and teaching strategies for each stage.
              </p>
            </div>
          </div>
        </section>
      {/* Age Group Selector */}
      <div style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        padding: '1.5rem 0',
        marginBottom: 'clamp(2rem, 4vw, 3rem)'
      }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '0 1.5rem' }}>
          <div className="flex flex-wrap gap-4 justify-center">
            {ageGroups.map((group) => {
              const IconComponent = group.icon;
              const isSelected = selectedAgeGroup === group.id;
              return (
                <button
                  key={group.id}
                  onClick={() => setSelectedAgeGroup(group.id)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-lg font-semibold transition-colors ${
                    isSelected
                      ? `bg-${group.color}-600 text-white`
                      : `bg-${group.color}-100 text-${group.color}-700 hover:bg-${group.color}-200`
                  }`}
                >
                  <IconComponent size={20} />
                  <div className="text-left">
                    <div className="font-bold">{group.label}</div>
                    <div className="text-xs opacity-80">{group.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

          
          {/* Selected Age Group Content */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8" style={{ color: 'var(--primary)' }}>
              {content.title}
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Key Concepts */}
              <div className="bg-white rounded-xl p-6 shadow-md" style={{ backgroundColor: 'var(--card-color)' }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--primary)' }}>Key Concepts to Teach</h3>
                <ul className="space-y-3">
                  {content.concepts.map((concept, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle size={20} className="text-green-600 mt-1 flex-shrink-0" />
                      <span className="text-sm" style={{ color: 'var(--gray-600)' }}>{concept}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Activities */}
              <div className="bg-white rounded-xl p-6 shadow-md" style={{ backgroundColor: 'var(--card-color)' }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--primary)' }}>Recommended Activities</h3>
                <ul className="space-y-3">
                  {content.activities.map((activity, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <BookOpen size={20} className="text-blue-600 mt-1 flex-shrink-0" />
                      <span className="text-sm" style={{ color: 'var(--gray-600)' }}>{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Conversation Starters */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8" style={{ color: 'var(--primary)' }}>
              Conversation Starters
            </h2>
            
            <div className="bg-white rounded-xl p-6 shadow-md" style={{ backgroundColor: 'var(--card-color)' }}>
              <p className="text-sm mb-4" style={{ color: 'var(--gray-600)' }}>
                Use these questions to start meaningful conversations about digital privacy with your child:
              </p>
              <div className="space-y-4">
                {content.conversationStarters.map((starter, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4" style={{ backgroundColor: 'var(--light)' }}>
                    <p className="text-sm font-medium" style={{ color: 'var(--gray-700)' }}>
                      "{starter}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Parental Guidance */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8" style={{ color: 'var(--primary)' }}>
              Parental Guidance Tips
            </h2>
            
            <div className="bg-white rounded-xl p-6 shadow-md" style={{ backgroundColor: 'var(--card-color)' }}>
              <ul className="space-y-4">
                {content.parentalGuidance.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-600 font-bold text-sm">{index + 1}</span>
                    </div>
                    <span className="text-sm" style={{ color: 'var(--gray-600)' }}>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Age-Specific Resources */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8" style={{ color: 'var(--primary)' }}>
              Age-Specific Resources
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedAgeGroup === '5-8' && (
                <>
                  <Link
                    to="/downloads/coloring-sheets"
                    className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
                    style={{ backgroundColor: 'var(--card-color)' }}
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <Heart size={24} className="text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                      Coloring Sheets
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
                      Fun activities for young learners
                    </p>
                  </Link>

                  <Link
                    to="/story"
                    className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
                    style={{ backgroundColor: 'var(--card-color)' }}
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <BookOpen size={24} className="text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                      Privacy Panda Story
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
                      Interactive story for young children
                    </p>
                  </Link>

                  <Link
                    to="/activity-book"
                    className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
                    style={{ backgroundColor: 'var(--card-color)' }}
                  >
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <Shield size={24} className="text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                      Activity Book
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
                      Hands-on learning activities
                    </p>
                  </Link>
                </>
              )}

              {selectedAgeGroup === '9-12' && (
                <>
                  <Link
                    to="/privacy-handbook"
                    className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
                    style={{ backgroundColor: 'var(--card-color)' }}
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <BookOpen size={24} className="text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                      Privacy Handbook
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
                      Comprehensive guide for elementary students
                    </p>
                  </Link>

                  <Link
                    to="/downloads/safety-posters"
                    className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
                    style={{ backgroundColor: 'var(--card-color)' }}
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <Shield size={24} className="text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                      Safety Posters
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
                      Visual reminders for classrooms
                    </p>
                  </Link>

                  <Link
                    to="/privacy-tools"
                    className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
                    style={{ backgroundColor: 'var(--card-color)' }}
                  >
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <Brain size={24} className="text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                      Privacy Tools
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
                      Interactive tools and games
                    </p>
                  </Link>
                </>
              )}

              {selectedAgeGroup === '13-17' && (
                <>
                  <Link
                    to="/teen-handbook"
                    className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
                    style={{ backgroundColor: 'var(--card-color)' }}
                  >
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <Brain size={24} className="text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                      Teen Handbook
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
                      Advanced privacy concepts for teens
                    </p>
                  </Link>

                  <Link
                    to="/digital-citizenship"
                    className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
                    style={{ backgroundColor: 'var(--card-color)' }}
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <Users size={24} className="text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                      Digital Citizenship
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
                      Responsible online behavior
                    </p>
                  </Link>

                  <Link
                    to="/digital-rights"
                    className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
                    style={{ backgroundColor: 'var(--card-color)' }}
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <Shield size={24} className="text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                      Digital Rights
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
                      Understanding your digital rights
                    </p>
                  </Link>
                </>
              )}
            </div>
          </section>

        {/* Call to Action */}
        <section style={{ marginTop: 'clamp(2rem, 4vw, 3rem)' }}>
          <div style={{
            background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
            borderRadius: '16px',
            padding: '2rem',
            color: 'white',
            textAlign: 'center'
          }}>
          <h2 style={{ 
            fontSize: 'clamp(1.5rem, 3vw, 1.875rem)', 
            fontWeight: 700, 
            marginBottom: '1rem'
          }}>
            Ready to Start Teaching Privacy?
          </h2>
          <p style={{ 
            fontSize: '1.125rem', 
            marginBottom: '1.5rem', 
            opacity: 0.9,
            lineHeight: 1.6
          }}>
            Choose the resources that best fit your child's age and start having meaningful conversations about digital privacy today.
          </p>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '1rem', 
            justifyContent: 'center' 
          }}>
            <Link
              to="/resources"
              style={{
                background: 'white',
                color: '#1B5E20',
                padding: '0.875rem 1.5rem',
                borderRadius: '12px',
                fontWeight: 600,
                textDecoration: 'none',
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
              Explore All Resources
            </Link>
            <Link
              to="/downloads/family-agreement"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                padding: '0.875rem 1.5rem',
                borderRadius: '12px',
                fontWeight: 600,
                textDecoration: 'none',
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
              Download Family Agreement
            </Link>
          </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default AgeSpecificGuidePage;