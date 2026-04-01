import React from 'react';
import { useFamilyProgress } from '../contexts/FamilyProgressContext';
import { Award, Clock, TrendingUp, Calendar, Gamepad2, BookOpen, GraduationCap, ArrowLeft } from 'lucide-react';
import { ProgressBar } from './ui/ProgressBar';

interface ChildProgressDetailProps {
  memberId: number;
  memberName: string;
  memberAge: number;
  onBack: () => void;
}

const ChildProgressDetail: React.FC<ChildProgressDetailProps> = ({
  memberId,
  memberName,
  memberAge,
  onBack
}) => {
  const { getMemberProgress, getActivityHistory } = useFamilyProgress();
  const progress = getMemberProgress(memberId);
  const recentActivities = getActivityHistory(memberId, 20) || [];

  const activitiesByType = {
    game: (recentActivities || []).filter(a => a && a.activityType === 'game'),
    journey: (recentActivities || []).filter(a => a && a.activityType === 'journey'),
    module: (recentActivities || []).filter(a => a && a.activityType === 'module')
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'game': return <Gamepad2 size={16} />;
      case 'journey': return <BookOpen size={16} />;
      case 'module': return <GraduationCap size={16} />;
      default: return <Award size={16} />;
    }
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) {return 'text-green-600 dark:text-green-400';}
    if (percentage >= 60) {return 'text-yellow-600 dark:text-yellow-400';}
    return 'text-red-600 dark:text-red-400';
  };

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) {
        return 'N/A';
      }
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            {memberName}'s Progress
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Age {memberAge} • Detailed learning activity history
          </p>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2"
        >
          <ArrowLeft size={18} />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <Award className="text-purple-600 dark:text-purple-400" size={24} />
            <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {progress?.totalScore || 0}
            </span>
          </div>
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">Privacy Score</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Overall average</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <Gamepad2 className="text-blue-600 dark:text-blue-400" size={24} />
            <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {progress?.completedCount || 0}
            </span>
          </div>
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">Activities</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Total completed</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="text-green-600 dark:text-green-400" size={24} />
            <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {activitiesByType.game.length}
            </span>
          </div>
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">Games</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Games completed</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <Clock className="text-orange-600 dark:text-orange-400" size={24} />
            <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {progress?.lastActive ? formatDate(progress.lastActive).split(',')[0] : 'N/A'}
            </span>
          </div>
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">Last Active</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Most recent activity</p>
        </div>
      </div>

      {/* Activity History */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Activity History</h2>
        
        {recentActivities.length === 0 ? (
          <div className="text-center py-12">
            <Award className="mx-auto text-gray-400 dark:text-gray-500 mb-4" size={48} />
            <p className="text-gray-600 dark:text-gray-300 mb-2">No activities completed yet</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Activities will appear here once {memberName} starts learning!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {(recentActivities || []).map((activity, index) => {
              if (!activity || !activity.score || !activity.maxScore) {
                return null;
              }
              const percentage = (activity.score / activity.maxScore) * 100;
              return (
                <div
                  key={`${activity.activityId}-${activity.completedAt}-${index}`}
                  className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="mt-1">
                        {getActivityIcon(activity.activityType)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                            {activity.activityName}
                          </h3>
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 capitalize">
                            {activity.activityType}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                          <div className="flex items-center space-x-1">
                            <Calendar size={14} />
                            <span>{formatDate(activity.completedAt)}</span>
                          </div>
                          {activity.timeSpent && (
                            <div className="flex items-center space-x-1">
                              <Clock size={14} />
                              <span>{Math.round(activity.timeSpent / 60)} min</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className={`text-lg font-bold ${getScoreColor(activity.score, activity.maxScore)}`}>
                        {activity.score}/{activity.maxScore}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {Math.round(percentage)}%
                      </div>
                      <ProgressBar
                        value={Math.max(0, Math.min(100, percentage))}
                        size="sm"
                        variant={percentage >= 80 ? 'low' : percentage >= 60 ? 'medium' : 'critical'}
                        aria-label={`${label} progress`}
                        className="mt-2 w-24"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Activity Breakdown by Type */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Gamepad2 className="text-blue-600 dark:text-blue-400" size={20} />
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">Games</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            {activitiesByType.game.length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Interactive games completed</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <BookOpen className="text-purple-600 dark:text-purple-400" size={20} />
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">Journeys</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            {activitiesByType.journey.length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Learning journeys completed</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <GraduationCap className="text-green-600 dark:text-green-400" size={20} />
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">Modules</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            {activitiesByType.module.length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Learning modules completed</p>
        </div>
      </div>
    </div>
  );
};

export default ChildProgressDetail;

