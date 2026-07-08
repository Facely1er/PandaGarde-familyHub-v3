#!/usr/bin/env node
/**
 * Prepare iOS native project for Xcode archive / App Store upload.
 * Sets UTF-8 locale (CocoaPods fails on ASCII-8BIT terminals) and runs pod install.
 *
 * Usage: node scripts/ios-prepare.mjs
 */
import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const iosAppDir = path.join(root, 'ios', 'App');

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

console.log('[ios:prepare] Building Family Hub web bundle…');
run('npm', ['run', 'build:familyhub']);

console.log('[ios:prepare] Copying web assets to ios/App/App/public…');
run('npx', ['cap', 'copy', 'ios']);

console.log('[ios:prepare] Installing CocoaPods dependencies…');
run('pod', ['install'], iosAppDir);

console.log('[ios:prepare] Done. Open Xcode with: npm run cap:ios');
console.log('[ios:prepare] Archive: Product → Archive → Distribute App → App Store Connect');
