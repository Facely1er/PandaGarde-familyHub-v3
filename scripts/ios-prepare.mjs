#!/usr/bin/env node
/**
 * Prepare iOS native project for Xcode archive / App Store upload.
 * Sets UTF-8 locale (CocoaPods fails on ASCII-8BIT terminals) and runs pod install.
 *
 * Uses `cap copy ios` instead of `cap sync ios` to avoid xcodebuild clean, which
 * fails when ios/App/build was created outside Xcode (e.g. CLI -derivedDataPath build).
 *
 * Usage: node scripts/ios-prepare.mjs
 */
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const iosAppDir = path.join(root, 'ios', 'App');
const staleBuildDir = path.join(iosAppDir, 'build');

const env = {
  ...process.env,
  LANG: 'en_US.UTF-8',
  LC_ALL: 'en_US.UTF-8',
};

function run(command, args, cwd = root) {
  const result = spawnSync(command, args, { cwd, env, stdio: 'inherit', shell: process.platform === 'win32' });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function removeStaleXcodeBuildDir() {
  if (!fs.existsSync(staleBuildDir)) {
    return;
  }
  console.log('[ios:prepare] Removing stale ios/App/build (blocks cap sync clean)…');
  fs.rmSync(staleBuildDir, { recursive: true, force: true });
}

console.log('[ios:prepare] Building Family Hub web bundle…');
run('npm', ['run', 'build:familyhub']);

console.log('[ios:prepare] Optimizing iOS splash assets (prevents Xcode asset-catalog hangs)…');
run('node', ['scripts/optimize-ios-splash.mjs']);

console.log('[ios:prepare] Copying web assets to ios/App/App/public…');
run('npx', ['cap', 'copy', 'ios']);

const iosPublicSw = path.join(iosAppDir, 'App', 'public', 'sw.js');
if (fs.existsSync(iosPublicSw)) {
  console.log('[ios:prepare] Removing sw.js from iOS bundle (service workers break native WebView)…');
  fs.unlinkSync(iosPublicSw);
}

removeStaleXcodeBuildDir();

console.log('[ios:prepare] Installing CocoaPods dependencies…');
run('pod', ['install'], iosAppDir);

console.log('[ios:prepare] Done. Open Xcode with: npm run cap:ios');
console.log('[ios:prepare] Archive: Product → Archive → Distribute App → App Store Connect');
