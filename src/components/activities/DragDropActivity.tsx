import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Shuffle, CheckCircle2, RotateCcw, X, Shield, Users, Sparkles } from 'lucide-react';

interface DragDropActivityProps {
  onComplete: (score?: number) => void;
  onClose: () => void;
}

type Category = 'safe' | 'private';
type Slot = 'tray' | Category;

interface Item {
  id: string;
  text: string;
  emoji: string;
  category: Category;
}

const ITEMS: Item[] = [
  { id: '1', text: 'My full name', emoji: '🧑', category: 'private' },
  { id: '2', text: 'My favorite color', emoji: '🎨', category: 'safe' },
  { id: '3', text: 'My home address', emoji: '🏠', category: 'private' },
  { id: '4', text: "My pet's name", emoji: '🐶', category: 'safe' },
  { id: '5', text: 'My phone number', emoji: '📱', category: 'private' },
  { id: '6', text: 'My favorite food', emoji: '🍕', category: 'safe' },
  { id: '7', text: 'My school name', emoji: '🏫', category: 'private' },
  { id: '8', text: 'My favorite game', emoji: '🎮', category: 'safe' },
  { id: '9', text: 'My social security number', emoji: '🔢', category: 'private' },
  { id: '10', text: 'My favorite movie', emoji: '🎬', category: 'safe' },
  { id: '11', text: 'My password', emoji: '🔑', category: 'private' },
  { id: '12', text: 'My favorite book', emoji: '📚', category: 'safe' },
];

