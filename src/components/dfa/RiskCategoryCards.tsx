import React from 'react';
import type { DfaRiskFlag } from '../../lib/dfaScoreEngine';

interface Props {
  flags: DfaRiskFlag[];
}

const styles: Record<DfaRiskFlag['severity'], string> = {
  info: 'border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950/50 dark:text-green-200',
  medium: 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-100',
  high: 'border-orange-200 bg-orange-50 text-orange-900 dark:border-orange-800 dark:bg-orange-950/50 dark:text-orange-100',
  critical: 'border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/50 dark:text-red-100',
};

const RiskCategoryCards: React.FC<Props> = ({ flags }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-600 dark:bg-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 ">Priority categories</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Use these categories to decide what to address first.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {flags.length === 0 ? (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-900 dark:border-green-800 dark:bg-green-950/50 dark:text-green-200">
            No major DFA flags were triggered in this run.
          </div>
        ) : (
          flags.map((flag) => (
            <div key={flag.label} className={`rounded-xl border p-4 text-sm font-semibold ${styles[flag.severity]}`}>
              {flag.label}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RiskCategoryCards;
