import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, ArrowRight, PlayCircle } from 'lucide-react';
import { loadDfaJourneyState, type DfaJourneyState } from '../../lib/dfaJourney';

interface Props {
  currentKey?: 'profile' | 'dfa' | 'plan' | 'hub';
  compact?: boolean;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

const DfaJourneyStepper: React.FC<Props> = ({
  currentKey,
  compact = false,
  title = 'Your DFA journey',
  subtitle = 'Progress is saved locally on this device so families can resume instead of restarting.',
  ctaLabel,
  ctaHref,
}) => {
  const journey = useMemo<DfaJourneyState>(() => loadDfaJourneyState(), []);
  const activePath = ctaHref || journey.resumePath;
  const activeLabel = ctaLabel || (journey.progressPercent > 0 ? 'Resume journey' : 'Start journey');

  return (
    <section className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200">
            <PlayCircle size={16} /> DFA-led journey
          </div>
          <h2 className="mt-3 text-2xl font-bold text-slate-900">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{subtitle}</p>
        </div>

        <div className="min-w-[220px] rounded-xl border border-emerald-200 bg-white/90 px-4 py-3">
          <div className="text-sm font-semibold text-slate-800">{journey.progressPercent}% complete</div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-emerald-600 transition-all" style={{ width: `${journey.progressPercent}%` }} />
          </div>
          <Link
            to={activePath}
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
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
                  ? 'border-emerald-500 bg-emerald-600 text-white shadow-md'
                  : isComplete
                    ? 'border-emerald-300 bg-emerald-50 text-slate-900'
                    : isVisited
                      ? 'border-sky-300 bg-sky-50 text-slate-900'
                      : 'border-slate-200 bg-white text-slate-900'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className={`text-xs font-semibold uppercase tracking-wide ${isCurrent ? 'text-emerald-100' : 'text-slate-500'}`}>
                    Phase {index + 1}
                  </div>
                  <h3 className="mt-1 text-base font-bold">{phase.title}</h3>
                </div>
                {isComplete ? (
                  <CheckCircle2 size={20} className={isCurrent ? 'text-white' : 'text-emerald-600'} />
                ) : (
                  <Circle size={20} className={isCurrent ? 'text-white/80' : 'text-slate-300'} />
                )}
              </div>
              <p className={`mt-2 text-sm leading-6 ${isCurrent ? 'text-emerald-50' : 'text-slate-600'}`}>{phase.description}</p>
              <div className={`mt-3 text-sm font-semibold ${isCurrent ? 'text-white' : 'text-emerald-700'}`}>
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
