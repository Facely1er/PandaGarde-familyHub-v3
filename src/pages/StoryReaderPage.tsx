import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getStoryBySlug, isFoundationStory, isStoryPublished } from '../data/stories';
import { BambooForestStoryExperience } from '../components/stories/BambooForestStoryExperience';
import { StoryReader } from '../components/stories/StoryReader';
import PageLayout from '../components/layout/PageLayout';

export function StoryReaderPage() {
  const { slug } = useParams<{ slug: string }>();
  const story = slug ? getStoryBySlug(slug) : undefined;
  const published = story ? isStoryPublished(story) : false;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!story) {
    return (
      <PageLayout title="Story not found" subtitle="This story may not exist yet or the link may be wrong." breadcrumbs>
        <div className="mx-auto max-w-lg px-4 py-12 text-center">
          <p className="text-4xl mb-4" aria-hidden>
            🐼
          </p>
          <Link
            to="/stories"
            className="inline-flex items-center gap-2 text-sm font-medium text-green-700 hover:underline dark:text-green-400"
          >
            <ArrowLeft size={16} aria-hidden />
            Back to all stories
          </Link>
        </div>
      </PageLayout>
    );
  }

  if (!published) {
    const releaseLabel = story.scheduledAt
      ? new Date(story.scheduledAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      : null;

    return (
      <PageLayout
        title="Coming soon"
        subtitle={releaseLabel ? `${story.title} is scheduled for ${releaseLabel}.` : `${story.title} is not available yet.`}
        breadcrumbs
      >
        <div className="mx-auto max-w-lg px-4 py-12 text-center space-y-4">
          <p className="text-5xl" aria-hidden>
            {story.coverEmoji}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Browse published episodes on the stories page while you wait.
          </p>
          <Link
            to="/stories"
            className="inline-flex items-center gap-2 text-sm font-medium text-green-700 hover:underline dark:text-green-400"
          >
            <ArrowLeft size={16} aria-hidden />
            Back to all stories
          </Link>
        </div>
      </PageLayout>
    );
  }

  if (isFoundationStory(story)) {
    return (
      <PageLayout
        title={story.title}
        subtitle="Interactive scenes with narration, or a calm chapter reader—two paths through the Digital Bamboo Forest."
        breadcrumbs
      >
        <BambooForestStoryExperience story={story} />
      </PageLayout>
    );
  }

  return (
    <PageLayout title={story.title} subtitle={story.privacyTopic} breadcrumbs>
      <StoryReader story={story} embedded />
    </PageLayout>
  );
}
