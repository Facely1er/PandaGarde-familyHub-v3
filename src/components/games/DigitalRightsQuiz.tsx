import React, { useState, useEffect } from 'react';
import { ArrowLeft, Scale, CheckCircle, XCircle } from 'lucide-react';
import { useGameCompletion } from '../../utils/familyProgressIntegration';

interface DigitalRightsQuizProps {
  onBack: () => void;
}

const DigitalRightsQuiz: React.FC<DigitalRightsQuizProps> = ({ onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [progressRecorded, setProgressRecorded] = useState(false);
  const { recordGameCompletion } = useGameCompletion();

  const questions = [
    {
      question: "What is the right to be forgotten?",
      options: [
        "The right to delete your social media accounts",
        "The right to request removal of personal data from search results",
        "The right to forget your passwords",
        "The right to ignore privacy policies"
      ],
      correct: 1,
      explanation: "The right to be forgotten allows individuals to request removal of personal information from search engine results and databases under certain circumstances."
    },
    {
      question: "Under GDPR, what must companies do before collecting your data?",
      options: [
        "Pay you for your data",
        "Get explicit consent and explain how data will be used",
        "Only collect data on weekdays",
        "Ask your parents first"
      ],
      correct: 1,
      explanation: "GDPR requires companies to obtain clear, explicit consent and provide transparent information about data collection and usage."
    },
    {
      question: "What is data portability?",
      options: [
        "The ability to move your data between services",
        "Using portable devices for data storage",
        "Carrying data in your pocket",
        "Data that works on mobile phones"
      ],
      correct: 0,
      explanation: "Data portability is your right to obtain and reuse your personal data across different services, allowing you to move data between platforms."
    },
    {
      question: "If a company has a data breach, what should they do?",
      options: [
        "Hide it from customers",
        "Only tell the government",
        "Notify affected users within a reasonable time",
        "Wait until someone asks"
      ],
      correct: 2,
      explanation: "Companies are legally required to notify affected users about data breaches in a timely manner, usually within 72 hours under GDPR."
    },
    {
      question: "What does 'consent' mean in privacy law?",
      options: [
        "Agreeing to anything a company asks",
        "Freely given, specific, informed agreement",
        "Clicking 'OK' on any popup",
        "Being over 18 years old"
      ],
      correct: 1,
      explanation: "Legal consent must be freely given, specific to the purpose, informed (you understand what you're agreeing to), and can be withdrawn at any time."
    },
    {
      question: "What rights do you have regarding automated decision-making?",
      options: [
        "No rights - computers decide everything",
        "The right to human review and explanation",
        "The right to make all decisions yourself",
        "The right to use only manual processes"
      ],
      correct: 1,
      explanation: "You have the right not to be subject to automated decision-making and can request human review of decisions that significantly affect you."
    }
  ];

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    return answers.reduce((score, answer, index) => {
      return score + (answer === questions[index].correct ? 1 : 0);
    }, 0);
  };

  // Record progress when quiz completes
  useEffect(() => {
    if (showResults && !progressRecorded && answers.length === questions.length) {
      const score = calculateScore();
      const percentage = Math.round((score / questions.length) * 100);
      recordGameCompletion(
        'digital-rights',
        'Digital Rights Quiz',
        percentage,
        100,
        { correctAnswers: score, totalQuestions: questions.length }
      );
      setProgressRecorded(true);
    }
  }, [showResults, progressRecorded, answers.length, questions.length, recordGameCompletion]);

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setProgressRecorded(false);
  };

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);

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

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Scale className="text-purple-600 dark:text-purple-400" size={32} />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Quiz Results</h1>
              <p className="text-gray-600 dark:text-gray-300">Your Digital Rights Knowledge</p>
            </div>

            <div className="text-center mb-8">
              <div className={`text-6xl font-bold mb-4 ${
                percentage >= 80 ? 'text-green-600 dark:text-green-400' : 
                percentage >= 60 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {percentage}%
              </div>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-2">
                You got {score} out of {questions.length} questions correct
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {percentage >= 80 ? 'Excellent knowledge of digital rights!' : 
                 percentage >= 60 ? 'Good understanding, keep learning!' : 'Consider reviewing digital rights concepts'}
              </p>
            </div>

            <div className="space-y-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Review Your Answers</h2>
              {questions.map((question, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {answers[index] === question.correct ? (
                        <CheckCircle className="text-green-500" size={24} />
                      ) : (
                        <XCircle className="text-red-500" size={24} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                        Question {index + 1}: {question.question}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        Your answer: {question.options[answers[index]]}
                      </p>
                      {answers[index] !== question.correct && (
                        <p className="text-sm text-green-600 dark:text-green-400 mb-2">
                          Correct answer: {question.options[question.correct]}
                        </p>
                      )}
                      <p className="text-sm text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                        {question.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={resetQuiz}
                className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors mr-4"
              >
                Take Quiz Again
              </button>
              <button
                onClick={onBack}
                className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-8 py-3 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              >
                Back to Hub
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

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

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Scale className="text-purple-600 dark:text-purple-400" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Digital Rights Quiz</h1>
            <p className="text-gray-600 dark:text-gray-300">Test your knowledge of digital privacy rights</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 mb-8">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">{question.question}</h2>
              
              <div className="space-y-4">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className="w-full text-left p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-500 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {String.fromCharCode(65 + index)}
                        </span>
                      </div>
                      <span className="text-gray-800 dark:text-gray-200">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">💡 Did You Know?</h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Digital rights vary by country and region. The EU's GDPR provides some of the strongest 
                privacy protections, while other regions are developing their own privacy laws.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalRightsQuiz;

