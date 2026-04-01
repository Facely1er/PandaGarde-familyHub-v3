import React, { useRef, useEffect, useState, useCallback } from 'react';
import { RotateCcw, CheckCircle, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Download } from 'lucide-react';

interface MazeActivityProps {
  onComplete: () => void;
  onClose: () => void;
}

interface Position {
  x: number;
  y: number;
}

const MazeActivity: React.FC<MazeActivityProps> = ({ onComplete, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playerPos, setPlayerPos] = useState<Position>({ x: 1, y: 1 });
  const [isCompleted, setIsCompleted] = useState(false);
  const [maze, setMaze] = useState<number[][]>([]);
  const [mazeSize] = useState({ width: 15, height: 15 });
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);

  // Maze: 0 = path, 1 = wall, 2 = start, 3 = end
  const generateMaze = useCallback(() => {
    const newMaze = Array(mazeSize.height).fill(null).map(() => Array(mazeSize.width).fill(1));

    // Create a simple maze pattern
    for (let y = 1; y < mazeSize.height - 1; y += 2) {
      for (let x = 1; x < mazeSize.width - 1; x += 2) {
        newMaze[y][x] = 0; // Create paths
        if (x + 1 < mazeSize.width - 1) {newMaze[y][x + 1] = 0;}
        if (y + 1 < mazeSize.height - 1) {newMaze[y + 1][x] = 0;}
      }
    }

    // Add some random walls
    for (let i = 0; i < 20; i++) {
      const x = Math.floor(Math.random() * (mazeSize.width - 2)) + 1;
      const y = Math.floor(Math.random() * (mazeSize.height - 2)) + 1;
      if (newMaze[y][x] === 0) {
        newMaze[y][x] = 1;
      }
    }

    // Set start and end positions
    newMaze[1][1] = 2; // Start
    newMaze[mazeSize.height - 2][mazeSize.width - 2] = 3; // End

    return newMaze;
  }, [mazeSize]);

  const drawMaze = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {return;}

    const ctx = canvas.getContext('2d');
    if (!ctx) {return;}

    const cellSize = 30;
    canvas.width = mazeSize.width * cellSize;
    canvas.height = mazeSize.height * cellSize;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw maze
    for (let y = 0; y < mazeSize.height; y++) {
      for (let x = 0; x < mazeSize.width; x++) {
        const cellX = x * cellSize;
        const cellY = y * cellSize;

        switch (maze[y][x]) {
          case 0: // Path
            ctx.fillStyle = '#f8f9fa';
            break;
          case 1: // Wall
            ctx.fillStyle = '#2C3E50';
            break;
          case 2: // Start
            ctx.fillStyle = '#4CAF50';
            break;
          case 3: // End
            ctx.fillStyle = '#FF6B6B';
            break;
        }

        ctx.fillRect(cellX, cellY, cellSize, cellSize);
        ctx.strokeRect(cellX, cellY, cellSize, cellSize);
      }
    }

    // Draw player
    const playerX = playerPos.x * cellSize + cellSize / 2;
    const playerY = playerPos.y * cellSize + cellSize / 2;

    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(playerX, playerY, cellSize / 3, 0, 2 * Math.PI);
    ctx.fill();

    // Draw player eyes
    ctx.fillStyle = '#2C3E50';
    ctx.beginPath();
    ctx.arc(playerX - 5, playerY - 3, 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(playerX + 5, playerY - 3, 2, 0, 2 * Math.PI);
    ctx.fill();
  }, [maze, playerPos, mazeSize]);

  useEffect(() => {
    const newMaze = generateMaze();
    setMaze(newMaze);
    setPlayerPos({ x: 1, y: 1 });
    setIsCompleted(false);
    setMoves(0);
    setStartTime(new Date());
  }, [generateMaze]);

  useEffect(() => {
    if (maze.length === 0) {return;}
    drawMaze();
  }, [maze, playerPos, drawMaze]);

  const movePlayer = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (isCompleted) {return;}

    let newX = playerPos.x;
    let newY = playerPos.y;

    switch (direction) {
      case 'up':
        newY = Math.max(0, playerPos.y - 1);
        break;
      case 'down':
        newY = Math.min(mazeSize.height - 1, playerPos.y + 1);
        break;
      case 'left':
        newX = Math.max(0, playerPos.x - 1);
        break;
      case 'right':
        newX = Math.min(mazeSize.width - 1, playerPos.x + 1);
        break;
    }

    // Check if the new position is valid (not a wall)
    if (maze[newY] && maze[newY][newX] !== 1) {
      setPlayerPos({ x: newX, y: newY });
      setMoves(prev => prev + 1);

      // Check if reached the end
      if (maze[newY][newX] === 3) {
        setIsCompleted(true);
        // Calculate score based on efficiency (fewer moves = higher score)
        const timeSpent = startTime ? Math.round((Date.now() - startTime.getTime()) / 1000) : 0;
        const maxPossibleMoves = mazeSize.width * mazeSize.height; // Theoretical maximum
        const efficiency = Math.max(0, Math.round(((maxPossibleMoves - moves) / maxPossibleMoves) * 100));
        const timeBonus = Math.max(0, Math.round((300 - timeSpent) / 300 * 50)); // Bonus for speed
        const finalScore = Math.min(100, efficiency + timeBonus);
        onComplete(finalScore);
      }
    }
  }, [playerPos, maze, isCompleted, onComplete, mazeSize, moves, startTime]);

  const resetMaze = () => {
    const newMaze = generateMaze();
    setMaze(newMaze);
    setPlayerPos({ x: 1, y: 1 });
    setIsCompleted(false);
    setMoves(0);
    setStartTime(new Date());
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) {return;}

    const link = document.createElement('a');
    link.download = 'privacy-maze-game.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        e.preventDefault();
        movePlayer('up');
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        e.preventDefault();
        movePlayer('down');
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        e.preventDefault();
        movePlayer('left');
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        e.preventDefault();
        movePlayer('right');
        break;
    }
  }, [movePlayer]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div className="maze-activity">
      <div className="activity-header">
        <h2 className="activity-title">Safe Online Journey Maze</h2>
        <button onClick={onClose} className="close-button">×</button>
      </div>

      <div className="activity-content">
        <div className="instructions">
          <p>Help Privacy Panda navigate through the digital world safely! Use arrow keys or buttons to move.</p>
          <div className="legend" role="list" aria-label="Maze legend">
            <div className="legend-item" role="listitem">
              <div className="legend-color start" aria-hidden="true"></div>
              <span>Start - Green (Safe Zone)</span>
            </div>
            <div className="legend-item" role="listitem">
              <div className="legend-color end" aria-hidden="true"></div>
              <span>End - Red (Privacy Goal)</span>
            </div>
            <div className="legend-item" role="listitem">
              <div className="legend-color wall" aria-hidden="true"></div>
              <span>Walls - Dark (Avoid)</span>
            </div>
            <div className="legend-item" role="listitem">
              <div className="legend-color path" aria-hidden="true"></div>
              <span>Path - Light Gray (Safe to walk)</span>
            </div>
          </div>
        </div>

        <div className="maze-container">
          <canvas 
            ref={canvasRef} 
            className="maze-canvas"
            role="img"
            aria-label={`Privacy Panda maze game. Navigate from the green start zone to the red goal. Current position: row ${playerPos.y + 1}, column ${playerPos.x + 1}. Moves made: ${moves}. ${isCompleted ? 'Maze completed!' : 'Use arrow keys or WASD to move.'}`}
            tabIndex={0}
          />
          {/* Screen reader announcements */}
          <div 
            role="status" 
            aria-live="polite" 
            className="sr-only"
          >
            {isCompleted ? 'Congratulations! You completed the maze!' : `Current position: row ${playerPos.y + 1}, column ${playerPos.x + 1}. Moves: ${moves}`}
          </div>

          {isCompleted && (
            <div className="completion-overlay">
              <div className="completion-message">
                <CheckCircle size={48} className="success-icon" />
                <h3>Congratulations!</h3>
                <p>You've successfully navigated Privacy Panda to safety!</p>
                <p>You've learned how to avoid digital dangers and protect your privacy.</p>
              </div>
            </div>
          )}
        </div>

        <div className="controls">
          <div className="movement-controls">
            <button
              onClick={() => movePlayer('up')}
              className="control-button movement"
              disabled={isCompleted}
            >
              <ArrowUp size={20} />
            </button>
            <div className="horizontal-controls">
              <button
                onClick={() => movePlayer('left')}
                className="control-button movement"
                disabled={isCompleted}
              >
                <ArrowLeft size={20} />
              </button>
              <button
                onClick={() => movePlayer('right')}
                className="control-button movement"
                disabled={isCompleted}
              >
                <ArrowRight size={20} />
              </button>
            </div>
            <button
              onClick={() => movePlayer('down')}
              className="control-button movement"
              disabled={isCompleted}
            >
              <ArrowDown size={20} />
            </button>
          </div>

          <button onClick={resetMaze} className="control-button">
            <RotateCcw size={16} />
            Reset Maze
          </button>
          <button onClick={downloadImage} className="control-button">
            <Download size={16} />
            Download
          </button>
        </div>
      </div>

      <style jsx>{`
        .maze-activity {
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

        .legend {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #666;
        }

        .legend-color {
          width: 20px;
          height: 20px;
          border-radius: 4px;
          border: 1px solid #ccc;
        }

        .legend-color.start {
          background: #4CAF50;
        }

        .legend-color.end {
          background: #FF6B6B;
        }

        .legend-color.wall {
          background: #2C3E50;
        }

        .legend-color.path {
          background: #f8f9fa;
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        .maze-container {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          position: relative;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }

        .maze-canvas {
          border: 2px solid #ddd;
          border-radius: 8px;
          background: white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
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

        .controls {
          padding: 20px;
          background: #f8f9fa;
          border-top: 1px solid #e0e0e0;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
        }

        .movement-controls {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
        }

        .horizontal-controls {
          display: flex;
          gap: 5px;
        }

        .control-button {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
          font-weight: 500;
          min-width: 50px;
          min-height: 50px;
        }

        .control-button:hover:not(:disabled) {
          background: #f0f0f0;
        }

        .control-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .control-button.movement {
          background: #4CAF50;
          color: white;
          border-color: #4CAF50;
        }

        .control-button.movement:hover:not(:disabled) {
          background: #45a049;
        }

        @media (max-width: 768px) {
          .maze-container {
            padding: 10px;
          }

          .maze-canvas {
            max-width: 100%;
            height: auto;
          }

          .controls {
            flex-direction: column;
            gap: 15px;
          }

          .legend {
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default MazeActivity;