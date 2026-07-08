import React from 'react';
import { BookOpen, ExternalLink } from 'lucide-react';
import { getStoryBySlug } from '../../data/stories';
import { getStorySlugForMission } from '../../data/storyMissionLinks';
import { openStoryBySlug } from '../../lib/storyHubLinks';

interface RelatedStoryLinkProps {
  missionId: string;
  /** `chip` for catalogue cards; `panel` for mission intro */
  variant?: 'chip' | 'panel';
  className?: string;
  onNavigate?: () => void;
}

/**
 * Optional “read the related episode first” link for a Family Hub mission.
 * Opens in-app on the marketing site; system browser when Hub is standalone.
 */
const RelatedStoryLink: React.FC<RelatedStoryLinkProps> = ({
  missionId,
  variant = 'panel',
  className = '',
  onNavigate,
}) => {
  const storySlug = getStorySlugForMission(missionId);
  const story = storySlug ? getStoryBySlug(storySlug) : undefined;

  if (!storySlug || !story) {
    return null;
  }

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    onNavigate?.();
    void openStoryBySlug(storySlug);
  };

  if (variant === 'chip') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-semibold text-violet-800 ring-1 ring-violet-200 transition-colors hover:bg-violet-100 dark:bg-violet-900/30 dark:text-violet-200 dark:ring-violet-700/50 dark:hover:bg-violet-900/50 ${className}`}
      >
        <BookOpen size={12} aria-hidden="true" />
        Episode {story.episodeNumber}
        <ExternalLink size={11} className="opacity-70" aria-hidden="true" />
      </button>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-violet-200 bg-violet-50/80 p-4 dark:border-violet-700/40 dark:bg-violet-900/20 ${className}`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">
        Optional — read together first
      </p>
      <p className="mt-1 text-sm text-gray-700 dark:text-gray-200">
        Episode {story.episodeNumber}: <span className="font-semibold">{story.title}</span>
      </p>
      <button
        type="button"
        onClick={handleClick}
        className="mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-violet-300 bg-white px-4 py-2 text-sm font-semibold text-violet-800 transition-colors hover:bg-violet-50 dark:border-violet-600 dark:bg-violet-950/40 dark:text-violet-200 dark:hover:bg-violet-900/40"
      >
        <BookOpen size={16} aria-hidden="true" />
        Read the story
        <ExternalLink size={14} className="opacity-70" aria-hidden="true" />
      </button>
    </div>
  );
};

export default RelatedStoryLink;
