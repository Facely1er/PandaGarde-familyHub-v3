import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, AlertTriangle, CheckCircle, Users, BookOpen } from 'lucide-react';
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
      subtitle="Fun quizzes and games for ages 9–12. Pick one activity below—each takes about 10 minutes."
      breadcrumbs={true}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
      <section>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 sm:p-8">
          <div className="mb-6 text-center">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100">
              Your explorer progress
            </h2>
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{userPoints}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Points earned</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{completedChallenges.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Challenges completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{getCompletionPercentage()}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Overall progress</div>
              </div>
            </div>
            <div className="h-4 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-4 rounded-full bg-green-700 transition-all duration-500 dark:bg-green-500"
                style={{ width: `${getCompletionPercentage()}%` }}
              />
            </div>
          </div>

          {getCompletionPercentage() === 100 && (
            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6 text-center dark:border-yellow-800 dark:bg-yellow-950/30">
              <Trophy className="mx-auto mb-4 h-16 w-16 text-yellow-600 dark:text-yellow-400" aria-hidden />
              <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">
                Congratulations
              </h3>
              <p className="text-gray-700 dark:text-gray-200">
                You've completed all Privacy Explorer challenges and earned your Digital Privacy Champion badge!
              </p>
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="mb-8 text-center">
          <h2 className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100">
            Privacy challenges
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-300">
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
                role="button"
                tabIndex={0}
                className={`cursor-pointer rounded-2xl border bg-white dark:bg-gray-800 ${
                  isCompleted
                    ? 'border-green-600 dark:border-green-500'
                    : 'border-gray-200 hover:border-green-400 dark:border-gray-700 dark:hover:border-green-500'
                }`}
                onClick={() => handleChallengeStart(challenge)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleChallengeStart(challenge);
                  }
                }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-700 text-white">
                      <Icon size={24} />
                    </div>
                    {isCompleted && (
                      <CheckCircle size={24} className="text-green-500" />
                    )}
                  </div>

                  <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-gray-100">
                    {challenge.title}
                  </h3>

                  <p className="mb-4 leading-relaxed text-gray-600 dark:text-gray-300">
                    {challenge.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty}
                    </span>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {challenge.duration}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-purple-600">
                      {challenge.points} points
                    </span>
                    <button
                      className="bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-500 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
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
                <p className="mb-4 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                  {selectedChallenge.description}
                </p>

                <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                  <h4 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                    Challenge instructions
                  </h4>
                  <ul className="list-disc space-y-1 pl-6 text-gray-600 dark:text-gray-300">
                    <li>Read all instructions carefully before starting</li>
                    <li>Take your time to understand each concept</li>
                    <li>Ask for help if you need clarification</li>
                    <li>Complete all tasks to earn your points</li>
                  </ul>
                </div>

                <div className="text-center">
                  <button
                    onClick={() => handleChallengeComplete(selectedChallenge.id)}
                    className="bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-500 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Mark as Complete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="rounded-2xl bg-green-700 p-6 text-center text-white sm:p-8 dark:bg-green-800">
        <h2 className="mb-3 text-2xl font-bold sm:text-3xl">Ready to try a privacy mission?</h2>
        <p className="mx-auto mb-6 max-w-2xl text-base leading-relaxed text-green-50">
          These challenges are website quizzes. For age-matched missions with progress on this device, open Family Hub.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/family-hub/activities"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-white px-5 py-2.5 font-semibold text-green-800 hover:bg-green-50"
          >
            <BookOpen size={20} aria-hidden />
            Privacy missions
          </Link>
          <Link
            to="/family-hub"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border-2 border-white px-5 py-2.5 font-semibold text-white hover:bg-white/10"
          >
            <Users size={20} aria-hidden />
            Family Hub
          </Link>
        </div>
      </section>
      </div>
    </PageLayout>
  );
};

export default PrivacyExplorersPage;