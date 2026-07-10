/**
 * App Review demo mode — automated tour for store screen recordings.
 * Enable with ?appReviewDemo=1 or VITE_APP_REVIEW_DEMO=true (review builds).
 */

/** Dwell on each major screen during the auto-tour. */
export const APP_REVIEW_SCREEN_DWELL_MS = 4000;

/** Pause after navigation so the next screen settles. */
export const APP_REVIEW_TRANSITION_MS = 600;

/** Auto-complete in-mission games after this delay. */
export const APP_REVIEW_MISSION_PLAY_MS = 3000;

/** Playwright recording length — tour finishes around ~70s. */
export const APP_REVIEW_RECORD_MS = 90_000;

export const APP_REVIEW_START_MISSION = 'pg-app-review-start-mission' as const;

export type AppReviewView =
  | 'login'
  | 'welcome'
  | 'dashboard'
  | 'activities'
  | 'mission-intro'
  | 'mission-play'
  | 'mission-complete'
  | 'kids'
  | 'journey'
  | 'settings'
  | 'settings-clear'
  | 'login-end';

const TOUR_GUARD = '__pgAppReviewTourStarted';

export function isAppReviewDemo(): boolean {
  if (import.meta.env.VITE_APP_REVIEW_DEMO === 'true') {
    return true;
  }
  if (typeof window === 'undefined') {
    return false;
  }
  return new URLSearchParams(window.location.search).get('appReviewDemo') === '1';
}

export function appReviewTourAlreadyStarted(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return Boolean((window as unknown as Record<string, boolean>)[TOUR_GUARD]);
}

export function markAppReviewTourStarted(): void {
  if (typeof window === 'undefined') {
    return;
  }
  (window as unknown as Record<string, boolean>)[TOUR_GUARD] = true;
}

export function setAppReviewView(view: AppReviewView): void {
  if (typeof document === 'undefined') {
    return;
  }
  document.documentElement.dataset.appReviewView = view;
}

export function getAppReviewView(): string {
  if (typeof document === 'undefined') {
    return '';
  }
  return document.documentElement.dataset.appReviewView ?? '';
}

export function initAppReviewCaptureEarly(): void {
  if (!isAppReviewDemo()) {
    return;
  }
  document.documentElement.dataset.appReviewCapture = '1';
  localStorage.setItem('pandagarde-theme', 'light');
  localStorage.setItem('pandagarde-language', 'en');
  localStorage.setItem('pandagarde_hub_tour_done', 'true');
  localStorage.setItem('pandagarde_hub_welcome_dismissed', 'true');
  localStorage.setItem('pandagarde_hub_mission_hint_dismissed', 'true');
}

export function dispatchAppReviewStartMission(missionId: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  window.dispatchEvent(new CustomEvent(APP_REVIEW_START_MISSION, { detail: { missionId } }));
}
