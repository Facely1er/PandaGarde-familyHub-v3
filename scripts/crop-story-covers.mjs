/**
 * Builds story card covers (640×360 WebP) from production source sheets.
 *
 * Primary source: season-1-covers-4x2.png — 4×2 grid, episodes 1–8 left→right, top→bottom.
 * Legacy: episode-1-hero-source.png, story-covers-master.png (ep 2–3 only).
 *
 * Cropping trims title/logo chrome and shaves shared gutters so adjacent panels never bleed in.
 *
 * Usage: npm run assets:story-covers
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const coversDir = path.join(root, 'src', 'assets', 'story-covers');
const sourcesDir = path.join(coversDir, 'sources');

const OUTPUT_WIDTH = 640;
const OUTPUT_HEIGHT = 360;
const MIN_INSET_PX = 6;

/** Every panel has episode badge (top) and series logo (bottom). */
const CHROME_TOP = 0.115;
const CHROME_BOTTOM = 0.135;

/** Outer sheet edge — small trim only. */
const OUTER_EDGE = 0.02;

/** Extra trim on each side of a column/row boundary (both cells share this gutter). */
const INNER_COL_GUTTER = 0.075;
const INNER_ROW_GUTTER = 0.045;

const LEGACY_MASTER_BANDS = [
  { file: 'episode-2-cover.webp', top: 192, height: 192 },
  { file: 'episode-3-cover.webp', top: 384, height: 192 },
];
const LEGACY_ARTWORK_WIDTH_RATIO = 0.62;
const LEGACY_BAND_INSET_TOP = 0.1;
const LEGACY_BAND_INSET_BOTTOM = 0.12;
const LEGACY_BAND_INSET_LEFT = 0.03;

/** Episode number → output filename (wired in storyCoverAssets.ts by slug). */
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

/**
 * @returns {{ left: number, top: number, width: number, height: number }}
 */
function getCellExtractRect(width, height, col, row, cols, rows) {
  const x0 = Math.round((col / cols) * width);
  const x1 = Math.round(((col + 1) / cols) * width);
  const y0 = Math.round((row / rows) * height);
  const y1 = Math.round(((row + 1) / rows) * height);

  const cellW = x1 - x0;
  const cellH = y1 - y0;

  let insetL = col === 0 ? OUTER_EDGE : INNER_COL_GUTTER / 2;
  let insetR = col === cols - 1 ? OUTER_EDGE : INNER_COL_GUTTER / 2;
  let insetT = CHROME_TOP;
  let insetB = CHROME_BOTTOM;

  if (row > 0) {
    insetT += INNER_ROW_GUTTER / 2;
  }
  if (row < rows - 1) {
    insetB += INNER_ROW_GUTTER / 2;
  }

  const padL = Math.max(MIN_INSET_PX, Math.floor(cellW * insetL));
  const padR = Math.max(MIN_INSET_PX, Math.floor(cellW * insetR));
  const padT = Math.max(MIN_INSET_PX, Math.floor(cellH * insetT));
  const padB = Math.max(MIN_INSET_PX, Math.floor(cellH * insetB));

  const extractLeft = x0 + padL;
  const extractTop = y0 + padT;
  const extractWidth = cellW - padL - padR;
  const extractHeight = cellH - padT - padB;

  if (extractWidth < 32 || extractHeight < 32) {
    throw new Error(
      `Extract rect too small for col=${col} row=${row}: ${extractWidth}×${extractHeight}`,
    );
  }

  return {
    left: extractLeft,
    top: extractTop,
    width: extractWidth,
    height: extractHeight,
  };
}

async function cropGridCell(sourcePath, col, row, cols, rows) {
  const { width, height } = await sharp(sourcePath).metadata();
  if (!width || !height) {
    throw new Error('Could not read source dimensions');
  }

  const rect = getCellExtractRect(width, height, col, row, cols, rows);

  return sharp(sourcePath)
    .extract(rect)
    .resize(OUTPUT_WIDTH, OUTPUT_HEIGHT, { fit: 'cover', position: 'centre' })
    .webp({ quality: 86 });
}

async function writeSeason1Grid() {
  const sourcePath = path.join(sourcesDir, 'season-1-covers-4x2.png');
  if (!fs.existsSync(sourcePath)) {
    console.warn(`Skip season-1 grid: missing ${path.relative(root, sourcePath)}`);
    return false;
  }

  const { width, height } = await sharp(sourcePath).metadata();
  console.log(`Season-1 grid source: ${width}×${height}`);

  const { cols, rows, episodes } = SEASON1_GRID;
  let index = 0;
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const file = episodes[index];
      if (!file) break;
      const outPath = path.join(coversDir, file);
      const rect = getCellExtractRect(width, height, col, row, cols, rows);
      await (await cropGridCell(sourcePath, col, row, cols, rows)).toFile(outPath);
      console.log(
        `Wrote ${file} (col=${col} row=${row} extract ${rect.width}×${rect.height} @ ${rect.left},${rect.top})`,
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
  await sharp(episode1SourcePath)
    .resize(OUTPUT_WIDTH, OUTPUT_HEIGHT, { fit: 'cover', position: 'left' })
    .webp({ quality: 86 })
    .toFile(path.join(coversDir, 'episode-1-cover.webp'));
  console.log('Wrote episode-1-cover.webp (legacy hero source override)');
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
    const padT = Math.max(MIN_INSET_PX, Math.floor(bandHeight * LEGACY_BAND_INSET_TOP));
    const padB = Math.max(MIN_INSET_PX, Math.floor(bandHeight * LEGACY_BAND_INSET_BOTTOM));
    const padL = Math.max(MIN_INSET_PX, Math.floor(cropWidth * LEGACY_BAND_INSET_LEFT));
    const extractHeight = bandHeight - padT - padB;

    if (extractHeight < 32) continue;

    await sharp(masterPath)
      .extract({
        left: padL,
        top: top + padT,
        width: cropWidth - padL,
        height: extractHeight,
      })
      .resize(OUTPUT_WIDTH, OUTPUT_HEIGHT, { fit: 'cover', position: 'west' })
      .webp({ quality: 82 })
      .toFile(path.join(coversDir, file));
    console.log(`Wrote ${file} (legacy master band, inset top/bottom/sides)`);
  }
}

const usedGrid = await writeSeason1Grid();
if (!usedGrid) {
  await writeEpisode1HeroFallback();
  await writeLegacyMasterBands();
}
