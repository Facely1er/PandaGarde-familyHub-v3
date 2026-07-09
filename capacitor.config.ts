import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pandagarde.familyhub',
  appName: 'PandaGarde Family Hub',
  webDir: 'dist-familyhub',
  backgroundColor: '#f9fafb',
  server: {
    androidScheme: 'https',
  },
  ios: {
    contentInset: 'never',
    backgroundColor: '#f9fafb',
    // iPad defaults to desktop WKWebView mode (narrow phone layout). Force mobile viewport.
    preferredContentMode: 'mobile',
  },
};

export default config;
