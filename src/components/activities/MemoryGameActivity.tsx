import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { RotateCcw, CheckCircle, Brain, Clock } from 'lucide-react';

interface MemoryGameActivityProps {
  onComplete: () => void;
  onClose: () => void;
}

interface Card {
  id: string;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
  pairId: string;
}

const MemoryGameActivity: React.FC<MemoryGameActivityProps> = ({ onComplete, onClose }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const cardPairs = useMemo(() => [
    { symbol: '🔒', meaning: 'Password' },
    { symbol: '🛡️', meaning: 'Security' },
    { symbol: '👁️', meaning: 'Privacy' },
    { symbol: '🚫', meaning: 'Block' },
    { symbol: '✅', meaning: 'Safe' },
    { symbol: '⚠️', meaning: 'Warning' },
    { symbol: '🔐', meaning: 'Encrypt' },
    { symbol: '🌐', meaning: 'Internet' },
  ], []);

  const initializeCards = useCallback(() => {
    const newCards: Card[] = [];

    cardPairs.forEach((pair, index) => {
      // Add symbol card
      newCards.push({
        id: `symbol-${index}`,
        content: pair.symbol,
        isFlipped: false,
        isMatched: false,
        pairId: `pair-${index}`,
      });

      // Add meaning card
      newCards.push({
        id: `meaning-${index}`,
        content: pair.meaning,
        isFlipped: false,
        isMatched: false,
        pairId: `pair-${index}`,
      });
    });

    // Shuffle cards
    const shuffled = newCards.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCards([]);
    setIsCompleted(false);
    setMoves(0);
    setMatches(0);
    setTimeElapsed(0);
    setGameStarted(false);
  }, [cardPairs]);

  useEffect(() => {
    initializeCards();
  }, [initializeCards]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && !isCompleted) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, isCompleted]);

  const handleCardClick = (cardId: string) => {
    if (!gameStarted) {
      setGameStarted(true);
    }

    if (flippedCards.length >= 2 || cards.find(c => c.id === cardId)?.isFlipped || cards.find(c => c.id === cardId)?.isMatched) {
      return;
    }

    setCards(prev => prev.map(card =>
      card.id === cardId ? { ...card, isFlipped: true } : card
    ));

    setFlippedCards(prev => [...prev, cardId]);
  };

  const checkForMatch = useCallback(() => {
    const [firstId, secondId] = flippedCards;
    const firstCard = cards.find(c => c.id === firstId);
    const secondCard = cards.find(c => c.id === secondId);

    if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
      // Match found
      setCards(prev => prev.map(card =>
        card.id === firstId || card.id === secondId
          ? { ...card, isMatched: true }
          : card
      ));
      setMatches(prev => prev + 1);

      // Add match celebration
      setTimeout(() => {
        const celebration = document.createElement('div');
        celebration.textContent = '🎉✨';
        celebration.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 32px;
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

      if (matches + 1 === cardPairs.length) {
        setTimeout(() => {
          setIsCompleted(true);
          // Calculate score based on efficiency (fewer moves = higher score)
          const maxPossibleMoves = cardPairs.length * 2; // Worst case: flip every card twice
          const efficiency = Math.max(0, Math.round(((maxPossibleMoves - moves) / maxPossibleMoves) * 100));
          onComplete(efficiency);
        }, 500);
      }
    } else {
      // No match - flip cards back after delay
      setTimeout(() => {
        setCards(prev => prev.map(card =>
          card.id === firstId || card.id === secondId
            ? { ...card, isFlipped: false }
            : card
        ));
      }, 1000);
    }

    setFlippedCards([]);
    setMoves(prev => prev + 1);
  }, [flippedCards, cards, matches, onComplete, cardPairs.length, moves]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      checkForMatch();
    }
  }, [flippedCards, checkForMatch]);

  const getCardContent = (card: Card) => {
    if (card.isFlipped || card.isMatched) {
      return card.content;
    }
    return '?';
  };

  const getCardClassName = (card: Card) => {
    let className = 'memory-card';
    if (card.isFlipped || card.isMatched) {className += ' flipped';}
    if (card.isMatched) {className += ' matched';}
    if (card.content.length === 1) {className += ' symbol-card';}
    if (card.content.length > 1) {className += ' meaning-card';}
    return className;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="memory-game-activity">
      <div className="activity-header">
        <h2 className="activity-title">Privacy Memory Game</h2>
        <button onClick={onClose} className="close-button">×</button>
      </div>

      <div className="activity-content">
        <div className="instructions">
          <p>Match each privacy symbol with its meaning! Click on cards to flip them and find matching pairs.</p>
          <div className="stats">
            <div className="stat">
              <Brain size={16} />
              <span className="stat-label">Moves:</span>
              <span className="stat-value">{moves}</span>
            </div>
            <div className="stat">
              <CheckCircle size={16} />
              <span className="stat-label">Matches:</span>
              <span className="stat-value">{matches} / {cardPairs.length}</span>
            </div>
            <div className="stat">
              <Clock size={16} />
              <span className="stat-label">Time:</span>
              <span className="stat-value">{formatTime(timeElapsed)}</span>
            </div>
          </div>
        </div>

        <div className="game-container">
          <div className="memory-grid">
            {cards.map(card => (
              <div
                key={card.id}
                className={getCardClassName(card)}
                onClick={() => handleCardClick(card.id)}
              >
                <div className="card-content">
                  {getCardContent(card)}
                </div>
                <div className="card-back">
                  <Brain size={24} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="controls">
          <button onClick={initializeCards} className="control-button">
            <RotateCcw size={16} />
            New Game
          </button>
        </div>

        {isCompleted && (
          <div className="completion-overlay">
            <div className="completion-message">
              <CheckCircle size={48} className="success-icon" />
              <h3>Memory Master!</h3>
              <p>You've successfully matched all privacy symbols!</p>
              <p>Completed in {moves} moves and {formatTime(timeElapsed)}</p>
              <div className="achievement-badges">
                <span className="badge">🧠 Memory Master</span>
                <span className="badge">⚡ Quick Thinker</span>
                <span className="badge">🛡️ Privacy Expert</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .memory-game-activity {
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

        .instructions {
          padding: 20px;
          background: #f8f9fa;
          border-bottom: 1px solid #e0e0e0;
        }

        .instructions p {
          margin: 0 0 15px 0;
          color: #2C3E50;
          font-size: 16px;
        }

        .stats {
          display: flex;
          gap: 30px;
          flex-wrap: wrap;
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .stat-label {
          font-size: 14px;
          color: #666;
        }

        .stat-value {
          font-size: 18px;
          font-weight: bold;
          color: #4CAF50;
        }

        .game-container {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }

        .memory-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          max-width: 600px;
          width: 100%;
        }

        .memory-card {
          aspect-ratio: 1;
          position: relative;
          cursor: pointer;
          transform-style: preserve-3d;
          transition: transform 0.6s;
        }

        .memory-card.flipped {
          transform: rotateY(180deg);
        }

        .memory-card.matched {
          transform: rotateY(180deg);
          opacity: 0.7;
        }

        .card-content,
        .card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }

        .card-back {
          background: linear-gradient(135deg, #4CAF50, #45a049);
          color: white;
          transform: rotateY(180deg);
        }

        .card-content {
          background: white;
          color: #2C3E50;
          font-size: 14px;
          text-align: center;
          padding: 10px;
          border: 2px solid #e0e0e0;
        }

        .symbol-card .card-content {
          font-size: 24px;
          background: #E8F5E8;
          border-color: #4CAF50;
        }

        .meaning-card .card-content {
          background: #E3F2FD;
          border-color: #2196F3;
        }

        .memory-card:hover .card-back {
          transform: rotateY(180deg) scale(1.05);
        }

        .memory-card:hover .card-content {
          transform: scale(1.05);
        }

        .memory-card.matched .card-content {
          background: #d4edda;
          border-color: #4CAF50;
          color: #155724;
        }

        .controls {
          padding: 20px;
          background: #f8f9fa;
          border-top: 1px solid #e0e0e0;
          display: flex;
          gap: 15px;
          justify-content: center;
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

        .control-button:hover {
          background: #f0f0f0;
        }

        .completion-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10;
        }

        .completion-message {
          background: white;
          padding: 40px;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          max-width: 400px;
        }

        .success-icon {
          color: #4CAF50;
          margin-bottom: 20px;
        }

        .completion-message h3 {
          margin: 0 0 15px 0;
          color: #2C3E50;
          font-size: 24px;
        }

        .completion-message p {
          margin: 0 0 10px 0;
          color: #666;
          font-size: 16px;
        }

        .achievement-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
          margin-top: 20px;
        }

        .badge {
          background: #4CAF50;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: bold;
        }

        @media (max-width: 768px) {
          .memory-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
          }

          .card-content {
            font-size: 12px;
            padding: 8px;
          }

          .symbol-card .card-content {
            font-size: 20px;
          }

          .stats {
            flex-direction: column;
            gap: 15px;
            align-items: center;
          }

          .achievement-badges {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
};

export default MemoryGameActivity;