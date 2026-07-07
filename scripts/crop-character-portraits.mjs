/**
 * Crops canonical character portraits from casting.png (2×6 grid).
 * Usage: npm run assets:character-portraits
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import {
  CASTING_ROLE_CELLS,
  PANEL_LETTERBOX,
  PORTRAIT_SIZE,
  getCastingPortraitRect,
  getCastingPortraitRectForRole,
  getSagePortraitRect,
} from './lib/characterPortraitCropUtils.mjs';

/** Standalone character art not on the 2×6 casting sheet. */
const STANDALONE_PORTRAIT_SOURCES = {
  sage: path.join('src', 'assets', 'story-covers', 'sources', 'sage-portrait.png'),
};

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
console.log(`Casting source: ${path.relative(root, sourcePath)} (${width}×${height})`);

for (const [role, { col, row }] of Object.entries(CASTING_ROLE_CELLS)) {
  const faceRect = getCastingPortraitRectForRole(width, height, role);
  const outPath = path.join(outDir, `${role}-portrait.webp`);

  await sharp(sourcePath)
    .extract(faceRect)
    .resize(PORTRAIT_SIZE, PORTRAIT_SIZE, {
      fit: 'fill',
      background: PANEL_LETTERBOX,
    })
    .webp({ quality: 88 })
    .toFile(outPath);

  const meta = await sharp(outPath).metadata();
  console.log(
    `Wrote ${path.relative(root, outPath)} (${meta.width}×${meta.height}) from cell R${row}C${col}`,
  );
}

for (const [role, relativeSource] of Object.entries(STANDALONE_PORTRAIT_SOURCES)) {
  const standalonePath = path.join(root, relativeSource);
  if (!fs.existsSync(standalonePath)) {
    console.warn(`Skip ${role}: missing ${path.relative(root, standalonePath)}`);
    continue;
  }

  const outPath = path.join(outDir, `${role}-portrait.webp`);
  const trimmedBuffer = await sharp(standalonePath).trim({ threshold: 18 }).toBuffer();
  const { width: sw, height: sh } = await sharp(trimmedBuffer).metadata();
  const sageRect = getSagePortraitRect(sw, sh);
  console.log(
    `Standalone source: ${path.relative(root, standalonePath)} (trimmed ${sw}×${sh})`,
  );

  await sharp(trimmedBuffer)
    .extract(sageRect)
    .trim({ threshold: 22 })
    .resize(PORTRAIT_SIZE, PORTRAIT_SIZE, {
      fit: 'cover',
      position: 'north',
      background: PANEL_LETTERBOX,
    })
    .webp({ quality: 88 })
    .toFile(outPath);

  const meta = await sharp(outPath).metadata();
  console.log(`Wrote ${path.relative(root, outPath)} (${meta.width}×${meta.height})`);
}

const portraitCount =
  Object.keys(CASTING_ROLE_CELLS).length +
  Object.values(STANDALONE_PORTRAIT_SOURCES).filter((relativeSource) =>
    fs.existsSync(path.join(root, relativeSource)),
  ).length;
console.log(`Done — ${portraitCount} portraits in public/images/characters/`);
