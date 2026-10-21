/**
 * Family big picture — pure logic for /big-picture (content in data/familyBigPicture.ts).
 *
 * Deliberately produces no score for parents. Areas are ranked internally by how
 * sensitive the information their apps usually hold is, then described in plain
 * words: "Start here", "Worth a look", "Lighter for now".
 */
import {
  PICTURE_AREAS,
  PICTURE_AREA_ORDER,
  PICTURE_DATA,
  PICTURE_KINDS,
  type PictureAgeBand,
  type PictureAreaId,
  type PictureDataId,
  type PictureKindId,
} from '../data/familyBigPicture';

export const PICTURE_KIND_ORDER = Object.keys(PICTURE_KINDS) as PictureKindId[];
const AGE_BAND_IDS: readonly PictureAgeBand[] = ['5-8', '9-12', '13-17'];

/** Kept from the first release so earlier selections still load. */
export const FAMILY_PICTURE_STORAGE_KEY = 'pandagarde_family_snapshot_v1';

/** Areas within this share of the top area's weight read "Worth a look"; below it, "Lighter for now". */
const LOOK_THRESHOLD = 0.6;
const KNOWS_CAP = 4;

export interface FamilyPictureSelection {
  ages: PictureAgeBand[];
  kinds: PictureKindId[];
}

export type AreaLevel = 'start' | 'look' | 'light' | 'none';

export const AREA_LEVEL_LABEL: Record<AreaLevel, string> = {
  start: 'Start here',
  look: 'Worth a look',
  light: 'Lighter for now',
  none: 'Not ticked',
};

export interface AreaResult {
  id: PictureAreaId;
  name: string;
  decidedBy: string;
  kinds: PictureKindId[];
  level: AreaLevel;
  /** Plain words for what these apps usually know, most sensitive first. */
  knows: string[];
}

export interface AgeNote {
  id: 'under13-apps' | 'young-chat' | 'school-consent' | 'teen-ai';
  text: string;
}

export interface FamilyPicture {
  ages: PictureAgeBand[];
  kinds: PictureKindId[];
  /** Every area in display order, including ones with nothing ticked. */
  areas: AreaResult[];
  /** The area to start with, or null when nothing is ticked. */
  startArea: PictureAreaId | null;
  hasSchool: boolean;
  ageNotes: AgeNote[];
  /** Up to three things to do this week, starting with the "Start here" area. */
  steps: string[];
}

const FALLBACK_STEPS = [
  'On your child’s phone or tablet, turn off location for apps that don’t need it.',
  'Make sure only you know the password to the email linked to your child’s accounts.',
];

/** Drops unknown ids, de-duplicates, and returns ids in display order. */
export const sanitizePictureSelection = (raw: unknown): FamilyPictureSelection => {
  const obj = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const kindSet = new Set<unknown>(Array.isArray(obj['kinds']) ? obj['kinds'] : []);
  const ageSet = new Set<unknown>(Array.isArray(obj['ages']) ? obj['ages'] : []);
  return {
    kinds: PICTURE_KIND_ORDER.filter((k) => kindSet.has(k)),
    ages: AGE_BAND_IDS.filter((a) => ageSet.has(a)),
  };
};

const uniqueData = (kinds: readonly PictureKindId[]): PictureDataId[] => {
  const seen = new Set<PictureDataId>();
  kinds.forEach((k) => PICTURE_KINDS[k].data.forEach((d) => seen.add(d)));
  return [...seen];
};

/** Sensitivity of an area: each data type once, boosted a little for every extra kind ticked. */
const areaWeight = (kinds: readonly PictureKindId[]): number =>
  kinds.length
    ? uniqueData(kinds).reduce((sum, d) => sum + PICTURE_DATA[d].weight, 0) * (1 + 0.25 * (kinds.length - 1))
    : 0;

const buildAgeNotes = (ages: readonly PictureAgeBand[], kinds: readonly PictureKindId[]): AgeNote[] => {
  const notes: AgeNote[] = [];
  const under13 = ages.includes('5-8') || ages.includes('9-12');
  const any = (pred: (k: PictureKindId) => boolean) => kinds.some(pred);

  if (under13 && any((k) => Boolean(PICTURE_KINDS[k].minAge13))) {
    notes.push({
      id: 'under13-apps',
      text: 'Some apps you ticked are meant for ages 13 and up. Children who sign up with an older age lose the extra protections for kids.',
    });
  }
  if (ages.includes('5-8') && any((k) => Boolean(PICTURE_KINDS[k].openChat))) {
    notes.push({
      id: 'young-chat',
      text: 'Some games and apps you ticked let people your child doesn’t know chat with them. For ages 5–8, turn chat off or keep it to friends you know.',
    });
  }
  if (under13 && any((k) => PICTURE_KINDS[k].area === 'school')) {
    notes.push({
      id: 'school-consent',
      text: 'In the US, schools can agree to classroom apps for you when children are under 13 — so you may never have signed up for them.',
    });
  }
  if (ages.includes('13-17') && kinds.includes('social-ai')) {
    notes.push({
      id: 'teen-ai',
      text: 'Teens often confide in AI chatbots. Talk about what to keep private: feelings, health, friends’ names and photos.',
    });
  }
  return notes;
};

export const buildFamilyPicture = (selection: FamilyPictureSelection): FamilyPicture => {
  const { kinds, ages } = sanitizePictureSelection(selection);

  const weighted = PICTURE_AREA_ORDER.map((id) => {
    const picked = kinds.filter((k) => PICTURE_KINDS[k].area === id);
    return { id, picked, weight: areaWeight(picked) };
  });
  const ranked = weighted.filter((a) => a.picked.length).sort((a, b) => b.weight - a.weight);
  const top = ranked[0];

  const areas: AreaResult[] = weighted.map(({ id, picked, weight }) => {
    let level: AreaLevel = 'none';
    if (picked.length) {
      if (top && id === top.id) {level = 'start';}
      else {level = top && weight >= top.weight * LOOK_THRESHOLD ? 'look' : 'light';}
    }
    const knows = uniqueData(picked)
      .sort((a, b) => PICTURE_DATA[b].weight - PICTURE_DATA[a].weight)
      .slice(0, KNOWS_CAP)
      .map((d) => PICTURE_DATA[d].words);
    return { id, name: PICTURE_AREAS[id].name, decidedBy: PICTURE_AREAS[id].decidedBy, kinds: picked, level, knows };
  });

  const steps = kinds.length
    ? [...ranked.map((a) => PICTURE_AREAS[a.id].step), ...FALLBACK_STEPS].slice(0, 3)
    : [];

  return {
    ages,
    kinds,
    areas,
    startArea: top ? top.id : null,
    hasSchool: kinds.some((k) => PICTURE_KINDS[k].area === 'school'),
    ageNotes: buildAgeNotes(ages, kinds),
    steps,
  };
};

export const loadFamilyPictureSelection = (): FamilyPictureSelection => {
  try {
    const raw = window.localStorage.getItem(FAMILY_PICTURE_STORAGE_KEY);
    return sanitizePictureSelection(raw ? JSON.parse(raw) : null);
  } catch {
    return { ages: [], kinds: [] };
  }
};

export const saveFamilyPictureSelection = (selection: FamilyPictureSelection): void => {
  try {
    window.localStorage.setItem(FAMILY_PICTURE_STORAGE_KEY, JSON.stringify(sanitizePictureSelection(selection)));
  } catch {
    // Storage blocked (private mode): the page still works for this visit.
  }
};
