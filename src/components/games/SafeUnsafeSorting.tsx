import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { useGameCompletion } from '../../utils/familyProgressIntegration';

interface SafeUnsafeSortingProps {
  onBack: () => void;
}

interface SortingItem {
  id: number;
  text: string;
  safe: boolean;
  explanation: string;
}

const SafeUnsafeSorting: React.FC<SafeUnsafeSortingProps> = ({ onBack }) => {
  const [currentItems, setCurrentItems] = useState<SortingItem[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [itemsCompleted, setItemsCompleted] = useState(0);
  const [progressRecorded, setProgressRecorded] = useState(false);
  const { recordGameCompletion } = useGameCompletion();

  const allItems = useMemo(() => [
    // Safe items
    { id: 1, text: "Using strong, unique passwords", safe: true, explanation: "Strong passwords protect your accounts from hackers." },
    { id: 2, text: "Checking privacy settings regularly", safe: true, explanation: "Regular privacy checkups help keep your information secure." },
    { id: 3, text: "Using two-factor authentication", safe: true, explanation: "2FA adds an extra layer of security to your accounts." },
    { id: 4, text: "Logging out of public computers", safe: true, explanation: "Always log out to prevent others from accessing your accounts." },
    { id: 5, text: "Thinking before posting personal info", safe: true, explanation: "Being mindful about what you share protects your privacy." },
    { id: 6, text: "Using secure Wi-Fi networks", safe: true, explanation: "Secure networks protect your data from being intercepted." },
    { id: 7, text: "Reading privacy policies", safe: true, explanation: "Understanding how your data is used helps you make informed decisions." },
    { id: 8, text: "Reporting suspicious activity", safe: true, explanation: "Reporting helps protect yourself and others from threats." },
    { id: 9, text: "Using privacy-focused search engines", safe: true, explanation: "These search engines don't track your searches." },
    { id: 10, text: "Covering your webcam when not in use", safe: true, explanation: "This prevents unauthorized access to your camera." },

    // Unsafe items
    { id: 11, text: "Sharing passwords with friends", safe: false, explanation: "Passwords should never be shared, even with trusted friends." },
    { id: 12, text: "Posting your location in real-time", safe: false, explanation: "This can help stalkers track your movements." },
    { id: 13, text: "Accepting friend requests from strangers", safe: false, explanation: "Strangers might have malicious intentions." },
    { id: 14, text: "Using the same password everywhere", safe: false, explanation: "If one account is hacked, all your accounts become vulnerable." },
    { id: 15, text: "Clicking on suspicious links", safe: false, explanation: "These links might contain malware or lead to phishing sites." },
    { id: 16, text: "Posting photos with personal documents visible", safe: false, explanation: "Documents might contain sensitive information like addresses or IDs." },
    { id: 17, text: "Using public Wi-Fi for banking", safe: false, explanation: "Public Wi-Fi is not secure enough for sensitive activities." },
    { id: 18, text: "Ignoring software updates", safe: false, explanation: "Updates often contain important security fixes." },
    { id: 19, text: "Posting vacation photos while traveling", safe: false, explanation: "This tells criminals that your home is empty." },
    { id: 20, text: "Downloading apps from unknown sources", safe: false, explanation: "These apps might contain malware or steal your data." }
  ], []);

  const getRandomItems = useCallback(() => {
    const shuffled = [...allItems].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  }, [allItems]);

  useEffect(() => {
    setCurrentItems(getRandomItems());
  }, [getRandomItems]);

  const handleSort = (item: SortingItem, isSafe: boolean) => {
    const isCorrect = item.safe === isSafe;
    
    if (isCorrect) {
      setScore(score + 10);
      setFeedback(`Correct! ${item.explanation}`);
    } else {
      setScore(Math.max(0, score - 5));
      setFeedback(`Incorrect. ${item.explanation}`);
    }

    setItemsCompleted(itemsCompleted + 1);

    // Remove the sorted item
    setCurrentItems(currentItems.filter(i => i.id !== item.id));

    // Check if game should continue
    setTimeout(() => {
      setFeedback('');
      if (currentItems.length <= 1) {
        if (itemsCompleted >= 14) { // After 15 items (including current)
          setGameOver(true);
        } else {
          // Add more items
          const remainingItems = allItems.filter(
            allItem => !currentItems.some(current => current.id === allItem.id)
          );
          if (remainingItems.length > 0) {
            const newItems = remainingItems.sort(() => 0.5 - Math.random()).slice(0, 3);
            setCurrentItems([...currentItems.filter(i => i.id !== item.id), ...newItems]);
          } else {
            setGameOver(true);
          }
        }
      }
    }, 2000);
  };

  // Record progress when game completes
  useEffect(() => {
    if (gameOver && !progressRecorded && itemsCompleted > 0) {
      const finalScore = Math.round((score / (itemsCompleted * 10)) * 100);
      recordGameCompletion(
        'safe-unsafe',
        'Safe vs Unsafe Sorting',
        finalScore,
        100,
        { itemsCompleted, totalScore: score }
      );
      setProgressRecorded(true);
    }
  }, [gameOver, progressRecorded, itemsCompleted, score, recordGameCompletion]);

  const resetGame = () => {
    setCurrentItems(getRandomItems());
    setScore(0);
    setGameOver(false);
    setFeedback('');
    setItemsCompleted(0);
    setProgressRecorded(false);
  };

  if (gameOver) {
    const finalScore = Math.round((score / (itemsCompleted * 10)) * 100);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="mb-6 flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Learning Hub</span>
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-green-600 dark:text-green-400" size={32} />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Game Complete!</h1>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">{finalScore}%</div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                You scored {score} points out of {itemsCompleted * 10} possible points!
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {finalScore >= 80 ? 'Excellent! You have great privacy awareness!' :
                 finalScore >= 60 ? 'Good job! Keep learning about online safety.' :
                 'Keep practicing! Online safety takes time to master.'}
              </p>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={resetGame}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <RotateCcw size={20} />
                <span>Play Again</span>
              </button>
              <button
                onClick={onBack}
                className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              >
                Back to Hub
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Learning Hub</span>
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-green-600 dark:text-green-400" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Safe vs Unsafe Sorting</h1>
            <p className="text-gray-600 dark:text-gray-300">Sort online behaviors into safe and unsafe categories</p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">Score: {score}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Items completed: {itemsCompleted}</div>
            </div>
          </div>

          {feedback && (
            <div className={`mb-6 p-4 rounded-lg text-center ${
              feedback.startsWith('Correct') 
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200' 
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
            }`}>
              {feedback}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items to Sort */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 text-center">
                Items to Sort
              </h3>
              <div className="space-y-3">
                {currentItems.map(item => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center"
                  >
                    <p className="text-gray-800 dark:text-gray-200 mb-4">{item.text}</p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSort(item, true)}
                        className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                      >
                        <CheckCircle size={16} />
                        <span>Safe</span>
                      </button>
                      <button
                        onClick={() => handleSort(item, false)}
                        className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
                      >
                        <XCircle size={16} />
                        <span>Unsafe</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Safe Category */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
              <div className="text-center mb-4">
                <CheckCircle className="text-green-600 dark:text-green-400 mx-auto mb-2" size={32} />
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">Safe Behaviors</h3>
                <p className="text-sm text-green-600 dark:text-green-400">These protect your privacy and security</p>
              </div>
              
              <div className="space-y-2">
                <div className="bg-white dark:bg-gray-800 border border-green-200 dark:border-green-700 rounded p-3 text-sm text-green-700 dark:text-green-300">
                  ✓ Using strong passwords
                </div>
                <div className="bg-white dark:bg-gray-800 border border-green-200 dark:border-green-700 rounded p-3 text-sm text-green-700 dark:text-green-300">
                  ✓ Checking privacy settings
                </div>
                <div className="bg-white dark:bg-gray-800 border border-green-200 dark:border-green-700 rounded p-3 text-sm text-green-700 dark:text-green-300">
                  ✓ Being cautious with personal info
                </div>
              </div>
            </div>

            {/* Unsafe Category */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
              <div className="text-center mb-4">
                <XCircle className="text-red-600 dark:text-red-400 mx-auto mb-2" size={32} />
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">Unsafe Behaviors</h3>
                <p className="text-sm text-red-600 dark:text-red-400">These put your privacy and security at risk</p>
              </div>
              
              <div className="space-y-2">
                <div className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-700 rounded p-3 text-sm text-red-700 dark:text-red-300">
                  ✗ Sharing passwords
                </div>
                <div className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-700 rounded p-3 text-sm text-red-700 dark:text-red-300">
                  ✗ Posting real-time locations
                </div>
                <div className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-700 rounded p-3 text-sm text-red-700 dark:text-red-300">
                  ✗ Accepting stranger requests
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">🎯 Game Tips</h3>
            <ul className="space-y-2 text-blue-700 dark:text-blue-300 text-sm">
              <li>• Think about whether each behavior protects or endangers your privacy</li>
              <li>• Consider the potential consequences of each action</li>
              <li>• Remember: when in doubt, choose the more cautious option</li>
              <li>• Learn from the explanations to improve your online safety knowledge</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafeUnsafeSorting;

