import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Clock, Play, Sparkles } from 'lucide-react';
import HubPageLayout from '../components/HubPageLayout';
import HubScreenHero from '../components/HubScreenHero';
import MissionShell from '../components/MissionShell';
import { HUB_AGE_BANDS, type HubAgeRange, hubAgeBandByRange } from '../hubAgeBands';
import { useProgress } from '../../contexts/ProgressContext';
import { findActivityById, getCompletionId } from '../../lib/hubMission';
import {
  ageBasedActivities,
  flattenAgeBasedActivities,
  type ActivityFocus,
  type AgeGroup,
  type FlattenedAgeBasedActivity,
} from '../../data/ageBasedActivities';
import { HubIconBadge } from '../hubIcons';
import { getForestCharacter } from '../../data/forestCharacters';
import { StoryCharacterPortrait } from '../../components/stories/StoryCharacterPortrait';
import RelatedStoryLink from '../components/RelatedStoryLink';
import { useResolvedMissionScenario } from '../../hooks/useResolvedMissionScenario';
import { useHubI18n } from '../hubI18n';
import { useStoreCaptureReady } from '../storeScreenshotMode';
import { APP_REVIEW_START_MISSION, isAppReviewDemo } from '../../lib/appReviewDemo';

const FOCUS_ORDER: ActivityFocus[] = [
  'Safe sharing',
  'Account security',
  'Spotting scams',
  'Privacy settings',
  'Digital footprint',
  'Digital rights',
];

type AgeTabId = HubAgeRange | 'all';
type FocusTabId = 'all' | ActivityFocus;

const extractDurationNumber = (duration: string) => Number.parseInt(duration, 10) || 0;
const ActivityCard: React.FC<{
  activity: FlattenedAgeBasedActivity;
  isCompleted: boolean;
  score?: number;
  onStart: () => void;
  scenario: ResolvedMissionScenario;
}> = ({ activity, isCompleted, score, onStart, scenario }) => {
  const { t, focusLabel, characterEpithet, getMissionName, getMissionText, getDifficultyLabel, getFamilyModeLabel, getDurationLabel, ageBandLabel } = useHubI18n();
  const guide = activity.guideCharacter ? getForestCharacter(activity.guideCharacter) : undefined;
  return (
  <div
    role="button"
    tabIndex={0}
    onClick={onStart}
    onKeyDown={(event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onStart();
      }
    }}
    className={`group flex cursor-pointer flex-col rounded-2xl border p-4 text-left shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
      activity.featured
        ? 'border-teal-200 bg-teal-50/50 hover:border-teal-400 hover:shadow-md dark:border-teal-700/40 dark:bg-teal-900/10 dark:hover:border-teal-500'
        : 'border-gray-200 bg-white hover:border-teal-300 hover:shadow-md dark:border-gray-400 dark:bg-gray-100 dark:hover:border-teal-500'
    }`}
    aria-label={t('hub.activities.startActivityAria', { name: getMissionName(activity) })}
  >
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <HubIconBadge glyph={activity.icon} className="bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300" />
        <div>
          <h3 className="text-base font-semibold leading-snug text-gray-900">{getMissionName(activity)}</h3>
          <p className="mt-1 text-xs text-gray-500">{ageBandLabel(activity.groupAgeRange as '5-8' | '9-12' | '13-17')}</p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        {activity.featured && (
          <span className="rounded-full bg-teal-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-teal-700 dark:bg-teal-900/30 dark:text-teal-200">
            {t('hub.activities.featured')}
          </span>
        )}
        {isCompleted && (
          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">
            {t('hub.activities.completed')}{score !== undefined ? ` · ${score}%` : ''}
          </span>
        )}
      </div>
    </div>

    <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] font-medium">
      <RelatedStoryLink missionId={activity.id} variant="chip" />
      <span className="rounded-full bg-white px-2.5 py-1 text-teal-700 ring-1 ring-teal-200 dark:bg-gray-800 dark:text-teal-300 dark:ring-teal-700/50">
        {t('hub.activities.ages', { range: activity.groupAgeRange })}
      </span>
      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:ring-1 dark:ring-gray-500">
        {focusLabel(activity.focus)}
      </span>
      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200">
        {getDifficultyLabel(activity.difficulty)}
      </span>
    </div>

    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-600">
      {getMissionText(activity.id, 'description', activity.description)}
    </p>

    {guide && (
      <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-green-100 bg-green-50/70 p-2.5 dark:border-green-800/40 dark:bg-green-900/15">
        <StoryCharacterPortrait character={guide} size="sm" />
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-green-700 dark:text-green-300">
            {t('hub.activities.forestGuide')}
          </p>
          <p className="mt-0.5 text-sm font-semibold text-gray-900">
            {guide.name} <span className="font-normal text-gray-500">· {characterEpithet(guide.id) || guide.epithet}</span>
          </p>
        </div>
      </div>
    )}

    <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50/80 p-3 dark:border-amber-800/40 dark:bg-amber-900/15">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
        {t('hub.activities.realLifeSituation')}
      </p>
      <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-amber-950 dark:text-amber-100">
        {scenario.text}
      </p>
      {scenario.isPersonalized && (
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">
          {t('hub.activities.personalized')}
        </p>
      )}
    </div>

    <div className="mt-auto flex items-end justify-between gap-3 pt-3">
      <div className="text-xs text-gray-500">
        <p className="flex items-center gap-1.5">
          <Clock size={13} aria-hidden="true" />
          {getDurationLabel(activity.duration)}
        </p>
        <p className="mt-1">{getFamilyModeLabel(activity.familyMode)}</p>
      </div>
      <div className="flex items-center gap-1 text-sm font-semibold text-teal-600 transition-transform group-hover:translate-x-0.5 dark:text-teal-300">
        <Play size={15} aria-hidden="true" />
        {activity.activityManagerId ? t('hub.activities.startMission') : t('hub.activities.startConversation')}
      </div>
    </div>
  </div>
  );
};

