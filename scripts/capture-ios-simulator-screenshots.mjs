#!/usr/bin/env node
/**
 * Capture App Store screenshots from Xcode Simulator.
 *
 * Each screen gets its own cold launch with public/capture-target.json set in the
 * app bundle (no familyhub:// openurl — avoids the iOS confirmation dialog).
 * Output is composited inside a device bezel at exact App Store dimensions.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
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
  },
  'ipad-13': {
    profile: FRAMED_DEVICE_PROFILES['ipad-13'],
    simName: 'iPad Pro 13-inch (M5)',
  },
};

const SCREENS = [
  { id: '01-login', waitMs: 5000 },
  { id: '02-dashboard', waitMs: 5500 },
  { id: '03-activities', waitMs: 5500 },
  { id: '04-mission-intro', waitMs: 6500 },
  { id: '05-journey', waitMs: 5500 },
  { id: '06-kids', waitMs: 5500 },
  { id: '07-settings', waitMs: 5500 },
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

function writeCaptureTarget(screenId) {
  const payload = JSON.stringify({ screen: screenId }, null, 2);
  fs.mkdirSync(distDir, { recursive: true });
  fs.mkdirSync(iosPublicDir, { recursive: true });
  fs.mkdirSync(bundlePublicDir, { recursive: true });
  for (const dir of [distDir, iosPublicDir, bundlePublicDir]) {
    fs.writeFileSync(path.join(dir, 'capture-target.json'), payload);
  }
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

  const distSw = path.join(distDir, 'sw.js');
  if (fs.existsSync(distSw)) {
    fs.unlinkSync(distSw);
  }

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

function buildSimulatorApp() {
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
    console.error(`[ios-screenshots] App bundle not found at ${appBundle}`);
    process.exit(1);
  }
}

async function captureDevice(target) {
  const { profile, simName } = target;
  const udid = resolveSimulatorUdid(simName);
  bootSimulator(udid, simName);

  const outDir = path.join(outRoot, profile.slug);
  const rawDir = path.join(rawRoot, profile.slug);
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(rawDir, { recursive: true });

  for (const screen of SCREENS) {
    writeCaptureTarget(screen.id);

    console.log(`[ios-screenshots] ${profile.slug}/${screen.id} — install + launch`);
    run('xcrun', ['simctl', 'terminate', udid, bundleId], { allowFail: true });
    run('xcrun', ['simctl', 'uninstall', udid, bundleId], { allowFail: true });
    run('xcrun', ['simctl', 'install', udid, appBundle]);
    run('xcrun', ['simctl', 'launch', udid, bundleId]);
    sleep(screen.waitMs);

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

  for (const target of targets) {
    await captureDevice(target);
  }

  console.log('\n[ios-screenshots] Done.');
  console.log(`  Framed: ${path.join(outRoot, 'iphone-6.5')} + ipad-13/`);
  console.log(`  Raw:    ${rawRoot}/`);
}

main().catch((err) => {
  console.error('[ios-screenshots] FAILED:', err);
  process.exit(1);
});
