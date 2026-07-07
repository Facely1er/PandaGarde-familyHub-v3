import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import KidsApp from './KidsApp';
import '../index.css';

// PRIVACY-FIRST BOOTSTRAP — intentionally minimal:
// - No analytics, no Sentry, no EmailJS, no external network calls.
// - No service worker registration (offline caching is handled natively when
//   wrapped with Capacitor).
// - All progress data stays on-device via src/lib/storageAdapter.

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found. Make sure <div id="root"></div> exists in kids.html');
}

createRoot(rootElement).render(
  <StrictMode>
    <KidsApp />
  </StrictMode>
);
