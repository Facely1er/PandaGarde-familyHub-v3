import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useHubI18n } from '../hubI18n';
import { Users, Gamepad2, Plus, X, BookOpen, Fingerprint, ListChecks } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useHubFamilyMembers } from '../../hooks/useHubFamilyMembers';
import AgeBandStrip from '../components/AgeBandStrip';
import HubPageLayout from '../components/HubPageLayout';
import HubScreenHero from '../components/HubScreenHero';
import HubTour from '../components/HubTour';
import TodayMissionCard from '../components/TodayMissionCard';
import { getHubOrigin, touchHubStreak } from '../../lib/hubMission';
import { hubPaths } from '../hubPaths';
import HubWebsiteLink from '../components/HubWebsiteLink';
import { isStoreScreenshotBuild, useStoreCaptureReady } from '../storeScreenshotMode';

interface FamilyGoal {
  completed?: boolean;
}

/** Shown once on first visit — explains how Hub connects to the rest of PandaGarde. */
const HubWelcomeBanner: React.FC<{ onDismiss: () => void }> = ({ onDismiss }) => {
  const { t } = useHubI18n();
  return (
  <div
    role="region"
    aria-label={t('hub.dashboard.welcomeRegion')}
    className="rounded-xl border border-teal-200 bg-teal-50 p-4 dark:border-teal-700/50 dark:bg-teal-900/20"
  >
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1">
        <p className="text-sm font-semibold text-teal-900 dark:text-teal-100">
          {t('hub.dashboard.welcomeTitle')}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-teal-800 dark:text-teal-200">
          {t('hub.dashboard.welcomeBody')}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <HubWebsiteLink
            path="/stories"
            className="inline-flex items-center gap-1.5 rounded-lg border border-teal-300 bg-white px-3 py-1.5 text-xs font-semibold text-teal-800 transition-colors hover:bg-teal-100 dark:border-teal-600 dark:bg-teal-900/40 dark:text-teal-200 dark:hover:bg-teal-900/60"
            showExternalIcon
          >
            <BookOpen size={12} aria-hidden />
            {t('hub.dashboard.stories')}
          </HubWebsiteLink>
          <HubWebsiteLink
            path="/digital-footprint"
            className="inline-flex items-center gap-1.5 rounded-lg border border-teal-300 bg-white px-3 py-1.5 text-xs font-semibold text-teal-800 transition-colors hover:bg-teal-100 dark:border-teal-600 dark:bg-teal-900/40 dark:text-teal-200 dark:hover:bg-teal-900/60"
            showExternalIcon
          >
            <Fingerprint size={12} aria-hidden />
            {t('hub.dashboard.footprint')}
          </HubWebsiteLink>
        </div>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label={t('hub.dashboard.dismissWelcome')}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-teal-600 transition-colors hover:bg-teal-100 dark:text-teal-300 dark:hover:bg-teal-800/40"
      >
        <X size={15} aria-hidden />
      </button>
    </div>
  </div>
  );
};

/** Quick recap of the mission loop for people who skipped the tour. Dismissible. */
const HowMissionsWorkCard: React.FC<{ onDismiss: () => void }> = ({ onDismiss }) => {
  const { t } = useHubI18n();
  const steps = t('hub.dashboard.howMissionsSteps', { returnObjects: true }) as string[];

  return (
  <div
    role="region"
    aria-label={t('hub.dashboard.howMissionsTitle')}
    className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
  >
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-2">
        <ListChecks size={16} className="shrink-0 text-teal-600 dark:text-teal-300" aria-hidden />
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">{t('hub.dashboard.howMissionsTitle')}</h2>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label={t('hub.dashboard.dismissHowMissions')}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200"
      >
        <X size={15} aria-hidden />
      </button>
    </div>
    <ol className="mt-3 grid gap-2 text-xs leading-relaxed text-gray-600 dark:text-gray-300 sm:grid-cols-3 sm:gap-3">
      {steps.map((stepText, index) => (
        <li key={stepText} className="flex gap-2">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-[11px] font-bold text-teal-800 dark:bg-teal-900/50 dark:text-teal-200">
            {index + 1}
          </span>
          {stepText}
        </li>
      ))}
    </ol>
  </div>
  );
};

