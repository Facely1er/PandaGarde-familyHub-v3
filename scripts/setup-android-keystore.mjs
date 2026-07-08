#!/usr/bin/env node
/**
 * One-time Android upload keystore setup for Play Store release builds.
 *
 * Creates:
 *   android/pandagarde-familyhub-upload.jks  (gitignored)
 *   android/keystore.properties              (gitignored)
 *
 * Usage:
 *   npm run android:keystore
 *
 * Non-interactive (CI / scripted):
 *   set KEYSTORE_STORE_PASSWORD=... && set KEYSTORE_KEY_PASSWORD=... && npm run android:keystore
 *
 * Windows PowerShell:
 *   $env:KEYSTORE_STORE_PASSWORD='...'; $env:KEYSTORE_KEY_PASSWORD='...'; npm run android:keystore
 */
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const androidDir = path.join(root, 'android');
const keystoreFile = path.join(androidDir, 'pandagarde-familyhub-upload.jks');
const propsFile = path.join(androidDir, 'keystore.properties');
const keyAlias = 'upload';

const dname =
  process.env.KEYSTORE_DNAME ??
  'CN=PandaGarde Family Hub, OU=Mobile, O=ERMITS Advisory, L=Unknown, ST=Unknown, C=US';

function findKeytool() {
  const javaHome = process.env.JAVA_HOME;
  if (javaHome) {
    const candidate = path.join(
      javaHome,
      'bin',
      process.platform === 'win32' ? 'keytool.exe' : 'keytool'
    );
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return process.platform === 'win32' ? 'keytool.exe' : 'keytool';
}

function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  if (fs.existsSync(keystoreFile)) {
    console.error(`[android:keystore] Keystore already exists: ${path.relative(root, keystoreFile)}`);
    console.error('Delete it first only if you are intentionally rotating keys (breaks Play updates).');
    process.exit(1);
  }

  const keytool = findKeytool();
  const storePassword =
    process.env.KEYSTORE_STORE_PASSWORD ??
    (await prompt('Enter NEW keystore password (min 8 chars): '));
  const keyPasswordInput = process.env.KEYSTORE_KEY_PASSWORD ?? (await prompt('Enter NEW key password (Enter = same as store): '));
  const keyPassword = keyPasswordInput || storePassword;

  if (!storePassword || storePassword.length < 8) {
    console.error('[android:keystore] Password must be at least 8 characters.');
    process.exit(1);
  }

  if (!process.env.KEYSTORE_STORE_PASSWORD) {
    console.log('(Passwords are visible while typing — set KEYSTORE_STORE_PASSWORD / KEYSTORE_KEY_PASSWORD to avoid that.)');
  }

  console.log(`[android:keystore] Using keytool: ${keytool}`);
  console.log(`[android:keystore] Creating ${path.relative(root, keystoreFile)} …`);

  const args = [
    '-genkey',
    '-v',
    '-keystore',
    keystoreFile,
    '-keyalg',
    'RSA',
    '-keysize',
    '2048',
    '-validity',
    '10000',
    '-alias',
    keyAlias,
    '-storepass',
    storePassword,
    '-keypass',
    keyPassword,
    '-dname',
    dname,
  ];

  const result = spawnSync(keytool, args, { stdio: 'inherit', cwd: androidDir });
  if (result.status !== 0) {
    console.error('[android:keystore] keytool failed. Install JDK 17+ and ensure keytool is on PATH.');
    console.error('Tip: set JAVA_HOME to your Android Studio JBR, e.g.');
    console.error('  $env:JAVA_HOME="C:\\Program Files\\Android\\Android Studio\\jbr"');
    process.exit(result.status ?? 1);
  }

  const props = [
    'storeFile=pandagarde-familyhub-upload.jks',
    `storePassword=${storePassword}`,
    `keyAlias=${keyAlias}`,
    `keyPassword=${keyPassword}`,
    '',
  ].join('\n');

  fs.writeFileSync(propsFile, props, 'utf8');

  console.log('');
  console.log('[android:keystore] Success.');
  console.log(`  Keystore: ${path.relative(root, keystoreFile)}`);
  console.log(`  Props:    ${path.relative(root, propsFile)}`);
  console.log('');
  console.log('IMPORTANT: Back up the .jks file and passwords offline (password manager + encrypted drive).');
  console.log('Losing them blocks all future Play Store updates for this app.');
  console.log('');
  console.log('Next: npm run android:bundleRelease');
}

main().catch((error) => {
  console.error('[android:keystore] Failed:', error.message);
  process.exit(1);
});
