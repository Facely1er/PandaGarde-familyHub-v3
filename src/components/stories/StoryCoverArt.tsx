import { Story, isFoundationStory } from '../../data/stories';

const PANDAGARDE_LOGO = '/LogoPandagarde.png';

interface StoryCoverArtProps {
  story: Story;
  /** hero = list featured block; card = grid tile; inline = compact row (e.g. homepage) */
  variant: 'hero' | 'card' | 'inline';
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
  const position = story.coverImagePosition ?? 'center';
  const isVectorCover = story.coverImage?.endsWith('.svg');

  if (!story.coverImage) {
    return (
      <div
        className={`${story.coverColor} ${heightClass} flex items-center justify-center text-5xl border-b border-gray-100 dark:border-gray-700`}
      >
        <span aria-hidden>{story.coverEmoji}</span>
      </div>
    );
  }

  return (
    <div className={`relative ${heightClass} overflow-hidden border-b border-gray-100 dark:border-gray-700`}>
      <img
        src={story.coverImage}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        style={{ objectPosition: position }}
        aria-hidden
        loading="lazy"
        decoding="async"
      />
      <div
        className={
          isVectorCover
            ? 'absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-transparent dark:from-gray-950/60'
            : 'absolute inset-0 bg-gradient-to-t from-gray-900/75 via-gray-900/25 to-emerald-900/10 dark:from-gray-950/85 dark:via-gray-900/40'
        }
        aria-hidden
      />
      {showLogoOverlay && (
        <div className="absolute inset-0 flex items-center justify-center p-4">
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
    if (story.coverImage) {
      return (
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600">
          <img
            src={story.coverImage}
            alt=""
            className="h-full w-full object-cover"
            style={{ objectPosition: story.coverImagePosition ?? 'center' }}
            aria-hidden
            loading="lazy"
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
    if (story.coverImage) {
      return (
        <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-2xl border border-emerald-200/80 shadow-sm dark:border-emerald-800/60 sm:h-32 sm:w-44">
          <img
            src={story.coverImage}
            alt=""
            className="h-full w-full object-cover"
            style={{ objectPosition: story.coverImagePosition ?? 'center' }}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/50 to-transparent" aria-hidden />
          {isFoundation && (
            <div className="absolute inset-0 flex items-center justify-center">
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
