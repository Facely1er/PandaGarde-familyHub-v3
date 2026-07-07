import { getCastGalleryCharacters } from '../../data/forestCharacters';
import { StoryCharacterPortrait } from './StoryCharacterPortrait';

export function StoryCastGallery() {
  const cast = getCastGalleryCharacters();
  if (cast.length === 0) return null;

  return (
    <section
      className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800 sm:p-6"
      aria-labelledby="story-cast-gallery-heading"
    >
      <header className="mb-5 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-green-700 dark:text-green-400">
          The cast
        </p>
        <h2
          id="story-cast-gallery-heading"
          className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100 sm:text-xl"
        >
          Meet the friends of the Digital Bamboo Forest
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Different friends, different strengths — one forest. You will meet more of them as the
          seasons unfold.
        </p>
      </header>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5">
        {cast.map((character) => (
          <li key={character.id}>
            <StoryCharacterPortrait character={character} size="md" showLabel />
          </li>
        ))}
      </ul>
    </section>
  );
}
