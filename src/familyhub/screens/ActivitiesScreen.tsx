import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  Info,
  MessageCircleHeart,
  Play,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';
import ActivityManager from '../../components/activities/ActivityManager';
import { useProgress } from '../../contexts/ProgressContext';
import {
  ageBasedActivities,
  flattenAgeBasedActivities,
  getFeaturedAgeBasedActivities,
  type ActivityFocus,
  type AgeGroup,
  type FlattenedAgeBasedActivity,
} from '../../data/ageBasedActivities';

const AGE_TABS = [
  { id: 'all', label: 'All Ages' },
  { id: '5-8', label: '🐼 Ages 5–8' },
  { id: '9-12', label: '🕵️ Ages 9–12' },
  { id: '13-17', label: '🌐 Ages 13–17' },
] as const;

const FOCUS_ORDER: ActivityFocus[] = [
  'Safe sharing',
  'Account security',
  'Spotting scams',
  'Privacy settings',
  'Digital footprint',
  'Digital rights',
];

type AgeTabId = (typeof AGE_TABS)[number]['id'];
type FocusTabId = 'all' | ActivityFocus;

const parseDurationMinutes = (duration: string) => Number.parseInt(duration, 10) || 0;
const getCompletionId = (activity: FlattenedAgeBasedActivity) => activity.activityManagerId ?? activity.id;

