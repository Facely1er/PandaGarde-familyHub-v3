import React from 'react';
import type { DfaRiskLevel } from '../../lib/dfaScoreEngine';

interface Props {
  score: number;
  level: DfaRiskLevel;
  label?: string;
}

const strokeColor = (level: DfaRiskLevel): string => {
  switch (level) {
    case 'Low':
      return '#16a34a';
    case 'Moderate':
      return '#d97706';
    case 'High':
      return '#ea580c';
    case 'Critical':
      return '#dc2626';
    default:
      return '#2563eb';
  }
};

const levelTextClass = (level: DfaRiskLevel): string => {
  switch (level) {
    case 'Low':
      return 'text-green-600 dark:text-green-400';
    case 'Moderate':
      return 'text-amber-600 dark:text-amber-400';
    case 'High':
      return 'text-orange-600 dark:text-orange-400';
    case 'Critical':
      return 'text-red-600 dark:text-red-400';
    default:
      return 'text-blue-600 dark:text-blue-400';
  }
};

const ScoreGauge: React.FC<Props> = ({ score, level, label = 'Risk score' }) => {
  const radius = 62;
  const circumference = Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;
  const stroke = strokeColor(level);

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="relative h-40 w-40">
        <svg viewBox="0 0 160 100" className="h-full w-full overflow-visible">
          <path d="M 18 82 A 62 62 0 0 1 142 82" fill="none" stroke="#e2e8f0" strokeWidth="14" strokeLinecap="round" />
          <path
            d="M 18 82 A 62 62 0 0 1 142 82"
            fill="none"
            stroke={stroke}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-10 text-center">
          <div className="text-4xl font-bold text-slate-900 dark:text-slate-100">{score}</div>
          <div className={`mt-1 text-sm font-semibold ${levelTextClass(level)}`}>{level}</div>
        </div>
      </div>
      <div className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</div>
      <p className="mt-1 text-center text-xs text-slate-500 dark:text-slate-400">Higher score means more privacy risk.</p>
    </div>
  );
};

export default ScoreGauge;
