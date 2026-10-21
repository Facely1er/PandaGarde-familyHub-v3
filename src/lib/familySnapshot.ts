/**
 * Family Snapshot — pure analysis for /family-snapshot (content in data/familySnapshot.ts).
 *
 * Same scoring curve as the SocialCaution Category Snapshot so ERMITS products
 * agree on what "exposure" means: each data type earns its tier weight, boosted
 * when several kinds of service hold it, then normalised against "every kind
 * ticked once" and eased so small selections still register.
 */
import {
  SNAPSHOT_COMBOS,
  SNAPSHOT_CONTEXTS,
  SNAPSHOT_CONTEXT_ORDER,
  SNAPSHOT_DATA,
  SNAPSHOT_KINDS,
  SNAPSHOT_TIER_WEIGHT,
  type SnapshotAgeBand,
  type SnapshotCombo,
  type SnapshotContextId,
  type SnapshotDataTypeId,
  type SnapshotKindId,
} from '../data/familySnapshot';

export const SNAPSHOT_KIND_ORDER = Object.keys(SNAPSHOT_KINDS) as SnapshotKindId[];
const AGE_BAND_IDS: readonly SnapshotAgeBand[] = ['5-8', '9-12', '13-17'];

export const FAMILY_SNAPSHOT_STORAGE_KEY = 'pandagarde_family_snapshot_v1';

export interface FamilySnapshotSelection {
  ages: SnapshotAgeBand[];
  kinds: SnapshotKindId[];
}

export interface SnapshotBand {
  key: 'contained' | 'moderate' | 'elevated' | 'high';
  label: string;
  line: string;
}

export interface SnapshotContextResult {
  id: SnapshotContextId;
  name: string;
  decidedBy: string;
  lever: string;
  kinds: SnapshotKindId[];
  score: number;
}

export interface SnapshotAgeFlag {
  id: 'under13-social' | 'young-open-chat' | 'school-consent' | 'teen-ai';
  text: string;
}

export interface FamilySnapshotAnalysis {
  ages: SnapshotAgeBand[];
  kinds: SnapshotKindId[];
  /** Data types sorted by tier, then by how many kinds hold them. */
  types: SnapshotDataTypeId[];
  critical: SnapshotDataTypeId[];
  spread: Partial<Record<SnapshotDataTypeId, number>>;
  score: number;
  band: SnapshotBand;
  /** Every context in display order, including ones with nothing ticked (score 0). */
  contexts: SnapshotContextResult[];
  schoolAssignedCount: number;
  combos: SnapshotCombo[];
  ageFlags: SnapshotAgeFlag[];
  nextSteps: string[];
}

type Spread = Partial<Record<SnapshotDataTypeId, number>>;

const spreadOf = (kinds: readonly SnapshotKindId[]): Spread => {
  const spread: Spread = {};
  kinds.forEach((k) => {
    SNAPSHOT_KINDS[k].data.forEach((d) => {
      spread[d] = (spread[d] ?? 0) + 1;
    });
  });
  return spread;
};

const points = (spread: Spread): number =>
  (Object.keys(spread) as SnapshotDataTypeId[]).reduce((p, d) => {
    const n = spread[d] ?? 0;
    return p + SNAPSHOT_TIER_WEIGHT[SNAPSHOT_DATA[d].tier] * (1 + 0.35 * Math.min(n - 1, 4));
  }, 0);

const scoreAgainst = (kinds: readonly SnapshotKindId[], reference: readonly SnapshotKindId[]): number => {
  if (!kinds.length) {return 0;}
  const max = points(spreadOf(reference));
  return Math.min(100, Math.round(100 * Math.pow(points(spreadOf(kinds)) / max, 0.7)));
};

const kindsInContext = (context: SnapshotContextId, kinds: readonly SnapshotKindId[] = SNAPSHOT_KIND_ORDER) =>
  kinds.filter((k) => SNAPSHOT_KINDS[k].context === context);

export const snapshotBand = (score: number): SnapshotBand => {
  if (score >= 80) {
    return { key: 'high', label: 'High', line: 'Your child’s data is spread widely, including several of the most sensitive types.' };
  }
  if (score >= 55) {
    return { key: 'elevated', label: 'Elevated', line: 'Sensitive data sits with many kinds of services, so one weak setting can travel far.' };
  }
  if (score >= 35) {
    return { key: 'moderate', label: 'Moderate', line: 'A focused footprint with a few sensitive areas worth a closer look.' };
  }
  return { key: 'contained', label: 'Contained', line: 'A small footprint. A few settings and one conversation will keep it that way.' };
};

const FALLBACK_STEPS = [
  'Check app permissions on your child’s device: location, microphone, camera and contacts.',
  'Protect the parent email that recovers your child’s accounts with a unique password and two-step sign-in.',
];

/** Drops unknown ids, de-duplicates, and returns ids in display order. */
export const sanitizeSelection = (raw: unknown): FamilySnapshotSelection => {
  const obj = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const kindSet = new Set<unknown>(Array.isArray(obj['kinds']) ? obj['kinds'] : []);
  const ageSet = new Set<unknown>(Array.isArray(obj['ages']) ? obj['ages'] : []);
  return {
    kinds: SNAPSHOT_KIND_ORDER.filter((k) => kindSet.has(k)),
    ages: AGE_BAND_IDS.filter((a) => ageSet.has(a)),
  };
};

