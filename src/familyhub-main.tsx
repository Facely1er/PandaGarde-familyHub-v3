import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import FamilyHubStandaloneApp from './FamilyHubStandaloneApp';
import './i18n';
import './index.css';
import { initServiceWorker } from './lib/serviceWorker.ts';
import { initHubNativeShell } from './lib/hubNativeShell';
import { initStoreScreenshotEarly, prepareStoreScreenshotBoot } from './familyhub/storeScreenshotMode';
import { clearNativeWebCachesOnBoot, shouldEnableServiceWorker } from './lib/nativeWebCache';
import { logger } from './lib/logger';

async function bootFamilyHub() {
  clearNativeWebCachesOnBoot();
  initStoreScreenshotEarly();
  initHubNativeShell();

  const capturePath = await prepareStoreScreenshotBoot();
  if (capturePath) {
    const target = `${capturePath}${window.location.hash || ''}`;
    const current = `${window.location.pathname}${window.location.search}`;
    if (current !== capturePath) {
      window.history.replaceState(null, '', target);
    }
  }

  if (import.meta.env.MODE !== 'production') {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => registration.unregister());
      });
      caches.keys().then((cacheNames) => {
        cacheNames.forEach((cacheName) => caches.delete(cacheName));
      });
    }
  }

  if (import.meta.env.MODE === 'production' && shouldEnableServiceWorker()) {
    initServiceWorker().catch((error) => {
      logger.warn('Failed to initialize Service Worker:', error);
    });
  }

  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }

  createRoot(rootElement).render(
    <StrictMode>
      <FamilyHubStandaloneApp />
    </StrictMode>
  );
}

void bootFamilyHub();
