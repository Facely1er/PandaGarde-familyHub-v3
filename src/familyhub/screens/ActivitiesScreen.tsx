import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Play, ArrowLeft, Info, Clock, BookOpen } from 'lucide-react';
import ActivityManager from '../../components/activities/ActivityManager';
import { ageBasedActivities, type AgeBasedActivity, type AgeGroup } from '../../data/ageBasedActivities';

const AGE_TABS = [
  { id: 'all', label: 'All Ages' },
  { id: '5-8', label: '🐼 Ages 5–8' },
  { id: '9-12', label: '🕵️ Ages 9–12' },
  { id: '13-17', label: '🌐 Ages 13–17' },
] as const;

type AgeTabId = (typeof AGE_TABS)[number]['id'];

interface ActivityWithMeta extends AgeBasedActivity {
  groupAgeRange: string;
  groupLabel: string;
  groupEmoji: string;
}

const flattenActivities = (): ActivityWithMeta[] =>
  ageBasedActivities.flatMap((group) =>
    group.activities.map((act) => ({
      ...act,
      groupAgeRange: group.ageRange,
      groupLabel: group.label,
      groupEmoji: group.emoji,
    }))
  );

// --- Inline learning card for activities without an ActivityManager game ---
const LearningCard: React.FC<{ activity: ActivityWithMeta; onClose: () => void }> = ({ activity, onClose }) => (
  <div className="h-full flex flex-col">
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-4">
      <button
        onClick={onClose}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label="Back to activities"
      >
        <ArrowLeft size={20} />
      </button>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{activity.name}</h2>
    </div>

    <div className="flex-1 overflow-auto p-4 sm:p-6 max-w-2xl mx-auto w-full space-y-6">
      <div className="text-center py-6">
        <span className="text-6xl" role="img" aria-label={activity.name}>{activity.icon}</span>
        <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">{activity.name}</h3>
        <div className="flex items-center justify-center gap-3 mt-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1"><Clock size={14} />{activity.duration}</span>
          <span>&bull;</span>
          <span className="px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs font-medium">
            Ages {activity.groupAgeRange}
          </span>
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4">
        <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wide mb-1">Real-life scenario</p>
        <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">{activity.realLifeScenario}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">About this activity</p>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{activity.description}</p>
      </div>

      <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700 rounded-xl p-4">
        <p className="text-xs font-semibold text-teal-700 dark:text-teal-300 uppercase tracking-wide mb-3 flex items-center gap-1.5">
          <BookOpen size={14} />Key privacy learnings
        </p>
        <ul className="space-y-2">
          {activity.keyLearnings.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-teal-900 dark:text-teal-100">
              <span className="text-teal-500 mt-0.5 flex-shrink-0">&check;</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-center text-xs text-gray-400 dark:text-gray-500 pb-4">
        Interactive game coming soon &mdash; discuss this scenario together as a family!
      </p>
    </div>
  </div>
);

// --- Activity card grid item ---
const ActivityCard: React.FC<{ activity: ActivityWithMeta; onStart: () => void }> = ({ activity, onStart }) => (
  <button
    onClick={onStart}
    className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:border-teal-500 dark:hover:border-teal-500 transition-all text-left shadow-sm hover:shadow-md flex flex-col justify-between min-h-[150px] group focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:outline-none"
    aria-label={`Start activity: ${activity.name}`}
  >
    <div>
      <div className="flex items-start gap-3 mb-2">
        <span className="text-3xl flex-shrink-0" role="img" aria-label="">{activity.icon}</span>
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug">{activity.name}</h3>
          <span className="inline-block text-xs text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/30 px-2 py-0.5 rounded-full mt-1">
            Ages {activity.groupAgeRange}
          </span>
        </div>
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">{activity.description}</p>
    </div>
    <div className="flex items-center justify-between mt-3">
      <div className="flex items-center gap-1 text-teal-600 dark:text-teal-400">
        <Play size={14} />
        <span className="text-xs font-medium">
          {activity.activityManagerId ? 'Start Game' : 'Explore'}
        </span>
      </div>
      <span className="text-xs text-gray-400 dark:text-gray-500">{activity.duration}</span>
    </div>
  </button>
);

// --- Age group section heading ---
const GroupHeading: React.FC<{ group: AgeGroup }> = ({ group }) => (
  <div className="flex items-start gap-3 mb-4">
    <span className="text-3xl" role="img" aria-label={group.label}>{group.emoji}</span>
    <div>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">
        {group.label}
        <span className="ml-2 text-sm font-normal text-gray-400 dark:text-gray-500">(Ages {group.ageRange})</span>
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{group.description}</p>
    </div>
  </div>
);

// --- Main Screen ---
const ActivitiesScreen: React.FC = () => {
  const location = useLocation();
  const locationState = location.state as { initialAgeFilter?: AgeTabId } | null;
  const initialAge: AgeTabId = locationState?.initialAgeFilter ?? 'all';

  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [activeAge, setActiveAge] = useState<AgeTabId>(initialAge);
  const [showLearningCard, setShowLearningCard] = useState(false);

  const allActivities = flattenActivities();

  const filteredActivities =
    activeAge === 'all' ? allActivities : allActivities.filter((a) => a.groupAgeRange === activeAge);

  const selectedActivity = allActivities.find((a) => a.id === selectedActivityId) ?? null;

  const handleStart = (activity: ActivityWithMeta) => {
    setSelectedActivityId(activity.id);
    setShowLearningCard(!activity.activityManagerId);
  };

  const handleClose = () => {
    setSelectedActivityId(null);
    setShowLearningCard(false);
  };

  if (selectedActivityId && selectedActivity && !showLearningCard) {
    return (
      <div className="h-full flex flex-col">
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-4">
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Back to activities"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{selectedActivity.name}</h2>
        </div>
        <div className="flex-1 overflow-auto">
          <ActivityManager
            activityId={selectedActivity.activityManagerId!}
            onClose={handleClose}
            onComplete={handleClose}
          />
        </div>
      </div>
    );
  }

  if (selectedActivityId && selectedActivity && showLearningCard) {
    return <LearningCard activity={selectedActivity} onClose={handleClose} />;
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Activities</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Age-matched privacy activities for every family member &mdash; pick a tab or explore them all.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap mb-6" role="tablist" aria-label="Filter by age group">
        {AGE_TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeAge === tab.id}
            onClick={() => setActiveAge(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:outline-none ${
              activeAge === tab.id
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:text-teal-700 dark:hover:text-teal-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeAge !== 'all' && (() => {
        const group = ageBasedActivities.find((g) => g.ageRange === activeAge);
        return group ? (
          <div className="flex items-start gap-3 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700 rounded-xl p-4 mb-6">
            <Info size={18} className="text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-teal-800 dark:text-teal-200">{group.description}</p>
          </div>
        ) : null;
      })()}

      {activeAge === 'all' ? (
        <div className="space-y-10">
          {ageBasedActivities.map((group) => (
            <section key={group.ageRange} aria-labelledby={`group-${group.ageRange}`}>
              <GroupHeading group={group} />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.activities.map((act) => {
                  const full: ActivityWithMeta = {
                    ...act,
                    groupAgeRange: group.ageRange,
                    groupLabel: group.label,
                    groupEmoji: group.emoji,
                  };
                  return <ActivityCard key={act.id} activity={full} onStart={() => handleStart(full)} />;
                })}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} onStart={() => handleStart(activity)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivitiesScreen;
