import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pandagarde.familyhub',
  appName: 'PandaGarde Family Hub',
  webDir: 'dist-familyhub',
  server: {
    androidScheme: 'https',
  },
  ios: {
    // Let CSS env(safe-area-inset-*) handle home indicator; 'automatic' fights fixed bottom nav.
    contentInset: 'never',
  },
};

export default config;
