import React from 'react';
import { Award, Star, Trophy, Target, Clock, Brain } from 'lucide-react';

interface AchievementBadgeProps {
  achievement: string;
  unlocked: boolean;
  size?: 'small' | 'medium' | 'large';
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement, unlocked, size = 'medium' }) => {
  const getAchievementInfo = (achievement: string) => {
    switch (achievement) {
      case 'first_activity':
        return {
          title: 'First Steps',
          description: 'Completed your first activity!',
          icon: Star,
          color: '#FFD700'
        };
      case 'getting_started':
        return {
          title: 'Getting Started',
          description: 'Completed 3 activities!',
          icon: Target,
          color: '#4CAF50'
        };
      case 'privacy_champion':
        return {
          title: 'Privacy Champion',
          description: 'Completed all activities!',
          icon: Trophy,
          color: '#FF6B6B'
        };
      case 'dedicated_learner':
        return {
          title: 'Dedicated Learner',
          description: 'Spent 60+ minutes learning!',
          icon: Clock,
          color: '#9C27B0'
        };
      case 'memory_master':
        return {
          title: 'Memory Master',
          description: 'Completed memory game!',
          icon: Brain,
          color: '#FF9800'
        };
      case 'quiz_expert':
        return {
          title: 'Quiz Expert',
          description: 'Scored 80%+ on quiz!',
          icon: Award,
          color: '#2196F3'
        };
      default:
        return {
          title: 'Achievement',
          description: 'Great job!',
          icon: Award,
          color: '#666'
        };
    }
  };

  const achievementInfo = getAchievementInfo(achievement);
  const Icon = achievementInfo.icon;

  const sizeClasses = {
    small: 'w-8 h-8 text-xs',
    medium: 'w-12 h-12 text-sm',
    large: 'w-16 h-16 text-base'
  };

  const iconSizes = {
    small: 12,
    medium: 16,
    large: 20
  };

  return (
    <div 
      className={`achievement-badge ${sizeClasses[size]} ${unlocked ? 'unlocked' : 'locked'}`}
      title={unlocked ? achievementInfo.description : 'Locked'}
    >
      <div className="badge-content">
        {unlocked ? (
          <div className="badge-icon" style={{ color: achievementInfo.color }}>
            <Icon size={iconSizes[size]} />
          </div>
        ) : (
          <div className="badge-locked">
            <Icon size={iconSizes[size]} />
          </div>
        )}
      </div>
      
      <style jsx>{`
        .achievement-badge {
          position: relative;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .achievement-badge.unlocked {
          background: linear-gradient(135deg, ${achievementInfo.color}20, ${achievementInfo.color}40);
          border: 2px solid ${achievementInfo.color};
          box-shadow: 0 4px 12px ${achievementInfo.color}40;
        }

        .achievement-badge.locked {
          background: #f0f0f0;
          border: 2px solid #ccc;
          opacity: 0.5;
        }

        .achievement-badge:hover.unlocked {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px ${achievementInfo.color}60;
        }

        .badge-content {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .badge-icon {
          position: relative;
          z-index: 2;
        }

        .badge-locked {
          color: #999;
        }
      `}</style>
    </div>
  );
};

export default AchievementBadge;