import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { RotateCcw, CheckCircle, ArrowRight, ArrowLeft, Star, Clock, Pause, Play, TimerOff } from 'lucide-react';

interface QuizActivityProps {
  onComplete: () => void;
  onClose: () => void;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const QuizActivity: React.FC<QuizActivityProps> = ({ onComplete, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);
  const [timerEnabled, setTimerEnabled] = useState(true);

  const questions: Question[] = useMemo(() => [
    {
      id: '1',
      question: 'What should you do if someone online asks for your password?',
      options: ['Give it to them', 'Never share it', 'Share it with friends', 'Write it down'],
      correctAnswer: 1,
      explanation: 'Never share your password with anyone, even friends! Passwords are private and should be kept secret.',
      difficulty: 'easy'
    },
    {
      id: '2',
      question: 'Which information is safe to share online?',
      options: ['Your home address', 'Your favorite color', 'Your phone number', 'Your full name'],
      correctAnswer: 1,
      explanation: 'Your favorite color is safe to share! Personal information like addresses, phone numbers, and full names should be kept private.',
      difficulty: 'easy'
    },
    {
      id: '3',
      question: 'What does the lock symbol 🔒 mean on a website?',
      options: ['The website is broken', 'The website is secure', 'The website is slow', 'The website is old'],
      correctAnswer: 1,
      explanation: 'The lock symbol means the website is secure and your information is protected when you visit it.',
      difficulty: 'medium'
    },
    {
      id: '4',
      question: 'If you see a pop-up asking for personal information, what should you do?',
      options: ['Fill it out quickly', 'Close the pop-up', 'Ask your parents', 'Both B and C'],
      correctAnswer: 3,
      explanation: 'Always close suspicious pop-ups and ask your parents for help. Never give personal information to unknown websites.',
      difficulty: 'medium'
    },
    {
      id: '5',
      question: 'What is the best way to create a strong password?',
      options: ['Use your name', 'Use random letters and numbers', 'Use your birthday', 'Use your pet\'s name'],
      correctAnswer: 1,
      explanation: 'Strong passwords use random letters, numbers, and symbols. Avoid using personal information that others might guess.',
      difficulty: 'hard'
    },
    {
      id: '6',
      question: 'What should you do if someone online makes you feel uncomfortable?',
      options: ['Ignore them', 'Tell them to stop', 'Tell a trusted adult', 'All of the above'],
      correctAnswer: 3,
      explanation: 'If someone makes you uncomfortable online, ignore them, tell them to stop, and always tell a trusted adult like your parents or teacher.',
      difficulty: 'medium'
    }
  ], []);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) {return;}
    setSelectedAnswer(answerIndex);
  };

  const handleAnswerSubmit = useCallback(() => {
    if (selectedAnswer === null) {return;}
    
    setShowResult(true);
    
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(prev => prev + 1);
      
      // Show correct answer celebration
      setTimeout(() => {
        const celebration = document.createElement('div');
        celebration.textContent = '🎉✅';
        celebration.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 48px;
          z-index: 10000;
          pointer-events: none;
          animation: celebrate 1s ease-out forwards;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
          @keyframes celebrate {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
            50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(1) translateY(-50px); }
          }
        `;
        document.head.appendChild(style);
        document.body.appendChild(celebration);
        
        setTimeout(() => {
          document.body.removeChild(celebration);
          document.head.removeChild(style);
        }, 1000);
      }, 200);
    }

    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setTimeLeft(30);
      } else {
        setIsCompleted(true);
        // Calculate final score as percentage (including current question)
        const finalScore = Math.round(((score + (selectedAnswer === questions[currentQuestion].correctAnswer ? 1 : 0)) / questions.length) * 100);
        onComplete(finalScore);
      }
    }, 3000);
  }, [selectedAnswer, questions, currentQuestion, score, onComplete]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerEnabled && quizStarted && timeLeft > 0 && !showResult && !isCompleted && !timerPaused) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timerEnabled && timeLeft === 0 && !showResult) {
      handleAnswerSubmit();
    }
    return () => clearInterval(interval);
  }, [timeLeft, quizStarted, showResult, isCompleted, handleAnswerSubmit, timerPaused, timerEnabled]);

  const toggleTimer = () => {
    setTimerPaused(prev => !prev);
  };

  const toggleTimerEnabled = () => {
    setTimerEnabled(prev => !prev);
    if (!timerEnabled) {
      setTimeLeft(30);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(30);
    } else {
      setIsCompleted(true);
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(30);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setIsCompleted(false);
    setTimeLeft(30);
    setQuizStarted(false);
  };

  const startQuiz = () => {
    setQuizStarted(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#f44336';
      default: return '#666';
    }
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) {return 'Privacy Expert! 🌟';}
    if (percentage >= 60) {return 'Great Job! 👍';}
    if (percentage >= 40) {return 'Good Try! 💪';}
    return 'Keep Learning! 📚';
  };

  const currentQ = questions[currentQuestion];

  if (!quizStarted) {
    return (
      <div className="quiz-activity">
        <div className="activity-header">
          <h2 className="activity-title">Privacy Knowledge Quiz</h2>
          <button onClick={onClose} className="close-button">×</button>
        </div>

        <div className="quiz-intro">
          <div className="intro-content">
            <h3>🧠 Test Your Privacy Knowledge!</h3>
            <p>Answer {questions.length} questions about online privacy and safety.</p>
            <div className="quiz-info">
              <div className="info-item">
                <Clock size={20} aria-hidden="true" />
                <span>30 seconds per question (optional)</span>
              </div>
              <div className="info-item">
                <Star size={20} aria-hidden="true" />
                <span>Different difficulty levels</span>
              </div>
              <div className="info-item">
                <CheckCircle size={20} aria-hidden="true" />
                <span>Learn with explanations</span>
              </div>
            </div>

            <div className="accessibility-options">
              <h4>Accessibility Options</h4>
              <label className="timer-toggle">
                <input
                  type="checkbox"
                  checked={timerEnabled}
                  onChange={toggleTimerEnabled}
                  aria-describedby="timer-description"
                />
                <span>Enable Timer</span>
              </label>
              <p id="timer-description" className="timer-description">
                {timerEnabled 
                  ? "Timer is enabled. You can pause it during the quiz." 
                  : "Timer is disabled. Take your time answering questions."}
              </p>
            </div>

            <button onClick={startQuiz} className="start-quiz-button">
              Start Quiz
            </button>
          </div>
        </div>

        <style jsx>{`
          .quiz-activity {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            flex-direction: column;
            z-index: 1000;
          }

          .activity-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            background: white;
            border-bottom: 1px solid #e0e0e0;
          }

          .activity-title {
            margin: 0;
            color: #2C3E50;
            font-size: 24px;
          }

          .close-button {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
          }

          .quiz-intro {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          }

          .intro-content {
            background: white;
            padding: 40px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            max-width: 500px;
          }

          .intro-content h3 {
            margin: 0 0 20px 0;
            color: #2C3E50;
            font-size: 28px;
          }

          .intro-content p {
            margin: 0 0 30px 0;
            color: #666;
            font-size: 18px;
          }

          .quiz-info {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-bottom: 30px;
          }

          .info-item {
            display: flex;
            align-items: center;
            gap: 10px;
            color: #666;
            font-size: 16px;
          }

          .start-quiz-button {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 8px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.2s;
          }

          .start-quiz-button:hover {
            background: #45a049;
          }

          .accessibility-options {
            margin: 20px 0;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
            text-align: left;
          }

          .accessibility-options h4 {
            margin: 0 0 15px 0;
            color: #2C3E50;
            font-size: 16px;
          }

          .timer-toggle {
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            font-size: 16px;
            color: #2C3E50;
          }

          .timer-toggle input[type="checkbox"] {
            width: 20px;
            height: 20px;
            cursor: pointer;
          }

          .timer-description {
            margin: 10px 0 0 0;
            font-size: 14px;
            color: #666;
          }
        `}</style>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="quiz-activity">
        <div className="activity-header">
          <h2 className="activity-title">Quiz Complete!</h2>
          <button onClick={onClose} className="close-button">×</button>
        </div>

        <div className="quiz-results">
          <div className="results-content">
            <h3>{getScoreMessage()}</h3>
            <div className="score-display">
              <div className="score-circle">
                <span className="score-number">{score}</span>
                <span className="score-total">/{questions.length}</span>
              </div>
              <div className="score-percentage">
                {Math.round((score / questions.length) * 100)}%
              </div>
            </div>
            <p>You answered {score} out of {questions.length} questions correctly!</p>
            <div className="result-actions">
              <button onClick={resetQuiz} className="action-button">
                <RotateCcw size={16} />
                Try Again
              </button>
            </div>
          </div>
        </div>

        <style jsx>{`
          .quiz-activity {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            flex-direction: column;
            z-index: 1000;
          }

          .activity-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            background: white;
            border-bottom: 1px solid #e0e0e0;
          }

          .activity-title {
            margin: 0;
            color: #2C3E50;
            font-size: 24px;
          }

          .close-button {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
          }

          .quiz-results {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          }

          .results-content {
            background: white;
            padding: 40px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            max-width: 400px;
          }

          .results-content h3 {
            margin: 0 0 30px 0;
            color: #2C3E50;
            font-size: 28px;
          }

          .score-display {
            margin-bottom: 30px;
          }

          .score-circle {
            display: inline-flex;
            align-items: baseline;
            gap: 5px;
            margin-bottom: 10px;
          }

          .score-number {
            font-size: 48px;
            font-weight: bold;
            color: #4CAF50;
          }

          .score-total {
            font-size: 24px;
            color: #666;
          }

          .score-percentage {
            font-size: 24px;
            font-weight: bold;
            color: #4CAF50;
          }

          .results-content p {
            margin: 0 0 30px 0;
            color: #666;
            font-size: 16px;
          }

          .result-actions {
            display: flex;
            gap: 15px;
            justify-content: center;
          }

          .action-button {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            border: 1px solid #ddd;
            background: white;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 14px;
            font-weight: 500;
          }

          .action-button:hover {
            background: #f0f0f0;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="quiz-activity">
      <div className="activity-header">
        <h2 className="activity-title">Privacy Knowledge Quiz</h2>
        <button onClick={onClose} className="close-button">×</button>
      </div>

      <div className="activity-content">
        <div className="quiz-progress">
          <div className="progress-info">
            <span className="question-number">Question {currentQuestion + 1} of {questions.length}</span>
            {timerEnabled && (
              <div className="timer-controls">
                <button 
                  onClick={toggleTimer} 
                  className="timer-button"
                  aria-label={timerPaused ? "Resume timer" : "Pause timer"}
                  title={timerPaused ? "Resume timer" : "Pause timer"}
                >
                  {timerPaused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
                </button>
                <span className={`time-left ${timerPaused ? 'paused' : ''}`} aria-live="polite">
                  ⏰ {timeLeft}s {timerPaused && '(Paused)'}
                </span>
              </div>
            )}
            {!timerEnabled && (
              <span className="time-left disabled" aria-label="Timer disabled">
                <TimerOff size={16} aria-hidden="true" /> No time limit
              </span>
            )}
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="question-container">
          <div className="question-header">
            <span 
              className="difficulty-badge"
              style={{ backgroundColor: getDifficultyColor(currentQ.difficulty) }}
            >
              {currentQ.difficulty.toUpperCase()}
            </span>
            <h3 className="question-text">{currentQ.question}</h3>
          </div>

          <div className="options-container">
            {currentQ.options.map((option, index) => {
              let className = 'option-button';
              if (showResult) {
                if (index === currentQ.correctAnswer) {
                  className += ' correct';
                } else if (index === selectedAnswer && index !== currentQ.correctAnswer) {
                  className += ' incorrect';
                }
              } else if (selectedAnswer === index) {
                className += ' selected';
              }

              return (
                <button
                  key={index}
                  className={className}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {showResult && (
            <div className="explanation">
              <h4>💡 Explanation:</h4>
              <p>{currentQ.explanation}</p>
            </div>
          )}
        </div>

        <div className="quiz-controls">
          <button onClick={handlePrevious} disabled={currentQuestion === 0} className="control-button">
            <ArrowLeft size={16} />
            Previous
          </button>
          
          <div className="score-display">
            Score: {score} / {questions.length}
          </div>

          <button 
            onClick={handleNext} 
            disabled={currentQuestion === questions.length - 1} 
            className="control-button"
          >
            Next
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <style jsx>{`
        .quiz-activity {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          flex-direction: column;
          z-index: 1000;
        }

        .activity-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: white;
          border-bottom: 1px solid #e0e0e0;
        }

        .activity-title {
          margin: 0;
          color: #2C3E50;
          font-size: 24px;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
        }

        .activity-content {
          flex: 1;
          background: white;
          display: flex;
          flex-direction: column;
        }

        .quiz-progress {
          padding: 20px;
          background: #f8f9fa;
          border-bottom: 1px solid #e0e0e0;
        }

        .progress-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .question-number {
          font-weight: bold;
          color: #2C3E50;
        }

        .timer-controls {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .timer-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          padding: 0;
          border: 1px solid #ddd;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .timer-button:hover {
          background: #f0f0f0;
          border-color: #4CAF50;
        }

        .timer-button:focus {
          outline: 2px solid #4CAF50;
          outline-offset: 2px;
        }

        .time-left {
          color: #f44336;
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .time-left.paused {
          color: #FF9800;
        }

        .time-left.disabled {
          color: #666;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #4CAF50;
          transition: width 0.3s ease;
        }

        .question-container {
          flex: 1;
          padding: 30px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .question-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .difficulty-badge {
          display: inline-block;
          padding: 5px 15px;
          border-radius: 20px;
          color: white;
          font-size: 12px;
          font-weight: bold;
          margin-bottom: 15px;
        }

        .question-text {
          margin: 0;
          color: #2C3E50;
          font-size: 24px;
          line-height: 1.4;
        }

        .options-container {
          display: grid;
          gap: 15px;
          margin-bottom: 30px;
        }

        .option-button {
          padding: 20px;
          border: 2px solid #e0e0e0;
          background: white;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 16px;
          text-align: left;
        }

        .option-button:hover:not(:disabled) {
          border-color: #4CAF50;
          background: #f8f9fa;
        }

        .option-button.selected {
          border-color: #4CAF50;
          background: #E8F5E8;
        }

        .option-button.correct {
          border-color: #4CAF50;
          background: #d4edda;
          color: #155724;
        }

        .option-button.incorrect {
          border-color: #f44336;
          background: #f8d7da;
          color: #721c24;
        }

        .option-button:disabled {
          cursor: not-allowed;
        }

        .explanation {
          background: #E3F2FD;
          border: 1px solid #2196F3;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .explanation h4 {
          margin: 0 0 10px 0;
          color: #1976D2;
        }

        .explanation p {
          margin: 0;
          color: #1976D2;
          line-height: 1.5;
        }

        .quiz-controls {
          padding: 20px;
          background: #f8f9fa;
          border-top: 1px solid #e0e0e0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .control-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
          font-weight: 500;
        }

        .control-button:hover:not(:disabled) {
          background: #f0f0f0;
        }

        .control-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .score-display {
          font-size: 18px;
          font-weight: bold;
          color: #4CAF50;
        }

        @media (max-width: 768px) {
          .question-text {
            font-size: 20px;
          }

          .option-button {
            padding: 15px;
            font-size: 14px;
          }

          .quiz-controls {
            flex-direction: column;
            gap: 15px;
          }

          .progress-info {
            flex-direction: column;
            gap: 10px;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default QuizActivity;