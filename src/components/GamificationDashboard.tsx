import React, { useState, useEffect } from 'react';
import Card from './Card';
import { gamificationSystem, Achievement, Mission, GamificationStats } from '../utils/gamificationSystem';
import { localStorageManager, UserProgress } from '../utils/localStorageManager';
import { BarChart3, Target, Trophy, Star, Calendar, Wrench, BookOpen, Award, TrendingUp, Clock, Users as UsersIcon } from 'lucide-react';

interface GamificationDashboardProps {
  userId: string;
  ageGroup: '5-8' | '9-12' | '13-17';
}

const GamificationDashboard: React.FC<GamificationDashboardProps> = ({ userId, ageGroup }: GamificationDashboardProps) => {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [stats, setStats] = useState<GamificationStats | null>(null);
  const [availableMissions, setAvailableMissions] = useState<Mission[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'missions' | 'achievements' | 'levels'>('overview');
  const [showAchievementNotification, setShowAchievementNotification] = useState<Achievement | null>(null);

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const loadUserData = (): void => {
    const progress = localStorageManager.getUserProgress(userId);
    if (!progress) {
      // Create new user progress if doesn't exist
      const newProgress = localStorageManager.createUserProgress(userId, 'User', ageGroup);
      setUserProgress(newProgress);
    } else {
      setUserProgress(progress);
    }

    // Update streak
    gamificationSystem.updateStreak(userId);

    // Load stats and missions
    const updatedProgress = localStorageManager.getUserProgress(userId);
    if (updatedProgress) {
      setUserProgress(updatedProgress);
      setStats(gamificationSystem.getGamificationStats(userId));
      setAvailableMissions(gamificationSystem.getAvailableMissions(userId, ageGroup));
      
      // Load unlocked achievements
      const unlockedAchievementIds = updatedProgress.unlockedAchievements;
      const unlockedAchievements = unlockedAchievementIds.map(id => 
        gamificationSystem.getAchievementsByCategory('learning').find(a => a.id === id)
      ).filter(Boolean) as Achievement[];
      setAchievements(unlockedAchievements);
    }
  };

  const completeMission = (missionId: string): void => {
    try {
      const result = gamificationSystem.completeMission(userId, missionId);
      
      // Show achievement notification if any
      if (result.newAchievements.length > 0) {
        setShowAchievementNotification(result.newAchievements[0]);
        setTimeout(() => setShowAchievementNotification(null), 5000);
      }

      // Reload data
      loadUserData();
    } catch (error) {
      console.error('Error completing mission:', error);
    }
  };

  const addXP = (xp: number, reason: string): void => {
    try {
      const result = gamificationSystem.addXP(userId, xp, reason);
      
      // Show achievement notification if any
      if (result.newAchievements.length > 0) {
        setShowAchievementNotification(result.newAchievements[0]);
        setTimeout(() => setShowAchievementNotification(null), 5000);
      }

      // Reload data
      loadUserData();
    } catch (error) {
      console.error('Error adding XP:', error);
    }
  };

  if (!userProgress || !stats) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">Loading gamification data...</div>
      </div>
    );
  }

  const currentLevelInfo = gamificationSystem.getCurrentLevelInfo(userProgress);
  const progressPercentage = currentLevelInfo.xpToNext > 0 
    ? ((userProgress.totalXP - currentLevelInfo.xpRequired) / (currentLevelInfo.xpRequired + currentLevelInfo.xpToNext - currentLevelInfo.xpRequired)) * 100
    : 100;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Achievement Notification */}
      {showAchievementNotification && (
        <div className="fixed top-4 right-4 z-50 bg-white border-2 border-yellow-400 rounded-lg p-4 shadow-lg animate-bounce">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{showAchievementNotification.icon}</span>
            <div>
              <h3 className="font-bold text-gray-900">Achievement Unlocked!</h3>
              <p className="text-gray-700">{showAchievementNotification.name}</p>
              <p className="text-sm text-gray-600">+{showAchievementNotification.xpReward} XP</p>
            </div>
          </div>
        </div>
      )}

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Learning Dashboard</h1>
        <p className="text-lg text-gray-600">
          Track your progress, complete missions, and unlock achievements as you learn about digital privacy!
        </p>
      </div>

      {/* Level Progress */}
      <Card className="mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{currentLevelInfo.title}</h2>
              <p className="text-gray-600">{currentLevelInfo.description}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{userProgress.totalXP}</div>
              <p className="text-sm text-gray-600">Total XP</p>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Level {currentLevelInfo.level}</span>
              <span>{currentLevelInfo.xpToNext > 0 ? `${currentLevelInfo.xpToNext} XP to next level` : 'Max Level!'}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, progressPercentage)}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-green-600">{stats.currentStreak}</div>
              <p className="text-sm text-gray-600">Day Streak</p>
            </div>
            <div>
              <div className="text-xl font-bold text-purple-600">{stats.achievementsUnlocked}</div>
              <p className="text-sm text-gray-600">Achievements</p>
            </div>
            <div>
              <div className="text-xl font-bold text-orange-600">{stats.missionsCompleted}</div>
              <p className="text-sm text-gray-600">Missions</p>
            </div>
            <div>
              <div className="text-xl font-bold text-red-600">{stats.privacyScore}</div>
              <p className="text-sm text-gray-600">Privacy Score</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'missions', label: 'Missions', icon: Target },
            { id: 'achievements', label: 'Achievements', icon: Trophy },
            { id: 'levels', label: 'Levels', icon: Star }
          ].map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-colors ${
                  selectedTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <IconComponent size={18} />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {selectedTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => addXP(25, 'Daily check-in')}
                  className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left"
                >
                  <div className="mb-2 text-blue-600"><Calendar size={24} /></div>
                  <h4 className="font-medium text-gray-900">Daily Check-in</h4>
                  <p className="text-sm text-gray-600">+25 XP</p>
                </button>
                <button
                  onClick={() => addXP(50, 'Privacy tool usage')}
                  className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left"
                >
                  <div className="mb-2 text-green-600"><Wrench size={24} /></div>
                  <h4 className="font-medium text-gray-900">Use Privacy Tool</h4>
                  <p className="text-sm text-gray-600">+50 XP</p>
                </button>
                <button
                  onClick={() => addXP(100, 'Learning session')}
                  className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left"
                >
                  <div className="mb-2 text-purple-600"><BookOpen size={24} /></div>
                  <h4 className="font-medium text-gray-900">Learning Session</h4>
                  <p className="text-sm text-gray-600">+100 XP</p>
                </button>
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Target size={20} className="text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Completed Daily App Check</p>
                    <p className="text-sm text-gray-600">+25 XP • 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Trophy size={20} className="text-yellow-600" />
                  <div>
                    <p className="font-medium text-gray-900">Unlocked "First Steps" Achievement</p>
                    <p className="text-sm text-gray-600">+50 XP • Yesterday</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Star size={20} className="text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">Leveled up to Privacy Learner!</p>
                    <p className="text-sm text-gray-600">Level 2 • 3 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {selectedTab === 'missions' && (
        <div className="space-y-6">
          <Card>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Available Missions</h3>
              {availableMissions.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No missions available at the moment.</p>
              ) : (
                <div className="space-y-4">
                  {availableMissions.map(mission => (
                    <div key={mission.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{mission.title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${gamificationSystem.getDifficultyColor(mission.difficulty)}`}>
                              {mission.difficulty.toUpperCase()}
                            </span>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                              {mission.category.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3">{mission.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1"><Clock size={14} /> {mission.duration} min</span>
                            <span className="flex items-center gap-1"><Target size={14} /> {mission.xpReward} XP</span>
                            <span className="flex items-center gap-1"><UsersIcon size={14} /> {mission.ageGroup}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => completeMission(mission.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Start Mission
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {selectedTab === 'achievements' && (
        <div className="space-y-6">
          <Card>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Achievements</h3>
              {achievements.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No achievements unlocked yet. Complete missions to unlock achievements!</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map(achievement => (
                    <div key={achievement.id} className="border rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="text-blue-600"><Award size={24} /></div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{achievement.name}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${gamificationSystem.getRarityColor(achievement.rarity)}`}>
                              {achievement.rarity.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                          <p className="text-xs text-green-600 font-medium">+{achievement.xpReward} XP</p>
                          {achievement.unlockedAt && (
                            <p className="text-xs text-gray-500 mt-1">
                              Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {selectedTab === 'levels' && (
        <div className="space-y-6">
          <Card>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Level Progression</h3>
              <div className="space-y-4">
                {gamificationSystem.getLevelInfo(userProgress.currentLevel) && (
                  <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                    <div className="flex items-center space-x-3">
                      <Star size={24} className="text-yellow-600" />
                      <div>
                        <h4 className="font-semibold text-blue-900">Current Level: {currentLevelInfo.title}</h4>
                        <p className="text-blue-700">{currentLevelInfo.description}</p>
                        <p className="text-sm text-blue-600 mt-1">
                          {currentLevelInfo.xpToNext > 0 
                            ? `${currentLevelInfo.xpToNext} XP to next level`
                            : 'Maximum level reached!'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {LEVELS.slice(0, 5).map(level => (
                    <div key={level.level} className={`p-4 rounded-lg border ${
                      level.level <= userProgress.currentLevel 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">{level.level <= userProgress.currentLevel ? '✅' : '🔒'}</span>
                        <h4 className="font-semibold text-gray-900">Level {level.level}</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{level.title}</p>
                      <p className="text-xs text-gray-500">{level.xpRequired} XP required</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default GamificationDashboard;