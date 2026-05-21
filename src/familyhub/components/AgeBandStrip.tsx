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
  <section aria-labelledby="age-band-strip-heading">
    <h2 id="age-band-strip-heading" className="mb-3 text-sm font-semibold text-gray-800 dark:text-gray-200">
      {title}
    </h2>
    <ul className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1 snap-x snap-mandatory">
      {HUB_AGE_BANDS.map((band) => {
        const isActive = activeRange === band.range;
        return (
          <li key={band.range} className="min-w-[11.5rem] flex-1 snap-start sm:min-w-0 sm:flex-1">
            <Link
              to={hubPaths.activities}
              state={{ initialAgeFilter: band.range }}
              className={[
                'hub-card-lift flex h-full flex-col rounded-2xl border p-4 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500',
                band.cardClass,
                isActive ? 'ring-2 ring-teal-500 ring-offset-2 dark:ring-offset-gray-900' : '',
              ].join(' ')}
            >
              <span className="text-3xl" role="img" aria-hidden="true">
                {band.emoji}
              </span>
              <p className="mt-2 text-sm font-bold text-gray-900 dark:text-white">{band.label}</p>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-300">{band.shortLabel}</p>
              <p className="mt-1 flex-1 text-xs leading-relaxed text-gray-600 dark:text-gray-400">{band.tagline}</p>
              <p className="mt-3 flex items-center gap-1 text-xs font-semibold text-teal-700 dark:text-teal-300">
                {band.missionCount} missions
                <ChevronRight size={14} aria-hidden="true" />
              </p>
            </Link>
          </li>
        );
      })}
    </ul>
  </section>
);

export default AgeBandStrip;
