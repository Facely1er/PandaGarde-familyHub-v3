import type { Story } from '../../data/stories';
import { getCharactersDebutingInEpisode } from '../../data/forestCharacters';
import { StoryCharacterPortrait } from './StoryCharacterPortrait';

interface StoryCharacterDebutProps {
  story: Story;
}

export function StoryCharacterDebut({ story }: StoryCharacterDebutProps) {
  const debuts = getCharactersDebutingInEpisode(story.episodeNumber).filter(
    (character) => character.id !== 'po' && character.id !== 'ruby' && character.id !== 'miki' && character.id !== 'tao',
  );

  if (debuts.length === 0) {return null;}

  return (
    <section
      className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 dark:border-amber-800/50 dark:bg-amber-950/20 sm:p-5"
      aria-labelledby={`story-debut-${story.slug}`}
    >
      <h3
        id={`story-debut-${story.slug}`}
        className="text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-200"
      >
        Meet a new friend
      </h3>
      <ul className="mt-3 flex flex-wrap justify-center gap-4 sm:justify-start">
        {debuts.map((character) => (
          <li key={character.id} className="flex max-w-[9rem] flex-col items-center gap-2 text-center">
            <StoryCharacterPortrait character={character} size="lg" highlight />
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {character.name} the {character.species}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
                {character.tagline}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
