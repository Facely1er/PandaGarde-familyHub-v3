// Verifies the kids bundle (dist-kids) contains no analytics/tracking code.
// Run after `npm run build:kids`. Fails the build if a forbidden pattern is found.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const distDir = path.join(rootDir, 'dist-kids');

const FORBIDDEN_PATTERNS = [
  { pattern: /googletagmanager\.com/i, label: 'Google Tag Manager' },
  { pattern: /google-analytics\.com/i, label: 'Google Analytics' },
  { pattern: /\bgtag\s*\(/, label: 'gtag() call' },
  { pattern: /api\.emailjs\.com/i, label: 'EmailJS' },
  { pattern: /@emailjs\/browser/i, label: 'EmailJS import' },
  { pattern: /sentry\.io/i, label: 'Sentry' },
  { pattern: /hotjar/i, label: 'Hotjar' },
  { pattern: /connect\.facebook\.net/i, label: 'Facebook Pixel' },
  { pattern: /serviceWorker\.register/i, label: 'Service worker registration' },
];

if (!fs.existsSync(distDir)) {
  console.error('dist-kids not found. Run "npm run build:kids" first.');
  process.exit(1);
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const scannable = walk(distDir).filter((file) => /\.(js|mjs|html|css)$/.test(file));
const violations = [];

for (const file of scannable) {
  const content = fs.readFileSync(file, 'utf8');
  for (const { pattern, label } of FORBIDDEN_PATTERNS) {
    if (pattern.test(content)) {
      violations.push({ file: path.relative(rootDir, file), label });
    }
  }
}

if (violations.length > 0) {
  console.error('Kids bundle privacy check FAILED:');
  for (const violation of violations) {
    console.error(`  - ${violation.label} found in ${violation.file}`);
  }
  process.exit(1);
}

console.log(`Kids bundle privacy check passed (${scannable.length} files scanned, no trackers).`);
