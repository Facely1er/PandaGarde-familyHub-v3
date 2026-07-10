#!/usr/bin/env node
/**
 * Create a Release .xcarchive for App Store Connect upload.
 *
 * Prerequisite: npm run ios:prepare (or ios:appstore:prepare)
 * Signing: Xcode → target App → Signing & Capabilities → select your Team.
 *
 * Usage:
 *   npm run ios:archive
 *   npm run ios:archive -- --export   # also export App Store .ipa to ios/App/build/export/
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const iosAppDir = path.join(root, 'ios', 'App');
const archiveDir = path.join(iosAppDir, 'build');
const archivePath = path.join(archiveDir, 'App.xcarchive');
const exportDir = path.join(archiveDir, 'export');

const env = {
  ...process.env,
  LANG: 'en_US.UTF-8',
  LC_ALL: 'en_US.UTF-8',
};

const doExport = process.argv.includes('--export');
const developmentTeam = process.env.DEVELOPMENT_TEAM?.trim();

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? iosAppDir,
    env,
    stdio: 'inherit',
    shell: false,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

fs.mkdirSync(archiveDir, { recursive: true });

console.log('[ios:archive] Archiving Release for generic iOS device…');
console.log(`[ios:archive] Output: ${archivePath}`);
if (developmentTeam) {
  console.log(`[ios:archive] Using DEVELOPMENT_TEAM=${developmentTeam}`);
}

const archiveArgs = [
  '-workspace',
  'App.xcworkspace',
  '-scheme',
  'App',
  '-configuration',
  'Release',
  '-destination',
  'generic/platform=iOS',
  '-archivePath',
  archivePath,
  'archive',
];
if (developmentTeam) {
  archiveArgs.push(`DEVELOPMENT_TEAM=${developmentTeam}`);
}

const archiveResult = spawnSync('xcodebuild', archiveArgs, {
  cwd: iosAppDir,
  env,
  stdio: 'inherit',
  shell: false,
});

if (archiveResult.status !== 0) {
  console.error(
    '[ios:archive] FAILED — set your Apple Team in Xcode (target App → Signing & Capabilities),'
  );
  console.error('  or run: DEVELOPMENT_TEAM=<team-id> npm run ios:archive');
  console.error('  Quick path: npm run cap:ios → Product → Archive → Distribute App');
  process.exit(archiveResult.status ?? 1);
}

console.log('[ios:archive] ARCHIVE SUCCEEDED');
console.log(`[ios:archive] Open in Xcode: open ${archivePath}`);

if (!doExport) {
  console.log('[ios:archive] Upload via Xcode Organizer, or re-run with --export after configuring export options.');
  process.exit(0);
}

const exportOptions = path.join(archiveDir, 'ExportOptions.plist');
fs.writeFileSync(
  exportOptions,
  `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>method</key>
  <string>app-store-connect</string>
  <key>destination</key>
  <string>export</string>
  <key>signingStyle</key>
  <string>automatic</string>
  <key>stripSwiftSymbols</key>
  <true/>
  <key>uploadSymbols</key>
  <true/>
</dict>
</plist>
`
);

fs.rmSync(exportDir, { recursive: true, force: true });
fs.mkdirSync(exportDir, { recursive: true });

console.log('[ios:archive] Exporting App Store .ipa…');
run('xcodebuild', [
  '-exportArchive',
  '-archivePath',
  archivePath,
  '-exportPath',
  exportDir,
  '-exportOptionsPlist',
  exportOptions,
  '-allowProvisioningUpdates',
]);

console.log(`[ios:archive] Export done: ${exportDir}`);
