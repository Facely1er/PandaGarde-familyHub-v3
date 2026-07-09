import React, { useRef } from 'react';
import { Award, ArrowRight, Sparkles, Target } from 'lucide-react';
import HubBrandLogo from './HubBrandLogo';
import { useDialogFocusTrap } from '../../hooks/useDialogFocusTrap';
import type { FlattenedAgeBasedActivity } from '../../data/ageBasedActivities';
import { CHARACTER_CELEBRATION_LINES, getForestCharacter } from '../../data/forestCharacters';
import { StoryCharacterPortrait } from '../../components/stories/StoryCharacterPortrait';
import { useHubI18n } from '../hubI18n';

interface MissionCelebrationProps {
  activity: FlattenedAgeBasedActivity;
  score?: number;
  streak: number;
  nextMission: FlattenedAgeBasedActivity | null;
  onDone: () => void;
  onNextMission: () => void;
}

const MissionCelebration: React.FC<MissionCelebrationProps> = ({
  activity,
  score,
  streak,
  nextMission,
  onDone,
  onNextMission,
}) => {
  const {
    t,
    characterEpithet,
    getMissionName,
    getMissionText,
    getCelebrationLine,
  } = useHubI18n();
  const doneRef = useRef<HTMLButtonElement>(null);
  const guide = activity.guideCharacter ? getForestCharacter(activity.guideCharacter) : undefined;
  const guideLine = activity.guideCharacter
    ? getCelebrationLine(
        activity.guideCharacter,
        CHARACTER_CELEBRATION_LINES[activity.guideCharacter] ?? ''
      )
    : undefined;
  const dialogRef = useDialogFocusTrap({
    isOpen: true,
    onClose: onDone,
    returnFocusRef: doneRef,
  });
  const missionName = getMissionName(activity);
  const scorePart = score !== undefined ? t('hub.celebration.scorePart', { score }) : '';
  const finishedHtml =
    t('hub.celebration.finished', { name: missionName, scorePart }) + (!guide ? t('hub.celebration.pandaProud') : '');

  return (
    <div
      className="fixed inset-0 z-[1100] flex items-end justify-center bg-black/50 p-4 sm:items-center"
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mission-celebration-title"
        className="w-full max-w-md rounded-3xl border border-teal-200 bg-white p-6 shadow-xl dark:border-teal-700/50 dark:bg-gray-800"
      >
        <div className="text-center">
          {guide ? (
            <div className="mx-auto flex w-fit justify-center">
              <StoryCharacterPortrait character={guide} size="lg" highlight />
            </div>
          ) : (
            <HubBrandLogo size="md" variant="card" className="mx-auto" alt="" />
          )}
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-700 dark:bg-teal-900/40 dark:text-teal-200">
            <Sparkles size={14} aria-hidden="true" />
            {t('hub.celebration.badge')}
          </p>
          <h2 id="mission-celebration-title" className="mt-3 text-xl font-bold text-gray-900 dark:text-white">
            {t('hub.celebration.title')}
          </h2>
          <p
            className="mt-2 text-sm text-gray-600 dark:text-gray-300"
            dangerouslySetInnerHTML={{ __html: finishedHtml }}
          />
          {guide && guideLine && (
            <p className="mt-3 rounded-2xl border border-green-100 bg-green-50 p-3 text-sm italic leading-relaxed text-green-900 dark:border-green-800/40 dark:bg-green-900/20 dark:text-green-100">
              {guideLine}
              <span className="mt-1 block text-xs font-semibold not-italic text-green-700 dark:text-green-300">
                — {guide.name}, {characterEpithet(guide.id) || guide.epithet}
              </span>
            </p>
          )}
          {streak > 0 && (
            <p className="mt-3 text-sm font-medium text-amber-700 dark:text-amber-300">
              <Award size={16} className="mr-1 inline" aria-hidden="true" />
              {t('hub.celebration.streak', { count: streak })}
            </p>
          )}
        </div>

        <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-left dark:border-emerald-700/40 dark:bg-emerald-900/20">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
            <Target size={14} aria-hidden="true" />
            {t('hub.celebration.tryAtHome')}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-emerald-950 dark:text-emerald-100">
            {getMissionText(activity.id, 'nextStep', activity.nextStep)}
          </p>
        </div>

        {nextMission && (
          <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50 p-4 dark:border-indigo-700/40 dark:bg-indigo-900/20">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
              {t('hub.celebration.upNext')}
            </p>
            <p className="mt-1 text-sm font-semibold text-indigo-950 dark:text-indigo-100">
              {nextMission.icon} {getMissionName(nextMission)}
            </p>
            <p className="mt-1 text-xs text-indigo-800/80 dark:text-indigo-200/80">
              {t('hub.celebration.agesDuration', {
                duration: getDurationLabel(nextMission.duration),
                range: nextMission.groupAgeRange,
              })}
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2">
          {nextMission && (
            <button
              type="button"
              onClick={onNextMission}
              className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            >
              {t('hub.celebration.continueNext')}
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          )}
          <button
            ref={doneRef}
            type="button"
            onClick={onDone}
            className={`inline-flex min-h-[44px] w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
              nextMission
                ? 'border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100'
                : 'bg-teal-600 text-white hover:bg-teal-700'
            }`}
          >
            {nextMission ? t('hub.celebration.backToActivities') : t('hub.celebration.doneForNow')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MissionCelebration;
