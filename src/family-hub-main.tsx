import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import FamilyHubApp from './FamilyHubApp.tsx';
import './index.css';
import { initSentry, reportError } from './lib/sentry.ts';
import { initAnalytics, trackError } from './lib/analytics.ts';
import { initServiceWorker } from './lib/serviceWorker.ts';

// Initialize monitoring, analytics, and service worker before rendering the app
// Wrap in try-catch to prevent initialization errors from blocking the app
let sentryInitialized = false;
let analyticsInitialized = false;

try {
  initSentry();
  sentryInitialized = true;
} catch (error) {
  console.warn('Failed to initialize Sentry:', error);
}

try {
  initAnalytics();
  analyticsInitialized = true;
} catch (error) {
  console.warn('Failed to initialize Analytics:', error);
}

// Initialize service worker asynchronously (don't block app rendering)
initServiceWorker().catch((error) => {
  console.warn('Failed to initialize Service Worker:', error);
});

// Global error handlers - capture unhandled errors
// Set up AFTER initialization to ensure functions are available
window.onerror = (message, source, lineno, colno, error) => {
  const errorObj = error || new Error(String(message));
  
  // Only report if initialized
  if (sentryInitialized) {
    try {
      reportError(errorObj, {
        type: 'global_error',
        source,
        lineno,
        colno,
      });
    } catch (err) {
      console.warn('Error reporting failed:', err);
    }
  }
  
  if (analyticsInitialized) {
    try {
      trackError(errorObj, {
        type: 'global_error',
        source,
        lineno,
        colno,
      });
    } catch (err) {
      console.warn('Error tracking failed:', err);
    }
  }
  
  return false;
};

// Global unhandled promise rejection handler
window.onunhandledrejection = (event) => {
  const error = event.reason instanceof Error
    ? event.reason
    : new Error(String(event.reason));
  
  // Only report if initialized
  if (sentryInitialized) {
    try {
      reportError(error, {
        type: 'unhandled_rejection',
      });
    } catch (err) {
      console.warn('Error reporting failed:', err);
    }
  }
  
  if (analyticsInitialized) {
    try {
      trackError(error, {
        type: 'unhandled_rejection',
      });
    } catch (err) {
      console.warn('Error tracking failed:', err);
    }
  }
};

// Ensure root element exists before rendering
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found. Make sure <div id="root"></div> exists in index.html');
}

createRoot(rootElement).render(
  <StrictMode>
    <FamilyHubApp />
  </StrictMode>
);

