import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface StoryProgressProps {
  currentScene: number;
  totalScenes: number;
  currentChapter?: string;
  totalChapters?: number;
  points?: number;
  achievements?: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    unlocked: boolean;
  }>;
  onAchievementClick?: (achievementId: string) => void;
  showDetailedProgress?: boolean;
}

const StoryProgress: React.FC<StoryProgressProps> = ({
  currentScene,
  totalScenes,
  currentChapter,
  totalChapters,
  points = 0,
  achievements = [],
  onAchievementClick,
  showDetailedProgress = true
}) => {
  const { theme } = useTheme();
  const [showAchievements, setShowAchievements] = useState(false);
  const [recentAchievement, setRecentAchievement] = useState<string | null>(null);

  const progress = (currentScene / totalScenes) * 100;
  const chapterProgress = totalChapters ? ((currentChapter ? parseInt(currentChapter, 10) : 1) / totalChapters) * 100 : 0;

  useEffect(() => {
    // Check for newly unlocked achievements
    const newAchievement = achievements.find(a => a.unlocked && !a.unlocked);
    if (newAchievement) {
      setRecentAchievement(newAchievement.id);
      setTimeout(() => setRecentAchievement(null), 3000);
    }
  }, [achievements]);

  const unlockedAchievements = achievements.filter(a => a.unlocked);

  return (
    <div className="story-progress-container">
      {/* Main Progress Bar */}
      <div className="progress-main">
        <div className="progress-header">
          <div className="progress-info">
            <span className="progress-label">Story Progress</span>
            <span className="progress-text">
              Scene {currentScene} of {totalScenes}
            </span>
          </div>
          <div className="progress-stats">
            {points > 0 && (
              <div className="points-display">
                <span className="points-icon">🏆</span>
                <span className="points-value">{points}</span>
              </div>
            )}
            {achievements.length > 0 && (
              <button
                className="achievements-toggle"
                onClick={() => setShowAchievements(!showAchievements)}
                title="View Achievements"
              >
                <span className="achievement-icon">🏅</span>
                <span className="achievement-count">{unlockedAchievements.length}/{achievements.length}</span>
              </button>
            )}
          </div>
        </div>

        <div className="progress-bar-container">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
            <div className="progress-milestones">
              {Array.from({ length: totalScenes }, (_, i) => (
                <div
                  key={i}
                  className={`milestone ${i < currentScene ? 'completed' : i === currentScene - 1 ? 'current' : 'upcoming'}`}
                  style={{ left: `${(i / (totalScenes - 1)) * 100}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        {currentChapter && totalChapters && (
          <div className="chapter-progress">
            <span className="chapter-label">Chapter {currentChapter} of {totalChapters}</span>
            <div className="chapter-bar">
              <div 
                className="chapter-fill"
                style={{ width: `${chapterProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Detailed Progress */}
      {showDetailedProgress && (
        <div className="progress-details">
          <div className="progress-metrics">
            <div className="metric">
              <span className="metric-label">Completion</span>
              <span className="metric-value">{Math.round(progress)}%</span>
            </div>
            <div className="metric">
              <span className="metric-label">Scenes Read</span>
              <span className="metric-value">{currentScene}/{totalScenes}</span>
            </div>
            {points > 0 && (
              <div className="metric">
                <span className="metric-label">Points Earned</span>
                <span className="metric-value">{points}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Achievements Panel */}
      {showAchievements && (
        <div className="achievements-panel">
          <div className="achievements-header">
            <h3>Achievements</h3>
            <button
              className="close-achievements"
              onClick={() => setShowAchievements(false)}
            >
              ×
            </button>
          </div>
          
          <div className="achievements-grid">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'} ${recentAchievement === achievement.id ? 'recent' : ''}`}
                onClick={() => achievement.unlocked && onAchievementClick?.(achievement.id)}
              >
                <div className="achievement-icon">
                  {achievement.unlocked ? achievement.icon : '🔒'}
                </div>
                <div className="achievement-info">
                  <h4 className="achievement-name">{achievement.name}</h4>
                  <p className="achievement-description">{achievement.description}</p>
                </div>
                {achievement.unlocked && (
                  <div className="achievement-status">✓</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Achievement Notification */}
      {recentAchievement && (
        <div className="achievement-notification">
          <div className="notification-content">
            <span className="notification-icon">🎉</span>
            <div className="notification-text">
              <h4>Achievement Unlocked!</h4>
              <p>{achievements.find(a => a.id === recentAchievement)?.name}</p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .story-progress-container {
          background: ${theme === 'dark' ? 'var(--gray-800)' : 'white'};
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border: 1px solid ${theme === 'dark' ? 'var(--gray-600)' : 'var(--gray-200)'};
          position: relative;
        }

        .progress-main {
          margin-bottom: 1rem;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .progress-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .progress-label {
          font-weight: 600;
          color: ${theme === 'dark' ? 'var(--gray-200)' : 'var(--gray-700)'};
          font-size: 0.9rem;
        }

        .progress-text {
          color: var(--primary);
          font-weight: 500;
          font-size: 1.1rem;
        }

        .progress-stats {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .points-display {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--warning);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
        }

        .points-icon {
          font-size: 1.2rem;
        }

        .achievements-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: ${theme === 'dark' ? 'var(--gray-700)' : 'var(--light)'};
          border: 1px solid ${theme === 'dark' ? 'var(--gray-600)' : 'var(--gray-300)'};
          color: ${theme === 'dark' ? 'var(--gray-200)' : 'var(--gray-700)'};
          padding: 0.5rem 1rem;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 500;
        }

        .achievements-toggle:hover {
          background: var(--primary-light);
          color: white;
          border-color: var(--primary-light);
        }

        .achievement-icon {
          font-size: 1.1rem;
        }

        .achievement-count {
          font-size: 0.9rem;
        }

        .progress-bar-container {
          position: relative;
          margin-bottom: 1rem;
        }

        .progress-bar {
          height: 12px;
          background: ${theme === 'dark' ? 'var(--gray-700)' : 'var(--gray-200)'};
          border-radius: 6px;
          overflow: hidden;
          position: relative;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--primary), var(--primary-light));
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
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: shimmer 2s infinite;
        }

        .progress-milestones {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }

        .milestone {
          position: absolute;
          width: 8px;
          height: 8px;
          background: ${theme === 'dark' ? 'var(--gray-600)' : 'white'};
          border: 2px solid ${theme === 'dark' ? 'var(--gray-500)' : 'var(--gray-300)'};
          border-radius: 50%;
          transform: translateX(-50%);
          top: 2px;
        }

        .milestone.completed {
          background: var(--primary);
          border-color: var(--primary);
        }

        .milestone.current {
          background: var(--warning);
          border-color: var(--warning);
          animation: pulse 1s infinite;
        }

        .chapter-progress {
          margin-top: 0.5rem;
        }

        .chapter-label {
          font-size: 0.8rem;
          color: ${theme === 'dark' ? 'var(--gray-400)' : 'var(--gray-600)'};
          margin-bottom: 0.5rem;
          display: block;
        }

        .chapter-bar {
          height: 4px;
          background: ${theme === 'dark' ? 'var(--gray-700)' : 'var(--gray-200)'};
          border-radius: 2px;
          overflow: hidden;
        }

        .chapter-fill {
          height: 100%;
          background: var(--secondary);
          border-radius: 2px;
          transition: width 0.5s ease;
        }

        .progress-details {
          border-top: 1px solid ${theme === 'dark' ? 'var(--gray-600)' : 'var(--gray-200)'};
          padding-top: 1rem;
        }

        .progress-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 1rem;
        }

        .metric {
          text-align: center;
        }

        .metric-label {
          display: block;
          font-size: 0.8rem;
          color: ${theme === 'dark' ? 'var(--gray-400)' : 'var(--gray-600)'};
          margin-bottom: 0.25rem;
        }

        .metric-value {
          display: block;
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--primary);
        }

        .achievements-panel {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: ${theme === 'dark' ? 'var(--gray-800)' : 'white'};
          border: 1px solid ${theme === 'dark' ? 'var(--gray-600)' : 'var(--gray-200)'};
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          z-index: 100;
          margin-top: 0.5rem;
          max-height: 400px;
          overflow-y: auto;
        }

        .achievements-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid ${theme === 'dark' ? 'var(--gray-600)' : 'var(--gray-200)'};
        }

        .achievements-header h3 {
          margin: 0;
          color: ${theme === 'dark' ? 'var(--gray-200)' : 'var(--gray-800)'};
        }

        .close-achievements {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: ${theme === 'dark' ? 'var(--gray-400)' : 'var(--gray-600)'};
          padding: 0.25rem;
        }

        .achievements-grid {
          padding: 1rem;
          display: grid;
          gap: 0.75rem;
        }

        .achievement-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem;
          border-radius: 8px;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .achievement-card.unlocked {
          background: ${theme === 'dark' ? 'var(--gray-700)' : 'var(--light)'};
          border: 1px solid var(--primary-light);
        }

        .achievement-card.locked {
          background: ${theme === 'dark' ? 'var(--gray-800)' : 'var(--gray-100)'};
          opacity: 0.6;
        }

        .achievement-card.recent {
          animation: achievementGlow 2s ease-out;
        }

        .achievement-card.unlocked:hover {
          background: var(--primary-light);
          color: white;
        }

        .achievement-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .achievement-info {
          flex: 1;
        }

        .achievement-name {
          margin: 0 0 0.25rem 0;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .achievement-description {
          margin: 0;
          font-size: 0.8rem;
          opacity: 0.8;
        }

        .achievement-status {
          color: var(--primary);
          font-weight: bold;
          font-size: 1.2rem;
        }

        .achievement-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          background: var(--primary);
          color: white;
          padding: 1rem;
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
          z-index: 1000;
          animation: notificationSlide 0.5s ease-out;
        }

        .notification-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .notification-icon {
          font-size: 1.5rem;
        }

        .notification-text h4 {
          margin: 0 0 0.25rem 0;
          font-size: 1rem;
        }

        .notification-text p {
          margin: 0;
          font-size: 0.9rem;
          opacity: 0.9;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes achievementGlow {
          0% { box-shadow: 0 0 0 0 var(--primary); }
          50% { box-shadow: 0 0 20px 5px var(--primary); }
          100% { box-shadow: 0 0 0 0 var(--primary); }
        }

        @keyframes notificationSlide {
          0% { transform: translateX(100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }

        @media (max-width: 768px) {
          .progress-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .progress-stats {
            align-self: stretch;
            justify-content: space-between;
          }

          .achievements-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 400px;
          }
        }
      `}</style>
    </div>
  );
};

export default StoryProgress;