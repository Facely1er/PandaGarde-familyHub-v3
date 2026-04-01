import React, { useMemo } from 'react';
import { ArrowLeft, Map, BookOpen, GraduationCap, Star, Play, Clock, Target, CheckCircle, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useFamilyProgress } from '../../contexts/FamilyProgressContext';
import { useActiveMember } from '../../utils/familyProgressIntegration';
import { gameIdForJourneyStep } from '../../data/journeyStepGameMap';

interface JourneyActivity {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  icon: string;
  color: string;
}

interface JourneyPath {
  id: string;
  name: string;
  description: string;
  ageRange: string;
  icon: React.ReactNode;
  color: string;
  activities: JourneyActivity[];
}

const journeyPaths: JourneyPath[] = [
  {
    id: 'elementary',
    name: 'Privacy Explorers',
    description: 'Fun adventures for young learners (Ages 6-10)',
    ageRange: '6-10',
    icon: <Star className="text-yellow-500" size={24} />,
    color: 'from-yellow-500 to-orange-500',
    activities: [
      {
        id: 'pack-backpack',
        title: 'Pack Your Digital Backpack',
        description: 'Learn what information is safe to share online',
        duration: '5 min',
        difficulty: 'Easy',
        icon: '🎒',
        color: 'from-blue-500 to-cyan-500',
      },
      {
        id: 'destination-decisions',
        title: 'Destination Decision Station',
        description: 'Make smart choices about sharing in different situations',
        duration: '8 min',
        difficulty: 'Medium',
        icon: '🗺️',
        color: 'from-purple-500 to-pink-500',
      },
      {
        id: 'privacy-checkpoint',
        title: 'Privacy Checkpoint Challenge',
        description: 'Test your privacy knowledge with quick decisions',
        duration: '6 min',
        difficulty: 'Medium',
        icon: '🛡️',
        color: 'from-green-500 to-emerald-500',
      },
    ],
  },
  {
    id: 'middle',
    name: 'Digital Defenders',
    description: 'Building stronger skills (Ages 11-13)',
    ageRange: '11-13',
    icon: <BookOpen className="text-blue-500" size={24} />,
    color: 'from-blue-500 to-indigo-500',
    activities: [
      {
        id: 'social-safety',
        title: 'Social Media Safety Quest',
        description: 'Navigate the world of social media safely',
        duration: '10 min',
        difficulty: 'Medium',
        icon: '📱',
        color: 'from-pink-500 to-rose-500',
      },
      {
        id: 'password-mastery',
        title: 'Password Mastery Challenge',
        description: 'Become a password security expert',
        duration: '8 min',
        difficulty: 'Medium',
        icon: '🔐',
        color: 'from-amber-500 to-yellow-500',
      },
      {
        id: 'phishing-patrol',
        title: 'Phishing Patrol Mission',
        description: 'Learn to spot and avoid online scams',
        duration: '12 min',
        difficulty: 'Hard',
        icon: '🎣',
        color: 'from-red-500 to-orange-500',
      },
    ],
  },
  {
    id: 'high',
    name: 'Privacy Champions',
    description: 'Advanced digital citizenship (Ages 14+)',
    ageRange: '14+',
    icon: <GraduationCap className="text-purple-500" size={24} />,
    color: 'from-purple-500 to-pink-500',
    activities: [
      {
        id: 'digital-rights',
        title: 'Know Your Digital Rights',
        description: 'Understand privacy laws and your rights online',
        duration: '15 min',
        difficulty: 'Hard',
        icon: '⚖️',
        color: 'from-purple-600 to-indigo-600',
      },
      {
        id: 'data-detective',
        title: 'Data Detective Investigation',
        description: 'Discover how companies collect and use your data',
        duration: '12 min',
        difficulty: 'Hard',
        icon: '🔍',
        color: 'from-teal-500 to-cyan-500',
      },
      {
        id: 'privacy-policy-pro',
        title: 'Privacy Policy Pro',
        description: 'Learn to read and understand privacy policies',
        duration: '15 min',
        difficulty: 'Hard',
        icon: '📜',
        color: 'from-slate-500 to-gray-600',
      },
    ],
  },
];

function useCompletedGameIds(memberId: number | null): Set<string> {
  const { getMemberActivities } = useFamilyProgress();
  return useMemo(() => {
    if (memberId == null) return new Set();
    const acts = getMemberActivities(memberId);
    const ids = new Set<string>();
    for (const a of acts) {
      if (a.activityType === 'game' && a.activityId) {
        ids.add(a.activityId);
      }
    }
    return ids;
  }, [memberId, getMemberActivities]);
}

