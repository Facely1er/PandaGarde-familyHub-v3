import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface Choice {
  id: string;
  text: string;
  description?: string;
  consequence?: string;
  nextScene: string;
  icon?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  points?: number;
}

interface StoryChoicesProps {
  choices: Choice[];
  onChoiceSelect: (choice: Choice) => void;
  selectedChoice?: string | null;
  isDisabled?: boolean;
  showConsequences?: boolean;
  showPoints?: boolean;
}

const StoryChoices: React.FC<StoryChoicesProps> = ({
  choices,
  onChoiceSelect,
  selectedChoice,
  isDisabled = false,
  showConsequences = true,
  showPoints = true
}) => {
  const { theme } = useTheme();
  const [hoveredChoice, setHoveredChoice] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [showConsequence, setShowConsequence] = useState(false);

  const difficultyColors = {
    easy: '#4CAF50',
    medium: '#FF9800',
    hard: '#F44336'
  };

  const difficultyIcons = {
    easy: '⭐',
    medium: '⭐⭐',
    hard: '⭐⭐⭐'
  };

  const handleChoiceClick = (choice: Choice) => {
    if (isDisabled) {return;}
    
    setSelectedChoiceId(choice.id);
    setShowFeedback(true);
    
    // Show consequence if available
    if (choice.consequence) {
      setShowConsequence(true);
      setTimeout(() => setShowConsequence(false), 3000);
    }
    
    // Call the parent handler
    onChoiceSelect(choice);
    
    // Reset feedback after delay
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedChoiceId(null);
    }, 2000);
  };

  const getChoiceStyle = (choice: Choice) => {
    const isSelected = selectedChoice === choice.id || selectedChoiceId === choice.id;
    const isHovered = hoveredChoice === choice.id;
    const isRecentlySelected = selectedChoiceId === choice.id;
    
    return {
      background: isSelected 
        ? 'var(--primary)' 
        : isHovered 
          ? 'var(--primary-light)' 
          : theme === 'dark' 
            ? 'var(--gray-700)' 
            : 'white',
      color: isSelected || isHovered 
        ? 'white' 
        : theme === 'dark' 
          ? 'var(--gray-200)' 
          : 'var(--gray-800)',
      borderColor: isSelected 
        ? 'var(--primary)' 
        : difficultyColors[choice.difficulty || 'easy'],
      transform: isHovered && !isDisabled 
        ? 'translateY(-4px) scale(1.02)' 
        : isRecentlySelected
          ? 'translateY(-2px) scale(1.05)'
          : 'translateY(0) scale(1)',
      boxShadow: isHovered && !isDisabled 
        ? '0 8px 25px rgba(0, 0, 0, 0.15)' 
        : isRecentlySelected
          ? '0 6px 20px rgba(0, 0, 0, 0.2)'
          : '0 2px 8px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    };
  };

  return (
    <div className="story-choices-container">
      <div className="choices-header">
        <h3>What should happen next?</h3>
        {showPoints && (
          <div className="points-info">
            <span className="points-icon">🏆</span>
            <span>Make wise choices to earn points!</span>
          </div>
        )}
      </div>

      <div className="choices-grid">
        {choices.map((choice) => (
          <div
            key={choice.id}
            className={`choice-card ${selectedChoice === choice.id ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
            style={getChoiceStyle(choice)}
            onClick={() => handleChoiceClick(choice)}
            onMouseEnter={() => setHoveredChoice(choice.id)}
            onMouseLeave={() => setHoveredChoice(null)}
          >
            <div className="choice-header">
              {choice.icon && (
                <span className="choice-icon">{choice.icon}</span>
              )}
              <div className="choice-difficulty">
                {choice.difficulty && (
                  <span 
                    className="difficulty-badge"
                    style={{ backgroundColor: difficultyColors[choice.difficulty] }}
                  >
                    {difficultyIcons[choice.difficulty]}
                  </span>
                )}
                {choice.points && (
                  <span className="points-badge">+{choice.points}</span>
                )}
              </div>
            </div>

            <div className="choice-content">
              <h4 className="choice-text">{choice.text}</h4>
              {choice.description && (
                <p className="choice-description">{choice.description}</p>
              )}
            </div>

            {showConsequences && choice.consequence && (
              <div className="choice-consequence">
                <span className="consequence-label">Result:</span>
                <span className="consequence-text">{choice.consequence}</span>
              </div>
            )}

            <div className="choice-footer">
              <div className="choice-indicator">
                {selectedChoice === choice.id ? (
                  <span className="selected-indicator">✓</span>
                ) : (
                  <span className="unselected-indicator">→</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showFeedback && selectedChoiceId && (
        <div className="choice-feedback">
          <div className="feedback-message">
            <span className="feedback-icon">✨</span>
            <span>Great choice! Let's see what happens next...</span>
          </div>
        </div>
      )}

      {showConsequence && selectedChoiceId && (
        <div className="consequence-display">
          <div className="consequence-message">
            <span className="consequence-icon">💭</span>
            <span>This choice will have consequences...</span>
          </div>
        </div>
      )}

      <style jsx>{`
        .story-choices-container {
          margin: 2rem 0;
          padding: 1.5rem;
          background: ${theme === 'dark' ? 'var(--gray-800)' : 'var(--light)'};
          border-radius: 12px;
          border: 1px solid ${theme === 'dark' ? 'var(--gray-600)' : 'var(--gray-200)'};
        }

        .choices-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .choices-header h3 {
          font-size: 1.5rem;
          font-weight: bold;
          color: var(--primary);
          margin-bottom: 0.5rem;
        }

        .points-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: ${theme === 'dark' ? 'var(--gray-300)' : 'var(--gray-600)'};
          font-size: 0.9rem;
        }

        .points-icon {
          font-size: 1.2rem;
        }

        .choices-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1rem;
        }

        .choice-card {
          background: ${theme === 'dark' ? 'var(--gray-700)' : 'white'};
          border: 2px solid var(--primary-light);
          border-radius: 12px;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .choice-card:hover:not(.disabled) {
          cursor: pointer;
        }

        .choice-card.disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .choice-card.selected {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
          transform: scale(1.02);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }

        .choice-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .choice-icon {
          font-size: 1.5rem;
        }

        .choice-difficulty {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .difficulty-badge {
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: bold;
        }

        .points-badge {
          background: var(--warning);
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: bold;
        }

        .choice-content {
          margin-bottom: 1rem;
        }

        .choice-text {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }

        .choice-description {
          font-size: 0.9rem;
          opacity: 0.8;
          line-height: 1.5;
          margin: 0;
        }

        .choice-consequence {
          background: rgba(0, 0, 0, 0.1);
          padding: 0.75rem;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .consequence-label {
          font-weight: bold;
          font-size: 0.8rem;
          text-transform: uppercase;
          opacity: 0.7;
        }

        .consequence-text {
          display: block;
          font-size: 0.9rem;
          margin-top: 0.25rem;
          font-style: italic;
        }

        .choice-footer {
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }

        .choice-indicator {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .selected-indicator {
          color: white;
          font-size: 1.2rem;
        }

        .unselected-indicator {
          color: ${theme === 'dark' ? 'var(--gray-400)' : 'var(--gray-500)'};
          font-size: 1rem;
        }

        .choice-feedback {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1000;
          animation: feedbackAppear 0.5s ease-out;
        }

        .feedback-message {
          background: var(--primary);
          color: white;
          padding: 1rem 2rem;
          border-radius: 25px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
        }

        .feedback-icon {
          font-size: 1.2rem;
        }

        .consequence-display {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1000;
          animation: consequenceAppear 0.5s ease-out;
        }

        .consequence-message {
          background: var(--warning);
          color: white;
          padding: 1rem 2rem;
          border-radius: 25px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
        }

        .consequence-icon {
          font-size: 1.2rem;
        }

        @keyframes consequenceAppear {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        @keyframes feedbackAppear {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        @media (max-width: 768px) {
          .choices-grid {
            grid-template-columns: 1fr;
          }

          .choice-card {
            padding: 1rem;
          }

          .choice-text {
            font-size: 1rem;
          }

          .feedback-message {
            padding: 0.75rem 1.5rem;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};

export default StoryChoices;