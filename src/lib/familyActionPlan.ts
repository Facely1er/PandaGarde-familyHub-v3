/**
 * Family action plan — the end of the guided path (big picture → your apps → plan).
 *
 * Built only from apps the family picked in the service catalog. Each app becomes a
 * short card: what to know (its catalog privacy notes) and a checklist (its parent
 * tips), ordered by the catalog risk level and phrased in plain words, never as a
 * number. Ticks stay on this device.
 */
import { childServiceCatalog, type ChildService, type RiskLevel } from '../data/childServiceCatalog';
import {
  PICTURE_AREAS,
  PICTURE_KINDS,
  type PictureAgeBand,
  type PictureAreaId,
  type PictureKindId,
} from '../data/familyBigPicture';

export const ACTION_PLAN_STORAGE_KEY = 'pandagarde_action_plan_v1';

/** Keeps each card short enough to act on; the catalog has up to eight tips per app. */
const STEPS_PER_APP = 4;
const KNOWS_PER_APP = 2;

export type PlanPriority = 'first' | 'next' | 'later';

export const PLAN_PRIORITY_ORDER: readonly PlanPriority[] = ['first', 'next', 'later'];

export const PLAN_PRIORITY_LABEL: Record<PlanPriority, string> = {
  first: 'Do these first',
  next: 'Next',
  later: 'When you have time',
};

const PRIORITY_BY_RISK: Record<RiskLevel, PlanPriority> = {
  'very-high': 'first',
  high: 'first',
  medium: 'next',
  low: 'later',
};

const RISK_RANK: Record<RiskLevel, number> = { 'very-high': 0, high: 1, medium: 2, low: 3 };

/** Oldest age in each band — an app meant for older children gets an age note. */
const BAND_MAX_AGE: Record<PictureAgeBand, number> = { '5-8': 8, '9-12': 12, '13-17': 17 };

export interface PlanStep {
  id: string;
  text: string;
}

export interface PlanApp {
  serviceId: string;
  name: string;
  priority: PlanPriority;
  /** Plain-language notes from the catalog about what the app does with information. */
  knows: string[];
  steps: PlanStep[];
  notes: string[];
}

export interface FamilyStep extends PlanStep {
  area: string;
}

export interface FamilyActionPlan {
  apps: PlanApp[];
  /** Steps for big-picture areas the family ticked but picked no matching app for. */
  familySteps: FamilyStep[];
  totalSteps: number;
}

/** Stable id for a step so ticks survive reordering. */
export const planStepId = (scope: string, text: string): string => {
  let h = 0;
  for (let i = 0; i < text.length; i += 1) {h = (h * 31 + text.charCodeAt(i)) | 0;}
  return `${scope}:${(h >>> 0).toString(36)}`;
};

const ageNote = (service: ChildService, ages: readonly PictureAgeBand[]): string | null => {
  if (!ages.length) {return null;}
  const youngestMax = Math.min(...ages.map((a) => BAND_MAX_AGE[a]));
  return service.minAge > youngestMax
    ? `Meant for ages ${service.minAge} and up — check whether your youngest is old enough.`
    : null;
};

export interface ActionPlanInput {
  serviceIds: readonly string[];
  ages?: readonly PictureAgeBand[];
  kinds?: readonly PictureKindId[];
  catalog?: readonly ChildService[];
}

export const buildFamilyActionPlan = ({
  serviceIds,
  ages = [],
  kinds = [],
  catalog = childServiceCatalog,
}: ActionPlanInput): FamilyActionPlan => {
  const byId = new Map(catalog.map((s) => [s.id, s]));
  const services = [...new Set(serviceIds)]
    .map((id) => byId.get(id))
    .filter((s): s is ChildService => Boolean(s))
    .sort((a, b) => RISK_RANK[a.riskLevel] - RISK_RANK[b.riskLevel] || a.name.localeCompare(b.name));

  const apps: PlanApp[] = services.map((s) => {
    const notes = [
      s.schoolAssigned ? 'Chosen by the school — ask the teacher what this app keeps and for how long.' : null,
      ageNote(s, ages),
    ].filter((n): n is string => Boolean(n));
    return {
      serviceId: s.id,
      name: s.name,
      priority: PRIORITY_BY_RISK[s.riskLevel],
      knows: s.privacyConcerns.slice(0, KNOWS_PER_APP),
      steps: s.parentTips.slice(0, STEPS_PER_APP).map((text) => ({ id: planStepId(s.id, text), text })),
      notes,
    };
  });

  const picked = new Set(services.map((s) => s.id));
  const coveredAreas = new Set<PictureAreaId>();
  const familySteps: FamilyStep[] = [];
  kinds.forEach((k) => {
    const kind = PICTURE_KINDS[k];
    if (!kind || kind.catalogIds.some((id) => picked.has(id)) || coveredAreas.has(kind.area)) {return;}
    coveredAreas.add(kind.area);
    const area = PICTURE_AREAS[kind.area];
    familySteps.push({ id: planStepId(`area-${kind.area}`, area.step), text: area.step, area: area.name });
  });

  return {
    apps,
    familySteps,
    totalSteps: apps.reduce((n, a) => n + a.steps.length, 0) + familySteps.length,
  };
};

/** Every step id in the plan — used to count only ticks that still belong to it. */
export const planStepIds = (plan: FamilyActionPlan): string[] => [
  ...plan.apps.flatMap((a) => a.steps.map((s) => s.id)),
  ...plan.familySteps.map((s) => s.id),
];

export const loadPlanProgress = (): Set<string> => {
  try {
    const raw = window.localStorage.getItem(ACTION_PLAN_STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : []);
  } catch {
    return new Set();
  }
};

export const savePlanProgress = (done: ReadonlySet<string>): void => {
  try {
    window.localStorage.setItem(ACTION_PLAN_STORAGE_KEY, JSON.stringify([...done]));
  } catch {
    // Storage blocked: ticks last for this visit only.
  }
};
