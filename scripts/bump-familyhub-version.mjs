#!/usr/bin/env node
/**
 * Bump Family Hub version across package.json, Android, and iOS.
 *
 * Usage:
 *   node scripts/bump-familyhub-version.mjs 1.0.1
 *   node scripts/bump-familyhub-version.mjs --build
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkgPath = path.join(root, 'package.json');
const androidGradle = path.join(root, 'android', 'app', 'build.gradle');
const iosPbx = path.join(root, 'ios', 'App', 'App.xcodeproj', 'project.pbxproj');

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function writeJson(p, data) {
  fs.writeFileSync(p, `${JSON.stringify(data, null, 2)}\n`);
}

function parseSemver(v) {
  const m = /^(\d+)\.(\d+)\.(\d+)$/.exec(v);
  if (!m) throw new Error(`Invalid semver: ${v}`);
  return { major: +m[1], minor: +m[2], patch: +m[3] };
}

function getAndroidVersionCode(gradleText) {
  const m = /versionCode\s+(\d+)/.exec(gradleText);
  return m ? Number.parseInt(m[1], 10) : 1;
}

function setAndroid(gradleText, versionName, versionCode) {
  let next = gradleText.replace(/versionName\s+"[^"]*"/, `versionName "${versionName}"`);
  next = next.replace(/versionCode\s+\d+/, `versionCode ${versionCode}`);
  return next;
}

function setIosPbx(pbxText, marketingVersion, buildNumber) {
  let next = pbxText.replace(/MARKETING_VERSION = [^;]+;/g, `MARKETING_VERSION = ${marketingVersion};`);
  next = next.replace(/CURRENT_PROJECT_VERSION = [^;]+;/g, `CURRENT_PROJECT_VERSION = ${buildNumber};`);
  return next;
}

const args = process.argv.slice(2);
const buildOnly = args.includes('--build');
const versionArg = args.find((a) => !a.startsWith('-'));

const pkg = readJson(pkgPath);
const currentVersion = pkg.version === '0.0.0' ? '1.0.0' : pkg.version;

let marketingVersion = currentVersion;
let versionCode = 1;
let iosBuild = 1;

if (fs.existsSync(androidGradle)) {
  versionCode = getAndroidVersionCode(fs.readFileSync(androidGradle, 'utf8'));
}

if (fs.existsSync(iosPbx)) {
  const m = /CURRENT_PROJECT_VERSION = (\d+);/.exec(fs.readFileSync(iosPbx, 'utf8'));
  if (m) iosBuild = Number.parseInt(m[1], 10);
}

if (buildOnly) {
  versionCode += 1;
  iosBuild += 1;
  marketingVersion = currentVersion;
} else if (versionArg) {
  marketingVersion = versionArg;
  const prev = parseSemver(currentVersion);
  const next = parseSemver(marketingVersion);
  if (
    next.major > prev.major ||
    next.minor > prev.minor ||
    next.patch > prev.patch
  ) {
    versionCode += 1;
    iosBuild += 1;
  }
} else {
  console.error('Usage: node scripts/bump-familyhub-version.mjs <version> | --build');
  process.exit(1);
}

pkg.version = marketingVersion;
writeJson(pkgPath, pkg);

if (fs.existsSync(androidGradle)) {
  const gradle = fs.readFileSync(androidGradle, 'utf8');
  fs.writeFileSync(androidGradle, setAndroid(gradle, marketingVersion, versionCode));
}

if (fs.existsSync(iosPbx)) {
  const pbx = fs.readFileSync(iosPbx, 'utf8');
  fs.writeFileSync(iosPbx, setIosPbx(pbx, marketingVersion, String(iosBuild)));
}

console.log(`Family Hub version: ${marketingVersion}`);
console.log(`Android versionCode: ${versionCode}`);
console.log(`iOS build (CURRENT_PROJECT_VERSION): ${iosBuild}`);
console.log('Next: npm run mobile:prepare');
