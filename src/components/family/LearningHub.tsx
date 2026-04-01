import React, { Suspense, useState, useEffect } from 'react';
import { ArrowLeft, Play, Star, Target, Clock, Filter, Search, Trophy, Sparkles, Map, ChevronRight, UserCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useFamilyProgress } from '../../contexts/FamilyProgressContext';
import { useActiveMember } from '../../utils/familyProgressIntegration';

// Lazy load game components
const PasswordStrengthLab = React.lazy(() => import('../games/PasswordStrengthLab'));
const SafeUnsafeSorting = React.lazy(() => import('../games/SafeUnsafeSorting'));
const PhishingDetective = React.lazy(() => import('../games/PhishingDetective'));
const DigitalRightsQuiz = React.lazy(() => import('../games/DigitalRightsQuiz'));
const PrivacyStoryAdventure = React.lazy(() => import('../games/PrivacyStoryAdventure'));
const PasswordPetCreator = React.lazy(() => import('../games/PasswordPetCreator'));
const PrivacySettingsTrainer = React.lazy(() => import('../games/PrivacySettingsTrainer'));
const SocialMediaAudit = React.lazy(() => import('../games/SocialMediaAudit'));
const DigitalFootprintVisualizer = React.lazy(() => import('../games/DigitalFootprintVisualizer'));
const SocialMediaSimulator = React.lazy(() => import('../games/SocialMediaSimulator'));
const PasswordFortressBuilder = React.lazy(() => import('../games/PasswordFortressBuilder'));
const PrivacyPolicyDecoder = React.lazy(() => import('../games/PrivacyPolicyDecoder'));

interface Game {
  id: string;
  name: string;
  description: string;
  icon: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ageGroup: 'elementary' | 'middle' | 'high' | 'all';
  color: string;
  duration: string;
  component: React.LazyExoticComponent<React.ComponentType<{ onBack: () => void }>>;
}

const games: Game[] = [
  {
    id: 'password-strength',
    name: 'Password Strength Lab',
    description: 'Learn to create super strong passwords!',
    icon: '🔐',
    difficulty: 'Easy',
    ageGroup: 'all',
    color: 'from-blue-500 to-cyan-500',
    duration: '5 min',
    component: PasswordStrengthLab
  },
  {
    id: 'password-pet',
    name: 'Password Pet Creator',
    description: 'Create a pet that grows stronger with your password!',
    icon: '🐾',
    difficulty: 'Easy',
    ageGroup: 'elementary',
    color: 'from-pink-500 to-rose-500',
    duration: '5 min',
    component: PasswordPetCreator
  },
  {
    id: 'safe-unsafe',
    name: 'Safe vs Unsafe Sorting',
    description: 'Sort online behaviors into safe and unsafe categories',
    icon: '✅',
    difficulty: 'Easy',
    ageGroup: 'all',
    color: 'from-green-500 to-emerald-500',
    duration: '8 min',
    component: SafeUnsafeSorting
  },
  {
    id: 'privacy-story',
    name: 'Privacy Story Adventure',
    description: 'Make choices in an interactive privacy story',
    icon: '📖',
    difficulty: 'Easy',
    ageGroup: 'elementary',
    color: 'from-yellow-500 to-orange-500',
    duration: '10 min',
    component: PrivacyStoryAdventure
  },
  {
    id: 'digital-footprint',
    name: 'Digital Footprint Visualizer',
    description: 'See how your online activities create a digital footprint',
    icon: '👣',
    difficulty: 'Medium',
    ageGroup: 'all',
    color: 'from-teal-500 to-cyan-500',
    duration: '8 min',
    component: DigitalFootprintVisualizer
  },
  {
    id: 'phishing-detective',
    name: 'Phishing Detective',
    description: 'Identify phishing emails and protect yourself from scams',
    icon: '🔍',
    difficulty: 'Medium',
    ageGroup: 'middle',
    color: 'from-orange-500 to-red-500',
    duration: '10 min',
    component: PhishingDetective
  },
  {
    id: 'privacy-settings',
    name: 'Privacy Settings Trainer',
    description: 'Learn to configure privacy settings on popular apps',
    icon: '⚙️',
    difficulty: 'Medium',
    ageGroup: 'all',
    color: 'from-gray-500 to-slate-600',
    duration: '8 min',
    component: PrivacySettingsTrainer
  },
  {
    id: 'social-media-audit',
    name: 'Social Media Audit',
    description: 'Review and improve your social media privacy settings',
    icon: '📱',
    difficulty: 'Medium',
    ageGroup: 'middle',
    color: 'from-indigo-500 to-purple-500',
    duration: '10 min',
    component: SocialMediaAudit
  },
  {
    id: 'social-simulator',
    name: 'Social Media Simulator',
    description: 'Practice safe social media habits in a simulation',
    icon: '🌐',
    difficulty: 'Medium',
    ageGroup: 'middle',
    color: 'from-blue-600 to-indigo-600',
    duration: '12 min',
    component: SocialMediaSimulator
  },
  {
    id: 'password-fortress',
    name: 'Password Fortress Builder',
    description: 'Build an impenetrable password fortress!',
    icon: '🏰',
    difficulty: 'Medium',
    ageGroup: 'all',
    color: 'from-amber-500 to-yellow-500',
    duration: '8 min',
    component: PasswordFortressBuilder
  },
  {
    id: 'digital-rights',
    name: 'Digital Rights Quiz',
    description: 'Test your knowledge of digital privacy rights',
    icon: '⚖️',
    difficulty: 'Hard',
    ageGroup: 'high',
    color: 'from-purple-500 to-pink-500',
    duration: '15 min',
    component: DigitalRightsQuiz
  },
  {
    id: 'privacy-decoder',
    name: 'Privacy Policy Decoder',
    description: 'Learn to understand privacy policies in plain language',
    icon: '📜',
    difficulty: 'Hard',
    ageGroup: 'high',
    color: 'from-red-500 to-rose-600',
    duration: '12 min',
    component: PrivacyPolicyDecoder
  }
];

