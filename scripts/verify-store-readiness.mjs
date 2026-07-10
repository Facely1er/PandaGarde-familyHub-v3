#!/usr/bin/env node
/**
 * Pre-submit checks for Family Hub Google Play + App Store packages.
 * Run: npm run store:check
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const REQUIRED_FILES = [
  'assets/icon.png',
  'assets/splash.png',
  'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png',
  'ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png',
  'store-assets/play-store-icon-512.png',
  'store-assets/apple-app-store-icon-1024.png',
  'store-assets/play-feature-graphic-1024x500.png',
  'public/familyhub-manifest.json',
  'capacitor.config.ts',
  'docs/FAMILYHUB_STORE_SUBMIT_CHECKLIST.md',
  'docs/FAMILYHUB_APP_STORE_REVIEW_REPLY.md',
];

const SCREENSHOT_SETS = [
  { dir: 'store-assets/app-store/iphone-6.5', label: 'iPhone 6.5" App Store set', min: 5 },
  { dir: 'store-assets/app-store/ipad-13', label: 'iPad 13" App Store set', min: 5 },
];
const LEGACY_SCREENSHOT_DIR = 'store-assets/ios-screenshots';

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function fail(message) {
  console.error(`[store:check] FAIL — ${message}`);
  return false;
}

function ok(message) {
  console.log(`[store:check] OK — ${message}`);
  return true;
}

let passed = true;
const track = (success, message) => {
  passed = (success ? ok(message) : fail(message)) && passed;
};

console.log('[store:check] Family Hub store readiness\n');

for (const file of REQUIRED_FILES) {
  track(fs.existsSync(path.join(root, file)), file);
}

for (const { dir, label, min } of SCREENSHOT_SETS) {
  const screenshotDir = path.join(root, dir);
  if (fs.existsSync(screenshotDir)) {
    const shots = fs.readdirSync(screenshotDir).filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f));
    track(shots.length >= min, `${label}: ${shots.length} screenshots (need ≥ ${min})`);
  } else {
    track(false, `${label} missing — run npm run assets:screenshots:build`);
  }
}

const legacyDir = path.join(root, LEGACY_SCREENSHOT_DIR);
if (fs.existsSync(legacyDir)) {
  const legacyShots = fs.readdirSync(legacyDir).filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f));
  console.log(`[store:check] INFO — ${LEGACY_SCREENSHOT_DIR} has ${legacyShots.length} legacy captures`);
}

const capConfig = read('capacitor.config.ts');
track(capConfig.includes("appId: 'com.pandagarde.familyhub'"), 'Capacitor appId com.pandagarde.familyhub');
track(capConfig.includes("appName: 'PandaGarde Family Hub'"), 'Capacitor appName PandaGarde Family Hub');

const gradle = read('android/app/build.gradle');
const versionCodeMatch = gradle.match(/versionCode\s+(\d+)/);
const versionNameMatch = gradle.match(/versionName\s+"([^"]+)"/);
if (versionCodeMatch && versionNameMatch) {
  track(versionNameMatch[1] === '1.0.0', `Android versionName ${versionNameMatch[1]}`);
  console.log(`[store:check] INFO — Android versionCode ${versionCodeMatch[1]} (increment every Play upload)`);
} else {
  track(false, 'Android versionCode / versionName in build.gradle');
}

const settings = read('src/familyhub/screens/SettingsScreen.tsx');
track(settings.includes('path="/privacy"'), 'Settings privacy policy link');
track(settings.includes('HUB_SUPPORT_EMAIL'), 'Settings support email link');
track(settings.includes('clearAllHubLocalData'), 'Settings clear-all-data control (App Review)');
track(!settings.includes('PREMIUM_PRICING_LABEL'), 'Settings hides store pricing (no IAP in v1)');

const reviewReply = read('docs/FAMILYHUB_APP_STORE_REVIEW_REPLY.md');
track(reviewReply.includes('SCREEN RECORDING'), 'Apple 2.1 review reply doc present');
track(reviewReply.includes('FAMILYHUB-PREMIUM'), 'Review reply includes pilot premium code');

const reviewRecordScript = path.join(root, 'scripts/record-app-review-video.mjs');
if (fs.existsSync(reviewRecordScript)) {
  ok('App Review recording script present (npm run app-review:record)');
} else {
  track(false, 'scripts/record-app-review-video.mjs missing');
}

const reviewMp4 = path.join(root, 'store-assets/app-review/app-review-recording.mp4');
if (fs.existsSync(reviewMp4)) {
  ok(`App Review recording built (${Math.round(fs.statSync(reviewMp4).size / 1024)} KB)`);
} else {
  console.log('[store:check] MANUAL — Generate App Review video: npm run app-review:record');
}

const keystoreProps = path.join(root, 'android/keystore.properties');
const keystoreJks = path.join(root, 'android/pandagarde-familyhub-upload.jks');
if (fs.existsSync(keystoreProps) && fs.existsSync(keystoreJks)) {
  ok('Android upload keystore present (local only — keep backed up offline)');
} else {
  console.log('[store:check] MANUAL — Generate upload keystore: npm run android:keystore');
}

const aab = path.join(root, 'android/app/build/outputs/bundle/release/app-release.aab');
if (fs.existsSync(aab)) {
  ok('Signed release AAB built locally');
} else {
  console.log('[store:check] MANUAL — Build signed AAB: npm run android:bundleRelease');
}

console.log('');
if (passed) {
  console.log('[store:check] Automated checks passed. Complete console steps in docs/FAMILYHUB_STORE_SUBMIT_CHECKLIST.md');
} else {
  console.error('[store:check] Fix failures above before store submission.');
  process.exit(1);
}
