import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from '../../familyhub/components/AppShell';
import { HUB_WELCOMED_KEY } from '../../familyhub/constants';
import { lazyScreen } from '../../familyhub/lazyScreen';
import AuthWrapper, { useAuth } from './AuthWrapper';
import LoginPage from './LoginPage';

const WelcomeScreen = lazyScreen(() => import('../../familyhub/screens/WelcomeScreen'));
const DashboardScreen = lazyScreen(() => import('../../familyhub/screens/DashboardScreen'));
const KidsScreen = lazyScreen(() => import('../../familyhub/screens/KidsScreen'));
const ActivitiesScreen = lazyScreen(() => import('../../familyhub/screens/ActivitiesScreen'));
const ProgressScreen = lazyScreen(() => import('../../familyhub/screens/ProgressScreen'));
const SettingsScreen = lazyScreen(() => import('../../familyhub/screens/SettingsScreen'));

const FamilyHubRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const hubWelcomed = localStorage.getItem(HUB_WELCOMED_KEY) === 'true';

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="*" element={<LoginPage />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="welcome" element={<WelcomeScreen />} />
      <Route
        path="/"
        element={<Navigate to={hubWelcomed ? 'dashboard' : 'welcome'} replace />}
      />
      <Route element={<AppShell />}>
        <Route path="dashboard" element={<DashboardScreen />} />
        <Route path="kids" element={<KidsScreen />} />
        <Route path="activities" element={<ActivitiesScreen />} />
        <Route path="progress" element={<ProgressScreen />} />
        <Route path="settings" element={<SettingsScreen />} />
      </Route>
    </Routes>
  );
};

const FamilyHubWrapper: React.FC = () => {
  return (
    <AuthWrapper>
      <FamilyHubRoutes />
    </AuthWrapper>
  );
};

export default FamilyHubWrapper;
