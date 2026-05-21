import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initServiceWorker } from './lib/serviceWorker.ts';
import { logger } from './lib/logger';

// In development, unregister ALL service workers to prevent cache issues
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

if (import.meta.env.MODE === 'production') {
  initServiceWorker().catch((error) => {
    logger.warn('Failed to initialize Service Worker:', error);
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found. Make sure <div id="root"></div> exists in index.html');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
