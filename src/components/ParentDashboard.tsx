import React, { useState } from 'react';
import { Users, Clock, Award, TrendingUp, Download, Share2, BookOpen, Target } from 'lucide-react';
import ProgressDisplay from './ProgressDisplay';

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
        console.log('Error sharing:', error);
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
    <div className="parent-dashboard">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Parent Dashboard</h2>
        <button onClick={onClose} className="close-button">×</button>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-tabs">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <TrendingUp size={16} />
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'activities' ? 'active' : ''}`}
            onClick={() => setActiveTab('activities')}
          >
            <Users size={16} />
            Activities
          </button>
          <button 
            className={`tab-button ${activeTab === 'achievements' ? 'active' : ''}`}
            onClick={() => setActiveTab('achievements')}
          >
            <Award size={16} />
            Achievements
          </button>
        </div>

        <div className="dashboard-body">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <ProgressDisplay
                completedCount={overallProgress.completedCount}
                totalCount={overallProgress.totalCount}
                achievements={progress.achievements}
                totalTimeSpent={progress.totalTimeSpent}
                showDetails={true}
              />

              <div className="dashboard-actions">
                <button onClick={exportProgress} className="action-button">
                  <Download size={16} />
                  Export Progress
                </button>
                <button onClick={shareProgress} className="action-button">
                  <Share2 size={16} />
                  Share Progress
                </button>
              </div>

              <div className="learning-insights">
                <h3>Learning Insights</h3>
                <div className="insights-grid">
                  <div className="insight-item">
                    <div className="insight-icon">
                      <BookOpen size={24} className="text-blue-600" />
                    </div>
                    <div className="insight-content">
                      <div className="insight-title">Learning Time</div>
                      <div className="insight-value">{Math.round(progress.totalTimeSpent)} minutes</div>
                    </div>
                  </div>
                  <div className="insight-item">
                    <div className="insight-icon">
                      <Target size={24} className="text-green-600" />
                    </div>
                    <div className="insight-content">
                      <div className="insight-title">Completion Rate</div>
                      <div className="insight-value">{Math.round(overallProgress.percentage)}%</div>
                    </div>
                  </div>
                  <div className="insight-item">
                    <div className="insight-icon">🏆</div>
                    <div className="insight-content">
                      <div className="insight-title">Achievements</div>
                      <div className="insight-value">{progress.achievements.length} earned</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="activities-tab">
              <h3>Activity Progress</h3>
              <div className="activities-list">
                {Object.entries(activityNames).map(([activityId, activityName]) => {
                  const status = getActivityStatus(activityId);
                  return (
                    <div key={activityId} className="activity-item">
                      <div className="activity-info">
                        <div className="activity-name">{activityName}</div>
                        <div className="activity-status">
                          {status.completed ? (
                            <span className="status-completed">✅ Completed</span>
                          ) : (
                            <span className="status-pending">⏳ Not Started</span>
                          )}
                        </div>
                      </div>
                      {status.completed && (
                        <div className="activity-details">
                          <div className="detail-item">
                            <Clock size={14} />
                            <span>{status.timeSpent || 0} min</span>
                          </div>
                          {status.score && (
                            <div className="detail-item">
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
            <div className="achievements-tab">
              <h3>Achievement Progress</h3>
              <div className="achievements-list">
                {progress.achievements.map(achievement => (
                  <div key={achievement} className="achievement-item">
                    <div className="achievement-icon">🏆</div>
                    <div className="achievement-content">
                      <div className="achievement-title">
                        {achievement.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                      <div className="achievement-description">
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

      <style>{`
        .parent-dashboard {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          flex-direction: column;
          z-index: 1000;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: white;
          border-bottom: 1px solid #e0e0e0;
        }

        .dashboard-title {
          margin: 0;
          color: #2C3E50;
          font-size: 24px;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
        }

        .dashboard-content {
          flex: 1;
          background: white;
          display: flex;
          flex-direction: column;
        }

        .dashboard-tabs {
          display: flex;
          background: #f8f9fa;
          border-bottom: 1px solid #e0e0e0;
        }

        .tab-button {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 15px;
          border: none;
          background: none;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
          font-weight: 500;
        }

        .tab-button:hover {
          background: #e9ecef;
        }

        .tab-button.active {
          background: white;
          border-bottom: 2px solid #4CAF50;
          color: #4CAF50;
        }

        .dashboard-body {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
        }

        .dashboard-actions {
          display: flex;
          gap: 15px;
          margin-top: 20px;
          justify-content: center;
        }

        .action-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
          font-weight: 500;
        }

        .action-button:hover {
          background: #f0f0f0;
        }

        .learning-insights {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
        }

        .learning-insights h3 {
          margin: 0 0 20px 0;
          color: #2C3E50;
          font-size: 18px;
        }

        .insights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
        }

        .insight-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .insight-icon {
          font-size: 24px;
        }

        .insight-content {
          flex: 1;
        }

        .insight-title {
          font-size: 12px;
          color: #666;
          margin-bottom: 4px;
        }

        .insight-value {
          font-size: 18px;
          font-weight: bold;
          color: #2C3E50;
        }

        .activities-tab h3,
        .achievements-tab h3 {
          margin: 0 0 20px 0;
          color: #2C3E50;
          font-size: 18px;
        }

        .activities-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .activity-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid #4CAF50;
        }

        .activity-info {
          flex: 1;
        }

        .activity-name {
          font-weight: bold;
          color: #2C3E50;
          margin-bottom: 5px;
        }

        .status-completed {
          color: #4CAF50;
          font-size: 14px;
        }

        .status-pending {
          color: #666;
          font-size: 14px;
        }

        .activity-details {
          display: flex;
          gap: 15px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 14px;
          color: #666;
        }

        .achievements-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .achievement-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid #FFD700;
        }

        .achievement-icon {
          font-size: 24px;
        }

        .achievement-content {
          flex: 1;
        }

        .achievement-title {
          font-weight: bold;
          color: #2C3E50;
          margin-bottom: 5px;
        }

        .achievement-description {
          font-size: 14px;
          color: #666;
        }

        @media (max-width: 768px) {
          .dashboard-tabs {
            flex-direction: column;
          }

          .dashboard-actions {
            flex-direction: column;
          }

          .insights-grid {
            grid-template-columns: 1fr;
          }

          .activity-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .activity-details {
            align-self: flex-end;
          }
        }
      `}</style>
    </div>
  );
};

export default ParentDashboard;