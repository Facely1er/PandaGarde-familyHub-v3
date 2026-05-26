import React, { useSyncExternalStore } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, ArrowRight, PlayCircle } from 'lucide-react';
import {
  DFA_JOURNEY_CHANGE_EVENT,
  DEFAULT_DFA_JOURNEY_STATE,
  getDfaJourneySnapshot,
} from '../../lib/dfaJourney';

interface Props {
  currentKey?: 'profile' | 'dfa' | 'plan' | 'hub';
  compact?: boolean;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

const subscribeJourney = (onStoreChange: () => void): (() => void) => {
  const handler = () => onStoreChange();
  window.addEventListener(DFA_JOURNEY_CHANGE_EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(DFA_JOURNEY_CHANGE_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
};

const DfaJourneyStepper: React.FC<Props> = ({
  currentKey,
  compact = false,
  title = 'Your DFA journey',
  subtitle = 'Progress is saved locally on this device so families can resume instead of restarting.',
  ctaLabel,
  ctaHref,
}) => {
  const journey = useSyncExternalStore(subscribeJourney, getDfaJourneySnapshot, () => DEFAULT_DFA_JOURNEY_STATE);
  const activePath = ctaHref || journey.resumePath;
  const activeLabel = ctaLabel || (journey.progressPercent > 0 ? 'Resume journey' : 'Start journey');

  return (
    <section className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 via-white to-sky-50 p-5 shadow-sm dark:border-green-800/50 dark:from-green-950/40 dark:via-gray-100 dark:to-gray-200">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-green-800 ring-1 ring-green-200 dark:bg-gray-200/95 dark:text-green-400 dark:ring-green-700/60">
            <PlayCircle size={16} /> DFA-led journey
          </div>
          <h2 className="mt-3 text-2xl font-bold text-gray-900">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-700">{subtitle}</p>
        </div>

        <div className="min-w-[220px] rounded-xl border border-green-200 bg-white/95 px-4 py-3 shadow-sm dark:border-green-800/50 dark:bg-gray-200/95">
          <div className="text-sm font-semibold text-gray-900">{journey.progressPercent}% complete</div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-300">
            <div className="h-full rounded-full bg-green-600 transition-all dark:bg-green-500" style={{ width: `${journey.progressPercent}%` }} />
          </div>
          <Link
            to={activePath}
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
          >
            {activeLabel} <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      <div className={`mt-5 grid gap-3 ${compact ? 'md:grid-cols-2 xl:grid-cols-4' : 'lg:grid-cols-4'}`}>
        {journey.phases.map((phase, index) => {
          const isCurrent = phase.key === currentKey;
          const isComplete = phase.completed;
          const isVisited = phase.visited;
          return (
            <Link
              key={phase.key}
              to={phase.path}
              className={`rounded-2xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-md ${
                isCurrent
                  ? 'border-green-500 bg-green-700 text-white shadow-md dark:border-green-400 dark:bg-green-600'
                  : isComplete
                    ? 'border-green-300 bg-green-50 text-gray-900 dark:border-green-800 dark:bg-green-950/50'
                    : isVisited
                      ? 'border-sky-300 bg-sky-50 text-gray-900 dark:border-sky-800 dark:bg-sky-950/40'
                      : 'border-gray-200 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className={`text-xs font-semibold uppercase tracking-wide ${isCurrent ? 'text-green-100' : 'text-gray-500 dark:text-gray-600'}`}>
                    Phase {index + 1}
                  </div>
                  <h3 className={`mt-1 text-base font-bold ${isCurrent ? 'text-white' : 'text-gray-900'}`}>{phase.title}</h3>
                </div>
                {isComplete ? (
                  <CheckCircle2 size={20} className={isCurrent ? 'text-white' : 'text-green-600 dark:text-green-400'} />
                ) : (
                  <Circle size={20} className={isCurrent ? 'text-white/80' : 'text-gray-300 dark:text-gray-500'} />
                )}
              </div>
              <p className={`mt-2 text-sm leading-6 ${isCurrent ? 'text-green-50' : 'text-gray-600 dark:text-gray-700'}`}>{phase.description}</p>
              <div className={`mt-3 text-sm font-semibold ${isCurrent ? 'text-white' : 'text-green-700 dark:text-green-400'}`}>
                {isComplete ? 'Completed' : isVisited ? 'In progress' : 'Start here'}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default DfaJourneyStepper;
