import { Capacitor } from '@capacitor/core';

/** True when marketing website escape links should be hidden (native app + store captures). */
export function shouldHideHubWebsiteChrome(): boolean {
  if (Capacitor.isNativePlatform()) {
    return true;
  }
  if (import.meta.env.VITE_STORE_SCREENSHOTS === 'true') {
    return true;
  }
  return false;
}
