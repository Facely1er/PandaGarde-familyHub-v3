import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  APP_REVIEW_BEAT_MS,
  APP_REVIEW_QUICK_BEAT_MS,
  APP_REVIEW_SCREEN_DWELL_MS,
  APP_REVIEW_TRANSITION_MS,
  appReviewTourAlreadyStarted,
  dispatchAppReviewAddMember,
  dispatchAppReviewStartMission,
  getAppReviewView,
  isAppReviewDemo,
  markAppReviewTourDone,
  markAppReviewTourStarted,
  pageShowsReviewError,
  setAppReviewView,
} from '../lib/appReviewDemo';
import { logger } from '../lib/logger';
import { hubPaths } from './hubPaths';
import { isStoreScreenshotBuild } from './storeScreenshotMode';

const POLL_MS = 80;
const VIEW_WAIT_MS = 15_000;
const REVIEW_MISSION_ID = 'pack-digital-backpack';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function dwell(ms = APP_REVIEW_SCREEN_DWELL_MS) {
  return delay(ms);
}

function beat() {
  return dwell(APP_REVIEW_BEAT_MS);
}

function quickBeat() {
  return dwell(APP_REVIEW_QUICK_BEAT_MS);
}

async function settleNavigation() {
  await delay(APP_REVIEW_TRANSITION_MS);
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

async function waitForReviewView(target: string | string[], timeoutMs = VIEW_WAIT_MS): Promise<boolean> {
  const targets = Array.isArray(target) ? target : [target];
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (pageShowsReviewError()) {
      return false;
    }
    if (targets.includes(getAppReviewView())) {
      return true;
    }
    await delay(POLL_MS);
  }
  return false;
}

async function waitForMainText(matcher: RegExp, timeoutMs = VIEW_WAIT_MS): Promise<boolean> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (pageShowsReviewError()) {
      return false;
    }
    const main = document.getElementById('family-hub-main');
    const login = document.querySelector('.hub-standalone-page');
    const text = `${main?.textContent ?? ''} ${login?.textContent ?? ''}`;
    if (matcher.test(text)) {
      return true;
    }
    await delay(POLL_MS);
  }
  return false;
}

function clickButtonMatching(matcher: RegExp): boolean {
  const buttons = Array.from(document.querySelectorAll('button'));
  const match = buttons.find((button) => matcher.test(button.textContent?.trim() ?? ''));
  if (!match) {
    return false;
  }
  match.click();
  return true;
}

async function waitForCelebrationDismissed(timeoutMs = 8000): Promise<boolean> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const dialog = document.querySelector('[aria-labelledby="mission-celebration-title"]');
    if (!dialog) {
      return true;
    }
    await delay(POLL_MS);
  }
  return false;
}

/** Bottom nav order: Dashboard → Journey → Missions → Family */
function clickHubNav(path: string): boolean {
  const normalized = path.replace(/\/$/, '') || '/';
  const links = Array.from(document.querySelectorAll('nav[aria-label] a[href]')) as HTMLAnchorElement[];
  const match = links.find((link) => {
    const href = (link.getAttribute('href') ?? '').replace(/\/$/, '') || '/';
    return href === normalized;
  });
  if (!match) {
    return false;
  }
  match.click();
  return true;
}

function clickSettingsNav(): boolean {
  const link = document.querySelector('a[aria-label*="Settings"]') as HTMLAnchorElement | null;
  if (!link) {
    return false;
  }
  link.click();
  return true;
}

/**
 * App Review tour — matches bottom-nav order and review description:
 * Login → Welcome → Dashboard → Journey → Missions → Mission → Family → Settings → Clear data → Login
 */
