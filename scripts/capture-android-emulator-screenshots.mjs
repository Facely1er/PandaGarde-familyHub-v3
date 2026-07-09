#!/usr/bin/env node
/**
 * Capture Play Store screenshots from Android Studio emulator (adb screencap).
 *
 * Injects per-screen capture boot into index.html (same as iOS), installs debug APK,
 * and saves raw + device-framed PNGs for Google Play.
 *
 * Usage:
 *   npm run assets:screenshots:android:emulator
 *   npm run assets:screenshots:android:emulator:build
 *
 * Requires: ANDROID_HOME, an AVD (default Pixel_6), debug APK build.
 */
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import {
  removeCdpForward,
  waitForAndroidScreenContent,
} from './lib/android-cdp-wait.mjs';
import {
  assertFramedDimensions,
  compositeWithDeviceFrame,
  FRAMED_DEVICE_PROFILES,
} from './lib/store-device-frames.mjs';
import { CAPTURE_SCREENS, injectCaptureBootIntoHtml } from './lib/store-capture-boot.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bundleId = 'com.pandagarde.familyhub';
const activity = `${bundleId}/.MainActivity`;
const defaultAvd = process.env.PG_ANDROID_AVD ?? 'Pixel_6';
const profile = FRAMED_DEVICE_PROFILES['pixel-7'];
const outRaw = path.join(root, 'store-assets', 'play-store', 'phone-screenshots');
const outFramed = path.join(root, 'store-assets', 'play-store', 'phone-screenshots-framed');
const distDir = path.join(root, 'dist-familyhub');
const distIndex = path.join(distDir, 'index.html');
const androidPublic = path.join(root, 'android', 'app', 'src', 'main', 'assets', 'public');
const androidIndex = path.join(androidPublic, 'index.html');
const debugApk = path.join(root, 'android', 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');

function sdkRoot() {
  const home = process.env.ANDROID_HOME ?? process.env.ANDROID_SDK_ROOT;
  if (!home || !fs.existsSync(home)) {
    throw new Error('ANDROID_HOME not set. Install Android Studio SDK.');
  }
  return home;
}

function tool(name) {
  const sdk = sdkRoot();
  const win = process.platform === 'win32';
  const candidate = path.join(sdk, name === 'adb' || name === 'emulator' ? name : name, `${name}${win ? '.exe' : ''}`);
  if (fs.existsSync(candidate)) {
    return candidate;
  }
  const platformTools = path.join(sdk, 'platform-tools', `${name}${win ? '.exe' : ''}`);
  if (fs.existsSync(platformTools)) {
    return platformTools;
  }
  const emulatorBin = path.join(sdk, 'emulator', `${name}${win ? '.exe' : ''}`);
  if (fs.existsSync(emulatorBin)) {
    return emulatorBin;
  }
  throw new Error(`SDK tool not found: ${name}`);
}

async function sleep(ms) {
  await delay(ms);
}

function run(cmd, args, { allowFail = false, env = process.env, cwd = root, label } = {}) {
  if (label) {
    console.log(`[android-screenshots] ${label}…`);
  }
  const result = spawnSync(cmd, args, { cwd, env, stdio: 'inherit', shell: process.platform === 'win32' });
  if (result.status !== 0 && !allowFail) {
    throw new Error(`${cmd} ${args.join(' ')} failed with code ${result.status ?? 'unknown'}`);
  }
  return result;
}

function adb(args, options = {}) {
  const argv = Array.isArray(args) ? args : [args];
  const label = options.label ?? (argv[0] === 'devices' ? undefined : `adb ${argv.join(' ')}`);
  return run(tool('adb'), argv, { ...options, label });
}

function listAvds() {
  const result = spawnSync(tool('emulator'), ['-list-avds'], { encoding: 'utf8' });
  return (result.stdout ?? '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function hasBootedDevice() {
  const result = spawnSync(tool('adb'), ['devices'], { encoding: 'utf8' });
  return (result.stdout ?? '')
    .split(/\r?\n/)
    .some((line) => line.trim().endsWith('device') && !line.startsWith('List'));
}

async function waitForBoot(timeoutMs = 180_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const result = spawnSync(tool('adb'), ['shell', 'getprop', 'sys.boot_completed'], { encoding: 'utf8' });
    if ((result.stdout ?? '').trim() === '1') {
      await sleep(3000);
      return;
    }
    await sleep(2000);
  }
  throw new Error('Emulator did not finish booting in time');
}

async function ensureEmulator(avd = defaultAvd) {
  if (hasBootedDevice()) {
    console.log('[android-screenshots] Using connected emulator/device');
    return;
  }

  const avds = listAvds();
  if (!avds.includes(avd)) {
    throw new Error(`AVD "${avd}" not found. Available: ${avds.join(', ') || '(none)'}`);
  }

  console.log(`[android-screenshots] Starting emulator ${avd}…`);
  const emulatorBin = tool('emulator');
  const child = spawn(emulatorBin, ['-avd', avd, '-no-snapshot-save', '-gpu', 'swiftshader_indirect'], {
    detached: true,
    stdio: 'ignore',
  });
  child.unref();
  run(tool('adb'), ['wait-for-device']);
  await waitForBoot();
}

function prepareWebBundle() {
  console.log('[android-screenshots] Building Family Hub with VITE_STORE_SCREENSHOTS=true…');
  run('npm', ['run', 'build:familyhub'], {
    env: { ...process.env, VITE_STORE_SCREENSHOTS: 'true' },
    label: 'build:familyhub',
  });

  const distSw = path.join(distDir, 'sw.js');
  if (fs.existsSync(distSw)) {
    fs.unlinkSync(distSw);
  }

  run('node', ['scripts/ensure-android-local-properties.mjs']);
  run('npx', ['cap', 'copy', 'android'], { label: 'cap copy android' });

  const androidSw = path.join(androidPublic, 'sw.js');
  if (fs.existsSync(androidSw)) {
    fs.unlinkSync(androidSw);
  }
}

function buildDebugApk() {
  const gradlew = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
  run(gradlew, ['assembleDebug'], { cwd: path.join(root, 'android'), label: 'assembleDebug' });
  if (!fs.existsSync(debugApk)) {
    throw new Error(`Debug APK not found at ${debugApk}`);
  }
}

function patchHtmlForScreen(screenId) {
  const source = fs.existsSync(distIndex)
    ? distIndex
    : fs.existsSync(path.join(distDir, 'familyhub.html'))
      ? path.join(distDir, 'familyhub.html')
      : androidIndex;
  const html = fs.readFileSync(source, 'utf8');
  const patched = injectCaptureBootIntoHtml(html, screenId);
  fs.writeFileSync(distIndex, patched);
  if (fs.existsSync(path.join(distDir, 'familyhub.html'))) {
    fs.writeFileSync(path.join(distDir, 'familyhub.html'), patched);
  }
  fs.mkdirSync(androidPublic, { recursive: true });
  fs.writeFileSync(androidIndex, patched);
}

function screencapToFile(outPath) {
  const result = spawnSync(tool('adb'), ['exec-out', 'screencap', '-p'], {
    encoding: 'buffer',
    maxBuffer: 20 * 1024 * 1024,
  });
  if (result.status !== 0 || !result.stdout?.length) {
    throw new Error(`adb screencap failed for ${path.basename(outPath)}`);
  }
  fs.writeFileSync(outPath, result.stdout);
}

async function normalizeRaw(buffer) {
  const meta = await sharp(buffer).metadata();
  const targetW = profile.captureWidth;
  const targetH = profile.captureHeight;
  if (meta.width === targetW && meta.height === targetH) {
    return buffer;
  }
  return sharp(buffer)
    .resize(targetW, targetH, { fit: 'cover', position: 'top' })
    .png()
    .toBuffer();
}

async function captureAll() {
  fs.mkdirSync(outRaw, { recursive: true });
  fs.mkdirSync(outFramed, { recursive: true });

  adb(['shell', 'settings', 'put', 'system', 'show_navigation_bar', '1']);
  adb(['shell', 'settings', 'put', 'secure', 'navigation_mode', '2']);

  for (const screen of CAPTURE_SCREENS) {
    console.log(`[android-screenshots] ${screen.id} — patch, install, launch`);
    patchHtmlForScreen(screen.id);
    run('npx', ['cap', 'copy', 'android'], { allowFail: false });
    buildDebugApk();

    adb(['uninstall', bundleId], { allowFail: true });
    adb(['install', '-r', debugApk]);
    adb(['shell', 'am', 'force-stop', bundleId], { allowFail: true });
    adb(['shell', 'am', 'start', '-n', activity]);
    await sleep(2500);

    const adbPath = tool('adb');
    try {
      console.log(`[android-screenshots] Waiting for ${screen.id} content via WebView CDP…`);
      await waitForAndroidScreenContent(adbPath, screen.waitFor, {
        scrollLoginCta: screen.id === '01-login',
      });
    } catch (error) {
      console.warn(
        `[android-screenshots] CDP wait failed for ${screen.id} (${error.message}); falling back to fixed delay`
      );
      await sleep(screen.waitMs);
    } finally {
      removeCdpForward(adbPath);
    }

    const rawPath = path.join(outRaw, `${screen.id}.png`);
    const framedPath = path.join(outFramed, `${screen.id}.png`);
    screencapToFile(rawPath);

    const rawBuffer = await normalizeRaw(fs.readFileSync(rawPath));
    fs.writeFileSync(rawPath, rawBuffer);
    const framed = await compositeWithDeviceFrame(rawBuffer, profile, sharp);
    fs.writeFileSync(framedPath, framed);

    const rawMeta = await sharp(rawBuffer).metadata();
    const { ok, width, height } = await assertFramedDimensions(framed, profile, sharp);
    console.log(
      `  ✓ ${screen.id} raw ${rawMeta.width}×${rawMeta.height} → framed ${width}×${height}${ok ? '' : ' (dimension mismatch)'}`
    );
  }

  adb(['shell', 'am', 'force-stop', bundleId], { allowFail: true });
}

async function main() {
  const doBuild = process.argv.includes('--build') || !fs.existsSync(debugApk);

  await ensureEmulator();

  if (doBuild || !fs.existsSync(distIndex)) {
    prepareWebBundle();
  } else {
    console.log('[android-screenshots] Reusing web bundle (pass --build to rebuild)');
  }

  await captureAll();

  console.log('\n[android-screenshots] Done.');
  console.log(`  Raw:    ${path.relative(root, outRaw)}/`);
  console.log(`  Framed: ${path.relative(root, outFramed)}/`);
}

main().catch((error) => {
  console.error('[android-screenshots] FAILED:', error.message);
  process.exit(1);
});
