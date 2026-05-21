/**
 * Splits story-covers-master.png (3 stacked episode banners) into card covers.
 * Crops the left artwork region to omit baked-in title text on the right.
 *
 * Master layout (1024×576): three horizontal banners with dark gutters between them.
 * Equal height/3 slices include gutter + bleed from adjacent episodes — use BAND_BOUNDS.
 *
 * Usage: node scripts/crop-story-covers.mjs
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const coversDir = path.join(root, 'src', 'assets', 'story-covers');
const masterPath = path.join(coversDir, 'story-covers-master.png');

/** Fraction of width to keep (illustration is on the left). */
const ARTWORK_WIDTH_RATIO = 0.65;
/** Card tiles are ~315×160px; 2× assets keep retina crisp without bloating the bundle. */
const OUTPUT_WIDTH = 640;
const OUTPUT_HEIGHT = 360;

/**
 * Pixel bounds per episode in story-covers-master.png (measured; re-measure if master changes).
 * top + height must stay inside the artwork band and exclude inter-episode gutters.
 */
const BAND_BOUNDS = [
  { file: 'episode-1-cover.webp', top: 4, height: 202 },
  { file: 'episode-2-cover.webp', top: 212, height: 181 },
  { file: 'episode-3-cover.webp', top: 398, height: 174 },
];

const image = sharp(masterPath);
const { width, height } = await image.metadata();
if (!width || !height) {
  throw new Error(`Could not read dimensions from ${masterPath}`);
}

const cropWidth = Math.floor(width * ARTWORK_WIDTH_RATIO);

for (const { file, top, height: bandHeight } of BAND_BOUNDS) {
  if (top + bandHeight > height) {
    throw new Error(`Band ${file} exceeds master height (${top + bandHeight} > ${height})`);
  }
  await sharp(masterPath)
    .extract({ left: 0, top, width: cropWidth, height: bandHeight })
    .resize(OUTPUT_WIDTH, OUTPUT_HEIGHT, { fit: 'cover', position: 'left top' })
    .webp({ quality: 82 })
    .toFile(path.join(coversDir, file));
  console.log(
    `Wrote ${file} (y=${top} h=${bandHeight}, ${cropWidth}w → ${OUTPUT_WIDTH}×${OUTPUT_HEIGHT})`,
  );
}
