#!/usr/bin/env node
/**
 * Capture App Store screenshots from Xcode Simulator.
 *
 * Navigation uses a local HTTP server (no familyhub:// openurl — avoids the iOS
 * "Open in PandaGarde Family Hub?" dialog). Output is composited inside a device bezel.
 *
 * Requires: Xcode, simulators SC-Store-iPhone-6.5 and iPad Pro 13-inch (M5).
 *
 * Output:
 *   store-assets/app-store/iphone-6.5/*.png  (1284×2778, framed)
 *   store-assets/app-store/ipad-13/*.png     (2064×2752, framed)
 *   store-assets/app-store/_raw/{device}/*.png (raw simulator captures)
 *
 * Usage:
 *   npm run assets:screenshots:ios:build
 *   node scripts/capture-ios-simulator-screenshots.mjs --device=iphone-6.5
 */
import { spawnSync } from 'node:child_process';
import http from 'node:http';
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
const derivedData = path.join(iosAppDir, '.derivedData');
const appBundle = path.join(derivedData, 'Build', 'Products', 'Debug-iphonesimulator', 'App.app');
const bundleId = 'com.pandagarde.familyhub';
const outRoot = path.join(root, 'store-assets', 'app-store');
const rawRoot = path.join(outRoot, '_raw');
const CAPTURE_PORT = 4177;

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
  { id: '01-login', waitMs: 3500 },
  { id: '02-dashboard', waitMs: 4000 },
  { id: '03-activities', waitMs: 4000 },
  { id: '04-mission-intro', waitMs: 5000 },
  { id: '05-journey', waitMs: 4000 },
  { id: '06-kids', waitMs: 4000 },
  { id: '07-settings', waitMs: 4000 },
];

let currentScreen = null;
let captureServer;

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

function startCaptureServer() {
  return new Promise((resolve, reject) => {
    captureServer = http.createServer((req, res) => {
      if (req.method === 'GET' && req.url === '/screen') {
        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-store',
        });
        res.end(JSON.stringify({ screen: currentScreen }));
        return;
      }
      res.writeHead(404);
      res.end();
    });
    captureServer.on('error', reject);
    captureServer.listen(CAPTURE_PORT, '0.0.0.0', () => {
      console.log(`[ios-screenshots] Capture server on http://127.0.0.1:${CAPTURE_PORT}/screen`);
      resolve(undefined);
    });
  });
}

function stopCaptureServer() {
  if (!captureServer) {
    return;
  }
  captureServer.close();
  captureServer = undefined;
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

  console.log(`[ios-screenshots] Installing app on ${simName}…`);
  run('xcrun', ['simctl', 'terminate', udid, bundleId], { allowFail: true });
  run('xcrun', ['simctl', 'uninstall', udid, bundleId], { allowFail: true });
  run('xcrun', ['simctl', 'install', udid, appBundle]);

  const outDir = path.join(outRoot, profile.slug);
  const rawDir = path.join(rawRoot, profile.slug);
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(rawDir, { recursive: true });

  currentScreen = SCREENS[0].id;
  console.log(`[ios-screenshots] Launching app (screen=${currentScreen})…`);
  run('xcrun', ['simctl', 'launch', udid, bundleId]);
  sleep(2500);

  for (const screen of SCREENS) {
    currentScreen = screen.id;
    const rawPath = path.join(rawDir, `${screen.id}.png`);
    const outPath = path.join(outDir, `${screen.id}.png`);

    console.log(`[ios-screenshots] ${profile.slug}/${screen.id}`);
    sleep(screen.waitMs);

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

  currentScreen = null;
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

  await startCaptureServer();

  try {
    for (const target of targets) {
      await captureDevice(target);
    }
  } finally {
    stopCaptureServer();
  }

  console.log('\n[ios-screenshots] Done.');
  console.log(`  Framed: ${path.join(outRoot, 'iphone-6.5')} + ipad-13/`);
  console.log(`  Raw:    ${rawRoot}/`);
}

main().catch((err) => {
  console.error('[ios-screenshots] FAILED:', err);
  stopCaptureServer();
  process.exit(1);
});
