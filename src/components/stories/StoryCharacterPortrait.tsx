import { useState } from 'react';
import type { ForestCharacter } from '../../data/forestCharacters';

interface StoryCharacterPortraitProps {
  character: ForestCharacter;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
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
  highlight = false,
}: StoryCharacterPortraitProps) {
  const [failed, setFailed] = useState(false);

  return (
    <figure
      className={`flex shrink-0 flex-col items-center gap-1.5 text-center ${
        highlight ? 'rounded-xl bg-green-50/80 p-2 dark:bg-green-950/30' : ''
      }`}
    >
      <div
        className={`${SIZE_CLASS[size]} overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-600 dark:bg-gray-800 ${
          highlight ? 'ring-2 ring-green-500/60' : ''
        }`}
      >
        {!failed && character.portraitUrl ? (
          <img
            src={character.portraitUrl}
            alt=""
            width={80}
            height={80}
            className="h-full w-full object-contain object-center"
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-2xl" aria-hidden>
            🐾
          </span>
        )}
      </div>
      {showLabel ? (
        <figcaption className="max-w-[5.5rem]">
          <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">{character.name}</p>
          <p className="text-[0.65rem] leading-tight text-gray-500 dark:text-gray-400">
            {character.epithet}
          </p>
        </figcaption>
      ) : null}
    </figure>
  );
}
