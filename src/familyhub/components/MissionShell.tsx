import React, { lazy, Suspense, useState } from 'react';
import { ArrowLeft, BookOpen, MessageCircle, MessageCircleHeart, Play, Sparkles, Target } from 'lucide-react';
import { HubScreenFallback } from '../lazyScreen';

const ActivityManager = lazy(() => import('../../components/activities/ActivityManager'));
import MissionCelebration from './MissionCelebration';
import { useProgress } from '../../contexts/ProgressContext';
import { useFamilyProgress } from '../../contexts/FamilyProgressContext';
import { useActiveMember } from '../../utils/familyProgressIntegration';
import {
  getCompletionId,
  pickNextMission,
  recordMissionComplete,
} from '../../lib/hubMission';
import type { FlattenedAgeBasedActivity } from '../../data/ageBasedActivities';
import HubBrandLogo from './HubBrandLogo';
import { HubIcon } from '../hubIcons';

export type MissionPhase = 'intro' | 'learn' | 'play' | 'complete';

interface MissionShellProps {
  activity: FlattenedAgeBasedActivity;
  completedIds: Set<string>;
  onExit: () => void;
  onStartNext?: (activity: FlattenedAgeBasedActivity) => void;
}

const MissionStepProgress: React.FC<{ phase: MissionPhase; hasGame: boolean }> = ({ phase, hasGame }) => {
  const steps = hasGame
    ? (['Intro', 'Talk', 'Practice', 'Done'] as const)
    : (['Intro', 'Talk', 'Done'] as const);
  const phaseIndex: Record<MissionPhase, number> = hasGame
    ? { intro: 0, learn: 1, play: 2, complete: 3 }
    : { intro: 0, learn: 1, play: 1, complete: 2 };
  const current = phaseIndex[phase];

  return (
    <nav aria-label="Mission progress" className="mx-auto w-full max-w-lg">
      <ol className="flex items-center justify-between gap-1">
        {steps.map((label, index) => {
          const done = index < current;
          const active = index === current;
          return (
            <li key={label} className="flex flex-1 flex-col items-center gap-1">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold ${
                  done
                    ? 'bg-teal-600 text-white'
                    : active
                      ? 'bg-teal-100 text-teal-800 ring-2 ring-teal-500 dark:bg-teal-900/50 dark:text-teal-100'
                      : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                }`}
                aria-current={active ? 'step' : undefined}
              >
                {done ? '✓' : index + 1}
              </span>
              <span
                className={`text-[10px] font-medium uppercase tracking-wide ${
                  active ? 'text-teal-700 dark:text-teal-300' : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

const MissionShell: React.FC<MissionShellProps> = ({ activity, completedIds, onExit, onStartNext }) => {
  const hasGame = Boolean(activity.activityManagerId);
  const [phase, setPhase] = useState<MissionPhase>('intro');
  const [completionScore, setCompletionScore] = useState<number | undefined>();
  const [streak, setStreak] = useState(0);
  const { markActivityCompleted } = useProgress();
  const { recordActivityCompletion } = useFamilyProgress();
  const { currentMemberId } = useActiveMember();

  const nextMission = pickNextMission(activity, completedIds);

  const finishMission = (score?: number) => {
    const completionId = getCompletionId(activity);
    const durationMins = Number.parseInt(activity.duration, 10) || 5;
    markActivityCompleted(completionId, score, durationMins);

    if (currentMemberId !== null) {
      recordActivityCompletion(
        currentMemberId,
        completionId,
        activity.name,
        'journey',
        score ?? 0,
        100,
        {
          timeSpent: durationMins,
          completedAt: new Date().toISOString(),
        }
      );
    }

    const newStreak = recordMissionComplete(activity);
    setCompletionScore(score);
    setStreak(newStreak);
    setPhase('complete');
  };

  const header = (
    <div className="border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
      <div className="mx-auto flex max-w-4xl items-center gap-4">
        <button
          type="button"
          onClick={onExit}
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:hover:bg-gray-700"
          aria-label="Exit mission"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-600 dark:text-teal-400">
            Family mission
          </p>
          <h2 className="truncate text-lg font-semibold text-gray-900 dark:text-white">{activity.name}</h2>
        </div>
        <HubIcon glyph={activity.icon} size={22} className="shrink-0 text-teal-600 dark:text-teal-400" />
      </div>
    </div>
  );

  if (phase === 'intro') {
    return (
      <div className="flex h-full flex-col bg-gray-50 dark:bg-gray-950">
        {header}
        <div className="flex-1 overflow-auto px-4 py-6 sm:px-6">
          <div className="mx-auto max-w-lg space-y-6 text-center">
            <HubBrandLogo size="lg" variant="card" className="mx-auto" alt="PandaGarde" />
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-700 dark:bg-teal-900/30 dark:text-teal-200">
                <Sparkles size={14} aria-hidden="true" />
                Step 1 · Mission intro
              </div>
              <h3 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">{activity.name}</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{activity.description}</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 text-xs font-medium">
              <span className="rounded-full bg-white px-3 py-1 text-teal-700 ring-1 ring-teal-200 dark:bg-gray-800 dark:text-teal-200 dark:ring-teal-700/50">
                Ages {activity.groupAgeRange}
              </span>
              <span className="rounded-full bg-white px-3 py-1 text-gray-700 ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-600">
                {activity.duration}
              </span>
              <span className="rounded-full bg-white px-3 py-1 text-gray-700 ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-600">
                {activity.familyMode}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-200">{activity.learningObjective}</p>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-left dark:border-amber-700/40 dark:bg-amber-900/20">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                Real-life situation
              </p>
              <p className="mt-2 text-sm leading-relaxed text-amber-950 dark:text-amber-100">{activity.realLifeScenario}</p>
            </div>
            <MissionStepProgress phase={phase} hasGame={hasGame} />
            <button
              type="button"
              onClick={() => setPhase('learn')}
              className="inline-flex min-h-[48px] w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-base font-semibold text-white hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            >
              Let&apos;s go
              <Play size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'learn') {
    return (
      <div className="flex h-full flex-col bg-gray-50 dark:bg-gray-900">
        {header}
        <div className="flex-1 overflow-auto px-4 py-5 sm:px-6">
          <div className="mx-auto flex max-w-4xl flex-col gap-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
              Step 2 · Talk together
            </p>

            <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-700/40 dark:bg-amber-900/20">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                Real-life scenario
              </p>
              <p className="mt-2 text-sm leading-relaxed text-amber-950 dark:text-amber-100">{activity.realLifeScenario}</p>
            </section>

            <section className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5 dark:border-indigo-700/40 dark:bg-indigo-900/20">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
                <MessageCircleHeart size={14} aria-hidden="true" />
                Family prompt
              </p>
              <p className="mt-2 text-sm leading-relaxed text-indigo-950 dark:text-indigo-100">{activity.familyPrompt}</p>
            </section>

            {activity.discussionPrompts.length > 0 && (
              <section className="rounded-2xl border border-violet-200 bg-violet-50 p-5 dark:border-violet-700/40 dark:bg-violet-900/20">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">
                  <MessageCircle size={14} aria-hidden="true" />
                  Discussion starters
                </p>
                <ul className="mt-3 space-y-2">
                  {activity.discussionPrompts.map((prompt) => (
                    <li key={prompt} className="flex items-start gap-2 text-sm text-violet-950 dark:text-violet-100">
                      <span className="mt-0.5 text-violet-500" aria-hidden="true">
                        ?
                      </span>
                      {prompt}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
                <BookOpen size={14} aria-hidden="true" />
                Key learnings
              </p>
              <ul className="mt-3 space-y-2">
                {activity.keyLearnings.slice(0, 3).map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-200">
                    <span className="text-teal-500" aria-hidden="true">
                      ✓
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-700/40 dark:bg-emerald-900/20">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                <Target size={14} aria-hidden="true" />
                After this mission
              </p>
              <p className="mt-2 text-sm text-emerald-950 dark:text-emerald-100">{activity.nextStep}</p>
            </section>

            <MissionStepProgress phase={phase} hasGame={hasGame} />

            <div className="flex flex-col gap-2 pb-4 sm:flex-row">
              {hasGame ? (
                <button
                  type="button"
                  onClick={() => setPhase('play')}
                  className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                >
                  <Play size={18} aria-hidden="true" />
                  Start interactive activity
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => finishMission(100)}
                  className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                >
                  We had our family conversation
                </button>
              )}
              <button
                type="button"
                onClick={() => setPhase('intro')}
                className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'play' && activity.activityManagerId) {
    return (
      <div className="flex h-full flex-col bg-gray-50 dark:bg-gray-900">
        {header}
        <div className="flex-1 overflow-auto">
          <Suspense fallback={<HubScreenFallback />}>
            <ActivityManager
              activityId={activity.activityManagerId}
              onClose={() => setPhase('learn')}
              onComplete={(_id, score) => finishMission(score)}
            />
          </Suspense>
        </div>
      </div>
    );
  }

  if (phase === 'complete') {
    return (
      <>
        <div className="flex h-full flex-col bg-gray-50 dark:bg-gray-900 opacity-40 pointer-events-none">{header}</div>
        <MissionCelebration
          activity={activity}
          score={completionScore}
          streak={streak}
          nextMission={nextMission}
          onDone={onExit}
          onNextMission={() => {
            if (nextMission && onStartNext) {
              onStartNext(nextMission);
            } else {
              onExit();
            }
          }}
        />
      </>
    );
  }

  return null;
};

export default MissionShell;
