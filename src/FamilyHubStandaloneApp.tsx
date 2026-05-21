import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { FamilyProvider } from './contexts/FamilyContext';
import { ProgressProvider } from './contexts/ProgressContext';
import { FamilyProgressProvider } from './contexts/FamilyProgressContext';
import FamilyHubWrapper from './pages/family-hub/FamilyHubWrapper';
import NavigationErrorBoundary from './components/NavigationErrorBoundary';
import ErrorFallback from './components/ui/ErrorFallback';
import PageLoader from './components/ui/PageLoader';
import { SentryErrorBoundary } from './lib/sentry';
import { usePageTracking } from './hooks/useAnalytics';
import { setHubOrigin } from './lib/hubMission';

const PageTracker: React.FC = () => {
  usePageTracking();
  return null;
};

/**
 * Hub-only SPA entry for Capacitor (iOS/Android) and optional hub.pandagarde.com deploy.
 * Routes mirror `/family-hub/*` on the main site but live at `/` in this bundle.
 */
function FamilyHubStandaloneApp() {
  useEffect(() => {
    if (localStorage.getItem('pandagarde_hub_origin') === null) {
      setHubOrigin('standalone');
    }
  }, []);

  return (
    <ThemeProvider>
      <ToastProvider>
        <FamilyProvider>
          <ProgressProvider>
            <FamilyProgressProvider>
              <Router>
                <SentryErrorBoundary fallback={<ErrorFallback />}>
                  <NavigationErrorBoundary>
                    <div className="App min-h-screen">
                      <PageTracker />
                      <Suspense fallback={<PageLoader />}>
                        <Routes>
                          <Route path="/*" element={<FamilyHubWrapper />} />
                        </Routes>
                      </Suspense>
                    </div>
                  </NavigationErrorBoundary>
                </SentryErrorBoundary>
              </Router>
            </FamilyProgressProvider>
          </ProgressProvider>
        </FamilyProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default FamilyHubStandaloneApp;
