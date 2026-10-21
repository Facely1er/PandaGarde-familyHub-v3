import { beforeEach, describe, expect, it } from 'vitest';
import { childServiceCatalog } from '../data/childServiceCatalog';
import { PICTURE_KINDS } from '../data/familyBigPicture';
import {
  ACTION_PLAN_STORAGE_KEY,
  buildFamilyActionPlan,
  loadPlanProgress,
  planStepId,
  planStepIds,
  savePlanProgress,
} from './familyActionPlan';

const catalogIds = new Set(childServiceCatalog.map((s) => s.id));

describe('big picture → catalog mapping', () => {
  it('suggests only apps that exist in the service catalog', () => {
    Object.values(PICTURE_KINDS).forEach((kind) => {
      kind.catalogIds.forEach((id) => expect(catalogIds, id).toContain(id));
    });
  });
});

describe('catalog copy shown in the action plan', () => {
  // Parents read these notes and tips directly; keep them in everyday words.
  const JARGON =
    /\b(FERPA|COPPA|HIPAA|CPNI|IMEI|IMSI|UIDH|LTI|SIS|API|SDK|metadata|aggregators?|ecosystem|analytics|infrastructure|retention|biometric|enterprise|HealthKit|proxy access|identity-resolution|de-identified|data processing|two-factor|authentication)\b/i;

  it('uses no technical or legal jargon', () => {
    const offenders = childServiceCatalog.flatMap((s) =>
      [...s.privacyConcerns, ...s.parentTips].filter((t) => JARGON.test(t)).map((t) => `${s.id}: ${t}`)
    );
    expect(offenders).toEqual([]);
  });
});

describe('buildFamilyActionPlan', () => {
  it('is empty without apps or kinds', () => {
    const plan = buildFamilyActionPlan({ serviceIds: [] });
    expect(plan.apps).toEqual([]);
    expect(plan.familySteps).toEqual([]);
    expect(plan.totalSteps).toBe(0);
  });

  it('orders apps by catalog risk and maps risk to plain priorities', () => {
    const plan = buildFamilyActionPlan({ serviceIds: ['pbs-kids', 'tiktok', 'roblox'] });
    expect(plan.apps.map((a) => a.serviceId)).toEqual(['tiktok', 'roblox', 'pbs-kids']);
    expect(plan.apps.map((a) => a.priority)).toEqual(['first', 'next', 'later']);
  });

  it('ignores unknown and duplicate ids', () => {
    const plan = buildFamilyActionPlan({ serviceIds: ['roblox', 'roblox', 'not-real'] });
    expect(plan.apps).toHaveLength(1);
  });

  it('builds short cards from catalog notes and tips', () => {
    const [app] = buildFamilyActionPlan({ serviceIds: ['instagram'] }).apps;
    const source = childServiceCatalog.find((s) => s.id === 'instagram');
    expect(app?.knows).toEqual(source?.privacyConcerns.slice(0, 2));
    expect(app?.steps.map((s) => s.text)).toEqual(source?.parentTips.slice(0, 4));
    expect(new Set(app?.steps.map((s) => s.id)).size).toBe(app?.steps.length);
  });

  it('adds school and age notes when they apply', () => {
    const school = childServiceCatalog.find((s) => s.schoolAssigned);
    expect(school).toBeDefined();
    const [schoolApp] = buildFamilyActionPlan({ serviceIds: [school?.id ?? ''] }).apps;
    expect(schoolApp?.notes.join(' ')).toMatch(/Chosen by the school/);

    const young = buildFamilyActionPlan({ serviceIds: ['tiktok'], ages: ['9-12', '13-17'] }).apps[0];
    expect(young?.notes.join(' ')).toMatch(/ages 13 and up/);
    const teen = buildFamilyActionPlan({ serviceIds: ['tiktok'], ages: ['13-17'] }).apps[0];
    expect(teen?.notes).toEqual([]);
  });

  it('adds one family step per big-picture area with no matching app picked', () => {
    const plan = buildFamilyActionPlan({
      serviceIds: ['roblox'],
      kinds: ['play-worlds', 'home-smart', 'home-streaming', 'school-device'],
    });
    expect(plan.familySteps.map((s) => s.area)).toEqual(['At home', 'School']);
    expect(plan.totalSteps).toBe(plan.apps[0]!.steps.length + 2);
    expect(planStepIds(plan)).toHaveLength(plan.totalSteps);
  });
});

describe('plan progress storage', () => {
  beforeEach(() => window.localStorage.clear());

  it('round-trips ticked step ids', () => {
    const id = planStepId('roblox', 'Turn off chat');
    savePlanProgress(new Set([id]));
    expect(loadPlanProgress().has(id)).toBe(true);
  });

  it('recovers from corrupt storage', () => {
    window.localStorage.setItem(ACTION_PLAN_STORAGE_KEY, '{bad');
    expect(loadPlanProgress().size).toBe(0);
  });
});
