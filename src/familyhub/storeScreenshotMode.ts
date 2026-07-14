/**
 * Dev-only store screenshot automation (VITE_STORE_SCREENSHOTS=true).
 * Capture scripts set VITE_CAPTURE_SCREEN per build so each cold launch lands on the right route.
 */
import { useEffect } from 'react';
import type { NavigateFunction } from 'react-router-dom';
import { isIpadDevice } from '../lib/isIpadDevice';

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

declare global {
  interface Window {
    __PG_STORE_CAPTURE__?: boolean;
    __PG_CAPTURE_READY__?: boolean;
  }
}

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

export function isStoreScreenshotBuild(): boolean {
  return import.meta.env.VITE_STORE_SCREENSHOTS === 'true';
}

/** Call when a capture target screen has mounted and rendered. */
export function useStoreCaptureReady(): void {
  useEffect(() => {
    if (!isStoreScreenshotBuild()) {
      return;
    }
    window.__PG_CAPTURE_READY__ = true;
  }, []);
}

export function suppressHubOnboardingForCapture(): void {
  localStorage.setItem('pandagarde_hub_tour_done', 'true');
  localStorage.setItem('pandagarde_hub_welcome_dismissed', 'true');
  localStorage.setItem('pandagarde_hub_mission_hint_dismissed', 'true');
}

export function initStoreScreenshotEarly(): void {
  if (!isStoreScreenshotBuild()) {
    return;
  }
  window.__PG_STORE_CAPTURE__ = true;
  window.__PG_CAPTURE_READY__ = false;
  document.documentElement.classList.add('store-capture', 'capacitor', 'platform-ios');
  if (isIpadDevice()) {
    document.documentElement.classList.add('platform-ipad');
  }
  suppressHubOnboardingForCapture();
}

function isStoreScreenshotId(value: string): value is StoreScreenshotId {
  return STORE_SCREENSHOTS.some((screen) => screen.id === value);
}

export function applyStoreScreenshotSeed(auth: boolean): void {
  localStorage.setItem('pandagarde-theme', 'light');
  localStorage.setItem('pandagarde-language', 'en');
  localStorage.setItem('pandagarde_hub_origin', 'standalone');
  suppressHubOnboardingForCapture();

  if (auth) {
    localStorage.setItem('pandagarde_local_auth_v1', 'true');
    localStorage.setItem('pandagarde_hub_welcomed', 'true');
    localStorage.setItem('pandagarde_family', JSON.stringify(SAMPLE_FAMILY));
    localStorage.setItem('pandagarde_progress', JSON.stringify(SAMPLE_PROGRESS));
    localStorage.setItem('pandagarde_hub_streak', '4');
    localStorage.setItem('pandagarde_hub_last_active_date', new Date().toISOString().slice(0, 10));
  } else {
    localStorage.setItem('pandagarde_local_auth_v1', 'false');
    localStorage.removeItem('pandagarde_hub_welcomed');
    localStorage.removeItem('pandagarde_family');
    localStorage.removeItem('pandagarde_progress');
  }
}

/** Screen id baked in at build time via VITE_CAPTURE_SCREEN. */
export function prepareStoreScreenshotBootSync(): string | null {
  if (!isStoreScreenshotBuild()) {
    return null;
  }
  const screenId = import.meta.env.VITE_CAPTURE_SCREEN;
  if (!screenId || !isStoreScreenshotId(screenId)) {
    return null;
  }
  const screen = STORE_SCREENSHOTS.find((entry) => entry.id === screenId);
  if (!screen) {
    return null;
  }
  applyStoreScreenshotSeed(screen.auth);
  return screen.path;
}

export function initStoreScreenshotMode(_navigate: NavigateFunction): () => void {
  return () => undefined;
}
