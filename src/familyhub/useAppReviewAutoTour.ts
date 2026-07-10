import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../pages/family-hub/AuthWrapper';
import {
  APP_REVIEW_MISSION_PLAY_MS,
  APP_REVIEW_SCREEN_DWELL_MS,
  APP_REVIEW_START_MISSION,
  APP_REVIEW_TRANSITION_MS,
  appReviewTourAlreadyStarted,
  dispatchAppReviewStartMission,
  getAppReviewView,
  isAppReviewDemo,
  markAppReviewTourStarted,
  setAppReviewView,
} from '../lib/appReviewDemo';
import { clearAllHubLocalData } from './hubLocalData';
import { hubPaths } from './hubPaths';
import { HUB_WELCOMED_KEY } from './constants';
import { isStoreScreenshotBuild } from './storeScreenshotMode';

const POLL_MS = 80;
const VIEW_WAIT_MS = 12_000;
const REVIEW_MISSION_ID = 'pack-digital-backpack';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function dwell(ms = APP_REVIEW_SCREEN_DWELL_MS) {
  return delay(ms);
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
    const view = getAppReviewView();
    if (targets.includes(view)) {
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

function fillInput(id: string, value: string) {
  const input = document.getElementById(id) as HTMLInputElement | null;
  if (!input) {
    return false;
  }
  const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
  nativeSetter?.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
  return true;
}

/**
 * App Review tour (~70s): Login → Welcome → Dashboard → Mission → Family → Journey →
 * Settings → Clear data → Login again.
 */
export function useAppReviewAutoTour() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInLocally, signOutLocally } = useAuth();
  const started = useRef(false);

  useEffect(() => {
    if (!isAppReviewDemo() || isStoreScreenshotBuild()) {
      return;
    }
    const path = location.pathname.replace(/\/$/, '') || '/';
    if (path.endsWith('/welcome') || path === '/welcome') {
      setAppReviewView('welcome');
    } else if (path.endsWith('/dashboard') || path === '/dashboard') {
      setAppReviewView('dashboard');
    } else if (path.endsWith('/activities') || path === '/activities') {
      if (!getAppReviewView().startsWith('mission-')) {
        setAppReviewView('activities');
      }
    } else if (path.endsWith('/kids') || path === '/kids') {
      setAppReviewView('kids');
    } else if (path.endsWith('/journey') || path === '/journey') {
      setAppReviewView('journey');
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
      setAppReviewView('login');
      if (!(await waitForReviewView('login'))) {
        return;
      }
      await dwell();

      signInLocally();
      localStorage.setItem(HUB_WELCOMED_KEY, 'false');
      navigate(hubPaths.welcome, { replace: true });
      if (!(await waitForReviewView('welcome'))) {
        navigate(hubPaths.dashboard, { replace: true });
      } else {
        await settleNavigation();
        await dwell();
        localStorage.setItem(HUB_WELCOMED_KEY, 'true');
        navigate(hubPaths.dashboard, { replace: true });
      }

      if (!(await waitForReviewView('dashboard'))) {
        return;
      }
      await settleNavigation();
      await dwell();

      navigate(hubPaths.activities);
      if (!(await waitForReviewView('activities'))) {
        return;
      }
      await settleNavigation();
      await dwell();

      dispatchAppReviewStartMission(REVIEW_MISSION_ID);
      if (!(await waitForReviewView('mission-intro'))) {
        return;
      }
      await dwell();
      clickButtonMatching(/start interactive activity/i);
      if (!(await waitForReviewView('mission-play', APP_REVIEW_MISSION_PLAY_MS + VIEW_WAIT_MS))) {
        return;
      }
      await delay(APP_REVIEW_MISSION_PLAY_MS + 800);
      if (!(await waitForReviewView('mission-complete'))) {
        return;
      }
      await dwell();
      clickButtonMatching(/done for now/i);
      await settleNavigation();

      navigate(hubPaths.kids);
      if (!(await waitForReviewView('kids'))) {
        return;
      }
      await dwell();
      clickButtonMatching(/add (your first )?member/i);
      await delay(500);
      fillInput('member-name', 'Alex');
      fillInput('member-age', '9');
      await delay(400);
      clickButtonMatching(/^add member$/i);
      await delay(1200);

      navigate(hubPaths.journey);
      if (!(await waitForReviewView('journey'))) {
        return;
      }
      await settleNavigation();
      await dwell();

      navigate(hubPaths.settings);
      if (!(await waitForReviewView('settings'))) {
        return;
      }
      await settleNavigation();
      await dwell();
      clickButtonMatching(/clear all data on this device/i);
      setAppReviewView('settings-clear');
      await delay(600);
      clickButtonMatching(/^clear all data$/i);
      clearAllHubLocalData();
      signOutLocally();
      setAppReviewView('login-end');
      await dwell();
    };

    void run();
  }, [navigate, signInLocally, signOutLocally]);
}
