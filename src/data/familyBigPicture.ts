/**
 * Family big picture — content for /big-picture.
 *
 * Parents tick the everyday *kinds* of services their child uses across four
 * parts of their online life (school, games, social, home). The result is in
 * plain words — where to look first, what those apps usually know, and one thing
 * to do — never a number. Measuring exposure app by app is SocialCaution's job;
 * PandaGarde helps a family understand it and talk about it.
 *
 * Copy must follow docs/CONTENT_TRUTH.md: this describes what services of a kind
 * *usually* collect — nothing here looks at a child's device.
 */

export type PictureDataId =
  | 'identity'
  | 'learning'
  | 'conduct'
  | 'location'
  | 'home'
  | 'faceVoice'
  | 'media'
  | 'messages'
  | 'friends'
  | 'habits'
  | 'purchases'
  | 'feelings';

export interface PictureData {
  /** Plain words used in "Usually knows: …". */
  words: string;
  /** How sensitive this is for a child (3 = most). Used only to order areas — never shown. */
  weight: 1 | 2 | 3;
}

export const PICTURE_DATA: Record<PictureDataId, PictureData> = {
  identity: { words: 'name and age', weight: 1 },
  learning: { words: 'grades and progress', weight: 2 },
  conduct: { words: 'behavior notes', weight: 3 },
  location: { words: 'where they are', weight: 3 },
  home: { words: 'your home and routines', weight: 2 },
  faceVoice: { words: 'their face and voice', weight: 3 },
  media: { words: 'photos and videos', weight: 2 },
  messages: { words: 'their messages', weight: 2 },
  friends: { words: 'who their friends are', weight: 1 },
  habits: { words: 'what they watch and play', weight: 1 },
  purchases: { words: 'what they buy', weight: 2 },
  feelings: { words: 'feelings and health', weight: 3 },
};

export type PictureAreaId = 'school' | 'play' | 'social' | 'home';

export interface PictureArea {
  name: string;
  /** Who picks these apps — the heart of what a parent can do about them. */
  decidedBy: string;
  /** One concrete thing to do this week when this area is ticked. */
  step: string;
  /** A question to open the conversation with your child about this area. */
  askYourChild: string;
}

export const PICTURE_AREA_ORDER: readonly PictureAreaId[] = ['school', 'play', 'social', 'home'];

export const PICTURE_AREAS: Record<PictureAreaId, PictureArea> = {
  school: {
    name: 'School',
    decidedBy: 'Chosen by the school, not by you',
    step: 'Ask your child’s teacher which apps the class uses, and which ones keep grades or behavior notes.',
    askYourChild: 'Which apps do you use at school? Show me your favorite one.',
  },
  play: {
    name: 'Games',
    decidedBy: 'Chosen by you and your child',
    step: 'Open the family settings on each console or game: chat with friends only, and ask before buying.',
    askYourChild: 'Who do you play with online? Has someone you don’t know ever messaged you?',
  },
  social: {
    name: 'Social apps & AI chat',
    decidedBy: 'Often chosen by your child',
    step: 'Sit down together: make accounts private, turn off location, and talk about who can message them.',
    askYourChild: 'If someone sent you something that felt weird, what would you do?',
  },
  home: {
    name: 'At home',
    decidedBy: 'Chosen by you',
    step: 'Check what your smart speaker and location-sharing apps keep, and delete old recordings.',
    askYourChild: 'Did you know our speaker can remember what we say? Want to check it together?',
  },
};

export type PictureKindId =
  | 'school-classwork'
  | 'school-messaging'
  | 'school-device'
  | 'play-worlds'
  | 'play-mobile'
  | 'play-chat'
  | 'social-video'
  | 'social-messaging'
  | 'social-ai'
  | 'home-streaming'
  | 'home-smart'
  | 'home-location';

export interface PictureKind {
  area: PictureAreaId;
  name: string;
  /** Well-known examples so parents recognise the kind. Not an endorsement or a rating. */
  examples: string;
  data: PictureDataId[];
  /** Many services of this kind set a minimum age of 13 (self-declared at sign-up). */
  minAge13?: boolean;
  /** Commonly includes chat or voice with people your child may not know. */
  openChat?: boolean;
  /** Service catalog ids suggested on the "Your apps" step when this kind is ticked. */
  catalogIds: string[];
}

