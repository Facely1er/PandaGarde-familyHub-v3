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

async function shaveBrightEdge(inputPath, maxShave = 8) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const isBright = (x, y) => {
    const i = (y * info.width + x) * info.channels;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    return a > 20 && r > 232 && g > 232 && b > 232;
  };

  let shaveLeft = 0;
  for (let x = 0; x < Math.min(maxShave, info.width - 32); x += 1) {
    let bright = 0;
    for (let y = 0; y < info.height; y += 2) {
      if (isBright(x, y)) bright += 1;
    }
    if (bright / Math.ceil(info.height / 2) > 0.65) {
      shaveLeft = x + 1;
    } else {
      break;
    }
  }

  if (shaveLeft === 0 || shaveLeft > maxShave) return;

  const shaved = await sharp(inputPath)
    .extract({
      left: shaveLeft,
      top: 0,
      width: info.width - shaveLeft,
      height: info.height,
    })
    .resize(PORTRAIT_SIZE, PORTRAIT_SIZE, { fit: 'fill', background: PANEL_LETTERBOX })
    .webp({ quality: 88 })
    .toBuffer();

  const tempPath = `${inputPath}.tmp`;
  fs.writeFileSync(tempPath, shaved);
  fs.renameSync(tempPath, inputPath);
}

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

  await shaveBrightEdge(outPath);

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
    .resize(PORTRAIT_SIZE, PORTRAIT_SIZE, {
      fit: 'fill',
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
