import React from 'react';
import { APP_STORE_URL, GOOGLE_PLAY_URL } from '../data/appStoreLinks';

type BadgeSize = 'sm' | 'md' | 'lg';

interface AppStoreBadgesProps {
  /** Extra classes for the flex wrapper. */
  className?: string;
  /** Horizontal alignment of the badge pair. */
  align?: 'start' | 'center';
  /** Visual size preset. */
  size?: BadgeSize;
}

/**
 * The official Apple badge fills its artboard, while the official Google Play
 * badge ships with ~34% transparent vertical padding built in. To make both
 * buttons appear the SAME visual size, the Google badge is rendered taller by
 * that ratio (250 / 166 ≈ 1.5x the Apple height). Its transparent padding then
 * doubles as the brand-required clear space.
 */
const BADGE_HEIGHTS: Record<BadgeSize, { apple: string; google: string }> = {
  sm: { apple: 'h-10', google: 'h-[60px]' },
  md: { apple: 'h-12', google: 'h-[72px]' },
  lg: { apple: 'h-14', google: 'h-[84px]' },
};

const AppStoreBadges: React.FC<AppStoreBadgesProps> = ({
  className = '',
  align = 'center',
  size = 'md',
}) => {
  const heights = BADGE_HEIGHTS[size];
  const justify = align === 'center' ? 'justify-center' : 'justify-start';

  return (
    <div className={`flex flex-wrap items-center gap-2 sm:gap-4 ${justify} ${className}`}>
      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Download PandaGarde Family Hub on the Apple App Store"
        className="inline-flex rounded-lg transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
      >
        <img
          src="/store-badges/download-on-the-app-store.svg"
          alt="Download on the App Store"
          className={`${heights.apple} w-auto`}
          loading="lazy"
        />
      </a>
      <a
        href={GOOGLE_PLAY_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Get PandaGarde Family Hub on Google Play"
        className="inline-flex rounded-lg transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
      >
        <img
          src="/store-badges/get-it-on-google-play.png"
          alt="Get it on Google Play"
          className={`${heights.google} w-auto`}
          loading="lazy"
        />
      </a>
    </div>
  );
};

export default AppStoreBadges;
