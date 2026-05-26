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
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-600 dark:bg-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 ">Score drivers</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          These are the factors pushing the DFA risk score up or down.{' '}
          <Link to="/scoring-methodology#dfa-methodology" className="font-semibold text-green-700 hover:underline dark:text-green-400">
            How weights work
          </Link>
        </p>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.key}>
            <div className="mb-1 flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-gray-900 ">{item.label}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">{item.description}</div>
              </div>
              <div className="text-sm font-bold text-gray-900 ">{item.value}</div>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-300">
              <div className={`h-full rounded-full ${tone(item.value)}`} style={{ width: `${item.value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BreakdownBars;
