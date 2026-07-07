/**
 * Fails CI when off-brand blue primary-action tokens appear in src/.
 * Semantic/data-viz blues (badges, game categories, network icons) are allowed.
 * Run: node scripts/check-primary-blue.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = path.join(root, 'src');

/** Patterns that indicate a primary CTA, not category coloring */
const BANNED = [
  /\bbg-blue-600\b/,
  /\bhover:bg-blue-700\b/,
  /\bfrom-blue-500 to-blue-600\b/,
  /\bhover:from-blue-600\b/,
  /\bhover:to-blue-700\b/,
];

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (name === 'node_modules') continue;
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, files);
    else if (/\.(tsx?|jsx?|css)$/.test(name)) files.push(full);
  }
  return files;
}

const hits = [];
for (const file of walk(srcDir)) {
  const rel = path.relative(root, file);
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    for (const re of BANNED) {
      if (re.test(line)) {
        hits.push({ file: rel, line: i + 1, text: line.trim().slice(0, 120) });
        break;
      }
    }
  });
}

if (hits.length) {
  console.error('Off-brand blue primary-action tokens found:\n');
  for (const h of hits) {
    console.error(`  ${h.file}:${h.line}`);
    console.error(`    ${h.text}\n`);
  }
  process.exit(1);
}

console.log('check-primary-blue: OK (no banned primary blue CTA tokens)');
