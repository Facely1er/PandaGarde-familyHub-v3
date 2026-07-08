import { useCallback, useMemo, useState } from 'react';
import { useFamily } from '../contexts/FamilyContext';
import { footprintAnalyzer } from '../lib/footprintAnalyzer';
import type { FootprintAnalysis } from '../lib/footprintAnalyzer';
import type { FlattenedAgeBasedActivity } from '../data/ageBasedActivities';
import {
  getScenarioOverride,
  loadScenarioOverrides,
  saveScenarioOverride,
  type ParentScenarioInput,
} from '../lib/missionScenarioConfig';
import { isPremiumActive } from '../lib/premiumEntitlement';
import { resolveMissionScenario, type ResolvedMissionScenario } from '../lib/personalizeActivity';

const buildFootprintAnalysis = (
  familyMembers: ReturnType<typeof useFamily>['familyMembers'],
  getFamilyServices: ReturnType<typeof useFamily>['getFamilyServices']
): FootprintAnalysis | null => {
  const catalogServices = getFamilyServices();
  const memberServices: Record<string, string[]> = {};
  let totalServicesCount = 0;

  familyMembers.forEach((member) => {
    const memberServiceIds = member.services?.map((s) => s.serviceId) ?? [];
    memberServices[member.id] = memberServiceIds;
    totalServicesCount += memberServiceIds.length;
  });

  if (totalServicesCount === 0 && catalogServices.length > 0) {
    memberServices.family = catalogServices;
    totalServicesCount = catalogServices.length;
  }

  if (totalServicesCount === 0) {
    return null;
  }

  const membersForAnalysis =
    familyMembers.length > 0
      ? familyMembers
      : [
          {
            id: 'family',
            services: catalogServices.map((id) => ({ serviceId: id, status: 'approved' as const })),
          },
        ];

  return footprintAnalyzer.analyzeFamilyFootprint(membersForAnalysis, memberServices);
};

export const useFootprintAnalysis = (): FootprintAnalysis | null => {
  const { familyMembers, getFamilyServices } = useFamily();
  return useMemo(
    () => buildFootprintAnalysis(familyMembers, getFamilyServices),
    [familyMembers, getFamilyServices]
  );
};

export const useResolvedMissionScenario = (
  activity: FlattenedAgeBasedActivity
): {
  scenario: ResolvedMissionScenario;
  isPremium: boolean;
  parentInput: ParentScenarioInput | undefined;
  saveParentInput: (input: ParentScenarioInput) => void;
  clearParentInput: () => void;
  refresh: () => void;
} => {
  const analysis = useFootprintAnalysis();
  const [revision, setRevision] = useState(0);

  const isPremium = isPremiumActive();
  const parentInput = useMemo(
    () => getScenarioOverride(activity.id),
    // revision triggers reload after parent saves
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activity.id, revision]
  );

  const scenario = useMemo(
    () =>
      resolveMissionScenario(activity, {
        isPremium,
        parentInput,
        analysis,
      }),
    [activity, isPremium, parentInput, analysis]
  );

  const saveParentInput = useCallback(
    (input: ParentScenarioInput) => {
      saveScenarioOverride(activity.id, input);
      setRevision((r) => r + 1);
    },
    [activity.id]
  );

  const clearParentInput = useCallback(() => {
    saveScenarioOverride(activity.id, {});
    setRevision((r) => r + 1);
  }, [activity.id]);

  const refresh = useCallback(() => {
    void loadScenarioOverrides();
    setRevision((r) => r + 1);
  }, []);

  return { scenario, isPremium, parentInput, saveParentInput, clearParentInput, refresh };
};
