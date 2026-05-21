import { Link } from 'react-router-dom';
import { Story } from '../../data/stories';

const AGE_LABELS: Record<string, string> = {
  early: 'Ages 5–7',
  middle: 'Ages 8–10',
  older: 'Ages 11–13',
};

export function StoryCard({ story }: { story: Story }) {
  return (
    <Link
      to={`/stories/${story.slug}`}
      className="block rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-500 hover:shadow-md transition-all duration-200 overflow-hidden bg-white dark:bg-gray-800"
    >
      <div className={`${story.coverColor} flex items-center justify-center h-32 text-5xl`}>
        {story.coverEmoji}
      </div>

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
          {story.isOrigin && (
            <span className="text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-full">
              Origin Story
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
        <span className="text-xs font-medium text-green-600 dark:text-green-400">Read →</span>
      </div>
    </Link>
  );
}
