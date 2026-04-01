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
  showDetails = true 
}) => {
  const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  
  const getProgressMessage = () => {
    if (percentage === 100) {return 'Privacy Champion!';}
    if (percentage >= 75) {return 'Almost there!';}
    if (percentage >= 50) {return 'Great progress!';}
    if (percentage >= 25) {return 'Keep going!';}
    return 'Let\'s get started!';
  };

  const getProgressColor = () => {
    if (percentage >= 80) {return '#4CAF50';}
    if (percentage >= 60) {return '#FF9800';}
    if (percentage >= 40) {return '#2196F3';}
    return '#9E9E9E';
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
    'quiz_expert'
  ];

  return (
    <div className="progress-display">
      <div className="progress-header">
        <h3 className="progress-title">Your Learning Journey</h3>
        <div className="progress-message">{getProgressMessage()}</div>
      </div>

      <div className="progress-stats">
        <div className="stat-item">
          <div className="stat-icon">
            <Target size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{completedCount}/{totalCount}</div>
            <div className="stat-label">Activities</div>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon">
            <Clock size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{formatTime(totalTimeSpent)}</div>
            <div className="stat-label">Time Spent</div>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon">
            <Award size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{achievements.length}</div>
            <div className="stat-label">Achievements</div>
          </div>
        </div>

        {averageScore > 0 && (
          <div className="stat-item">
            <div className="stat-icon">
              <Star size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{averageScore}%</div>
              <div className="stat-label">Avg Score</div>
            </div>
          </div>
        )}
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: `${percentage}%`,
              backgroundColor: getProgressColor()
            }}
          />
        </div>
        <div className="progress-percentage">{Math.round(percentage)}%</div>
      </div>

      {showDetails && (
        <div className="achievements-section">
          <h4 className="achievements-title">Achievements</h4>
          <div className="achievements-grid">
            {allAchievements.map(achievement => (
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

      <style jsx>{`
        .progress-display {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          border: 1px solid #e0e0e0;
        }

        .progress-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .progress-title {
          margin: 0 0 8px 0;
          color: #2C3E50;
          font-size: 20px;
          font-weight: bold;
        }

        .progress-message {
          color: #4CAF50;
          font-size: 16px;
          font-weight: 500;
        }

        .progress-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .stat-icon {
          color: #4CAF50;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-content {
          flex: 1;
        }

        .stat-value {
          font-size: 18px;
          font-weight: bold;
          color: #2C3E50;
          line-height: 1;
        }

        .stat-label {
          font-size: 12px;
          color: #666;
          margin-top: 2px;
        }

        .progress-bar-container {
          margin-bottom: 24px;
        }

        .progress-bar {
          width: 100%;
          height: 12px;
          background: #e0e0e0;
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .progress-fill {
          height: 100%;
          border-radius: 6px;
          transition: width 0.5s ease;
          position: relative;
        }

        .progress-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          animation: shimmer 2s infinite;
        }

        .progress-percentage {
          text-align: center;
          font-size: 14px;
          font-weight: bold;
          color: #666;
        }

        .achievements-section {
          border-top: 1px solid #e0e0e0;
          padding-top: 20px;
        }

        .achievements-title {
          margin: 0 0 16px 0;
          color: #2C3E50;
          font-size: 16px;
          font-weight: bold;
          text-align: center;
        }

        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
          gap: 16px;
          justify-items: center;
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @media (max-width: 768px) {
          .progress-stats {
            grid-template-columns: 1fr;
          }

          .achievements-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

export default ProgressDisplay;