import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { RotateCcw, Brain, Sparkles } from 'lucide-react';
import ActivityGameShell, { shellBtn } from './ActivityGameShell';
import ActivityPurposeBanner, { type ActivityContext } from './ActivityPurposeBanner';

interface MemoryGameActivityProps {
  onComplete: (score?: number) => void;
  onClose: () => void;
  context?: ActivityContext;
}

interface Card {
  id: string;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
  pairId: string;
}

const MemoryGameActivity: React.FC<MemoryGameActivityProps> = ({ onComplete, onClose, context }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);

  const cardPairs = useMemo(
    () => [
      { symbol: '🔒', meaning: 'Password' },
      { symbol: '🛡️', meaning: 'Security' },
      { symbol: '👁️', meaning: 'Privacy' },
      { symbol: '🚫', meaning: 'Block' },
      { symbol: '✅', meaning: 'Safe' },
      { symbol: '⚠️', meaning: 'Warning' },
    ],
    []
  );

  const initializeCards = useCallback(() => {
    const newCards: Card[] = [];
    cardPairs.forEach((pair, index) => {
      newCards.push({
        id: `symbol-${index}`,
        content: pair.symbol,
        isFlipped: false,
        isMatched: false,
        pairId: `pair-${index}`,
      });
      newCards.push({
        id: `meaning-${index}`,
        content: pair.meaning,
        isFlipped: false,
        isMatched: false,
        pairId: `pair-${index}`,
      });
    });
    setCards(newCards.sort(() => Math.random() - 0.5));
    setFlippedCards([]);
    setIsCompleted(false);
    setMoves(0);
    setMatches(0);
    setTimeElapsed(0);
    setGameStarted(false);
    setScore(0);
  }, [cardPairs]);

  useEffect(() => {
    initializeCards();
  }, [initializeCards]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (gameStarted && !isCompleted) {
      interval = setInterval(() => setTimeElapsed((prev) => prev + 1), 1000);
    }
    return () => {
      if (interval) {clearInterval(interval);}
    };
  }, [gameStarted, isCompleted]);

  const checkForMatch = useCallback(() => {
    const [firstId, secondId] = flippedCards;
    const firstCard = cards.find((c) => c.id === firstId);
    const secondCard = cards.find((c) => c.id === secondId);

    if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
      setCards((prev) =>
        prev.map((card) =>
          card.id === firstId || card.id === secondId ? { ...card, isMatched: true } : card
        )
      );
      const newMatches = matches + 1;
      setMatches(newMatches);
      if (newMatches === cardPairs.length) {
        const maxPossibleMoves = cardPairs.length * 2;
        const efficiency = Math.max(0, Math.round(((maxPossibleMoves - moves) / maxPossibleMoves) * 100));
        setScore(efficiency);
        setIsCompleted(true);
        onComplete(efficiency);
      }
    } else {
      setTimeout(() => {
        setCards((prev) =>
          prev.map((card) =>
            card.id === firstId || card.id === secondId ? { ...card, isFlipped: false } : card
          )
        );
      }, 800);
    }
    setFlippedCards([]);
    setMoves((prev) => prev + 1);
  }, [flippedCards, cards, matches, onComplete, cardPairs.length, moves]);

  useEffect(() => {
    if (flippedCards.length === 2) {checkForMatch();}
  }, [flippedCards, checkForMatch]);

  const handleCardClick = (cardId: string) => {
    if (!gameStarted) {setGameStarted(true);}
    const card = cards.find((c) => c.id === cardId);
    if (flippedCards.length >= 2 || card?.isFlipped || card?.isMatched) {return;}
    setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c)));
    setFlippedCards((prev) => [...prev, cardId]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const total = cardPairs.length;

  return (
    <ActivityGameShell
      titleId="memory-title"
      title="Privacy Memory"
      subtitle="Match each symbol with its meaning."
      titleIcon={<Brain className="h-5 w-5" aria-hidden="true" />}
      onClose={onClose}
      progressPercent={total ? (matches / total) * 100 : 0}
      progressLeft={`${matches} of ${total} pairs`}
      progressRight={`${formatTime(timeElapsed)} · ${moves} flips`}
      headerGradient="from-teal-600 to-cyan-500"
      maxWidthClass="max-w-xl"
      footer={
        <button type="button" onClick={initializeCards} className={shellBtn}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          New game
        </button>
      }
      completed={
        isCompleted
          ? {
              title: 'Memory master!',
              message: `All pairs matched in ${moves} moves — you scored ${score}%.`,
              submessage: 'Remembering privacy symbols helps you spot them in real apps.',
              onPlayAgain: initializeCards,
              onDone: onClose,
              icon: <Sparkles className="h-8 w-8 text-teal-500 dark:text-teal-400" aria-hidden="true" />,
            }
          : undefined
      }
    >
      {context && <ActivityPurposeBanner context={context} />}

      <div className="mb-4 flex flex-wrap justify-center gap-2 text-sm">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 font-medium text-gray-700 shadow-sm dark:bg-gray-800 dark:text-gray-200">
          <Brain className="h-4 w-4 text-teal-600" aria-hidden="true" />
          {moves} flips
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3">
        {cards.map((card) => {
          const showFace = card.isFlipped || card.isMatched;
          const isSymbol = card.content.length <= 2;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => handleCardClick(card.id)}
              disabled={card.isMatched}
              aria-label={showFace ? card.content : 'Hidden card — tap to flip'}
              className={`relative flex aspect-[4/3] items-center justify-center rounded-xl border-2 text-center transition-all duration-200 ${
                card.isMatched
                  ? 'border-emerald-500 bg-emerald-50 opacity-80 dark:bg-emerald-950/40'
                  : showFace
                    ? 'border-teal-400 bg-white dark:border-teal-600 dark:bg-gray-800'
                    : 'border-gray-200 bg-gradient-to-br from-teal-500 to-emerald-600 hover:scale-[1.02] dark:border-gray-700'
              }`}
            >
              {showFace ? (
                <span className={`px-1 font-semibold ${isSymbol ? 'text-2xl' : 'text-xs sm:text-sm text-gray-800 dark:text-gray-100'}`}>
                  {card.content}
                </span>
              ) : (
                <Brain className="h-6 w-6 text-white/90" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
        Flip two cards at a time to find matching symbol-and-meaning pairs.
      </p>
    </ActivityGameShell>
  );
};

export default MemoryGameActivity;
