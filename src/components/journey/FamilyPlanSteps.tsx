import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

/** The guided parent path: big picture → your apps → action plan. */
export const FAMILY_PLAN_STEPS = [
  { key: 'picture', title: 'Big picture', href: '/big-picture' },
  { key: 'apps', title: 'Your apps', href: '/service-catalog' },
  { key: 'plan', title: 'Action plan', href: '/digital-footprint' },
] as const;

export type FamilyPlanStepKey = (typeof FAMILY_PLAN_STEPS)[number]['key'];

interface Props {
  current: FamilyPlanStepKey;
  /** Steps the family has already finished (shown with a tick and still clickable). */
  done?: Partial<Record<FamilyPlanStepKey, boolean>>;
}

const FamilyPlanSteps: React.FC<Props> = ({ current, done = {} }) => (
  <nav aria-label="Your family plan steps">
    <ol className="m-0 flex list-none items-center gap-2 p-0 text-sm sm:gap-3">
      {FAMILY_PLAN_STEPS.map((step, i) => {
        const isCurrent = step.key === current;
        const isDone = Boolean(done[step.key]) && !isCurrent;
        const badge = (
          <span
            className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
              isCurrent
                ? 'bg-green-700 text-white dark:bg-green-400 dark:text-gray-900'
                : isDone
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300'
            }`}
            aria-hidden
          >
            {isDone ? <Check className="h-3.5 w-3.5" /> : i + 1}
          </span>
        );
        const label = (
          <span className={isCurrent ? 'font-semibold text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-300'}>
            {step.title}
          </span>
        );
        return (
          <li key={step.key} className="flex min-w-0 items-center gap-2 sm:gap-3">
            {i > 0 ? <span className="h-px w-4 bg-gray-300 dark:bg-gray-600 sm:w-8" aria-hidden /> : null}
            {isCurrent ? (
              <span className="inline-flex items-center gap-2" aria-current="step">
                {badge}
                {label}
              </span>
            ) : (
              <Link to={step.href} className="inline-flex min-h-[44px] items-center gap-2 hover:underline">
                {badge}
                {label}
                {isDone ? <span className="sr-only">(done)</span> : null}
              </Link>
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);

export default FamilyPlanSteps;
