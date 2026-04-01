import React from 'react';
import type { DfaRiskFlag } from '../../lib/dfaScoreEngine';

interface Props {
  flags: DfaRiskFlag[];
}

const styles: Record<DfaRiskFlag['severity'], string> = {
  info: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  medium: 'border-amber-200 bg-amber-50 text-amber-800',
  high: 'border-orange-200 bg-orange-50 text-orange-800',
  critical: 'border-red-200 bg-red-50 text-red-800',
};

const RiskCategoryCards: React.FC<Props> = ({ flags }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-900">Priority categories</h3>
        <p className="mt-1 text-sm text-slate-600">Use these categories to decide what to address first.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {flags.length === 0 ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">No major DFA flags were triggered in this run.</div>
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