export const PICTURE_KINDS: Record<PictureKindId, PictureKind> = {
  'school-classwork': {
    area: 'school',
    name: 'Classwork & homework apps',
    examples: 'Google Classroom, Seesaw, IXL, Khan Academy',
    data: ['identity', 'learning', 'messages', 'media', 'habits'],
    catalogIds: ['google-classroom', 'seesaw', 'ixl', 'khan-academy', 'canvas-lms', 'schoology', 'microsoft-teams-edu', 'prodigy', 'lexia', 'dreambox', 'kahoot', 'quizlet', 'nearpod', 'zoom'],
  },
  'school-messaging': {
    area: 'school',
    name: 'Class messages & behavior points',
    examples: 'ClassDojo, Remind, ParentSquare',
    data: ['identity', 'conduct', 'media', 'messages'],
    catalogIds: ['classdojo', 'remind', 'flip', 'padlet'],
  },
  'school-device': {
    area: 'school',
    name: 'A school laptop or tablet',
    examples: 'School Chromebook or iPad, often with web filtering',
    data: ['habits', 'messages', 'conduct', 'feelings'],
    catalogIds: ['school-student-health-portal'],
  },
  'play-worlds': {
    area: 'play',
    name: 'Online games and consoles',
    examples: 'Roblox, Minecraft, Fortnite, Switch, PlayStation, Xbox',
    data: ['identity', 'messages', 'friends', 'faceVoice', 'purchases', 'habits'],
    openChat: true,
    catalogIds: ['roblox', 'minecraft', 'fortnite', 'among-us', 'steam'],
  },
  'play-mobile': {
    area: 'play',
    name: 'Free games on a phone or tablet',
    examples: 'Puzzle, racing and casual games with ads',
    data: ['location', 'habits', 'purchases'],
    catalogIds: ['among-us'],
  },
  'play-chat': {
    area: 'play',
    name: 'Game chat and streaming',
    examples: 'Discord, Twitch, voice chat while playing',
    data: ['identity', 'messages', 'friends', 'faceVoice', 'media'],
    minAge13: true,
    openChat: true,
    catalogIds: ['discord', 'twitch'],
  },
  'social-video': {
    area: 'social',
    name: 'Video and photo apps',
    examples: 'YouTube, TikTok, Instagram',
    data: ['identity', 'media', 'faceVoice', 'habits', 'location', 'friends', 'messages'],
    minAge13: true,
    openChat: true,
    catalogIds: ['youtube', 'tiktok', 'instagram', 'pinterest'],
  },
  'social-messaging': {
    area: 'social',
    name: 'Messaging apps',
    examples: 'Snapchat, WhatsApp, group chats',
    data: ['identity', 'messages', 'media', 'friends', 'location'],
    minAge13: true,
    catalogIds: ['snapchat', 'whatsapp', 'telegram'],
  },
  'social-ai': {
    area: 'social',
    name: 'AI chatbots',
    examples: 'ChatGPT, Gemini, Snapchat My AI',
    data: ['messages', 'feelings', 'habits'],
    minAge13: true,
    catalogIds: ['chatgpt', 'google-gemini', 'snapchat-my-ai', 'character-ai', 'meta-ai', 'microsoft-copilot', 'socratic', 'khanmigo'],
  },
  'home-streaming': {
    area: 'home',
    name: 'TV and video streaming',
    examples: 'YouTube Kids, Netflix, Disney+',
    data: ['identity', 'habits'],
    catalogIds: ['youtube-kids', 'netflix', 'disney-plus', 'pbs-kids', 'amazon-prime-video', 'spotify', 'hulu', 'max'],
  },
  'home-smart': {
    area: 'home',
    name: 'Smart speakers and connected toys',
    examples: 'Alexa, Google Home, toys that talk or listen',
    data: ['faceVoice', 'home', 'media', 'habits'],
    catalogIds: [],
  },
  'home-location': {
    area: 'home',
    name: 'A kid phone, watch or location sharing',
    examples: 'Family Link, Find My, Life360, kids’ smartwatches',
    data: ['location', 'home', 'friends'],
    catalogIds: ['verizon', 'att', 'tmobile', 'cricket-wireless', 'mint-mobile', 'boost-mobile'],
  },
};

export type PictureAgeBand = '5-8' | '9-12' | '13-17';

export const PICTURE_AGE_BANDS: { id: PictureAgeBand; label: string }[] = [
  { id: '5-8', label: '5–8' },
  { id: '9-12', label: '9–12' },
  { id: '13-17', label: '13–17' },
];

/** Questions parents can ask the school — the bridge to school-side privacy work (EduSoluce). */
export const SCHOOL_QUESTIONS: string[] = [
  'Which apps will my child use this year?',
  'Which of them keep grades, behavior notes or health information — and for how long?',
  'Does the school laptop or account watch messages or browsing at home too?',
  'Who do I contact to see or delete my child’s information?',
];
