#!/usr/bin/env node
/**
 * Boot iPhone Simulator with a production Family Hub build and print the App Review smoke-test script.
 *
 * Usage (Mac + Xcode):
 *   npm run ios:simulator:review
 *   npm run ios:simulator:review:ipad
 *   npm run ios:simulator:review -- --record   # → store-assets/app-review/simulator-review-iphone.mov
 *   npm run ios:simulator:review:ipad -- --record
 *   npm run ios:simulator:review -- --skip-build
 */
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { simulatorMovToMp4FfmpegArgs } from './lib/app-review-capture-shared.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const iosAppDir = path.join(root, 'ios', 'App');
const iosPublicDir = path.join(iosAppDir, 'App', 'public');
const derivedData = path.join(iosAppDir, '.derivedData');
const appBundle = path.join(derivedData, 'Build', 'Products', 'Debug-iphonesimulator', 'App.app');
const bundleId = 'com.pandagarde.familyhub';
const reviewOutDir = path.join(root, 'store-assets', 'app-review');

const DEVICE_PROFILES = {
  iphone: {
    name: 'SC-Review-iPhone-6.5',
    deviceType: 'com.apple.CoreSimulator.SimDeviceType.iPhone-14-Pro-Max',
    label: 'iPhone 14 Pro Max (6.5")',
    recordFile: 'simulator-review-iphone.mov',
  },
  ipad: {
    name: 'iPad Pro 13-inch (M5)',
    deviceType: null,
    label: 'iPad Pro 13-inch',
    recordFile: 'simulator-review-ipad.mov',
  },
};

const env = {
  ...process.env,
  LANG: 'en_US.UTF-8',
  LC_ALL: 'en_US.UTF-8',
};

const skipBuild = process.argv.includes('--skip-build');
const startRecord = process.argv.includes('--record');
const deviceArg = process.argv.find((a) => a.startsWith('--device='));
const deviceKey = deviceArg?.split('=')[1] ?? 'iphone';
const deviceProfile = DEVICE_PROFILES[deviceKey];

if (!deviceProfile) {
  console.error(`Unknown --device=${deviceKey}. Use iphone or ipad.`);
  process.exit(1);
}

const recordOut = path.join(reviewOutDir, deviceProfile.recordFile);
const recordMp4 = path.join(reviewOutDir, deviceProfile.recordFile.replace(/\.mov$/i, '.mp4'));

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
    throw new Error('No iOS Simulator runtime found. Install one in Xcode → Settings → Platforms.');
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

