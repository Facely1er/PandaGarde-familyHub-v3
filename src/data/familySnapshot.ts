/**
 * Family Snapshot — content for the "big picture" intro at /family-snapshot.
 *
 * Parents tick *kinds* of services (not named apps) across the four parts of a
 * child's online life: school, play, social, and home. The analysis in
 * `lib/familySnapshot.ts` turns that into an exposure overview, then points to
 * the service catalog for the named-app footprint review.
 *
 * Adapted from the SocialCaution Category Snapshot (same tier weights and score
 * curve) with child-centred data types and school-assigned (involuntary) context.
 * Copy must follow docs/CONTENT_TRUTH.md: this describes what services in a
 * category *typically* collect — nothing here observes a child's device.
 */

export type SnapshotDataTier = 1 | 2 | 3 | 4;

export type SnapshotDataTypeId =
  | 'identity'
  | 'ids'
  | 'learning'
  | 'conduct'
  | 'location'
  | 'home'
  | 'faceVoice'
  | 'media'
  | 'messages'
  | 'graph'
  | 'activity'
  | 'purchases'
  | 'wellbeing'
  | 'device';

export interface SnapshotDataType {
  label: string;
  note: string;
  /** 4 critical · 3 high · 2 moderate · 1 low */
  tier: SnapshotDataTier;
}

/** Data types, tiered by how much harm a leak or misuse could do to a child. */
export const SNAPSHOT_DATA: Record<SnapshotDataTypeId, SnapshotDataType> = {
  identity: { label: 'Name, age & contact', note: 'Who your child is and how to reach them', tier: 2 },
  ids: { label: 'Birthdate & student ID numbers', note: 'Identifiers that unlock school and official records', tier: 4 },
  learning: { label: 'Grades, test results & learning profile', note: 'Skill gaps, reading level, progress over years', tier: 3 },
  conduct: { label: 'Behavior notes & school flags', note: 'Behavior points, discipline, counselor or safety alerts', tier: 4 },
  location: { label: 'Precise location', note: 'GPS, live location sharing, places visited', tier: 4 },
  home: { label: 'Home address & family routine', note: 'Where you live, who is home, and when', tier: 3 },
  faceVoice: { label: 'Face & voice', note: 'Face images, voice chat and voice recordings', tier: 4 },
  media: { label: 'Photos & videos', note: 'Including time and place metadata', tier: 3 },
  messages: { label: 'Chats, posts & voice messages', note: 'What your child writes, says and shares', tier: 3 },
  graph: { label: 'Friends, followers & contacts', note: 'Who your child talks to and plays with', tier: 2 },
  activity: { label: 'Viewing, play & browsing habits', note: 'What they watch, play, search and click', tier: 2 },
  purchases: { label: 'Purchases & linked payment', note: 'In-app currency, subscriptions, stored cards', tier: 3 },
  wellbeing: { label: 'Mood, health & wellbeing signals', note: 'Feelings shared with apps, health or activity data', tier: 4 },
  device: { label: 'Device & advertising IDs', note: 'The keys that link a child across apps', tier: 1 },
};

export const SNAPSHOT_TIER_NAME: Record<SnapshotDataTier, string> = {
  4: 'Critical',
  3: 'High',
  2: 'Moderate',
  1: 'Low',
};

export const SNAPSHOT_TIER_WEIGHT: Record<SnapshotDataTier, number> = { 4: 10, 3: 6, 2: 3, 1: 1 };

export type SnapshotContextId = 'school' | 'play' | 'social' | 'home';

export interface SnapshotContext {
  name: string;
  /** Short line under the context heading in the picker. */
  lede: string;
  /** Who chooses these services — the core of the parent's lever. */
  decidedBy: string;
  /** What a parent can actually do about this part of their child's life. */
  lever: string;
  /** First step suggested in "Where to start" when this context scores highest. */
  firstStep: string;
}

export const SNAPSHOT_CONTEXT_ORDER: readonly SnapshotContextId[] = ['school', 'play', 'social', 'home'];

