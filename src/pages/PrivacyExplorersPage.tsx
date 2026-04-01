import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, AlertTriangle, CheckCircle, Star, Trophy, Users, BookOpen, Gamepad2 } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: string;
  completed: boolean;
  points: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const PrivacyExplorersPage: React.FC = () => {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [showChallenge, setShowChallenge] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);

  const challenges: Challenge[] = [
    {
      id: 'password-strength',
      title: 'Password Fortress Challenge',
      description: 'Learn to create strong passwords and protect your accounts like a digital fortress.',
      difficulty: 'Easy',
      duration: '10 mins',
      completed: false,
      points: 50,
      icon: Lock
    },
    {
      id: 'privacy-settings',
      title: 'Privacy Settings Detective',
      description: 'Become a detective and learn how to find and adjust privacy settings on popular apps.',
      difficulty: 'Medium',
      duration: '15 mins',
      completed: false,
      points: 75,
      icon: Eye
    },
    {
      id: 'phishing-hunter',
      title: 'Phishing Hunter Mission',
      description: 'Spot fake emails and messages that try to trick you into giving away personal information.',
      difficulty: 'Hard',
      duration: '20 mins',
      completed: false,
      points: 100,
      icon: AlertTriangle
    },
    {
      id: 'digital-footprint',
      title: 'Digital Footprint Explorer',
      description: 'Discover what information you leave behind online and how to manage your digital trail.',
      difficulty: 'Medium',
      duration: '18 mins',
      completed: false,
      points: 80,
      icon: Shield
    },
    {
      id: 'social-media-safety',
      title: 'Social Media Safety Quest',
      description: 'Learn the dos and don\'ts of sharing on social media platforms safely.',
      difficulty: 'Easy',
      duration: '12 mins',
      completed: false,
      points: 60,
      icon: Users
    },
    {
      id: 'data-protection',
      title: 'Data Protection Warrior',
      description: 'Master the art of protecting your personal data from prying eyes.',
      difficulty: 'Hard',
      duration: '25 mins',
      completed: false,
      points: 120,
      icon: Shield
    }
  ];

  useEffect(() => {
    // Load user progress from localStorage
    const savedPoints = localStorage.getItem('privacy_explorers_points');
    const savedCompleted = localStorage.getItem('privacy_explorers_completed');

    if (savedPoints) {
      setUserPoints(parseInt(savedPoints, 10));
    }
    if (savedCompleted) {
      setCompletedChallenges(JSON.parse(savedCompleted));
    }
  }, []);

  const handleChallengeStart = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setShowChallenge(true);
  };

  const handleChallengeComplete = (challengeId: string) => {
    if (!completedChallenges.includes(challengeId)) {
      const challenge = challenges.find(c => c.id === challengeId);
      if (challenge) {
        const newPoints = userPoints + challenge.points;
        const newCompleted = [...completedChallenges, challengeId];

        setUserPoints(newPoints);
        setCompletedChallenges(newCompleted);

        // Save to localStorage
        localStorage.setItem('privacy_explorers_points', newPoints.toString());
        localStorage.setItem('privacy_explorers_completed', JSON.stringify(newCompleted));
      }
    }
    setShowChallenge(false);
    setSelectedChallenge(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCompletionPercentage = () => {
    return Math.round((completedChallenges.length / challenges.length) * 100);
  };

  return (
    <PageLayout
      title="Ages 5-8"
      subtitle="Interactive privacy challenges and games designed specifically for young learners. Learn digital safety through exciting quests and fun activities!"
      icon={Shield}
      badge="PRIVACY EXPLORERS - AGES 9-12"
      breadcrumbs={true}
    >
      {/* Progress Section */}
      <section style={{ padding: 'clamp(2rem, 4vw, 3rem) 0' }}>
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12" style={{
          backgroundColor: '#ffffff',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          borderRadius: '16px'
        }}>
          <div className="text-center mb-6">
            <h2 style={{ 
              fontSize: 'clamp(1.5rem, 3vw, 2rem)', 
              fontWeight: 700, 
              marginBottom: '1rem',
              color: '#1B5E20'
            }}>
              Your Explorer Progress
            </h2>
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{userPoints}</div>
                <div className="text-sm text-gray-600">Points Earned</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{completedChallenges.length}</div>
                <div className="text-sm text-gray-600">Challenges Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{getCompletionPercentage()}%</div>
                <div className="text-sm text-gray-600">Overall Progress</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="h-4 rounded-full transition-all duration-500 bg-gradient-to-r from-blue-500 to-purple-600"
                style={{ width: `${getCompletionPercentage()}%` }}
              />
            </div>
          </div>

          {getCompletionPercentage() === 100 && (
            <div className="text-center bg-yellow-50 border border-yellow-200 rounded-lg p-6"
                 style={{
                   backgroundColor: 'var(--light)',
                   borderColor: 'var(--warning)'
                 }}>
              <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-600" />
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--primary)' }}>
                Congratulations! 🎉
              </h3>
              <p style={{ color: 'var(--gray-700)' }}>
                You've completed all Privacy Explorer challenges and earned your Digital Privacy Champion badge!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Challenges Grid */}
      <section style={{ padding: 'clamp(2rem, 4vw, 3rem) 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: 'clamp(1.875rem, 3vw, 2.25rem)', 
            fontWeight: 700, 
            marginBottom: '0.75rem',
            color: '#1B5E20'
          }}>
            Privacy Challenges
          </h2>
          <p style={{ 
            fontSize: '1.125rem', 
            maxWidth: '42rem', 
            margin: '0 auto',
            color: '#64748b',
            lineHeight: 1.6
          }}>
            Complete these interactive challenges to become a Privacy Explorer. Each challenge teaches important digital safety skills.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {challenges.map((challenge) => {
            const Icon = challenge.icon;
            const isCompleted = completedChallenges.includes(challenge.id);

            return (
              <div
                key={challenge.id}
                className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer border-2 ${
                  isCompleted ? 'border-green-500' : 'border-transparent'
                }`}
                style={{
                  backgroundColor: 'var(--card-color)',
                  boxShadow: 'var(--shadow-md)'
                }}
                onClick={() => handleChallengeStart(challenge)}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white">
                      <Icon size={24} />
                    </div>
                    {isCompleted && (
                      <CheckCircle size={24} className="text-green-500" />
                    )}
                  </div>

                  <h3 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: 700, 
                    marginBottom: '0.75rem',
                    color: '#1B5E20'
                  }}>
                    {challenge.title}
                  </h3>

                  <p style={{ 
                    marginBottom: '1rem', 
                    lineHeight: 1.6,
                    color: '#64748b'
                  }}>
                    {challenge.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty}
                    </span>
                    <span style={{ 
                      fontSize: '0.875rem', 
                      fontWeight: 500,
                      color: '#6b7280'
                    }}>
                      {challenge.duration}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-purple-600">
                      {challenge.points} points
                    </span>
                    <button
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChallengeStart(challenge);
                      }}
                    >
                      {isCompleted ? 'Play Again' : 'Start Challenge'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Challenge Modal */}
      {showChallenge && selectedChallenge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 style={{ 
                  fontSize: 'clamp(1.5rem, 3vw, 1.875rem)', 
                  fontWeight: 700,
                  color: '#1B5E20'
                }}>
                  {selectedChallenge.title}
                </h3>
                <button
                  onClick={() => setShowChallenge(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="mb-6">
                <p style={{ 
                  fontSize: '1.125rem', 
                  marginBottom: '1rem',
                  color: '#64748b',
                  lineHeight: 1.6
                }}>
                  {selectedChallenge.description}
                </p>

                <div style={{
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '12px',
                  padding: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  <h4 style={{ 
                    fontWeight: 600, 
                    marginBottom: '0.5rem',
                    color: '#1B5E20'
                  }}>
                    Challenge Instructions:
                  </h4>
                  <ul style={{ 
                    listStyle: 'disc',
                    paddingLeft: '1.5rem',
                    color: '#64748b',
                    lineHeight: 1.6
                  }}>
                    <li>Read all instructions carefully before starting</li>
                    <li>Take your time to understand each concept</li>
                    <li>Ask for help if you need clarification</li>
                    <li>Complete all tasks to earn your points</li>
                  </ul>
                </div>

                <div className="text-center">
                  <button
                    onClick={() => handleChallengeComplete(selectedChallenge.id)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
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
        background: 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)',
        color: 'white',
        padding: 'clamp(3rem, 6vw, 4rem) 0',
        marginTop: 'clamp(2rem, 4vw, 3rem)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ 
            fontSize: 'clamp(1.875rem, 3vw, 2.25rem)', 
            fontWeight: 700, 
            marginBottom: '1rem'
          }}>
            Ready to Become a Privacy Explorer?
          </h2>
          <p style={{ 
            fontSize: '1.125rem', 
            marginBottom: '2rem', 
            opacity: 0.9, 
            maxWidth: '42rem', 
            margin: '0 auto 2rem',
            lineHeight: 1.6
          }}>
            Start your journey to becoming a digital privacy champion. Complete challenges, earn points, and unlock new skills!
          </p>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '1rem', 
            justifyContent: 'center' 
          }}>
            <Link
              to="/activity-book"
              style={{
                background: 'white',
                color: '#3b82f6',
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
              Try Activity Book
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
        </div>
      </section>
    </PageLayout>
  );
};

export default PrivacyExplorersPage;