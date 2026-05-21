import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import FamilyHubStandaloneApp from './FamilyHubStandaloneApp';
import './index.css';

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

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <FamilyHubStandaloneApp />
  </StrictMode>
);
