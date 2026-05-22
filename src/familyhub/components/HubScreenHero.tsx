import React from 'react';
import HubBrandLogo from './HubBrandLogo';

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
      'relative overflow-hidden rounded-3xl border border-teal-200/80 shadow-sm dark:border-teal-700/40',
      compact ? 'p-4 sm:p-5' : 'p-5 sm:p-6',
    ].join(' ')}
    style={{ background: 'var(--fh-header-gradient)' }}
    aria-labelledby="hub-hero-title"
  >
    <div
      className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/15 blur-2xl"
      aria-hidden="true"
    />
    <div
      className="pointer-events-none absolute -bottom-8 left-1/3 h-24 w-24 rounded-full bg-amber-300/20 blur-2xl"
      aria-hidden="true"
    />
    <div className="relative flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
      {mascot === 'panda' && (
        <HubBrandLogo
          size={compact ? 'md' : 'header'}
          variant="header"
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
        <p className={['mt-1.5 max-w-xl text-teal-50/95', compact ? 'text-sm' : 'text-sm sm:text-base'].join(' ')}>
          {subtitle}
        </p>
        {children && <div className="mt-3">{children}</div>}
      </div>
    </div>
  </section>
);

export default HubScreenHero;