const LearningCard: React.FC<{
  activity: FlattenedAgeBasedActivity;
  isCompleted: boolean;
  score?: number;
  onClose: () => void;
}> = ({ activity, isCompleted, score, onClose }) => (
  <div className="flex h-full flex-col bg-gray-50 dark:bg-gray-900">
    <div className="border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
      <div className="mx-auto flex max-w-4xl items-center gap-4">
        <button
          onClick={onClose}
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:hover:bg-gray-700"
          aria-label="Back to activities"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{activity.name}</h2>
      </div>
    </div>

    <div className="flex-1 overflow-auto px-4 py-5 sm:px-6">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <section className="rounded-3xl border border-teal-100 bg-white p-6 shadow-sm dark:border-teal-700/40 dark:bg-gray-800">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-700 dark:bg-teal-900/30 dark:text-teal-200">
                <Sparkles size={14} aria-hidden="true" />
                Family activity mission
              </div>
              <div className="mt-4 flex items-center gap-4">
                <span className="text-5xl" role="img" aria-label={activity.name}>
                  {activity.icon}
                </span>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{activity.name}</h3>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-medium">
                    <span className="rounded-full bg-teal-50 px-3 py-1 text-teal-700 dark:bg-teal-900/30 dark:text-teal-200">
                      Ages {activity.groupAgeRange}
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                      {activity.focus}
                    </span>
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200">
                      {activity.difficulty}
                    </span>
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200">
                      {activity.familyMode}
                    </span>
                    {isCompleted && (
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">
                        Completed{score !== undefined ? ` · ${score}%` : ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:max-w-xs lg:grid-cols-1">
              <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-900/70">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Time together
                </p>
                <p className="mt-2 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                  <Clock size={15} aria-hidden="true" />
                  {activity.duration}
                </p>
              </div>
              <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-900/70">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Learning goal
                </p>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">{activity.learningObjective}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-[1.2fr,0.8fr]">
          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-700/40 dark:bg-amber-900/20">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
              Real-life scenario
            </p>
            <p className="mt-2 text-sm leading-relaxed text-amber-950 dark:text-amber-100">
              {activity.realLifeScenario}
            </p>
          </section>

          <section className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5 dark:border-indigo-700/40 dark:bg-indigo-900/20">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
              Family prompt
            </p>
            <p className="mt-2 text-sm leading-relaxed text-indigo-950 dark:text-indigo-100">
              {activity.familyPrompt}
            </p>
          </section>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
              <BookOpen size={14} aria-hidden="true" />
              Key privacy learnings
            </p>
            <ul className="mt-4 space-y-3">
              {activity.keyLearnings.map((tip) => (
                <li key={tip} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-200">
                  <span className="mt-0.5 text-teal-500" aria-hidden="true">
                    ✓
                  </span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-rose-700 dark:text-rose-300">
              <MessageCircleHeart size={14} aria-hidden="true" />
              Family reflection prompts
            </p>
            <ul className="mt-4 space-y-3">
              {activity.discussionPrompts.map((prompt) => (
                <li key={prompt} className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-900 dark:bg-rose-900/20 dark:text-rose-100">
                  {prompt}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-700/40 dark:bg-emerald-900/20">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
            <Target size={14} aria-hidden="true" />
            Next family step
          </p>
          <p className="mt-2 text-sm leading-relaxed text-emerald-950 dark:text-emerald-100">{activity.nextStep}</p>
        </section>

        <p className="pb-4 text-center text-xs text-gray-500 dark:text-gray-400">
          Interactive game coming soon — use these prompts to turn the activity into a quick family conversation today.
        </p>
      </div>
    </div>
  </div>
);

const ActivityCard: React.FC<{
  activity: FlattenedAgeBasedActivity;
  isCompleted: boolean;
  score?: number;
  onStart: () => void;
}> = ({ activity, isCompleted, score, onStart }) => (
  <button
    onClick={onStart}
    className={`group flex min-h-[300px] flex-col rounded-2xl border p-5 text-left shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
      activity.featured
        ? 'border-teal-200 bg-teal-50/50 hover:border-teal-400 hover:shadow-md dark:border-teal-700/40 dark:bg-teal-900/10 dark:hover:border-teal-500'
        : 'border-gray-200 bg-white hover:border-teal-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-teal-500'
    }`}
    aria-label={`Start activity: ${activity.name}`}
  >
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="text-3xl" role="img" aria-label="">
          {activity.icon}
        </span>
        <div>
          <h3 className="text-base font-semibold leading-snug text-gray-900 dark:text-white">{activity.name}</h3>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{activity.groupLabel}</p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        {activity.featured && (
          <span className="rounded-full bg-teal-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-teal-700 dark:bg-teal-900/30 dark:text-teal-200">
            Featured
          </span>
        )}
        {isCompleted && (
          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">
            Completed{score !== undefined ? ` · ${score}%` : ''}
          </span>
        )}
      </div>
    </div>

    <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-medium">
      <span className="rounded-full bg-white px-2.5 py-1 text-teal-700 ring-1 ring-teal-200 dark:bg-gray-900 dark:text-teal-200 dark:ring-teal-700/50">
        Ages {activity.groupAgeRange}
      </span>
      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
        {activity.focus}
      </span>
      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200">
        {activity.difficulty}
      </span>
    </div>

    <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{activity.description}</p>

    <div className="mt-4 rounded-2xl bg-gray-50 p-4 dark:bg-gray-900/60">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        Learning goal
      </p>
      <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">{activity.learningObjective}</p>
    </div>

    <div className="mt-4 rounded-2xl bg-indigo-50 p-4 dark:bg-indigo-900/20">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
        Family cue
      </p>
      <p className="mt-2 line-clamp-3 text-sm text-indigo-900 dark:text-indigo-100">{activity.familyPrompt}</p>
    </div>

    <div className="mt-auto flex items-end justify-between gap-3 pt-5">
      <div className="text-xs text-gray-500 dark:text-gray-400">
        <p className="flex items-center gap-1.5">
          <Clock size={13} aria-hidden="true" />
          {activity.duration}
        </p>
        <p className="mt-1">{activity.familyMode}</p>
      </div>
      <div className="flex items-center gap-1 text-sm font-semibold text-teal-600 transition-transform group-hover:translate-x-0.5 dark:text-teal-300">
        <Play size={15} aria-hidden="true" />
        {activity.activityManagerId ? 'Start game' : 'Explore'}
      </div>
    </div>
  </button>
);

const GroupHeading: React.FC<{ group: AgeGroup }> = ({ group }) => (
  <div className="mb-4 flex items-start gap-3">
    <span className="text-3xl" role="img" aria-label={group.label}>
      {group.emoji}
    </span>
    <div>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">
        {group.label}
        <span className="ml-2 text-sm font-normal text-gray-400 dark:text-gray-500">(Ages {group.ageRange})</span>
      </h2>
      <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{group.description}</p>
    </div>
  </div>
);

const ActivitiesScreen: React.FC = () => {
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [activeAge, setActiveAge] = useState<AgeTabId>('all');
  const [activeFocus, setActiveFocus] = useState<FocusTabId>('all');
  const [showLearningCard, setShowLearningCard] = useState(false);
  const { progress, getActivityProgress } = useProgress();

  const allActivities = useMemo(() => flattenAgeBasedActivities(), []);
  const focusTabs = useMemo(
    () => [
      { id: 'all' as const, label: 'All goals' },
      ...FOCUS_ORDER.filter((focus) => allActivities.some((activity) => activity.focus === focus)).map((focus) => ({
        id: focus,
        label: focus,
      })),
    ],
    [allActivities]
  );

  const filteredActivities = useMemo(
    () =>
      allActivities.filter(
        (activity) =>
          (activeAge === 'all' || activity.groupAgeRange === activeAge) &&
          (activeFocus === 'all' || activity.focus === activeFocus)
      ),
    [activeAge, activeFocus, allActivities]
  );

  const selectedActivity = allActivities.find((activity) => activity.id === selectedActivityId) ?? null;
  const selectedActivityProgress = selectedActivity ? getActivityProgress(getCompletionId(selectedActivity)) : undefined;
  const completedIds = useMemo(() => new Set(progress.completedActivities), [progress.completedActivities]);
  const featuredActivities = useMemo(() => {
    const featuredMatches = getFeaturedAgeBasedActivities(filteredActivities);
    return (featuredMatches.length > 0 ? featuredMatches : filteredActivities).slice(0, 3);
  }, [filteredActivities]);

  const completedCount = useMemo(
    () => filteredActivities.filter((activity) => completedIds.has(getCompletionId(activity))).length,
    [completedIds, filteredActivities]
  );
  const totalMinutes = useMemo(
    () => filteredActivities.reduce((sum, activity) => sum + parseDurationMinutes(activity.duration), 0),
    [filteredActivities]
  );
  const showGroupedGrid = activeAge === 'all' && activeFocus === 'all';

  const handleStart = (activity: FlattenedAgeBasedActivity) => {
    setSelectedActivityId(activity.id);
    setShowLearningCard(!activity.activityManagerId);
  };

  const handleClose = () => {
    setSelectedActivityId(null);
    setShowLearningCard(false);
  };

  if (selectedActivityId && selectedActivity && !showLearningCard) {
    return (
      <div className="flex h-full flex-col bg-gray-50 dark:bg-gray-900">
        <div className="border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
          <div className="mx-auto flex max-w-5xl items-center gap-4">
            <button
              onClick={handleClose}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:hover:bg-gray-700"
              aria-label="Back to activities"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{selectedActivity.name}</h2>
          </div>
        </div>

        <div className="border-b border-gray-200 bg-white/90 px-4 py-4 dark:border-gray-700 dark:bg-gray-800/80">
          <div className="mx-auto grid max-w-5xl gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl bg-teal-50 p-4 dark:bg-teal-900/20">
              <p className="text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
                Learning goal
              </p>
              <p className="mt-2 text-sm text-teal-950 dark:text-teal-100">{selectedActivity.learningObjective}</p>
            </div>
            <div className="rounded-2xl bg-indigo-50 p-4 dark:bg-indigo-900/20">
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
                Family cue
              </p>
              <p className="mt-2 text-sm text-indigo-950 dark:text-indigo-100">{selectedActivity.familyPrompt}</p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-4 dark:bg-amber-900/20">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                Focus
              </p>
              <p className="mt-2 text-sm text-amber-950 dark:text-amber-100">
                {selectedActivity.focus} · {selectedActivity.duration}
              </p>
              <p className="mt-1 text-xs text-amber-800/80 dark:text-amber-100/80">{selectedActivity.familyMode}</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-900/20">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                Progress
              </p>
              <p className="mt-2 text-sm text-emerald-950 dark:text-emerald-100">
                {selectedActivityProgress?.completed
                  ? `Completed${selectedActivityProgress.score !== undefined ? ` · ${selectedActivityProgress.score}%` : ''}`
                  : 'Ready to start'}
              </p>
              <p className="mt-1 text-xs text-emerald-800/80 dark:text-emerald-100/80">{selectedActivity.nextStep}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <ActivityManager
            activityId={selectedActivity.activityManagerId}
            onClose={handleClose}
            onComplete={handleClose}
          />
        </div>
      </div>
    );
  }

  if (selectedActivityId && selectedActivity && showLearningCard) {
    return (
      <LearningCard
        activity={selectedActivity}
        isCompleted={Boolean(selectedActivityProgress?.completed)}
        score={selectedActivityProgress?.score}
        onClose={handleClose}
      />
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6">
      <div className="grid gap-4 lg:grid-cols-[1.7fr,1fr]">
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-700 dark:bg-teal-900/30 dark:text-teal-200">
            <Sparkles size={14} aria-hidden="true" />
            Family activity catalogue
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            Discover activities your family can play, discuss, and revisit together
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-300 sm:text-base">
            Browse age-matched privacy missions with clear learning goals, real-life scenarios, and conversation starters so every activity feels useful beyond the screen.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs font-medium">
            <span className="rounded-full bg-teal-50 px-3 py-1 text-teal-700 dark:bg-teal-900/30 dark:text-teal-200">
              {allActivities.length} activities
            </span>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200">
              {getFeaturedAgeBasedActivities(allActivities).length} featured picks
            </span>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200">
              Guided by age, goal, and family mode
            </span>
          </div>
        </section>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <div className="rounded-2xl border border-teal-200 bg-teal-50 p-5 dark:border-teal-700/40 dark:bg-teal-900/20">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">Ready now</p>
            <p className="mt-2 text-2xl font-bold text-teal-950 dark:text-teal-100">{filteredActivities.length}</p>
            <p className="mt-1 text-sm text-teal-900/80 dark:text-teal-100/80">Activities match your current filters.</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-700/40 dark:bg-emerald-900/20">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Completed</p>
            <p className="mt-2 text-2xl font-bold text-emerald-950 dark:text-emerald-100">{completedCount}</p>
            <p className="mt-1 text-sm text-emerald-900/80 dark:text-emerald-100/80">Interactive missions already finished.</p>
          </div>
          <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5 dark:border-indigo-700/40 dark:bg-indigo-900/20">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">Family time</p>
            <p className="mt-2 text-2xl font-bold text-indigo-950 dark:text-indigo-100">{totalMinutes} min</p>
            <p className="mt-1 text-sm text-indigo-900/80 dark:text-indigo-100/80">Estimated time to explore every filtered mission.</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Filter by age group">
        {AGE_TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeAge === tab.id}
            onClick={() => setActiveAge(tab.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
              activeAge === tab.id
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-teal-50 hover:text-teal-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-teal-900/30 dark:hover:text-teal-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2" role="toolbar" aria-label="Filter by learning goal">
        {focusTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFocus(tab.id)}
            className={`rounded-full border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
              activeFocus === tab.id
                ? 'border-teal-500 bg-teal-50 text-teal-700 dark:border-teal-400 dark:bg-teal-900/30 dark:text-teal-200'
                : 'border-gray-200 bg-white text-gray-700 hover:border-teal-300 hover:text-teal-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-teal-500 dark:hover:text-teal-200'
            }`}
            aria-pressed={activeFocus === tab.id}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeAge !== 'all' && (() => {
        const group = ageBasedActivities.find((candidate) => candidate.ageRange === activeAge);
        return group ? (
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-teal-200 bg-teal-50 p-4 dark:border-teal-700/40 dark:bg-teal-900/20">
            <Info size={18} className="mt-0.5 shrink-0 text-teal-600 dark:text-teal-300" />
            <div>
              <p className="text-sm text-teal-800 dark:text-teal-100">{group.description}</p>
              {activeFocus !== 'all' && (
                <p className="mt-2 text-xs font-medium uppercase tracking-wide text-teal-700 dark:text-teal-300">
                  Focused on {activeFocus}
                </p>
              )}
            </div>
          </div>
        ) : null;
      })()}

      {featuredActivities.length > 0 && (
        <section className="mt-8" aria-labelledby="featured-activities-heading">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="featured-activities-heading" className="text-xl font-bold text-gray-900 dark:text-white">
                Featured family picks
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Recommended for high-impact conversations, quick wins, or a great next mission.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-200">
              <Users size={14} aria-hidden="true" />
              Built for family learning
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {featuredActivities.map((activity) => {
              const progressDetails = getActivityProgress(getCompletionId(activity));
              return (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  isCompleted={Boolean(progressDetails?.completed)}
                  score={progressDetails?.score}
                  onStart={() => handleStart(activity)}
                />
              );
            })}
          </div>
        </section>
      )}

      <section className="mt-10" aria-labelledby="activities-catalogue-heading">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="activities-catalogue-heading" className="text-xl font-bold text-gray-900 dark:text-white">
              Activity catalogue
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Explore by age, learning focus, and the kind of family support each mission invites.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            <CheckCircle2 size={14} aria-hidden="true" />
            Completion cues appear on interactive activities you have already finished.
          </div>
        </div>

        {filteredActivities.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center dark:border-gray-700 dark:bg-gray-800">
            <p className="text-base font-semibold text-gray-900 dark:text-white">No activities match that combination yet.</p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Try a different age band or switch back to All goals to uncover more family activities.
            </p>
          </div>
        ) : showGroupedGrid ? (
          <div className="space-y-10">
            {ageBasedActivities.map((group) => (
              <section key={group.ageRange} aria-labelledby={`group-${group.ageRange}`}>
                <div id={`group-${group.ageRange}`}>
                  <GroupHeading group={group} />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {group.activities.map((activity) => {
                    const fullActivity = allActivities.find((candidate) => candidate.id === activity.id);

                    if (!fullActivity) {
                      return null;
                    }

                    const progressDetails = getActivityProgress(getCompletionId(fullActivity));
                    return (
                      <ActivityCard
                        key={activity.id}
                        activity={fullActivity}
                        isCompleted={Boolean(progressDetails?.completed)}
                        score={progressDetails?.score}
                        onStart={() => handleStart(fullActivity)}
                      />
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredActivities.map((activity) => {
              const progressDetails = getActivityProgress(getCompletionId(activity));
              return (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  isCompleted={Boolean(progressDetails?.completed)}
                  score={progressDetails?.score}
                  onStart={() => handleStart(activity)}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default ActivitiesScreen;
