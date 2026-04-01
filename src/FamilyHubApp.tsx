import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { FamilyProvider } from './contexts/FamilyContext';
import { ProgressProvider } from './contexts/ProgressContext';
import { FamilyProgressProvider } from './contexts/FamilyProgressContext';
import LoginPage from './pages/family-hub/LoginPage';
import NavigationErrorBoundary from './components/NavigationErrorBoundary';
import { SentryErrorBoundary } from './lib/sentry';
import { usePageTracking } from './hooks/useAnalytics';
import AppShell from './familyhub/components/AppShell';
import DashboardScreen from './familyhub/screens/DashboardScreen';
import KidsScreen from './familyhub/screens/KidsScreen';
import ActivitiesScreen from './familyhub/screens/ActivitiesScreen';
import ProgressScreen from './familyhub/screens/ProgressScreen';
import SettingsScreen from './familyhub/screens/SettingsScreen';

// Component to handle hash navigation (only for website routes, not app routes)
const HashHandler: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Skip hash handling for app routes
    if (location.pathname.startsWith('/app/')) {
      return;
    }

    if (location.hash) {
      const scrollToElement = () => {
        const element = document.querySelector(location.hash);
        if (element) {
          requestAnimationFrame(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          });
        } else {
          setTimeout(scrollToElement, 100);
        }
      };
      setTimeout(scrollToElement, 100);
    }
  }, [location]);

  return null;
};

// Component to handle page tracking inside Router context
const PageTracker: React.FC = () => {
  usePageTracking();
  return null;
};

function FamilyHubApp() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <FamilyProvider>
          <ProgressProvider>
            <FamilyProgressProvider>
              <Router>
                <SentryErrorBoundary fallback={<div>Something went wrong. Please refresh the page.</div>}>
                  <NavigationErrorBoundary>
                    <div className="App">
                      <PageTracker />
                      <HashHandler />
                      <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
                        <Route path="/family-hub.html" element={<Navigate to="/app/dashboard" replace />} />
                        <Route path="/app" element={<AppShell />}>
                          <Route index element={<Navigate to="/app/dashboard" replace />} />
                          <Route path="dashboard" element={<DashboardScreen />} />
                          <Route path="kids" element={<KidsScreen />} />
                          <Route path="activities" element={<ActivitiesScreen />} />
                          <Route path="progress" element={<ProgressScreen />} />
                          <Route path="settings" element={<SettingsScreen />} />
                        </Route>
                      </Routes>
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

export default FamilyHubApp;

