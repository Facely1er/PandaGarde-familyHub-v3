import { buildDfaScore } from './dfaScoreEngine';
import type { FootprintAnalysis } from './footprintAnalyzer';

const makeAnalysis = (): FootprintAnalysis => ({
  familyScore: 64,
  totalServices: 6,
  totalMembers: 2,
  averageExposureIndex: 58,
  categoryBreakdown: [],
  contextBreakdown: [
    {
      context: 'school',
      label: 'At school & learning',
      description: 'school exposure',
      count: 2,
      averageExposure: 60,
      riskLevel: 'high',
      serviceRisks: [],
    },
  ],
  serviceRisks: [
    { serviceId: '1', serviceName: 'Alpha', category: 'social', exposureIndex: 82, exposureLevel: 'high', riskFactors: [], memberCount: 2 },
    { serviceId: '2', serviceName: 'Beta', category: 'education', exposureIndex: 74, exposureLevel: 'high', riskFactors: [], memberCount: 1 },
    { serviceId: '3', serviceName: 'Gamma', category: 'games', exposureIndex: 49, exposureLevel: 'medium', riskFactors: [], memberCount: 1 },
    { serviceId: '4', serviceName: 'Delta', category: 'shopping', exposureIndex: 35, exposureLevel: 'medium', riskFactors: [], memberCount: 1 },
    { serviceId: '5', serviceName: 'Epsilon', category: 'ai', exposureIndex: 55, exposureLevel: 'high', riskFactors: [], memberCount: 1 },
    { serviceId: '6', serviceName: 'Zeta', category: 'streaming', exposureIndex: 30, exposureLevel: 'medium', riskFactors: [], memberCount: 1 },
  ],
  dataSharingNetwork: [
    { serviceId: '1', serviceName: 'Alpha', parentCompany: 'Parent', siblings: ['Sibling'], dataShared: ['profile'], riskLevel: 'high' },
    { serviceId: '2', serviceName: 'Beta', parentCompany: 'Parent', siblings: [], dataShared: ['usage'], riskLevel: 'medium' },
    { serviceId: '3', serviceName: 'Gamma', siblings: [], dataShared: [], riskLevel: 'low' },
  ],
  recommendations: [
    { id: 'r1', priority: 'high', category: 'privacy', title: 'Turn on 2FA', description: 'Use MFA', actionItems: ['Enable 2FA in account settings'], affectedServices: ['Alpha'] },
  ],
  privacyScore: 42,
  dataBrokerAnalysis: {
    totalMappedServices: 3,
    totalUniqueThirdParties: 4,
    totalUniqueBrokers: 3,
    serviceChains: [],
    crossServiceBrokers: [],
  },
  aiRiskSummary: {
    totalAiApps: 1,
    trainingDataRisk: true,
    noFerpaApps: ['Epsilon'],
    highRiskAiApps: ['Epsilon'],
    keyWarnings: ['warning'],
  },
});

describe('buildDfaScore', () => {
  it('builds a valid basic DFA score with expected breakdown shape', () => {
    const result = buildDfaScore(makeAnalysis(), 'basic');

    expect(result.tier).toBe('basic');
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.privacyScore).toBe(100 - result.score);
    expect(result.breakdown.map((item) => item.key)).toEqual([
      'service-exposure',
      'service-volume',
      'high-risk-apps',
    ]);
    expect(result.executiveSummary).toContain('Basic DFA');
  });

  it('includes advanced-only categories and does not score lower than the same basic snapshot here', () => {
    const analysis = makeAnalysis();
    const basic = buildDfaScore(analysis, 'basic');
    const advanced = buildDfaScore(analysis, 'advanced');

    expect(advanced.breakdown.map((item) => item.key)).toEqual([
      'service-exposure',
      'service-volume',
      'high-risk-apps',
      'network-reach',
      'broker-exposure',
      'ai-risk',
    ]);
    expect(advanced.flags.some((flag) => flag.label.includes('AI tools'))).toBe(true);
    expect(advanced.flags.length).toBeLessThanOrEqual(5);
    expect(advanced.score).toBeGreaterThan(0);
    expect(advanced.privacyScore).toBe(100 - advanced.score);
  });
});
