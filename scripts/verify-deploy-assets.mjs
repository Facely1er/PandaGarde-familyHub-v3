#!/usr/bin/env node
/**
 * Verifies production bundles before Netlify / store deploy.
 * Run via: npm run deploy:check
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.dirname(fileURLToPath(import.meta.url));

const bundles = [
  {
    name: 'Main website (www)',
    dir: path.join(root, '..', 'dist'),
    required: ['index.html', 'sw.js', 'manifest.json', 'offline.html', '_headers'],
  },
  {
    name: 'Family Hub (hub.pandagarde.com / Capacitor webDir)',
    dir: path.join(root, '..', 'dist-familyhub'),
    required: [
      'index.html',
      'familyhub.html',
      'sw.js',
      'familyhub-manifest.json',
      'offline.html',
      '_redirects',
      '_headers',
    ],
  },
];

let failed = false;

for (const { name, dir, required } of bundles) {
  if (!fs.existsSync(dir)) {
    console.error(`[deploy:check] Missing output dir: ${dir} (${name})`);
    failed = true;
    continue;
  }

  const missing = required.filter((file) => !fs.existsSync(path.join(dir, file)));
  if (missing.length) {
    console.error(`[deploy:check] ${name} — missing: ${missing.join(', ')}`);
    failed = true;
  } else {
    console.log(`[deploy:check] OK — ${name} (${required.length} assets)`);
  }
}

if (failed) {
  process.exit(1);
}

console.log('[deploy:check] All bundles ready for deploy.');
