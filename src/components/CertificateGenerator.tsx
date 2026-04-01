import React, { useState } from 'react';
import { Download, Award, FileText, Star, CheckCircle } from 'lucide-react';
import { CertificateService, CertificateData, Achievement, ACHIEVEMENTS } from '../lib/certificateService';
import { useProgress } from '../contexts/ProgressContext';
import { useAuth } from '../pages/family-hub/AuthWrapper';
import { useFamily } from '../contexts/FamilyContext';

interface CertificateGeneratorProps {
  onClose?: () => void;
}

const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({ onClose }) => {
  const [selectedAchievement, setSelectedAchievement] = useState<string>('');
  const [customAchievement, setCustomAchievement] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { progress, getOverallProgress } = useProgress();
  const { profile } = useAuth();
  const { currentFamily } = useFamily();

  const overallProgress = getOverallProgress();
  const earnedAchievements = CertificateService.checkAchievements(progress);

  const generateCertificate = async () => {
    setIsGenerating(true);
    
    try {
      const achievement = selectedAchievement 
        ? ACHIEVEMENTS.find(a => a.id === selectedAchievement)
        : null;
      
      const certificateData: CertificateData = {
        recipientName: profile?.profile_data?.firstName 
          ? `${profile.profile_data.firstName} ${profile.profile_data.lastName || ''}`.trim()
          : profile?.email?.split('@')[0] || 'Privacy Learner',
        achievement: achievement?.name || customAchievement || 'Privacy Education',
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        familyName: currentFamily?.name,
        score: Math.round(overallProgress.percentage),
        totalActivities: overallProgress.totalCount,
        completedActivities: overallProgress.completedCount
      };

      await CertificateService.downloadCertificate(certificateData);
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('Error generating certificate. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAchievementBadge = async (achievement: Achievement) => {
    try {
      const recipientName = profile?.profile_data?.firstName 
        ? `${profile.profile_data.firstName} ${profile.profile_data.lastName || ''}`.trim()
        : profile?.email?.split('@')[0] || 'Privacy Learner';
      
      await CertificateService.downloadAchievementBadge(achievement, recipientName);
    } catch (error) {
      console.error('Error generating achievement badge:', error);
      alert('Error generating achievement badge. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Award className="text-green-600" size={24} />
          Certificate Generator
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Progress Overview */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Your Progress
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Activities Completed</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {overallProgress.completedCount}/{overallProgress.totalCount}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Overall Progress</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {Math.round(overallProgress.percentage)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Time Spent</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {progress.totalTimeSpent} minutes
                </span>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Earned Achievements
            </h3>
            <div className="space-y-3">
              {earnedAchievements.length > 0 ? (
                earnedAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {achievement.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {achievement.description}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => generateAchievementBadge(achievement)}
                      className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      title="Download Badge"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  <Star size={32} className="mx-auto mb-2 opacity-50" />
                  <p>Complete activities to earn achievements!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Certificate Generation */}
        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Generate Certificate
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Achievement
                </label>
                <select
                  value={selectedAchievement}
                  onChange={(e) => setSelectedAchievement(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">Choose an achievement</option>
                  {ACHIEVEMENTS.map((achievement) => (
                    <option key={achievement.id} value={achievement.id}>
                      {achievement.icon} {achievement.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Or Custom Achievement
                </label>
                <input
                  type="text"
                  value={customAchievement}
                  onChange={(e) => setCustomAchievement(e.target.value)}
                  placeholder="Enter custom achievement name"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <button
                onClick={generateCertificate}
                disabled={isGenerating || (!selectedAchievement && !customAchievement)}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText size={16} />
                    Generate Certificate
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white">Quick Actions</h4>
            
            <button
              onClick={() => {
                setSelectedAchievement('privacy_champion');
                generateCertificate();
              }}
              className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg hover:from-yellow-100 hover:to-orange-100 dark:hover:from-yellow-900/30 dark:hover:to-orange-900/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Award className="text-yellow-600" size={20} />
                <span className="font-medium">Privacy Champion Certificate</span>
              </div>
              <Download size={16} className="text-gray-400" />
            </button>

            <button
              onClick={() => {
                setSelectedAchievement('');
                setCustomAchievement('Privacy Education Completion');
                generateCertificate();
              }}
              className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg hover:from-green-100 hover:to-blue-100 dark:hover:from-green-900/30 dark:hover:to-blue-900/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-600" size={20} />
                <span className="font-medium">Completion Certificate</span>
              </div>
              <Download size={16} className="text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateGenerator;