import { Capacitor } from '@capacitor/core';

/**
 * Open a URL in the system browser on native (Capacitor) or a new tab on web.
 */
export async function openExternalUrl(url: string): Promise<void> {
  const trimmed = url.trim();
  if (!trimmed) {
    return;
  }

  if (Capacitor.isNativePlatform()) {
    const { Browser } = await import('@capacitor/browser');
    await Browser.open({ url: trimmed });
    return;
  }

  window.open(trimmed, '_blank', 'noopener,noreferrer');
}
