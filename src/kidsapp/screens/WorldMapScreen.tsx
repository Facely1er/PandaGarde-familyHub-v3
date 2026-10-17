import React from 'react';
import { Link } from 'react-router-dom';
import { StoryCoverArt } from '../../components/stories/StoryCoverArt';
import type { Story } from '../../data/stories';
import { useKidsProgress } from '../KidsProgressContext';
import {
  EPISODE_GAME_OVERRIDES,
  getKidsEpisodesBySeason,
  isKidsEpisodeUnlocked,
  KIDS_SEASON_META,
  KIDS_SEASONS,
  PILLAR_META,
  type KidsSeason,
} from '../kidsContent';

function SeasonPath({
  season,
  episodes,
  isEpisodeComplete,
}: {
  season: KidsSeason;
  episodes: Story[];
  isEpisodeComplete: (slug: string) => boolean;
}) {
  const meta = KIDS_SEASON_META[season];

  return (
    <section className={season === 2 ? 'mt-10' : undefined} aria-labelledby={`season-${season}-heading`}>
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
          Season {season}
        </p>
        <h2
          id={`season-${season}-heading`}
          className="text-xl font-extrabold text-emerald-800 dark:text-emerald-300 sm:text-2xl"
        >
          {meta.title}
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{meta.subtitle}</p>
      </div>

      <ol className="relative space-y-4">
        <div
          className="absolute bottom-4 left-8 top-4 w-1 rounded bg-emerald-200 dark:bg-emerald-800"
          aria-hidden
        />
        {episodes.map((story) => {
          const complete = isEpisodeComplete(story.slug);
          const unlocked = isKidsEpisodeUnlocked(story.slug, isEpisodeComplete);
          const pillar = PILLAR_META[story.questPillar];
          const specialGame = EPISODE_GAME_OVERRIDES[story.slug];

          const stopMarker = (
            <span
              className={`z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg font-bold ring-4 ring-emerald-50 dark:ring-gray-900 ${
                complete
                  ? 'bg-emerald-600 text-white dark:bg-emerald-400 dark:text-gray-900'
                  : unlocked
                    ? 'bg-amber-400 text-gray-900'
                    : 'bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
              }`}
              aria-hidden
            >
              {complete ? '✓' : unlocked ? story.episodeNumber : '🔒'}
            </span>
          );

          const card = (
            <div
              className={`flex flex-1 items-center gap-3 rounded-2xl border p-3 sm:gap-4 sm:p-4 ${
                unlocked
                  ? 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
                  : 'border-gray-200 bg-gray-100 opacity-60 dark:border-gray-700 dark:bg-gray-800/60'
              }`}
            >
              <StoryCoverArt story={story} variant="inline" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-gray-900 dark:text-gray-100">{story.title}</p>
                <p className="mt-0.5 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                  {story.privacyTopic}
                </p>
                <span
                  className={`mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${pillar.chipClass}`}
                >
                  <span aria-hidden>{pillar.emoji}</span>
                  {pillar.label}
                </span>
                {specialGame && (
                  <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-xs font-semibold text-violet-800 dark:bg-violet-900/50 dark:text-violet-200">
                    <span aria-hidden>{specialGame.emoji}</span>
                    {specialGame.name}
                  </span>
                )}
              </div>
              {complete && (
                <span className="text-2xl" role="img" aria-label="Badge earned">
                  🏅
                </span>
              )}
            </div>
          );

          return (
            <li key={story.slug} className="relative flex items-center gap-3 pl-4">
              {stopMarker}
              {unlocked ? (
                <Link
                  to={`/episode/${story.slug}`}
                  className="flex flex-1 rounded-2xl transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600 active:scale-[0.99]"
                  aria-label={`${complete ? 'Replay' : 'Play'} episode ${story.episodeNumber}: ${story.title}`}
                >
                  {card}
                </Link>
              ) : (
                <div className="flex flex-1" aria-label={`Episode ${story.episodeNumber} is locked`}>
                  {card}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/**
 * Bamboo Forest journey: Season 1 then Season 2 as stops along the path.
 * Episode N+1 unlocks when episode N is complete (S2 after S1).
 */
const WorldMapScreen: React.FC = () => {
  const { isEpisodeComplete } = useKidsProgress();

  return (
    <div className="py-2">
      <h1 className="text-2xl font-extrabold text-emerald-800 dark:text-emerald-300 sm:text-3xl">
        The Digital Bamboo Forest
      </h1>
      <p className="mt-1 text-gray-600 dark:text-gray-300">
        Explore the Privacy Grove, then unlock the Kindness Clearing.
      </p>

      {KIDS_SEASONS.map((season) => (
        <SeasonPath
          key={season}
          season={season}
          episodes={getKidsEpisodesBySeason(season)}
          isEpisodeComplete={isEpisodeComplete}
        />
      ))}
    </div>
  );
};

export default WorldMapScreen;
