import { useState } from 'react';
import { Story, isFoundationStory } from '../../data/stories';
import { getStoryCoverUrl } from '../../data/storyCoverAssets';

const PANDAGARDE_LOGO = '/LogoPandagarde.png';

interface StoryCoverArtProps {
  story: Story;
  /** hero = list featured block; card = grid tile; inline = compact row (e.g. homepage) */
  variant: 'hero' | 'card' | 'inline';
}

function CoverFallback({
  story,
  heightClass,
}: {
  story: Story;
  heightClass: string;
}) {
  return (
    <div
      className={`${story.coverColor} ${heightClass} flex items-center justify-center text-5xl border-b border-gray-100 dark:border-gray-700`}
    >
      <span aria-hidden>{story.coverEmoji}</span>
    </div>
  );
}

function StoryCoverImage({
  story,
  heightClass,
  showLogoOverlay,
}: {
  story: Story;
  heightClass: string;
  showLogoOverlay?: boolean;
}) {
  const [coverFailed, setCoverFailed] = useState(false);
  const coverUrl = getStoryCoverUrl(story);
  const position = story.coverImagePosition ?? 'center';

  if (!coverUrl || coverFailed) {
    return <CoverFallback story={story} heightClass={heightClass} />;
  }

  return (
    <div className={`relative ${heightClass} overflow-hidden border-b border-gray-100 dark:border-gray-700 ${story.coverColor}`}>
      <img
        src={coverUrl}
        alt=""
        width={640}
        height={360}
        className="absolute inset-0 z-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        style={{ objectPosition: position }}
        aria-hidden
        loading="lazy"
        decoding="async"
        onError={() => setCoverFailed(true)}
      />
      <div
        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent dark:from-gray-950/50"
        aria-hidden
      />
      {showLogoOverlay && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center p-4">
          <img
            src={PANDAGARDE_LOGO}
            alt=""
            className="h-20 w-20 object-contain drop-shadow-lg sm:h-24 sm:w-24"
            aria-hidden
          />
        </div>
      )}
    </div>
  );
}

export function StoryCoverArt({ story, variant }: StoryCoverArtProps) {
  const isFoundation = isFoundationStory(story);
  const coverUrl = getStoryCoverUrl(story);
  const [heroFailed, setHeroFailed] = useState(false);

  if (variant === 'inline') {
    if (isFoundation) {
      return (
        <img
          src={PANDAGARDE_LOGO}
          alt=""
          className="h-12 w-12 shrink-0 rounded-lg bg-white object-contain p-1 shadow-sm dark:bg-gray-900"
          aria-hidden
        />
      );
    }
    if (coverUrl) {
      return (
        <div className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600 ${story.coverColor}`}>
          <img
            src={coverUrl}
            alt=""
            width={48}
            height={48}
            className="h-full w-full object-cover"
            style={{ objectPosition: story.coverImagePosition ?? 'center' }}
            aria-hidden
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      );
    }
    return (
      <span className="shrink-0 text-3xl" aria-hidden>
        {story.coverEmoji}
      </span>
    );
  }

  if (variant === 'hero') {
    if (coverUrl && !heroFailed) {
      return (
        <div className={`relative h-28 w-full shrink-0 overflow-hidden rounded-2xl border border-emerald-200/80 shadow-sm dark:border-emerald-800/60 sm:h-32 sm:w-44 ${story.coverColor}`}>
          <img
            src={coverUrl}
            alt=""
            width={640}
            height={360}
            className="absolute inset-0 z-0 h-full w-full object-cover"
            style={{ objectPosition: story.coverImagePosition ?? 'center' }}
            loading="lazy"
            onError={() => setHeroFailed(true)}
          />
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-emerald-900/40 to-transparent" aria-hidden />
          {isFoundation && (
            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
              <img
                src={PANDAGARDE_LOGO}
                alt="PandaGarde"
                className="h-16 w-16 object-contain drop-shadow-md sm:h-20 sm:w-20"
              />
            </div>
          )}
        </div>
      );
    }
    return (
      <span className="shrink-0 text-5xl" aria-hidden>
        {story.coverEmoji}
      </span>
    );
  }

  return (
    <StoryCoverImage
      story={story}
      heightClass="h-36 sm:h-40"
      showLogoOverlay={isFoundation}
    />
  );
}
