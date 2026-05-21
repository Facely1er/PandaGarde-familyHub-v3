import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Play, RotateCcw } from 'lucide-react';
import { useProgress } from '../../contexts/ProgressContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import {
  getCompletionId,
  getHubStreak,
  pickTodaysMission,
  preferredAgeFromFamily,
  touchHubStreak,
} from '../../lib/hubMission';
import { hubPaths } from '../hubPaths';

interface FamilyMember {
  name: string;
  age: number;
  role: string;
}

const TodayMissionCard: React.FC = () => {
  const { progress } = useProgress();
  const [familyMembers] = useLocalStorage<FamilyMember[]>('pandagarde_family', []);

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
      className="rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 via-white to-cyan-50 p-5 shadow-sm dark:border-teal-700/50 dark:from-teal-900/20 dark:via-gray-800 dark:to-gray-800"
      aria-labelledby="today-mission-heading"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
            {missionDone ? 'Great progress today' : 'Today\u2019s mission'}
          </p>
          <h2 id="today-mission-heading" className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
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

      <p className="mt-3 text-sm text-gray-700 dark:text-gray-200">
        {missionDone
          ? 'You\u2019ve already completed this pick. Start another activity to keep your streak going.'
          : todaysMission.familyPrompt}
      </p>

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
