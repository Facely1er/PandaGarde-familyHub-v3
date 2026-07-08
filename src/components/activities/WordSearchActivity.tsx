import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Search, Sparkles } from 'lucide-react';
import ActivityGameShell, { shellBtn } from './ActivityGameShell';
import ActivityPurposeBanner, { type ActivityContext } from './ActivityPurposeBanner';

interface WordSearchActivityProps {
  onComplete: (score?: number) => void;
  onClose: () => void;
  context?: ActivityContext;
}

interface Word {
  text: string;
  found: boolean;
  positions: { row: number; col: number }[];
}

const GRID_SIZE = 12;

const WordSearchActivity: React.FC<WordSearchActivityProps> = ({ onComplete, onClose, context }) => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [words, setWords] = useState<Word[]>([]);
  const [selectedCells, setSelectedCells] = useState<{ row: number; col: number }[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [foundWords, setFoundWords] = useState(0);
  const [score, setScore] = useState(0);

  const canPlaceWord = (g: string[][], word: string, row: number, col: number, direction: number): boolean => {
    const directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
    const [dRow, dCol] = directions[direction];
    const endRow = row + (word.length - 1) * dRow;
    const endCol = col + (word.length - 1) * dCol;
    if (endRow < 0 || endRow >= GRID_SIZE || endCol < 0 || endCol >= GRID_SIZE) {return false;}
    for (let i = 0; i < word.length; i++) {
      const checkRow = row + i * dRow;
      const checkCol = col + i * dCol;
      if (g[checkRow][checkCol] !== '' && g[checkRow][checkCol] !== word[i]) {return false;}
    }
    return true;
  };

  const placeWord = (
    g: string[][],
    word: string,
    row: number,
    col: number,
    direction: number,
    wordObj: Word
  ) => {
    const directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
    const [dRow, dCol] = directions[direction];
    const positions: { row: number; col: number }[] = [];
    for (let i = 0; i < word.length; i++) {
      const placeRow = row + i * dRow;
      const placeCol = col + i * dCol;
      g[placeRow][placeCol] = word[i];
      positions.push({ row: placeRow, col: placeCol });
    }
    wordObj.positions = positions;
  };

  const generateWordSearch = useCallback(() => {
    const wordList = ['PRIVACY', 'PASSWORD', 'SECURE', 'SAFE', 'PROTECT', 'ONLINE', 'DIGITAL', 'DATA'];
    const newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));
    const newWords: Word[] = wordList.map((text) => ({ text, found: false, positions: [] }));

    newWords.forEach((word) => {
      let placed = false;
      let attempts = 0;
      while (!placed && attempts < 100) {
        const direction = Math.floor(Math.random() * 8);
        const row = Math.floor(Math.random() * GRID_SIZE);
        const col = Math.floor(Math.random() * GRID_SIZE);
        if (canPlaceWord(newGrid, word.text, row, col, direction)) {
          placeWord(newGrid, word.text, row, col, direction, word);
          placed = true;
        }
        attempts++;
      }
    });

    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
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
    setScore(0);
  }, []);

  useEffect(() => {
    generateWordSearch();
  }, [generateWordSearch]);

  const checkWord = (selected: { row: number; col: number }[]) => {
    if (selected.length < 3) {return;}
    const word = selected
      .sort((a, b) => (a.row !== b.row ? a.row - b.row : a.col - b.col))
      .map((cell) => grid[cell.row][cell.col])
      .join('');
    const foundWord = words.find(
      (w) => !w.found && (w.text === word || w.text === word.split('').reverse().join(''))
    );
    if (foundWord) {
      const updatedWords = words.map((w) => (w.text === foundWord.text ? { ...w, found: true } : w));
      const newFound = foundWords + 1;
      setWords(updatedWords);
      setFoundWords(newFound);
      if (newFound === words.length) {
        const finalScore = Math.round((newFound / words.length) * 100);
        setScore(finalScore);
        setIsCompleted(true);
        onComplete(finalScore);
      }
    }
    setSelectedCells([]);
  };

  const handleCellClick = (row: number, col: number) => {
    if (isCompleted) {return;}
    if (selectedCells.length === 0) {
      setSelectedCells([{ row, col }]);
    } else {
      checkWord([...selectedCells, { row, col }]);
    }
  };

  const cellClasses = (row: number, col: number) => {
    const isSelected = selectedCells.some((c) => c.row === row && c.col === col);
    const isFound = words.some(
      (w) => w.found && w.positions.some((p) => p.row === row && p.col === col)
    );
    if (isFound) {return 'bg-emerald-500 text-white shadow-sm';}
    if (isSelected) {return 'bg-amber-400 text-gray-900 ring-2 ring-amber-500';}
    return 'bg-white text-gray-800 hover:bg-emerald-50 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700';
  };

  const total = words.length;

  return (
    <ActivityGameShell
      titleId="wordsearch-title"
      title="Privacy Word Search"
      subtitle="Find the hidden privacy words in the grid."
      titleIcon={<Search className="h-5 w-5" aria-hidden="true" />}
      onClose={onClose}
      progressPercent={total ? (foundWords / total) * 100 : 0}
      progressLeft={`${foundWords} of ${total} words found`}
      progressRight={isCompleted ? `Score: ${score}%` : 'Tap letters in order'}
      headerGradient="from-violet-600 to-purple-500"
      maxWidthClass="max-w-lg"
      footer={
        <>
          <button type="button" onClick={generateWordSearch} className={shellBtn}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            New puzzle
          </button>
          <button type="button" onClick={() => setSelectedCells([])} className={shellBtn}>
            Clear selection
          </button>
        </>
      }
      completed={
        isCompleted
          ? {
              title: 'All words found!',
              message: `You spotted every privacy word and scored ${score}%.`,
              submessage: 'These words help you talk about staying safe online.',
              onPlayAgain: generateWordSearch,
              onDone: onClose,
              icon: <Sparkles className="h-8 w-8 text-violet-500 dark:text-violet-400" aria-hidden="true" />,
            }
          : undefined
      }
    >
      {context && <ActivityPurposeBanner context={context} />}

      <div className="mb-4 flex flex-wrap justify-center gap-2">
        {words.map((word) => (
          <span
            key={word.text}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              word.found
                ? 'bg-emerald-100 text-emerald-800 line-through dark:bg-emerald-900/50 dark:text-emerald-200'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            {word.text}
          </span>
        ))}
      </div>

      <div className="flex justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 p-3 dark:from-gray-800 dark:to-gray-950">
        <div
          className="inline-grid gap-0.5 sm:gap-1"
          style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
          role="grid"
          aria-label="Word search letter grid"
        >
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                type="button"
                onClick={() => handleCellClick(rowIndex, colIndex)}
                className={`flex h-7 w-7 items-center justify-center rounded text-[10px] font-bold transition-colors sm:h-8 sm:w-8 sm:text-xs ${cellClasses(
                  rowIndex,
                  colIndex
                )}`}
                aria-label={`Letter ${cell} row ${rowIndex + 1} column ${colIndex + 1}`}
              >
                {cell}
              </button>
            ))
          )}
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
        Tap letters one by one to spell a word from the list above.
      </p>
    </ActivityGameShell>
  );
};

export default WordSearchActivity;
