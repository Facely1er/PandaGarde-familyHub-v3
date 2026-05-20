import fs from 'fs';
import path from 'path';

const root = process.cwd();
const srcDir = path.join(root, 'src');
const loggerFile = path.join(srcDir, 'lib', 'logger.ts');

const skipFiles = new Set([
  path.normalize(loggerFile),
  path.join(srcDir, 'lib', 'sentry.ts'),
]);

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) acc.push(...walk(p, []));
    else if (/\.(ts|tsx)$/.test(name)) acc.push(p);
  }
  return acc;
}

function loggerImportFor(file) {
  let rel = path.relative(path.dirname(file), loggerFile).replace(/\\/g, '/');
  if (!rel.startsWith('.')) rel = `./${rel}`;
  return rel.replace(/\.ts$/, '');
}

for (const file of walk(srcDir)) {
  const norm = path.normalize(file);
  if (skipFiles.has(norm)) continue;
  let content = fs.readFileSync(file, 'utf8');
  if (!/console\.(log|warn|error|debug|info)\(/.test(content)) continue;

  const imp = `import { logger } from '${loggerImportFor(file)}';`;
  if (!content.includes("from '") || !content.match(/from ['"].*logger['"]/)) {
    const lines = content.split('\n');
    let lastImport = -1;
    for (let i = 0; i < lines.length; i++) {
      if (/^import .+ from .+;?\s*$/.test(lines[i])) lastImport = i;
    }
    if (lastImport >= 0) {
      lines.splice(lastImport + 1, 0, imp);
    } else {
      lines.unshift(imp);
    }
    content = lines.join('\n');
  }

  content = content
    .replace(/console\.error\(/g, 'logger.error(')
    .replace(/console\.warn\(/g, 'logger.warn(')
    .replace(/console\.debug\(/g, 'logger.debug(')
    .replace(/console\.info\(/g, 'logger.info(')
    .replace(/console\.log\(/g, 'logger.debug(');

  fs.writeFileSync(file, content);
  console.log('updated', path.relative(root, file));
}
