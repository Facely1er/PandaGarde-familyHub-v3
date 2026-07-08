import React, { useRef, useEffect, useState, useCallback } from 'react';
import { RotateCcw, X, ShieldCheck } from 'lucide-react';
import ActivityPurposeBanner, { type ActivityContext } from './ActivityPurposeBanner';

interface ConnectDotsActivityProps {
  onComplete: (score?: number) => void;
  onClose: () => void;
  context?: ActivityContext;
}

interface Dot {
  id: number;
  x: number;
  y: number;
}

const CANVAS = { width: 440, height: 440 };

// Shield outline, ordered clockwise from the top point.
const DOTS: Dot[] = [
  { id: 1, x: 220, y: 60 },
  { id: 2, x: 150, y: 90 },
  { id: 3, x: 100, y: 150 },
  { id: 4, x: 90, y: 230 },
  { id: 5, x: 120, y: 300 },
  { id: 6, x: 175, y: 355 },
  { id: 7, x: 220, y: 385 },
  { id: 8, x: 265, y: 355 },
  { id: 9, x: 320, y: 300 },
  { id: 10, x: 350, y: 230 },
  { id: 11, x: 340, y: 150 },
  { id: 12, x: 290, y: 90 },
];

const ConnectDotsActivity: React.FC<ConnectDotsActivityProps> = ({ onComplete, onClose, context }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const [connectedDots, setConnectedDots] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [wrongDot, setWrongDot] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<Date>(() => new Date());

  const total = DOTS.length;
  const nextExpected = connectedDots.length + 1;

  const reset = useCallback(() => {
    setConnectedDots([]);
    setIsCompleted(false);
    setWrongDot(null);
    setMoves(0);
    setScore(0);
    setStartTime(new Date());
  }, []);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {return;}
    const ctx = canvas.getContext('2d');
    if (!ctx) {return;}

    const isDark =
      document.documentElement.classList.contains('dark') ||
      document.documentElement.getAttribute('data-theme') === 'dark';
    const c = isDark
      ? { bg: '#0b1220', line: '#34d399', dot: '#64748b', label: '#e5e7eb', fill: 'rgba(52,211,153,0.18)' }
      : { bg: '#ffffff', line: '#16a34a', dot: '#94a3b8', label: '#ffffff', fill: 'rgba(22,163,74,0.14)' };

    canvas.width = CANVAS.width;
    canvas.height = CANVAS.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = c.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Fill the shield once complete.
    if (isCompleted) {
      ctx.beginPath();
      DOTS.forEach((d, i) => (i === 0 ? ctx.moveTo(d.x, d.y) : ctx.lineTo(d.x, d.y)));
      ctx.closePath();
      ctx.fillStyle = c.fill;
      ctx.fill();
    }

    // Connecting lines.
    ctx.strokeStyle = c.line;
    ctx.lineWidth = 4;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    connectedDots.forEach((id, i) => {
      const dot = DOTS.find((d) => d.id === id);
      if (!dot) {return;}
      if (i === 0) {ctx.moveTo(dot.x, dot.y);}
      else {ctx.lineTo(dot.x, dot.y);}
    });
    if (isCompleted) {
      const first = DOTS[0];
      ctx.lineTo(first.x, first.y);
    }
    ctx.stroke();

    // Dots.
    DOTS.forEach((dot) => {
      const isConnected = connectedDots.includes(dot.id);
      const isNext = !isCompleted && dot.id === nextExpected;
      const isWrong = wrongDot === dot.id;

      if (isNext) {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 16, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(250,204,21,0.35)';
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(dot.x, dot.y, isConnected ? 13 : 11, 0, 2 * Math.PI);
      ctx.fillStyle = isConnected
        ? c.line
        : isWrong
          ? '#ef4444'
          : isNext
            ? '#f59e0b'
            : c.dot;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = isDark ? '#0b1220' : '#ffffff';
      ctx.stroke();

      ctx.fillStyle = c.label;
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(dot.id.toString(), dot.x, dot.y + 0.5);
    });

    // Shield emoji center when complete.
    if (isCompleted) {
      ctx.font = '64px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🛡️', CANVAS.width / 2, 235);
    }
  }, [connectedDots, isCompleted, wrongDot, nextExpected]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement;
    panelRef.current?.focus();
    return () => previouslyFocused.current?.focus();
  }, []);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {onClose();}
    };
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [onClose]);

  const handleDotClick = (dotId: number) => {
    if (isCompleted) {return;}
    setMoves((prev) => prev + 1);

    if (dotId === nextExpected) {
      const updated = [...connectedDots, dotId];
      setConnectedDots(updated);
      if (updated.length === total) {
        const totalMoves = moves + 1;
        const timeSpent = Math.round((Date.now() - startTime.getTime()) / 1000);
        const accuracy = Math.round((total / totalMoves) * 100);
        const timeBonus = Math.max(0, Math.round(((60 - timeSpent) / 60) * 30));
        const finalScore = Math.min(100, Math.max(0, accuracy + timeBonus));
        setScore(finalScore);
        setIsCompleted(true);
        onComplete(finalScore);
      }
    } else {
      setWrongDot(dotId);
      setTimeout(() => setWrongDot(null), 250);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isCompleted) {return;}
    const canvas = canvasRef.current;
    const rect = canvas?.getBoundingClientRect();
    if (!canvas || !rect) {return;}

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const hit = DOTS.find((dot) => Math.hypot(x - dot.x, y - dot.y) <= 20);
    if (hit) {handleDotClick(hit.id);}
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dots-game-title"
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className="relative flex max-h-[95vh] w-full max-w-xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl outline-none dark:bg-gray-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 bg-gradient-to-r from-green-600 to-emerald-500 px-5 py-4">
          <div className="min-w-0">
            <h2 id="dots-game-title" className="flex items-center gap-2 text-lg font-bold text-white sm:text-xl">
              <ShieldCheck className="h-5 w-5 shrink-0" aria-hidden="true" />
              Privacy Shield
            </h2>
            <p className="mt-0.5 text-sm text-green-50">
              Connect the dots in order to build the shield.
            </p>
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

        {/* Progress */}
        <div className="border-b border-gray-200 bg-gray-50 px-5 py-3 dark:border-gray-800 dark:bg-gray-800/50">
          <div className="mb-1 flex items-center justify-between text-xs font-medium text-gray-600 dark:text-gray-300">
            <span>
              {connectedDots.length} of {total} connected
            </span>
            <span>Next: dot {isCompleted ? '—' : nextExpected}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${(connectedDots.length / total) * 100}%` }}
            />
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {context && <ActivityPurposeBanner context={context} />}

          <div className="flex justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 p-3 dark:from-gray-800 dark:to-gray-950">
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="h-auto w-full max-w-[400px] cursor-pointer rounded-xl shadow-md"
              role="img"
              aria-label={`Connect the dots to form a privacy shield. ${connectedDots.length} of ${total} dots connected.${
                isCompleted ? ' Shield complete!' : ` Tap dot number ${nextExpected} next.`
              }`}
            />
          </div>
          <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
            Tap the glowing yellow dot to continue the sequence.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center border-t border-gray-200 bg-gray-50 px-5 py-4 dark:border-gray-800 dark:bg-gray-800/50">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset
          </button>
        </div>

        {/* Completion overlay */}
        {isCompleted && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-900/70 p-6">
            <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-2xl dark:bg-gray-900">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
                <ShieldCheck className="h-8 w-8 text-green-600 dark:text-green-400" aria-hidden="true" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">Shield complete!</h3>
              <p className="mb-1 text-gray-600 dark:text-gray-300">
                You connected every dot and scored {score}%.
              </p>
              <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
                Privacy Panda&rsquo;s protection shield is now active.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Play again
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl bg-green-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-400"
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

export default ConnectDotsActivity;
