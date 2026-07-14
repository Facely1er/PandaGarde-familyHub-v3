#!/usr/bin/env node
/**
 * Record App Review flow on Xcode Simulator (iPhone 6.5").
 * Uses the same simulator workflow as ios-simulator-review-smoke.mjs:
 * production derivedData path, single install + launch, simctl recordVideo.
 *
 * Builds with VITE_APP_REVIEW_DEMO=true so the in-app auto-tour runs during capture.
 *
 * Output: store-assets/app-review/simulator-review-iphone.mov (+ .mp4)
 */
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { simulatorMovToMp4FfmpegArgs } from './lib/app-review-capture-shared.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const iosAppDir = path.join(root, 'ios', 'App');
const iosPublicDir = path.join(iosAppDir, 'App', 'public');
/** Match ios-simulator-review-smoke — avoids .derivedData-review install hangs */
const derivedData = path.join(iosAppDir, '.derivedData');
const appBundle = path.join(derivedData, 'Build', 'Products', 'Debug-iphonesimulator', 'App.app');
const bundleId = 'com.pandagarde.familyhub';
const outDir = path.join(root, 'store-assets', 'app-review');
const recordOut = path.join(outDir, 'simulator-review-iphone.mov');
const recordMp4 = path.join(outDir, 'simulator-review-iphone.mp4');

const SIM = {
  name: 'SC-Review-iPhone-6.5',
  deviceType: 'com.apple.CoreSimulator.SimDeviceType.iPhone-14-Pro-Max',
};

function readAppReviewRecordMs() {
  const src = fs.readFileSync(path.join(root, 'src/lib/appReviewDemo.ts'), 'utf8');
  const match = /APP_REVIEW_RECORD_MS = ([\d_]+)/.exec(src);
  return match ? Number(match[1].replace(/_/g, '')) : 52_000;
}

const TOUR_MS = Number(process.env.APP_REVIEW_RECORD_MS ?? readAppReviewRecordMs());
const skipBuild = process.argv.includes('--skip-build');

const env = {
  ...process.env,
  LANG: 'en_US.UTF-8',
  LC_ALL: 'en_US.UTF-8',
};

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? root,
    env: options.env ?? env,
    stdio: options.quiet ? 'pipe' : 'inherit',
    encoding: options.quiet ? 'utf8' : undefined,
  });
  if (result.status !== 0 && !options.allowFail) {
    process.exit(result.status ?? 1);
  }
  return result;
}

function sleep(ms) {
  spawnSync('sleep', [String(Math.max(1, Math.ceil(ms / 1000)))], { stdio: 'ignore' });
}

function resolveLatestIosRuntime() {
  const list = run('xcrun', ['simctl', 'list', 'runtimes', 'available', '-j'], { quiet: true });
  const runtimes = JSON.parse(list.stdout).runtimes.filter((rt) => rt.isAvailable && rt.platform === 'iOS');
  if (runtimes.length === 0) {
    throw new Error('No iOS Simulator runtime found.');
  }
  return runtimes.sort((a, b) => b.version.localeCompare(a.version, undefined, { numeric: true }))[0]
    .identifier;
}

function findSimulatorByName(name) {
  const list = run('xcrun', ['simctl', 'list', 'devices', 'available', '-j'], { quiet: true });
  const data = JSON.parse(list.stdout);
  for (const runtime of Object.keys(data.devices).sort().reverse()) {
    const match = data.devices[runtime]?.find((d) => d.isAvailable && d.name === name);
    if (match) {
      return { ...match, runtime };
    }
  }
  return null;
}

function ensureSimulator() {
  const { name, deviceType } = SIM;
  const existing = findSimulatorByName(name);
  if (existing?.deviceTypeIdentifier === deviceType) {
    return existing.udid;
  }
  if (existing) {
    run('xcrun', ['simctl', 'shutdown', existing.udid], { allowFail: true });
    run('xcrun', ['simctl', 'delete', existing.udid]);
  }
  const runtime = existing?.runtime ?? resolveLatestIosRuntime();
  const create = run('xcrun', ['simctl', 'create', name, deviceType, runtime], { quiet: true });
  const udid = create.stdout?.trim();
  if (!udid) {
    throw new Error(`Failed to create simulator ${name}`);
  }
  return udid;
}

/** Same boot path as ios-simulator-review-smoke — do not shutdown a running sim. */
function bootSimulator(udid) {
  const state = run('xcrun', ['simctl', 'list', 'devices', '-j'], { quiet: true });
  const data = JSON.parse(state.stdout);
  const match = Object.values(data.devices).flat().find((d) => d.udid === udid);
  if (match?.state !== 'Booted') {
    console.log('[ios-sim-record] Booting simulator…');
    run('xcrun', ['simctl', 'boot', udid]);
    sleep(3000);
  }
  run('open', ['-a', 'Simulator', '--args', '-CurrentDeviceUDID', udid], { allowFail: true });
  sleep(2000);
}

