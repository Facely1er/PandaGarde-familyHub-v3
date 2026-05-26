import React from 'react';

type HubPageMaxWidth = '4xl' | '5xl' | '6xl';

const maxWidthClass: Record<HubPageMaxWidth, string> = {
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
};

interface HubPageLayoutProps {
  children: React.ReactNode;
  /** Default max width for all primary hub tabs */
  maxWidth?: HubPageMaxWidth;
  className?: string;
}

/**
 * Shared viewport for Family Hub tabs — consistent padding, width, and vertical rhythm.
 */
const HubPageLayout: React.FC<HubPageLayoutProps> = ({
  children,
  maxWidth = '5xl',
  className = '',
}) => (
  <div className={`min-h-full min-w-0 ${className}`.trim()}>
    <div
      className={[
        'mx-auto flex w-full min-w-0 flex-col gap-5 p-4 sm:gap-6 sm:p-6',
        maxWidthClass[maxWidth],
      ].join(' ')}
    >
      {children}
    </div>
  </div>
);

export default HubPageLayout;
