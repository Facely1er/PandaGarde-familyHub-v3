import React, { useEffect, useState } from 'react';
import { Clock, Play, Pause, RotateCcw } from 'lucide-react';

interface LearningTimerProps {
  duration: number; // in seconds
  onComplete?: () => void;
  onTick?: (timeRemaining: number) => void;
  showControls?: boolean;
  className?: string;
  autoStart?: boolean;
}

export const LearningTimer: React.FC<LearningTimerProps> = ({
  duration,
  onComplete,
  onTick,
  showControls = true,
  className = '',
  autoStart = false
}) => {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isActive, setIsActive] = useState(autoStart);
  const [isPaused, setIsPaused] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && !isPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => {
          const newTime = time - 1;
          onTick?.(newTime);
          
          if (newTime === 0) {
            setIsActive(false);
            onComplete?.();
          }
          
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) {clearInterval(interval);}
    };
  }, [isActive, isPaused, timeRemaining, onComplete, onTick]);

  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get timer color based on remaining time
  const getTimerColor = (): string => {
    const percentage = (timeRemaining / duration) * 100;
    if (percentage > 50) {return 'text-green-600 dark:text-green-400';}
    if (percentage > 25) {return 'text-yellow-600 dark:text-yellow-400';}
    return 'text-red-600 dark:text-red-400';
  };

  // Get progress bar color
  const getProgressColor = (): string => {
    const percentage = (timeRemaining / duration) * 100;
    if (percentage > 50) {return 'bg-green-500';}
    if (percentage > 25) {return 'bg-yellow-500';}
    return 'bg-red-500';
  };

  const handlePlayPause = () => {
    if (isActive && !isPaused) {
      setIsPaused(true);
    } else if (isPaused) {
      setIsPaused(false);
    } else {
      setIsActive(true);
      setIsPaused(false);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeRemaining(duration);
  };

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
          <Clock size={16} />
          <span className="text-sm font-medium">Learning Timer</span>
        </div>
        {!isActive && timeRemaining === duration && (
          <button
            onClick={handleStart}
            className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Play size={14} />
            <span>Start</span>
          </button>
        )}
      </div>

      <div className="text-center">
        <div className={`text-2xl font-mono font-bold ${getTimerColor()}`}>
          {formatTime(timeRemaining)}
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
          <div 
            className={`h-2 rounded-full transition-all duration-1000 ${getProgressColor()}`}
            style={{ 
              width: `${(timeRemaining / duration) * 100}%` 
            }}
          />
        </div>
      </div>

      {/* Controls */}
      {showControls && isActive && (
        <div className="flex items-center justify-center space-x-4 mt-4">
          <button
            onClick={handlePlayPause}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            {isPaused ? (
              <>
                <Play size={16} />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Pause size={16} />
                <span>Pause</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="flex items-center space-x-2 px-4 py-2 border-2 border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
        </div>
      )}

      {/* Status indicator */}
      <div className="text-center mt-3">
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {isActive && !isPaused && (
            <span className="text-green-600 dark:text-green-400">⏱️ Timer Running</span>
          )}
          {isPaused && (
            <span className="text-yellow-600 dark:text-yellow-400">⏸️ Timer Paused</span>
          )}
          {!isActive && timeRemaining > 0 && timeRemaining < duration && (
            <span className="text-gray-600 dark:text-gray-300">⏹️ Timer Stopped</span>
          )}
          {timeRemaining === 0 && (
            <span className="text-red-600 dark:text-red-400">⏰ Time's Up!</span>
          )}
        </span>
      </div>
    </div>
  );
};

export default LearningTimer;

