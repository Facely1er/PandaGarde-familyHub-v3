import React, { lazy, Suspense, useEffect } from "react";
import { Users, Gamepad2, Award, Settings } from 'lucide-react';
import { Link } from "react-router-dom";
import { HubScreenFallback } from "../lazyScreen";

const FamilyDashboard = lazy(() => import("../../components/FamilyDashboard"));
import { updateDfaJourneyPhase } from "../../lib/dfaJourney";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useHubFamilyMembers } from "../../contexts/HubFamilyContext";
import AgeBandStrip from '../components/AgeBandStrip';
import HubScreenHero from '../components/HubScreenHero';
import HubTour from '../components/HubTour';
import TodayMissionCard from '../components/TodayMissionCard';
import { getHubOrigin, touchHubStreak } from "../../lib/hubMission";
import { hubPaths } from "../hubPaths";

interface FamilyGoal {
  completed?: boolean;
}

const quickActions = [
  {
    title: 'Manage Family',
    description: 'Add or review kids and guardians',
    to: hubPaths.kids,
    icon: Users,
  },
  {
    title: 'Start Activities',
    description: 'Launch age-appropriate learning activities',
    to: hubPaths.activities,
    icon: Gamepad2,
  },
  {
    title: 'Track Progress',
    description: 'View achievements and certificates',
    to: hubPaths.progress,
    icon: Award,
  },
  {
    title: 'Open Settings',
    description: 'Adjust preferences and support links',
    to: hubPaths.settings,
    icon: Settings,
  },
];

const DashboardScreen: React.FC = () => {
  const { members: familyMembers } = useHubFamilyMembers();
  const [familyGoals] = useLocalStorage<FamilyGoal[]>('pandagarde_family_goals', []);
  const completedGoals = familyGoals.filter((goal) => goal?.completed).length;

  const hubOrigin = getHubOrigin();

  useEffect(() => {
    updateDfaJourneyPhase('hub', { visited: true, completed: true, resumePath: '/family-hub/dashboard' });
    touchHubStreak();
  }, []);

  return (
    <div className="min-h-full">
      <HubTour />
      <section className="px-4 py-5">
        <div className="mx-auto flex max-w-5xl flex-col gap-5">
          <HubScreenHero
            badge={hubOrigin === 'web' ? 'Assessment complete' : 'Your family HQ'}
            title="Ready for today's mission?"
            subtitle={
              hubOrigin === 'web'
                ? "Your plan is saved on this device. Start with today's mission, then explore missions by age."
                : 'Add family members, pick an age path, and complete one real-world privacy mission together.'
            }
            compact
          />
          <TodayMissionCard />
          <AgeBandStrip title="Explore by age" />

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-teal-100 bg-teal-50/70 p-3 dark:border-teal-700/50 dark:bg-teal-900/20">
              <p className="text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-200">Members</p>
              <p className="mt-1 text-xl font-bold text-teal-900 dark:text-teal-100">{familyMembers.length}</p>
            </div>
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-3 dark:border-indigo-700/50 dark:bg-indigo-900/20">
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-200">Goals done</p>
              <p className="mt-1 text-xl font-bold text-indigo-900 dark:text-indigo-100">{completedGoals}</p>
            </div>
            <div className="col-span-2 rounded-xl border border-amber-100 bg-amber-50/70 p-3 dark:col-span-1 dark:border-amber-700/50 dark:bg-amber-900/20">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-200">Open goals</p>
              <p className="mt-1 text-xl font-bold text-amber-900 dark:text-amber-100">
                {Math.max(familyGoals.length - completedGoals, 0)}
              </p>
            </div>
          </div>

          <nav aria-label="Dashboard quick actions">
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {quickActions.map(({ title, description, to, icon: Icon }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-teal-500"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700 transition-colors group-hover:bg-teal-600 group-hover:text-white dark:bg-teal-900/40 dark:text-teal-200">
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-gray-900 dark:text-white">{title}</span>
                      <span className="block text-xs text-gray-600 dark:text-gray-300">{description}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>
      <Suspense fallback={<HubScreenFallback />}>
        <FamilyDashboard appMode={true} />
      </Suspense>
    </div>
  );
};

export default DashboardScreen;