const shuffle = <T,>(arr: T[]): T[] => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const DragDropActivity: React.FC<DragDropActivityProps> = ({ onComplete, onClose }) => {
  const [order, setOrder] = useState<string[]>(() => shuffle(ITEMS.map((i) => i.id)));
  const [placement, setPlacement] = useState<Record<string, Slot>>(
    () => Object.fromEntries(ITEMS.map((i) => [i.id, 'tray'])) as Record<string, Slot>
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const itemsById = useMemo(() => Object.fromEntries(ITEMS.map((i) => [i.id, i])), []);
  const total = ITEMS.length;
  const placedCount = useMemo(
    () => Object.values(placement).filter((s) => s !== 'tray').length,
    [placement]
  );

  const trayItems = order.filter((id) => placement[id] === 'tray');
  const safeItems = order.filter((id) => placement[id] === 'safe');
  const privateItems = order.filter((id) => placement[id] === 'private');

  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement;
    panelRef.current?.focus();
    return () => previouslyFocused.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {onClose();}
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const moveItem = useCallback((id: string, slot: Slot) => {
    setPlacement((prev) => ({ ...prev, [id]: slot }));
    setSelectedId(null);
    setChecked(false);
    setFeedback(null);
  }, []);

  const handleItemClick = (id: string) => {
    setChecked(false);
    setFeedback(null);
    setSelectedId((cur) => (cur === id ? null : id));
  };

  const handleZoneActivate = (slot: Slot) => {
    if (selectedId) {moveItem(selectedId, slot);}
  };

  const reset = useCallback(() => {
    setOrder(shuffle(ITEMS.map((i) => i.id)));
    setPlacement(Object.fromEntries(ITEMS.map((i) => [i.id, 'tray'])) as Record<string, Slot>);
    setSelectedId(null);
    setChecked(false);
    setFeedback(null);
    setIsCompleted(false);
    setScore(0);
  }, []);

  const reshuffle = useCallback(() => {
    setOrder((prev) => shuffle(prev));
  }, []);

  const checkAnswer = () => {
    const correct = ITEMS.filter((i) => placement[i.id] === i.category).length;
    const newScore = Math.round((correct / total) * 100);
    setScore(newScore);
    setChecked(true);

    if (placedCount < total) {
      setFeedback(`Sort every card into a basket first — ${total - placedCount} still waiting in the tray.`);
      return;
    }
    if (correct === total) {
      setFeedback(null);
      setIsCompleted(true);
      onComplete(newScore);
    } else {
      setFeedback(`So close! ${correct} of ${total} are in the right basket. Fix the highlighted cards and try again.`);
    }
  };

  const chipStateClasses = (id: string, inZone: boolean) => {
    const item = itemsById[id];
    if (checked && inZone) {
      const right = placement[id] === item.category;
      return right
        ? 'border-green-500 bg-green-50 ring-2 ring-green-500/60 dark:bg-green-950/50 dark:border-green-500'
        : 'border-rose-500 bg-rose-50 ring-2 ring-rose-500/60 dark:bg-rose-950/50 dark:border-rose-500';
    }
    if (selectedId === id) {
      return 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 dark:bg-blue-950/50 dark:border-blue-400';
    }
    return 'border-gray-200 bg-white hover:border-gray-300 hover:-translate-y-0.5 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600';
  };

  const renderChip = (id: string, inZone: boolean) => {
    const item = itemsById[id];
    return (
      <button
        key={id}
        type="button"
        draggable
        onDragStart={(e) => {
          setDragId(id);
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', id);
        }}
        onDragEnd={() => setDragId(null)}
        onClick={() => handleItemClick(id)}
        aria-pressed={selectedId === id}
        aria-label={`${item.text} — ${
          inZone ? 'tap to move, or drag back to the tray' : 'tap to pick up, or drag to a basket'
        }`}
        className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2 text-left text-sm font-medium text-gray-800 shadow-sm transition-all duration-150 cursor-grab active:cursor-grabbing dark:text-gray-100 ${chipStateClasses(
          id,
          inZone
        )} ${dragId === id ? 'opacity-40' : ''}`}
      >
        <span aria-hidden="true" className="text-lg leading-none">
          {item.emoji}
        </span>
        <span>{item.text}</span>
      </button>
    );
  };

  const zoneBase =
    'flex min-h-[9rem] flex-col rounded-2xl border-2 border-dashed p-4 transition-colors';
  const dropProps = (slot: Slot) => ({
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      const id = e.dataTransfer.getData('text/plain') || dragId;
      if (id) {moveItem(id, slot);}
      setDragId(null);
    },
  });

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sort-game-title"
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className="relative flex max-h-[95vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl outline-none dark:bg-gray-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-gray-200 bg-gradient-to-r from-green-600 to-emerald-500 px-5 py-4 dark:border-gray-800">
          <div className="min-w-0">
            <h2 id="sort-game-title" className="flex items-center gap-2 text-lg font-bold text-white sm:text-xl">
              <Shield className="h-5 w-5 shrink-0" aria-hidden="true" />
              Safe or Private?
            </h2>
            <p className="mt-0.5 text-sm text-green-50">
              Sort each card into the right basket.
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

        {/* Progress + score */}
        <div className="flex items-center gap-4 border-b border-gray-200 bg-gray-50 px-5 py-3 dark:border-gray-800 dark:bg-gray-800/50">
          <div className="flex-1">
            <div className="mb-1 flex items-center justify-between text-xs font-medium text-gray-600 dark:text-gray-300">
              <span>{placedCount} of {total} sorted</span>
              <span>Score: {score}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${(placedCount / total) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <p className="mb-3 text-center text-sm text-gray-500 dark:text-gray-400">
            Tap a card, then tap a basket — or drag it across.
          </p>

          {/* Tray */}
          <div
            {...dropProps('tray')}
            className={`mb-5 rounded-2xl border-2 border-dashed p-3 transition-colors ${
              trayItems.length === 0
                ? 'border-gray-200 dark:border-gray-800'
                : 'border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/40'
            }`}
          >
            {trayItems.length === 0 ? (
              <p className="py-2 text-center text-sm text-gray-400 dark:text-gray-500">
                All cards sorted — press <span className="font-semibold">Check answer</span>.
              </p>
            ) : (
              <div className="flex flex-wrap justify-center gap-2">
                {trayItems.map((id) => renderChip(id, false))}
              </div>
            )}
          </div>

          {/* Drop zones */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Safe */}
            <div
              {...dropProps('safe')}
              role="button"
              tabIndex={0}
              aria-label="Safe to share basket — tap to place the selected card here"
              onClick={() => handleZoneActivate('safe')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleZoneActivate('safe');
                }
              }}
              className={`${zoneBase} cursor-pointer border-green-400 bg-green-50/60 hover:bg-green-50 dark:border-green-700 dark:bg-green-950/30 dark:hover:bg-green-950/50`}
            >
              <div className="mb-3 flex items-center gap-2 text-green-800 dark:text-green-200">
                <Users className="h-5 w-5" aria-hidden="true" />
                <div>
                  <h3 className="text-sm font-bold leading-tight">Safe to share</h3>
                  <p className="text-xs text-green-700/80 dark:text-green-300/80">Okay to tell friends</p>
                </div>
              </div>
              <div className="flex flex-wrap content-start gap-2">
                {safeItems.map((id) => renderChip(id, true))}
              </div>
            </div>

            {/* Private */}
            <div
              {...dropProps('private')}
              role="button"
              tabIndex={0}
              aria-label="Keep private basket — tap to place the selected card here"
              onClick={() => handleZoneActivate('private')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleZoneActivate('private');
                }
              }}
              className={`${zoneBase} cursor-pointer border-rose-400 bg-rose-50/60 hover:bg-rose-50 dark:border-rose-700 dark:bg-rose-950/30 dark:hover:bg-rose-950/50`}
            >
              <div className="mb-3 flex items-center gap-2 text-rose-800 dark:text-rose-200">
                <Shield className="h-5 w-5" aria-hidden="true" />
                <div>
                  <h3 className="text-sm font-bold leading-tight">Keep private</h3>
                  <p className="text-xs text-rose-700/80 dark:text-rose-300/80">Protect this information</p>
                </div>
              </div>
              <div className="flex flex-wrap content-start gap-2">
                {privateItems.map((id) => renderChip(id, true))}
              </div>
            </div>
          </div>

          {feedback && (
            <div
              role="status"
              className="mt-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-center text-sm font-medium text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200"
            >
              {feedback}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 border-t border-gray-200 bg-gray-50 px-5 py-4 dark:border-gray-800 dark:bg-gray-800/50">
          <button
            type="button"
            onClick={reshuffle}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <Shuffle className="h-4 w-4" aria-hidden="true" />
            Shuffle
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset
          </button>
          <button
            type="button"
            onClick={checkAnswer}
            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-400"
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Check answer
          </button>
        </div>

        {/* Completion overlay */}
        {isCompleted && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-900/70 p-6">
            <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-2xl dark:bg-gray-900">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
                <Sparkles className="h-8 w-8 text-green-600 dark:text-green-400" aria-hidden="true" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">Excellent work!</h3>
              <p className="mb-1 text-gray-600 dark:text-gray-300">
                You sorted every card correctly and scored {score}%.
              </p>
              <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
                Now you know what&rsquo;s safe to share and what to keep private.
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

export default DragDropActivity;
