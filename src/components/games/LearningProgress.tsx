import React from 'react';
import { 
  BookOpen, Target, TrendingUp, 
  Star, CheckCircle, Zap, Trophy, Medal, Brain
} from 'lucide-react';

interface LearningProgressProps {
  currentModule?: string;
  moduleScore?: number;
  timeSpent?: number;
  questionsAnswered?: number;
  correctAnswers?: number;
  totalScore?: number;
  completedChallenges?: number;
  streak?: number;
  achievements?: string[];
  badges?: string[];
}

export const LearningProgress: React.FC<LearningProgressProps> = ({
  currentModule,
  moduleScore = 0,
  timeSpent = 0,
  questionsAnswered = 0,
  correctAnswers = 0,
  totalScore = 0,
  completedChallenges = 0,
  streak = 0,
  achievements = [],
  badges = []
}) => {
  // Calculate learning-specific metrics
  const accuracy = questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0;
  const averageScorePerModule = completedChallenges > 0 
    ? Math.round(totalScore / completedChallenges)
    : 0;
  
  const learningStreak = streak;
  const streakBonus = learningStreak > 0 ? Math.min(learningStreak * 3, 30) : 0;

  // Calculate learning efficiency
  const learningEfficiency = timeSpent > 0 ? Math.round((moduleScore / timeSpent) * 100) : 0;

  // Get color classes based on performance
  const getScoreColor = (score: number) => {
    if (score >= 80) {return 'text-green-600 dark:text-green-400';}
    if (score >= 60) {return 'text-yellow-600 dark:text-yellow-400';}
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 80) {return 'bg-green-500';}
    if (score >= 60) {return 'bg-yellow-500';}
    return 'bg-red-500';
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <BookOpen className="text-blue-600 dark:text-blue-400" size={20} />
          <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">Learning Progress</span>
        </div>
        <div className="flex items-center space-x-2">
          <Target className="text-blue-500" size={16} />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {totalScore} total points
          </span>
        </div>
      </div>

      {/* Overall Learning Score */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Overall Learning Score
          </span>
          <div className="flex items-center space-x-2">
            <span className={`font-bold text-lg ${getScoreColor(averageScorePerModule)}`}>
              {averageScorePerModule}
            </span>
            <div className="flex items-center space-x-1">
              <Zap className="text-yellow-500" size={14} />
              <span className="text-xs text-yellow-600 dark:text-yellow-400">
                {streakBonus > 0 ? `+${streakBonus} streak bonus` : 'No streak'}
              </span>
            </div>
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${getScoreBarColor(averageScorePerModule)}`}
            style={{ width: `${Math.min(averageScorePerModule, 100)}%` }}
          />
        </div>
      </div>

      {/* Learning Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {/* Current Module Score */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Brain className="text-blue-600 dark:text-blue-400" size={16} />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Current Module</span>
          </div>
          <div className={`text-lg font-bold ${getScoreColor(moduleScore)}`}>
            {moduleScore} points
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400">
            {currentModule || 'No active module'}
          </div>
        </div>

        {/* Learning Accuracy */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <CheckCircle className="text-green-600 dark:text-green-400" size={16} />
            <span className="text-sm font-medium text-green-800 dark:text-green-200">Accuracy</span>
          </div>
          <div className={`text-lg font-bold ${getScoreColor(accuracy)}`}>
            {accuracy}%
          </div>
          <div className="text-xs text-green-600 dark:text-green-400">
            {correctAnswers}/{questionsAnswered} correct
          </div>
        </div>

        {/* Learning Efficiency */}
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <TrendingUp className="text-purple-600 dark:text-purple-400" size={16} />
            <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Efficiency</span>
          </div>
          <div className={`text-lg font-bold ${getScoreColor(learningEfficiency)}`}>
            {learningEfficiency}
          </div>
          <div className="text-xs text-purple-600 dark:text-purple-400">
            Points per minute
          </div>
        </div>

        {/* Learning Streak */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Zap className="text-yellow-600 dark:text-yellow-400" size={16} />
            <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Learning Streak</span>
          </div>
          <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
            {learningStreak} days
          </div>
          <div className="text-xs text-yellow-600 dark:text-yellow-400">
            {streakBonus > 0 ? `+${streakBonus} bonus points` : 'No bonus'}
          </div>
        </div>
      </div>

      {/* Learning Achievements */}
      {(achievements.length > 0 || badges.length > 0) && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Medal className="text-yellow-500" size={16} />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Learning Achievements</span>
            </div>
            <div className="flex items-center space-x-4">
              {achievements.length > 0 && (
                <div className="flex items-center space-x-1">
                  <Trophy className="text-yellow-500" size={14} />
                  <span className="text-xs text-gray-600 dark:text-gray-300">
                    {achievements.length} achievements
                  </span>
                </div>
              )}
              {badges.length > 0 && (
                <div className="flex items-center space-x-1">
                  <Star className="text-blue-500" size={14} />
                  <span className="text-xs text-gray-600 dark:text-gray-300">
                    {badges.length} badges
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Learning Tips */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Brain className="text-blue-600 dark:text-blue-400" size={16} />
          <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Learning Tip</span>
        </div>
        <p className="text-xs text-blue-700 dark:text-blue-300">
          {accuracy >= 80 
            ? "Excellent accuracy! Keep up the great work and try more challenging modules."
            : accuracy >= 60
            ? "Good progress! Focus on understanding the concepts to improve your accuracy."
            : "Take your time to read questions carefully and review the learning materials."
          }
        </p>
      </div>
    </div>
  );
};

export default LearningProgress;

