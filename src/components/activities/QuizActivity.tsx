import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  Clock,
  Sparkles,
  Play,
} from 'lucide-react';
import ActivityGameShell, { shellBtn, shellBtnPrimary } from './ActivityGameShell';
import ActivityPurposeBanner, { type ActivityContext } from './ActivityPurposeBanner';

interface QuizActivityProps {
  onComplete: (score?: number) => void;
  onClose: () => void;
  context?: ActivityContext;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const QuizActivity: React.FC<QuizActivityProps> = ({ onComplete, onClose, context }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timerEnabled, setTimerEnabled] = useState(true);

  const questions: Question[] = useMemo(
    () => [
      {
        id: '1',
        question: 'What should you do if someone online asks for your password?',
        options: ['Give it to them', 'Never share it', 'Share it with friends', 'Write it down'],
        correctAnswer: 1,
        explanation: 'Never share your password with anyone, even friends! Passwords are private.',
        difficulty: 'easy',
      },
      {
        id: '2',
        question: 'Which information is safe to share online?',
        options: ['Your home address', 'Your favorite color', 'Your phone number', 'Your full name'],
        correctAnswer: 1,
        explanation: 'Your favorite color is safe to share! Addresses, phone numbers, and full names stay private.',
        difficulty: 'easy',
      },
      {
        id: '3',
        question: 'What does the lock symbol on a website mean?',
        options: ['The website is broken', 'The website is secure', 'The website is slow', 'The website is old'],
        correctAnswer: 1,
        explanation: 'The lock means the connection is secure and your information is better protected.',
        difficulty: 'medium',
      },
      {
        id: '4',
        question: 'A pop-up asks for personal information. What should you do?',
        options: ['Fill it out quickly', 'Close the pop-up', 'Ask your parents', 'Both close it and ask a parent'],
        correctAnswer: 3,
        explanation: 'Close suspicious pop-ups and ask a trusted adult for help.',
        difficulty: 'medium',
      },
      {
        id: '5',
        question: 'What makes a strong password?',
        options: ['Your name', 'Random letters and numbers', 'Your birthday', "Your pet's name"],
        correctAnswer: 1,
        explanation: 'Strong passwords use random letters, numbers, and symbols — not personal facts others can guess.',
        difficulty: 'hard',
      },
      {
        id: '6',
        question: 'Someone online makes you uncomfortable. What should you do?',
        options: ['Ignore them', 'Tell them to stop', 'Tell a trusted adult', 'All of the above'],
        correctAnswer: 3,
        explanation: 'Ignore, tell them to stop, and always tell a trusted adult.',
        difficulty: 'medium',
      },
    ],
    []
  );

  const currentQ = questions[currentQuestion];
  const finalScorePct = Math.round((score / questions.length) * 100);

