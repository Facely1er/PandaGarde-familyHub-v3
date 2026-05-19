import React, { useState } from 'react';
import { Users, Clock, Award, TrendingUp, Download, Share2, BookOpen, Target } from 'lucide-react';
import ProgressDisplay from './ProgressDisplay';
import { logger } from '../lib/logger';

interface ParentDashboardProps {
  progress: {
    completedActivities: string[];
    activityDetails: Record<string, { score: number; timeSpent: number; completedAt: Date }>;
    totalTimeSpent: number;
    achievements: string[];
    lastUpdated: Date;
  };
  onClose: () => void;
}

const ParentDashboard: React.FC<ParentDashboardProps> = ({ progress, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'activities' | 'achievements'>('overview');

  const getOverallProgress = () => {
    const totalCount = 8;
    const completedCount = progress.completedActivities.length;
    const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
    
    return {
      completedCount,
      totalCount,
      percentage
    };
  };

  const overallProgress = getOverallProgress();

  const exportProgress = () => {
    const data = {
      completedActivities: progress.completedActivities,
      totalTimeSpent: progress.totalTimeSpent,
      achievements: progress.achievements,
      lastUpdated: progress.lastUpdated,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `privacy-learning-progress-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const shareProgress = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Privacy Learning Progress',
          text: `My child has completed ${overallProgress.completedCount} out of ${overallProgress.totalCount} privacy activities!`,
          url: window.location.href
        });
      } catch (error) {
        logger.warn('Error sharing', error, 'SHARE');
      }
    } else {
      // Fallback: copy to clipboard
      const text = `Privacy Learning Progress: ${overallProgress.completedCount}/${overallProgress.totalCount} activities completed (${Math.round(overallProgress.percentage)}%)`;
      navigator.clipboard.writeText(text);
      alert('Progress copied to clipboard!');
    }
  };

  const getActivityStatus = (activityId: string) => {
    const activity = progress.activityDetails[activityId];
    if (activity) {
      return {
        completed: true,
        completedAt: activity.completedAt,
        score: activity.score,
        timeSpent: activity.timeSpent
      };
    }
    return { completed: false };
  };

  const activityNames: Record<string, string> = {
    'coloring': 'Privacy Panda Coloring',
    'sorting': 'Information Sorting Game',
    'maze': 'Safe Online Journey Maze',
    'wordsearch': 'Privacy Word Search',
    'connectdots': 'Privacy Shield Connect-the-Dots',
    'matching': 'Privacy Symbol Matching',
    'memory': 'Privacy Memory Game',
    'quiz': 'Privacy Knowledge Quiz'
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black/80"
      role="dialog"
      aria-modal="true"
      aria-labelledby="parent-dashboard-title"
      onKeyDown={(e) => { if (e.key === 'Escape') { onClose(); } }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <h2 id="parent-dashboard-title" className="m-0 text-2xl font-semibold text-gray-800 dark:text-gray-100">Parent Dashboard</h2>
        <button
          onClick={onClose}
          className="text-2xl leading-none text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          aria-label="Close dashboard"
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 sm:flex-row flex-col">
          {[
            { id: 'overview', label: 'Overview', icon: <TrendingUp size={16} /> },
            { id: 'activities', label: 'Activities', icon: <Users size={16} /> },
            { id: 'achievements', label: 'Achievements', icon: <Award size={16} /> },
          ].map(({ id, label, icon }) => (
            <button
              key={id}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === id
                  ? 'border-green-500 text-green-600 dark:text-green-400 bg-white dark:bg-gray-800'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab(id as typeof activeTab)}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'overview' && (
            <div>
              <ProgressDisplay
                completedCount={overallProgress.completedCount}
                totalCount={overallProgress.totalCount}
                achievements={progress.achievements}
                totalTimeSpent={progress.totalTimeSpent}
                showDetails={true}
              />

              <div className="flex flex-wrap gap-4 mt-5 justify-center sm:flex-row flex-col">
                <button
                  onClick={exportProgress}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                >
                  <Download size={16} />
                  Export Progress
                </button>
                <button
                  onClick={shareProgress}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                >
                  <Share2 size={16} />
                  Share Progress
                </button>
              </div>

              <div className="mt-8 pt-5 border-t border-gray-200 dark:border-gray-700">
                <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-100">Learning Insights</h3>
                <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <BookOpen size={24} className="text-blue-600 dark:text-blue-400 shrink-0" />
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Learning Time</div>
                      <div className="text-lg font-bold text-gray-800 dark:text-gray-100">{Math.round(progress.totalTimeSpent)} minutes</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Target size={24} className="text-green-600 dark:text-green-400 shrink-0" />
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Completion Rate</div>
                      <div className="text-lg font-bold text-gray-800 dark:text-gray-100">{Math.round(overallProgress.percentage)}%</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-2xl">🏆</span>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Achievements</div>
                      <div className="text-lg font-bold text-gray-800 dark:text-gray-100">{progress.achievements.length} earned</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activities' && (
            <div>
              <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-100">Activity Progress</h3>
              <div className="flex flex-col gap-4">
                {Object.entries(activityNames).map(([activityId, activityName]) => {
                  const status = getActivityStatus(activityId);
                  return (
                    <div
                      key={activityId}
                      className="flex sm:flex-row flex-col sm:items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-green-500"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800 dark:text-gray-100 mb-1">{activityName}</div>
                        {status.completed ? (
                          <span className="text-green-600 dark:text-green-400 text-sm">✅ Completed</span>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400 text-sm">⏳ Not Started</span>
                        )}
                      </div>
                      {status.completed && (
                        <div className="flex gap-4 sm:self-auto self-end">
                          <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                            <Clock size={14} />
                            <span>{status.timeSpent || 0} min</span>
                          </div>
                          {status.score && (
                            <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                              <Award size={14} />
                              <span>{status.score}%</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div>
              <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-100">Achievement Progress</h3>
              <div className="flex flex-col gap-4">
                {progress.achievements.map(achievement => (
                  <div key={achievement} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-yellow-400">
                    <span className="text-2xl">🏆</span>
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
                        {achievement.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {achievement === 'first_activity' && 'Completed first activity!'}
                        {achievement === 'getting_started' && 'Completed 3 activities!'}
                        {achievement === 'privacy_champion' && 'Completed all activities!'}
                        {achievement === 'dedicated_learner' && 'Spent 60+ minutes learning!'}
                        {achievement === 'memory_master' && 'Completed memory game!'}
                        {achievement === 'quiz_expert' && 'Scored 80%+ on quiz!'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;