function ensureSimulator(profile) {
  const { name, deviceType } = profile;
  const existing = findSimulatorByName(name);
  if (!deviceType) {
    if (existing) {
      return existing.udid;
    }
    throw new Error(
      `Simulator not found: "${name}". Create it in Xcode → Window → Devices and Simulators.`
    );
  }
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

function bootSimulator(udid, name) {
  const state = run('xcrun', ['simctl', 'list', 'devices', '-j'], { quiet: true });
  const data = JSON.parse(state.stdout);
  const match = Object.values(data.devices).flat().find((d) => d.udid === udid);
  if (match?.state !== 'Booted') {
    console.log(`[ios:simulator:review] Booting ${name}…`);
    run('xcrun', ['simctl', 'boot', udid]);
    sleep(3000);
  }
  run('open', ['-a', 'Simulator', '--args', '-CurrentDeviceUDID', udid], { allowFail: true });
  sleep(2000);
}

function prepareWebBundle() {
  console.log('[ios:simulator:review] Building production Family Hub bundle (no demo flags)…');
  run('npm', ['run', 'build:familyhub'], {
    env: { ...process.env, VITE_DISABLE_PREMIUM_COMMERCE: 'true' },
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
  console.log('[ios:simulator:review] Installing CocoaPods…');
  run('pod', ['install'], { cwd: iosAppDir });
}

function buildSimulatorApp() {
  console.log('[ios:simulator:review] Building App for iOS Simulator…');
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
  run('xcrun', ['simctl', 'install', udid, appBundle]);
}

function launchApp(udid) {
  run('xcrun', ['simctl', 'terminate', udid, bundleId], { allowFail: true });
  run('xcrun', ['simctl', 'launch', udid, bundleId]);
  run('osascript', ['-e', 'tell application "Simulator" to activate'], { allowFail: true });
}

function exportMovToMp4(movPath, mp4Path) {
  const ffmpegBin = process.env.FFMPEG ?? 'ffmpeg';
  console.log(`[ios:simulator:review] Exporting MP4 → ${mp4Path}`);
  const result = spawnSync(ffmpegBin, simulatorMovToMp4FfmpegArgs(movPath, mp4Path), { encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error(result.stderr || 'ffmpeg MP4 export failed');
  }
  console.log(`[ios:simulator:review] ✓ Saved ${mp4Path} (${Math.round(fs.statSync(mp4Path).size / 1024)} KB)`);
}

function printManualScript(simName, simLabel, iosRuntime) {
  console.log(`
══════════════════════════════════════════════════════════════════
  PandaGarde Family Hub — App Review smoke test (Simulator)
  Device: ${simName} (${simLabel}) · iOS ${iosRuntime}
  Bundle: ${bundleId}
══════════════════════════════════════════════════════════════════

Follow in order (~5 min). Check each step before continuing.

 1. LOGIN
    [ ] App opens on login screen
    [ ] Tap "Let's go!"

 2. WELCOME (first launch only)
    [ ] Welcome screen appears
    [ ] Tap "Add your family to start"

 3. DASHBOARD (bottom tab: Dashboard)
    [ ] Today's mission / dashboard content visible
    [ ] No "Navigation error" screen

 4. JOURNEY (bottom tab: Journey)
    [ ] Mission progress / badges area loads

 5. MISSIONS (bottom tab: Missions)
    [ ] Mission list loads
    [ ] Open "Pack Your Digital Backpack" (or today's mission)
    [ ] Complete intro → celebration appears
    [ ] Tap "Back to activities" (not "Continue to next mission")

 6. FAMILY (bottom tab: Family)
    [ ] Tap "Add your first member" or "+ Add member"
    [ ] Name: Alex · Age: 9 · Role: Child → save
    [ ] Alex appears in the list

 7. SETTINGS (gear icon, top right)
    [ ] Settings opens
    [ ] **No "Premium missions" section** (Guideline 3.1.1)
    [ ] Scroll to "Your data on this device"
    [ ] Tap "Clear all data on this device" → confirm "Clear all data"
    [ ] Returns to login screen

 8. FRESH START
    [ ] Tap "Let's go!" again — welcome or dashboard loads

 PASS if all checked and no error screens.

 For App Store reply (section 2), after iPhone + iPad sim tests:
   • iPhone Simulator (iPhone 14 Pro Max, 6.5") — iOS ${iosRuntime}
   • iPad Simulator (iPad Pro 13-inch) — iPadOS ${iosRuntime}
   Attach the iPhone simctl recording to App Store Connect.

 Full checklist: docs/FAMILYHUB_IOS_SIMULATOR_REVIEW_TEST.md
══════════════════════════════════════════════════════════════════
`);
}

function getIosRuntimeLabel() {
  const list = run('xcrun', ['simctl', 'list', 'runtimes', 'available', '-j'], { quiet: true });
  const runtimes = JSON.parse(list.stdout).runtimes.filter((rt) => rt.isAvailable && rt.platform === 'iOS');
  const latest = runtimes.sort((a, b) => b.version.localeCompare(a.version, undefined, { numeric: true }))[0];
  return latest?.version ?? 'latest';
}

async function main() {
  if (process.platform !== 'darwin') {
    console.error('[ios:simulator:review] Requires macOS with Xcode.');
    process.exit(1);
  }

  const udid = ensureSimulator(deviceProfile);
  bootSimulator(udid, deviceProfile.name);

  if (!skipBuild) {
    prepareWebBundle();
    buildSimulatorApp();
  } else if (!fs.existsSync(appBundle)) {
    throw new Error('No simulator app bundle — run without --skip-build first.');
  }

  installFresh(udid);
  launchApp(udid);

  const iosVersion = getIosRuntimeLabel();
  printManualScript(deviceProfile.name, deviceProfile.label, iosVersion);

  if (startRecord) {
    // Wait for login screen before recording — avoid capturing install/home-screen UI.
    console.log('[ios:simulator:review] Waiting for login screen before recording…');
    sleep(6000);
    fs.mkdirSync(path.dirname(recordOut), { recursive: true });
    console.log(`[ios:simulator:review] Recording → ${recordOut}`);
    console.log('[ios:simulator:review] Run the manual checklist now. Press Ctrl+C when finished.\n');
    const proc = spawn('xcrun', ['simctl', 'io', udid, 'recordVideo', recordOut], { stdio: 'inherit' });
    proc.on('exit', (code) => {
      if (code === 0 || code === null) {
        console.log(`\n[ios:simulator:review] ✓ Saved ${recordOut}`);
        try {
          exportMovToMp4(recordOut, recordMp4);
        } catch (err) {
          console.error('[ios:simulator:review] MP4 export failed:', err.message ?? err);
          process.exit(1);
        }
      }
      process.exit(code ?? 0);
    });
    return;
  }

  console.log('[ios:simulator:review] Tip: re-run with --record to capture simulator video.\n');
}

main().catch((err) => {
  console.error('[ios:simulator:review] Failed:', err.message ?? err);
  process.exit(1);
});
