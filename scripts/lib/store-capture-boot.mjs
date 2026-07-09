/** Screen definitions shared with storeScreenshotMode.ts — keep in sync manually. */
export const CAPTURE_SCREENS = [
  {
    id: '01-login',
    path: '/',
    auth: false,
    waitMs: 9000,
    waitFor: ["Let's go!", 'Works offline'],
    contentRoot: '.hub-standalone-page',
  },
  {
    id: '02-dashboard',
    path: '/dashboard',
    auth: true,
    waitMs: 10000,
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
    waitMs: 10000,
    waitFor: ['Pack Your Digital Backpack', 'Real-life scenario', 'Family prompt'],
    contentRoot: '#family-hub-main',
  },
  {
    id: '05-journey',
    path: '/journey',
    auth: true,
    waitMs: 10000,
    waitFor: ['Mission progress', 'Family rewards', 'Forest friends'],
    contentRoot: '#family-hub-main',
  },
  {
    id: '06-kids',
    path: '/kids',
    auth: true,
    waitMs: 10000,
    waitFor: ['Family members', 'Maya', 'Jordan'],
    contentRoot: '#family-hub-main',
  },
  {
    id: '07-settings',
    path: '/settings',
    auth: true,
    waitMs: 10000,
    waitFor: ['Manage your app preferences', 'View Privacy Policy', 'Light mode'],
    contentRoot: '#family-hub-main',
  },
];

const SAMPLE_FAMILY = [
  {
    id: 1,
    name: 'Maya',
    age: 9,
    role: 'child',
    privacyScore: 72,
    completedActivities: 3,
    badges: ['first_mission'],
    lastActive: '2026-07-01T12:00:00.000Z',
  },
  {
    id: 2,
    name: 'Jordan',
    age: 14,
    role: 'teen',
    privacyScore: 68,
    completedActivities: 2,
    badges: [],
    lastActive: '2026-07-02T12:00:00.000Z',
  },
];

const SAMPLE_PROGRESS = {
  completedActivities: ['pack-digital-backpack', 'password-treasure-hunt', 'traffic-light-safety'],
  activityDetails: {
    'pack-digital-backpack': {
      activityId: 'pack-digital-backpack',
      completed: true,
      score: 92,
      completedAt: '2026-07-01T10:00:00.000Z',
    },
    'password-treasure-hunt': {
      activityId: 'password-treasure-hunt',
      completed: true,
      score: 88,
      completedAt: '2026-07-02T10:00:00.000Z',
    },
    'traffic-light-safety': {
      activityId: 'traffic-light-safety',
      completed: true,
      score: 95,
      completedAt: '2026-07-03T10:00:00.000Z',
    },
  },
  totalTimeSpent: 36,
  achievements: ['first_activity'],
  lastUpdated: '2026-07-08T10:00:00.000Z',
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
localStorage.setItem('pandagarde_progress',${progressJson});`
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
