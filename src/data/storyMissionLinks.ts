/**
 * Editorial links between Family Hub missions and Privacy Panda story episodes.
 * Source of truth for bidirectional story ↔ mission navigation.
 *
 * @see docs/FAMILYHUB_MISSIONS_PARENT_GUIDE.md
 */

/** missionId → story slug (primary related episode) */
export const MISSION_STORY_LINKS: Record<string, string> = {
  'pack-digital-backpack': 'privacy-panda-and-the-digital-bamboo-forest',
  'traffic-light-safety': 'ruby-and-the-very-friendly-stranger',
  'secret-keeper-club': 'the-day-the-password-was-too-short',
  'trusted-adults-online': 'pos-toughest-question',
  'my-info-collage': 'billys-invisible-collection',
  'permission-please': 'miki-and-the-photo-that-flew-away',
  'digital-footprint-trail': 'billys-invisible-collection',
  'phishing-patrol': 'ruby-and-the-very-friendly-stranger',
  'app-permission-inspector': 'mika-and-the-sneaky-settings',
  'privacy-settings-pro': 'mika-and-the-sneaky-settings',
  'screenshot-safety': 'when-miki-said-something-unkind',
  'password-strength-lab': 'the-day-the-password-was-too-short',
  'password-fortress-builder': 'the-day-the-password-was-too-short',
  'online-reputation-audit': 'the-weight-of-a-screenshot',
  'data-broker-discovery': 'what-mika-forgot-to-forget',
  'privacy-rights-challenge': 'the-forest-agreement',
  'social-media-simulator': 'the-weight-of-a-screenshot',
  'ai-and-your-privacy': 'the-echo-chamber',
};

/** story slug → mission ids (first entry is primary for story epilogue CTA) */
export const STORY_MISSION_LINKS: Record<string, string[]> = {
  'privacy-panda-and-the-digital-bamboo-forest': ['pack-digital-backpack'],
  'miki-and-the-photo-that-flew-away': ['permission-please'],
  'billys-invisible-collection': ['digital-footprint-trail', 'my-info-collage'],
  'mika-and-the-sneaky-settings': ['app-permission-inspector', 'privacy-settings-pro'],
  'ruby-and-the-very-friendly-stranger': ['trusted-adults-online', 'phishing-patrol', 'traffic-light-safety'],
  'the-day-the-password-was-too-short': ['secret-keeper-club', 'password-strength-lab', 'password-fortress-builder'],
  'when-miki-said-something-unkind': ['screenshot-safety'],
  'pos-toughest-question': ['trusted-adults-online'],
  'the-echo-chamber': ['ai-and-your-privacy'],
  'what-mika-forgot-to-forget': ['data-broker-discovery'],
  'the-weight-of-a-screenshot': ['screenshot-safety', 'social-media-simulator', 'online-reputation-audit'],
  'the-forest-agreement': ['privacy-rights-challenge'],
};

export function getStorySlugForMission(missionId: string): string | undefined {
  return MISSION_STORY_LINKS[missionId];
}

export function getMissionsForStory(storySlug: string): string[] {
  return STORY_MISSION_LINKS[storySlug] ?? [];
}

export function getPrimaryMissionForStory(storySlug: string): string | undefined {
  return STORY_MISSION_LINKS[storySlug]?.[0];
}
