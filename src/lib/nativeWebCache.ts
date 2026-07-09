import { Capacitor } from '@capacitor/core';
import { logger } from './logger';

/**
 * Service workers break Capacitor iOS/Android (stale cached index.html → splash never clears).
 * Unregister and wipe caches on every native cold start.
 */
export async function clearNativeWebCaches(): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
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

/** Fire-and-forget on boot — must not block React render. */
export function clearNativeWebCachesOnBoot(): void {
  void clearNativeWebCaches().catch((error) => {
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
