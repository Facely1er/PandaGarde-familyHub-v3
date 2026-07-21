import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, Fingerprint, LayoutDashboard, Library, Users } from 'lucide-react';
import { getStoryBySlug, isFoundationStory, isStoryPublished } from '../data/stories';
import { localizeStoryMeta } from '../data/storyI18n';
import { STORY_CAST_PATH } from '../data/forestCharacters';
import { BambooForestStoryExperience } from '../components/stories/BambooForestStoryExperience';
import { ChapterStoryExperience } from '../components/stories/ChapterStoryExperience';
import PageLayout from '../components/layout/PageLayout';

/** Shown at the bottom of every published story — guides readers to the next logical step. */
function StoryNextSteps() {
  const { t } = useTranslation();
  return (
    <section
      className="mt-10 rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800"
      aria-labelledby="story-next-steps-heading"
    >
      <h2
        id="story-next-steps-heading"
        className="mb-1 text-lg font-bold text-gray-900 dark:text-gray-100"
      >
        {t('stories.reader.nextStepsHeading')}
      </h2>
      <p className="mb-5 text-sm text-gray-600 dark:text-gray-300">
        {t('stories.reader.nextStepsIntro')}
      </p>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <li>
          <Link
            to="/digital-footprint"
            className="group flex h-full flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-green-400 hover:shadow-md dark:border-gray-700 dark:bg-gray-700 dark:hover:border-green-500"
          >
            <span className="flex items-center gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                <Fingerprint size={18} aria-hidden />
              </span>
              <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                {t('stories.reader.footprintTitle')}
              </span>
            </span>
            <span className="block text-xs leading-relaxed text-gray-500 dark:text-gray-400">
              {t('stories.reader.footprintDesc')}
            </span>
            <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-green-700 dark:text-green-400">
              {t('stories.reader.footprintCta')} <ArrowRight size={13} aria-hidden />
            </span>
          </Link>
        </li>
        <li>
          <Link
            to="/family-hub"
            className="group flex h-full flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-teal-400 hover:shadow-md dark:border-gray-700 dark:bg-gray-700 dark:hover:border-teal-500"
          >
            <span className="flex items-center gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                <LayoutDashboard size={18} aria-hidden />
              </span>
              <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                {t('stories.reader.missionTitle')}
              </span>
            </span>
            <span className="block text-xs leading-relaxed text-gray-500 dark:text-gray-400">
              {t('stories.reader.missionDesc')}
            </span>
            <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-teal-700 dark:text-teal-400">
              {t('stories.reader.missionCta')} <ArrowRight size={13} aria-hidden />
            </span>
          </Link>
        </li>
        <li>
          <Link
            to="/stories"
            className="group flex h-full flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-emerald-400 hover:shadow-md dark:border-gray-700 dark:bg-gray-700 dark:hover:border-emerald-500"
          >
            <span className="flex items-center gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                <Library size={18} aria-hidden />
              </span>
              <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                {t('stories.reader.anotherTitle')}
              </span>
            </span>
            <span className="block text-xs leading-relaxed text-gray-500 dark:text-gray-400">
              {t('stories.reader.anotherDesc')}
            </span>
            <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              {t('stories.reader.anotherCta')} <ArrowRight size={13} aria-hidden />
            </span>
          </Link>
        </li>
        <li>
          <Link
            to={STORY_CAST_PATH}
            className="group flex h-full flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-amber-400 hover:shadow-md dark:border-gray-700 dark:bg-gray-700 dark:hover:border-amber-500"
          >
            <span className="flex items-center gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                <Users size={18} aria-hidden />
              </span>
              <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                {t('stories.reader.castTitle')}
              </span>
            </span>
            <span className="block text-xs leading-relaxed text-gray-500 dark:text-gray-400">
              {t('stories.reader.castDesc')}
            </span>
            <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
              {t('stories.reader.castCta')} <ArrowRight size={13} aria-hidden />
            </span>
          </Link>
        </li>
      </ul>
    </section>
  );
}

/** Maps the active i18n language to a BCP-47 locale for date formatting. */
function dateLocaleFor(language: string | undefined): string {
  const lang = (language || 'en').split('-')[0];
  if (lang === 'fr') {return 'fr-FR';}
  if (lang === 'es') {return 'es-ES';}
  return 'en-US';
}

export function StoryReaderPage() {
  const { t, i18n } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const story = slug ? getStoryBySlug(slug) : undefined;
  const published = story ? isStoryPublished(story) : false;
  const localizedTitle = story ? localizeStoryMeta(story, i18n.language).title : '';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!story) {
    return (
      <PageLayout title={t('stories.reader.notFoundTitle')} subtitle={t('stories.reader.notFoundSubtitle')} breadcrumbs>
        <div className="mx-auto max-w-lg px-4 py-12 text-center">
          <p className="text-4xl mb-4" aria-hidden>
            🐼
          </p>
          <Link
            to="/stories"
            className="inline-flex items-center gap-2 text-sm font-medium text-green-700 hover:underline dark:text-green-400"
          >
            <ArrowLeft size={16} aria-hidden />
            {t('stories.reader.backToStories')}
          </Link>
        </div>
      </PageLayout>
    );
  }

  if (!published) {
    const releaseLabel = story.scheduledAt
      ? new Date(story.scheduledAt).toLocaleDateString(dateLocaleFor(i18n.language), {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      : null;

    return (
      <PageLayout
        title={t('stories.reader.comingSoonTitle')}
        subtitle={
          releaseLabel
            ? t('stories.reader.scheduledFor', { title: localizedTitle, date: releaseLabel })
            : t('stories.reader.notAvailableYet', { title: localizedTitle })
        }
        breadcrumbs
      >
        <div className="mx-auto max-w-lg px-4 py-12 text-center space-y-4">
          <p className="text-5xl" aria-hidden>
            {story.coverEmoji}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {t('stories.reader.comingSoonBody')}
          </p>
          <Link
            to="/stories"
            className="inline-flex items-center gap-2 text-sm font-medium text-green-700 hover:underline dark:text-green-400"
          >
            <ArrowLeft size={16} aria-hidden />
            {t('stories.reader.backToStories')}
          </Link>
        </div>
      </PageLayout>
    );
  }

  if (isFoundationStory(story)) {
    return (
      <PageLayout
        title={localizedTitle}
        subtitle={t('stories.readerSubtitle')}
        breadcrumbs
      >
        <div className="story-page-shell">
          <BambooForestStoryExperience story={story} />
          <StoryNextSteps />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={localizedTitle}
      subtitle={t('stories.readerSubtitle')}
      breadcrumbs
    >
      <div className="story-page-shell">
        <ChapterStoryExperience story={story} />
        <StoryNextSteps />
      </div>
    </PageLayout>
  );
}
