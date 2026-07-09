/** True on iPad hardware, iPad Simulator, and iPadOS desktop-UA WebViews. */
export function isIpadDevice(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const ua = navigator.userAgent;
  if (/iPad/.test(ua)) {
    return true;
  }

  // iPadOS 13+ reports MacIntel in WKWebView when desktop content mode is active.
  if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) {
    return true;
  }

  const minSide = Math.min(window.screen.width, window.screen.height);
  const maxSide = Math.max(window.screen.width, window.screen.height);
  return minSide >= 744 && maxSide >= 1024;
}
