import React, { useState } from 'react';
import { Play, ArrowLeft } from 'lucide-react';
import ActivityManager from '../../components/activities/ActivityManager';
import { PRIVACY_ACTIVITIES } from '../../data/privacyActivitiesCatalog';

const ActivitiesScreen: React.FC = () => {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

  const handleActivityComplete = () => {
    setSelectedActivity(null);
  };

  if (selectedActivity) {
    return (
      <div className="h-full flex flex-col">
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-4">
          <button
            onClick={() => setSelectedActivity(null)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Activity</h2>
        </div>
        <div className="flex-1 overflow-auto">
          <ActivityManager
            activityId={selectedActivity}
            onClose={() => setSelectedActivity(null)}
            onComplete={handleActivityComplete}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Activities</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Play fun privacy games and activities to boost your family's privacy score!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PRIVACY_ACTIVITIES.map((activity) => (
          <button
            key={activity.id}
            onClick={() => setSelectedActivity(activity.id)}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:border-teal-500 dark:hover:border-teal-500 transition-all text-left shadow-sm hover:shadow-md min-h-[120px] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{activity.icon}</span>
                <h3 className="font-semibold text-gray-900 dark:text-white">{activity.name}</h3>
                <p className="text-xs text-teal-600 dark:text-teal-400 font-medium">{activity.category}</p>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{activity.description}</p>
            </div>
            <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 mt-4">
              <Play size={16} />
              <span className="text-sm font-medium">Start Activity</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ActivitiesScreen;

