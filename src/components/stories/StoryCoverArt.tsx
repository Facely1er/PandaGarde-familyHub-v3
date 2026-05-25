import { useState } from 'react';
import { Story, isFoundationStory } from '../../data/stories';
import { getStoryCoverPosition, getStoryCoverUrl } from '../../data/storyCoverAssets';

const PANDAGARDE_LOGO = '/LogoPandagarde.png';

interface StoryCoverArtProps {
  story: Story;
  /** hero = list featured block; card = grid tile; banner = reader header (shorter); inline = compact row */
  variant: 'hero' | 'card' | 'banner' | 'inline';
}

function coverPosition(story: Story, variant: StoryCoverArtProps['variant']): string {
  return getStoryCoverPosition(story, variant === 'hero' ? 'hero' : 'card');
}

function CoverImage({
  coverUrl,
  position,
  onError,
  hoverZoom = false,
}: {
  coverUrl: string;
  position: string;
  onError: () => void;
  hoverZoom?: boolean;
}) {
  return (
    <img
      src={coverUrl}
      alt=""
      width={512}
      height={640}
      className={`story-cover-art__img${hoverZoom ? ' transition-transform duration-300 group-hover:scale-[1.02]' : ''}`}
      style={{ objectPosition: position }}
      aria-hidden
      loading="lazy"
      decoding="async"
      onError={onError}
    />
  );
}

function CoverFallback({
  story,
  sizeClass,
}: {
  story: Story;
  sizeClass: string;
}) {
  return (
    <div
      className={`story-cover-art ${story.coverColor} ${sizeClass} flex items-center justify-center text-5xl`}
      aria-hidden
    >
      <span>{story.coverEmoji}</span>
    </div>
  );
}

export function StoryCoverArt({ story, variant }: StoryCoverArtProps) {
  const isFoundation = isFoundationStory(story);
  const coverUrl = getStoryCoverUrl(story);
  const [failed, setFailed] = useState(false);
  const position = coverPosition(story, variant);

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
    if (coverUrl && !failed) {
      return (
        <div className="story-cover-art story-cover-art--thumb">
          <CoverImage coverUrl={coverUrl} position={position} onError={() => setFailed(true)} />
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
    if (coverUrl && !failed) {
      return (
        <div className="story-cover-art story-cover-art--hero">
          <CoverImage coverUrl={coverUrl} position={position} onError={() => setFailed(true)} />
          <div
            className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-emerald-900/25 to-transparent"
            aria-hidden
          />
        </div>
      );
    }
    return <CoverFallback story={story} sizeClass="story-cover-art--hero" />;
  }

  const cardSizeClass =
    variant === 'banner' ? 'story-cover-art--banner' : 'story-cover-art--card';

  if (coverUrl && !failed) {
    return (
      <div className={`story-cover-art ${cardSizeClass}`}>
        <CoverImage
          coverUrl={coverUrl}
          position={position}
          onError={() => setFailed(true)}
          hoverZoom={variant === 'card'}
        />
        <div
          className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-gray-900/35 via-transparent to-transparent dark:from-gray-950/45"
          aria-hidden
        />
      </div>
    );
  }

  return <CoverFallback story={story} sizeClass={cardSizeClass} />;
}
