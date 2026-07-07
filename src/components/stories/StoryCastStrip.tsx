import type { Story } from '../../data/stories';
import { getCharactersForStory } from '../../data/forestCharacters';
import { StoryCharacterPortrait } from './StoryCharacterPortrait';

interface StoryCastStripProps {
  story: Story;
}

export function StoryCastStrip({ story }: StoryCastStripProps) {
  const cast = getCharactersForStory(story);
  if (cast.length === 0) {return null;}

  return (
    <section
      className="mt-3 border-t border-gray-100 pt-3 dark:border-gray-700"
      aria-labelledby={`story-cast-${story.slug}`}
    >
      <h3
        id={`story-cast-${story.slug}`}
        className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
      >
        Friends in this episode
      </h3>
      <ul className="flex flex-wrap items-start justify-center gap-x-5 gap-y-3 sm:gap-x-6">
        {cast.map((character) => (
          <li key={character.id} className="flex min-w-[4.75rem] justify-center">
            <StoryCharacterPortrait
              character={character}
              size="sm"
              showLabel
              labelLayout="strip"
              highlight={character.id === story.leadCharacter}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
