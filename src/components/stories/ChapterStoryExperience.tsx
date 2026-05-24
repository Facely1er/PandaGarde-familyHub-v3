import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Story } from '../../data/stories';
import { StoryCoverArt } from './StoryCoverArt';
import { StoryReader } from './StoryReader';

interface ChapterStoryExperienceProps {
  story: Story;
}

/** Chapter-only reader for continuation episodes (2+). */
export function ChapterStoryExperience({ story }: ChapterStoryExperienceProps) {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-12">
      <Link
        to="/stories"
        className="mb-6 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-950/50 min-h-[44px]"
      >
        <ArrowLeft size={18} aria-hidden />
        All stories
      </Link>

      <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <StoryCoverArt story={story} variant="card" />
        <div className="p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-green-700 dark:text-green-400 mb-2">
            Episode {story.episodeNumber} · Chapter reader
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{story.summary}</p>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {story.chapters.length} chapters · {story.activities.length} activities
          </p>
        </div>
      </div>

      <StoryReader key={story.id} story={story} embedded showBackLink={false} />
    </div>
  );
}