const buildAgeFlags = (ages: readonly SnapshotAgeBand[], kinds: readonly SnapshotKindId[]): SnapshotAgeFlag[] => {
  const flags: SnapshotAgeFlag[] = [];
  const under13 = ages.includes('5-8') || ages.includes('9-12');
  const has = (pred: (k: SnapshotKindId) => boolean) => kinds.some(pred);

  if (under13 && has((k) => Boolean(SNAPSHOT_KINDS[k].minAge13))) {
    flags.push({
      id: 'under13-social',
      text: 'Many services you ticked set a minimum age of 13. Age is self-declared, and a child who signs up with an older birthdate loses the protections meant for younger users.',
    });
  }
  if (ages.includes('5-8') && has((k) => Boolean(SNAPSHOT_KINDS[k].openChat))) {
    flags.push({
      id: 'young-open-chat',
      text: 'Some games and video services you ticked include chat with people your child may not know. For ages 5–8, turn chat off or limit it to friends you approve.',
    });
  }
  if (under13 && has((k) => Boolean(SNAPSHOT_KINDS[k].schoolAssigned))) {
    flags.push({
      id: 'school-consent',
      text: 'In the US, schools can give consent on parents’ behalf for classroom apps used for education. Many of these apps hold your child’s data without you ever signing up.',
    });
  }
  if (ages.includes('13-17') && kinds.includes('social-ai')) {
    flags.push({
      id: 'teen-ai',
      text: 'Teens often confide in AI chatbots. Talk about what stays private — feelings, health, friends’ names, photos — and check whether chats are used to train the product.',
    });
  }
  return flags;
};

export const analyseFamilySnapshot = (selection: FamilySnapshotSelection): FamilySnapshotAnalysis => {
  const { kinds, ages } = sanitizeSelection(selection);
  const spread = spreadOf(kinds);
  const types = (Object.keys(spread) as SnapshotDataTypeId[]).sort(
    (a, b) =>
      SNAPSHOT_DATA[b].tier - SNAPSHOT_DATA[a].tier ||
      (spread[b] ?? 0) - (spread[a] ?? 0) ||
      SNAPSHOT_DATA[a].label.localeCompare(SNAPSHOT_DATA[b].label)
  );
  const score = scoreAgainst(kinds, SNAPSHOT_KIND_ORDER);

  const contexts: SnapshotContextResult[] = SNAPSHOT_CONTEXT_ORDER.map((id) => {
    const picked = kindsInContext(id, kinds);
    const ctx = SNAPSHOT_CONTEXTS[id];
    return {
      id,
      name: ctx.name,
      decidedBy: ctx.decidedBy,
      lever: ctx.lever,
      kinds: picked,
      score: scoreAgainst(picked, kindsInContext(id)),
    };
  });

  const ranked = contexts.filter((c) => c.kinds.length).sort((a, b) => b.score - a.score);
  const nextSteps = [...ranked.map((c) => SNAPSHOT_CONTEXTS[c.id].firstStep), ...FALLBACK_STEPS].slice(0, 3);

  return {
    ages,
    kinds,
    types,
    critical: types.filter((d) => SNAPSHOT_DATA[d].tier === 4),
    spread,
    score,
    band: snapshotBand(score),
    contexts,
    schoolAssignedCount: kinds.filter((k) => SNAPSHOT_KINDS[k].schoolAssigned).length,
    combos: SNAPSHOT_COMBOS.filter((c) => c.needs.every((d) => spread[d])),
    ageFlags: buildAgeFlags(ages, kinds),
    nextSteps: kinds.length ? nextSteps : [],
  };
};

/** Plain-text summary to copy or share. Never names a child or a specific app. */
export const familySnapshotShareText = (analysis: FamilySnapshotAnalysis, url: string): string => {
  const lines = [
    'Our Family Snapshot (PandaGarde)',
    `Exposure: ${analysis.score}/100 (${analysis.band.label})`,
    `${analysis.kinds.length} kinds of services · ${analysis.types.length} data types · ${analysis.critical.length} critical`,
  ];
  const active = analysis.contexts.filter((c) => c.kinds.length);
  if (active.length) {
    lines.push(active.map((c) => `${c.name}: ${c.score}`).join(' · '));
  }
  if (analysis.schoolAssignedCount) {
    lines.push(`${analysis.schoolAssignedCount} of these kinds are usually chosen by the school, not by us.`);
  }
  if (analysis.critical.length) {
    lines.push(`Most sensitive: ${analysis.critical.map((d) => SNAPSHOT_DATA[d].label).join('; ')}`);
  }
  lines.push('', `See your family’s big picture (stays on your device): ${url}`);
  return lines.join('\n');
};

export const loadFamilySnapshotSelection = (): FamilySnapshotSelection => {
  try {
    const raw = window.localStorage.getItem(FAMILY_SNAPSHOT_STORAGE_KEY);
    return sanitizeSelection(raw ? JSON.parse(raw) : null);
  } catch {
    return { ages: [], kinds: [] };
  }
};

export const saveFamilySnapshotSelection = (selection: FamilySnapshotSelection): void => {
  try {
    window.localStorage.setItem(FAMILY_SNAPSHOT_STORAGE_KEY, JSON.stringify(sanitizeSelection(selection)));
  } catch {
    // Storage blocked (private mode): the snapshot still works for this visit.
  }
};
