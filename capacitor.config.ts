import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pandagarde.familyhub',
  appName: 'Privacy Panda Family Hub',
  // dist-mobile contains the family-hub build with index.html as the entry point
  webDir: 'dist-mobile',
  server: {
    androidScheme: 'https',
    // Only allow navigation to known PandaGarde and required third-party domains.
    // '*' is intentionally avoided to reduce the attack surface.
    allowNavigation: [
      '*.pandagarde.com',
      '*.supabase.co',
      '*.google-analytics.com',
      '*.googletagmanager.com',
      '*.googleapis.com',
      '*.sentry.io',
    ],
    cleartext: false,
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined
    },
    minVersion: 23,
    targetVersion: 35
  },
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true,
    backgroundColor: '#16a34a',
    minVersion: '13.0'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#16a34a',
      showSpinner: false
    }
  }
};

export default config;