function prepareWebBundle() {
  console.log('[ios-sim-record] Building Family Hub (App Review auto-tour, no premium commerce)…');
  run('npm', ['run', 'build:familyhub'], {
    env: {
      ...env,
      VITE_APP_REVIEW_DEMO: 'true',
      VITE_HUB_STANDALONE: 'true',
      VITE_DISABLE_PREMIUM_COMMERCE: 'true',
    },
  });
  const distSw = path.join(root, 'dist-familyhub', 'sw.js');
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
  console.log('[ios-sim-record] Installing CocoaPods…');
  run('pod', ['install'], { cwd: iosAppDir });
}

function buildSimulatorApp() {
  console.log('[ios-sim-record] Building iOS Simulator app…');
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

function installFresh(udid) {
  run('xcrun', ['simctl', 'uninstall', udid, bundleId], { allowFail: true });
  console.log('[ios-sim-record] Installing app on simulator…');
  const install = spawnSync('perl', ['-e', 'alarm 90; exec @ARGV', 'xcrun', 'simctl', 'install', udid, appBundle], {
    cwd: root,
    env,
    stdio: 'inherit',
    encoding: 'utf8',
  });
  if (install.status !== 0) {
    throw new Error('simctl install timed out or failed — restart Simulator and retry');
  }
}

function launchApp(udid) {
  run('xcrun', ['simctl', 'terminate', udid, bundleId], { allowFail: true });
  run('xcrun', ['simctl', 'launch', udid, bundleId]);
  run('osascript', ['-e', 'tell application "Simulator" to activate'], { allowFail: true });
}

function exportMovToMp4(movPath, mp4Path) {
  const ffmpegBin = process.env.FFMPEG ?? 'ffmpeg';
  console.log(`[ios-sim-record] Exporting MP4 → ${mp4Path}`);
  const result = spawnSync(ffmpegBin, simulatorMovToMp4FfmpegArgs(movPath, mp4Path), { encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error(result.stderr || 'ffmpeg MP4 export failed');
  }
  if (!fs.existsSync(mp4Path) || fs.statSync(mp4Path).size < 10_000) {
    throw new Error('MP4 export missing or too small');
  }
  console.log(`[ios-sim-record] ✓ Saved ${mp4Path} (${Math.round(fs.statSync(mp4Path).size / 1024)} KB)`);
}

async function recordTour(udid) {
  fs.mkdirSync(outDir, { recursive: true });
  if (fs.existsSync(recordOut)) {
    fs.unlinkSync(recordOut);
  }

  installFresh(udid);
  launchApp(udid);

  console.log('[ios-sim-record] Waiting for login screen before recording…');
  const loginReadyMs = Number(process.env.APP_REVIEW_LOGIN_READY_MS ?? 5000);
  await new Promise((resolve) => setTimeout(resolve, loginReadyMs));

  console.log(`[ios-sim-record] Recording ${TOUR_MS / 1000}s (auto-tour) → ${recordOut}`);
  const recorder = spawn('xcrun', ['simctl', 'io', udid, 'recordVideo', recordOut], { stdio: 'inherit' });

  await new Promise((resolve) => setTimeout(resolve, TOUR_MS));
  recorder.kill('SIGINT');
  await new Promise((resolve) => {
    recorder.on('exit', resolve);
    setTimeout(resolve, 5000);
  });

  if (!fs.existsSync(recordOut) || fs.statSync(recordOut).size < 10_000) {
    throw new Error('Recording missing or too small — try: npm run ios:simulator:review -- --record');
  }
  console.log(`[ios-sim-record] ✓ Saved ${recordOut} (${Math.round(fs.statSync(recordOut).size / 1024)} KB)`);
  exportMovToMp4(recordOut, recordMp4);
}

async function main() {
  if (process.platform !== 'darwin') {
    console.error('[ios-sim-record] Requires macOS with Xcode.');
    process.exit(1);
  }

  const udid = ensureSimulator();
  bootSimulator(udid);

  if (!skipBuild) {
    prepareWebBundle();
    buildSimulatorApp();
  } else if (!fs.existsSync(appBundle)) {
    throw new Error('No simulator app bundle — run without --skip-build first.');
  }

  await recordTour(udid);
}

main().catch((err) => {
  console.error('[ios-sim-record] Failed:', err.message ?? err);
  console.error('[ios-sim-record] Manual fallback: npm run ios:simulator:review -- --record');
  process.exit(1);
});
