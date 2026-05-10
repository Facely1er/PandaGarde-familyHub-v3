import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Shuffle, CheckCircle, Download } from 'lucide-react';

interface DragDropActivityProps {
  onComplete: (score?: number) => void;
  onClose: () => void;
}

interface Item {
  id: string;
  text: string;
  category: 'safe' | 'private';
  x: number;
  y: number;
  isDragging: boolean;
}

const DragDropActivity: React.FC<DragDropActivityProps> = ({ onComplete, onClose }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [draggedItem, setDraggedItem] = useState<Item | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const initialItems: Omit<Item, 'x' | 'y' | 'isDragging'>[] = useMemo(() => [
    { id: '1', text: 'My full name', category: 'private' },
    { id: '2', text: 'My favorite color', category: 'safe' },
    { id: '3', text: 'My home address', category: 'private' },
    { id: '4', text: 'My pet\'s name', category: 'safe' },
    { id: '5', text: 'My phone number', category: 'private' },
    { id: '6', text: 'My favorite food', category: 'safe' },
    { id: '7', text: 'My school name', category: 'private' },
    { id: '8', text: 'My favorite game', category: 'safe' },
    { id: '9', text: 'My social security number', category: 'private' },
    { id: '10', text: 'My favorite movie', category: 'safe' },
    { id: '11', text: 'My password', category: 'private' },
    { id: '12', text: 'My favorite book', category: 'safe' },
  ], []);

  const shuffleItems = useCallback(() => {
    const shuffled = initialItems.map((item, index) => ({
      ...item,
      x: 50 + (index % 4) * 120, // Adjusted for better mobile spacing
      y: 100 + Math.floor(index / 4) * 80,
      isDragging: false,
    }));
    setItems(shuffled);
    setIsCompleted(false);
    setScore(0);
  }, [initialItems]);

  useEffect(() => {
    shuffleItems();
  }, [shuffleItems]);

  const getEventPos = (e: React.MouseEvent | React.TouchEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) {return { x: 0, y: 0 };}

    if ('touches' in e) {
      // Touch event
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left - 50,
        y: touch.clientY - rect.top - 25
      };
    } else {
      // Mouse event
      return {
        x: e.clientX - rect.left - 50,
        y: e.clientY - rect.top - 25
      };
    }
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent, item: Item) => {
    e.preventDefault();
    setDraggedItem({ ...item, isDragging: true });
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!draggedItem) {return;}

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) {return;}

    const { x, y } = getEventPos(e);

    setItems(prev => prev.map(item =>
      item.id === draggedItem.id
        ? { ...item, x: Math.max(0, Math.min(x, rect.width - 100)), y: Math.max(0, Math.min(y, rect.height - 50)) }
        : item
    ));
  };

  const handleEnd = () => {
    if (!draggedItem) {return;}

    setItems(prev => prev.map(item =>
      item.id === draggedItem.id
        ? { ...item, isDragging: false }
        : item
    ));
    setDraggedItem(null);
    checkCompletion();
  };

  const checkCompletion = () => {
    const safeZone = { x: 50, y: 300, width: 200, height: 100 };
    const privateZone = { x: 350, y: 300, width: 200, height: 100 };

    let correctPlacements = 0;
    const totalItems = items.length;

    items.forEach(item => {
      const itemCenterX = item.x + 50;
      const itemCenterY = item.y + 25;

      if (item.category === 'safe') {
        if (itemCenterX >= safeZone.x && itemCenterX <= safeZone.x + safeZone.width &&
            itemCenterY >= safeZone.y && itemCenterY <= safeZone.y + safeZone.height) {
          correctPlacements++;
        }
      } else if (item.category === 'private') {
        if (itemCenterX >= privateZone.x && itemCenterX <= privateZone.x + privateZone.width &&
            itemCenterY >= privateZone.y && itemCenterY <= privateZone.y + privateZone.height) {
          correctPlacements++;
        }
      }
    });

    const newScore = Math.round((correctPlacements / totalItems) * 100);
    setScore(newScore);

    if (correctPlacements === totalItems) {
      setIsCompleted(true);
      onComplete(newScore);
      
      // Add celebration animation
      setTimeout(() => {
        const celebration = document.createElement('div');
        celebration.textContent = '🎉✅🛡️';
        celebration.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 48px;
          z-index: 10000;
          pointer-events: none;
          animation: celebrate 2s ease-out forwards;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
          @keyframes celebrate {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
            50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(1) translateY(-100px); }
          }
        `;
        document.head.appendChild(style);
        document.body.appendChild(celebration);
        
        setTimeout(() => {
          document.body.removeChild(celebration);
          document.head.removeChild(style);
        }, 2000);
      }, 100);
    } else {
      // Show progress feedback
      const feedback = correctPlacements > 0 ? 
        `Great progress! You've correctly placed ${correctPlacements} out of ${totalItems} items. Keep going!` :
        `Try placing the items in the correct zones. Remember: Green = Safe to Share, Red = Keep Private!`;
      
      // Create a temporary feedback message
      const feedbackDiv = document.createElement('div');
      feedbackDiv.textContent = feedback;
      feedbackDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #4CAF50;
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        font-size: 16px;
        font-weight: bold;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideDown 3s ease-out forwards;
      `;
      
      const style = document.createElement('style');
      style.textContent = `
        @keyframes slideDown {
          0% { opacity: 0; transform: translateX(-50%) translateY(-50px); }
          20% { opacity: 1; transform: translateX(-50%) translateY(0); }
          80% { opacity: 1; transform: translateX(-50%) translateY(0); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-50px); }
        }
      `;
      document.head.appendChild(style);
      document.body.appendChild(feedbackDiv);
      
      setTimeout(() => {
        document.body.removeChild(feedbackDiv);
        document.head.removeChild(style);
      }, 3000);
    }
  };

  const downloadImage = () => {
    const container = containerRef.current;
    if (!container) {return;}

    // Create a canvas to capture the activity
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
    ctx.fillText('Information Sorting Game', canvas.width / 2, 40);

    // Draw instructions
    ctx.font = '16px Arial';
    ctx.fillStyle = '#6C757D';
    ctx.fillText('Safe to Share vs Keep Private', canvas.width / 2, 70);

    // Draw categories
    ctx.fillStyle = '#28A745';
    ctx.fillRect(50, 300, 200, 80);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('Safe to Share', 150, 345);

    ctx.fillStyle = '#DC3545';
    ctx.fillRect(350, 300, 200, 80);
    ctx.fillStyle = 'white';
    ctx.fillText('Keep Private', 450, 345);

    // Draw items
    ctx.fillStyle = '#2C3E50';
    ctx.font = '14px Arial';
    items.forEach(item => {
      ctx.fillStyle = item.category === 'safe' ? '#28A745' : '#DC3545';
      ctx.fillRect(item.x - 40, item.y - 15, 80, 30);
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText(item.text, item.x, item.y + 5);
    });

    // Download
    const link = document.createElement('a');
    link.download = 'privacy-sorting-game.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const getItemStyle = (item: Item) => ({
    left: `${item.x}px`,
    top: `${item.y}px`,
    zIndex: item.isDragging ? 1000 : 1,
    transform: item.isDragging ? 'scale(1.1)' : 'scale(1)',
    boxShadow: item.isDragging ? '0 8px 25px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
  });

  const getItemClassName = (item: Item) => {
    const safeZone = { x: 50, y: 300, width: 200, height: 100 };
    const privateZone = { x: 350, y: 300, width: 200, height: 100 };

    const itemCenterX = item.x + 50;
    const itemCenterY = item.y + 25;

    let isInCorrectZone = false;
    if (item.category === 'safe') {
      isInCorrectZone = itemCenterX >= safeZone.x && itemCenterX <= safeZone.x + safeZone.width &&
                       itemCenterY >= safeZone.y && itemCenterY <= safeZone.y + safeZone.height;
    } else if (item.category === 'private') {
      isInCorrectZone = itemCenterX >= privateZone.x && itemCenterX <= privateZone.x + privateZone.width &&
                        itemCenterY >= privateZone.y && itemCenterY <= privateZone.y + privateZone.height;
    }

    return `drag-item ${item.category} ${isInCorrectZone ? 'correct' : ''}`;
  };

  return (
    <div className="drag-drop-activity">
      <div className="activity-header">
        <h2 className="activity-title">Information Sorting Game</h2>
        <button onClick={onClose} className="close-button">×</button>
      </div>

      <div className="activity-content">
        <div className="instructions">
          <p>Drag each item to the correct category: <strong>Safe to Share</strong> or <strong>Keep Private</strong></p>
          <div className="score">Score: {score}%</div>
        </div>

        <div
          ref={containerRef}
          className="game-container"
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
          style={{ touchAction: 'none' }}
        >
          {/* Drop Zones */}
          <div className="drop-zone safe-zone">
            <h3>Safe to Share</h3>
            <p>Things you can tell friends</p>
          </div>

          <div className="drop-zone private-zone">
            <h3>Keep Private</h3>
            <p>Personal information to protect</p>
          </div>

          {/* Draggable Items */}
          {items.map(item => (
            <div
              key={item.id}
              className={getItemClassName(item)}
              style={getItemStyle(item)}
              onMouseDown={(e) => handleStart(e, item)}
              onTouchStart={(e) => handleStart(e, item)}
            >
              {item.text}
            </div>
          ))}
        </div>

        <div className="controls">
          <button onClick={shuffleItems} className="control-button">
            <Shuffle size={16} />
            Shuffle
          </button>
          <button onClick={downloadImage} className="control-button">
            <Download size={16} />
            Download
          </button>
          <button onClick={checkCompletion} className="control-button primary">
            <CheckCircle size={16} />
            Check Answer
          </button>
        </div>

        {isCompleted && (
          <div className="completion-overlay">
            <div className="completion-message">
              <CheckCircle size={48} className="success-icon" />
              <h3>Excellent Work!</h3>
              <p>You've correctly sorted all the information! You scored {score}%</p>
              <p>You now know what information is safe to share and what to keep private.</p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .drag-drop-activity {
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
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .instructions p {
          margin: 0;
          color: #2C3E50;
          font-size: 16px;
        }

        .score {
          font-size: 18px;
          font-weight: bold;
          color: #4CAF50;
        }

        .game-container {
          flex: 1;
          position: relative;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          overflow: hidden;
        }

        .drop-zone {
          position: absolute;
          width: 200px;
          height: 100px;
          border: 3px dashed #ccc;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          background: rgba(255, 255, 255, 0.8);
          transition: all 0.3s ease;
        }

        .safe-zone {
          top: 300px;
          left: 50px;
          border-color: #4CAF50;
          background: rgba(76, 175, 80, 0.1);
        }

        .private-zone {
          top: 300px;
          right: 50px;
          border-color: #f44336;
          background: rgba(244, 67, 54, 0.1);
        }

        .drop-zone h3 {
          margin: 0 0 5px 0;
          font-size: 16px;
          color: #2C3E50;
        }

        .drop-zone p {
          margin: 0;
          font-size: 12px;
          color: #666;
        }

        .drag-item {
          position: absolute;
          width: 100px;
          height: 50px;
          background: white;
          border: 2px solid #ddd;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: grab;
          user-select: none;
          font-size: 12px;
          font-weight: 500;
          text-align: center;
          padding: 5px;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .drag-item:hover {
          transform: scale(1.05);
        }

        .drag-item:active {
          cursor: grabbing;
        }

        .drag-item.safe {
          border-color: #4CAF50;
          background: #E8F5E8;
        }

        .drag-item.private {
          border-color: #f44336;
          background: #FFEBEE;
        }

        .drag-item.correct {
          border-color: #4CAF50;
          background: #C8E6C9;
          box-shadow: 0 0 0 2px #4CAF50;
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

        .control-button.primary {
          background: #4CAF50;
          color: white;
          border-color: #4CAF50;
        }

        .control-button.primary:hover {
          background: #45a049;
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
          .game-container {
            padding: 15px;
            min-height: 400px;
          }

          .drop-zone {
            width: 140px;
            height: 70px;
            font-size: 12px;
          }

          .safe-zone {
            left: 15px;
            top: 250px;
          }

          .private-zone {
            right: 15px;
            top: 250px;
          }

          .drag-item {
            width: 90px;
            height: 45px;
            font-size: 11px;
            padding: 8px;
            min-height: 45px;
            touch-action: none;
            user-select: none;
          }

          .controls {
            flex-direction: row;
            flex-wrap: wrap;
            gap: 10px;
            justify-content: center;
          }

          .control-button {
            flex: 1;
            min-width: 120px;
            padding: 10px 16px;
            font-size: 13px;
          }

          .instructions {
            padding: 15px;
            font-size: 14px;
          }

          .score {
            font-size: 16px;
          }
        }

        @media (max-width: 480px) {
          .game-container {
            padding: 10px;
            min-height: 350px;
          }

          .drop-zone {
            width: 120px;
            height: 60px;
            font-size: 11px;
          }

          .safe-zone {
            left: 10px;
            top: 200px;
          }

          .private-zone {
            right: 10px;
            top: 200px;
          }

          .drag-item {
            width: 80px;
            height: 40px;
            font-size: 10px;
            padding: 6px;
          }

          .controls {
            flex-direction: column;
          }

          .control-button {
            width: 100%;
            margin-bottom: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default DragDropActivity;