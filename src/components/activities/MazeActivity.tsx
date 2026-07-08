import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  RotateCcw,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  X,
  Trophy,
  Footprints,
  MapPin,
} from 'lucide-react';
import ActivityPurposeBanner, { type ActivityContext } from './ActivityPurposeBanner';

interface MazeActivityProps {
  onComplete: (score?: number) => void;
  onClose: () => void;
  context?: ActivityContext;
}

interface Position {
  x: number;
  y: number;
}

const MAZE_SIZE = { width: 15, height: 15 };
const CELL = 30;

const MazeActivity: React.FC<MazeActivityProps> = ({ onComplete, onClose, context }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const [playerPos, setPlayerPos] = useState<Position>({ x: 1, y: 1 });
  const [isCompleted, setIsCompleted] = useState(false);
  const [maze, setMaze] = useState<number[][]>([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);

  // Maze: 0 = path, 1 = wall, 2 = start, 3 = end
  const generateMaze = useCallback(() => {
    const newMaze = Array(MAZE_SIZE.height)
      .fill(null)
      .map(() => Array(MAZE_SIZE.width).fill(1));

    for (let y = 1; y < MAZE_SIZE.height - 1; y += 2) {
      for (let x = 1; x < MAZE_SIZE.width - 1; x += 2) {
        newMaze[y][x] = 0;
        if (x + 1 < MAZE_SIZE.width - 1) {newMaze[y][x + 1] = 0;}
        if (y + 1 < MAZE_SIZE.height - 1) {newMaze[y + 1][x] = 0;}
      }
    }

    for (let i = 0; i < 20; i++) {
      const x = Math.floor(Math.random() * (MAZE_SIZE.width - 2)) + 1;
      const y = Math.floor(Math.random() * (MAZE_SIZE.height - 2)) + 1;
      if (newMaze[y][x] === 0) {newMaze[y][x] = 1;}
    }

    newMaze[1][1] = 2;
    newMaze[MAZE_SIZE.height - 2][MAZE_SIZE.width - 2] = 3;
    return newMaze;
  }, []);

  const drawMaze = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {return;}
    const ctx = canvas.getContext('2d');
    if (!ctx) {return;}

    const isDark =
      document.documentElement.classList.contains('dark') ||
      document.documentElement.getAttribute('data-theme') === 'dark';

    const colors = isDark
      ? { path: '#111827', wall: '#374151', grid: '#1f2937', start: '#22c55e', end: '#f43f5e' }
      : { path: '#f1f5f9', wall: '#475569', grid: '#e2e8f0', start: '#22c55e', end: '#f43f5e' };

    canvas.width = MAZE_SIZE.width * CELL;
    canvas.height = MAZE_SIZE.height * CELL;

    ctx.fillStyle = colors.path;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    };

    for (let y = 0; y < MAZE_SIZE.height; y++) {
      for (let x = 0; x < MAZE_SIZE.width; x++) {
        const cellX = x * CELL;
        const cellY = y * CELL;
        const cell = maze[y][x];

        if (cell === 1) {
          ctx.fillStyle = colors.wall;
          roundRect(cellX + 2, cellY + 2, CELL - 4, CELL - 4, 6);
          ctx.fill();
        } else {
          ctx.strokeStyle = colors.grid;
          ctx.lineWidth = 1;
          ctx.strokeRect(cellX, cellY, CELL, CELL);
          if (cell === 2) {
            ctx.fillStyle = `${colors.start}33`;
            roundRect(cellX + 3, cellY + 3, CELL - 6, CELL - 6, 6);
            ctx.fill();
          } else if (cell === 3) {
            ctx.font = `${CELL * 0.7}px serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🏁', cellX + CELL / 2, cellY + CELL / 2 + 1);
          }
        }
      }
    }

    // Player (panda)
    ctx.font = `${CELL * 0.78}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🐼', playerPos.x * CELL + CELL / 2, playerPos.y * CELL + CELL / 2 + 1);
  }, [maze, playerPos]);

  const startGame = useCallback(() => {
    setMaze(generateMaze());
    setPlayerPos({ x: 1, y: 1 });
    setIsCompleted(false);
    setMoves(0);
    setScore(0);
    setStartTime(new Date());
  }, [generateMaze]);

  useEffect(() => {
    startGame();
  }, [startGame]);

  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement;
    panelRef.current?.focus();
    return () => previouslyFocused.current?.focus();
  }, []);

  useEffect(() => {
    if (maze.length === 0) {return;}
    drawMaze();
  }, [maze, playerPos, drawMaze]);

  const movePlayer = useCallback(
    (direction: 'up' | 'down' | 'left' | 'right') => {
      if (isCompleted) {return;}

      let newX = playerPos.x;
      let newY = playerPos.y;
      if (direction === 'up') {newY = Math.max(0, playerPos.y - 1);}
      if (direction === 'down') {newY = Math.min(MAZE_SIZE.height - 1, playerPos.y + 1);}
      if (direction === 'left') {newX = Math.max(0, playerPos.x - 1);}
      if (direction === 'right') {newX = Math.min(MAZE_SIZE.width - 1, playerPos.x + 1);}

      if (maze[newY] && maze[newY][newX] !== 1) {
        setPlayerPos({ x: newX, y: newY });
        setMoves((prev) => prev + 1);

        if (maze[newY][newX] === 3) {
          setIsCompleted(true);
          const timeSpent = startTime ? Math.round((Date.now() - startTime.getTime()) / 1000) : 0;
          const maxPossibleMoves = MAZE_SIZE.width * MAZE_SIZE.height;
          const efficiency = Math.max(0, Math.round(((maxPossibleMoves - moves) / maxPossibleMoves) * 100));
          const timeBonus = Math.max(0, Math.round(((300 - timeSpent) / 300) * 50));
          const finalScore = Math.min(100, efficiency + timeBonus);
          setScore(finalScore);
          onComplete(finalScore);
        }
      }
    },
    [playerPos, maze, isCompleted, onComplete, moves, startTime]
  );

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['arrowup', 'w'].includes(key)) {
        e.preventDefault();
        movePlayer('up');
      } else if (['arrowdown', 's'].includes(key)) {
        e.preventDefault();
        movePlayer('down');
      } else if (['arrowleft', 'a'].includes(key)) {
        e.preventDefault();
        movePlayer('left');
      } else if (['arrowright', 'd'].includes(key)) {
        e.preventDefault();
        movePlayer('right');
      }
    },
    [movePlayer]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {onClose();}
    };
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [onClose]);

  const dPadBtn =
    'flex h-12 w-12 items-center justify-center rounded-xl bg-green-600 text-white shadow-sm transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-green-500 dark:hover:bg-green-400';

  const legend = [
    { emoji: '🐼', label: 'You (Privacy Panda)' },
    { emoji: '🏁', label: 'Goal — reach safety' },
    { dot: 'bg-slate-500 dark:bg-slate-600', label: 'Walls — avoid' },
    { dot: 'bg-slate-100 dark:bg-gray-800 border border-slate-300 dark:border-gray-600', label: 'Safe path' },
  ];

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="maze-game-title"
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className="relative flex max-h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl outline-none dark:bg-gray-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 bg-gradient-to-r from-emerald-600 to-teal-500 px-5 py-4">
          <div className="min-w-0">
            <h2 id="maze-game-title" className="flex items-center gap-2 text-lg font-bold text-white sm:text-xl">
              <span aria-hidden="true">🐼</span>
              Safe Online Journey
            </h2>
            <p className="mt-0.5 text-sm text-emerald-50">Guide Privacy Panda to the goal.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close game"
            className="shrink-0 rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-white/30"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-3 border-b border-gray-200 bg-gray-50 px-5 py-3 dark:border-gray-800 dark:bg-gray-800/50">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm dark:bg-gray-800 dark:text-gray-200">
            <Footprints className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            {moves} moves
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm dark:bg-gray-800 dark:text-gray-200">
            <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            Row {playerPos.y + 1}, Col {playerPos.x + 1}
          </span>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {context && <ActivityPurposeBanner context={context} />}

          {/* Legend */}
          <div className="mb-4 flex flex-wrap justify-center gap-x-4 gap-y-2" role="list" aria-label="Maze legend">
            {legend.map((l) => (
              <div key={l.label} role="listitem" className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                {l.emoji ? (
                  <span aria-hidden="true" className="text-base leading-none">{l.emoji}</span>
                ) : (
                  <span aria-hidden="true" className={`h-4 w-4 rounded ${l.dot}`} />
                )}
                <span>{l.label}</span>
              </div>
            ))}
          </div>

          {/* Maze canvas */}
          <div className="flex justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 p-3 dark:from-gray-800 dark:to-gray-950">
            <canvas
              ref={canvasRef}
              className="h-auto max-w-full rounded-xl shadow-md"
              role="img"
              aria-label={`Privacy Panda maze. Navigate from start to the goal flag. Current position row ${
                playerPos.y + 1
              }, column ${playerPos.x + 1}. Moves made ${moves}. ${
                isCompleted ? 'Maze completed!' : 'Use arrow keys or WASD to move.'
              }`}
              tabIndex={0}
            />
          </div>

          <div role="status" aria-live="polite" className="sr-only">
            {isCompleted
              ? 'Congratulations! You completed the maze!'
              : `Current position: row ${playerPos.y + 1}, column ${playerPos.x + 1}. Moves: ${moves}`}
          </div>

          <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
            Use the arrow keys, WASD, or the buttons below to move.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-4 border-t border-gray-200 bg-gray-50 px-5 py-4 sm:flex-row sm:justify-between dark:border-gray-800 dark:bg-gray-800/50">
          {/* D-pad */}
          <div className="flex flex-col items-center gap-1.5">
            <button type="button" onClick={() => movePlayer('up')} disabled={isCompleted} aria-label="Move up" className={dPadBtn}>
              <ArrowUp className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="flex gap-1.5">
              <button type="button" onClick={() => movePlayer('left')} disabled={isCompleted} aria-label="Move left" className={dPadBtn}>
                <ArrowLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button type="button" onClick={() => movePlayer('down')} disabled={isCompleted} aria-label="Move down" className={dPadBtn}>
                <ArrowDown className="h-5 w-5" aria-hidden="true" />
              </button>
              <button type="button" onClick={() => movePlayer('right')} disabled={isCompleted} aria-label="Move right" className={dPadBtn}>
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={startGame}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            New maze
          </button>
        </div>

        {/* Completion overlay */}
        {isCompleted && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-900/70 p-6">
            <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-2xl dark:bg-gray-900">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/50">
                <Trophy className="h-8 w-8 text-amber-500 dark:text-amber-400" aria-hidden="true" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">You made it!</h3>
              <p className="mb-1 text-gray-600 dark:text-gray-300">
                Privacy Panda reached safety in {moves} moves — you scored {score}%.
              </p>
              <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
                You learned to steer around digital dangers and protect your privacy.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={startGame}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Play again
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MazeActivity;
