import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Fingerprint, LayoutDashboard, Library } from 'lucide-react';
import { getStoryBySlug, isFoundationStory, isStoryPublished } from '../data/stories';
import { BambooForestStoryExperience } from '../components/stories/BambooForestStoryExperience';
import { ChapterStoryExperience } from '../components/stories/ChapterStoryExperience';
import PageLayout from '../components/layout/PageLayout';

/** Shown at the bottom of every published story — guides readers to the next logical step. */
function StoryNextSteps() {
  return (
    <section
      className="mt-10 rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800"
      aria-labelledby="story-next-steps-heading"
    >
      <h2
        id="story-next-steps-heading"
        className="mb-1 text-lg font-bold text-gray-900 dark:text-gray-100"
      >
        What's next?
      </h2>
      <p className="mb-5 text-sm text-gray-600 dark:text-gray-300">
        Stories are a starting point — here are three ways to keep the conversation going with your family.
      </p>
      <ul className="grid gap-3 sm:grid-cols-3">
        <li>
          <Link
            to="/digital-footprint"
            className="group flex h-full flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-green-400 hover:shadow-md dark:border-gray-700 dark:bg-gray-700 dark:hover:border-green-500"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
              <Fingerprint size={18} aria-hidden />
            </span>
            <span className="block text-sm font-semibold text-gray-900 dark:text-white">
              See your family's footprint
            </span>
            <span className="block text-xs leading-relaxed text-gray-500 dark:text-gray-400">
              List the apps your family uses and see where your data goes.
            </span>
            <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-green-700 dark:text-green-400">
              Footprint review <ArrowRight size={13} aria-hidden />
            </span>
          </Link>
        </li>
        <li>
          <Link
            to="/family-hub"
            className="group flex h-full flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-teal-400 hover:shadow-md dark:border-gray-700 dark:bg-gray-700 dark:hover:border-teal-500"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
              <LayoutDashboard size={18} aria-hidden />
            </span>
            <span className="block text-sm font-semibold text-gray-900 dark:text-white">
              Try a privacy mission
            </span>
            <span className="block text-xs leading-relaxed text-gray-500 dark:text-gray-400">
              Age-matched activities your family does together, saved on this device.
            </span>
            <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-teal-700 dark:text-teal-400">
              Family Hub <ArrowRight size={13} aria-hidden />
            </span>
          </Link>
        </li>
        <li>
          <Link
            to="/stories"
            className="group flex h-full flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-emerald-400 hover:shadow-md dark:border-gray-700 dark:bg-gray-700 dark:hover:border-emerald-500"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
              <Library size={18} aria-hidden />
            </span>
            <span className="block text-sm font-semibold text-gray-900 dark:text-white">
              Read another episode
            </span>
            <span className="block text-xs leading-relaxed text-gray-500 dark:text-gray-400">
              Browse all Privacy Panda stories, filtered by age.
            </span>
            <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              All stories <ArrowRight size={13} aria-hidden />
            </span>
          </Link>
        </li>
      </ul>
    </section>
  );
}

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
        subtitle="Read aloud with sound effects, or switch to quiet chapter mode—same story, two ways."
        breadcrumbs
      >
        <BambooForestStoryExperience story={story} />
        <StoryNextSteps />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={story.title}
      subtitle="Read aloud with sound effects, or switch to quiet chapter mode—same story, two ways."
      breadcrumbs
    >
      <ChapterStoryExperience story={story} />
      <StoryNextSteps />
    </PageLayout>
  );
}
