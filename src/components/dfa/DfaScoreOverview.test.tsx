import { fireEvent, render, screen } from '@testing-library/react';
import DfaScoreOverview from './DfaScoreOverview';
import type { FootprintAnalysis } from '../../lib/footprintAnalyzer';

vi.mock('../../lib/dfaReport', () => ({
  downloadDfaExecutiveSummary: vi.fn(),
}));

import { downloadDfaExecutiveSummary } from '../../lib/dfaReport';

const analysis: FootprintAnalysis = {
  familyScore: 61,
  totalServices: 5,
  totalMembers: 2,
  averageExposureIndex: 54,
  categoryBreakdown: [],
  contextBreakdown: [],
  serviceRisks: [
    { serviceId: '1', serviceName: 'Alpha', category: 'social', exposureIndex: 80, exposureLevel: 'high', riskFactors: [], memberCount: 1 },
    { serviceId: '2', serviceName: 'Beta', category: 'education', exposureIndex: 66, exposureLevel: 'high', riskFactors: [], memberCount: 1 },
    { serviceId: '3', serviceName: 'Gamma', category: 'games', exposureIndex: 40, exposureLevel: 'medium', riskFactors: [], memberCount: 1 },
    { serviceId: '4', serviceName: 'Delta', category: 'shopping', exposureIndex: 33, exposureLevel: 'medium', riskFactors: [], memberCount: 1 },
    { serviceId: '5', serviceName: 'Epsilon', category: 'ai', exposureIndex: 58, exposureLevel: 'high', riskFactors: [], memberCount: 1 },
  ],
  dataSharingNetwork: [
    { serviceId: '1', serviceName: 'Alpha', siblings: [], dataShared: ['profile'], riskLevel: 'high' },
  ],
  recommendations: [
    { id: 'r1', priority: 'high', category: 'privacy', title: 'Change settings', description: 'Update settings', actionItems: ['Turn on stronger privacy controls'], affectedServices: ['Alpha'] },
  ],
  privacyScore: 39,
  dataBrokerAnalysis: {
    totalMappedServices: 2,
    totalUniqueThirdParties: 4,
    totalUniqueBrokers: 2,
    serviceChains: [],
    crossServiceBrokers: [],
  },
  aiRiskSummary: {
    totalAiApps: 1,
    trainingDataRisk: false,
    noFerpaApps: [],
    highRiskAiApps: ['Epsilon'],
    keyWarnings: [],
  },
};

describe('DfaScoreOverview', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders basic DFA by default and persists tier changes', () => {
    render(<DfaScoreOverview analysis={analysis} />);

    expect(screen.getByText(/Launch-grade scoring/i)).toBeInTheDocument();
    expect(screen.getByText(/Tier:/i)).toBeInTheDocument();
    expect(screen.getByText(/Fast household view/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /advanced dfa/i }));

    expect(window.localStorage.getItem('pandagarde_dfa_score_tier')).toBe('advanced');
    expect(screen.getByText(/Expanded risk analysis/i)).toBeInTheDocument();
  });

  it('calls executive summary export with the current score', () => {
    render(<DfaScoreOverview analysis={analysis} />);

    fireEvent.click(screen.getByRole('button', { name: /export executive summary/i }));

    expect(downloadDfaExecutiveSummary).toHaveBeenCalledTimes(1);
    expect(downloadDfaExecutiveSummary).toHaveBeenCalledWith(
      analysis,
      expect.objectContaining({
        tier: 'basic',
        score: expect.any(Number),
        privacyScore: expect.any(Number),
      })
    );
  });
});
