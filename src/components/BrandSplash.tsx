import React from 'react';

interface BrandSplashProps {
  message?: string;
  /** Subtle pulse on the logo while loading */
  pulsing?: boolean;
  className?: string;
}

const BrandSplash: React.FC<BrandSplashProps> = ({
  message = 'Loading…',
  pulsing = true,
  className = '',
}) => {
  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-100 px-4 ${className}`}
      aria-label={message}
      aria-live="polite"
    >
      <div className="text-center">
        <div
          className={[
            'mx-auto mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border-2 border-green-200 bg-white shadow-md dark:border-green-800/60 dark:bg-gray-200',
            pulsing ? 'animate-pulse' : '',
          ].join(' ')}
        >
          <img
            src="/LogoPandagarde.png"
            alt="PandaGarde"
            className="h-full w-full object-contain p-1"
            width={64}
            height={64}
          />
        </div>
        {message ? (
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{message}</p>
        ) : null}
      </div>
    </div>
  );
};

export default BrandSplash;
