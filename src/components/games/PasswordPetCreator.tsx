import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Star, Shield } from 'lucide-react';
import { useGameCompletion } from '../../utils/familyProgressIntegration';

interface PasswordPetCreatorProps {
  onBack: () => void;
}

const PasswordPetCreator: React.FC<PasswordPetCreatorProps> = ({ onBack }) => {
  const [password, setPassword] = useState('');
  const [petName, setPetName] = useState('');
  const [completed, setCompleted] = useState(false);
  const { recordGameCompletion } = useGameCompletion();

  const calculateStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) {strength += 20;}
    if (pwd.length >= 12) {strength += 10;}
    if (/[A-Z]/.test(pwd)) {strength += 20;}
    if (/[a-z]/.test(pwd)) {strength += 15;}
    if (/\d/.test(pwd)) {strength += 20;}
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {strength += 15;}
    return Math.min(strength, 100);
  };

  const strength = calculateStrength(password);

  const getPetStage = () => {
    if (strength >= 80) {return { emoji: '🐉', name: 'Dragon', color: 'text-purple-500' };}
    if (strength >= 60) {return { emoji: '🦁', name: 'Lion', color: 'text-yellow-500' };}
    if (strength >= 40) {return { emoji: '🐕', name: 'Dog', color: 'text-orange-500' };}
    if (strength >= 20) {return { emoji: '🐣', name: 'Chick', color: 'text-yellow-400' };}
    return { emoji: '🥚', name: 'Egg', color: 'text-gray-400' };
  };

  const pet = getPetStage();

  useEffect(() => {
    if (strength >= 80 && !completed) {
      setCompleted(true);
      recordGameCompletion(
        'password-pet',
        'Password Pet Creator',
        strength,
        100,
        { petEvolved: pet.name }
      );
    }
  }, [strength, completed, pet.name, recordGameCompletion]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="mb-6 flex items-center space-x-2 text-gray-600 dark:text-gray-300">
          <ArrowLeft size={20} /><span>Back to Learning Hub</span>
        </button>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="text-pink-600 dark:text-pink-400" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Password Pet Creator 🐾</h1>
            <p className="text-gray-600 dark:text-gray-300">Create a strong password to evolve your pet!</p>
          </div>

          {/* Pet Display */}
          <div className="bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-2xl p-8 mb-8 text-center">
            <div className="text-8xl mb-4 animate-bounce">{pet.emoji}</div>
            <h2 className={`text-2xl font-bold ${pet.color} mb-2`}>{petName || 'Your Pet'}</h2>
            <p className="text-gray-600 dark:text-gray-300">Evolution Stage: {pet.name}</p>
            
            {/* Health/Strength Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Shield className="text-green-500" size={20} />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Protection Level: {strength}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4 max-w-xs mx-auto">
                <div 
                  className={`h-4 rounded-full transition-all duration-500 ${
                    strength >= 80 ? 'bg-purple-500' :
                    strength >= 60 ? 'bg-green-500' :
                    strength >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${strength}%` }}
                />
              </div>
            </div>
          </div>

          {/* Input Section */}
          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name your pet:</label>
              <input
                type="text"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                placeholder="Enter a cute name..."
                maxLength={20}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Create a password to power up your pet:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                placeholder="Type your password..."
              />
            </div>
          </div>

          {/* Evolution Guide */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-4 flex items-center space-x-2">
              <Star className="text-yellow-500" size={20} />
              <span>Evolution Guide</span>
            </h3>
            <div className="grid grid-cols-5 gap-2 text-center text-sm">
              <div className={`p-2 rounded ${strength >= 0 ? 'bg-blue-100 dark:bg-blue-800' : 'bg-gray-100 dark:bg-gray-700'}`}>
                <div className="text-2xl mb-1">🥚</div>
                <div className="text-gray-600 dark:text-gray-300">Egg</div>
                <div className="text-xs text-gray-500">0%</div>
              </div>
              <div className={`p-2 rounded ${strength >= 20 ? 'bg-blue-100 dark:bg-blue-800' : 'bg-gray-100 dark:bg-gray-700'}`}>
                <div className="text-2xl mb-1">🐣</div>
                <div className="text-gray-600 dark:text-gray-300">Chick</div>
                <div className="text-xs text-gray-500">20%</div>
              </div>
              <div className={`p-2 rounded ${strength >= 40 ? 'bg-blue-100 dark:bg-blue-800' : 'bg-gray-100 dark:bg-gray-700'}`}>
                <div className="text-2xl mb-1">🐕</div>
                <div className="text-gray-600 dark:text-gray-300">Dog</div>
                <div className="text-xs text-gray-500">40%</div>
              </div>
              <div className={`p-2 rounded ${strength >= 60 ? 'bg-blue-100 dark:bg-blue-800' : 'bg-gray-100 dark:bg-gray-700'}`}>
                <div className="text-2xl mb-1">🦁</div>
                <div className="text-gray-600 dark:text-gray-300">Lion</div>
                <div className="text-xs text-gray-500">60%</div>
              </div>
              <div className={`p-2 rounded ${strength >= 80 ? 'bg-purple-100 dark:bg-purple-800' : 'bg-gray-100 dark:bg-gray-700'}`}>
                <div className="text-2xl mb-1">🐉</div>
                <div className="text-gray-600 dark:text-gray-300">Dragon</div>
                <div className="text-xs text-gray-500">80%</div>
              </div>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-4">
              Make your password stronger to evolve your pet! Use uppercase, lowercase, numbers, and symbols.
            </p>
          </div>

          {completed && (
            <div className="mt-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl p-6 text-center text-white">
              <div className="text-4xl mb-2">🎉 🐉 🎉</div>
              <h3 className="text-xl font-bold mb-2">Maximum Evolution!</h3>
              <p>Your pet evolved into a Dragon! Your password is super strong!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordPetCreator;

