import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Heart, Shield, Zap, Users, Eye, Sparkles, Lock } from 'lucide-react';

interface StoryCharacterProps {
  character: 'panda' | 'turtle' | 'monkey' | 'beaver' | 'rabbit' | 'owl' | 'fox';
  emotion?: 'happy' | 'sad' | 'worried' | 'excited' | 'confused' | 'proud' | 'shy';
  animation?: 'bounce' | 'wave' | 'nod' | 'shake' | 'dance' | 'hide' | 'appear';
  size?: 'small' | 'medium' | 'large';
  isSpeaking?: boolean;
  message?: string;
  onAnimationComplete?: () => void;
}

const StoryCharacter: React.FC<StoryCharacterProps> = ({
  character,
  emotion = 'happy',
  animation,
  size = 'medium',
  isSpeaking = false,
  message,
  onAnimationComplete
}) => {
  const { theme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [isIdle, setIsIdle] = useState(true);

  const characterIcons = {
    panda: { icon: Heart, color: '#4CAF50' },
    turtle: { icon: Shield, color: '#2196F3' },
    monkey: { icon: Zap, color: '#FF9800' },
    beaver: { icon: Users, color: '#9C27B0' },
    rabbit: { icon: Eye, color: '#E91E63' },
    owl: { icon: Sparkles, color: '#FFC107' },
    fox: { icon: Lock, color: '#F44336' }
  };

  const emotionStyles = {
    happy: { filter: 'brightness(1.1) saturate(1.2)' },
    sad: { filter: 'brightness(0.85) saturate(0.7)' },
    worried: { filter: 'brightness(0.95) saturate(0.9)' },
    excited: { filter: 'brightness(1.15) saturate(1.3)' },
    confused: { filter: 'brightness(1) saturate(1.1)' },
    proud: { filter: 'brightness(1.1) saturate(1.2)' },
    shy: { filter: 'brightness(0.9) saturate(0.85)' }
  };

  const sizeStyles = {
    small: { size: 32 },
    medium: { size: 64 },
    large: { size: 96 }
  };

  const animationClasses = {
    bounce: 'bounce-animation',
    wave: 'wave-animation',
    nod: 'nod-animation',
    shake: 'shake-animation',
    dance: 'dance-animation',
    hide: 'hide-animation',
    appear: 'appear-animation'
  };

  useEffect(() => {
    if (animation) {
      setIsAnimating(true);
      setIsIdle(false);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setIsIdle(true);
        onAnimationComplete?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [animation, onAnimationComplete]);

  // Idle animation cycle
  useEffect(() => {
    if (isIdle && !isAnimating) {
      const idleTimer = setTimeout(() => {
        setAnimationPhase(prev => (prev + 1) % 4);
      }, 3000 + Math.random() * 2000); // Random interval between 3-5 seconds
      return () => clearTimeout(idleTimer);
    }
  }, [isIdle, isAnimating, animationPhase]);

  useEffect(() => {
    if (isSpeaking && message) {
      setShowMessage(true);
      const timer = setTimeout(() => setShowMessage(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSpeaking, message]);

  const characterInfo = characterIcons[character];
  const CharacterIcon = characterInfo.icon;
  const iconSize = sizeStyles[size].size;
  
  const characterStyle = {
    ...emotionStyles[emotion],
    transition: 'all 0.3s ease'
  };

  return (
    <div className="story-character-container">
      <div
        className={`character-wrapper ${isAnimating && animation ? animationClasses[animation] : ''} ${isIdle ? `idle-phase-${animationPhase}` : ''}`}
        style={characterStyle}
      >
        <div className="character-icon" style={{ color: characterInfo.color }}>
          <CharacterIcon size={iconSize} />
        </div>
        
        {isSpeaking && (
          <div className="speaking-indicator">
            <div className="speech-bubble">
              <div className="bubble-dot"></div>
              <div className="bubble-dot"></div>
              <div className="bubble-dot"></div>
            </div>
          </div>
        )}
      </div>

      {showMessage && message && (
        <div className="character-message">
          <div className="message-bubble">
            <p>{message}</p>
            <div className="message-arrow"></div>
          </div>
        </div>
      )}

      <style jsx>{`
        .story-character-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          margin: 1rem 0;
        }

        .character-wrapper {
          position: relative;
          display: inline-block;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
        }

        .character-wrapper:hover {
          transform: scale(1.1) translateY(-5px);
          filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.2)) brightness(1.1);
        }

        .character-wrapper:active {
          transform: scale(0.95);
        }

        .character-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          user-select: none;
        }

        .speaking-indicator {
          position: absolute;
          top: -10px;
          right: -10px;
        }

        .speech-bubble {
          display: flex;
          gap: 2px;
          animation: pulse 1s infinite;
        }

        .bubble-dot {
          width: 4px;
          height: 4px;
          background: var(--primary);
          border-radius: 50%;
          animation: wave 1.5s infinite;
        }

        .bubble-dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .bubble-dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        .character-message {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-top: 1rem;
          z-index: 10;
        }

        .message-bubble {
          background: ${theme === 'dark' ? 'var(--gray-800)' : 'white'};
          color: ${theme === 'dark' ? 'var(--gray-200)' : 'var(--gray-800)'};
          padding: 0.75rem 1rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          border: 2px solid var(--primary-light);
          position: relative;
          max-width: 200px;
          animation: messageAppear 0.3s ease-out;
        }

        .message-bubble p {
          margin: 0;
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .message-arrow {
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-bottom: 8px solid var(--primary-light);
        }

        .message-arrow::after {
          content: '';
          position: absolute;
          top: 2px;
          left: -6px;
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-bottom: 6px solid ${theme === 'dark' ? 'var(--gray-800)' : 'white'};
        }

        /* Animation classes */
        .bounce-animation {
          animation: bounce 0.6s ease-in-out;
        }

        .wave-animation {
          animation: wave 0.8s ease-in-out;
        }

        .nod-animation {
          animation: nod 0.5s ease-in-out;
        }

        .shake-animation {
          animation: shake 0.5s ease-in-out;
        }

        .dance-animation {
          animation: dance 1s ease-in-out;
        }

        .hide-animation {
          animation: hide 0.5s ease-in-out forwards;
        }

        .appear-animation {
          animation: appear 0.5s ease-in-out;
        }

        /* Idle animations */
        .idle-phase-0 {
          animation: idleBlink 4s ease-in-out infinite;
        }

        .idle-phase-1 {
          animation: idleSway 6s ease-in-out infinite;
        }

        .idle-phase-2 {
          animation: idleBreathe 3s ease-in-out infinite;
        }

        .idle-phase-3 {
          animation: idleLook 5s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0) scale(1);
          }
          10% {
            transform: translateY(-20px) scale(1.1);
          }
          40% {
            transform: translateY(-10px) scale(1.05);
          }
          60% {
            transform: translateY(-5px) scale(1.02);
          }
        }

        @keyframes wave {
          0%, 100% {
            transform: rotate(0deg) scale(1);
          }
          25% {
            transform: rotate(-15deg) scale(1.05);
          }
          75% {
            transform: rotate(15deg) scale(1.05);
          }
        }

        @keyframes nod {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-8px) scale(1.02);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0) scale(1);
          }
          10% {
            transform: translateX(-8px) scale(0.98);
          }
          20% {
            transform: translateX(8px) scale(0.98);
          }
          30% {
            transform: translateX(-6px) scale(0.99);
          }
          40% {
            transform: translateX(6px) scale(0.99);
          }
          50% {
            transform: translateX(-4px) scale(1);
          }
          60% {
            transform: translateX(4px) scale(1);
          }
          70% {
            transform: translateX(-2px) scale(1);
          }
          80% {
            transform: translateX(2px) scale(1);
          }
        }

        @keyframes dance {
          0%, 100% {
            transform: rotate(0deg) scale(1);
          }
          12.5% {
            transform: rotate(-8deg) scale(1.1);
          }
          25% {
            transform: rotate(0deg) scale(1.2);
          }
          37.5% {
            transform: rotate(8deg) scale(1.1);
          }
          50% {
            transform: rotate(0deg) scale(1.3);
          }
          62.5% {
            transform: rotate(-6deg) scale(1.15);
          }
          75% {
            transform: rotate(0deg) scale(1.2);
          }
          87.5% {
            transform: rotate(6deg) scale(1.1);
          }
        }

        @keyframes hide {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0);
          }
        }

        @keyframes appear {
          0% {
            opacity: 0;
            transform: scale(0);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes wave {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }

        @keyframes messageAppear {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        @keyframes idleBlink {
          0%, 85%, 100% {
            transform: scaleY(1) scaleX(1);
            filter: brightness(1);
          }
          90% {
            transform: scaleY(0.1) scaleX(1.1);
            filter: brightness(1.2);
          }
          95% {
            transform: scaleY(0.05) scaleX(1.05);
            filter: brightness(1.1);
          }
        }

        @keyframes idleSway {
          0%, 100% {
            transform: rotate(0deg) scale(1);
          }
          25% {
            transform: rotate(3deg) scale(1.02);
          }
          50% {
            transform: rotate(0deg) scale(1.05);
          }
          75% {
            transform: rotate(-3deg) scale(1.02);
          }
        }

        @keyframes idleBreathe {
          0%, 100% {
            transform: scale(1);
            filter: brightness(1);
          }
          50% {
            transform: scale(1.08);
            filter: brightness(1.1);
          }
        }

        @keyframes idleLook {
          0%, 100% {
            transform: translateX(0) scale(1);
          }
          15% {
            transform: translateX(8px) scale(1.02);
          }
          30% {
            transform: translateX(-5px) scale(0.98);
          }
          45% {
            transform: translateX(6px) scale(1.01);
          }
          60% {
            transform: translateX(-3px) scale(0.99);
          }
          75% {
            transform: translateX(4px) scale(1.01);
          }
          90% {
            transform: translateX(-2px) scale(1);
          }
        }

        @media (max-width: 768px) {
          .character-icon {
            transform: scale(0.75);
          }

          .message-bubble {
            max-width: 150px;
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default StoryCharacter;