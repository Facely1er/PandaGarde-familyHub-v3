#!/usr/bin/env node
/**
 * Build iOS app from CLI with progress output (use when Xcode UI appears stuck).
 * Uses ios/App/.derivedData — never ios/App/build (breaks cap sync clean).
 *
 * Usage: npm run ios:build
 *        npm run ios:build -- --simulator
 */
import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const iosAppDir = path.join(root, 'ios', 'App');
const derivedData = path.join(iosAppDir, '.derivedData');

const env = {
  ...process.env,
  LANG: 'en_US.UTF-8',
  LC_ALL: 'en_US.UTF-8',
};

const simulator = process.argv.includes('--simulator');

function resolveSimulatorDestination() {
  const list = spawnSync('xcrun', ['simctl', 'list', 'devices', 'available', '-j'], {
    encoding: 'utf8',
    env,
  });
  if (list.status === 0 && list.stdout) {
    try {
      const data = JSON.parse(list.stdout);
      for (const runtime of Object.keys(data.devices).sort().reverse()) {
        const iphone = data.devices[runtime]?.find(
          (d) => d.isAvailable && !d.isUnavailable && d.name?.startsWith('iPhone')
        );
        if (iphone) {
          return `platform=iOS Simulator,id=${iphone.udid}`;
        }
      }
    } catch {
      // fall through
    }
  }
  return 'generic/platform=iOS Simulator';
}

const destination = simulator ? resolveSimulatorDestination() : 'generic/platform=iOS';

console.log('[ios:build] Building Debug…');
console.log(`[ios:build] DerivedData: ${derivedData}`);

const result = spawnSync(
  'xcodebuild',
  [
    '-workspace',
    'App.xcworkspace',
    '-scheme',
    'App',
    '-configuration',
    'Debug',
    '-destination',
    destination,
    '-derivedDataPath',
    derivedData,
    'CODE_SIGNING_ALLOWED=NO',
    'build',
  ],
  {
    cwd: iosAppDir,
    env,
    stdio: 'inherit',
    shell: false,
  }
);

if (result.status !== 0) {
  console.error('[ios:build] FAILED — open Xcode Report navigator for details, or retry: npm run ios:build -- --simulator');
  process.exit(result.status ?? 1);
}

console.log('[ios:build] BUILD SUCCEEDED');
