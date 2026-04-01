import React from 'react';

export interface SkeletonProps {
  /** Width of the skeleton */
  width?: string | number;
  /** Height of the skeleton */
  height?: string | number;
  /** Border radius */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Additional CSS classes */
  className?: string;
  /** Accessible label for screen readers */
  label?: string;
}

const roundedClasses = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
};

/**
 * Skeleton loading placeholder component.
 * Respects reduced motion preferences.
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  rounded = 'md',
  className = '',
  label = 'Loading...',
}) => {
  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={`
        bg-gray-200 dark:bg-gray-700
        animate-pulse
        motion-reduce:animate-none motion-reduce:opacity-70
        ${roundedClasses[rounded]}
        ${className}
      `}
      style={style}
      role="status"
      aria-label={label}
    >
      <span className="sr-only">{label}</span>
    </div>
  );
};

export interface SkeletonTextProps {
  /** Number of lines */
  lines?: number;
  /** Gap between lines */
  gap?: 'sm' | 'md' | 'lg';
  /** Last line width (percentage) */
  lastLineWidth?: number;
  /** Additional CSS classes */
  className?: string;
}

const gapClasses = {
  sm: 'space-y-2',
  md: 'space-y-3',
  lg: 'space-y-4',
};

/**
 * Skeleton text placeholder for paragraph-like content.
 */
export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 3,
  gap = 'md',
  lastLineWidth = 60,
  className = '',
}) => {
  return (
    <div 
      className={`${gapClasses[gap]} ${className}`}
      role="status"
      aria-label="Loading text content..."
    >
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          height={16}
          width={index === lines - 1 ? `${lastLineWidth}%` : '100%'}
          rounded="sm"
        />
      ))}
    </div>
  );
};

export interface SkeletonCardProps {
  /** Show avatar placeholder */
  showAvatar?: boolean;
  /** Show image placeholder */
  showImage?: boolean;
  /** Number of text lines */
  textLines?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Skeleton card placeholder for card-like content.
 */
export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  showAvatar = false,
  showImage = false,
  textLines = 3,
  className = '',
}) => {
  return (
    <div
      className={`
        bg-white dark:bg-gray-800 
        rounded-xl 
        border border-gray-200 dark:border-gray-700
        p-6
        ${className}
      `}
      role="status"
      aria-label="Loading content..."
    >
      {/* Image placeholder */}
      {showImage && (
        <Skeleton 
          width="100%" 
          height={200} 
          rounded="lg" 
          className="mb-4"
        />
      )}

      {/* Header with optional avatar */}
      <div className="flex items-center gap-4 mb-4">
        {showAvatar && (
          <Skeleton width={48} height={48} rounded="full" />
        )}
        <div className="flex-1 space-y-2">
          <Skeleton height={20} width="60%" rounded="sm" />
          <Skeleton height={14} width="40%" rounded="sm" />
        </div>
      </div>

      {/* Text content */}
      <SkeletonText lines={textLines} />

      {/* Action placeholder */}
      <div className="mt-4 flex gap-3">
        <Skeleton width={100} height={36} rounded="lg" />
        <Skeleton width={80} height={36} rounded="lg" />
      </div>
    </div>
  );
};

export interface SkeletonListProps {
  /** Number of items */
  count?: number;
  /** Type of list items */
  variant?: 'simple' | 'avatar' | 'card';
  /** Additional CSS classes */
  className?: string;
}

/**
 * Skeleton list placeholder for list content.
 */
export const SkeletonList: React.FC<SkeletonListProps> = ({
  count = 5,
  variant = 'simple',
  className = '',
}) => {
  return (
    <div 
      className={`space-y-4 ${className}`}
      role="status"
      aria-label="Loading list..."
    >
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index}
          className={`
            flex items-center gap-4 p-4
            bg-white dark:bg-gray-800
            rounded-lg
            border border-gray-200 dark:border-gray-700
          `}
        >
          {variant === 'avatar' && (
            <Skeleton width={40} height={40} rounded="full" />
          )}
          {variant === 'card' && (
            <Skeleton width={80} height={60} rounded="md" />
          )}
          <div className="flex-1 space-y-2">
            <Skeleton height={16} width="70%" rounded="sm" />
            <Skeleton height={12} width="50%" rounded="sm" />
          </div>
          <Skeleton width={60} height={32} rounded="md" />
        </div>
      ))}
    </div>
  );
};

// Default export for convenience
const SkeletonLoader = {
  Base: Skeleton,
  Text: SkeletonText,
  Card: SkeletonCard,
  List: SkeletonList,
};

export default SkeletonLoader;

