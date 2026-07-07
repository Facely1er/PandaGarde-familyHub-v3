import type { CharacterRole, Story } from './stories';

export interface ForestCharacter {
  id: CharacterRole;
  name: string;
  species: string;
  epithet: string;
  tagline: string;
  tier: 1 | 2 | 3;
  debutEpisode: number;
  portraitUrl: string;
  /** Shown when portraitUrl is missing or fails to load */
  emoji: string;
}

/** Canon roster — copy from docs/STORYLINE_BIBLE.md §3 (not casting sheet labels). */
export const FOREST_CHARACTERS: ForestCharacter[] = [
  {
    id: 'po',
    name: 'Po',
    species: 'Panda',
    epithet: 'The Curious Leader',
    tagline: 'Brave, kind, and learning to protect what matters.',
    tier: 1,
    debutEpisode: 1,
    portraitUrl: '/images/characters/po-portrait.webp',
    emoji: '🐼',
  },
  {
    id: 'ruby',
    name: 'Ruby',
    species: 'Bunny',
    epithet: 'The Kind Bunny',
    tagline: 'Leads with heart and reminds friends to be kind online.',
    tier: 1,
    debutEpisode: 1,
    portraitUrl: '/images/characters/ruby-portrait.webp',
    emoji: '🐰',
  },
  {
    id: 'miki',
    name: 'Miki',
    species: 'Monkey',
    epithet: 'The Impulsive Peer',
    tagline: 'Curious and quick — still learning to pause before sharing.',
    tier: 1,
    debutEpisode: 1,
    portraitUrl: '/images/characters/miki-portrait.webp',
    emoji: '🐵',
  },
  {
    id: 'tao',
    name: 'Tao',
    species: 'Turtle',
    epithet: 'The Wise Turtle',
    tagline: 'Patient elder who keeps the forest paths safe and steady.',
    tier: 1,
    debutEpisode: 1,
    portraitUrl: '/images/characters/tao-portrait.webp',
    emoji: '🐢',
  },
  {
    id: 'billy',
    name: 'Billy',
    species: 'Beaver',
    epithet: 'The Clever Beaver',
    tagline: 'Builds helpful tools and learns that permission matters.',
    tier: 1,
    debutEpisode: 3,
    portraitUrl: '/images/characters/billy-portrait.webp',
    emoji: '🦫',
  },
  {
    id: 'mika',
    name: 'Mika',
    species: 'Owl',
    epithet: 'The Smart Owl',
    tagline: 'Keeps the Archive and helps friends check what is true.',
    tier: 1,
    debutEpisode: 4,
    portraitUrl: '/images/characters/mika-portrait.webp',
    emoji: '🦉',
  },
  {
    id: 'lumi',
    name: 'Lumi',
    species: 'Firefly',
    epithet: 'The Firefly',
    tagline: 'Creates light and learns how to share it with intention.',
    tier: 2,
    debutEpisode: 8,
    portraitUrl: '/images/characters/lumi-portrait.webp',
    emoji: '✨',
  },
  {
    id: 'vex',
    name: 'Vex',
    species: 'Chameleon',
    epithet: 'The Chameleon',
    tagline: 'Charming trickster who learns that trust must be earned.',
    tier: 3,
    debutEpisode: 10,
    portraitUrl: '/images/characters/vex-portrait.webp',
    emoji: '🦎',
  },
  {
    id: 'fiona',
    name: 'Fiona',
    species: 'Fox',
    epithet: 'The Fox',
    tagline: 'Explores who she is online and how to protect her identity.',
    tier: 2,
    debutEpisode: 10,
    portraitUrl: '/images/characters/fiona-portrait.webp',
    emoji: '🦊',
  },
  {
    id: 'kai',
    name: 'Kai',
    species: 'Fox',
    epithet: 'The Brave Fox',
    tagline: 'Bold builder who learns to create tools with care.',
    tier: 2,
    debutEpisode: 12,
    portraitUrl: '/images/characters/kai-portrait.webp',
    emoji: '🦊',
  },
  {
    id: 'sage',
    name: 'Sage',
    species: 'Crane',
    epithet: 'The Crane',
    tagline: 'Helps the forest understand rights and fair agreements.',
    tier: 3,
    debutEpisode: 16,
    portraitUrl: '/images/characters/sage-portrait.webp',
    emoji: '🦢',
  },
];

