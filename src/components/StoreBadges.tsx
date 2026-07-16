import React from 'react';
import {
  FAMILY_HUB_APP_STORE_BADGE,
  FAMILY_HUB_APP_STORE_URL,
  FAMILY_HUB_PLAY_STORE_BADGE,
  FAMILY_HUB_PLAY_STORE_URL,
} from '../data/storeLinks';

type StoreBadgesProps = {
  className?: string;
  /** Badge height in pixels — width scales with official aspect ratio. */
  size?: 'sm' | 'md';
};

const BADGE_HEIGHT: Record<NonNullable<StoreBadgesProps['size']>, number> = {
  sm: 40,
  md: 46,
};

const StoreBadges: React.FC<StoreBadgesProps> = ({ className = '', size = 'md' }) => {
  const height = BADGE_HEIGHT[size];

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`.trim()}>
      <a
        href={FAMILY_HUB_APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex rounded-md transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 dark:focus-visible:outline-green-400"
        aria-label="Download PandaGarde Family Hub on the App Store (opens in a new tab)"
      >
        <img
          src={FAMILY_HUB_APP_STORE_BADGE}
          alt="Download on the App Store"
          width={Math.round((height * 156) / 46)}
          height={height}
          className="h-auto w-auto"
          loading="lazy"
          decoding="async"
        />
      </a>
      <a
        href={FAMILY_HUB_PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex rounded-md transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 dark:focus-visible:outline-green-400"
        aria-label="Get PandaGarde Family Hub on Google Play (opens in a new tab)"
      >
        <img
          src={FAMILY_HUB_PLAY_STORE_BADGE}
          alt="Get it on Google Play"
          width={Math.round((height * 156) / 46)}
          height={height}
          className="h-auto w-auto"
          loading="lazy"
          decoding="async"
        />
      </a>
    </div>
  );
};

export default StoreBadges;
