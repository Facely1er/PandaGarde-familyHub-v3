import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pandagarde.familyhub',
  appName: 'PandaGarde Family Hub',
  webDir: 'dist-familyhub',
  server: {
    androidScheme: 'https',
  },
  ios: {
    contentInset: 'never',
  },
};

export default config;
