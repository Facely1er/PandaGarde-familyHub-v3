/**
 * Crops canonical character portraits from casting.png (2×6 grid).
 * Usage: npm run assets:character-portraits
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import {
  CASTING_COLS,
  CASTING_ROLE_CELLS,
  CASTING_ROWS,
  PANEL_LETTERBOX,
  PORTRAIT_SIZE,
  detectGridGutters,
  getCastingExtractRect,
} from './lib/characterPortraitCropUtils.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const sourcePath = path.join(root, 'src', 'assets', 'story-covers', 'sources', 'casting.png');
const outDir = path.join(root, 'public', 'images', 'characters');

if (!fs.existsSync(sourcePath)) {
  console.error(`Missing casting source: ${path.relative(root, sourcePath)}`);
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

const { width, height } = await sharp(sourcePath).metadata();
const { data } = await sharp(sourcePath).raw().toBuffer({ resolveWithObject: true });
const gutters = detectGridGutters(data, width, height, CASTING_COLS, CASTING_ROWS);

console.log(`Casting source: ${path.relative(root, sourcePath)} (${width}×${height})`);
console.log(`Gutters: x=[${gutters.xGutters.join(', ')}] y=[${gutters.yGutters.join(', ')}]`);

for (const [role, { col, row }] of Object.entries(CASTING_ROLE_CELLS)) {
  const cellRect = getCastingExtractRect(width, height, col, row, gutters);
  const outPath = path.join(outDir, `${role}-portrait.webp`);

  await sharp(sourcePath)
    .extract(cellRect)
    .resize(PORTRAIT_SIZE, PORTRAIT_SIZE, {
      fit: 'contain',
      position: 'centre',
      background: PANEL_LETTERBOX,
    })
    .webp({ quality: 88 })
    .toFile(outPath);

  const meta = await sharp(outPath).metadata();
  console.log(`Wrote ${path.relative(root, outPath)} (${meta.width}×${meta.height})`);
}

console.log(`Done — ${Object.keys(CASTING_ROLE_CELLS).length} portraits in public/images/characters/`);