export const SNAPSHOT_CONTEXTS: Record<SnapshotContextId, SnapshotContext> = {
  school: {
    name: 'School & learning',
    lede: 'Apps and devices the school chooses for your child.',
    decidedBy: 'Usually chosen by the school',
    lever: 'You rarely sign up for these, so your lever is asking the school the right questions.',
    firstStep:
      'Ask the school for the list of apps your child uses in class, and which ones hold grades, behavior notes or monitoring data.',
  },
  play: {
    name: 'Games & play',
    lede: 'Consoles, game worlds, mobile games and game chat.',
    decidedBy: 'Chosen by you and your child',
    lever: 'Most controls live in the family or parent settings of the console or game account.',
    firstStep:
      'Open the family settings on each console or game account: limit chat to friends, require approval for purchases.',
  },
  social: {
    name: 'Social, video & AI chat',
    lede: 'Feeds, messaging, video apps and AI chatbots.',
    decidedBy: 'Often chosen by your child',
    lever: 'Age limits are self-declared, so settings plus an ongoing conversation matter most.',
    firstStep:
      'Sit down together and set accounts to private, turn off location sharing, and review who can message your child.',
  },
  home: {
    name: 'Home & family devices',
    lede: 'Streaming, smart speakers and toys, phones and location sharing, health apps.',
    decidedBy: 'Chosen by you',
    lever: 'You own these accounts, so a one-time settings review goes a long way.',
    firstStep:
      'Review voice-recording history and location-sharing settings on the family devices and apps you set up.',
  },
};

export type SnapshotKindId =
  | 'school-lms'
  | 'school-adaptive'
  | 'school-comms'
  | 'school-devices'
  | 'school-records'
  | 'play-worlds'
  | 'play-console'
  | 'play-mobile'
  | 'play-chat'
  | 'social-video'
  | 'social-messaging'
  | 'social-ai'
  | 'home-streaming'
  | 'home-smart'
  | 'home-location'
  | 'home-health';

export interface SnapshotKind {
  context: SnapshotContextId;
  name: string;
  /** Well-known examples so parents recognise the kind. Not an endorsement or a rating. */
  examples: string;
  data: SnapshotDataTypeId[];
  /** True when services of this kind are typically assigned by a school or district. */
  schoolAssigned?: boolean;
  /** Many services of this kind set a minimum age of 13 in their terms (self-declared at sign-up). */
  minAge13?: boolean;
  /** Services of this kind commonly include chat or voice with people your child may not know. */
  openChat?: boolean;
}

export const SNAPSHOT_KINDS: Record<SnapshotKindId, SnapshotKind> = {
  'school-lms': {
    context: 'school',
    name: 'Classroom & homework platforms',
    examples: 'Google Classroom, Canvas, Schoology, Seesaw',
    data: ['identity', 'learning', 'messages', 'media', 'activity', 'device'],
    schoolAssigned: true,
  },
  'school-adaptive': {
    context: 'school',
    name: 'Practice, reading & test apps',
    examples: 'IXL, i-Ready, Khan Academy, Prodigy, Lexia',
    data: ['identity', 'learning', 'activity', 'device'],
    schoolAssigned: true,
  },
  'school-comms': {
    context: 'school',
    name: 'Class messaging & behavior apps',
    examples: 'ClassDojo, Remind, ParentSquare, Bloomz',
    data: ['identity', 'conduct', 'media', 'messages', 'graph'],
    schoolAssigned: true,
  },
  'school-devices': {
    context: 'school',
    name: 'School laptop, filtering & monitoring',
    examples: 'School Chromebook, GoGuardian, Securly, Gaggle',
    data: ['activity', 'messages', 'conduct', 'wellbeing', 'device'],
    schoolAssigned: true,
  },
  'school-records': {
    context: 'school',
    name: 'Student records & school portals',
    examples: 'PowerSchool, Infinite Campus, school health portal',
    data: ['identity', 'ids', 'learning', 'conduct', 'home', 'wellbeing'],
    schoolAssigned: true,
  },
  'play-worlds': {
    context: 'play',
    name: 'Online game worlds',
    examples: 'Roblox, Minecraft, Fortnite',
    data: ['identity', 'messages', 'graph', 'faceVoice', 'purchases', 'activity', 'device'],
    openChat: true,
  },
  'play-console': {
    context: 'play',
    name: 'Consoles & PC game stores',
    examples: 'Nintendo Switch, PlayStation, Xbox, Steam',
    data: ['identity', 'ids', 'graph', 'faceVoice', 'purchases', 'activity'],
    openChat: true,
  },
  'play-mobile': {
    context: 'play',
    name: 'Free mobile games',
    examples: 'Ad-supported puzzle, racing and casual games',
    data: ['location', 'activity', 'purchases', 'device'],
  },
  'play-chat': {
    context: 'play',
    name: 'Game chat & streaming',
    examples: 'Discord, Twitch, in-game voice chat',
    data: ['identity', 'messages', 'graph', 'faceVoice', 'media', 'device'],
    minAge13: true,
    openChat: true,
  },
  'social-video': {
    context: 'social',
    name: 'Video & photo feeds',
    examples: 'TikTok, YouTube, Instagram',
    data: ['identity', 'media', 'faceVoice', 'activity', 'location', 'graph', 'messages', 'device'],
    minAge13: true,
    openChat: true,
  },
  'social-messaging': {
    context: 'social',
    name: 'Messaging & disappearing chats',
    examples: 'Snapchat, WhatsApp, Instagram DMs, group chats',
    data: ['identity', 'messages', 'media', 'graph', 'location', 'faceVoice'],
    minAge13: true,
  },
  'social-ai': {
    context: 'social',
    name: 'AI chatbots & companions',
    examples: 'ChatGPT, Gemini, Snapchat My AI, Character.AI',
    data: ['messages', 'wellbeing', 'activity', 'faceVoice', 'device'],
    minAge13: true,
  },
  'home-streaming': {
    context: 'home',
    name: 'Streaming & kids’ video',
    examples: 'YouTube Kids, Netflix, Disney+',
    data: ['identity', 'activity', 'device'],
  },
  'home-smart': {
    context: 'home',
    name: 'Smart speakers, toys & cameras',
    examples: 'Alexa, Google Home, connected toys, baby monitors',
    data: ['faceVoice', 'home', 'media', 'activity', 'device'],
  },
  'home-location': {
    context: 'home',
    name: 'Kid phones, watches & location sharing',
    examples: 'Google Family Link, Find My, Life360, kids’ smartwatches',
    data: ['location', 'home', 'graph', 'device'],
  },
  'home-health': {
    context: 'home',
    name: 'Health, fitness & wellbeing apps',
    examples: 'Step trackers, sleep and mood apps, patient portals',
    data: ['wellbeing', 'location', 'identity', 'device'],
  },
};

