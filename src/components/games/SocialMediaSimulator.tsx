import React, { useState } from 'react';
import { ArrowLeft, Users, CheckCircle, ThumbsUp, MessageCircle, Share } from 'lucide-react';
import { useGameCompletion } from '../../utils/familyProgressIntegration';

interface SocialMediaSimulatorProps {
  onBack: () => void;
}

const SocialMediaSimulator: React.FC<SocialMediaSimulatorProps> = ({ onBack }) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const { recordGameCompletion } = useGameCompletion();

  const scenarios = [
    {
      post: "Just got a new phone for my birthday! 📱🎉 The delivery guy was so nice!",
      image: "📦🏠",
      options: [
        { text: "Like and comment 'Happy Birthday!'", points: 20, feedback: "Great! Supporting friends without oversharing." },
        { text: "Share with comment 'My friend at [address] got one too!'", points: 0, feedback: "Never share someone's address online!" },
        { text: "Like it", points: 20, feedback: "Simple and safe!" }
      ]
    },
    {
      post: "Anyone want to meet up at the mall today? I'll be there from 3-5pm! 🛍️",
      image: "🏬⏰",
      options: [
        { text: "Comment: 'I'll be there! See you at [store name]!'", points: 10, feedback: "Be careful about sharing exact locations publicly." },
        { text: "Send a private message to ask for details", points: 20, feedback: "Perfect! Private messages are safer for meetup details." },
        { text: "Share your phone number in comments", points: 0, feedback: "Never share personal contact info publicly!" }
      ]
    },
    {
      post: "So frustrated with my parents right now 😤 They don't understand ANYTHING",
      image: "😤👨‍👩‍👧",
      options: [
        { text: "Comment: 'What happened? Tell me everything!'", points: 5, feedback: "Private family matters should stay private." },
        { text: "Send a supportive private message", points: 20, feedback: "Great choice! Keeping personal matters private while being supportive." },
        { text: "Share and add 'Same here!'", points: 0, feedback: "Family issues shouldn't be broadcast publicly." }
      ]
    },
    {
      post: "Check out my vacation photos! 🏖️✈️ (Posted while on vacation)",
      image: "🌴🧳",
      options: [
        { text: "Like and comment 'Have fun!'", points: 15, feedback: "Okay, but they've told everyone their home is empty!" },
        { text: "Send private message: 'Wait until you're home to post these!'", points: 20, feedback: "Smart advice! Posting vacation pics while away can invite burglars." },
        { text: "Share with 'Jealous! Wish I was there!'", points: 10, feedback: "You've now amplified that their home is empty." }
      ]
    },
    {
      post: "FINALLY 18! Here's my new driver's license! 🚗💳",
      image: "📋🎂",
      options: [
        { text: "Comment 'Happy Birthday! But hide that photo!'", points: 20, feedback: "Great advice! IDs contain sensitive personal information." },
        { text: "Like it", points: 10, feedback: "The post itself is unsafe - ID photos can be used for identity theft." },
        { text: "Share with 'Me too! Here's mine!'", points: 0, feedback: "Never share ID documents online!" }
      ]
    }
  ];

  const handleChoice = (points: number) => {
    setScore(score + points);
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
    } else {
      setCompleted(true);
      recordGameCompletion(
        'social-simulator',
        'Social Media Simulator',
        score + points,
        100,
        { scenariosCompleted: scenarios.length }
      );
    }
  };

  const resetGame = () => {
    setCurrentScenario(0);
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
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Simulation Complete!</h1>
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-4">{score} / 100</div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {score >= 80 ? 'Excellent! You know how to stay safe on social media!' :
               score >= 60 ? 'Good awareness! Keep learning safe social media habits.' :
               'Keep practicing! Social media safety takes time to master.'}
            </p>
            <div className="flex justify-center space-x-4">
              <button onClick={resetGame} className="bg-blue-600 text-white px-6 py-3 rounded-lg">Try Again</button>
              <button onClick={onBack} className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-lg">Back to Hub</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const scenario = scenarios[currentScenario];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="mb-6 flex items-center space-x-2 text-gray-600 dark:text-gray-300">
          <ArrowLeft size={20} /><span>Back to Learning Hub</span>
        </button>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-blue-600 dark:text-blue-400" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Social Media Simulator 🌐</h1>
            <p className="text-gray-600 dark:text-gray-300">Practice safe social media habits</p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
              <span>Post {currentScenario + 1}/{scenarios.length}</span>
              <span>Score: {score}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${((currentScenario + 1) / scenarios.length) * 100}%` }} />
            </div>
          </div>

          {/* Simulated Social Media Post */}
          <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-6 mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                F
              </div>
              <div>
                <div className="font-semibold text-gray-800 dark:text-gray-100">Friend</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Just now • 🌐 Public</div>
              </div>
            </div>
            <p className="text-gray-800 dark:text-gray-200 mb-4">{scenario.post}</p>
            <div className="text-6xl text-center py-4 bg-gray-100 dark:bg-gray-600 rounded-lg mb-4">
              {scenario.image}
            </div>
            <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-600 pt-4">
              <button className="flex items-center space-x-1 hover:text-blue-600">
                <ThumbsUp size={18} /><span>Like</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-blue-600">
                <MessageCircle size={18} /><span>Comment</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-blue-600">
                <Share size={18} /><span>Share</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">How would you respond?</h3>
            {scenario.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleChoice(option.points)}
                className="w-full text-left p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaSimulator;

