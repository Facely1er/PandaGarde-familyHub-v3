/**
 * Parent-provided scenario inputs for premium mission personalization.
 * All data stays on-device (localStorage).
 */

export const MISSION_SCENARIO_OVERRIDES_KEY = 'pandagarde_mission_scenario_overrides';

/** Parent input for a single mission's real-life scenario. */
export interface ParentScenarioInput {
  /** Fully custom scenario text written by the parent (highest priority). */
  customScenario?: string;
  /** App or platform to discuss (e.g. Minecraft, TikTok). */
  appName?: string;
  /** Child's first name for conversational framing. */
  childName?: string;
  /** How often the app is used, e.g. "every day", "on weekends". */
  usageFrequency?: string;
  /** Optional private note for the parent (not shown to kids in UI). */
  parentNote?: string;
  updatedAt?: string;
}

export type ScenarioOverrides = Record<string, ParentScenarioInput>;

export const loadScenarioOverrides = (): ScenarioOverrides => {
  if (typeof window === 'undefined') {
    return {};
  }
  try {
    const raw = window.localStorage.getItem(MISSION_SCENARIO_OVERRIDES_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw) as ScenarioOverrides;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

export const saveScenarioOverride = (activityId: string, input: ParentScenarioInput): void => {
  if (typeof window === 'undefined') {
    return;
  }
  const all = loadScenarioOverrides();
  const trimmed: ParentScenarioInput = {
    customScenario: input.customScenario?.trim() || undefined,
    appName: input.appName?.trim() || undefined,
    childName: input.childName?.trim() || undefined,
    usageFrequency: input.usageFrequency?.trim() || undefined,
    parentNote: input.parentNote?.trim() || undefined,
    updatedAt: new Date().toISOString(),
  };

  const hasContent = Boolean(
    trimmed.customScenario || trimmed.appName || trimmed.childName || trimmed.usageFrequency || trimmed.parentNote
  );

  if (!hasContent) {
    const { [activityId]: _removed, ...rest } = all;
    window.localStorage.setItem(MISSION_SCENARIO_OVERRIDES_KEY, JSON.stringify(rest));
    return;
  }

  all[activityId] = trimmed;
  window.localStorage.setItem(MISSION_SCENARIO_OVERRIDES_KEY, JSON.stringify(all));
};

export const getScenarioOverride = (activityId: string): ParentScenarioInput | undefined =>
  loadScenarioOverrides()[activityId];

export const clearScenarioOverride = (activityId: string): void => {
  saveScenarioOverride(activityId, {});
};
