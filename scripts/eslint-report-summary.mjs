import { readFileSync } from 'fs';

const r = JSON.parse(readFileSync('eslint-report.json', 'utf8'));
const cwd = process.cwd().replace(/\\/g, '/');

for (const rule of process.argv.slice(2)) {
  console.log(`\n=== ${rule} ===`);
  for (const f of r) {
    for (const m of f.messages) {
      if (m.ruleId === rule) {
        const path = f.filePath.replace(cwd + '/', '').replace(/\\/g, '/');
        console.log(`${path}:${m.line}`);
      }
    }
  }
}
