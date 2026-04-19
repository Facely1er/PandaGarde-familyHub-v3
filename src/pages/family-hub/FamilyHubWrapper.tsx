import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from '../../familyhub/components/AppShell';
import DashboardScreen from '../../familyhub/screens/DashboardScreen';
import KidsScreen from '../../familyhub/screens/KidsScreen';
import ActivitiesScreen from '../../familyhub/screens/ActivitiesScreen';
import ProgressScreen from '../../familyhub/screens/ProgressScreen';
import SettingsScreen from '../../familyhub/screens/SettingsScreen';
import WelcomeScreen, { HUB_WELCOMED_KEY } from '../../familyhub/screens/WelcomeScreen';
import AuthWrapper, { useAuth } from './AuthWrapper';
import LoginPage from './LoginPage';

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
      {/* First-time welcome screen — shown before the shell */}
      <Route path="welcome" element={<WelcomeScreen />} />

      {/* Redirect root: send newcomers to welcome, returners to dashboard */}
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
