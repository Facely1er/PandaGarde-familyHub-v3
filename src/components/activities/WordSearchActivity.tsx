import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, CheckCircle, Download } from 'lucide-react';

interface WordSearchActivityProps {
  onComplete: (score?: number) => void;
  onClose: () => void;
}

interface Word {
  text: string;
  found: boolean;
  positions: { row: number; col: number }[];
}

const WordSearchActivity: React.FC<WordSearchActivityProps> = ({ onComplete, onClose }) => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [words, setWords] = useState<Word[]>([]);
  const [selectedCells, setSelectedCells] = useState<{ row: number; col: number }[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [foundWords, setFoundWords] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);

  const gridSize = 12;

  const generateWordSearch = useCallback(() => {
    const wordList = [
      'PRIVACY', 'PASSWORD', 'SECURE', 'SAFE', 'PROTECT',
      'ONLINE', 'DIGITAL', 'DATA', 'INFORMATION', 'SECURITY'
    ];

    // Create empty grid
    const newGrid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));

    // Place words
    const newWords: Word[] = wordList.map(word => ({
      text: word,
      found: false,
      positions: []
    }));

    // Try to place each word
    newWords.forEach(word => {
      let placed = false;
      let attempts = 0;

      while (!placed && attempts < 100) {
        const direction = Math.floor(Math.random() * 8); // 8 directions
        const row = Math.floor(Math.random() * gridSize);
        const col = Math.floor(Math.random() * gridSize);

        if (canPlaceWord(newGrid, word.text, row, col, direction)) {
          placeWord(newGrid, word.text, row, col, direction, word);
          placed = true;
        }
        attempts++;
      }
    });

    // Fill remaining cells with random letters
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (newGrid[row][col] === '') {
          newGrid[row][col] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }

    setGrid(newGrid);
    setWords(newWords);
    setSelectedCells([]);
    setIsCompleted(false);
    setFoundWords(0);
  }, [gridSize]);

  useEffect(() => {
    generateWordSearch();
  }, [generateWordSearch]);

  const downloadImage = () => {
    const container = gridRef.current;
    if (!container) {return;}

    // Create a canvas to capture the word search
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
    ctx.fillText('Privacy Word Search', canvas.width / 2, 40);

    // Draw instructions
    ctx.font = '16px Arial';
    ctx.fillStyle = '#6C757D';
    ctx.fillText('Find all the privacy-related words!', canvas.width / 2, 70);

    // Draw grid
    const cellSize = 25;
    const startX = (canvas.width - gridSize * cellSize) / 2;
    const startY = 100;

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const x = startX + col * cellSize;
        const y = startY + row * cellSize;

        // Draw cell border
        ctx.strokeStyle = '#ddd';
        ctx.strokeRect(x, y, cellSize, cellSize);

        // Draw letter
        ctx.fillStyle = '#2C3E50';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(grid[row][col], x + cellSize / 2, y + cellSize / 2 + 5);
      }
    }

    // Draw word list
    ctx.fillStyle = '#2C3E50';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Words to Find:', 50, 450);

    ctx.font = '14px Arial';
    words.forEach((word, index) => {
      const x = 50 + (index % 3) * 150;
      const y = 470 + Math.floor(index / 3) * 20;
      ctx.fillStyle = word.found ? '#4CAF50' : '#6C757D';
      ctx.fillText(word.text, x, y);
    });

    // Download
    const link = document.createElement('a');
    link.download = 'privacy-word-search.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const canPlaceWord = (grid: string[][], word: string, row: number, col: number, direction: number): boolean => {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]
    ];

    const [dRow, dCol] = directions[direction];
    const endRow = row + (word.length - 1) * dRow;
    const endCol = col + (word.length - 1) * dCol;

    if (endRow < 0 || endRow >= gridSize || endCol < 0 || endCol >= gridSize) {
      return false;
    }

    for (let i = 0; i < word.length; i++) {
      const checkRow = row + i * dRow;
      const checkCol = col + i * dCol;
      if (grid[checkRow][checkCol] !== '' && grid[checkRow][checkCol] !== word[i]) {
        return false;
      }
    }

    return true;
  };

  const placeWord = (grid: string[][], word: string, row: number, col: number, direction: number, wordObj: Word) => {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]
    ];

    const [dRow, dCol] = directions[direction];
    const positions: { row: number; col: number }[] = [];

    for (let i = 0; i < word.length; i++) {
      const placeRow = row + i * dRow;
      const placeCol = col + i * dCol;
      grid[placeRow][placeCol] = word[i];
      positions.push({ row: placeRow, col: placeCol });
    }

    wordObj.positions = positions;
  };

  const handleCellClick = (row: number, col: number) => {
    if (isCompleted) {return;}

    if (selectedCells.length === 0) {
      setSelectedCells([{ row, col }]);
    } else {
      const newSelected = [...selectedCells, { row, col }];
      setSelectedCells(newSelected);

      // Check if this forms a valid word
      checkWord(newSelected);
    }
  };

  const checkWord = (selected: { row: number; col: number }[]) => {
    if (selected.length < 3) {return;}

    // Get the word from selected cells
    const word = selected
      .sort((a, b) => {
        if (a.row !== b.row) {return a.row - b.row;}
        return a.col - b.col;
      })
      .map(cell => grid[cell.row][cell.col])
      .join('');

    // Check if it matches any word (forward or backward)
    const foundWord = words.find(w =>
      !w.found && (w.text === word || w.text === word.split('').reverse().join(''))
    );

    if (foundWord) {
      // Mark word as found
      const updatedWords = words.map(w =>
        w.text === foundWord.text
          ? { ...w, found: true }
          : w
      );
      setWords(updatedWords);
      setFoundWords(prev => prev + 1);

      // Check if all words are found
      if (foundWords + 1 === words.length) {
        setIsCompleted(true);
        // Calculate score based on completion percentage
        const completionScore = Math.round(((foundWords + 1) / words.length) * 100);
        onComplete(completionScore);
      }
    }

    setSelectedCells([]);
  };

  const getCellClassName = (row: number, col: number) => {
    const isSelected = selectedCells.some(cell => cell.row === row && cell.col === col);
    const isInFoundWord = words.some(word =>
      word.found && word.positions.some(pos => pos.row === row && pos.col === col)
    );

    let className = 'word-search-cell';
    if (isSelected) {className += ' selected';}
    if (isInFoundWord) {className += ' found';}

    return className;
  };

  return (
    <div className="word-search-activity">
      <div className="activity-header">
        <h2 className="activity-title">Privacy Word Search</h2>
        <button onClick={onClose} className="close-button">×</button>
      </div>

      <div className="activity-content">
        <div className="instructions">
          <p>Find all the privacy-related words hidden in the grid! Click on letters to select them.</p>
          <div className="word-list">
            <h3>Words to Find:</h3>
            <div className="words-grid">
              {words.map((word, index) => (
                <span
                  key={index}
                  className={`word-item ${word.found ? 'found' : ''}`}
                >
                  {word.text}
                </span>
              ))}
            </div>
          </div>
          <div className="progress">
            Found: {foundWords} / {words.length} words
          </div>
        </div>

        <div className="game-container">
          <div ref={gridRef} className="word-search-grid">
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={getCellClassName(rowIndex, colIndex)}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="controls">
          <button onClick={generateWordSearch} className="control-button">
            <RotateCcw size={16} />
            New Puzzle
          </button>
          <button onClick={downloadImage} className="control-button">
            <Download size={16} />
            Download
          </button>
          <button
            onClick={() => {
              setSelectedCells([]);
            }}
            className="control-button"
          >
            Clear Selection
          </button>
        </div>

        {isCompleted && (
          <div className="completion-overlay">
            <div className="completion-message">
              <CheckCircle size={48} className="success-icon" />
              <h3>Excellent Work!</h3>
              <p>You've found all the privacy words!</p>
              <p>You now know important privacy vocabulary to stay safe online.</p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .word-search-activity {
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

        .word-list h3 {
          margin: 0 0 10px 0;
          color: #2C3E50;
          font-size: 16px;
        }

        .words-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 8px;
          margin-bottom: 15px;
        }

        .word-item {
          padding: 8px 12px;
          background: #e9ecef;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          text-align: center;
          transition: all 0.3s ease;
        }

        .word-item.found {
          background: #d4edda;
          color: #155724;
          text-decoration: line-through;
        }

        .progress {
          font-size: 16px;
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

        .word-search-grid {
          display: grid;
          grid-template-columns: repeat(${gridSize}, 1fr);
          gap: 2px;
          background: #2C3E50;
          padding: 10px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .word-search-cell {
          width: 35px;
          height: 35px;
          background: white;
          border: 1px solid #ddd;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease;
          user-select: none;
        }

        .word-search-cell:hover {
          background: #f0f0f0;
          transform: scale(1.05);
        }

        .word-search-cell.selected {
          background: #4CAF50;
          color: white;
          transform: scale(1.1);
        }

        .word-search-cell.found {
          background: #d4edda;
          color: #155724;
          border-color: #4CAF50;
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
          .word-search-cell {
            width: 28px;
            height: 28px;
            font-size: 14px;
          }

          .words-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .controls {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
};

export default WordSearchActivity;