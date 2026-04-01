import React, { useState, useEffect } from 'react';
import { ArrowLeft, Eye, EyeOff, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { LearningProgress } from './LearningProgress';
import { LearningTimer } from './LearningTimer';
import { useGameCompletion } from '../../utils/familyProgressIntegration';

interface PasswordStrengthLabProps {
  onBack: () => void;
}

const PasswordStrengthLab: React.FC<PasswordStrengthLabProps> = ({ onBack }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const { recordGameCompletion } = useGameCompletion();

  const checkPasswordStrength = (pwd: string) => {
    let score = 0;
    const checks = {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      numbers: /\d/.test(pwd),
      symbols: /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
    };

    Object.values(checks).forEach(check => {
      if (check) {score++;}
    });

    return { score, checks };
  };

  const { score, checks } = checkPasswordStrength(password);

  // Record game completion when score reaches maximum
  useEffect(() => {
    if (score >= 4 && !gameCompleted && password.length > 0) {
      const finalScore = score * 20; // Convert to 0-100 scale
      recordGameCompletion(
        'password-strength',
        'Password Strength Lab',
        finalScore,
        100,
        { timeSpent, questionsAnswered, correctAnswers }
      );
      setGameCompleted(true);
    }
  }, [score, password, gameCompleted, timeSpent, questionsAnswered, correctAnswers, recordGameCompletion]);

  const getStrengthColor = () => {
    if (score <= 2) {return 'text-red-600';}
    if (score <= 3) {return 'text-yellow-600';}
    return 'text-green-600';
  };

  const getStrengthText = () => {
    if (score <= 2) {return 'Weak';}
    if (score <= 3) {return 'Medium';}
    return 'Strong';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Learning Hub</span>
          </button>
        </div>

        {/* Learning Progress */}
        <LearningProgress 
          currentModule="Password Strength Lab"
          moduleScore={score * 20}
          timeSpent={timeSpent}
          questionsAnswered={questionsAnswered}
          correctAnswers={correctAnswers}
        />

        {/* Learning Timer */}
        <LearningTimer 
          duration={300}
          onTick={(timeRemaining) => setTimeSpent(300 - timeRemaining)}
          autoStart={true}
        />

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="text-blue-600 dark:text-blue-400" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Password Strength Lab 🔐</h1>
            <p className="text-gray-600 dark:text-gray-300">Become a password superhero! Test and improve your password security skills</p>
            
            {/* Fun engagement elements */}
            <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <div className="text-center">
                <div className="text-4xl mb-2">🛡️</div>
                <h3 className="font-bold text-blue-800 dark:text-blue-200 mb-2">Mission: Create Super Strong Passwords!</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Help protect your digital world by creating passwords that even hackers can't crack! 💪
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Instructions for kids */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">💡</div>
                <div>
                  <h4 className="font-bold text-yellow-800 dark:text-yellow-200 mb-2">How to Play! 🎮</h4>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                    <li>• Type a password in the box below 📝</li>
                    <li>• Watch the strength meter fill up as you type! 📊</li>
                    <li>• Try to get all 5 checkmarks green ✅</li>
                    <li>• A strong password keeps your accounts super safe! 🔒</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                🔐 Enter a password to test your superhero skills:
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setQuestionsAnswered(prev => prev + 1);
                    if (e.target.value.length >= 8) {
                      setCorrectAnswers(prev => prev + 1);
                    }
                  }}
                  className="w-full p-4 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                  placeholder="Type your super secret password here... 🤫"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {password && (
              <div className="space-y-6">
                {/* Fun strength indicator */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">
                      {score >= 4 ? '🦸' : score >= 3 ? '🛡️' : score >= 2 ? '⚔️' : '🥷'}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                      {score >= 4 ? 'Password Superhero!' : 
                       score >= 3 ? 'Password Guardian!' : 
                       score >= 2 ? 'Password Warrior!' : 'Password Apprentice!'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {score >= 4 ? 'Amazing! Your password is super strong! 🌟' : 
                       score >= 3 ? 'Great job! Your password is getting strong! 💪' : 
                       score >= 2 ? 'Good start! Keep making it stronger! 🔥' : 'Keep trying! You can make it stronger! 💡'}
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">🔐 Password Strength Meter</h3>
                    <span className={`font-bold text-lg ${getStrengthColor()}`}>
                      {getStrengthText()} ({score}/5)
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 mb-4">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${
                        score <= 2 ? 'bg-red-500' : 
                        score <= 3 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${(score / 5) * 100}%` }}
                    />
                  </div>

                  <div className="space-y-3">
                    {[
                      { key: 'length', label: '🔢 At least 8 characters long', check: checks.length },
                      { key: 'uppercase', label: '🔤 Contains UPPERCASE letters (A, B, C)', check: checks.uppercase },
                      { key: 'lowercase', label: '🔡 Contains lowercase letters (a, b, c)', check: checks.lowercase },
                      { key: 'numbers', label: '🔢 Contains numbers (1, 2, 3)', check: checks.numbers },
                      { key: 'symbols', label: '✨ Contains special characters (!@#$%)', check: checks.symbols }
                    ].map(({ key, label, check }) => (
                      <div key={key} className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                        check 
                          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                          : 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600'
                      }`}>
                        {check ? (
                          <div className="relative">
                            <CheckCircle className="text-green-500" size={24} />
                            <div className="absolute -top-1 -right-1 text-lg animate-bounce">✨</div>
                          </div>
                        ) : (
                          <AlertTriangle className="text-red-500" size={24} />
                        )}
                        <div className="flex-1">
                          <span className={`font-medium ${check ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                          {label}
                          </span>
                          {check && (
                            <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                              Great job! {
                                key === 'length' ? 'Your password is nice and long!' :
                                key === 'uppercase' ? 'You used big letters!' :
                                key === 'lowercase' ? 'You used small letters!' :
                                key === 'numbers' ? 'Numbers make it stronger!' :
                                'Special characters are awesome!'
                              } 🎉
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-lg font-semibold text-blue-800 dark:text-blue-200">💡 Super Secret Password Tips!</span>
                  </div>
                  <ul className="space-y-2 text-blue-700 dark:text-blue-300 text-sm">
                    <li className="flex items-start space-x-2">
                      <span>•</span>
                      <span>Make a different password for each website and app!</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span>•</span>
                      <span>Try using a sentence or phrase that's easy to remember!</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span>•</span>
                      <span>Ask a grown-up about password managers - they're like digital safes!</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span>•</span>
                      <span>Two-factor authentication is like having a double lock on your door!</span>
                    </li>
                  </ul>
                </div>
                
                {/* Achievement celebration */}
                {score >= 4 && (
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-6 text-center text-white animate-pulse">
                    <div className="text-4xl mb-2">🎉 🏆 🎉</div>
                    <h3 className="text-xl font-bold mb-2">Achievement Unlocked!</h3>
                    <p className="text-lg">Password Superhero Badge Earned! 🦸‍♂️</p>
                    <p className="text-sm opacity-90">You created an incredibly strong password!</p>
                  </div>
                )}
                
                {/* Encouragement for lower scores */}
                {score < 4 && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                    <div className="text-center">
                      <div className="text-3xl mb-2">💪</div>
                      <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-2">Keep Going, Champion!</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        {score === 0 ? 'Every superhero starts somewhere! Try adding some letters and numbers! 🌟' :
                         score === 1 ? 'You\'re on your way! Try adding more types of characters! 🚀' :
                         score === 2 ? 'Getting stronger! Add a few more elements to power up! ⚡' :
                         'Almost there! Just one more element to become a Password Guardian! 🛡️'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthLab;

