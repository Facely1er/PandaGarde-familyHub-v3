import { Story, isFoundationStory } from '../../data/stories';

const PANDAGARDE_LOGO = '/LogoPandagarde.png';

interface StoryCoverArtProps {
  story: Story;
  /** hero = list featured block; card = grid tile; inline = compact row (e.g. homepage) */
  variant: 'hero' | 'card' | 'inline';
}

export function StoryCoverArt({ story, variant }: StoryCoverArtProps) {
  const useLogo = isFoundationStory(story);

  if (useLogo) {
    if (variant === 'inline') {
      return (
        <img
          src={PANDAGARDE_LOGO}
          alt=""
          className="h-12 w-12 shrink-0 rounded-lg bg-white object-contain p-1 shadow-sm dark:bg-gray-900"
          aria-hidden
        />
      );
    }

    if (variant === 'hero') {
      return (
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-emerald-200/80 bg-white p-2 shadow-sm dark:border-emerald-800/60 dark:bg-gray-900 sm:h-24 sm:w-24">
          <img
            src={PANDAGARDE_LOGO}
            alt="PandaGarde"
            className="h-full w-full object-contain"
          />
        </div>
      );
    }

    return (
      <div
        className={`${story.coverColor} flex h-32 items-center justify-center border-b border-gray-100 dark:border-gray-700`}
      >
        <img
          src={PANDAGARDE_LOGO}
          alt=""
          className="h-24 w-24 object-contain"
          aria-hidden
        />
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <span className="shrink-0 text-5xl" aria-hidden>
        {story.coverEmoji}
      </span>
    );
  }

  return (
    <div className={`${story.coverColor} flex h-32 items-center justify-center text-5xl`}>
      <span aria-hidden>{story.coverEmoji}</span>
    </div>
  );
}
