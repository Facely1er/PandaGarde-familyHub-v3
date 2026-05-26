import { Link } from 'react-router-dom';
import { Story } from '../../data/stories';
import { ActivityCard } from './ActivityCard';

interface StoryEpilogueProps {
  story: Story;
  className?: string;
  id?: string;
}

export function StoryEpilogue({ story, className = '', id }: StoryEpilogueProps) {
  return (
    <section
      id={id}
      className={`mt-8 space-y-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-200 p-6 sm:p-8 ${className}`}
      aria-labelledby="story-epilogue-heading"
    >
      <h2 id="story-epilogue-heading" className="text-lg font-bold text-gray-900 dark:text-gray-100">
        After the story
      </h2>

      <div className="rounded-2xl bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 p-5">
        <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider mb-2">
          Privacy Panda&apos;s lesson
        </p>
        <p className="text-green-800 dark:text-green-200 font-medium text-base leading-relaxed">
          &ldquo;{story.keyLesson}&rdquo;
        </p>
      </div>

      {story.activities.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-3">
            Activities for this story
          </h3>
          {story.activities.map((act) => (
            <ActivityCard key={act.id} activity={act} />
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link to="/stories" className="button button-primary">
          Read more stories
        </Link>
        <Link to="/activity-book" className="button button-secondary">
          Activity book
        </Link>
      </div>
    </section>
  );
}
