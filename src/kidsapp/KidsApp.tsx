import React, { Suspense } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { FamilyProgressProvider } from '../contexts/FamilyProgressContext';
import { KidsProgressProvider, useKidsProgress } from './KidsProgressContext';
import KidsShell from './components/KidsShell';
import WorldMapScreen from './screens/WorldMapScreen';
import EpisodeScreen from './screens/EpisodeScreen';
import BadgeShelfScreen from './screens/BadgeShelfScreen';
import ProfileSetupScreen from './screens/ProfileSetupScreen';
import GrownUpsScreen from './screens/GrownUpsScreen';

const ScreenFallback: React.FC = () => (
  <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-live="polite">
    <span className="animate-bounce text-5xl" aria-hidden>
      🐼
    </span>
    <span className="sr-only">Loading…</span>
  </div>
);

const RequireProfile: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile } = useKidsProgress();
  if (!profile) {
    return <Navigate to="/welcome" replace />;
  }
  return <>{children}</>;
};

const KidsRoutes: React.FC = () => (
  <Routes>
    <Route path="/welcome" element={<ProfileSetupScreen />} />
    <Route
      path="/"
      element={
        <RequireProfile>
          <KidsShell>
            <WorldMapScreen />
          </KidsShell>
        </RequireProfile>
      }
    />
    <Route
      path="/episode/:slug"
      element={
        <RequireProfile>
          <EpisodeScreen />
        </RequireProfile>
      }
    />
    <Route
      path="/badges"
      element={
        <RequireProfile>
          <KidsShell>
            <BadgeShelfScreen />
          </KidsShell>
        </RequireProfile>
      }
    />
    <Route
      path="/grown-ups"
      element={
        <RequireProfile>
          <KidsShell>
            <GrownUpsScreen />
          </KidsShell>
        </RequireProfile>
      }
    />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

/**
 * Kids app root. HashRouter keeps routing self-contained for static hosting
 * and Capacitor (no server rewrites needed). FamilyProgressProvider is
 * required by the shared game components; it persists locally only.
 */
const KidsApp: React.FC = () => (
  <FamilyProgressProvider>
    <KidsProgressProvider>
      <HashRouter>
        <div className="min-h-screen bg-emerald-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
          <Suspense fallback={<ScreenFallback />}>
            <KidsRoutes />
          </Suspense>
        </div>
      </HashRouter>
    </KidsProgressProvider>
  </FamilyProgressProvider>
);

export default KidsApp;
