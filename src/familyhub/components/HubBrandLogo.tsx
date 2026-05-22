import React from 'react';

/** Public asset copied to dist / dist-familyhub at build time */
export const HUB_LOGO_SRC = '/LogoPandagarde.png';

export type HubBrandLogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'hero' | 'header';

const sizeClasses: Record<HubBrandLogoSize, string> = {
  xs: 'h-7 w-7 rounded-lg',
  sm: 'h-10 w-10 rounded-xl',
  md: 'h-14 w-14 rounded-2xl',
  lg: 'h-20 w-20 rounded-2xl sm:h-24 sm:w-24',
  hero: 'h-20 w-20 rounded-2xl sm:h-24 sm:w-24',
  header: 'h-16 w-16 rounded-2xl sm:h-[4.5rem] sm:w-[4.5rem]',
};

interface HubBrandLogoProps {
  size?: HubBrandLogoSize;
  /** Subtle float animation (welcome / login heroes) */
  animated?: boolean;
  className?: string;
  alt?: string;
  /** Lighter frame for gradient headers */
  variant?: 'card' | 'header' | 'plain';
}

const variantClasses: Record<NonNullable<HubBrandLogoProps['variant']>, string> = {
  card: 'border-2 border-teal-200 bg-white shadow-lg dark:border-teal-700 dark:bg-gray-800',
  header: 'border border-white/40 bg-white/95 shadow-md dark:border-teal-700/40 dark:bg-gray-900/90',
  plain: 'border-0 bg-transparent shadow-none',
};

const HubBrandLogo: React.FC<HubBrandLogoProps> = ({
  size = 'lg',
  animated = false,
  className = '',
  alt = 'PandaGarde logo',
  variant = 'card',
}) => (
  <span
    className={[
      'flex shrink-0 items-center justify-center overflow-hidden',
      sizeClasses[size],
      variantClasses[variant],
      animated ? 'hub-mascot-float' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
  >
    <img
      src={HUB_LOGO_SRC}
      alt={alt}
      className="h-full w-full object-contain p-1"
      width={96}
      height={96}
      decoding="async"
    />
  </span>
);

export default HubBrandLogo;
