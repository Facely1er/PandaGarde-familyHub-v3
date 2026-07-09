import { Capacitor } from '@capacitor/core';
import { logger } from './logger';

const NATIVE_SW_RELOAD_KEY = 'pandagarde_hub_native_sw_reload_v1';

export function isNativeShell(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  const protocol = window.location.protocol;
  if (protocol === 'capacitor:' || protocol === 'ionic:') {
    return true;
  }
  return Capacitor.isNativePlatform();
}

/**
 * Service workers break Capacitor iOS/Android (stale cached index.html → splash never clears).
 * Unregister and wipe caches on every native cold start.
 */
export async function clearNativeWebCaches(): Promise<void> {
  if (!isNativeShell()) {
    return;
  }

  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));
  }

  if ('caches' in window) {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key)));
  }

  logger.debug('Native web caches cleared', undefined, 'NativeShell');
}

/**
 * If a legacy SW still controls this page, reload once after purge (head script may have already done this).
 */
export async function recoverFromLegacyServiceWorker(): Promise<void> {
  if (!isNativeShell() || !('serviceWorker' in navigator)) {
    return;
  }

  if (!navigator.serviceWorker.controller) {
    sessionStorage.removeItem(NATIVE_SW_RELOAD_KEY);
    return;
  }

  if (sessionStorage.getItem(NATIVE_SW_RELOAD_KEY) === '1') {
    return;
  }

  sessionStorage.setItem(NATIVE_SW_RELOAD_KEY, '1');
  await clearNativeWebCaches();
  window.location.reload();
}

/** Fire-and-forget on boot — must not block React render. */
export function clearNativeWebCachesOnBoot(): void {
  void recoverFromLegacyServiceWorker()
    .then(() => clearNativeWebCaches())
    .catch((error) => {
      logger.warn('Failed to clear native web caches:', error);
    });
}

export function shouldEnableServiceWorker(): boolean {
  return (
    import.meta.env.MODE === 'production' &&
    import.meta.env.VITE_SW_ENABLED !== 'false' &&
    !Capacitor.isNativePlatform()
  );
}
