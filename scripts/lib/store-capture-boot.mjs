
/** Marketing headlines for iPhone App Store frames (same 7-screen flow). */
export const CAPTURE_SCREEN_CAPTIONS = {
  '01-login': {
    headline: 'Family privacy missions',
    subline: 'Ages 5–17 · Tap Let\u2019s go!',
  },
  '02-dashboard': {
    headline: 'Daily privacy missions',
    subline: 'One real situation at a time',
  },
  '03-activities': {
    headline: '18 missions · Ages 5–17',
    subline: 'Browse every family mission',
  },
  '04-mission-intro': {
    headline: 'Real situations',
    subline: 'Not abstract rules — talk together',
  },
  '05-journey': {
    headline: 'Track progress',
    subline: 'Streaks, badges & forest friends',
  },
  '06-kids': {
    headline: 'Your family roster',
    subline: 'Name and age only — on this device',
  },
  '07-settings': {
    headline: 'Your data stays here',
    subline: 'Clear all data anytime · No Premium paywall',
  },
};

/** Screen definitions shared with storeScreenshotMode.ts — keep in sync manually. */
export const CAPTURE_SCREENS = [
  {
    id: '01-login',
    path: '/',
    auth: false,
    waitMs: 12000,
    waitFor: ["Let's go!", 'Works offline'],
    contentRoot: '.hub-standalone-page',
  },
  {
    id: '02-dashboard',
    path: '/dashboard',
    auth: true,
    waitMs: 12000,
    waitFor: ["Ready for today's mission", "Tap today's mission", 'Start mission'],
    contentRoot: '#family-hub-main',
  },
  {
    id: '03-activities',
    path: '/activities',
    auth: true,
    waitMs: 12000,
    waitFor: ['Family privacy missions', 'Browse every mission', 'All missions'],
    contentRoot: '#family-hub-main',
  },
  {
    id: '04-mission-intro',
    path: '/activities?mission=pack-digital-backpack',
    auth: true,
    waitMs: 14000,
    waitFor: ['Pack Your Digital Backpack', 'Real-life scenario', 'Family prompt'],
    contentRoot: '#family-hub-main',
  },
  {
    id: '05-journey',
    path: '/journey',
    auth: true,
    waitMs: 12000,
    waitFor: ['Mission progress', 'Family rewards', 'Forest friends'],
    contentRoot: '#family-hub-main',
  },
  {
    id: '06-kids',
    path: '/kids',
    auth: true,
    waitMs: 12000,
    waitFor: ['Family members', 'Maya', 'Jordan'],
    contentRoot: '#family-hub-main',
  },
  {
    id: '07-settings',
    path: '/settings',
    auth: true,
    waitMs: 12000,
    waitFor: ['Manage your app preferences', 'View Privacy Policy', 'Clear all data on this device'],
    contentRoot: '#family-hub-main',
  },
];

const SAMPLE_FAMILY = [
  {
    id: 1,
    name: 'Maya',
    age: 9,
    role: 'child',
    privacyScore: 78,
    completedActivities: 5,
    badges: ['first_mission', 'privacy_detective'],
    lastActive: '2026-07-12T12:00:00.000Z',
  },
  {
    id: 2,
    name: 'Jordan',
    age: 14,
    role: 'teen',
    privacyScore: 71,
    completedActivities: 4,
    badges: ['first_mission'],
    lastActive: '2026-07-13T12:00:00.000Z',
  },
];

const SAMPLE_PROGRESS = {
  completedActivities: [
    'pack-digital-backpack',
    'password-treasure-hunt',
    'traffic-light-safety',
    'phishing-detective',
    'social-media-audit',
  ],
  activityDetails: {
    'pack-digital-backpack': {
      activityId: 'pack-digital-backpack',
      completed: true,
      score: 92,
      completedAt: '2026-07-08T10:00:00.000Z',
    },
    'password-treasure-hunt': {
      activityId: 'password-treasure-hunt',
      completed: true,
      score: 88,
      completedAt: '2026-07-09T10:00:00.000Z',
    },
    'traffic-light-safety': {
      activityId: 'traffic-light-safety',
      completed: true,
      score: 95,
      completedAt: '2026-07-10T10:00:00.000Z',
    },
    'phishing-detective': {
      activityId: 'phishing-detective',
      completed: true,
      score: 90,
      completedAt: '2026-07-11T10:00:00.000Z',
    },
    'social-media-audit': {
      activityId: 'social-media-audit',
      completed: true,
      score: 86,
      completedAt: '2026-07-12T10:00:00.000Z',
    },
  },
  totalTimeSpent: 52,
  achievements: ['first_activity', 'mission_streak_3'],
  lastUpdated: '2026-07-13T10:00:00.000Z',
};

const CAPTURE_BOOT_TAG = 'pg-capture-boot';

export function buildCaptureBootScript(screenId) {
  const screen = CAPTURE_SCREENS.find((entry) => entry.id === screenId);
  if (!screen) {
    throw new Error(`Unknown capture screen: ${screenId}`);
  }

  const familyJson = JSON.stringify(JSON.stringify(SAMPLE_FAMILY));
  const progressJson = JSON.stringify(JSON.stringify(SAMPLE_PROGRESS));
  const pathJson = JSON.stringify(screen.path);

  const authSeed = screen.auth
    ? `localStorage.setItem('pandagarde_local_auth_v1','true');
localStorage.setItem('pandagarde_hub_welcomed','true');
localStorage.setItem('pandagarde_family',${familyJson});
localStorage.setItem('pandagarde_progress',${progressJson});
localStorage.setItem('pandagarde_hub_streak','4');
localStorage.setItem('pandagarde_hub_last_active_date',new Date().toISOString().slice(0,10));`
    : `localStorage.setItem('pandagarde_local_auth_v1','false');
localStorage.removeItem('pandagarde_hub_welcomed');
localStorage.removeItem('pandagarde_family');
localStorage.removeItem('pandagarde_progress');`;

  return `<script id="${CAPTURE_BOOT_TAG}">window.__PG_CAPTURE_SCREEN__=${JSON.stringify(screenId)};window.__PG_STORE_CAPTURE__=true;window.__PG_CAPTURE_READY__=false;(function(){try{localStorage.setItem('pandagarde-theme','light');localStorage.setItem('pandagarde-language','en');localStorage.setItem('pandagarde_hub_origin','standalone');localStorage.setItem('pandagarde_hub_tour_done','true');localStorage.setItem('pandagarde_hub_welcome_dismissed','true');localStorage.setItem('pandagarde_hub_mission_hint_dismissed','true');${authSeed}history.replaceState(null,'',${pathJson});}catch(e){}})();</script>`;
}

export function injectCaptureBootIntoHtml(html, screenId) {
  const bootScript = buildCaptureBootScript(screenId);
  const stripped = html.replace(
    new RegExp(`<script id="${CAPTURE_BOOT_TAG}">[\\s\\S]*?<\\/script>\\s*`, 'g'),
    ''
  );
  return stripped.replace('<head>', `<head>\n    ${bootScript}`);
}
