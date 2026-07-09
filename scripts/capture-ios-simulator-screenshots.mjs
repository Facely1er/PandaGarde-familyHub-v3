#!/usr/bin/env node
/**
 * Capture App Store screenshots from Xcode Simulator.
 *
 * Injects synchronous boot script into index.html per screen (no URL schemes,
 * no async fetch). Rebuilds web bundle + Simulator app by default before capture.
 * Output is composited inside a device bezel.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { CAPTURE_SCREENS, injectCaptureBootIntoHtml } from './lib/store-capture-boot.mjs';
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
    waitExtraMs: 5000,
  },
};

function parseArgs() {
  const skipBuild = process.argv.includes('--skip-build');
  const deviceArg = process.argv.find((a) => a.startsWith('--device='));
  const deviceFilter = deviceArg?.split('=')[1] ?? 'all';
  return { skipBuild, deviceFilter };
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

function patchBundleHtml(screenId) {
  for (const htmlPath of [
    path.join(bundlePublicDir, 'index.html'),
    path.join(bundlePublicDir, 'familyhub.html'),
    path.join(iosPublicDir, 'index.html'),
    path.join(iosPublicDir, 'familyhub.html'),
  ]) {
    if (!fs.existsSync(htmlPath)) {
      continue;
    }
    const html = fs.readFileSync(htmlPath, 'utf8');
    fs.writeFileSync(htmlPath, injectCaptureBootIntoHtml(html, screenId));
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
    sleep(3000);
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

function launchApp(udid) {
  run('xcrun', ['simctl', 'terminate', udid, bundleId], { allowFail: true });
  run('xcrun', ['simctl', 'launch', udid, bundleId]);
  run('osascript', ['-e', 'tell application "Simulator" to activate'], { allowFail: true });
}

function warmUpSimulatorApp(udid) {
  console.log('[ios-screenshots] Warm-up launch (WebView cold start)…');
  patchBundleHtml('02-dashboard');
  run('xcrun', ['simctl', 'uninstall', udid, bundleId], { allowFail: true });
  run('xcrun', ['simctl', 'install', udid, appBundle]);
  launchApp(udid);
  sleep(12000);
  run('xcrun', ['simctl', 'terminate', udid, bundleId], { allowFail: true });
  sleep(2000);
}

async function captureDevice(target) {
  const { profile, simName, waitExtraMs } = target;
  const udid = resolveSimulatorUdid(simName);
  bootSimulator(udid, simName);
  warmUpSimulatorApp(udid);

  const outDir = path.join(outRoot, profile.slug);
  const rawDir = path.join(rawRoot, profile.slug);
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(rawDir, { recursive: true });

  for (const screen of CAPTURE_SCREENS) {
    patchBundleHtml(screen.id);

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
  const { skipBuild, deviceFilter } = parseArgs();

  if (skipBuild && !fs.existsSync(appBundle)) {
    console.error('[ios-screenshots] No Simulator build found — run without --skip-build first.');
    process.exit(1);
  }

  if (!skipBuild) {
    prepareWebBundle();
    buildSimulatorApp();
  } else {
    console.log('[ios-screenshots] Skipping rebuild (--skip-build); reusing existing Simulator app bundle');
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