  const handleAnswerSubmit = useCallback(() => {
    if (selectedAnswer === null) {return;}
    setShowResult(true);
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore((prev) => prev + 1);
    }
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setTimeLeft(30);
      } else {
        const correct = score + (selectedAnswer === questions[currentQuestion].correctAnswer ? 1 : 0);
        setScore(correct);
        setIsCompleted(true);
        onComplete(Math.round((correct / questions.length) * 100));
      }
    }, 2200);
  }, [selectedAnswer, questions, currentQuestion, score, onComplete]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (timerEnabled && quizStarted && timeLeft > 0 && !showResult && !isCompleted) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timerEnabled && timeLeft === 0 && !showResult && quizStarted) {
      handleAnswerSubmit();
    }
    return () => {
      if (interval) {clearInterval(interval);}
    };
  }, [timeLeft, quizStarted, showResult, isCompleted, handleAnswerSubmit, timerEnabled]);

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setIsCompleted(false);
    setTimeLeft(30);
    setQuizStarted(false);
  };

  const difficultyClass = (d: string) => {
    if (d === 'easy') {return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200';}
    if (d === 'medium') {return 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200';}
    return 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200';
  };

  if (!quizStarted) {
    return (
      <ActivityGameShell
        titleId="quiz-title"
        title="Privacy Quiz"
        subtitle="Test what you know — learn from every answer."
        titleIcon={<HelpCircle className="h-5 w-5" aria-hidden="true" />}
        onClose={onClose}
        headerGradient="from-sky-600 to-blue-500"
        maxWidthClass="max-w-lg"
        footer={
          <button type="button" onClick={() => setQuizStarted(true)} className={shellBtnPrimary}>
            <Play className="h-4 w-4" aria-hidden="true" />
            Start quiz
          </button>
        }
      >
        {context && <ActivityPurposeBanner context={context} />}
        <div className="space-y-4 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {questions.length} questions about passwords, sharing, and staying safe online.
          </p>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={timerEnabled}
              onChange={(e) => setTimerEnabled(e.target.checked)}
              className="rounded border-gray-300 text-sky-600"
            />
            30-second timer per question (optional)
          </label>
        </div>
      </ActivityGameShell>
    );
  }

  return (
    <ActivityGameShell
      titleId="quiz-title"
      title="Privacy Quiz"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      titleIcon={<HelpCircle className="h-5 w-5" aria-hidden="true" />}
      onClose={onClose}
      progressPercent={((currentQuestion + (showResult ? 1 : 0)) / questions.length) * 100}
      progressLeft={`${score} correct so far`}
      progressRight={timerEnabled ? `${timeLeft}s` : 'No timer'}
      headerGradient="from-sky-600 to-blue-500"
      maxWidthClass="max-w-xl"
      footer={
        !isCompleted ? (
          <>
            <button
              type="button"
              onClick={() => {
                if (currentQuestion > 0) {
                  setCurrentQuestion((p) => p - 1);
                  setSelectedAnswer(null);
                  setShowResult(false);
                  setTimeLeft(30);
                }
              }}
              disabled={currentQuestion === 0}
              className={shellBtn}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back
            </button>
            {!showResult ? (
              <button
                type="button"
                onClick={handleAnswerSubmit}
                disabled={selectedAnswer === null}
                className={shellBtnPrimary}
              >
                Check answer
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : (
              <span className="text-sm text-gray-500 dark:text-gray-400">Next question…</span>
            )}
          </>
        ) : undefined
      }
      completed={
        isCompleted
          ? {
              title: finalScorePct >= 80 ? 'Privacy expert!' : 'Nice effort!',
              message: `You got ${score} of ${questions.length} right (${finalScorePct}%).`,
              submessage: 'Every explanation helps your family stay safer online.',
              onPlayAgain: resetQuiz,
              onDone: onClose,
              icon: <Sparkles className="h-8 w-8 text-sky-500 dark:text-sky-400" aria-hidden="true" />,
            }
          : undefined
      }
    >
      {context && <ActivityPurposeBanner context={context} />}

      <div className="mb-4 flex items-center gap-2">
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ${difficultyClass(currentQ.difficulty)}`}>
          {currentQ.difficulty}
        </span>
        {timerEnabled && (
          <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {timeLeft}s left
          </span>
        )}
      </div>

      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">{currentQ.question}</h3>

      <div className="space-y-2">
        {currentQ.options.map((option, index) => {
          let cls =
            'w-full rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-colors ';
          if (showResult) {
            if (index === currentQ.correctAnswer) {
              cls += 'border-green-500 bg-green-50 text-green-900 dark:bg-green-950/40 dark:text-green-100';
            } else if (index === selectedAnswer) {
              cls += 'border-rose-500 bg-rose-50 text-rose-900 dark:bg-rose-950/40 dark:text-rose-100';
            } else {
              cls += 'border-gray-200 bg-white text-gray-600 opacity-60 dark:border-gray-700 dark:bg-gray-800';
            }
          } else if (selectedAnswer === index) {
            cls += 'border-sky-500 bg-sky-50 text-sky-900 dark:border-sky-400 dark:bg-sky-950/40 dark:text-sky-100';
          } else {
            cls += 'border-gray-200 bg-white text-gray-800 hover:border-sky-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100';
          }
          return (
            <button
              key={option}
              type="button"
              disabled={showResult}
              onClick={() => setSelectedAnswer(index)}
              className={cls}
            >
              {option}
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className="mt-4 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-100">
          <p className="font-semibold">Why:</p>
          <p className="mt-1">{currentQ.explanation}</p>
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <button type="button" onClick={resetQuiz} className={`${shellBtn} text-xs`}>
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Restart quiz
        </button>
      </div>
    </ActivityGameShell>
  );
};

export default QuizActivity;