const LearningHub: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterAge, setFilterAge] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { getMemberProgress } = useFamilyProgress();
  const { currentMemberId } = useActiveMember();

  useEffect(() => {
    const play = searchParams.get('play');
    if (!play || !games.some((g) => g.id === play)) return;
    setSelectedGame(play);
    const next = new URLSearchParams(searchParams);
    next.delete('play');
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  // Get progress for current member
  const memberProgress = currentMemberId ? getMemberProgress(currentMemberId) : null;
  const completedGames = memberProgress?.activities.filter(a => a.activityType === 'game').map(a => a.activityId) || [];

  const filteredGames = games.filter(game => {
    const matchesDifficulty = filterDifficulty === 'all' || game.difficulty === filterDifficulty;
    const matchesAge = filterAge === 'all' || game.ageGroup === filterAge || game.ageGroup === 'all';
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDifficulty && matchesAge && matchesSearch;
  });

  const handleBack = () => {
    if (selectedGame) {
      setSelectedGame(null);
    } else {
      navigate('/family-hub');
    }
  };

  // If a game is selected, render it
  if (selectedGame) {
    const game = games.find(g => g.id === selectedGame);
    if (game) {
      const GameComponent = game.component;
      return (
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20">
            <div className="text-center">
              <div className="text-6xl mb-4 animate-bounce">{game.icon}</div>
              <p className="text-gray-600 dark:text-gray-300">Loading {game.name}...</p>
            </div>
          </div>
        }>
          <GameComponent onBack={handleBack} />
        </Suspense>
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-teal-50/40 to-cyan-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 px-4 py-6 sm:p-6">
      <div className="mx-auto max-w-7xl">
        {currentMemberId == null && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50/80 p-4 shadow-sm dark:border-amber-800/60 dark:from-amber-950/40 dark:to-orange-950/20 dark:text-amber-50">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/50">
              <UserCircle className="text-amber-700 dark:text-amber-200" size={22} />
            </div>
            <div>
              <p className="font-bold text-amber-950 dark:text-amber-100">Pick a player on the dashboard</p>
              <p className="mt-1 text-sm text-amber-900/85 dark:text-amber-200/80">
                Scores save per family member. Choose who’s playing on the Family Hub home screen.
              </p>
              <button
                type="button"
                onClick={() => navigate('/family-hub')}
                className="mt-3 inline-flex items-center rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700"
              >
                Open dashboard
              </button>
            </div>
          </div>
        )}

        <div className="mb-6 rounded-2xl border border-white/60 bg-white/80 p-5 shadow-lg shadow-teal-900/5 backdrop-blur-sm dark:border-gray-700/80 dark:bg-gray-900/80 dark:shadow-black/20 sm:p-6">
          <button
            type="button"
            onClick={handleBack}
            className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold text-teal-700 transition hover:bg-teal-50 dark:text-teal-300 dark:hover:bg-teal-950/50"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="flex flex-wrap items-center gap-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md">
                  <Sparkles size={22} aria-hidden />
                </span>
                Learning Hub
              </h1>
              <p className="mt-2 max-w-xl text-slate-600 dark:text-slate-400">
                Play mini-games and build real privacy habits—one short activity at a time.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-600 dark:bg-slate-800/80">
              <Trophy className="text-amber-500" size={24} aria-hidden />
              <div>
                <p className="text-lg font-bold tabular-nums text-slate-900 dark:text-white">
                  {completedGames.length}/{games.length}
                </p>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Games done
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-900 sm:p-5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[200px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Search games…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/25 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-slate-50 px-2 dark:border-slate-600 dark:bg-slate-800">
                <Filter size={16} className="ml-1 text-slate-500" />
                <select
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                  className="cursor-pointer rounded-lg bg-transparent py-2.5 pl-1 pr-8 text-sm font-medium text-slate-800 focus:outline-none dark:text-slate-100"
                >
                  <option value="all">All levels</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <select
                value={filterAge}
                onChange={(e) => setFilterAge(e.target.value)}
                className="cursor-pointer rounded-xl border-2 border-slate-200 bg-slate-50 py-2.5 pl-3 pr-8 text-sm font-medium text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/25 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="all">All ages</option>
                <option value="elementary">Elementary (6–10)</option>
                <option value="middle">Middle (11–13)</option>
                <option value="high">High school (14+)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredGames.map((game) => {
            const isCompleted = completedGames.includes(game.id);

            return (
              <article
                key={game.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-md shadow-slate-900/5 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-teal-900/10 dark:border-gray-700 dark:bg-gray-900 dark:shadow-black/30"
              >
                <div className={`relative bg-gradient-to-br ${game.color} p-6 text-white`}>
                  <div className="text-5xl drop-shadow-sm transition group-hover:scale-105">{game.icon}</div>
                  {isCompleted && (
                    <div className="absolute right-3 top-3 rounded-full bg-white/95 p-1.5 shadow-md">
                      <Star className="text-amber-500" size={18} fill="currentColor" aria-hidden />
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{game.name}</h3>
                  <p className="mt-1 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {game.description}
                  </p>

                  <div className="mb-4 mt-3 flex flex-wrap gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        game.difficulty === 'Easy'
                          ? 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-200'
                          : game.difficulty === 'Medium'
                            ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-200'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200'
                      }`}
                    >
                      <Target size={12} aria-hidden />
                      {game.difficulty}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      <Clock size={12} aria-hidden />
                      {game.duration}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedGame(game.id)}
                    className={`mt-auto flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition active:scale-[0.98] ${
                      isCompleted
                        ? 'border-2 border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700'
                        : `bg-gradient-to-r ${game.color} text-white shadow-md hover:opacity-95 hover:shadow-lg`
                    }`}
                  >
                    <Play size={18} className={isCompleted ? '' : 'drop-shadow'} />
                    {isCompleted ? 'Play again' : 'Play'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {filteredGames.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 py-16 text-center dark:border-slate-600 dark:bg-gray-900/50">
            <div className="mb-3 text-5xl">🎮</div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">No games match</h3>
            <p className="mt-1 text-slate-600 dark:text-slate-400">Try clearing search or filters.</p>
          </div>
        )}

        <div className="mt-10 overflow-hidden rounded-2xl bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-600 p-6 text-white shadow-lg shadow-teal-900/20 sm:p-8">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                <Map size={28} aria-hidden />
              </div>
              <div>
                <h3 className="text-xl font-bold">Privacy Journeys</h3>
                <p className="mt-1 max-w-md text-sm text-white/90">
                  Age-based paths—each step opens a real game. Finish games to fill your trail.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/family-hub/journeys')}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-teal-800 shadow-md transition hover:bg-amber-100 md:w-auto"
            >
              Explore journeys
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-teal-200/80 bg-gradient-to-br from-teal-50 to-cyan-50 p-5 dark:border-teal-800 dark:from-teal-950/40 dark:to-cyan-950/20 sm:p-6">
          <div className="flex gap-3">
            <span className="text-2xl" aria-hidden>
              💡
            </span>
            <div>
              <h4 className="font-bold text-teal-900 dark:text-teal-100">Tip for families</h4>
              <p className="mt-1 text-sm leading-relaxed text-teal-800/90 dark:text-teal-200/85">
                Play a round together and chat about what felt “safe” or “risky.” Short talks after each game stick
                better than a long lecture.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningHub;