const ActivityCardWithScenario: React.FC<{
  activity: FlattenedAgeBasedActivity;
  isCompleted: boolean;
  score?: number;
  onStart: () => void;
}> = (props) => {
  const { scenario } = useResolvedMissionScenario(props.activity);
  return <ActivityCard {...props} scenario={scenario} />;
};

const GroupHeading: React.FC<{ group: AgeGroup }> = ({ group }) => {
  const { t, ageBandLabel, getAgeGroupDescription } = useHubI18n();
  const band = hubAgeBandByRange(group.ageRange as '5-8' | '9-12' | '13-17');
  return (
  <div className="mb-4 flex items-start gap-3">
    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${band.iconBadgeClass}`}>
      <band.icon size={24} aria-hidden="true" />
    </span>
    <div>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">
        {ageBandLabel(group.ageRange as '5-8' | '9-12' | '13-17')}
        <span className="ml-2 text-sm font-normal text-gray-400 dark:text-gray-500">
          ({t('hub.activities.ages', { range: group.ageRange })})
        </span>
      </h2>
      <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
        {getAgeGroupDescription(group.ageRange, group.description)}
      </p>
    </div>
  </div>
  );
};

const ActivitiesScreen: React.FC = () => {
  useStoreCaptureReady();
  const { t, focusLabel } = useHubI18n();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const locationState = location.state as { initialAgeFilter?: AgeTabId; startMissionId?: string } | null;
  const initialAge: AgeTabId = locationState?.initialAgeFilter ?? 'all';

  const [activeMission, setActiveMission] = useState<FlattenedAgeBasedActivity | null>(null);
  const [activeAge, setActiveAge] = useState<AgeTabId>(initialAge);
  const [activeFocus, setActiveFocus] = useState<FocusTabId>('all');
  const { progress, getActivityProgress } = useProgress();

  useEffect(() => {
    if (locationState?.initialAgeFilter) {
      setActiveAge(locationState.initialAgeFilter);
    }
  }, [locationState?.initialAgeFilter]);

  useEffect(() => {
    const missionId = searchParams.get('mission') ?? locationState?.startMissionId;
    if (missionId) {
      const found = findActivityById(missionId);
      if (found) {
        setActiveMission(found);
      }
    }
  }, [locationState?.startMissionId, searchParams]);

  const allActivities = useMemo(() => flattenAgeBasedActivities(), []);
  const focusTabs = useMemo(
    () => [
      { id: 'all' as const, label: t('hub.activities.allGoals') },
      ...FOCUS_ORDER.filter((focus) => allActivities.some((activity) => activity.focus === focus)).map((focus) => ({
        id: focus,
        label: focusLabel(focus),
      })),
    ],
    [allActivities, focusLabel, t]
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

  const completedIds = useMemo(() => new Set(progress.completedActivities), [progress.completedActivities]);

  const completedCount = useMemo(
    () => filteredActivities.filter((activity) => completedIds.has(getCompletionId(activity))).length,
    [completedIds, filteredActivities]
  );
  const totalMinutes = useMemo(
    () => filteredActivities.reduce((sum, activity) => sum + extractDurationNumber(activity.duration), 0),
    [filteredActivities]
  );
  const showGroupedGrid = activeAge === 'all' && activeFocus === 'all';

  const activeGroup =
    activeAge !== 'all' ? ageBasedActivities.find((candidate) => candidate.ageRange === activeAge) : undefined;
  const headingText = activeGroup
    ? t('hub.activities.missionsForAges', { range: activeGroup.ageRange })
    : activeFocus !== 'all'
      ? t('hub.activities.focusMissions', { focus: focusLabel(activeFocus) })
      : t('hub.activities.allMissions');
  const subText = activeGroup
    ? `${activeGroup.description}${activeFocus !== 'all' ? t('hub.activities.focusedOn', { focus: focusLabel(activeFocus).toLowerCase() }) : ''}`
    : activeFocus !== 'all'
      ? t('hub.activities.acrossAgesFocused', { focus: focusLabel(activeFocus).toLowerCase() })
      : t('hub.activities.browseAll');

  const handleStart = (activity: FlattenedAgeBasedActivity) => {
    setActiveMission(activity);
  };

  useEffect(() => {
    if (!isAppReviewDemo()) {
      return;
    }
    const onStartMission = (event: Event) => {
      const custom = event as CustomEvent<{ missionId: string }>;
      const missionId = custom.detail?.missionId;
      if (!missionId) {
        return;
      }
      const activity = allActivities.find((entry) => entry.id === missionId);
      if (activity) {
        setActiveMission(activity);
      }
    };
    window.addEventListener(APP_REVIEW_START_MISSION, onStartMission);
    return () => window.removeEventListener(APP_REVIEW_START_MISSION, onStartMission);
  }, [allActivities]);

  if (activeMission) {
    return (
      <div className="flex h-full min-h-0 flex-col">
        <MissionShell
          activity={activeMission}
          completedIds={completedIds}
          onExit={() => setActiveMission(null)}
          onStartNext={(next) => setActiveMission(next)}
        />
      </div>
    );
  }

  return (
    <HubPageLayout>
      <HubScreenHero
        badge={t('hub.activities.badge', { count: allActivities.length })}
        title={t('hub.activities.title')}
        subtitle={t('hub.activities.subtitle')}
        compact
      />

      <div className="sticky top-0 z-20 -mx-4 space-y-2 border-b border-gray-200 bg-gray-50/95 px-4 py-2 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-950/95 sm:-mx-6 sm:px-6">
        <div className="flex flex-wrap justify-center gap-1.5" role="tablist" aria-label={t('hub.activities.filterAge')}>
          <button
            role="tab"
            aria-selected={activeAge === 'all'}
            onClick={() => setActiveAge('all')}
            className={`flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 sm:text-sm ${
              activeAge === 'all'
                ? 'border-teal-500 bg-teal-600 text-white shadow-sm'
                : 'border-gray-200 bg-white text-gray-700 hover:border-teal-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200'
            }`}
          >
            {t('hub.activities.allAges')}
          </button>
          {HUB_AGE_BANDS.map((band) => {
            const isActive = activeAge === band.range;
            return (
              <button
                key={band.range}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveAge(band.range)}
                className={`flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 sm:gap-1.5 sm:px-3 sm:text-sm ${
                  isActive ? `${band.chipClass} ring-2 ring-inset ring-teal-500 dark:ring-teal-400` : band.chipClass
                }`}
              >
                <band.icon size={14} className="hidden sm:block" aria-hidden="true" />
                <span>{t(`hub.ageBands.${band.range}.shortLabel`)}</span>
                <span className="hidden text-xs font-medium opacity-75 md:inline">
                  {t(`hub.ageBands.${band.range}.label`)}
                </span>
              </button>
            );
          })}
        </div>

        <div
          className="flex gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="toolbar"
          aria-label={t('hub.activities.filterGoal')}
        >
          {focusTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFocus(tab.id)}
              className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
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
      </div>

      <section aria-labelledby="activities-catalogue-heading">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
          <div className="min-w-0">
            <h2 id="activities-catalogue-heading" className="text-base font-bold text-gray-900 dark:text-white sm:text-lg">
              {headingText}
            </h2>
            <p className="mt-0.5 line-clamp-2 text-xs text-gray-600 dark:text-gray-300 sm:text-sm">{subText}</p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-1.5 text-[11px] font-medium sm:text-xs">
            <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-teal-800 dark:bg-teal-900/30 dark:text-teal-200">
              <Sparkles size={11} aria-hidden="true" />
              <strong className="font-bold tabular-nums">{filteredActivities.length}</strong> {t('hub.activities.missionsCount')}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200">
              <strong className="font-bold tabular-nums">{completedCount}</strong> {t('hub.activities.doneCount')}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200">
              <strong className="font-bold tabular-nums">{totalMinutes}m</strong>
            </span>
          </div>
        </div>

        {filteredActivities.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center dark:border-gray-700 dark:bg-gray-800">
            <p className="text-base font-semibold text-gray-900 dark:text-white">{t('hub.activities.emptyTitle')}</p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {t('hub.activities.emptyBody')}
            </p>
          </div>
        ) : showGroupedGrid ? (
          <div className="space-y-6">
            {ageBasedActivities.map((group) => {
              return (
              <section key={group.ageRange} aria-labelledby={`group-${group.ageRange}`}>
                <div id={`group-${group.ageRange}`}>
                  <GroupHeading group={group} />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {group.activities.map((activity) => {
                    const fullActivity: FlattenedAgeBasedActivity = {
                      ...activity,
                      groupAgeRange: group.ageRange,
                      groupLabel: group.label,
                      groupEmoji: group.emoji,
                    };

                    const progressDetails = getActivityProgress(getCompletionId(fullActivity));
                    return (
                      <ActivityCardWithScenario
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
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredActivities.map((activity) => {
              const progressDetails = getActivityProgress(getCompletionId(activity));
              return (
                <ActivityCardWithScenario
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
    </HubPageLayout>
  );
};

export default ActivitiesScreen;
