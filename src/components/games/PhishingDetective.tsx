import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useGameCompletion } from '../../utils/familyProgressIntegration';

interface PhishingDetectiveProps {
  onBack: () => void;
}

const PhishingDetective: React.FC<PhishingDetectiveProps> = ({ onBack }) => {
  const [currentEmail, setCurrentEmail] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userAnswer, setUserAnswer] = useState<boolean | null>(null);
  const [progressRecorded, setProgressRecorded] = useState(false);
  const { recordGameCompletion } = useGameCompletion();

  const emails = [
    {
      id: 1,
      from: "security@paypal.com",
      subject: "Urgent: Verify Your Account Now",
      content: "Dear Customer,\n\nYour PayPal account has been temporarily suspended due to suspicious activity. Click here immediately to verify your account: http://paypal-security-check.net/verify\n\nFailure to verify within 24 hours will result in permanent account closure.\n\nPayPal Security Team",
      isPhishing: true,
      redFlags: [
        "Urgent language and threats",
        "Suspicious URL (not paypal.com)",
        "Generic greeting 'Dear Customer'",
        "Pressure to act quickly",
        "Threatening consequences"
      ],
      explanation: "This is a phishing email. Real PayPal emails come from @paypal.com domains, use your actual name, and don't threaten immediate account closure."
    },
    {
      id: 2,
      from: "notifications@github.com",
      subject: "New pull request on your repository",
      content: "Hi Sarah,\n\nJohn Smith has opened a new pull request on your repository 'privacy-tools'.\n\nPull Request: Add password strength checker\n\nView on GitHub: https://github.com/sarah/privacy-tools/pull/42\n\nBest regards,\nGitHub Team",
      isPhishing: false,
      redFlags: [],
      explanation: "This appears to be a legitimate GitHub notification. It uses your real name, comes from the official GitHub domain, and the URL matches the expected GitHub format."
    },
    {
      id: 3,
      from: "winner@lottery-international.com",
      subject: "CONGRATULATIONS! You've Won $1,000,000!",
      content: "DEAR LUCKY WINNER,\n\nCONGRATULATIONS! Your email has been selected in our international lottery draw. You have won $1,000,000 USD!\n\nTo claim your prize, please send us:\n- Full name\n- Phone number\n- Bank account details\n- Copy of ID\n\nContact our claims agent immediately: claims@lottery-winner.net\n\nMr. Johnson Williams\nLottery Claims Department",
      isPhishing: true,
      redFlags: [
        "Too good to be true offer",
        "Requests personal/financial information",
        "ALL CAPS text",
        "Suspicious email domain",
        "You didn't enter any lottery",
        "Generic greeting"
      ],
      explanation: "Classic lottery scam. Legitimate lotteries don't contact winners by email, and you can't win a lottery you didn't enter."
    },
    {
      id: 4,
      from: "team@slack.com",
      subject: "Your Slack workspace invitation",
      content: "Hi there,\n\nYou've been invited to join the 'TechCorp Team' Slack workspace by admin@techcorp.com.\n\nJoin workspace: https://techcorp.slack.com/signup/invite/abc123\n\nIf you don't want to join this workspace, you can ignore this email.\n\nThe Slack Team",
      isPhishing: false,
      redFlags: [],
      explanation: "This appears legitimate. It's from the official Slack domain, uses proper Slack URL format, and gives you the option to ignore if unwanted."
    },
    {
      id: 5,
      from: "support@amazon-security.net",
      subject: "Suspicious Login Detected",
      content: "Hello,\n\nWe detected a suspicious login to your Amazon account from Russia. If this wasn't you, please verify your account immediately.\n\nClick here to secure your account: http://amazon-verify.net/security\n\nEnter your username, password, and credit card information to confirm your identity.\n\nAmazon Security",
      isPhishing: true,
      redFlags: [
        "Fake Amazon domain (.net instead of .com)",
        "Suspicious URL not from amazon.com",
        "Asks for password and credit card info",
        "Creates false urgency",
        "Generic greeting"
      ],
      explanation: "Phishing attempt. Real Amazon security emails come from @amazon.com, never ask for passwords in emails, and use secure account pages."
    }
  ];

  const handleAnswer = (isPhishing: boolean) => {
    setUserAnswer(isPhishing);
    setShowResult(true);
    
    const correct = isPhishing === emails[currentEmail].isPhishing;
    if (correct) {
      setScore(score + 20);
    }
  };

  const nextEmail = () => {
    setShowResult(false);
    setUserAnswer(null);
    if (currentEmail < emails.length - 1) {
      setCurrentEmail(currentEmail + 1);
    }
  };

  // Record progress when game completes
  useEffect(() => {
    const isGameComplete = currentEmail === emails.length - 1 && showResult;
    if (isGameComplete && !progressRecorded) {
      const finalScore = Math.round((score / (emails.length * 20)) * 100);
      recordGameCompletion(
        'phishing-detective',
        'Phishing Detective',
        finalScore,
        100,
        { emailsCompleted: emails.length, totalScore: score }
      );
      setProgressRecorded(true);
    }
  }, [currentEmail, showResult, progressRecorded, score, emails.length, recordGameCompletion]);

  const resetGame = () => {
    setCurrentEmail(0);
    setScore(0);
    setShowResult(false);
    setUserAnswer(null);
    setProgressRecorded(false);
  };

  const email = emails[currentEmail];
  const isGameComplete = currentEmail === emails.length - 1 && showResult;
  const isCorrect = userAnswer === email.isPhishing;

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
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-orange-600 dark:text-orange-400" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Phishing Detective</h1>
            <p className="text-gray-600 dark:text-gray-300">Identify phishing emails and protect yourself from scams</p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{score}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{currentEmail + 1}/{emails.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Email</div>
              </div>
            </div>
          </div>

          {!showResult ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Email Display */}
              <div className="lg:col-span-2">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                    <div className="border-b border-gray-200 dark:border-gray-600 pb-4 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">From:</span>
                        <span className="text-sm text-gray-900 dark:text-gray-100">{email.from}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject:</span>
                        <span className="text-sm text-gray-900 dark:text-gray-100 font-medium">{email.subject}</span>
                      </div>
                    </div>
                    
                    <div className="whitespace-pre-line text-gray-800 dark:text-gray-200 leading-relaxed">
                      {email.content}
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                    Is this email legitimate or phishing?
                  </h3>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => handleAnswer(false)}
                      className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                    >
                      <CheckCircle size={20} />
                      <span>Legitimate</span>
                    </button>
                    <button
                      onClick={() => handleAnswer(true)}
                      className="bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                    >
                      <XCircle size={20} />
                      <span>Phishing</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Tips Panel */}
              <div className="space-y-6">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-3">🔍 What to Look For</h3>
                  <ul className="space-y-2 text-yellow-700 dark:text-yellow-300 text-sm">
                    <li>• Check the sender's email address carefully</li>
                    <li>• Look for urgent language or threats</li>
                    <li>• Hover over links to see real destinations</li>
                    <li>• Watch for spelling and grammar errors</li>
                    <li>• Be suspicious of unexpected prizes or offers</li>
                    <li>• Verify requests for personal information</li>
                  </ul>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">🛡️ Safety Tips</h3>
                  <ul className="space-y-2 text-blue-700 dark:text-blue-300 text-sm">
                    <li>• Never click suspicious links</li>
                    <li>• Don't download unexpected attachments</li>
                    <li>• Verify requests through official channels</li>
                    <li>• Use two-factor authentication</li>
                    <li>• Keep software updated</li>
                    <li>• Trust your instincts</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className={`border rounded-lg p-6 mb-6 ${
                isCorrect ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              }`}>
                <div className="flex items-center space-x-3 mb-4">
                  {isCorrect ? (
                    <CheckCircle className="text-green-600 dark:text-green-400" size={32} />
                  ) : (
                    <XCircle className="text-red-600 dark:text-red-400" size={32} />
                  )}
                  <h3 className={`text-xl font-bold ${
                    isCorrect ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                  }`}>
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </h3>
                </div>
                
                <p className={`mb-4 ${
                  isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                }`}>
                  {email.explanation}
                </p>

                {email.isPhishing && email.redFlags.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">🚩 Red Flags in This Email:</h4>
                    <ul className="space-y-1">
                      {email.redFlags.map((flag, index) => (
                        <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start space-x-2">
                          <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={14} />
                          <span>{flag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="text-center">
                {!isGameComplete ? (
                  <button
                    onClick={nextEmail}
                    className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Next Email
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Game Complete!</h3>
                      <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                        Final Score: {score} out of {emails.length * 20} points
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {score >= 80 ? 'Excellent! You\'re a phishing detection expert!' :
                         score >= 60 ? 'Good job! Keep practicing to improve your skills.' :
                         'Keep learning! Phishing detection takes practice.'}
                      </p>
                    </div>
                    
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={resetGame}
                        className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
                      >
                        Play Again
                      </button>
                      <button
                        onClick={onBack}
                        className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                      >
                        Back to Hub
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhishingDetective;

