import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { HUB_AGE_BANDS, type HubAgeRange } from '../hubAgeBands';
import { hubPaths } from '../hubPaths';
import { useHubI18n } from '../hubI18n';

interface AgeBandStripProps {
  activeRange?: HubAgeRange | 'all';
  title?: string;
  /** Tighter cards for welcome / small viewports */
  density?: 'default' | 'compact';
  /**
   * When provided, cards act as in-place filter toggles instead of navigation
   * links (used on the Activities screen where the filter lives on-page).
   */
  onSelectRange?: (range: HubAgeRange | 'all') => void;
}

const AgeBandStrip: React.FC<AgeBandStripProps> = ({
  activeRange,
  title,
  density = 'default',
  onSelectRange,
}) => {
  const { t, ageBandLabel, ageBandShort, ageBandTagline } = useHubI18n();
  const heading = title ?? t('hub.ageBands.pickAdventure');
  const compact = density === 'compact';

  return (
    <section className="min-w-0" aria-labelledby="age-band-strip-heading">
      <h2
        id="age-band-strip-heading"
        className={[
          'font-semibold text-gray-800 dark:text-gray-200',
          compact ? 'mb-2 text-xs uppercase tracking-wide' : 'mb-3 text-sm',
        ].join(' ')}
      >
        {heading}
      </h2>
      <ul className={['grid min-w-0 grid-cols-1', compact ? 'gap-2' : 'gap-3 sm:grid-cols-3'].join(' ')}>
        {HUB_AGE_BANDS.map((band) => {
          const isActive = activeRange === band.range;
          const isFilter = Boolean(onSelectRange);
          const cardClassName = [
            'hub-card-lift flex h-full w-full min-w-0 rounded-2xl border text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500',
            isFilter || compact ? 'items-center gap-2.5 p-2.5' : 'items-start gap-3 p-4',
            band.cardClass,
            isActive ? 'ring-2 ring-inset ring-teal-500 dark:ring-teal-400' : '',
          ].join(' ');
          const cardContent = isFilter || compact ? (
            <>
              <span
                className={[
                  'flex shrink-0 items-center justify-center rounded-lg',
                  compact ? 'h-8 w-8' : 'h-9 w-9',
                  band.iconBadgeClass,
                ].join(' ')}
              >
                <band.icon size={compact ? 16 : 18} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold leading-tight text-gray-900 dark:text-white">
                  {ageBandLabel(band.range)}
                </span>
                <span className="block truncate text-[11px] font-medium leading-tight text-gray-600 dark:text-gray-300">
                  {ageBandShort(band.range)}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-0.5 text-[11px] font-semibold text-teal-700 dark:text-teal-300">
                {band.missionCount}
                <ChevronRight size={12} className="shrink-0" aria-hidden="true" />
              </span>
            </>
          ) : (
            <>
              <span
                className={[
                  'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
                  band.iconBadgeClass,
                ].join(' ')}
              >
                <band.icon size={22} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold leading-snug text-gray-900 dark:text-white">
                  {ageBandLabel(band.range)}
                </span>
                <span className="mt-0.5 block text-xs font-medium text-gray-600 dark:text-gray-300">
                  {ageBandShort(band.range)}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-gray-600 dark:text-gray-400 sm:line-clamp-2">
                  {ageBandTagline(band.range)}
                </span>
                <span className="mt-2 flex items-center gap-1 text-xs font-semibold text-teal-700 dark:text-teal-300">
                  {t('hub.ageBands.missionCount', { count: band.missionCount })}
                  <ChevronRight size={14} className="shrink-0" aria-hidden="true" />
                </span>
              </span>
            </>
          );

          return (
            <li key={band.range} className="min-w-0">
              {onSelectRange ? (
                <button
                  type="button"
                  onClick={() => onSelectRange(isActive ? 'all' : band.range)}
                  aria-pressed={isActive}
                  className={cardClassName}
                >
                  {cardContent}
                </button>
              ) : (
                <Link to={hubPaths.activities} state={{ initialAgeFilter: band.range }} className={cardClassName}>
                  {cardContent}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default AgeBandStrip;
