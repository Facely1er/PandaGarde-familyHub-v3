import React, { useState } from 'react';
import { ArrowLeft, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { useGameCompletion } from '../../utils/familyProgressIntegration';

interface PrivacyPolicyDecoderProps {
  onBack: () => void;
}

const PrivacyPolicyDecoder: React.FC<PrivacyPolicyDecoderProps> = ({ onBack }) => {
  const [currentClause, setCurrentClause] = useState(0);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const { recordGameCompletion } = useGameCompletion();

  const clauses = [
    {
      text: "We may share your personal information with third-party partners for marketing purposes.",
      translation: "Companies you don't know might get your info to send you ads.",
      concern: "high",
      options: [
        { text: "This is fine - marketing is normal", points: 0 },
        { text: "Concerning - my data goes to unknown companies", points: 20 },
        { text: "I'm not sure what this means", points: 5 }
      ]
    },
    {
      text: "We collect device identifiers, IP addresses, and browsing behavior to improve our services.",
      translation: "They track what device you use, where you are, and what you look at online.",
      concern: "medium",
      options: [
        { text: "Okay if it helps improve the service", points: 10 },
        { text: "Concerning - that's a lot of tracking", points: 20 },
        { text: "Totally fine", points: 5 }
      ]
    },
    {
      text: "Your data may be transferred to servers located in countries with different privacy laws.",
      translation: "Your info might be stored somewhere with weaker privacy protection.",
      concern: "high",
      options: [
        { text: "This sounds risky for my data", points: 20 },
        { text: "It doesn't matter where data is stored", points: 0 },
        { text: "Only concerning if I travel", points: 5 }
      ]
    },
    {
      text: "We retain your data for as long as necessary to fulfill the purposes outlined in this policy.",
      translation: "They keep your data forever, basically.",
      concern: "medium",
      options: [
        { text: "They should delete it when I'm done using the service", points: 20 },
        { text: "This seems reasonable", points: 5 },
        { text: "I trust them to delete it eventually", points: 0 }
      ]
    },
    {
      text: "By using our service, you consent to the collection and processing of your information as described herein.",
      translation: "Just by using the app, you agreed to everything in this long document.",
      concern: "high",
      options: [
        { text: "I should read before using then!", points: 20 },
        { text: "Everyone clicks agree anyway", points: 5 },
        { text: "This is standard practice", points: 10 }
      ]
    }
  ];

  const handleChoice = (points: number) => {
    setScore(score + points);
    if (currentClause < clauses.length - 1) {
      setCurrentClause(currentClause + 1);
    } else {
      setCompleted(true);
      recordGameCompletion(
        'privacy-decoder',
        'Privacy Policy Decoder',
        score + points,
        100,
        { clausesDecoded: clauses.length }
      );
    }
  };

  const resetGame = () => {
    setCurrentClause(0);
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
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Decoding Complete! 📜</h1>
            <div className="text-4xl font-bold text-red-600 dark:text-red-400 mb-4">{score} / 100</div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {score >= 80 ? 'Excellent! You can spot concerning privacy terms!' :
               score >= 60 ? 'Good awareness! Keep questioning what you read.' :
               'Keep practicing! Understanding privacy policies is important.'}
            </p>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-3">Key Takeaways:</h3>
              <ul className="space-y-2 text-yellow-700 dark:text-yellow-300 text-sm">
                <li>• Look for phrases about "sharing with third parties"</li>
                <li>• Question vague terms like "as long as necessary"</li>
                <li>• Be aware of data transfer across borders</li>
                <li>• Using a service often means automatic consent</li>
              </ul>
            </div>
            <div className="flex justify-center space-x-4">
              <button onClick={resetGame} className="bg-red-600 text-white px-6 py-3 rounded-lg">Decode Again</button>
              <button onClick={onBack} className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-lg">Back to Hub</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const clause = clauses[currentClause];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-900/20 dark:to-rose-900/20 p-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="mb-6 flex items-center space-x-2 text-gray-600 dark:text-gray-300">
          <ArrowLeft size={20} /><span>Back to Learning Hub</span>
        </button>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="text-red-600 dark:text-red-400" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Privacy Policy Decoder 📜</h1>
            <p className="text-gray-600 dark:text-gray-300">Learn to understand privacy policies in plain language</p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
              <span>Clause {currentClause + 1}/{clauses.length}</span>
              <span>Score: {score}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div className="bg-red-600 h-2 rounded-full transition-all" style={{ width: `${((currentClause + 1) / clauses.length) * 100}%` }} />
            </div>
          </div>

          {/* Policy Text */}
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 mb-6">
            <div className="flex items-start space-x-3 mb-4">
              <FileText className="text-gray-400 mt-1" size={20} />
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">From the Privacy Policy:</div>
                <p className="text-gray-800 dark:text-gray-200 italic">"{clause.text}"</p>
              </div>
            </div>
          </div>

          {/* Translation */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="text-yellow-600 dark:text-yellow-400 mt-1" size={20} />
              <div>
                <div className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-2">In Plain English:</div>
                <p className="text-yellow-700 dark:text-yellow-300">{clause.translation}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">How concerning is this?</h3>
            {clause.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleChoice(option.points)}
                className="w-full text-left p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-red-400 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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

export default PrivacyPolicyDecoder;