const DashboardScreen: React.FC = () => {
  useStoreCaptureReady();
  const { t } = useHubI18n();
  const { members: familyMembers } = useHubFamilyMembers();
  const [familyGoals] = useLocalStorage<FamilyGoal[]>('pandagarde_family_goals', []);
  const completedGoals = familyGoals.filter((goal) => goal?.completed).length;
  const hubOrigin = getHubOrigin();
  const [welcomeDismissed, setWelcomeDismissed] = useLocalStorage<boolean>(
    'pandagarde_hub_welcome_dismissed',
    false,
  );
  const [missionHintDismissed, setMissionHintDismissed] = useLocalStorage<boolean>(
    'pandagarde_hub_mission_hint_dismissed',
    false,
  );

  useEffect(() => {
    touchHubStreak();
  }, []);

  const hideOnboardingChrome = isStoreScreenshotBuild();

  return (
    <div className="min-h-full min-w-0">
      {!hideOnboardingChrome && <HubTour />}
      <HubPageLayout>
        {!hideOnboardingChrome && !welcomeDismissed && (
          <HubWelcomeBanner onDismiss={() => setWelcomeDismissed(true)} />
        )}

        <HubScreenHero
          badge={hubOrigin === 'web' ? t('hub.dashboard.badgeWeb') : t('hub.dashboard.badgeToday')}
          title={
            familyMembers.length === 0
              ? t('hub.dashboard.titleEmpty')
              : t('hub.dashboard.titleReady')
          }
          subtitle={
            familyMembers.length === 0
              ? t('hub.dashboardEmpty')
              : hubOrigin === 'web'
                ? t('hub.dashboardReady')
                : t('hub.dashboardReadyStandalone')
          }
          compact
        />

        {familyMembers.length === 0 && (
          <Link
            to={hubPaths.kids}
            className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-teal-300 bg-teal-50 px-4 py-4 text-sm font-semibold text-teal-800 transition-colors hover:border-teal-400 hover:bg-teal-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-teal-600 dark:bg-teal-900/20 dark:text-teal-200 dark:hover:bg-teal-900/30"
          >
            <Plus size={18} aria-hidden="true" />
            {t('hub.dashboard.addFirstMember')}
          </Link>
        )}

        <TodayMissionCard />

        {!hideOnboardingChrome && !missionHintDismissed && (
          <HowMissionsWorkCard onDismiss={() => setMissionHintDismissed(true)} />
        )}

        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="flex min-h-[4.75rem] flex-col justify-between rounded-xl border border-teal-100 bg-teal-50/70 px-5 py-4 dark:border-teal-700/50 dark:bg-teal-900/20">
            <dt className="text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-200">
              {t('hub.dashboard.profiles')}
            </dt>
            <dd className="text-right text-2xl font-bold tabular-nums text-teal-900 dark:text-teal-100">
              {familyMembers.length}
            </dd>
          </div>
          <div className="flex min-h-[4.75rem] flex-col justify-between rounded-xl border border-indigo-100 bg-indigo-50/70 px-5 py-4 dark:border-indigo-700/50 dark:bg-indigo-900/20">
            <dt className="text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-200">
              {t('hub.dashboard.goalsDone')}
            </dt>
            <dd className="text-right text-2xl font-bold tabular-nums text-indigo-900 dark:text-indigo-100">
              {completedGoals}
            </dd>
          </div>
          <div className="col-span-2 flex min-h-[4.75rem] flex-col justify-between rounded-xl border border-amber-100 bg-amber-50/70 px-5 py-4 dark:col-span-1 dark:border-amber-700/50 dark:bg-amber-900/20">
            <dt className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-200">
              {t('hub.dashboard.openGoals')}
            </dt>
            <dd className="text-right text-2xl font-bold tabular-nums text-amber-900 dark:text-amber-100">
              {Math.max(familyGoals.length - completedGoals, 0)}
            </dd>
          </div>
        </dl>

        <AgeBandStrip title={t('hub.dashboard.pickAgePath')} />

        {familyMembers.length > 0 && (
          <nav aria-label={t('hub.dashboard.suggestedNext')} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link
              to={hubPaths.activities}
              className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-teal-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-teal-500"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700 group-hover:bg-teal-600 group-hover:text-white dark:bg-teal-900/40 dark:text-teal-200">
                <Gamepad2 size={20} aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-gray-900 dark:text-white">{t('hub.dashboard.browseMissions')}</span>
                <span className="block text-xs text-gray-600 dark:text-gray-300">
                  {t('hub.dashboard.browseMissionsHint')}
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
                <span className="block text-sm font-semibold text-gray-900 dark:text-white">{t('hub.dashboard.manageFamily')}</span>
                <span className="block text-xs text-gray-600 dark:text-gray-300">
                  {t('hub.dashboard.manageFamilyHint')}
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
