import { useParams, Link } from 'react-router-dom';
import { getStoryBySlug } from '../data/stories';
import { StoryReader } from '../components/stories/StoryReader';

export function StoryReaderPage() {
  const { slug } = useParams<{ slug: string }>();
  const story = slug ? getStoryBySlug(slug) : undefined;

  if (!story) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-4xl mb-4" aria-hidden="true">
          🐼
        </p>
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Story not found</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
          This story may not exist yet or the link may be wrong.
        </p>
        <Link to="/stories" className="text-green-600 dark:text-green-400 hover:underline text-sm font-medium">
          ← Back to all stories
        </Link>
      </div>
    );
  }

  return <StoryReader story={story} />;
}
