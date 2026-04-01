import React, { useState, useEffect } from 'react';
import { ArrowLeft, Castle, Shield, Zap, Lock } from 'lucide-react';
import { useGameCompletion } from '../../utils/familyProgressIntegration';

interface PasswordFortressBuilderProps {
  onBack: () => void;
}

const PasswordFortressBuilder: React.FC<PasswordFortressBuilderProps> = ({ onBack }) => {
  const [password, setPassword] = useState('');
  const [completed, setCompleted] = useState(false);
  const { recordGameCompletion } = useGameCompletion();

  const defenses = [
    { id: 'length', name: 'Stone Wall', check: (p: string) => p.length >= 8, icon: '🧱', description: '8+ characters', points: 15 },
    { id: 'extraLength', name: 'Tower', check: (p: string) => p.length >= 12, icon: '🗼', description: '12+ characters', points: 10 },
    { id: 'upper', name: 'Archers', check: (p: string) => /[A-Z]/.test(p), icon: '🏹', description: 'Uppercase letters', points: 15 },
    { id: 'lower', name: 'Guards', check: (p: string) => /[a-z]/.test(p), icon: '⚔️', description: 'Lowercase letters', points: 15 },
    { id: 'numbers', name: 'Cannons', check: (p: string) => /\d/.test(p), icon: '💣', description: 'Numbers', points: 20 },
    { id: 'symbols', name: 'Moat', check: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p), icon: '🌊', description: 'Special symbols', points: 15 },
    { id: 'unique', name: 'Dragon', check: (p: string) => new Set(p).size >= p.length * 0.7, icon: '🐉', description: 'Unique characters', points: 10 }
  ];

  const calculateScore = () => {
    return defenses.reduce((total, defense) => {
      return total + (defense.check(password) ? defense.points : 0);
    }, 0);
  };

  const score = calculateScore();
  const activeDefenses = defenses.filter(d => d.check(password));

  useEffect(() => {
    if (score >= 80 && !completed) {
      setCompleted(true);
      recordGameCompletion(
        'password-fortress',
        'Password Fortress Builder',
        score,
        100,
        { defensesBuilt: activeDefenses.length }
      );
    }
  }, [score, completed, activeDefenses.length, recordGameCompletion]);

  const getFortressLevel = () => {
    if (score >= 90) {return { name: 'Legendary Citadel', emoji: '🏰', color: 'text-purple-600' };}
    if (score >= 70) {return { name: 'Mighty Castle', emoji: '🏯', color: 'text-blue-600' };}
    if (score >= 50) {return { name: 'Stone Keep', emoji: '🏠', color: 'text-green-600' };}
    if (score >= 30) {return { name: 'Wooden Fort', emoji: '🪵', color: 'text-yellow-600' };}
    return { name: 'Camp', emoji: '⛺', color: 'text-gray-600' };
  };

  const fortress = getFortressLevel();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="mb-6 flex items-center space-x-2 text-gray-600 dark:text-gray-300">
          <ArrowLeft size={20} /><span>Back to Learning Hub</span>
        </button>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Castle className="text-amber-600 dark:text-amber-400" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Password Fortress Builder 🏰</h1>
            <p className="text-gray-600 dark:text-gray-300">Build an impenetrable fortress with a strong password!</p>
          </div>

          {/* Fortress Display */}
          <div className="bg-gradient-to-b from-sky-200 to-green-200 dark:from-sky-900/30 dark:to-green-900/30 rounded-2xl p-8 mb-8">
            <div className="text-center">
              <div className="text-8xl mb-4">{fortress.emoji}</div>
              <h2 className={`text-2xl font-bold ${fortress.color} mb-2`}>{fortress.name}</h2>
              <div className="flex items-center justify-center space-x-2">
                <Shield className="text-amber-500" size={20} />
                <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">Defense Power: {score}/100</span>
              </div>
            </div>
            
            {/* Active Defenses */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {activeDefenses.map(defense => (
                <div key={defense.id} className="bg-white dark:bg-gray-700 rounded-lg px-3 py-2 shadow-sm flex items-center space-x-2">
                  <span className="text-xl">{defense.icon}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{defense.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Lock className="inline mr-2" size={16} />
              Create your fortress password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 text-lg border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
              placeholder="Build your fortress..."
            />
          </div>

          {/* Defense Building Options */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {defenses.map(defense => (
              <div
                key={defense.id}
                className={`p-4 rounded-lg border-2 text-center transition-all ${
                  defense.check(password)
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
                }`}
              >
                <div className="text-3xl mb-2">{defense.icon}</div>
                <div className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{defense.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{defense.description}</div>
                <div className={`text-xs mt-1 ${defense.check(password) ? 'text-green-600' : 'text-gray-400'}`}>
                  {defense.check(password) ? '✓ Built' : `+${defense.points} pts`}
                </div>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
              <span>Fortress Strength</span>
              <span>{score}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
              <div 
                className={`h-4 rounded-full transition-all duration-500 ${
                  score >= 80 ? 'bg-purple-500' :
                  score >= 60 ? 'bg-green-500' :
                  score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>

          {completed && (
            <div className="bg-gradient-to-r from-amber-400 to-yellow-400 rounded-xl p-6 text-center text-white">
              <div className="text-4xl mb-2">🏆 🏰 🎉</div>
              <h3 className="text-xl font-bold mb-2">Fortress Complete!</h3>
              <p>Your password fortress is nearly impenetrable!</p>
            </div>
          )}

          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Zap className="text-blue-600 dark:text-blue-400 mt-1" size={20} />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Pro Tip:</strong> A strong password fortress has multiple layers of defense. 
                Try combining uppercase, lowercase, numbers, and symbols to maximize your protection!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordFortressBuilder;