const CHARACTER_BY_ID: Record<CharacterRole, ForestCharacter | undefined> = Object.fromEntries(
  FOREST_CHARACTERS.map((character) => [character.id, character]),
) as Record<CharacterRole, ForestCharacter | undefined>;

const TIER_ORDER: Record<ForestCharacter['tier'], number> = { 1: 0, 2: 1, 3: 2 };

export const STORY_CAST_PATH = '/stories/cast';

export const CAST_TIER_LABELS: Record<ForestCharacter['tier'], string> = {
  1: 'Core friends',
  2: 'Allies & explorers',
  3: 'Tricksters & elders',
};

/** In-character lines shown when a Family Hub mission guided by this character is completed. */
export const CHARACTER_CELEBRATION_LINES: Partial<Record<CharacterRole, string>> = {
  po: '“We must be as careful with our information as we are with our real bamboo treasures. You just proved it.”',
  tao: '“Slow, steady, and safe. The forest paths are stronger because of what you practised today.”',
  ruby: '“Kind choices travel far in the forest — and yours will echo for a long time.”',
  mika: '“You checked before you trusted. That is exactly how the Archive stays true.”',
  billy: '“Asking first is how the best things get built. Well done, builder.”',
  lumi: '“You chose what to share and how to share it. That light is yours.”',
  fiona: '“Your story online belongs to you. Today you decided how it gets told.”',
  sage: '“Knowing your rights is how fair agreements begin. The forest is wiser with you in it.”',
};

export function getForestCharacter(id: CharacterRole): ForestCharacter | undefined {
  return CHARACTER_BY_ID[id];
}

export function getForestCharacterPortraitUrl(id: CharacterRole): string | undefined {
  const url = CHARACTER_BY_ID[id]?.portraitUrl;
  return url || undefined;
}

/** Match story.characters strings ("Mika the Owl") to canonical roles. */
export function roleFromCharacterLabel(label: string): CharacterRole | undefined {
  const lower = label.toLowerCase();
  if (lower.includes('miki')) {return 'miki';}
  if (lower.includes('mika')) {return 'mika';}
  if (lower.includes('ruby')) {return 'ruby';}
  if (lower.includes('billy')) {return 'billy';}
  if (lower.includes('lumi')) {return 'lumi';}
  if (lower.includes('fiona')) {return 'fiona';}
  if (lower.includes('kai')) {return 'kai';}
  if (lower.includes('vex')) {return 'vex';}
  if (lower.includes('sage')) {return 'sage';}
  if (lower.includes('tao') || lower.includes('turtle')) {return 'tao';}
  if (lower.includes('po') || lower.includes('panda')) {return 'po';}
  return undefined;
}

export function getCharactersForStory(story: Story): ForestCharacter[] {
  const roleIds = new Set<CharacterRole>([story.leadCharacter]);
  for (const label of story.characters) {
    const role = roleFromCharacterLabel(label);
    if (role) {roleIds.add(role);}
  }

  return [...roleIds]
    .map((id) => getForestCharacter(id))
    .filter((character): character is ForestCharacter => Boolean(character))
    .sort((a, b) => {
      const leadDelta = Number(b.id === story.leadCharacter) - Number(a.id === story.leadCharacter);
      if (leadDelta !== 0) {return leadDelta;}
      return TIER_ORDER[a.tier] - TIER_ORDER[b.tier] || a.name.localeCompare(b.name);
    });
}

export function getCharactersDebutingInEpisode(episodeNumber: number): ForestCharacter[] {
  return FOREST_CHARACTERS.filter((character) => character.debutEpisode === episodeNumber);
}

export function getCastGalleryCharacters(): ForestCharacter[] {
  return [...FOREST_CHARACTERS].sort(
    (a, b) => a.debutEpisode - b.debutEpisode || TIER_ORDER[a.tier] - TIER_ORDER[b.tier],
  );
}
