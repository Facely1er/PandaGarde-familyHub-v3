import type { FootprintAnalysis } from './footprintAnalyzer';

export type DfaScoreTier = 'basic' | 'advanced';
export type DfaRiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

export interface DfaBreakdownItem {
  key: string;
  label: string;
  value: number;
  description: string;
}

export interface DfaRiskFlag {
  label: string;
  severity: 'info' | 'medium' | 'high' | 'critical';
}

export interface DfaScoreResult {
  tier: DfaScoreTier;
  score: number; // higher = more risk
  privacyScore: number; // inverse, higher = better privacy posture
  level: DfaRiskLevel;
  breakdown: DfaBreakdownItem[];
  flags: DfaRiskFlag[];
  executiveSummary: string;
}

const clamp = (value: number, min = 0, max = 100): number => Math.min(max, Math.max(min, Math.round(value)));

const levelFromScore = (score: number): DfaRiskLevel => {
  if (score >= 75) {return 'Critical';}
  if (score >= 55) {return 'High';}
  if (score >= 30) {return 'Moderate';}
  return 'Low';
};

const severityFromValue = (value: number): DfaRiskFlag['severity'] => {
  if (value >= 75) {return 'critical';}
  if (value >= 55) {return 'high';}
  if (value >= 30) {return 'medium';}
  return 'info';
};

export const buildDfaScore = (analysis: FootprintAnalysis, tier: DfaScoreTier = 'basic'): DfaScoreResult => {
  const highRiskServices = analysis.serviceRisks.filter((service) => service.exposureIndex >= 70).length;
  const networkedServices = analysis.dataSharingNetwork.filter((node) => node.riskLevel !== 'low').length;
  const brokerReach = analysis.dataBrokerAnalysis.totalUniqueBrokers;
  const aiRiskApps = analysis.aiRiskSummary?.highRiskAiApps.length || 0;

  const serviceExposure = clamp(analysis.averageExposureIndex);
  const serviceVolume = clamp(analysis.totalServices * 8);
  const highRiskAppDensity = clamp((highRiskServices / Math.max(analysis.totalServices, 1)) * 100);
  const networkReach = clamp((networkedServices / Math.max(analysis.totalServices, 1)) * 100);
  const brokerExposure = clamp(brokerReach * 10);
  const aiSensitivity = clamp(
    aiRiskApps > 0
      ? 55 + aiRiskApps * 10 + (analysis.aiRiskSummary?.trainingDataRisk ? 10 : 0)
      : analysis.aiRiskSummary?.totalAiApps
        ? 35
        : 0
  );

  const basicBreakdown: DfaBreakdownItem[] = [
    {
      key: 'service-exposure',
      label: 'Service exposure',
      value: serviceExposure,
      description: 'How privacy-invasive the selected services appear on average.',
    },
    {
      key: 'service-volume',
      label: 'Service volume',
      value: serviceVolume,
      description: 'How broad the family footprint is across apps and services.',
    },
    {
      key: 'high-risk-apps',
      label: 'High-risk app density',
      value: highRiskAppDensity,
      description: 'How much of the footprint is concentrated in higher-risk services.',
    },
  ];

  const advancedBreakdown: DfaBreakdownItem[] = [
    ...basicBreakdown,
    {
      key: 'network-reach',
      label: 'Data-sharing network reach',
      value: networkReach,
      description: 'How much the footprint is tied to parent-company and sibling-service sharing.',
    },
    {
      key: 'broker-exposure',
      label: 'Data broker exposure',
      value: brokerExposure,
      description: 'How much broker and ad-tech convergence shows up in the mapped services.',
    },
    {
      key: 'ai-risk',
      label: 'AI sensitivity',
      value: aiSensitivity,
      description: 'How much AI-service usage raises disclosure, training, or profiling concerns.',
    },
  ];

  const score = clamp(
    tier === 'basic'
      ? serviceExposure * 0.5 + serviceVolume * 0.2 + highRiskAppDensity * 0.3
      : serviceExposure * 0.3 + serviceVolume * 0.15 + highRiskAppDensity * 0.2 + networkReach * 0.15 + brokerExposure * 0.1 + aiSensitivity * 0.1
  );

  const level = levelFromScore(score);
  const privacyScore = clamp(100 - score);
  const breakdown = tier === 'basic' ? basicBreakdown : advancedBreakdown;

  const flags: DfaRiskFlag[] = breakdown
    .filter((item) => item.value >= 30)
    .sort((a, b) => b.value - a.value)
    .slice(0, 4)
    .map((item) => ({ label: item.label, severity: severityFromValue(item.value) }));

  if (analysis.aiRiskSummary?.trainingDataRisk) {
    flags.push({ label: 'AI tools may reuse family prompts or conversations', severity: 'high' });
  }
  if (analysis.contextBreakdown.some((context) => context.context === 'school' && context.averageExposure >= 50)) {
    flags.push({ label: 'School-related services carry meaningful exposure', severity: 'high' });
  }

  const executiveSummary = `${tier === 'advanced' ? 'Advanced' : 'Basic'} DFA shows a ${level.toLowerCase()} risk posture. Risk score ${score}/100 reflects ${analysis.totalServices} services across ${analysis.totalMembers || 1} family profile${analysis.totalMembers === 1 ? '' : 's'}, with ${highRiskServices} higher-risk service${highRiskServices === 1 ? '' : 's'} in scope.`;

  return {
    tier,
    score,
    privacyScore,
    level,
    breakdown,
    flags: flags.slice(0, 5),
    executiveSummary,
  };
};
