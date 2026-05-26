import { Link } from 'react-router-dom';
import { ChevronRight, Play } from 'lucide-react';
import { Story, isFoundationStory } from '../../data/stories';
import { StoryCoverArt } from './StoryCoverArt';

const AGE_LABELS: Record<string, string> = {
  early: 'Ages 5–7',
  middle: 'Ages 8–10',
  older: 'Ages 11–13',
};

export function StoryCard({ story }: { story: Story }) {
  const isFoundation = isFoundationStory(story);

  return (
    <Link
      to={`/stories/${story.slug}`}
      className="group block rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-200 overflow-hidden no-underline text-inherit transition-all hover:border-green-600 dark:hover:border-green-500 hover:shadow-card-hover"
    >
      <StoryCoverArt story={story} variant="card" />

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-xs font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950 px-2 py-0.5 rounded-full">
            Episode {story.episodeNumber}
          </span>
          {story.ageGroups.map((ag) => (
            <span
              key={ag}
              className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full"
            >
              {AGE_LABELS[ag]}
            </span>
          ))}
          {isFoundation && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
              <Play size={12} aria-hidden />
              Interactive + chapters
            </span>
          )}
        </div>

        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base leading-snug mb-1">
          {story.title}
        </h3>
        <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-2">{story.privacyTopic}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{story.summary}</p>
      </div>

      <div className="px-4 pb-3 flex items-center justify-between">
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {story.chapters.length} chapters · {story.activities.length} activities
        </span>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 dark:text-green-400 group-hover:gap-2 transition-all">
          {isFoundation ? 'Begin' : 'Read'}
          <ChevronRight size={14} aria-hidden />
        </span>
      </div>
    </Link>
  );
}
