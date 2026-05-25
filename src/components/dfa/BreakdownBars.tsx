import React from 'react';
import { Link } from 'react-router-dom';
import type { DfaBreakdownItem } from '../../lib/dfaScoreEngine';

interface Props {
  items: DfaBreakdownItem[];
}

const tone = (value: number): string => {
  if (value >= 75) {return 'bg-red-500';}
  if (value >= 55) {return 'bg-orange-500';}
  if (value >= 30) {return 'bg-amber-500';}
  return 'bg-emerald-500';
};

const BreakdownBars: React.FC<Props> = ({ items }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Score drivers</h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          These are the factors pushing the DFA risk score up or down.{' '}
          <Link to="/scoring-methodology#dfa-methodology" className="font-semibold text-emerald-700 hover:underline dark:text-emerald-400">
            How weights work
          </Link>
        </p>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.key}>
            <div className="mb-1 flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-900">{item.label}</div>
                <div className="text-xs text-slate-500">{item.description}</div>
              </div>
              <div className="text-sm font-bold text-slate-900">{item.value}</div>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <div className={`h-full rounded-full ${tone(item.value)}`} style={{ width: `${item.value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BreakdownBars;
