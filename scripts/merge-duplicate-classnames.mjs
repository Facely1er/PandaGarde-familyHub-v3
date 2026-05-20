/**
 * Merges duplicate className attributes left by migrate-inline-styles.mjs
 */
import fs from 'fs';
import path from 'path';

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) {
      if (name !== 'node_modules') walk(p, files);
    } else if (/\.(tsx|jsx)$/.test(name)) {
      files.push(p);
    }
  }
  return files;
}

const dupPattern =
  /className=(?:"([^"]*)"|'([^']*)'|\{`([^`]*)`\})\s+className=(?:"([^"]*)"|'([^']*)'|\{`([^`]*)`\})/g;

let fixed = 0;

for (const file of walk(path.resolve('src'))) {
  let content = fs.readFileSync(file, 'utf8');
  let prev;
  do {
    prev = content;
    content = content.replace(dupPattern, (_m, a1, a2, a3, b1, b2, b3) => {
      const a = a1 ?? a2 ?? a3 ?? '';
      const b = b1 ?? b2 ?? b3 ?? '';
      const merged = `${a} ${b}`.trim().replace(/\s+/g, ' ');
      return `className="${merged}"`;
    });
  } while (content !== prev);

  const next = content;
  if (next !== fs.readFileSync(file, 'utf8')) {
    fs.writeFileSync(file, next);
    fixed++;
  }
}

console.log(`Merged classNames in ${fixed} files`);
