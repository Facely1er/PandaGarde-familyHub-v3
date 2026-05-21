/**
 * Builds story card covers:
 * - Episode 1: from episode-1-hero-source.png (full bamboo-forest art) when present
 * - Episodes 2–3: left artwork crop from story-covers-master.png (stacked banners)
 *
 * Usage: node scripts/crop-story-covers.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const coversDir = path.join(root, 'src', 'assets', 'story-covers');
const masterPath = path.join(coversDir, 'story-covers-master.png');
const episode1SourcePath = path.join(coversDir, 'episode-1-hero-source.png');

const ARTWORK_WIDTH_RATIO = 0.65;
const OUTPUT_WIDTH = 640;
const OUTPUT_HEIGHT = 360;

/** Gutter-aware bands in story-covers-master.png (1024×576). */
const MASTER_BANDS = [
  { file: 'episode-2-cover.webp', top: 212, height: 181 },
  { file: 'episode-3-cover.webp', top: 398, height: 174 },
];

async function writeEpisode1Cover() {
  if (!fs.existsSync(episode1SourcePath)) {
    console.warn(
      `Skip episode-1: place full art at ${path.relative(root, episode1SourcePath)}`,
    );
    return;
  }
  await sharp(episode1SourcePath)
    .resize(OUTPUT_WIDTH, OUTPUT_HEIGHT, { fit: 'cover', position: 'left' })
    .webp({ quality: 86 })
    .toFile(path.join(coversDir, 'episode-1-cover.webp'));
  console.log(`Wrote episode-1-cover.webp (from hero source → ${OUTPUT_WIDTH}×${OUTPUT_HEIGHT})`);
}

async function writeMasterBands() {
  const { width, height } = await sharp(masterPath).metadata();
  if (!width || !height) {
    throw new Error(`Could not read dimensions from ${masterPath}`);
  }
  const cropWidth = Math.floor(width * ARTWORK_WIDTH_RATIO);

  for (const { file, top, height: bandHeight } of MASTER_BANDS) {
    if (top + bandHeight > height) {
      throw new Error(`Band ${file} exceeds master height (${top + bandHeight} > ${height})`);
    }
    await sharp(masterPath)
      .extract({ left: 0, top, width: cropWidth, height: bandHeight })
      .resize(OUTPUT_WIDTH, OUTPUT_HEIGHT, { fit: 'cover', position: 'left top' })
      .webp({ quality: 82 })
      .toFile(path.join(coversDir, file));
    console.log(`Wrote ${file} (y=${top} h=${bandHeight})`);
  }
}

await writeEpisode1Cover();
await writeMasterBands();
