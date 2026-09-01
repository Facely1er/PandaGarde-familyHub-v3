import React from 'react';
import { Award, Star, Trophy, Target, Clock, Brain } from 'lucide-react';

interface AchievementBadgeProps {
  achievement: string;
  unlocked: boolean;
  size?: 'small' | 'medium' | 'large';
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement, unlocked, size = 'medium' }) => {
  const getAchievementInfo = (id: string) => {
    switch (id) {
      case 'first_activity':
        return { title: 'First Steps', description: 'Completed your first activity!', icon: Star, tone: 'text-amber-500' };
      case 'getting_started':
        return { title: 'Getting Started', description: 'Completed 3 activities!', icon: Target, tone: 'text-green-600' };
      case 'privacy_champion':
        return { title: 'Privacy Champion', description: 'Completed all activities!', icon: Trophy, tone: 'text-red-500' };
      case 'dedicated_learner':
        return { title: 'Dedicated Learner', description: 'Spent 60+ minutes learning!', icon: Clock, tone: 'text-purple-600' };
      case 'memory_master':
        return { title: 'Memory Master', description: 'Completed memory game!', icon: Brain, tone: 'text-orange-500' };
      case 'quiz_expert':
        return { title: 'Quiz Expert', description: 'Scored 80%+ on quiz!', icon: Award, tone: 'text-blue-600' };
      default:
        return { title: 'Achievement', description: 'Great job!', icon: Award, tone: 'text-gray-500' };
    }
  };

  const achievementInfo = getAchievementInfo(achievement);
  const Icon = achievementInfo.icon;

  const sizeClasses = {
    small: 'h-8 w-8',
    medium: 'h-12 w-12',
    large: 'h-16 w-16',
  };

  const iconSizes = {
    small: 12,
    medium: 16,
    large: 20,
  };

  return (
    <div
      className={`flex items-center justify-center rounded-full border-2 ${sizeClasses[size]} ${
        unlocked
          ? `border-green-600 bg-green-50 dark:border-green-500 dark:bg-green-900/30 ${achievementInfo.tone}`
          : 'border-gray-300 bg-gray-100 text-gray-400 opacity-50 dark:border-gray-600 dark:bg-gray-800'
      }`}
      title={unlocked ? achievementInfo.description : `${achievementInfo.title} (locked)`}
    >
      <Icon size={iconSizes[size]} aria-hidden />
    </div>
  );
};

export default AchievementBadge;