export type SnapshotAgeBand = '5-8' | '9-12' | '13-17';

export const SNAPSHOT_AGE_BANDS: { id: SnapshotAgeBand; label: string }[] = [
  { id: '5-8', label: 'Ages 5–8' },
  { id: '9-12', label: 'Ages 9–12' },
  { id: '13-17', label: 'Ages 13–17' },
];

export interface SnapshotCombo {
  needs: SnapshotDataTypeId[];
  title: string;
  text: string;
}

/** Combinations that create a risk bigger than any single data type. */
export const SNAPSHOT_COMBOS: SnapshotCombo[] = [
  {
    needs: ['learning', 'conduct', 'ids'],
    title: 'A school record outside the school',
    text: 'Grades, behavior notes and student IDs held by app vendors can outlast the school year — ask how long each vendor keeps them.',
  },
  {
    needs: ['location', 'media', 'graph'],
    title: 'Findable by strangers',
    text: 'Photos, friend lists and location together can show where your child lives, studies or plays.',
  },
  {
    needs: ['messages', 'graph', 'purchases'],
    title: 'Scam and pressure target',
    text: 'Chat with new “friends” plus in-game currency is a common route for scams, gift requests and pressure.',
  },
  {
    needs: ['faceVoice', 'media', 'identity'],
    title: 'Face-and-voice match',
    text: 'Clips of a child’s face and voice linked to their name are raw material for impersonation and fake images.',
  },
  {
    needs: ['wellbeing', 'messages'],
    title: 'Feelings on record',
    text: 'What a child confides to a chatbot or a monitored school account may be stored, reviewed or used to improve products.',
  },
  {
    needs: ['activity', 'device', 'purchases'],
    title: 'Profiled for ads and spending',
    text: 'Play and viewing habits linked to a device ID help apps time offers and ads when your child is most likely to buy.',
  },
];

/** Questions parents can ask the school — the bridge to school-side privacy work (EduSoluce). */
export const SCHOOL_QUESTIONS: string[] = [
  'Which apps and websites will my child use this year, and which hold grades, behavior notes or health information?',
  'Do you have a signed data-privacy agreement with each vendor, and can parents see the list?',
  'How long do vendors keep student data, and is it deleted when my child leaves?',
  'Does the school laptop or account monitor messages or browsing, including at home? Who reviews alerts?',
  'How can I see, correct or delete my child’s data — and who do I contact?',
];
