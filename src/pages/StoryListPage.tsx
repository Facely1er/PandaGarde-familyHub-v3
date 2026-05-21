import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Play, Volume2 } from 'lucide-react';
import {
  getPublishedStories,
  getStoriesByAgeGroup,
  getFoundationStory,
  ORIGIN_STORY_SLUG,
  AgeGroup,
} from '../data/stories';
import { StoryCard } from '../components/stories/StoryCard';
import { StoryCoverArt } from '../components/stories/StoryCoverArt';
import { ComingSoonBanner } from '../components/stories/ComingSoonBanner';
import PageLayout from '../components/layout/PageLayout';

type Filter = AgeGroup | 'all';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All Ages' },
  { value: 'early', label: 'Ages 5–7' },
  { value: 'middle', label: 'Ages 8–10' },
  { value: 'older', label: 'Ages 11–13' },
];

export function StoryListPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const foundationStory = getFoundationStory();

  const stories = filter === 'all' ? getPublishedStories() : getStoriesByAgeGroup(filter);

  return (
    <PageLayout
      title="Privacy Panda Stories"
      subtitle="Start with the Digital Bamboo Forest (interactive or chapters), then continue with age-matched episodes."
      breadcrumbs
    >
      <section className="py-4 pb-8">
        <div className="mx-auto max-w-[1100px] space-y-8">
          {foundationStory && (
            <div className="story-feature-panel rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 dark:border-emerald-800 dark:from-emerald-950/50 dark:to-gray-800 sm:p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex min-w-0 gap-4">
                  <StoryCoverArt story={foundationStory} variant="hero" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1">
                      Start here · Foundation story
                    </p>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 sm:text-2xl">
                      {foundationStory.title}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl">
                      {foundationStory.summary}
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <li className="inline-flex items-center gap-1">
                        <Play size={14} aria-hidden />
                        Interactive scenes
                      </li>
                      <li className="inline-flex items-center gap-1">
                        <BookOpen size={14} aria-hidden />
                        Chapter reader
                      </li>
                      <li className="inline-flex items-center gap-1">
                        <Volume2 size={14} aria-hidden />
                        Narration
                      </li>
                    </ul>
                  </div>
                </div>
                <Link
                  to={`/stories/${ORIGIN_STORY_SLUG}`}
                  className="button button-primary shrink-0 self-start md:self-center"
                >
                  Begin the journey
                </Link>
              </div>
            </div>
          )}

          <ComingSoonBanner />

          <div role="group" aria-label="Filter by age" className="flex flex-wrap gap-2">
            {FILTERS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                aria-pressed={filter === value}
                onClick={() => setFilter(value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors min-h-[44px] ${
                  filter === value
                    ? 'bg-green-700 text-white dark:bg-green-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {stories.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No stories available for this age group yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {stories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
