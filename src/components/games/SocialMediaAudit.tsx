import React, { useState } from 'react';
import { ArrowLeft, Share2, CheckCircle, AlertTriangle, Eye } from 'lucide-react';
import { useGameCompletion } from '../../utils/familyProgressIntegration';

interface SocialMediaAuditProps {
  onBack: () => void;
}

const SocialMediaAudit: React.FC<SocialMediaAuditProps> = ({ onBack }) => {
  const [currentItem, setCurrentItem] = useState(0);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const { recordGameCompletion } = useGameCompletion();

  const auditItems = [
    {
      category: 'Profile Info',
      item: 'Your birthday (full date) is visible to everyone',
      risk: 'high',
      action: 'hide',
      explanation: 'Full birthdays can be used for identity theft. Consider hiding the year or making it friends-only.'
    },
    {
      category: 'Profile Info',
      item: 'Your school/workplace is listed publicly',
      risk: 'medium',
      action: 'review',
      explanation: 'This information can be used to find you in person. Consider limiting who can see it.'
    },
    {
      category: 'Posts',
      item: 'Old posts from 5+ years ago are still public',
      risk: 'medium',
      action: 'review',
      explanation: 'Old posts might not represent who you are today. Review and clean up or limit visibility.'
    },
    {
      category: 'Tagged Photos',
      item: 'You\'re tagged in photos you haven\'t approved',
      risk: 'high',
      action: 'fix',
      explanation: 'Enable tag review to control what photos show on your profile.'
    },
    {
      category: 'Connections',
      item: 'Your friends list is visible to everyone',
      risk: 'low',
      action: 'hide',
      explanation: 'Hiding your friends list prevents strangers from mapping your social network.'
    }
  ];

  const handleAction = (action: 'hide' | 'review' | 'keep' | 'fix') => {
    const item = auditItems[currentItem];
    const correctActions = ['hide', 'fix', 'review'];
    if (correctActions.includes(action) && action !== 'keep') {
      setScore(score + 20);
    }
    
    if (currentItem < auditItems.length - 1) {
      setCurrentItem(currentItem + 1);
    } else {
      setCompleted(true);
      recordGameCompletion(
        'social-media-audit',
        'Social Media Audit',
        score + (correctActions.includes(action) && action !== 'keep' ? 20 : 0),
        100,
        { itemsAudited: auditItems.length }
      );
    }
  };

  const resetGame = () => {
    setCurrentItem(0);
    setScore(0);
    setCompleted(false);
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-4xl mx-auto">
          <button onClick={onBack} className="mb-6 flex items-center space-x-2 text-gray-600 dark:text-gray-300">
            <ArrowLeft size={20} /><span>Back to Learning Hub</span>
          </button>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-green-600 dark:text-green-400" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Audit Complete!</h1>
            <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">{score}%</div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {score >= 80 ? 'Great privacy awareness!' : score >= 60 ? 'Good job reviewing your settings!' : 'Keep learning to protect your privacy!'}
            </p>
            <div className="flex justify-center space-x-4">
              <button onClick={resetGame} className="bg-indigo-600 text-white px-6 py-3 rounded-lg">Audit Again</button>
              <button onClick={onBack} className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-lg">Back to Hub</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const item = auditItems[currentItem];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="mb-6 flex items-center space-x-2 text-gray-600 dark:text-gray-300">
          <ArrowLeft size={20} /><span>Back to Learning Hub</span>
        </button>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Share2 className="text-indigo-600 dark:text-indigo-400" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Social Media Audit 📱</h1>
            <p className="text-gray-600 dark:text-gray-300">Review your social media privacy settings</p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
              <span>Item {currentItem + 1}/{auditItems.length}</span>
              <span>Score: {score}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: `${((currentItem + 1) / auditItems.length) * 100}%` }} />
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">{item.category}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                item.risk === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
                item.risk === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
              }`}>
                {item.risk} risk
              </span>
            </div>
            <div className="flex items-start space-x-3 mb-4">
              <Eye className="text-gray-400 mt-1" size={20} />
              <p className="text-lg text-gray-800 dark:text-gray-100">{item.item}</p>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{item.explanation}</p>
            
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => handleAction('hide')} className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600">Hide/Restrict</button>
              <button onClick={() => handleAction('review')} className="p-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">Review Later</button>
              <button onClick={() => handleAction('fix')} className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Fix Now</button>
              <button onClick={() => handleAction('keep')} className="p-3 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400">Keep As Is</button>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="text-blue-600 dark:text-blue-400 mt-1" size={20} />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Regular privacy audits help you stay in control of your digital footprint. Consider doing this quarterly!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaAudit;

