import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookOpen, Play, Volume2 } from 'lucide-react';
import {
  getContinuationStories,
  getStoriesByAgeGroup,
  getFoundationStory,
  ORIGIN_STORY_SLUG,
  isFoundationStory,
  AgeGroup,
  Story,
} from '../data/stories';
import { localizeStoryMeta } from '../data/storyI18n';
import { StoryCard } from '../components/stories/StoryCard';
import { StoryCastGallery } from '../components/stories/StoryCastGallery';
import { StoryCoverArt } from '../components/stories/StoryCoverArt';
import { ComingSoonBanner } from '../components/stories/ComingSoonBanner';
import { STORY_CAST_PATH } from '../data/forestCharacters';
import PageLayout from '../components/layout/PageLayout';

type Filter = AgeGroup | 'all';

const FILTER_VALUES: Filter[] = ['all', 'early', 'middle', 'older'];
const SEASON_NUMBERS: (1 | 2)[] = [1, 2];

function groupBySeason(stories: Story[]): { season: 1 | 2; stories: Story[] }[] {
  return SEASON_NUMBERS.map((season) => ({
    season,
    stories: stories.filter((story) => story.season === season),
  })).filter((group) => group.stories.length > 0);
}

export function StoryListPage() {
  const { t, i18n } = useTranslation();
  const [filter, setFilter] = useState<Filter>('all');
  const foundationStory = getFoundationStory();
  const foundationMeta = foundationStory ? localizeStoryMeta(foundationStory, i18n.language) : null;

  const filters = FILTER_VALUES.map((value) => ({
    value,
    label: t(`stories.filters.${value}`),
  }));
  const seasonMeta: Record<1 | 2, { title: string; subtitle: string }> = {
    1: { title: t('stories.season1Title'), subtitle: t('stories.season1Subtitle') },
    2: { title: t('stories.season2Title'), subtitle: t('stories.season2Subtitle') },
  };

  const continuationStories =
    filter === 'all' ? getContinuationStories() : getStoriesByAgeGroup(filter).filter((s) => !isFoundationStory(s));

  const seasonGroups = useMemo(() => groupBySeason(continuationStories), [continuationStories]);

  return (
    <PageLayout
      title={t('stories.title')}
      subtitle={t('stories.subtitle')}
      breadcrumbs
    >
      <section className="py-4 pb-8">
        <div className="story-page-shell story-page-shell--wide space-y-8">
          {foundationStory && (
            <div className="story-feature-panel rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 dark:border-emerald-800 dark:from-emerald-950/50 dark:to-gray-900 sm:p-8">
              <div className="story-feature-panel__layout">
                <StoryCoverArt story={foundationStory} variant="hero" />
                <div className="story-feature-panel__copy">
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1">
                    {t('stories.foundationBadge')}
                  </p>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 sm:text-2xl">
                    {foundationMeta?.title ?? foundationStory.title}
                  </h2>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl">
                    {foundationMeta?.summary ?? foundationStory.summary}
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <li className="inline-flex items-center gap-1">
                      <Play size={14} aria-hidden />
                      {t('stories.interactiveScenes')}
                    </li>
                    <li className="inline-flex items-center gap-1">
                      <BookOpen size={14} aria-hidden />
                      {t('stories.chapterReader')}
                    </li>
                    <li className="inline-flex items-center gap-1">
                      <Volume2 size={14} aria-hidden />
                      {t('stories.narration')}
                    </li>
                  </ul>
                </div>
                <Link
                  to={`/stories/${ORIGIN_STORY_SLUG}`}
                  className="story-feature-panel__cta button button-primary shrink-0"
                >
                  {t('stories.beginJourney')}
                </Link>
              </div>
            </div>
          )}

          <ComingSoonBanner />

          <p className="text-sm text-gray-600 dark:text-gray-300">
            <Link
              to={STORY_CAST_PATH}
              className="font-semibold text-green-700 hover:underline dark:text-green-400"
            >
              {t('stories.meetTheCast')}
            </Link>
            {' '}
            {t('stories.meetTheCastSuffix')}
          </p>

          <div role="group" aria-label={t('stories.filterByAge')} className="flex flex-wrap gap-2">
            {filters.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                aria-pressed={filter === value}
                onClick={() => setFilter(value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors min-h-[44px] ${
                  filter === value
                    ? 'bg-green-700 text-white dark:bg-green-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {continuationStories.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filter === 'all' ? t('stories.emptyAll') : t('stories.emptyFiltered')}
            </p>
          ) : (
            <div className="space-y-10">
              {seasonGroups.map(({ season, stories }) => {
                const meta = seasonMeta[season];
                if (!meta) {return null;}
                const isSeason2 = season === 2;

                return (
                  <section
                    key={season}
                    aria-labelledby={`season-${season}-heading`}
                    className={
                      isSeason2
                        ? 'rounded-2xl border border-teal-200 bg-teal-50/40 p-4 dark:border-teal-800/50 dark:bg-teal-950/20 sm:p-5'
                        : 'rounded-2xl border border-green-200 bg-green-50/30 p-4 dark:border-green-800/40 dark:bg-green-950/15 sm:p-5'
                    }
                  >
                    <header className="mb-5 border-b border-gray-200/80 pb-4 dark:border-gray-700/80">
                      <p
                        className={`text-xs font-semibold uppercase tracking-wider ${
                          isSeason2 ? 'text-teal-700 dark:text-teal-300' : 'text-green-700 dark:text-green-400'
                        }`}
                      >
                        {t('stories.seasonLabel', { number: season })}
                      </p>
                      <h2
                        id={`season-${season}-heading`}
                        className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100 sm:text-xl"
                      >
                        {meta.title}
                      </h2>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{meta.subtitle}</p>
                    </header>

                    <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {stories.map((story) => (
                        <StoryCard key={story.id} story={story} />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
          <StoryCastGallery showFullPageLink />
        </div>
      </section>
    </PageLayout>
  );
}
