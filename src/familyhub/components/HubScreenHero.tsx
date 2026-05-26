import React from 'react';
import HubBrandLogo from './HubBrandLogo';
import { hubTheme } from '../hubTheme';

interface HubScreenHeroProps {
  badge?: string;
  title: string;
  subtitle: string;
  mascot?: 'panda' | 'none';
  children?: React.ReactNode;
  compact?: boolean;
}

const HubScreenHero: React.FC<HubScreenHeroProps> = ({
  badge,
  title,
  subtitle,
  mascot = 'panda',
  children,
  compact = false,
}) => (
  <section
    className={[
      hubTheme.hero,
      compact ? 'p-4 sm:p-5' : 'p-5 sm:p-6',
    ].join(' ')}
    aria-labelledby="hub-hero-title"
  >
    <div className="relative flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
      {mascot === 'panda' && (
        <HubBrandLogo
          size={compact ? 'lg' : 'hero'}
          variant="plain"
          animated={!compact}
        />
      )}
      <div className="min-w-0 flex-1">
        {badge && (
          <p className="inline-flex rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
            {badge}
          </p>
        )}
        <h1
          id="hub-hero-title"
          className={[
            'font-extrabold tracking-tight text-white',
            compact ? 'mt-1 text-xl sm:text-2xl' : 'mt-2 text-2xl sm:text-3xl',
          ].join(' ')}
        >
          {title}
        </h1>
        <p className={['mt-1.5 max-w-xl text-teal-100', compact ? 'text-sm' : 'text-sm sm:text-base'].join(' ')}>
          {subtitle}
        </p>
        {children && <div className="mt-3">{children}</div>}
      </div>
    </div>
  </section>
);

export default HubScreenHero;
