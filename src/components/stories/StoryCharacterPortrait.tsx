import { useState } from 'react';
import type { ForestCharacter } from '../../data/forestCharacters';

interface StoryCharacterPortraitProps {
  character: ForestCharacter;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  /** strip = compact cast row under story banner */
  labelLayout?: 'default' | 'strip';
  highlight?: boolean;
}

const SIZE_CLASS = {
  sm: 'h-12 w-12',
  md: 'h-16 w-16',
  lg: 'h-20 w-20',
} as const;

export function StoryCharacterPortrait({
  character,
  size = 'md',
  showLabel = false,
  labelLayout = 'default',
  highlight = false,
}: StoryCharacterPortraitProps) {
  const [failed, setFailed] = useState(false);
  const isStrip = labelLayout === 'strip';

  return (
    <figure
      className={`flex shrink-0 flex-col items-center text-center ${
        isStrip ? 'w-[4.75rem] gap-2' : 'gap-1.5'
      }`}
    >
      <div
        className={`${SIZE_CLASS[size]} overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-600 dark:bg-gray-800 ${
          highlight ? 'ring-2 ring-green-500/70 ring-offset-2 ring-offset-white dark:ring-offset-gray-900' : ''
        }`}
      >
        {!failed && character.portraitUrl ? (
          <img
            src={character.portraitUrl}
            alt=""
            width={80}
            height={80}
            className="h-full w-full object-cover object-center"
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-2xl" aria-hidden>
            {character.emoji}
          </span>
        )}
      </div>
      {showLabel ? (
        <figcaption className={isStrip ? 'w-full' : 'max-w-[5.5rem]'}>
          <p className="text-xs font-semibold leading-tight text-gray-900 dark:text-gray-100">
            {character.name}
          </p>
          <p
            className={`text-[0.65rem] leading-tight text-gray-500 dark:text-gray-400 ${
              isStrip ? 'whitespace-nowrap' : ''
            }`}
          >
            {character.epithet}
          </p>
        </figcaption>
      ) : null}
    </figure>
  );
}
