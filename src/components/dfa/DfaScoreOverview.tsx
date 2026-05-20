import React, { useMemo, useState } from 'react';
import { Download, Gauge, Layers3 } from 'lucide-react';
import type { FootprintAnalysis } from '../../lib/footprintAnalyzer';
import { buildDfaScore, type DfaScoreTier } from '../../lib/dfaScoreEngine';
import ScoreGauge from './ScoreGauge';
import BreakdownBars from './BreakdownBars';
import RiskCategoryCards from './RiskCategoryCards';
import { downloadDfaExecutiveSummary } from '../../lib/dfaReport';
import { logger } from '../../lib/logger';

interface Props {
  analysis: FootprintAnalysis;
}

const STORAGE_KEY = 'pandagarde_dfa_score_tier';

const DfaScoreOverview: React.FC<Props> = ({ analysis }) => {
  const [tier, setTier] = useState<DfaScoreTier>(() => {
    if (typeof window === 'undefined') {return 'basic';}
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'advanced' ? 'advanced' : 'basic';
  });

  const score = useMemo(() => buildDfaScore(analysis, tier), [analysis, tier]);

  const handleTierChange = (next: DfaScoreTier): void => {
    setTier(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
  };

  return (
    <section className="mb-8 rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-emerald-50/60 p-6 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-sm font-semibold text-white">
            <Gauge size={16} /> DFA scoring engine
          </div>
          <h2 className="mt-3 text-2xl font-bold text-slate-900">Launch-grade scoring, not just a footprint list</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Use the Basic score for a fast household reading. Switch to Advanced to include data-sharing networks, broker reach, and AI-specific sensitivity.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            {(['basic', 'advanced'] as DfaScoreTier[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleTierChange(option)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${tier === option ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
              >
                {option === 'basic' ? 'Basic DFA' : 'Advanced DFA'}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => { Promise.resolve(downloadDfaExecutiveSummary(analysis, score)).catch(err => logger.error('PDF error', err)); }}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <Download size={16} /> Export executive summary
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[320px,1fr]">
        <div className="space-y-6">
          <ScoreGauge score={score.score} level={score.level} />
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-slate-900">
              <Layers3 size={18} />
              <h3 className="text-lg font-bold">Executive summary</h3>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{score.executiveSummary}</p>
            <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
              <div><strong>Privacy posture:</strong> {score.privacyScore}/100</div>
              <div className="mt-1"><strong>Tier:</strong> {tier === 'basic' ? 'Fast household view' : 'Expanded risk analysis'}</div>
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
