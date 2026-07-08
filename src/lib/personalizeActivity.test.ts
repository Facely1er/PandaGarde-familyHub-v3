import { describe, expect, it, beforeEach } from 'vitest';
import { resolveMissionScenario } from './personalizeActivity';
import type { FootprintAnalysis } from './footprintAnalyzer';
import { getExposureLevel } from './privacyExposureIndex';

const baseActivity = {
  id: 'digital-footprint-trail',
  realLifeScenario:
    'You have played Roblox every day for two years. What does Roblox probably know about you by now?',
  scenarioTemplate:
    '{childPrefix}played {app} {frequency}. What does {app} probably know about you by now?',
  personalizationCategory: 'gaming' as const,
};

const gamingAnalysis: FootprintAnalysis = {
  familyScore: 50,
  totalServices: 2,
  totalMembers: 1,
  averageExposureIndex: 60,
  categoryBreakdown: [],
  contextBreakdown: [],
  serviceRisks: [
    {
      serviceId: 'minecraft',
      serviceName: 'Minecraft',
      category: 'gaming',
      exposureIndex: 55,
      exposureLevel: getExposureLevel(55),
      riskFactors: [],
      memberCount: 1,
    },
    {
      serviceId: 'roblox',
      serviceName: 'Roblox',
      category: 'gaming',
      exposureIndex: 80,
      exposureLevel: getExposureLevel(80),
      riskFactors: [],
      memberCount: 1,
    },
  ],
  dataSharingNetwork: [],
  recommendations: [],
  privacyScore: 50,
  dataBrokerAnalysis: {
    totalMappedServices: 0,
    totalUniqueThirdParties: 0,
    totalUniqueBrokers: 0,
    serviceChains: [],
    crossServiceBrokers: [],
  },
  aiRiskSummary: null,
};

describe('resolveMissionScenario', () => {
  it('returns baseline for free users even when DFA data exists', () => {
    const result = resolveMissionScenario(baseActivity, {
      isPremium: false,
      analysis: gamingAnalysis,
      parentInput: { appName: 'Minecraft' },
    });
    expect(result.source).toBe('baseline');
    expect(result.isPersonalized).toBe(false);
    expect(result.text).toContain('Roblox');
  });

  it('uses parent custom scenario when premium', () => {
    const result = resolveMissionScenario(baseActivity, {
      isPremium: true,
      parentInput: { customScenario: 'Sam got a weird DM in Discord yesterday.' },
    });
    expect(result.source).toBe('parent-custom');
    expect(result.text).toBe('Sam got a weird DM in Discord yesterday.');
  });

  it('fills template from parent app name when premium', () => {
    const result = resolveMissionScenario(baseActivity, {
      isPremium: true,
      parentInput: { appName: 'Fortnite', childName: 'Alex', usageFrequency: 'every weekend' },
    });
    expect(result.source).toBe('parent-template');
    expect(result.text).toContain('Alex has played Fortnite every weekend');
    expect(result.appName).toBe('Fortnite');
  });

  it('fills template from DFA catalog when premium and no parent app', () => {
    const result = resolveMissionScenario(baseActivity, {
      isPremium: true,
      analysis: gamingAnalysis,
    });
    expect(result.source).toBe('dfa-template');
    expect(result.text).toContain('Roblox');
    expect(result.isPersonalized).toBe(true);
  });

  it('uses generic app when premium but no catalog match', () => {
    const result = resolveMissionScenario(baseActivity, {
      isPremium: true,
      analysis: null,
    });
    expect(result.source).toBe('generic-template');
    expect(result.text).toContain('a game you play often');
  });
});

describe('premiumEntitlement', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('unlock and clear premium', async () => {
    const { unlockPremiumWithCode, isPremiumActive, clearPremiumEntitlement } = await import(
      './premiumEntitlement'
    );
    expect(isPremiumActive()).toBe(false);
    const unlock = unlockPremiumWithCode('PANDA-PILOT-2026');
    expect(unlock.success).toBe(true);
    expect(isPremiumActive()).toBe(true);
    clearPremiumEntitlement();
    expect(isPremiumActive()).toBe(false);
  });
});

describe('missionScenarioConfig', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('persists and clears parent overrides', async () => {
    const { saveScenarioOverride, getScenarioOverride, clearScenarioOverride } = await import(
      './missionScenarioConfig'
    );
    saveScenarioOverride('phishing-patrol', { appName: 'Minecraft', childName: 'Jamie' });
    expect(getScenarioOverride('phishing-patrol')?.appName).toBe('Minecraft');
    clearScenarioOverride('phishing-patrol');
    expect(getScenarioOverride('phishing-patrol')).toBeUndefined();
  });
});
