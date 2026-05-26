import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Gamepad2, Plus } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useHubFamilyMembers } from '../../contexts/HubFamilyContext';
import AgeBandStrip from '../components/AgeBandStrip';
import HubPageLayout from '../components/HubPageLayout';
import HubScreenHero from '../components/HubScreenHero';
import HubTour from '../components/HubTour';
import TodayMissionCard from '../components/TodayMissionCard';
import { getHubOrigin, touchHubStreak } from '../../lib/hubMission';
import { hubPaths } from '../hubPaths';

interface FamilyGoal {
  completed?: boolean;
}

const DashboardScreen: React.FC = () => {
  const { members: familyMembers } = useHubFamilyMembers();
  const [familyGoals] = useLocalStorage<FamilyGoal[]>('pandagarde_family_goals', []);
  const completedGoals = familyGoals.filter((goal) => goal?.completed).length;
  const hubOrigin = getHubOrigin();

  useEffect(() => {
    touchHubStreak();
  }, []);

  return (
    <div className="min-h-full min-w-0">
      <HubTour />
      <HubPageLayout>
        <HubScreenHero
          badge={hubOrigin === 'web' ? 'Welcome back' : 'Today'}
          title={
            familyMembers.length === 0
              ? 'Add your family to get started'
              : "Ready for today's mission?"
          }
          subtitle={
            familyMembers.length === 0
              ? 'Add each child with their age so we can suggest the right privacy missions.'
              : hubOrigin === 'web'
                ? "Start with today's mission below. Badges and certificates are under Journey."
                : 'Complete one mission together, then check Journey for badges and certificates.'
          }
          compact
        />

        {familyMembers.length === 0 && (
          <Link
            to={hubPaths.kids}
            className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-teal-300 bg-teal-50 px-4 py-4 text-sm font-semibold text-teal-800 transition-colors hover:border-teal-400 hover:bg-teal-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-teal-600 dark:bg-teal-900/20 dark:text-teal-200 dark:hover:bg-teal-900/30"
          >
            <Plus size={18} aria-hidden="true" />
            Add your first family member
          </Link>
        )}

        <TodayMissionCard />

        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="flex min-h-[4.75rem] flex-col justify-between rounded-xl border border-teal-100 bg-teal-50/70 px-5 py-4 dark:border-teal-700/50 dark:bg-teal-900/20">
            <dt className="text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-200">
              Profiles
            </dt>
            <dd className="text-right text-2xl font-bold tabular-nums text-teal-900 dark:text-teal-100">
              {familyMembers.length}
            </dd>
          </div>
          <div className="flex min-h-[4.75rem] flex-col justify-between rounded-xl border border-indigo-100 bg-indigo-50/70 px-5 py-4 dark:border-indigo-700/50 dark:bg-indigo-900/20">
            <dt className="text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-200">
              Goals done
            </dt>
            <dd className="text-right text-2xl font-bold tabular-nums text-indigo-900 dark:text-indigo-100">
              {completedGoals}
            </dd>
          </div>
          <div className="col-span-2 flex min-h-[4.75rem] flex-col justify-between rounded-xl border border-amber-100 bg-amber-50/70 px-5 py-4 dark:col-span-1 dark:border-amber-700/50 dark:bg-amber-900/20">
            <dt className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-200">
              Open goals
            </dt>
            <dd className="text-right text-2xl font-bold tabular-nums text-amber-900 dark:text-amber-100">
              {Math.max(familyGoals.length - completedGoals, 0)}
            </dd>
          </div>
        </dl>

        <AgeBandStrip title="Pick an age path" />

        {familyMembers.length > 0 && (
          <nav aria-label="Suggested next steps" className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link
              to={hubPaths.activities}
              className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-teal-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-teal-500"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700 group-hover:bg-teal-600 group-hover:text-white dark:bg-teal-900/40 dark:text-teal-200">
                <Gamepad2 size={20} aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-gray-900 dark:text-white">Browse missions</span>
                <span className="block text-xs text-gray-600 dark:text-gray-300">
                  Age-matched activities and games
                </span>
              </span>
            </Link>
            <Link
              to={hubPaths.kids}
              className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-teal-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-teal-500"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700 group-hover:bg-teal-600 group-hover:text-white dark:bg-teal-900/40 dark:text-teal-200">
                <Users size={20} aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-gray-900 dark:text-white">Manage family</span>
                <span className="block text-xs text-gray-600 dark:text-gray-300">
                  Update ages and active learner
                </span>
              </span>
            </Link>
          </nav>
        )}
      </HubPageLayout>
    </div>
  );
};

export default DashboardScreen;
