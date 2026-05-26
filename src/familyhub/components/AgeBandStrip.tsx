import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { HUB_AGE_BANDS, type HubAgeRange } from '../hubAgeBands';
import { hubPaths } from '../hubPaths';

interface AgeBandStripProps {
  activeRange?: HubAgeRange | 'all';
  title?: string;
}

const AgeBandStrip: React.FC<AgeBandStripProps> = ({ activeRange, title = 'Pick your adventure' }) => (
  <section className="min-w-0" aria-labelledby="age-band-strip-heading">
    <h2 id="age-band-strip-heading" className="mb-3 text-sm font-semibold text-gray-800 dark:text-gray-200">
      {title}
    </h2>
    <ul className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-3">
      {HUB_AGE_BANDS.map((band) => {
        const isActive = activeRange === band.range;
        return (
          <li key={band.range} className="min-w-0">
            <Link
              to={hubPaths.activities}
              state={{ initialAgeFilter: band.range }}
              className={[
                'hub-card-lift flex h-full min-w-0 items-start gap-3 rounded-2xl border p-4 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500',
                band.cardClass,
                isActive ? 'ring-2 ring-inset ring-teal-500 dark:ring-teal-400' : '',
              ].join(' ')}
            >
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
                  {band.label}
                </span>
                <span className="mt-0.5 block text-xs font-medium text-gray-600 dark:text-gray-300">
                  {band.shortLabel}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-gray-600 dark:text-gray-400 sm:line-clamp-2">
                  {band.tagline}
                </span>
                <span className="mt-2 flex items-center gap-1 text-xs font-semibold text-teal-700 dark:text-teal-300">
                  {band.missionCount} missions
                  <ChevronRight size={14} className="shrink-0" aria-hidden="true" />
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  </section>
);

export default AgeBandStrip;
