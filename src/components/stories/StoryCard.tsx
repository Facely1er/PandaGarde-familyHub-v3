import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Play } from 'lucide-react';
import { Story, isFoundationStory } from '../../data/stories';
import { localizeStoryMeta } from '../../data/storyI18n';
import { getStoryCoverUrl, hasStoryBundledCover } from '../../data/storyCoverAssets';
import { StoryCoverArt } from './StoryCoverArt';

export function StoryCard({ story }: { story: Story }) {
  const { t, i18n } = useTranslation();
  const meta = localizeStoryMeta(story, i18n.language);
  const isFoundation = isFoundationStory(story);
  const hasCoverArt = hasStoryBundledCover(story) || Boolean(getStoryCoverUrl(story));

  return (
    <Link
      to={`/stories/${story.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden no-underline text-inherit transition-all hover:border-green-600 dark:hover:border-green-500 hover:shadow-card-hover"
    >
      <StoryCoverArt story={story} variant="card" />

      <div className="flex min-h-0 flex-1 flex-col p-4">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-xs font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950 px-2 py-0.5 rounded-full">
            {t('stories.card.episode', { number: story.episodeNumber })}
          </span>
          {story.season > 1 ? (
            <span className="text-xs font-medium text-teal-800 dark:text-teal-200 bg-teal-100 dark:bg-teal-950 px-2 py-0.5 rounded-full">
              {t('stories.card.season', { number: story.season })}
            </span>
          ) : null}
          {!hasCoverArt && story.season > 1 ? (
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
              {t('stories.card.artComingSoon')}
            </span>
          ) : null}
          {story.ageGroups.map((ag) => (
            <span
              key={ag}
              className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full"
            >
              {t(`stories.filters.${ag}`)}
            </span>
          ))}
          {isFoundation && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
              <Play size={12} aria-hidden />
              {t('stories.card.interactiveChapters')}
            </span>
          )}
        </div>

        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base leading-snug mb-1">
          {meta.title}
        </h3>
        <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-2">{meta.privacyTopic}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 flex-1">{meta.summary}</p>
      </div>

      <div className="mt-auto px-4 pb-3 flex items-center justify-between">
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {t('stories.card.chaptersActivities', {
            chapters: story.chapters.length,
            activities: story.activities.length,
          })}
        </span>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 dark:text-green-400 group-hover:gap-2 transition-all">
          {isFoundation ? t('stories.card.begin') : t('stories.card.read')}
          <ChevronRight size={14} aria-hidden />
        </span>
      </div>
    </Link>
  );
}
