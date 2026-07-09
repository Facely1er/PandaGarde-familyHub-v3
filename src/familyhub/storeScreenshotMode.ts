/**
 * Dev-only store screenshot automation (VITE_STORE_SCREENSHOTS=true).
 * Deep links: familyhub://capture/{screenId}
 */
import { App, type URLOpenListenerEvent } from '@capacitor/app';
import type { NavigateFunction } from 'react-router-dom';

export const STORE_SCREENSHOT_SCHEME = 'familyhub';

export const STORE_SCREENSHOTS = [
  { id: '01-login', path: '/', auth: false },
  { id: '02-dashboard', path: '/dashboard', auth: true },
  { id: '03-activities', path: '/activities', auth: true },
  { id: '04-mission-intro', path: '/activities?mission=pack-digital-backpack', auth: true },
  { id: '05-journey', path: '/journey', auth: true },
  { id: '06-kids', path: '/kids', auth: true },
  { id: '07-settings', path: '/settings', auth: true },
] as const;

export type StoreScreenshotId = (typeof STORE_SCREENSHOTS)[number]['id'];

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

export function isStoreScreenshotBuild(): boolean {
  return import.meta.env.VITE_STORE_SCREENSHOTS === 'true';
}

export function parseStoreScreenshotId(url: string): StoreScreenshotId | null {
  const match = url.match(/familyhub:\/\/capture\/([^/?#]+)/i);
  const id = match?.[1];
  return STORE_SCREENSHOTS.some((screen) => screen.id === id) ? (id as StoreScreenshotId) : null;
}

export function applyStoreScreenshotSeed(auth: boolean): void {
  localStorage.setItem('pandagarde-theme', 'light');
  localStorage.setItem('pandagarde-language', 'en');
  localStorage.setItem('pandagarde_hub_origin', 'standalone');
  localStorage.setItem('pandagarde_hub_tour_done', 'true');
  localStorage.setItem('pandagarde_hub_welcome_dismissed', 'true');
  localStorage.setItem('pandagarde_hub_mission_hint_dismissed', 'true');

  if (auth) {
    localStorage.setItem('pandagarde_local_auth_v1', 'true');
    localStorage.setItem('pandagarde_hub_welcomed', 'true');
    localStorage.setItem('pandagarde_family', JSON.stringify(SAMPLE_FAMILY));
    localStorage.setItem('pandagarde_progress', JSON.stringify(SAMPLE_PROGRESS));
  } else {
    localStorage.setItem('pandagarde_local_auth_v1', 'false');
    localStorage.removeItem('pandagarde_hub_welcomed');
    localStorage.removeItem('pandagarde_family');
    localStorage.removeItem('pandagarde_progress');
  }
}

function navigateToScreen(navigate: NavigateFunction, screenId: StoreScreenshotId): void {
  const screen = STORE_SCREENSHOTS.find((entry) => entry.id === screenId);
  if (!screen) {
    return;
  }
  applyStoreScreenshotSeed(screen.auth);
  navigate(screen.path);
}

async function handleStoreScreenshotUrl(url: string, navigate: NavigateFunction): Promise<void> {
  const screenId = parseStoreScreenshotId(url);
  if (!screenId) {
    return;
  }
  navigateToScreen(navigate, screenId);
}

export function initStoreScreenshotMode(navigate: NavigateFunction): () => void {
  if (!isStoreScreenshotBuild()) {
    return () => undefined;
  }

  let listenerHandle: { remove: () => Promise<void> } | undefined;

  void (async () => {
    listenerHandle = await App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      void handleStoreScreenshotUrl(event.url, navigate);
    });

    const launch = await App.getLaunchUrl();
    if (launch?.url) {
      await handleStoreScreenshotUrl(launch.url, navigate);
    }
  })();

  return () => {
    void listenerHandle?.remove();
  };
}
