#!/usr/bin/env node
/**
 * Capture App Store screenshots from Xcode Simulator (native resolution + status bar).
 *
 * Requires: Xcode, bootable simulators SC-Store-iPhone-6.5 and iPad Pro 13-inch (M5).
 * Deep links: familyhub://capture/{screenId}
 *
 * Output:
 *   store-assets/app-store/iphone-6.5/*.png  (1284×2778)
 *   store-assets/app-store/ipad-13/*.png     (2064×2752)
 *
 * Usage:
 *   npm run assets:screenshots:ios
 *   npm run assets:screenshots:ios:build
 *   node scripts/capture-ios-simulator-screenshots.mjs --device=iphone-6.5
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const iosAppDir = path.join(root, 'ios', 'App');
const derivedData = path.join(iosAppDir, '.derivedData');
const appBundle = path.join(derivedData, 'Build', 'Products', 'Debug-iphonesimulator', 'App.app');
const bundleId = 'com.pandagarde.familyhub';
const outRoot = path.join(root, 'store-assets', 'app-store');
const rawRoot = path.join(outRoot, '_raw');

const env = {
  ...process.env,
  LANG: 'en_US.UTF-8',
  LC_ALL: 'en_US.UTF-8',
};

const DEVICE_TARGETS = {
  'iphone-6.5': {
    slug: 'iphone-6.5',
    simName: 'SC-Store-iPhone-6.5',
    width: 1284,
    height: 2778,
  },
  'ipad-13': {
    slug: 'ipad-13',
    simName: 'iPad Pro 13-inch (M5)',
    width: 2064,
    height: 2752,
  },
};

const SCREENS = [
  { id: '01-login', waitMs: 2500 },
  { id: '02-dashboard', waitMs: 3500 },
  { id: '03-activities', waitMs: 3500 },
  { id: '04-mission-intro', waitMs: 4500 },
  { id: '05-journey', waitMs: 3500 },
  { id: '06-kids', waitMs: 3500 },
  { id: '07-settings', waitMs: 3500 },
];

function parseArgs() {
  const doBuild = process.argv.includes('--build');
  const deviceArg = process.argv.find((a) => a.startsWith('--device='));
  const deviceFilter = deviceArg?.split('=')[1] ?? 'all';
  return { doBuild, deviceFilter };
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? root,
    env,
    stdio: options.quiet ? 'pipe' : 'inherit',
    encoding: options.quiet ? 'utf8' : undefined,
    shell: false,
  });
  if (result.status !== 0 && !options.allowFail) {
    process.exit(result.status ?? 1);
  }
  return result;
}

function sleep(ms) {
  spawnSync('sleep', [String(Math.max(1, Math.ceil(ms / 1000)))], { stdio: 'ignore' });
}

function resolveSimulatorUdid(name) {
  const list = run('xcrun', ['simctl', 'list', 'devices', 'available', '-j'], { quiet: true });
  const data = JSON.parse(list.stdout);
  for (const runtime of Object.keys(data.devices).sort().reverse()) {
    const match = data.devices[runtime]?.find((d) => d.isAvailable && d.name === name);
    if (match) {
      return match.udid;
    }
  }
  throw new Error(`Simulator not found: "${name}". Create it in Xcode → Window → Devices and Simulators.`);
}

function bootSimulator(udid, name) {
  const state = run('xcrun', ['simctl', 'list', 'devices', '-j'], { quiet: true });
  const data = JSON.parse(state.stdout);
  let booted = false;
  for (const devs of Object.values(data.devices)) {
    const match = devs.find((d) => d.udid === udid);
    if (match?.state === 'Booted') {
      booted = true;
      break;
    }
  }
  if (!booted) {
    console.log(`[ios-screenshots] Booting ${name}…`);
    run('xcrun', ['simctl', 'boot', udid]);
  }
  run('open', ['-a', 'Simulator', '--args', '-CurrentDeviceUDID', udid], { allowFail: true });
  sleep(2000);
}

function prepareWebBundle() {
  console.log('[ios-screenshots] Building Family Hub with VITE_STORE_SCREENSHOTS=true…');
  run('npm', ['run', 'build:familyhub'], {
    env: { ...env, VITE_STORE_SCREENSHOTS: 'true' },
  });

  const distSw = path.join(root, 'dist-familyhub', 'sw.js');
  if (fs.existsSync(distSw)) {
    fs.unlinkSync(distSw);
  }

  run('node', ['scripts/patch-capacitor-wkprocesspool.mjs']);
  run('node', ['scripts/optimize-ios-splash.mjs']);
  run('npx', ['cap', 'copy', 'ios']);

  const iosPublicSw = path.join(iosAppDir, 'App', 'public', 'sw.js');
  if (fs.existsSync(iosPublicSw)) {
    fs.unlinkSync(iosPublicSw);
  }

  console.log('[ios-screenshots] Installing CocoaPods (Capacitor App plugin for deep links)…');
  run('pod', ['install'], { cwd: iosAppDir });
}

function buildSimulatorApp() {
  console.log('[ios-screenshots] Building iOS app for Simulator…');
  const destination = 'generic/platform=iOS Simulator';
  run(
    'xcodebuild',
    [
      '-workspace',
      'App.xcworkspace',
      '-scheme',
      'App',
      '-configuration',
      'Debug',
      '-destination',
      destination,
      '-derivedDataPath',
      derivedData,
      'CODE_SIGNING_ALLOWED=NO',
      'build',
    ],
    { cwd: iosAppDir }
  );

  if (!fs.existsSync(appBundle)) {
    console.error(`[ios-screenshots] App bundle not found at ${appBundle}`);
    process.exit(1);
  }
}

async function normalizeScreenshot(buffer, profile) {
  const meta = await sharp(buffer).metadata();
  if (meta.width === profile.width && meta.height === profile.height) {
    return buffer;
  }
  console.warn(
    `[ios-screenshots] ${profile.slug}: raw ${meta.width}×${meta.height} → normalizing to ${profile.width}×${profile.height}`
  );
  return sharp(buffer)
    .resize(profile.width, profile.height, { fit: 'cover', position: 'top' })
    .png()
    .toBuffer();
}

async function captureDevice(profile) {
  const udid = resolveSimulatorUdid(profile.simName);
  bootSimulator(udid, profile.simName);

  console.log(`[ios-screenshots] Installing app on ${profile.simName}…`);
  run('xcrun', ['simctl', 'uninstall', udid, bundleId], { allowFail: true });
  run('xcrun', ['simctl', 'install', udid, appBundle]);

  const outDir = path.join(outRoot, profile.slug);
  const rawDir = path.join(rawRoot, profile.slug);
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(rawDir, { recursive: true });

  for (const screen of SCREENS) {
    const url = `familyhub://capture/${screen.id}`;
    const rawPath = path.join(rawDir, `${screen.id}.png`);
    const outPath = path.join(outDir, `${screen.id}.png`);

    console.log(`[ios-screenshots] ${profile.slug}/${screen.id} ← ${url}`);
    run('xcrun', ['simctl', 'terminate', udid, bundleId], { allowFail: true });
    run('xcrun', ['simctl', 'launch', udid, bundleId], { allowFail: true });
    sleep(1500);
    run('xcrun', ['simctl', 'openurl', udid, url]);
    sleep(screen.waitMs);

    run('xcrun', ['simctl', 'io', udid, 'screenshot', rawPath]);

    const raw = fs.readFileSync(rawPath);
    const normalized = await normalizeScreenshot(raw, profile);
    fs.writeFileSync(outPath, normalized);

    const meta = await sharp(outPath).metadata();
    console.log(`  ✓ ${outPath} (${meta.width}×${meta.height})`);
  }
}

async function main() {
  const { doBuild, deviceFilter } = parseArgs();

  if (doBuild || !fs.existsSync(appBundle)) {
    prepareWebBundle();
    buildSimulatorApp();
  } else {
    console.log('[ios-screenshots] Reusing existing Simulator build (pass --build to rebuild)');
  }

  const targets =
    deviceFilter === 'all'
      ? Object.values(DEVICE_TARGETS)
      : [DEVICE_TARGETS[deviceFilter]].filter(Boolean);

  if (targets.length === 0) {
    console.error(`Unknown --device=${deviceFilter}. Use iphone-6.5, ipad-13, or all.`);
    process.exit(1);
  }

  for (const profile of targets) {
    await captureDevice(profile);
  }

  console.log('\n[ios-screenshots] Done.');
  console.log(`  iPhone 6.5": ${path.join(outRoot, 'iphone-6.5')}`);
  console.log(`  iPad 13":    ${path.join(outRoot, 'ipad-13')}`);
}

main().catch((err) => {
  console.error('[ios-screenshots] FAILED:', err);
  process.exit(1);
});
