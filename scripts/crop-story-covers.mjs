/**
 * Builds story card covers (512×640 WebP) from production source sheets.
 *
 * Usage: npm run assets:story-covers
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import {
  LETTERBOX,
  OUTPUT_HEIGHT,
  OUTPUT_WIDTH,
  getCellExtractRect,
  detectGridGutters,
} from './lib/storyCoverCropUtils.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const coversDir = path.join(root, 'src', 'assets', 'story-covers');
const sourcesDir = path.join(coversDir, 'sources');

const LEGACY_MASTER_BANDS = [
  { file: 'episode-2-cover.webp', top: 192, height: 192 },
  { file: 'episode-3-cover.webp', top: 384, height: 192 },
];
const LEGACY_ARTWORK_WIDTH_RATIO = 0.62;
const LEGACY_BAND_INSET_TOP = 0.08;
const LEGACY_BAND_INSET_BOTTOM = 0.08;
const LEGACY_BAND_INSET_LEFT = 0.03;

const SEASON1_GRID = {
  cols: 4,
  rows: 2,
  episodes: [
    'episode-1-cover.webp',
    'episode-2-cover.webp',
    'episode-3-cover.webp',
    'episode-4-cover.webp',
    'episode-5-cover.webp',
    'episode-6-cover.webp',
    'episode-7-cover.webp',
    'episode-8-cover.webp',
  ],
};

async function buildCoverFromExtract(sourcePath, cellRect) {
  return sharp(sourcePath)
    .extract(cellRect)
    .resize(OUTPUT_WIDTH, OUTPUT_HEIGHT, {
      fit: 'contain',
      background: LETTERBOX,
    })
    .webp({ quality: 90 });
}

async function validateOutput(filePath) {
  const { width, height, format } = await sharp(filePath).metadata();
  const size = fs.statSync(filePath).size;
  if (format !== 'webp' || width !== OUTPUT_WIDTH || height !== OUTPUT_HEIGHT || size < 8000) {
    throw new Error(`Invalid output ${path.basename(filePath)}: ${width}×${height} ${size}B`);
  }
}

function resolveSeason1SourcePath() {
  const candidates = [
    path.join(sourcesDir, 'season-1-covers-4x2.png'),
    path.join(sourcesDir, 'pandastories-2.png'),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

async function writeSeason1Grid() {
  const sourcePath = resolveSeason1SourcePath();
  if (!sourcePath) {
    console.warn('Skip season-1 grid: add sources/season-1-covers-4x2.png');
    return false;
  }

  const { width, height } = await sharp(sourcePath).metadata();
  const { data } = await sharp(sourcePath).raw().toBuffer({ resolveWithObject: true });
  const gutters = detectGridGutters(data, width, height, SEASON1_GRID.cols, SEASON1_GRID.rows);

  console.log(`Season-1 grid source: ${path.relative(root, sourcePath)} (${width}×${height})`);
  console.log(`Detected gutters: x=[${gutters.xGutters.join(', ')}] y=[${gutters.yGutters.join(', ')}]`);
  console.log(`Output: ${OUTPUT_WIDTH}×${OUTPUT_HEIGHT} portrait (fit contain, no 16:9 chop)`);

  const { cols, rows, episodes } = SEASON1_GRID;
  let index = 0;
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const file = episodes[index];
      if (!file) break;
      const outPath = path.join(coversDir, file);
      const cellRect = getCellExtractRect(width, height, col, row, cols, rows, gutters);
      await (await buildCoverFromExtract(sourcePath, cellRect)).toFile(outPath);
      await validateOutput(outPath);
      console.log(
        `Wrote ${file} (col=${col} row=${row} art ${cellRect.width}×${cellRect.height} → ${OUTPUT_WIDTH}×${OUTPUT_HEIGHT})`,
      );
      index += 1;
    }
  }
  return true;
}

async function writeEpisode1HeroFallback() {
  const episode1SourcePath = path.join(coversDir, 'episode-1-hero-source.png');
  if (!fs.existsSync(episode1SourcePath)) {
    return;
  }
  const outPath = path.join(coversDir, 'episode-1-cover.webp');
  await sharp(episode1SourcePath)
    .resize(OUTPUT_WIDTH, OUTPUT_HEIGHT, { fit: 'contain', background: LETTERBOX })
    .webp({ quality: 90 })
    .toFile(outPath);
  await validateOutput(outPath);
  console.log('Wrote episode-1-cover.webp (legacy hero fallback)');
}

async function writeLegacyMasterBands() {
  const masterPath = path.join(coversDir, 'story-covers-master.png');
  if (!fs.existsSync(masterPath)) {
    return;
  }
  const { width, height } = await sharp(masterPath).metadata();
  if (!width || !height) return;

  for (const { file, top, height: bandHeight } of LEGACY_MASTER_BANDS) {
    if (top + bandHeight > height) continue;

    const cropWidth = Math.floor(width * LEGACY_ARTWORK_WIDTH_RATIO);
    const padT = Math.max(4, Math.floor(bandHeight * LEGACY_BAND_INSET_TOP));
    const padB = Math.max(4, Math.floor(bandHeight * LEGACY_BAND_INSET_BOTTOM));
    const padL = Math.max(4, Math.floor(cropWidth * LEGACY_BAND_INSET_LEFT));
    const extractHeight = bandHeight - padT - padB;

    if (extractHeight < 32) continue;

    const outPath = path.join(coversDir, file);
    await sharp(masterPath)
      .extract({
        left: padL,
        top: top + padT,
        width: cropWidth - padL,
        height: extractHeight,
      })
      .resize(OUTPUT_WIDTH, OUTPUT_HEIGHT, { fit: 'contain', background: LETTERBOX })
      .webp({ quality: 82 })
      .toFile(outPath);
    await validateOutput(outPath);
    console.log(`Wrote ${file} (legacy master band)`);
  }
}

const usedGrid = await writeSeason1Grid();
if (!usedGrid) {
  await writeEpisode1HeroFallback();
  await writeLegacyMasterBands();
}
