import React, { useSyncExternalStore } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, ArrowRight, PlayCircle } from 'lucide-react';
import {
  DFA_JOURNEY_CHANGE_EVENT,
  DEFAULT_DFA_JOURNEY_STATE,
  getCoreDfaPhases,
  getDfaJourneySnapshot,
  getOptionalDfaPhases,
} from '../../lib/dfaJourney';

interface Props {
  currentKey?: 'profile' | 'dfa' | 'plan' | 'hub';
  /** Full card with phase grid (catalog / get-started). Strip fits inside a page hero. */
  variant?: 'full' | 'strip';
  compact?: boolean;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
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
  variant = 'full',
  compact = false,
  title = 'Your DFA journey',
  subtitle = 'Progress is saved locally on this device so families can resume instead of restarting.',
  ctaLabel,
  ctaHref,
  className = '',
}) => {
  const journey = useSyncExternalStore(subscribeJourney, getDfaJourneySnapshot, () => DEFAULT_DFA_JOURNEY_STATE);
  const corePhases = getCoreDfaPhases(journey.phases);
  const optionalPhases = getOptionalDfaPhases(journey.phases);
  const activePath = ctaHref || journey.resumePath;
  const activeLabel = ctaLabel || (journey.progressPercent > 0 ? 'Resume journey' : 'Start journey');

  const renderPhasePills = (phases: typeof corePhases) => (
    <ol className="flex flex-wrap gap-2">
      {phases.map((phase, index) => {
        const isCurrent = phase.key === currentKey;
        const isComplete = phase.completed;
        const isVisited = phase.visited;
        return (
          <li key={phase.key}>
            <Link
              to={phase.path}
              aria-current={isCurrent ? 'step' : undefined}
              className={`inline-flex max-w-full items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                isCurrent
                  ? 'border-green-600 bg-green-700 text-white dark:border-green-500 dark:bg-green-600'
                  : isComplete
                    ? 'border-green-300 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950/60 dark:text-green-100'
                    : isVisited
                      ? 'border-sky-300 bg-sky-50 text-sky-900 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-100'
                      : 'border-gray-200 bg-white text-gray-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              <span className="tabular-nums opacity-80">{index + 1}.</span>
              <span className="truncate">{phase.title}</span>
              {isComplete ? (
                <CheckCircle2 size={14} className={isCurrent ? 'text-white' : 'text-green-600 dark:text-green-400'} aria-hidden />
              ) : null}
            </Link>
          </li>
        );
      })}
    </ol>
  );

  if (variant === 'strip') {
    return (
      <div
        className={`border-t border-green-200/80 pt-5 dark:border-green-800/50 ${className}`.trim()}
        aria-label="DFA journey progress"
      >
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <span className="shrink-0 text-sm font-semibold text-gray-900 dark:text-white">
              {journey.progressPercent}% complete
            </span>
            <div className="h-2 min-w-[120px] flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
              <div
                className="h-full rounded-full bg-green-600 transition-all dark:bg-green-500"
                style={{ width: `${journey.progressPercent}%` }}
              />
            </div>
          </div>
          <Link
            to={activePath}
            className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
          >
            {activeLabel} <ArrowRight size={15} aria-hidden />
          </Link>
        </div>
        {renderPhasePills(corePhases)}
        {optionalPhases.length > 0 && (
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Optional:{' '}
            <Link to={optionalPhases[0].path} className="font-medium text-green-700 hover:underline dark:text-green-400">
              {optionalPhases[0].title}
            </Link>
            {' — '}privacy missions for kids, separate from parent DFA.
          </p>
        )}
      </div>
    );
  }

  return (
    <section
      className={`rounded-2xl border border-green-200 bg-green-50 p-5 shadow-sm dark:border-green-800/50 dark:bg-gray-800 ${className}`.trim()}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-semibold text-green-800 ring-1 ring-green-200 dark:bg-gray-700 dark:text-green-300 dark:ring-green-700/60">
            <PlayCircle size={16} /> DFA-led journey
          </div>
          <h2 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-300">{subtitle}</p>
        </div>

        <div className="min-w-[220px] rounded-xl border border-green-200 bg-white px-4 py-3 shadow-sm dark:border-green-800/50 dark:bg-gray-700">
          <div className="text-sm font-semibold text-gray-900 dark:text-white">{journey.progressPercent}% complete</div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
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

      <div className={`mt-5 grid gap-3 ${compact ? 'md:grid-cols-2 xl:grid-cols-3' : 'lg:grid-cols-3'}`}>
        {corePhases.map((phase, index) => {
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
                    ? 'border-green-300 bg-green-50 text-gray-900 dark:border-green-800 dark:bg-green-950/50 dark:text-white'
                    : isVisited
                      ? 'border-sky-300 bg-sky-50 text-gray-900 dark:border-sky-800 dark:bg-sky-950/40 dark:text-white'
                      : 'border-gray-200 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className={`text-xs font-semibold uppercase tracking-wide ${isCurrent ? 'text-green-100' : 'text-gray-500 dark:text-gray-400'}`}>
                    Phase {index + 1}
                  </div>
                  <h3 className={`mt-1 text-base font-bold ${isCurrent ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{phase.title}</h3>
                </div>
                {isComplete ? (
                  <CheckCircle2 size={20} className={isCurrent ? 'text-white' : 'text-green-600 dark:text-green-400'} />
                ) : (
                  <Circle size={20} className={isCurrent ? 'text-white/80' : 'text-gray-300 dark:text-gray-500'} />
                )}
              </div>
              <p className={`mt-2 text-sm leading-6 ${isCurrent ? 'text-green-50' : 'text-gray-600 dark:text-gray-300'}`}>{phase.description}</p>
              <div className={`mt-3 text-sm font-semibold ${isCurrent ? 'text-white' : 'text-green-700 dark:text-green-400'}`}>
                {isComplete ? 'Completed' : isVisited ? 'In progress' : 'Start here'}
              </div>
            </Link>
          );
        })}
      </div>

      {optionalPhases.length > 0 && (
        <div className="mt-4 rounded-xl border border-dashed border-gray-300 bg-gray-50/80 p-4 dark:border-gray-600 dark:bg-gray-900/40">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Optional — not part of parent DFA</p>
          {optionalPhases.map((phase) => (
            <Link
              key={phase.key}
              to={phase.path}
              className="mt-2 flex flex-col gap-1 rounded-lg p-3 transition-colors hover:bg-white/80 dark:hover:bg-gray-800/60"
            >
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{phase.title}</span>
              <span className="text-sm leading-6 text-gray-600 dark:text-gray-400">{phase.description}</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default DfaJourneyStepper;
