/**
 * Migrates common inline style patterns to Tailwind / design-system classes.
 * Run: node scripts/migrate-inline-styles.mjs
 */
import fs from 'fs';
import path from 'path';

const SRC = path.resolve('src');

const REPLACEMENTS = [
  // Remove redundant min-height on main (handled by #main-content)
  [/style=\{\{\s*minHeight:\s*['"]100vh['"]\s*\}\}/g, ''],
  // CSS variable colors → Tailwind semantic tokens
  [/style=\{\{\s*color:\s*['"]var\(--primary\)['"]\s*\}\}/g, 'className="text-primary"'],
  [/style=\{\{\s*color:\s*['"]var\(--gray-600\)['"]\s*\}\}/g, 'className="text-gray-600"'],
  [/style=\{\{\s*color:\s*['"]var\(--gray-700\)['"]\s*\}\}/g, 'className="text-gray-700"'],
  [/style=\{\{\s*color:\s*['"]var\(--gray-800\)['"]\s*\}\}/g, 'className="text-gray-800"'],
  [/style=\{\{\s*backgroundColor:\s*['"]var\(--light\)['"]\s*\}\}/g, 'className="bg-light"'],
  [/style=\{\{\s*backgroundColor:\s*['"]var\(--white\)['"]\s*\}\}/g, 'className="bg-surface"'],
  [/style=\{\{\s*textAlign:\s*['"]center['"]\s*\}\}/g, 'className="text-center"'],
  // Marketing hero section pattern
  [
    /style=\{\{\s*padding:\s*['"]clamp\(3rem,\s*6vw,\s*4rem\)\s*0['"],\s*background:\s*['"]linear-gradient\(135deg,\s*#f8fafc\s*0%,\s*#ffffff\s*100%\)['"]\s*\}\}/g,
    'className="marketing-hero"',
  ],
  [
    /style=\{\{\s*padding:\s*['"]4rem\s*0['"],\s*backgroundColor:\s*['"]#f8f9fa['"]\s*\}\}/g,
    'className="marketing-section"',
  ],
];

function mergeClassName(existing, added) {
  if (!existing) {
    return added;
  }
  const m = existing.match(/className=(?:"([^"]*)"|'([^']*)'|\{`([^`]*)`\})/);
  if (!m) {
    return `${existing} ${added}`;
  }
  const quote = existing.includes('className="') ? '"' : existing.includes("className='") ? "'" : '`';
  const current = m[1] ?? m[2] ?? m[3] ?? '';
  const merged = `${current} ${added.replace('className="', '').replace(/"/g, '')}`.trim();
  if (quote === '`') {
    return `className={\`${merged}\`}`;
  }
  return `className=${quote}${merged}${quote}`;
}

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) {
      if (name !== 'node_modules') {
        walk(p, files);
      }
    } else if (/\.(tsx|jsx)$/.test(name)) {
      files.push(p);
    }
  }
  return files;
}

let totalChanges = 0;

for (const file of walk(SRC)) {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;

  for (const [pattern, replacement] of REPLACEMENTS) {
    if (replacement.startsWith('className=')) {
      content = content.replace(pattern, (match, offset) => {
        // If element already has className on same tag, merge (simplified: append before />)
        return replacement;
      });
    } else {
      content = content.replace(pattern, replacement);
    }
  }

  // Drop duplicate text-center when both className and style had it
  content = content.replace(
    /className="([^"]*)\s*text-center"\s+className="text-center"/g,
    'className="$1 text-center"'
  );
  content = content.replace(/className="text-center"\s+className="text-center"/g, 'className="text-center"');

  if (content !== original) {
    fs.writeFileSync(file, content);
    totalChanges++;
  }
}

console.log(`Updated ${totalChanges} files`);

// Merge duplicate className attributes introduced by replacements
await import('./merge-duplicate-classnames.mjs');
