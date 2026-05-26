import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Gauge, Layers3 } from 'lucide-react';
import type { FootprintAnalysis } from '../../lib/footprintAnalyzer';
import { buildDfaScore, DFA_SCORE_TIER_STORAGE_KEY, type DfaScoreTier } from '../../lib/dfaScoreEngine';
import ScoreGauge from './ScoreGauge';
import BreakdownBars from './BreakdownBars';
import RiskCategoryCards from './RiskCategoryCards';
import { downloadDfaExecutiveSummary } from '../../lib/dfaReport';
import { logger } from '../../lib/logger';

interface Props {
  analysis: FootprintAnalysis;
}

const DfaScoreOverview: React.FC<Props> = ({ analysis }) => {
  const [tier, setTier] = useState<DfaScoreTier>(() => {
    if (typeof window === 'undefined') {return 'basic';}
    return window.localStorage.getItem(DFA_SCORE_TIER_STORAGE_KEY) === 'advanced' ? 'advanced' : 'basic';
  });

  const score = useMemo(() => buildDfaScore(analysis, tier), [analysis, tier]);

  const handleTierChange = (next: DfaScoreTier): void => {
    setTier(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DFA_SCORE_TIER_STORAGE_KEY, next);
    }
  };

  return (
    <section className="mb-8 rounded-3xl border border-gray-200 bg-gradient-to-br from-white via-gray-50 to-green-50/60 p-6 shadow-sm dark:border-gray-600 dark:from-gray-200 dark:via-gray-100 dark:to-green-950/40">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-green-900 px-3 py-1 text-sm font-semibold text-white dark:bg-green-800">
            <Gauge size={16} /> DFA scoring engine
          </div>
          <h2 className="mt-3 text-2xl font-bold text-gray-900">Launch-grade scoring, not just a footprint list</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-700">
            Use the Basic score for a fast household reading. Switch to Advanced to include data-sharing networks, broker reach, and AI-specific sensitivity.{' '}
            <Link to="/scoring-methodology#dfa-methodology" className="font-semibold text-green-700 hover:underline dark:text-green-400">
              Read the DFA methodology
            </Link>
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-600 dark:bg-gray-200">
            {(['basic', 'advanced'] as DfaScoreTier[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleTierChange(option)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${tier === option ? 'bg-green-700 text-white dark:bg-green-600' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-300'}`}
              >
                {option === 'basic' ? 'Basic DFA' : 'Advanced DFA'}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => { Promise.resolve(downloadDfaExecutiveSummary(analysis, score)).catch(err => logger.error('PDF error', err)); }}
            className="inline-flex items-center gap-2 rounded-xl bg-green-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-800 dark:bg-green-700 dark:hover:bg-green-600"
          >
            <Download size={16} /> Export executive summary
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[320px,1fr]">
        <div className="space-y-6">
          <ScoreGauge score={score.score} level={score.level} />
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-600 dark:bg-gray-200">
            <div className="flex items-center gap-2 text-gray-900 ">
              <Layers3 size={18} />
              <h3 className="text-lg font-bold">Executive summary</h3>
            </div>
            <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">{score.executiveSummary}</p>
            <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-800 dark:border-gray-500 dark:bg-gray-100 dark:text-gray-200">
              <div><strong className="text-gray-900 ">Privacy posture:</strong> {score.privacyScore}/100</div>
              <div className="mt-1"><strong className="text-gray-900 ">Tier:</strong> {tier === 'basic' ? 'Fast household view' : 'Expanded risk analysis'}</div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <BreakdownBars items={score.breakdown} />
          <RiskCategoryCards flags={score.flags} />
        </div>
      </div>
    </section>
  );
};

export default DfaScoreOverview;
