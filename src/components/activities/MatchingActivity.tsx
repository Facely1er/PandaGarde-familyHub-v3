import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { RotateCcw, CheckCircle, Eye, Download } from 'lucide-react';

interface MatchingActivityProps {
  onComplete: () => void;
  onClose: () => void;
}

interface Card {
  id: string;
  content: string;
  type: 'symbol' | 'meaning';
  pairId: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MatchingActivity: React.FC<MatchingActivityProps> = ({ onComplete, onClose }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);

  const cardPairs = useMemo(() => [
    { symbol: '🔒', meaning: 'Password Protection' },
    { symbol: '🛡️', meaning: 'Security Shield' },
    { symbol: '👁️', meaning: 'Privacy Settings' },
    { symbol: '🚫', meaning: 'Block/Deny Access' },
    { symbol: '✅', meaning: 'Safe/Approved' },
    { symbol: '⚠️', meaning: 'Warning/Alert' },
    { symbol: '🔐', meaning: 'Encryption' },
    { symbol: '🌐', meaning: 'Internet/Online' },
  ], []);

  const initializeCards = useCallback(() => {
    const newCards: Card[] = [];

    cardPairs.forEach((pair, index) => {
      // Add symbol card
      newCards.push({
        id: `symbol-${index}`,
        content: pair.symbol,
        type: 'symbol',
        pairId: `pair-${index}`,
        isFlipped: false,
        isMatched: false,
      });

      // Add meaning card
      newCards.push({
        id: `meaning-${index}`,
        content: pair.meaning,
        type: 'meaning',
        pairId: `pair-${index}`,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle cards
    const shuffled = newCards.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCards([]);
    setIsCompleted(false);
    setMoves(0);
    setMatches(0);
  }, [cardPairs]);

  const downloadImage = () => {
    // Create a canvas to capture the matching game
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {return;}

    // Set canvas size
    canvas.width = 600;
    canvas.height = 500;

    // Draw background
    ctx.fillStyle = '#F8F9FA';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw title
    ctx.fillStyle = '#2C3E50';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Privacy Symbol Matching', canvas.width / 2, 40);

    // Draw instructions
    ctx.font = '16px Arial';
    ctx.fillStyle = '#6C757D';
    ctx.fillText('Match symbols with their meanings!', canvas.width / 2, 70);

    // Draw cards in a grid
    const cardWidth = 80;
    const cardHeight = 60;
    const spacing = 20;
    const startX = (canvas.width - (4 * cardWidth + 3 * spacing)) / 2;
    const startY = 120;

    cards.forEach((card, index) => {
      const row = Math.floor(index / 4);
      const col = index % 4;
      const x = startX + col * (cardWidth + spacing);
      const y = startY + row * (cardHeight + spacing);

      // Draw card background
      ctx.fillStyle = card.isMatched ? '#4CAF50' : '#FFFFFF';
      ctx.fillRect(x, y, cardWidth, cardHeight);

      // Draw card border
      ctx.strokeStyle = card.isMatched ? '#4CAF50' : '#DDD';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, cardWidth, cardHeight);

      // Draw card content
      ctx.fillStyle = card.isMatched ? '#FFFFFF' : '#2C3E50';
      ctx.font = card.type === 'symbol' ? '24px Arial' : '12px Arial';
      ctx.textAlign = 'center';
      
      if (card.type === 'symbol') {
        ctx.fillText(card.content, x + cardWidth / 2, y + cardHeight / 2 + 8);
      } else {
        // Wrap text for meanings
        const words = card.content.split(' ');
        const lines = [];
        let currentLine = '';
        
        for (const word of words) {
          const testLine = currentLine + (currentLine ? ' ' : '') + word;
          const metrics = ctx.measureText(testLine);
          if (metrics.width > cardWidth - 10) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }
        lines.push(currentLine);
        
        lines.forEach((line, lineIndex) => {
          ctx.fillText(line, x + cardWidth / 2, y + cardHeight / 2 + (lineIndex - lines.length / 2) * 12);
        });
      }
    });

    // Draw stats
    ctx.fillStyle = '#2C3E50';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Moves: ${moves}`, 50, 450);
    ctx.fillText(`Matches: ${matches}/${cardPairs.length}`, 50, 470);

    // Download
    const link = document.createElement('a');
    link.download = 'privacy-symbol-matching.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleCardClick = (cardId: string) => {
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
    initializeCards();
  }, [initializeCards]);

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
    let className = 'matching-card';
    if (card.isFlipped || card.isMatched) {className += ' flipped';}
    if (card.isMatched) {className += ' matched';}
    if (card.type === 'symbol') {className += ' symbol-card';}
    if (card.type === 'meaning') {className += ' meaning-card';}
    return className;
  };

  return (
    <div className="matching-activity">
      <div className="activity-header">
        <h2 className="activity-title">Privacy Symbol Matching</h2>
        <button onClick={onClose} className="close-button">×</button>
      </div>

      <div className="activity-content">
        <div className="instructions">
          <p>Match each privacy symbol with its correct meaning! Click on cards to flip them.</p>
          <div className="stats">
            <div className="stat">
              <span className="stat-label">Moves:</span>
              <span className="stat-value">{moves}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Matches:</span>
              <span className="stat-value">{matches} / {cardPairs.length}</span>
            </div>
          </div>
        </div>

        <div className="game-container">
          <div className="matching-grid">
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
                  <Eye size={24} />
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
          <button onClick={downloadImage} className="control-button">
            <Download size={16} />
            Download
          </button>
        </div>

        {isCompleted && (
          <div className="completion-overlay">
            <div className="completion-message">
              <CheckCircle size={48} className="success-icon" />
              <h3>Perfect Matching!</h3>
              <p>You've successfully matched all privacy symbols with their meanings!</p>
              <p>You completed the game in {moves} moves. Great job!</p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .matching-activity {
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
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-label {
          font-size: 14px;
          color: #666;
          margin-bottom: 5px;
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

        .matching-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          max-width: 600px;
          width: 100%;
        }

        .matching-card {
          aspect-ratio: 1;
          position: relative;
          cursor: pointer;
          transform-style: preserve-3d;
          transition: transform 0.6s;
        }

        .matching-card.flipped {
          transform: rotateY(180deg);
        }

        .matching-card.matched {
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

        .matching-card:hover .card-back {
          transform: rotateY(180deg) scale(1.05);
        }

        .matching-card:hover .card-content {
          transform: scale(1.05);
        }

        .matching-card.matched .card-content {
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

        @media (max-width: 768px) {
          .matching-grid {
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
        }
      `}</style>
    </div>
  );
};

export default MatchingActivity;