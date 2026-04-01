import React, { useState } from 'react';
import { ArrowLeft, Settings, CheckCircle, AlertTriangle } from 'lucide-react';
import { useGameCompletion } from '../../utils/familyProgressIntegration';

interface PrivacySettingsTrainerProps {
  onBack: () => void;
}

const PrivacySettingsTrainer: React.FC<PrivacySettingsTrainerProps> = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const { recordGameCompletion } = useGameCompletion();

  const settings = [
    {
      platform: 'Social Media',
      setting: 'Who can see my posts?',
      options: ['Everyone', 'Friends of Friends', 'Friends Only', 'Only Me'],
      recommended: 2,
      explanation: 'Friends Only is the safest default - it limits who can see your content while still allowing sharing with people you trust.'
    },
    {
      platform: 'Social Media',
      setting: 'Location sharing',
      options: ['Always On', 'While Using App', 'Ask Each Time', 'Never'],
      recommended: 3,
      explanation: 'Never sharing location is the most private option. Location data can reveal where you live, work, and spend time.'
    },
    {
      platform: 'Messaging App',
      setting: 'Read receipts',
      options: ['Always show', 'Show to contacts only', 'Never show'],
      recommended: 2,
      explanation: 'Turning off read receipts protects your privacy and reduces pressure to respond immediately.'
    },
    {
      platform: 'Browser',
      setting: 'Third-party cookies',
      options: ['Allow all', 'Allow from visited sites', 'Block all'],
      recommended: 2,
      explanation: 'Blocking all third-party cookies prevents companies from tracking you across different websites.'
    },
    {
      platform: 'Phone',
      setting: 'App permissions - Camera',
      options: ['Always allow', 'Allow when using app', 'Ask every time', 'Deny'],
      recommended: 2,
      explanation: 'Asking every time gives you control over when apps can access your camera.'
    }
  ];

  const handleChoice = (choiceIndex: number) => {
    const currentSetting = settings[currentStep];
    if (choiceIndex === currentSetting.recommended) {
      setScore(score + 20);
    }
    
    if (currentStep < settings.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCompleted(true);
      const finalScore = score + (choiceIndex === currentSetting.recommended ? 20 : 0);
      recordGameCompletion(
        'privacy-settings',
        'Privacy Settings Trainer',
        finalScore,
        100,
        { settingsConfigured: settings.length }
      );
    }
  };

  const resetGame = () => {
    setCurrentStep(0);
    setScore(0);
    setCompleted(false);
  };

  if (completed) {
    const percentage = score;
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-4xl mx-auto">
          <button onClick={onBack} className="mb-6 flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors">
            <ArrowLeft size={20} /><span>Back to Learning Hub</span>
          </button>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-green-600 dark:text-green-400" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Training Complete!</h1>
            <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-4">{percentage}%</div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {percentage >= 80 ? 'Excellent! You know how to configure privacy settings!' :
               percentage >= 60 ? 'Good job! Keep learning about privacy settings.' :
               'Keep practicing to improve your privacy configuration skills.'}
            </p>
            <div className="flex justify-center space-x-4">
              <button onClick={resetGame} className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors">Train Again</button>
              <button onClick={onBack} className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">Back to Hub</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const setting = settings[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="mb-6 flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors">
          <ArrowLeft size={20} /><span>Back to Learning Hub</span>
        </button>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="text-gray-600 dark:text-gray-300" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Privacy Settings Trainer ⚙️</h1>
            <p className="text-gray-600 dark:text-gray-300">Learn to configure privacy settings on popular platforms</p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
              <span>Progress: {currentStep + 1}/{settings.length}</span>
              <span>Score: {score}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div className="bg-gray-600 dark:bg-gray-400 h-2 rounded-full transition-all" style={{ width: `${((currentStep + 1) / settings.length) * 100}%` }} />
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">{setting.platform}</div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">{setting.setting}</h2>
            <div className="space-y-3">
              {setting.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleChoice(index)}
                  className="w-full text-left p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-gray-400 dark:hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="text-yellow-600 dark:text-yellow-400 mt-1" size={20} />
              <div>
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">Tip</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Think about who really needs access to your information and choose the most restrictive option that still works for you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettingsTrainer;

