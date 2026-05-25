import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const DfaMethodologyCallout: React.FC = () => (
  <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 dark:border-emerald-800 dark:bg-emerald-950/40">
    <p className="flex items-start gap-2 text-sm leading-relaxed text-emerald-950 dark:text-emerald-100">
      <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-400" aria-hidden />
      <span>
        <strong>DFA methodology:</strong> Household scores combine per-app Privacy Exposure Indexes with
        volume, high-risk concentration, and (in Advanced) network, broker, and AI signals—all from apps you
        list, not device monitoring.{' '}
        <Link
          to="/scoring-methodology#dfa-methodology"
          className="font-semibold text-emerald-800 underline hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-200"
        >
          Read the full DFA methodology
        </Link>
      </span>
    </p>
  </div>
);

export default DfaMethodologyCallout;
