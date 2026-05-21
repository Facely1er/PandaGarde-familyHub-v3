import { useState } from 'react';
import { getPublishedStories, getStoriesByAgeGroup, AgeGroup } from '../data/stories';
import { StoryCard } from '../components/stories/StoryCard';
import { ComingSoonBanner } from '../components/stories/ComingSoonBanner';

type Filter = AgeGroup | 'all';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All Ages' },
  { value: 'early', label: 'Ages 5–7' },
  { value: 'middle', label: 'Ages 8–10' },
  { value: 'older', label: 'Ages 11–13' },
];

export function StoryListPage() {
  const [filter, setFilter] = useState<Filter>('all');

  const stories = filter === 'all' ? getPublishedStories() : getStoriesByAgeGroup(filter);

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">📚 Privacy Panda Stories</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-lg">
          Short stories and activities to help children navigate the Digital Bamboo Forest safely.
        </p>
      </div>

      <div className="mb-6">
        <ComingSoonBanner />
      </div>

      <div className="flex gap-2 flex-wrap mb-8" role="group" aria-label="Filter by age">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === value
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {stories.length === 0 ? (
        <p className="text-gray-400 dark:text-gray-500 text-sm">No stories available for this age group yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      )}
    </main>
  );
}
