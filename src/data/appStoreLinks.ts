/**
 * Live store listings for the PandaGarde Family Hub mobile app.
 * Keep version/build in sync with package.json, Android, and iOS via
 * `npm run mobile:bump` (`scripts/bump-familyhub-version.mjs`).
 */

/** Store and native display name — same as capacitor.config.ts appName */
export const FAMILY_HUB_APP_NAME = 'PandaGarde Family Hub';

/** Apple bundle ID / Google Play package name (ERMITS Advisory LLC) */
export const FAMILY_HUB_BUNDLE_ID = 'com.pandagarde.familyhub';

/** Marketing version (CFBundleShortVersionString / versionName) */
export const FAMILY_HUB_VERSION = '1.1.0';

/** Android versionCode and iOS CURRENT_PROJECT_VERSION */
export const FAMILY_HUB_BUILD = 13;

export const FAMILY_HUB_VERSION_LABEL = `${FAMILY_HUB_VERSION} (build ${FAMILY_HUB_BUILD})`;

/** Apple App Store — numeric track ID 6789109653 */
export const APP_STORE_URL =
  'https://apps.apple.com/us/app/pandagarde-family-hub/id6789109653';

/** Google Play — resolved from the package name */
export const GOOGLE_PLAY_URL = `https://play.google.com/store/apps/details?id=${FAMILY_HUB_BUNDLE_ID}`;
