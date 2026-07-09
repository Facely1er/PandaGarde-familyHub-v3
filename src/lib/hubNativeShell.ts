import { Capacitor } from '@capacitor/core';

/** Typical home-indicator inset when WKWebView reports env(safe-area-inset-bottom) as 0 */
const IOS_HOME_INDICATOR_FALLBACK_PX = 34;
/** Notch iPhones — status bar + notch */
const IOS_NOTCH_TOP_FALLBACK_PX = 47;
/** Dynamic Island class devices */
const IOS_DYNAMIC_ISLAND_TOP_FALLBACK_PX = 59;

function measureSafeAreaInsets(): {
  top: number;
  bottom: number;
  left: number;
  right: number;
} {
  const probe = document.createElement('div');
  probe.style.cssText = [
    'position:fixed',
    'top:0',
    'left:0',
    'visibility:hidden',
    'pointer-events:none',
    'padding-top:constant(safe-area-inset-top)',
    'padding-right:constant(safe-area-inset-right)',
    'padding-bottom:constant(safe-area-inset-bottom)',
    'padding-left:constant(safe-area-inset-left)',
    'padding-top:env(safe-area-inset-top)',
    'padding-right:env(safe-area-inset-right)',
    'padding-bottom:env(safe-area-inset-bottom)',
    'padding-left:env(safe-area-inset-left)',
  ].join(';');
  document.documentElement.appendChild(probe);
  const style = getComputedStyle(probe);
  const result = {
    top: parseFloat(style.paddingTop) || 0,
    right: parseFloat(style.paddingRight) || 0,
    bottom: parseFloat(style.paddingBottom) || 0,
    left: parseFloat(style.paddingLeft) || 0,
  };
  probe.remove();
  return result;
}

function iosLikelyHasHomeIndicator(): boolean {
  const h = window.screen.height;
  const w = window.screen.width;
  const longSide = Math.max(h, w);
  const shortSide = Math.min(h, w);
  return longSide >= 812 && shortSide >= 375;
}

function iosTopFallback(): number {
  const visualTop = window.visualViewport?.offsetTop ?? 0;
  if (visualTop > 0) {
    return visualTop;
  }

  const longSide = Math.max(window.screen.height, window.screen.width);
  if (longSide >= 932) {
    return IOS_DYNAMIC_ISLAND_TOP_FALLBACK_PX;
  }
  if (longSide >= 812) {
    return IOS_NOTCH_TOP_FALLBACK_PX;
  }
  return 20;
}

function applySafeAreaCssVars(): void {
  const root = document.documentElement;
  const platform = Capacitor.getPlatform();
  const measured = measureSafeAreaInsets();

  let safeTop = measured.top;
  let safeBottom = measured.bottom;

  if (Capacitor.isNativePlatform() && platform === 'ios') {
    // contentInset:never + viewport-fit=cover — web content extends under status bar.
    if (safeTop < 1) {
      safeTop = iosTopFallback();
    }
    if (safeBottom < 1 && iosLikelyHasHomeIndicator()) {
      safeBottom = IOS_HOME_INDICATOR_FALLBACK_PX;
    }
  }

  root.style.setProperty('--hub-safe-top', `${safeTop}px`);
  root.style.setProperty('--hub-nav-safe-bottom', `${safeBottom}px`);
  root.style.setProperty('--hub-safe-left', `${measured.left}px`);
  root.style.setProperty('--hub-safe-right', `${measured.right}px`);
}

function applyCapacitorPlatformClasses(): void {
  if (!Capacitor.isNativePlatform()) {
    return;
  }
  const root = document.documentElement;
  root.classList.add('capacitor', `platform-${Capacitor.getPlatform()}`);
}

/**
 * Native shell bootstrap for Family Hub Capacitor builds.
 * Applies platform classes and measured safe-area CSS variables before first paint.
 */
export function initHubNativeShell(): void {
  applyCapacitorPlatformClasses();
  applySafeAreaCssVars();

  const onViewportChange = (): void => {
    applySafeAreaCssVars();
  };

  window.addEventListener('resize', onViewportChange);
  window.addEventListener('orientationchange', () => {
    window.setTimeout(onViewportChange, 150);
  });

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', onViewportChange);
    window.visualViewport.addEventListener('scroll', onViewportChange);
  }
}
