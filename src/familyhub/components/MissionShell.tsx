import React, { Suspense, useEffect, useState } from 'react';
import { lazy } from '../../lib/lazyWithRetry';
import { ArrowLeft, BookOpen, HelpCircle, MessageCircle, MessageCircleHeart, Play, Target } from 'lucide-react';
import { HubScreenFallback } from '../HubScreenFallback';

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
import { HubIcon } from '../hubIcons';
import { getForestCharacter } from '../../data/forestCharacters';
import { StoryCharacterPortrait } from '../../components/stories/StoryCharacterPortrait';
import RelatedStoryLink from './RelatedStoryLink';
import MissionScenarioCustomize from './MissionScenarioCustomize';
import { useFootprintAnalysis, useResolvedMissionScenario } from '../../hooks/useResolvedMissionScenario';
import { useHubI18n } from '../hubI18n';
import { isAppReviewDemo, setAppReviewView } from '../../lib/appReviewDemo';

export type MissionPhase = 'intro' | 'play' | 'complete';

interface MissionShellProps {
  activity: FlattenedAgeBasedActivity;
  completedIds: Set<string>;
  onExit: () => void;
  onStartNext?: (activity: FlattenedAgeBasedActivity) => void;
}

const MissionStepProgress: React.FC<{ phase: MissionPhase; hasGame: boolean; compact?: boolean }> = ({
  phase,
  hasGame,
  compact = false,
}) => {
  const { t } = useHubI18n();
  const steps = hasGame
    ? ([t('hub.mission.stepReadTalk'), t('hub.mission.stepPractice'), t('hub.mission.stepDone')] as const)
    : ([t('hub.mission.stepReadTalk'), t('hub.mission.stepDone')] as const);
  const phaseIndex: Record<MissionPhase, number> = hasGame
    ? { intro: 0, play: 1, complete: 2 }
    : { intro: 0, complete: 1 };
  const current = phaseIndex[phase];

  return (
    <nav aria-label={t('hub.mission.progress')} className={compact ? 'w-full' : 'mx-auto w-full max-w-lg'}>
      <ol className="flex items-center justify-between gap-1">
        {steps.map((label, index) => {
          const done = index < current;
          const active = index === current;
          return (
            <li key={label} className="flex flex-1 flex-col items-center gap-0.5">
              <span
                className={`flex items-center justify-center rounded-full font-bold ${
                  compact ? 'h-6 w-6 text-[10px]' : 'h-7 w-7 text-[11px]'
                } ${
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
                className={`font-medium uppercase tracking-wide ${
                  compact ? 'text-[9px]' : 'text-[10px]'
                } ${active ? 'text-teal-700 dark:text-teal-300' : 'text-gray-400 dark:text-gray-500'}`}
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

const MissionIntroDetails: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}> = ({ title, icon, children, defaultOpen = false }) => {
  const { t } = useHubI18n();
  return (
  <details
    open={defaultOpen}
    className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
  >
    <summary className="flex cursor-pointer list-none items-center justify-between gap-2 p-3 text-sm font-semibold text-gray-900 marker:content-none dark:text-white [&::-webkit-details-marker]:hidden">
      <span className="flex min-w-0 items-center gap-2">
        {icon}
        {title}
      </span>
      <span className="shrink-0 text-xs font-medium text-gray-400 dark:text-gray-500">{t('hub.mission.more')}</span>
    </summary>
    <div className="border-t border-gray-100 px-3 pb-3 pt-2 dark:border-gray-700">{children}</div>
  </details>
  );
};

const MissionShell: React.FC<MissionShellProps> = ({ activity, completedIds, onExit, onStartNext }) => {
  const {
    t,
    characterEpithet,
    getMissionName,
    getMissionText,
    getMissionList,
    getFamilyModeLabel,
    getDurationLabel,
  } = useHubI18n();
  const hasGame = Boolean(activity.activityManagerId);
  const [phase, setPhase] = useState<MissionPhase>('intro');
  const [completionScore, setCompletionScore] = useState<number | undefined>();
  const [streak, setStreak] = useState(0);
  const { markActivityCompleted } = useProgress();
  const { recordActivityCompletion } = useFamilyProgress();
  const { currentMemberId } = useActiveMember();
  const footprintAnalysis = useFootprintAnalysis();
  const { scenario, isPremium, parentInput, saveParentInput, clearParentInput } =
    useResolvedMissionScenario(activity);

  const nextMission = pickNextMission(activity, completedIds);
  const guide = activity.guideCharacter ? getForestCharacter(activity.guideCharacter) : undefined;

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

  useEffect(() => {
    if (!isAppReviewDemo()) {
      return;
    }
    if (phase === 'intro') {
      setAppReviewView('mission-intro');
    } else if (phase === 'complete') {
      setAppReviewView('mission-complete');
    }
  }, [phase]);

  /** App Review: skip lazy-loaded games — auto-complete from intro to avoid NavigationErrorBoundary. */
  useEffect(() => {
    if (!isAppReviewDemo() || phase !== 'intro') {
      return;
    }
    const timer = window.setTimeout(() => finishMission(92), 1600);
    return () => window.clearTimeout(timer);
    // finishMission is stable enough for demo auto-complete
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, activity.id]);

  const header = (
    <div className="shrink-0 border-b border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800">
      <div className="mx-auto flex w-full max-w-4xl items-center gap-4">
        <button
          type="button"
          onClick={onExit}
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:hover:bg-gray-700"
          aria-label={t('hub.mission.exit')}
        >
          <ArrowLeft size={20} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-600 dark:text-teal-400">
            {t('hub.mission.familyMission')}
          </p>
          <h2 className="truncate text-lg font-semibold text-gray-900 dark:text-white">{getMissionName(activity)}</h2>
        </div>
        <HubIcon glyph={activity.icon} size={22} className="shrink-0 text-teal-600 dark:text-teal-400" />
      </div>
    </div>
  );

  if (phase === 'intro') {
    return (
      <div className="flex h-full min-h-0 flex-col bg-gray-50 dark:bg-gray-950">
        {header}
        <div className="min-h-0 flex-1 overflow-auto px-4 py-3 sm:px-6">
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-3">
            <div>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {getMissionText(activity.id, 'description', activity.description)}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5 text-xs font-medium">
                <span className="rounded-full bg-white px-2.5 py-0.5 text-teal-700 ring-1 ring-teal-200 dark:bg-gray-800 dark:text-teal-200 dark:ring-teal-700/50">
                  {t('hub.activities.ages', { range: activity.groupAgeRange })}
                </span>
                <span className="rounded-full bg-white px-2.5 py-0.5 text-gray-700 ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-600">
                  {getDurationLabel(activity.duration)}
                </span>
                <span className="rounded-full bg-white px-2.5 py-0.5 text-gray-700 ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-600">
                  {getFamilyModeLabel(activity.familyMode)}
                </span>
                <RelatedStoryLink missionId={activity.id} variant="chip" />
              </div>
            </div>

            <p className="rounded-xl border border-gray-200 bg-white p-3 text-sm leading-relaxed text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
              <span className="font-semibold text-gray-900 dark:text-white">{t('hub.mission.learningGoal')} </span>
              {getMissionText(activity.id, 'learningObjective', activity.learningObjective)}
            </p>

            {guide && (
              <div className="flex items-center gap-2.5 rounded-xl border border-green-200 bg-green-50 p-2.5 dark:border-green-700/40 dark:bg-green-900/20">
                <StoryCharacterPortrait character={guide} size="sm" />
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-green-700 dark:text-green-300">
                    {t('hub.mission.forestGuide')}
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {guide.name} · {characterEpithet(guide.id) || guide.epithet}
                  </p>
                </div>
              </div>
            )}

            <section className="rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-700/40 dark:bg-amber-900/20">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                {t('hub.mission.realLifeScenario')}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-amber-950 dark:text-amber-100">{scenario.text}</p>
              {scenario.isPersonalized && (
                <p className="mt-1.5 text-xs font-medium text-amber-800 dark:text-amber-200">
                  {t('hub.mission.personalizedFamily')}
                </p>
              )}
            </section>

            <MissionScenarioCustomize
              activity={activity}
              scenario={scenario}
              isPremium={isPremium}
              parentInput={parentInput}
              onSave={saveParentInput}
              onClear={clearParentInput}
              hasFootprintData={footprintAnalysis !== null}
            />

            <section className="rounded-xl border border-indigo-200 bg-indigo-50 p-3 dark:border-indigo-700/40 dark:bg-indigo-900/20">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
                <MessageCircleHeart size={14} aria-hidden="true" />
                {t('hub.mission.familyPrompt')}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-indigo-950 dark:text-indigo-100">
                {getMissionText(activity.id, 'familyPrompt', activity.familyPrompt)}
              </p>
            </section>

            {activity.discussionPrompts.length > 0 && (
              <MissionIntroDetails
                title={t('hub.mission.discussionStarters')}
                icon={<MessageCircle size={14} className="text-violet-500" aria-hidden="true" />}
              >
                <ul className="space-y-1.5">
                  {getMissionList(activity.id, 'discussionPrompts', activity.discussionPrompts).map((prompt) => (
                    <li key={prompt} className="flex items-start gap-2 text-sm text-violet-950 dark:text-violet-100">
                      <HelpCircle size={15} className="mt-0.5 shrink-0 text-violet-500" aria-hidden="true" />
                      {prompt}
                    </li>
                  ))}
                </ul>
              </MissionIntroDetails>
            )}

            <MissionIntroDetails
              title={t('hub.mission.keyLearnings')}
              icon={<BookOpen size={14} className="text-teal-600 dark:text-teal-400" aria-hidden="true" />}
            >
              <ul className="space-y-1.5">
                {getMissionList(activity.id, 'keyLearnings', activity.keyLearnings).slice(0, 3).map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-200">
                    <span className="text-teal-500" aria-hidden="true">
                      ✓
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </MissionIntroDetails>

            <MissionIntroDetails
              title={t('hub.mission.afterMission')}
              icon={<Target size={14} className="text-emerald-600 dark:text-emerald-400" aria-hidden="true" />}
            >
              <p className="text-sm text-emerald-950 dark:text-emerald-100">
                {getMissionText(activity.id, 'nextStep', activity.nextStep)}
              </p>
            </MissionIntroDetails>
          </div>
        </div>

        <div className="shrink-0 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/95 sm:px-6">
          <div className="mx-auto w-full max-w-4xl space-y-3">
            <MissionStepProgress phase={phase} hasGame={hasGame} compact />
            {hasGame ? (
              <button
                type="button"
                onClick={() => setPhase('play')}
                className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-base font-semibold text-white hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
              >
                <Play size={18} aria-hidden="true" />
                {t('hub.mission.startInteractive')}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => finishMission(100)}
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-teal-600 px-4 py-3 text-base font-semibold text-white hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
              >
                {t('hub.mission.hadConversation')}
              </button>
            )}
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
              onClose={() => setPhase('intro')}
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
