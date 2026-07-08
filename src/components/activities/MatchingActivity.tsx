import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { RotateCcw, Layers, Sparkles } from 'lucide-react';
import ActivityGameShell, { shellBtn } from './ActivityGameShell';
import ActivityPurposeBanner, { type ActivityContext } from './ActivityPurposeBanner';

interface MatchingActivityProps {
  onComplete: (score?: number) => void;
  onClose: () => void;
  context?: ActivityContext;
}

interface Card {
  id: string;
  content: string;
  type: 'symbol' | 'meaning';
  pairId: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MatchingActivity: React.FC<MatchingActivityProps> = ({ onComplete, onClose, context }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [score, setScore] = useState(0);

  const cardPairs = useMemo(
    () => [
      { symbol: '🔒', meaning: 'Password protection' },
      { symbol: '🛡️', meaning: 'Security shield' },
      { symbol: '👁️', meaning: 'Privacy settings' },
      { symbol: '🚫', meaning: 'Block access' },
      { symbol: '✅', meaning: 'Safe / approved' },
      { symbol: '⚠️', meaning: 'Warning alert' },
    ],
    []
  );

  const initializeCards = useCallback(() => {
    const newCards: Card[] = [];
    cardPairs.forEach((pair, index) => {
      newCards.push({
        id: `symbol-${index}`,
        content: pair.symbol,
        type: 'symbol',
        pairId: `pair-${index}`,
        isFlipped: false,
        isMatched: false,
      });
      newCards.push({
        id: `meaning-${index}`,
        content: pair.meaning,
        type: 'meaning',
        pairId: `pair-${index}`,
        isFlipped: false,
        isMatched: false,
      });
    });
    setCards(newCards.sort(() => Math.random() - 0.5));
    setFlippedCards([]);
    setIsCompleted(false);
    setMoves(0);
    setMatches(0);
    setScore(0);
  }, [cardPairs]);

  useEffect(() => {
    initializeCards();
  }, [initializeCards]);

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
      }, 900);
    }
    setFlippedCards([]);
    setMoves((prev) => prev + 1);
  }, [flippedCards, cards, matches, onComplete, cardPairs.length, moves]);

  useEffect(() => {
    if (flippedCards.length === 2) {checkForMatch();}
  }, [flippedCards, checkForMatch]);

  const handleCardClick = (cardId: string) => {
    const card = cards.find((c) => c.id === cardId);
    if (flippedCards.length >= 2 || card?.isFlipped || card?.isMatched) {return;}
    setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c)));
    setFlippedCards((prev) => [...prev, cardId]);
  };

  const total = cardPairs.length;

  return (
    <ActivityGameShell
      titleId="matching-title"
      title="Privacy Symbols"
      subtitle="Match each icon with what it means."
      titleIcon={<Layers className="h-5 w-5" aria-hidden="true" />}
      onClose={onClose}
      progressPercent={total ? (matches / total) * 100 : 0}
      progressLeft={`${matches} of ${total} pairs`}
      progressRight={`${moves} moves`}
      headerGradient="from-indigo-600 to-blue-500"
      maxWidthClass="max-w-2xl"
      footer={
        <button type="button" onClick={initializeCards} className={shellBtn}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          New game
        </button>
      }
      completed={
        isCompleted
          ? {
              title: 'Perfect matching!',
              message: `Every symbol paired in ${moves} moves — you scored ${score}%.`,
              submessage: 'You will spot these signs on websites and apps.',
              onPlayAgain: initializeCards,
              onDone: onClose,
              icon: <Sparkles className="h-8 w-8 text-indigo-500 dark:text-indigo-400" aria-hidden="true" />,
            }
          : undefined
      }
    >
      {context && <ActivityPurposeBanner context={context} />}

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3">
        {cards.map((card) => {
          const showFace = card.isFlipped || card.isMatched;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => handleCardClick(card.id)}
              disabled={card.isMatched}
              aria-label={showFace ? card.content : 'Hidden card — tap to flip'}
              className={`relative flex min-h-[4.5rem] items-center justify-center rounded-xl border-2 p-2 text-center transition-all duration-200 ${
                card.isMatched
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40'
                  : showFace
                    ? card.type === 'symbol'
                      ? 'border-indigo-300 bg-white text-3xl dark:bg-gray-800'
                      : 'border-indigo-300 bg-white text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-100 sm:text-sm'
                    : 'border-gray-200 bg-gradient-to-br from-indigo-500 to-blue-600 hover:scale-[1.02] dark:border-gray-700'
              }`}
            >
              {showFace ? (
                card.content
              ) : (
                <span className="text-lg font-bold text-white/90" aria-hidden="true">
                  ?
                </span>
              )}
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
        Flip two cards — match each emoji to its meaning.
      </p>
    </ActivityGameShell>
  );
};

export default MatchingActivity;
