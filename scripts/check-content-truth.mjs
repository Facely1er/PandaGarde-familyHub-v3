#!/usr/bin/env node
/**
 * Fails if banned marketing phrases appear in user-facing source (see docs/CONTENT_TRUTH.md §7).
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SCAN_DIRS = ['src/pages', 'src/components', 'src/familyhub', 'src/data/familyResources.ts'];

const BANNED = [
  { label: 'Join Family Hub', re: /Join Family Hub/i },
  { label: 'Connect with other families', re: /Connect with other families/i },
  { label: 'Family Hub Community', re: /Family Hub Community/i },
  {
    label: 'exclusive resources + Family Hub',
    re: /exclusive resources.*(Family Hub|digital safety education)/i,
  },
  { label: 'see all the apps.*they use', re: /see all the apps.*they use/i },
  { label: 'approve or deny app requests from your children', re: /approve or deny app requests from your children/i },
  { label: 'Real-time alerts about.*children', re: /Real-time alerts about.*children/i },
  { label: 'Enter their name and email.*Child', re: /Enter their name and email.*Child/i },
];

const SKIP_FILES = new Set([
  'CONTENT_TRUTH.md',
  'check-content-truth.mjs',
  'familyPrivacyAssessment.ts', // survey questions about parent habits
  'childServiceCatalog.ts', // third-party service guidance text
]);

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      if (name === 'node_modules' || name === 'dist' || name === 'dist-familyhub') continue;
      walk(path, files);
    } else if (/\.(tsx|ts|md)$/.test(name) && !SKIP_FILES.has(name)) {
      files.push(path);
    }
  }
  return files;
}

function collectFiles() {
  const files = [];
  for (const entry of SCAN_DIRS) {
    const path = join(ROOT, entry);
    try {
      if (statSync(path).isFile()) files.push(path);
      else walk(path, files);
    } catch {
      // ignore missing
    }
  }
  return files;
}

const hits = [];
for (const file of collectFiles()) {
  const rel = relative(ROOT, file).replace(/\\/g, '/');
  if (rel.includes('/community/') && rel.endsWith('.md')) continue;
  const text = readFileSync(file, 'utf8');
  const lines = text.split('\n');
  for (const { label, re } of BANNED) {
    lines.forEach((line, i) => {
      if (re.test(line)) hits.push({ file: rel, line: i + 1, label, snippet: line.trim().slice(0, 120) });
    });
  }
}

if (hits.length === 0) {
  console.log('check-content-truth: OK (no banned phrases in scanned paths)');
  process.exit(0);
}

console.error('check-content-truth: found banned or misleading phrases:\n');
for (const h of hits) {
  console.error(`  ${h.file}:${h.line} [${h.label}]`);
  console.error(`    ${h.snippet}\n`);
}
console.error('See docs/CONTENT_TRUTH.md §7 for approved alternatives.');
process.exit(1);
