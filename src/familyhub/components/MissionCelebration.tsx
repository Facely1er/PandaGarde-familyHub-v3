import React, { useRef } from 'react';
import { Award, ArrowRight, Sparkles, Target } from 'lucide-react';
import { useDialogFocusTrap } from '../../hooks/useDialogFocusTrap';
import type { FlattenedAgeBasedActivity } from '../../data/ageBasedActivities';

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
  const doneRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useDialogFocusTrap({
    isOpen: true,
    onClose: onDone,
    returnFocusRef: doneRef,
  });

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
          <span className="text-5xl" role="img" aria-hidden="true">
            🐼
          </span>
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-700 dark:bg-teal-900/40 dark:text-teal-200">
            <Sparkles size={14} aria-hidden="true" />
            Mission complete
          </p>
          <h2 id="mission-celebration-title" className="mt-3 text-xl font-bold text-gray-900 dark:text-white">
            Nice work, family!
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            You finished <strong>{activity.name}</strong>
            {score !== undefined ? ` with ${score}%` : ''}. Privacy Panda is proud of your teamwork.
          </p>
          {streak > 0 && (
            <p className="mt-3 text-sm font-medium text-amber-700 dark:text-amber-300">
              <Award size={16} className="mr-1 inline" aria-hidden="true" />
              {streak}-day family learning streak
            </p>
          )}
        </div>

        <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-left dark:border-emerald-700/40 dark:bg-emerald-900/20">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
            <Target size={14} aria-hidden="true" />
            Try this at home
          </p>
          <p className="mt-2 text-sm leading-relaxed text-emerald-950 dark:text-emerald-100">{activity.nextStep}</p>
        </div>

        {nextMission && (
          <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50 p-4 dark:border-indigo-700/40 dark:bg-indigo-900/20">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
              Up next
            </p>
            <p className="mt-1 text-sm font-semibold text-indigo-950 dark:text-indigo-100">
              {nextMission.icon} {nextMission.name}
            </p>
            <p className="mt-1 text-xs text-indigo-800/80 dark:text-indigo-200/80">{nextMission.duration} · Ages {nextMission.groupAgeRange}</p>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2">
          {nextMission && (
            <button
              type="button"
              onClick={onNextMission}
              className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            >
              Continue to next mission
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
            {nextMission ? 'Back to activities' : 'Done for now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MissionCelebration;
