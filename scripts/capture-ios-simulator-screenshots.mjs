#!/usr/bin/env node
/**
 * Capture App Store screenshots from Xcode Simulator.
 *
 * Builds a fresh web bundle per screen (VITE_CAPTURE_SCREEN) so each cold launch
 * lands on the correct route with seeded data — no URL schemes or HTML patching.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { CAPTURE_SCREENS } from './lib/store-capture-boot.mjs';
import {
  assertFramedDimensions,
  compositeWithDeviceFrame,
  FRAMED_DEVICE_PROFILES,
} from './lib/store-device-frames.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const iosAppDir = path.join(root, 'ios', 'App');
const iosPublicDir = path.join(iosAppDir, 'App', 'public');
const derivedData = path.join(iosAppDir, '.derivedData');
const appBundle = path.join(derivedData, 'Build', 'Products', 'Debug-iphonesimulator', 'App.app');
const bundlePublicDir = path.join(appBundle, 'public');
const bundleId = 'com.pandagarde.familyhub';
const outRoot = path.join(root, 'store-assets', 'app-store');
const rawRoot = path.join(outRoot, '_raw');
const distDir = path.join(root, 'dist-familyhub');

const env = {
  ...process.env,
  LANG: 'en_US.UTF-8',
  LC_ALL: 'en_US.UTF-8',
};

const DEVICE_TARGETS = {
  'iphone-6.5': {
    profile: FRAMED_DEVICE_PROFILES['iphone-6.5'],
    simName: 'SC-Store-iPhone-6.5',
    waitExtraMs: 0,
  },
  'ipad-13': {
    profile: FRAMED_DEVICE_PROFILES['ipad-13'],
    simName: 'iPad Pro 13-inch (M5)',
    waitExtraMs: 4000,
  },
};

function parseArgs() {
  const doNativeBuild = process.argv.includes('--build');
  const deviceArg = process.argv.find((a) => a.startsWith('--device='));
  const screenArg = process.argv.find((a) => a.startsWith('--screen='));
  const deviceFilter = deviceArg?.split('=')[1] ?? 'all';
  const screenFilter = screenArg?.split('=')[1] ?? null;
  return { doNativeBuild, deviceFilter, screenFilter };
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? root,
    env: options.env ?? env,
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

function syncPublicToAppBundle() {
  if (!fs.existsSync(distDir)) {
    throw new Error('dist-familyhub missing — build failed');
  }
  fs.rmSync(bundlePublicDir, { recursive: true, force: true });
  fs.cpSync(distDir, bundlePublicDir, { recursive: true });
  fs.rmSync(iosPublicDir, { recursive: true, force: true });
  fs.cpSync(distDir, iosPublicDir, { recursive: true });
  for (const sw of [path.join(bundlePublicDir, 'sw.js'), path.join(iosPublicDir, 'sw.js')]) {
    if (fs.existsSync(sw)) {
      fs.unlinkSync(sw);
    }
  }
}

function buildWebBundleForScreen(screenId) {
  console.log(`[ios-screenshots] Building web bundle for ${screenId}…`);
  run('npm', ['run', 'build:familyhub'], {
    env: {
      ...env,
      VITE_STORE_SCREENSHOTS: 'true',
      VITE_CAPTURE_SCREEN: screenId,
    },
  });
  const distSw = path.join(distDir, 'sw.js');
  if (fs.existsSync(distSw)) {
    fs.unlinkSync(distSw);
  }
  syncPublicToAppBundle();
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
  const match = Object.values(data.devices)
    .flat()
    .find((d) => d.udid === udid);
  if (match?.state !== 'Booted') {
    console.log(`[ios-screenshots] Booting ${name}…`);
    run('xcrun', ['simctl', 'boot', udid]);
    sleep(3000);
  }
  run('open', ['-a', 'Simulator', '--args', '-CurrentDeviceUDID', udid], { allowFail: true });
  sleep(2000);
}

function prepareNativeApp() {
  run('node', ['scripts/patch-capacitor-wkprocesspool.mjs']);
  run('node', ['scripts/optimize-ios-splash.mjs']);
  run('npx', ['cap', 'copy', 'ios']);
  const iosPublicSw = path.join(iosPublicDir, 'sw.js');
  if (fs.existsSync(iosPublicSw)) {
    fs.unlinkSync(iosPublicSw);
  }
  console.log('[ios-screenshots] Installing CocoaPods…');
  run('pod', ['install'], { cwd: iosAppDir });
}

function buildNativeApp() {
  console.log('[ios-screenshots] Building iOS app for Simulator…');
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
      'generic/platform=iOS Simulator',
      '-derivedDataPath',
      derivedData,
      'CODE_SIGNING_ALLOWED=NO',
      'build',
    ],
    { cwd: iosAppDir }
  );
  if (!fs.existsSync(appBundle)) {
    throw new Error(`App bundle not found at ${appBundle}`);
  }
}

function launchApp(udid) {
  run('xcrun', ['simctl', 'terminate', udid, bundleId], { allowFail: true });
  run('xcrun', ['simctl', 'launch', udid, bundleId]);
  run('osascript', ['-e', 'tell application "Simulator" to activate'], { allowFail: true });
}

async function captureDevice(target, screenFilter) {
  const { profile, simName, waitExtraMs } = target;
  const udid = resolveSimulatorUdid(simName);
  bootSimulator(udid, simName);

  const outDir = path.join(outRoot, profile.slug);
  const rawDir = path.join(rawRoot, profile.slug);
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(rawDir, { recursive: true });

  const screens = screenFilter
    ? CAPTURE_SCREENS.filter((s) => s.id === screenFilter)
    : CAPTURE_SCREENS;

  if (screens.length === 0) {
    throw new Error(`Unknown --screen=${screenFilter}`);
  }

  for (const screen of screens) {
    buildWebBundleForScreen(screen.id);

    console.log(`[ios-screenshots] ${profile.slug}/${screen.id} — install + launch`);
    run('xcrun', ['simctl', 'uninstall', udid, bundleId], { allowFail: true });
    run('xcrun', ['simctl', 'install', udid, appBundle]);
    launchApp(udid);
    sleep(screen.waitMs + waitExtraMs);

    const rawPath = path.join(rawDir, `${screen.id}.png`);
    const outPath = path.join(outDir, `${screen.id}.png`);
    run('xcrun', ['simctl', 'io', udid, 'screenshot', rawPath]);

    const raw = fs.readFileSync(rawPath);
    const framed = await compositeWithDeviceFrame(raw, profile, sharp);
    fs.writeFileSync(outPath, framed);

    const rawMeta = await sharp(raw).metadata();
    const { ok, width, height } = await assertFramedDimensions(framed, profile, sharp);
    console.log(
      `  ✓ ${path.relative(root, outPath)} (${width}×${height}${ok ? '' : ' — dimension mismatch'}) [raw ${rawMeta.width}×${rawMeta.height}]`
    );
  }

  run('xcrun', ['simctl', 'terminate', udid, bundleId], { allowFail: true });
}

async function main() {
  const { doNativeBuild, deviceFilter, screenFilter } = parseArgs();

  if (doNativeBuild || !fs.existsSync(appBundle)) {
    prepareNativeApp();
    buildNativeApp();
  } else {
    console.log('[ios-screenshots] Reusing native .app shell (pass --build to rebuild native)');
  }

  const targets =
    deviceFilter === 'all'
      ? Object.values(DEVICE_TARGETS)
      : [DEVICE_TARGETS[deviceFilter]].filter(Boolean);

  if (targets.length === 0) {
    console.error(`Unknown --device=${deviceFilter}. Use iphone-6.5, ipad-13, or all.`);
    process.exit(1);
  }

  for (const target of targets) {
    await captureDevice(target, screenFilter);
  }

  console.log('\n[ios-screenshots] Done.');
}

main().catch((err) => {
  console.error('[ios-screenshots] FAILED:', err);
  process.exit(1);
});
