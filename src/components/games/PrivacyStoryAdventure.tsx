import React, { useState } from 'react';
import { ArrowLeft, BookOpen, CheckCircle } from 'lucide-react';
import { useGameCompletion } from '../../utils/familyProgressIntegration';

interface PrivacyStoryAdventureProps {
  onBack: () => void;
}

const PrivacyStoryAdventure: React.FC<PrivacyStoryAdventureProps> = ({ onBack }) => {
  const [scene, setScene] = useState(0);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const { recordGameCompletion } = useGameCompletion();

  const story = [
    {
      text: "You're playing your favorite game online when a new player sends you a message: 'Hey! You're really good! Want to be friends? What's your real name and where do you live?'",
      choices: [
        { text: "Tell them your real name and city", points: 0, result: "That's not safe! Never share personal information with strangers online." },
        { text: "Just say 'Hi! Thanks! I use this username.'", points: 20, result: "Great choice! You were friendly but kept your personal info private!" },
        { text: "Ignore them completely", points: 10, result: "That's okay, but you could also be polite without sharing personal info." }
      ]
    },
    {
      text: "Your friend sends you a link to a cool new game website. The link looks a bit strange: 'free-games-win-prizes.xyz'. What do you do?",
      choices: [
        { text: "Click the link right away - your friend sent it!", points: 0, result: "Be careful! Even friends can accidentally share harmful links." },
        { text: "Ask your friend where they found it, and check with a parent", points: 20, result: "Smart! Always verify suspicious links, even from friends." },
        { text: "Click but don't enter any information", points: 5, result: "It's still risky to click unknown links - they might have viruses." }
      ]
    },
    {
      text: "A website asks you to create an account. It wants your email, password, birthday, phone number, and home address. What do you do?",
      choices: [
        { text: "Fill in everything - it's required!", points: 0, result: "Only share what's actually needed. Ask a parent to help decide." },
        { text: "Ask a parent before creating any account", points: 20, result: "Excellent! Always involve a trusted adult when creating accounts." },
        { text: "Make up fake information for everything", points: 10, result: "While this protects your info, it's better to ask a parent first." }
      ]
    },
    {
      text: "You want to post a photo of your new pet on social media. In the background, you can see your house number and street name. What do you do?",
      choices: [
        { text: "Post it anyway - it's just a cute pet photo!", points: 0, result: "Watch out! Photos can reveal personal information in the background." },
        { text: "Crop or edit the photo to remove identifying details", points: 20, result: "Perfect! You can still share while protecting your privacy." },
        { text: "Don't post any photos ever", points: 5, result: "You can share photos safely - just check what's in the background first." }
      ]
    },
    {
      text: "Someone online says they're giving away free robux/vbucks if you share your password. What do you do?",
      choices: [
        { text: "Share your password - free stuff!", points: 0, result: "Never share your password! This is a scam." },
        { text: "Ignore them and maybe report them", points: 20, result: "Great job! Free stuff requiring passwords is always a scam." },
        { text: "Share a fake password", points: 5, result: "Good instinct, but it's better to just ignore and report scammers." }
      ]
    }
  ];

  const handleChoice = (points: number) => {
    setScore(score + points);
    if (scene < story.length - 1) {
      setScene(scene + 1);
    } else {
      setCompleted(true);
      recordGameCompletion(
        'privacy-story',
        'Privacy Story Adventure',
        score + points,
        100,
        { scenesCompleted: story.length }
      );
    }
  };

  const resetGame = () => {
    setScene(0);
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
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Adventure Complete! 🎉</h1>
            <div className="text-4xl font-bold text-yellow-600 dark:text-yellow-400 mb-4">{score} points</div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {score >= 80 ? 'Amazing! You made great privacy choices!' : 
               score >= 60 ? 'Good job! You\'re learning to stay safe online!' : 
               'Keep learning! Every adventure teaches something new!'}
            </p>
            <div className="flex justify-center space-x-4">
              <button onClick={resetGame} className="bg-yellow-600 text-white px-6 py-3 rounded-lg">Play Again</button>
              <button onClick={onBack} className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-lg">Back to Hub</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentScene = story[scene];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="mb-6 flex items-center space-x-2 text-gray-600 dark:text-gray-300">
          <ArrowLeft size={20} /><span>Back to Learning Hub</span>
        </button>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="text-yellow-600 dark:text-yellow-400" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Privacy Story Adventure 📖</h1>
            <p className="text-gray-600 dark:text-gray-300">Make choices in an interactive privacy story!</p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
              <span>Scene {scene + 1}/{story.length}</span>
              <span>Score: {score}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full transition-all" style={{ width: `${((scene + 1) / story.length) * 100}%` }} />
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 mb-6">
            <p className="text-lg text-gray-800 dark:text-gray-100 leading-relaxed">{currentScene.text}</p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">What do you do?</h3>
            {currentScene.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleChoice(choice.points)}
                className="w-full text-left p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-yellow-400 dark:hover:border-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
              >
                {choice.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyStoryAdventure;