const JourneyHub: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPath, setSelectedPath] = React.useState<string | null>(null);
  const { currentMemberId } = useActiveMember();
  const completedGameIds = useCompletedGameIds(currentMemberId);

  const stepComplete = (stepId: string) => {
    const gid = gameIdForJourneyStep(stepId);
    return gid ? completedGameIds.has(gid) : false;
  };

  const openStepGame = (stepId: string) => {
    const gameId = gameIdForJourneyStep(stepId);
    if (!gameId) return;
    navigate(`/family-hub/learning?play=${encodeURIComponent(gameId)}`);
  };

  const selectedJourney = journeyPaths.find((p) => p.id === selectedPath);

  const noPlayerBanner = (
    <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
      <AlertCircle className="mt-0.5 shrink-0" size={20} />
      <div>
        <p className="font-semibold">Choose who’s playing</p>
        <p className="mt-1 text-sm opacity-90">
          On the Family Hub dashboard, pick a family member so game scores save to the right profile.
        </p>
        <Link
          to="/family-hub"
          className="mt-2 inline-block text-sm font-medium underline hover:no-underline"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  );

  if (selectedJourney) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-emerald-50/30 to-cyan-50/20 px-4 py-6 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 sm:p-6">
        <div className="mx-auto max-w-4xl">
          {currentMemberId == null && noPlayerBanner}

          <button
            type="button"
            onClick={() => setSelectedPath(null)}
            className="mb-6 flex items-center space-x-2 text-gray-600 transition-colors hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
          >
            <ArrowLeft size={20} />
            <span>Back to Journey Paths</span>
          </button>

          <div className={`mb-8 rounded-2xl bg-gradient-to-r ${selectedJourney.color} p-8 text-white`}>
            <div className="mb-4 flex items-center space-x-4">
              <div className="rounded-xl bg-white/20 p-3">{selectedJourney.icon}</div>
              <div>
                <h1 className="text-3xl font-bold">{selectedJourney.name}</h1>
                <p className="text-white/80">{selectedJourney.description}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle size={16} />
                <span>
                  {
                    selectedJourney.activities.filter((a) => stepComplete(a.id)).length
                  }
                  /{selectedJourney.activities.length} Complete
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Target size={16} />
                <span>Ages {selectedJourney.ageRange}</span>
              </div>
            </div>
          </div>

          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Each step opens a real activity in the Learning Hub. Finish the game to mark this step complete.
          </p>

          <div className="space-y-4">
            {selectedJourney.activities.map((activity, index) => {
              const isCompleted = stepComplete(activity.id);
              const gameId = gameIdForJourneyStep(activity.id);

              return (
                <div
                  key={activity.id}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-center">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r ${activity.color} text-2xl`}
                      >
                        {activity.icon}
                      </div>
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">Step {index + 1}</div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{activity.title}</h3>
                        {isCompleted && (
                          <div className="flex items-center space-x-1 rounded-full bg-green-100 px-3 py-1 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400">
                            <CheckCircle size={14} />
                            <span>Complete</span>
                          </div>
                        )}
                      </div>
                      <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">{activity.description}</p>

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center space-x-1">
                            <Clock size={14} />
                            <span>{activity.duration}</span>
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs ${
                              activity.difficulty === 'Easy'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                                : activity.difficulty === 'Medium'
                                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300'
                                  : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300'
                            }`}
                          >
                            {activity.difficulty}
                          </span>
                        </div>

                        <button
                          type="button"
                          disabled={!gameId}
                          onClick={() => openStepGame(activity.id)}
                          className={`flex items-center space-x-2 rounded-lg px-4 py-2 font-medium transition-colors ${
                            !gameId
                              ? 'cursor-not-allowed bg-gray-200 text-gray-500 dark:bg-gray-700'
                              : isCompleted
                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                                : `bg-gradient-to-r ${activity.color} text-white hover:opacity-90`
                          }`}
                        >
                          <Play size={16} />
                          <span>{isCompleted ? 'Play again' : 'Start'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-emerald-50/30 to-cyan-50/20 px-4 py-6 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 sm:p-6">
      <div className="mx-auto max-w-6xl">
        {currentMemberId == null && noPlayerBanner}

        <button
          type="button"
          onClick={() => navigate('/family-hub/learning')}
          className="mb-6 flex items-center space-x-2 text-gray-600 transition-colors hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
        >
          <ArrowLeft size={20} />
          <span>Back to Learning Hub</span>
        </button>

        <div className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center space-x-3">
            <Map className="text-green-600" size={36} />
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">Privacy Journeys</h1>
          </div>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Choose a path for your age. Each step is a real game in the Learning Hub—finish it to move forward.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {journeyPaths.map((path) => {
            const completedCount = path.activities.filter((a) => stepComplete(a.id)).length;

            return (
              <div
                key={path.id}
                className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-lg shadow-slate-900/5 transition-all hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-900 dark:shadow-black/25"
              >
                <div className={`bg-gradient-to-r ${path.color} p-6 text-white`}>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="rounded-xl bg-white/20 p-3">{path.icon}</div>
                    <span className="rounded-full bg-white/20 px-3 py-1 text-sm">Ages {path.ageRange}</span>
                  </div>
                  <h2 className="mb-2 text-2xl font-bold">{path.name}</h2>
                  <p className="text-sm text-white/80">{path.description}</p>
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Progress</span>
                      <span className="font-medium text-gray-800 dark:text-gray-100">
                        {completedCount}/{path.activities.length}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-600">
                      <div
                        className={`h-2 rounded-full bg-gradient-to-r ${path.color} transition-all`}
                        style={{ width: `${(completedCount / path.activities.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="mb-6 space-y-2">
                    {path.activities.slice(0, 3).map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3 text-sm">
                        <span>{activity.icon}</span>
                        <span className="break-words text-gray-700 dark:text-gray-300 sm:truncate">{activity.title}</span>
                        {stepComplete(activity.id) && <CheckCircle className="shrink-0 text-green-500" size={14} />}
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedPath(path.id)}
                    className={`flex w-full items-center justify-center space-x-2 rounded-lg bg-gradient-to-r px-4 py-3 font-medium text-white transition-colors ${path.color} hover:opacity-90`}
                  >
                    <Play size={18} />
                    <span>Open journey</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-900/20">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">💡</div>
            <div>
              <h3 className="mb-2 font-semibold text-green-800 dark:text-green-200">How it works</h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                Steps link to real games. Your progress is saved when you finish each game for the family member
                selected on the dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JourneyHub;
