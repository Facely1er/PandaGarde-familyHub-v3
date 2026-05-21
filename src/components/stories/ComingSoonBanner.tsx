import { getNextScheduledStory } from '../../data/stories';
import { getStoryCoverUrl } from '../../data/storyCoverAssets';

export function ComingSoonBanner() {
  const next = getNextScheduledStory();
  const coverUrl = next ? getStoryCoverUrl(next) : undefined;
  if (!next) return null;

  const releaseDate = new Date(next.scheduledAt!);
  const formatted = releaseDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 px-4 py-3 flex items-center gap-3 overflow-hidden">
      {coverUrl ? (
        <div className="story-cover-art h-14 w-14 shrink-0 rounded-lg border border-amber-200/60 dark:border-amber-800/60">
          <img
            src={coverUrl}
            alt=""
            className="story-cover-art__img"
            style={{ objectPosition: next.coverImagePosition ?? 'center' }}
            aria-hidden
            loading="lazy"
          />
        </div>
      ) : (
        <span className="text-xl shrink-0" aria-hidden="true">
          {next.coverEmoji}
        </span>
      )}
      <div>
        <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">Coming {formatted}</p>
        <p className="text-xs text-amber-700 dark:text-amber-300">{next.title}</p>
      </div>
    </div>
  );
}