export function useAppReviewAutoTour() {
  const location = useLocation();
  const started = useRef(false);

  useEffect(() => {
    if (!isAppReviewDemo() || isStoreScreenshotBuild()) {
      return;
    }
    const path = location.pathname.replace(/\/$/, '') || '/';
    const current = getAppReviewView();
    const onMission = current.startsWith('mission-');

    if (path.endsWith('/welcome') || path === '/welcome') {
      setAppReviewView('welcome');
    } else if ((path.endsWith('/dashboard') || path === '/dashboard') && !onMission) {
      setAppReviewView('dashboard');
    } else if (path.endsWith('/journey') || path === '/journey') {
      setAppReviewView('journey');
    } else if ((path.endsWith('/activities') || path === '/activities') && !onMission) {
      setAppReviewView('activities');
    } else if (path.endsWith('/kids') || path === '/kids') {
      setAppReviewView('kids');
    } else if (path.endsWith('/settings') || path === '/settings') {
      setAppReviewView('settings');
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!isAppReviewDemo() || isStoreScreenshotBuild()) {
      return;
    }
    if (started.current || appReviewTourAlreadyStarted()) {
      return;
    }
    started.current = true;
    markAppReviewTourStarted();

    const run = async () => {
      try {
        // 1 — Login (cold start)
        setAppReviewView('login');
        if (!(await waitForReviewView('login'))) {
          throw new Error('login screen not ready');
        }
        await beat();
        clickButtonMatching(/let's go!/i);
        if (!(await waitForReviewView(['welcome', 'dashboard']))) {
          throw new Error('post-login navigation failed');
        }

        // 2 — Welcome (first-time path)
        if (getAppReviewView() === 'welcome') {
          await settleNavigation();
          await beat();
          clickButtonMatching(/add your family/i);
          if (!(await waitForReviewView('dashboard'))) {
            throw new Error('welcome → dashboard failed');
          }
        }

        // 3 — Dashboard (tab 1)
        await settleNavigation();
        if (!(await waitForMainText(/today's mission|ready for today|browse missions/i))) {
          throw new Error('dashboard content not visible');
        }
        await beat();

        // 4 — Journey (tab 2) — quick skim
        if (!clickHubNav(hubPaths.journey)) {
          throw new Error('journey nav click failed');
        }
        if (!(await waitForReviewView('journey'))) {
          throw new Error('journey view not active');
        }
        await settleNavigation();
        if (!(await waitForMainText(/mission progress|family rewards|forest friends/i))) {
          throw new Error('journey content not visible');
        }
        await quickBeat();

        // 5 — Missions (tab 3)
        if (!clickHubNav(hubPaths.activities)) {
          throw new Error('missions nav click failed');
        }
        if (!(await waitForReviewView('activities'))) {
          throw new Error('activities view not active');
        }
        await settleNavigation();
        if (!(await waitForMainText(/family privacy missions|all missions|browse every mission/i))) {
          throw new Error('activities content not visible');
        }
        await beat();

        // 6 — Mission intro auto-completes in demo (no lazy-loaded game)
        dispatchAppReviewStartMission(REVIEW_MISSION_ID);
        if (!(await waitForReviewView('mission-intro'))) {
          throw new Error('mission intro not shown');
        }
        if (!(await waitForReviewView('mission-complete', 10_000))) {
          throw new Error('mission did not complete');
        }
        await quickBeat();
        if (!clickButtonMatching(/back to activities|done for now/i)) {
          throw new Error('celebration dismiss button not found');
        }
        if (!(await waitForCelebrationDismissed())) {
          throw new Error('celebration modal did not close');
        }
        await settleNavigation();
        if (!(await waitForReviewView('activities', 6000))) {
          throw new Error('return to activities list failed');
        }

        // 7 — Family (tab 4)
        if (!clickHubNav(hubPaths.kids)) {
          throw new Error('family nav click failed');
        }
        if (!(await waitForReviewView('kids'))) {
          throw new Error('kids view not active');
        }
        await settleNavigation();
        if (!(await waitForMainText(/family members|who is learning/i))) {
          throw new Error('kids content not visible');
        }
        await beat();
        dispatchAppReviewAddMember('Alex', 9);
        await delay(500);
        if (!(await waitForMainText(/Alex/i))) {
          throw new Error('add member failed');
        }
        await quickBeat();

        // 8 — Settings (header)
        if (!clickSettingsNav()) {
          throw new Error('settings nav click failed');
        }
        if (!(await waitForReviewView('settings'))) {
          throw new Error('settings view not active');
        }
        await settleNavigation();
        if (!(await waitForMainText(/manage your app preferences|privacy/i))) {
          throw new Error('settings content not visible');
        }
        await beat();
        document.getElementById('settings-clear-data-heading')?.scrollIntoView({ block: 'center' });
        await delay(250);

        // 9 — Data deletion → fresh login
        clickButtonMatching(/clear all data on this device/i);
        setAppReviewView('settings-clear');
        await delay(250);
        clickButtonMatching(/^clear all data$/i);
        if (!(await waitForMainText(/let's go!/i, 8000))) {
          throw new Error('login screen not shown after clear data');
        }
        setAppReviewView('login-end');
        await quickBeat();
        markAppReviewTourDone();
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const onErrorPage = pageShowsReviewError();
        logger.error('App Review auto-tour failed', { message, onErrorPage, view: getAppReviewView() });
        if (onErrorPage) {
          document.documentElement.dataset.appReviewTourError = message;
        }
        document.documentElement.dataset.appReviewTourFailed = '1';
      }
    };

    void run();
  }, []);
}
