#!/usr/bin/env node
/**
 * Record App Review auto-tour on Xcode Simulator (iPhone 6.5").
 * Builds with VITE_APP_REVIEW_DEMO=true so the tour runs in the native shell.
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
const derivedData = path.join(iosAppDir, '.derivedData-review');
const appBundle = path.join(derivedData, 'Build', 'Products', 'Debug-iphonesimulator', 'App.app');
const bundleId = 'com.pandagarde.familyhub';
const outDir = path.join(root, 'store-assets', 'app-review');
const recordOut = path.join(outDir, 'simulator-review-iphone.mov');
const recordMp4 = path.join(outDir, 'simulator-review-iphone.mp4');

function readAppReviewRecordMs() {
  const src = fs.readFileSync(path.join(root, 'src/lib/appReviewDemo.ts'), 'utf8');
  const match = /APP_REVIEW_RECORD_MS = ([\d_]+)/.exec(src);
  return match ? Number(match[1].replace(/_/g, '')) : 52_000;
}

const TOUR_MS = Number(process.env.APP_REVIEW_RECORD_MS ?? readAppReviewRecordMs());
const skipBuild = process.argv.includes('--skip-build');

const SIM = {
  name: 'SC-Review-iPhone-6.5',
  deviceType: 'com.apple.CoreSimulator.SimDeviceType.iPhone-14-Pro-Max',
};

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

function bootSimulator(udid) {
  const state = run('xcrun', ['simctl', 'list', 'devices', '-j'], { quiet: true });
  const data = JSON.parse(state.stdout);
  const match = Object.values(data.devices).flat().find((d) => d.udid === udid);
  if (match?.state !== 'Booted') {
    run('xcrun', ['simctl', 'boot', udid]);
    run('xcrun', ['simctl', 'bootstatus', udid, '-b']);
  }
  run('open', ['-a', 'Simulator', '--args', '-CurrentDeviceUDID', udid], { allowFail: true });
  sleep(2000);
}

function prepareDemoBundle() {
  console.log('[ios-sim-record] Building Family Hub with App Review auto-tour…');
  run('npm', ['run', 'build:familyhub'], {
    env: { ...env, VITE_APP_REVIEW_DEMO: 'true', VITE_HUB_STANDALONE: 'true' },
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

function warmUp(udid) {
  run('xcrun', ['simctl', 'uninstall', udid, bundleId], { allowFail: true });
  run('xcrun', ['simctl', 'install', udid, appBundle]);
  run('xcrun', ['simctl', 'launch', udid, bundleId], { allowFail: true });
  sleep(3500);
  run('xcrun', ['simctl', 'terminate', udid, bundleId], { allowFail: true });
  sleep(800);
}

function coldLaunch(udid) {
  run('xcrun', ['simctl', 'uninstall', udid, bundleId], { allowFail: true });
  run('xcrun', ['simctl', 'install', udid, appBundle]);
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

  // Install and reach the login screen before recording — never capture simctl install UI.
  console.log('[ios-sim-record] Cold launch (install happens before recording)…');
  coldLaunch(udid);
  const loginReadyMs = Number(process.env.APP_REVIEW_LOGIN_READY_MS ?? 3500);
  await new Promise((resolve) => setTimeout(resolve, loginReadyMs));

  console.log(`[ios-sim-record] Recording ${TOUR_MS / 1000}s → ${recordOut}`);
  const recorder = spawn('xcrun', ['simctl', 'io', udid, 'recordVideo', recordOut], { stdio: 'inherit' });

  await new Promise((resolve) => setTimeout(resolve, TOUR_MS));
  recorder.kill('SIGINT');
  await new Promise((resolve) => {
    recorder.on('exit', resolve);
    setTimeout(resolve, 5000);
  });

  if (!fs.existsSync(recordOut) || fs.statSync(recordOut).size < 10_000) {
    throw new Error('Recording missing or too small — re-run npm run app-review:record:simulator');
  }
  console.log(`[ios-sim-record] ✓ Saved ${recordOut} (${Math.round(fs.statSync(recordOut).size / 1024)} KB)`);
  exportMovToMp4(recordOut, recordMp4);
}

function syncPublicIntoAppBundle() {
  const publicSrc = path.join(iosAppDir, 'App', 'public');
  const publicDest = path.join(appBundle, 'public');
  if (!fs.existsSync(publicSrc)) {
    throw new Error('Missing ios/App/App/public — run prepareDemoBundle first.');
  }
  fs.rmSync(publicDest, { recursive: true, force: true });
  fs.cpSync(publicSrc, publicDest, { recursive: true });
}

async function main() {
  if (process.platform !== 'darwin') {
    console.error('[ios-sim-record] Requires macOS with Xcode.');
    process.exit(1);
  }

  const udid = ensureSimulator();
  bootSimulator(udid);

  if (!skipBuild) {
    prepareDemoBundle();
    buildSimulatorApp();
  } else {
    if (!fs.existsSync(appBundle)) {
      throw new Error('No simulator app bundle — run without --skip-build first.');
    }
    console.log('[ios-sim-record] --skip-build: refreshing demo web bundle only…');
    prepareDemoBundle();
    syncPublicIntoAppBundle();
  }

  warmUp(udid);
  await recordTour(udid);
}

main().catch((err) => {
  console.error('[ios-sim-record] Failed:', err.message ?? err);
  process.exit(1);
});
