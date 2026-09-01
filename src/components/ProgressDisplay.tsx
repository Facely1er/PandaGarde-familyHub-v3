import React from 'react';
import { Award, Star, Target, Clock } from 'lucide-react';
import AchievementBadge from './AchievementBadge';

interface ProgressDisplayProps {
  completedCount: number;
  totalCount: number;
  achievements: string[];
  totalTimeSpent: number;
  averageScore?: number;
  showDetails?: boolean;
}

const ProgressDisplay: React.FC<ProgressDisplayProps> = ({
  completedCount,
  totalCount,
  achievements,
  totalTimeSpent,
  averageScore = 0,
  showDetails = true,
}) => {
  const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const getProgressMessage = () => {
    if (percentage === 100) {return 'Privacy Champion!';}
    if (percentage >= 75) {return 'Almost there!';}
    if (percentage >= 50) {return 'Great progress!';}
    if (percentage >= 25) {return 'Keep going!';}
    return "Let's get started!";
  };

  const getProgressColor = () => {
    if (percentage >= 80) {return 'bg-green-600';}
    if (percentage >= 60) {return 'bg-amber-500';}
    if (percentage >= 40) {return 'bg-blue-600';}
    return 'bg-gray-400';
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) {return `${minutes}m`;}
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const allAchievements = [
    'first_activity',
    'getting_started',
    'privacy_champion',
    'dedicated_learner',
    'memory_master',
    'quiz_expert',
  ];

  const stats = [
    { icon: Target, value: `${completedCount}/${totalCount}`, label: 'Activities' },
    { icon: Clock, value: formatTime(totalTimeSpent), label: 'Time spent' },
    { icon: Award, value: String(achievements.length), label: 'Achievements' },
    ...(averageScore > 0
      ? [{ icon: Star, value: `${averageScore}%`, label: 'Avg score' }]
      : []),
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-6 text-center">
        <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">Your learning journey</h3>
        <p className="font-medium text-green-700 dark:text-green-400">{getProgressMessage()}</p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-900"
            >
              <Icon size={20} className="text-green-700 dark:text-green-400" aria-hidden />
              <div>
                <div className="text-lg font-bold leading-none text-gray-900 dark:text-gray-100">{stat.value}</div>
                <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mb-6">
        <div className="mb-2 h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className={`h-full rounded-full transition-all ${getProgressColor()}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-center text-sm font-bold text-gray-500 dark:text-gray-400">{Math.round(percentage)}%</p>
      </div>

      {showDetails && (
        <div className="border-t border-gray-200 pt-5 dark:border-gray-700">
          <h4 className="mb-4 text-center text-base font-bold text-gray-900 dark:text-gray-100">Achievements</h4>
          <div className="grid grid-cols-3 justify-items-center gap-4 sm:grid-cols-6">
            {allAchievements.map((achievement) => (
              <AchievementBadge
                key={achievement}
                achievement={achievement}
                unlocked={achievements.includes(achievement)}
                size="medium"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressDisplay;
