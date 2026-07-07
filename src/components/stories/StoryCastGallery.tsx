import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import {
  CAST_TIER_LABELS,
  getCastGalleryCharacters,
  STORY_CAST_PATH,
  type ForestCharacter,
} from '../../data/forestCharacters';
import { StoryCharacterPortrait } from './StoryCharacterPortrait';

interface StoryCastGalleryProps {
  /** Group characters by story tier (cast page). */
  showTiers?: boolean;
  /** Link to the full cast page (stories index teaser). */
  showFullPageLink?: boolean;
}

function groupByTier(characters: ForestCharacter[]): { tier: ForestCharacter['tier']; characters: ForestCharacter[] }[] {
  const tiers = [1, 2, 3] as const;
  return tiers
    .map((tier) => ({
      tier,
      characters: characters.filter((character) => character.tier === tier),
    }))
    .filter((group) => group.characters.length > 0);
}

export function StoryCastGallery({ showTiers = false, showFullPageLink = false }: StoryCastGalleryProps) {
  const cast = getCastGalleryCharacters();
  if (cast.length === 0) {return null;}

  const tierGroups = showTiers ? groupByTier(cast) : null;

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
        {showFullPageLink ? (
          <Link
            to={STORY_CAST_PATH}
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-green-700 hover:underline dark:text-green-400"
          >
            View full cast profiles
            <ArrowRight size={14} aria-hidden />
          </Link>
        ) : null}
      </header>

      {tierGroups ? (
        <div className="space-y-8">
          {tierGroups.map(({ tier, characters }) => (
            <section key={tier} aria-labelledby={`cast-tier-${tier}`}>
              <h3
                id={`cast-tier-${tier}`}
                className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
              >
                {CAST_TIER_LABELS[tier]}
              </h3>
              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {characters.map((character) => (
                  <li key={character.id}>
                    <CastCard character={character} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5">
          {cast.map((character) => (
            <li key={character.id}>
              <StoryCharacterPortrait character={character} size="md" showLabel />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function CastCard({ character }: { character: ForestCharacter }) {
  return (
    <article className="flex h-full flex-col items-center rounded-2xl border border-gray-100 bg-gray-50 p-4 text-center dark:border-gray-700 dark:bg-gray-900/40">
      <StoryCharacterPortrait character={character} size="lg" showLabel />
      <p className="mt-3 text-xs leading-relaxed text-gray-600 dark:text-gray-300">{character.tagline}</p>
      <p className="mt-2 text-[0.65rem] font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
        Episode {character.debutEpisode}
      </p>
    </article>
  );
}
