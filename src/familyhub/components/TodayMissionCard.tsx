import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Play, RotateCcw } from 'lucide-react';
import { useProgress } from '../../contexts/ProgressContext';
import { useHubFamilyMembers } from '../../contexts/HubFamilyContext';
import {
  getCompletionId,
  getHubStreak,
  pickTodaysMission,
  preferredAgeFromFamily,
  touchHubStreak,
} from '../../lib/hubMission';
import { hubPaths } from '../hubPaths';

const TodayMissionCard: React.FC = () => {
  const { progress } = useProgress();
  const { members: familyMembers } = useHubFamilyMembers();

  const completedIds = useMemo(() => new Set(progress.completedActivities), [progress.completedActivities]);
  const ageBand = preferredAgeFromFamily(familyMembers);
  const todaysMission = useMemo(
    () => pickTodaysMission(completedIds, ageBand),
    [completedIds, ageBand]
  );

  const streak = getHubStreak();
  const completedCount = progress.completedActivities.length;
  const allDone = todaysMission && completedIds.has(getCompletionId(todaysMission)) && completedCount > 0;

  React.useEffect(() => {
    touchHubStreak();
  }, []);

  if (!todaysMission) {
    return null;
  }

  const missionDone = completedIds.has(getCompletionId(todaysMission));

  return (
    <section
      className="hub-card-lift overflow-hidden rounded-2xl border-2 border-teal-300 bg-gradient-to-br from-teal-50 via-white to-amber-50/60 p-5 shadow-md dark:border-teal-600/60 dark:from-teal-900/30 dark:via-gray-800 dark:to-amber-900/10"
      aria-labelledby="today-mission-heading"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
            {missionDone ? 'Great progress today' : 'Today\u2019s mission'}
          </p>
          <h2 id="today-mission-heading" className="mt-1 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
            {!missionDone && (
              <span className="text-2xl" role="img" aria-hidden="true">
                {todaysMission.icon}
              </span>
            )}
            {missionDone ? 'Pick another mission or revisit a favourite' : todaysMission.name}
          </h2>
          {!missionDone && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              {todaysMission.icon} Ages {todaysMission.groupAgeRange} · {todaysMission.duration} · {todaysMission.focus}
            </p>
          )}
        </div>
        {streak > 0 && (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
            <Flame size={16} className="text-amber-600 dark:text-amber-400" aria-hidden="true" />
            {streak} day{streak === 1 ? '' : 's'}
          </div>
        )}
      </div>

      {missionDone ? (
        <p className="mt-3 text-sm text-gray-700 dark:text-gray-200">
          You&apos;ve already completed this pick. Start another activity to keep your streak going.
        </p>
      ) : (
        <div className="mt-3 space-y-3">
          <div className="rounded-xl border border-amber-200 bg-amber-50/90 p-3 dark:border-amber-700/40 dark:bg-amber-900/20">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
              Real-life situation
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-amber-950 dark:text-amber-100">
              {todaysMission.realLifeScenario}
            </p>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-200">
            <span className="font-semibold text-indigo-800 dark:text-indigo-200">Family cue: </span>
            {todaysMission.familyPrompt}
          </p>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          to={hubPaths.activities}
          state={{ startMissionId: todaysMission.id }}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
        >
          {missionDone ? (
            <>
              <RotateCcw size={16} aria-hidden="true" />
              Browse activities
            </>
          ) : (
            <>
              <Play size={16} aria-hidden="true" />
              Continue journey
            </>
          )}
        </Link>
        {familyMembers.length === 0 && (
          <Link
            to={hubPaths.kids}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-teal-300 bg-white px-4 py-2.5 text-sm font-semibold text-teal-800 hover:bg-teal-50 dark:border-teal-600 dark:bg-gray-800 dark:text-teal-200"
          >
            Add family members
          </Link>
        )}
      </div>

      {allDone && (
        <p className="mt-3 text-xs text-teal-700 dark:text-teal-300">
          You&apos;ve explored every mission in the catalogue — replay favourites anytime in Activities.
        </p>
      )}
    </section>
  );
};

export default TodayMissionCard;
