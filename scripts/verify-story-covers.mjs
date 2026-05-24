/**
 * QA pass for story cover crops: gutter snap, edge bleed heuristics, visual overlays.
 * Usage: npm run assets:story-covers:verify
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import {
  OUTPUT_HEIGHT,
  OUTPUT_WIDTH,
  detectGridGutters,
  getCellBounds,
  getCellExtractRect,
} from './lib/storyCoverCropUtils.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const coversDir = path.join(root, 'src', 'assets', 'story-covers');
const sourcePath = path.join(coversDir, 'sources', 'season-1-covers-4x2.png');
const outDir = path.join(coversDir, 'sources', '_crop-verify');

const COLS = 4;
const ROWS = 2;

function edgeStats(data, w, h, edge, sample = 4) {
  let n = 0;
  let r = 0;
  let g = 0;
  let b = 0;
  let nearWhite = 0;

  const span = edge === 'top' || edge === 'bottom' ? w : h;
  for (let s = 0; s < sample; s += 1) {
    for (let i = 0; i < span; i += 1) {
      let x;
      let y;
      if (edge === 'top') {
        x = i;
        y = s;
      } else if (edge === 'bottom') {
        x = i;
        y = h - 1 - s;
      } else if (edge === 'left') {
        x = s;
        y = i;
      } else {
        x = w - 1 - s;
        y = i;
      }
      const idx = (y * w + x) * 3;
      const ri = data[idx];
      const gi = data[idx + 1];
      const bi = data[idx + 2];
      r += ri;
      g += gi;
      b += bi;
      n += 1;
      if (ri > 235 && gi > 235 && bi > 235) nearWhite += 1;
    }
  }

  return {
    avg: [Math.round(r / n), Math.round(g / n), Math.round(b / n)],
    nearWhitePct: +((100 * nearWhite) / n).toFixed(1),
  };
}

function gradeEpisode(edges) {
  const flags = [];
  for (const [side, stats] of Object.entries(edges)) {
    if (stats.nearWhitePct > 15) flags.push(`${side}:white-gutter(${stats.nearWhitePct}%)`);
    else if (stats.nearWhitePct > 8) flags.push(`${side}:watch(${stats.nearWhitePct}%)`);
  }
  if (flags.some((f) => f.includes('white-gutter'))) return { status: 'WARN', flags };
  if (flags.length) return { status: 'OK', flags };
  return { status: 'PASS', flags: ['clean edges'] };
}

if (!fs.existsSync(sourcePath)) {
  console.error('Missing source:', sourcePath);
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

const sourceMeta = await sharp(sourcePath).metadata();
const { data } = await sharp(sourcePath).raw().toBuffer({ resolveWithObject: true });
const gutters = detectGridGutters(data, sourceMeta.width, sourceMeta.height, COLS, ROWS);

const rects = [];
for (let row = 0; row < ROWS; row += 1) {
  for (let col = 0; col < COLS; col += 1) {
    const bounds = getCellBounds(sourceMeta.width, sourceMeta.height, col, row, COLS, ROWS, gutters);
    const cell = getCellExtractRect(
      sourceMeta.width,
      sourceMeta.height,
      col,
      row,
      COLS,
      ROWS,
      gutters,
    );
    rects.push({ bounds, cell, col, row, ep: row * COLS + col + 1 });
  }
}

const svgParts = rects
  .map(({ bounds, cell, ep }) => {
    return [
      `<rect x="${bounds.left}" y="${bounds.top}" width="${bounds.width}" height="${bounds.height}" fill="none" stroke="yellow" stroke-width="1" opacity="0.7"/>`,
      `<rect x="${cell.left}" y="${cell.top}" width="${cell.width}" height="${cell.height}" fill="none" stroke="lime" stroke-width="2" opacity="0.9"/>`,
      `<text x="${cell.left + 8}" y="${cell.top + 22}" fill="white" font-size="18" font-family="sans-serif">Ep ${ep}</text>`,
    ].join('');
  })
  .join('');

const annotateSvg = Buffer.from(
  `<svg width="${sourceMeta.width}" height="${sourceMeta.height}">${svgParts}</svg>`,
);

await sharp(sourcePath)
  .composite([{ input: annotateSvg, top: 0, left: 0 }])
  .png()
  .toFile(path.join(outDir, 'source-crop-overlay.png'));

const report = [];
const thumbs = [];

for (let ep = 1; ep <= 8; ep += 1) {
  const webpPath = path.join(coversDir, `episode-${ep}-cover.webp`);
  if (!fs.existsSync(webpPath)) {
    report.push({ ep, status: 'MISSING' });
    continue;
  }

  const meta = await sharp(webpPath).metadata();
  const { data: webpData, info } = await sharp(webpPath).raw().toBuffer({ resolveWithObject: true });
  const edges = {
    top: edgeStats(webpData, info.width, info.height, 'top'),
    bottom: edgeStats(webpData, info.width, info.height, 'bottom'),
    left: edgeStats(webpData, info.width, info.height, 'left'),
    right: edgeStats(webpData, info.width, info.height, 'right'),
  };
  const grade = gradeEpisode(edges);

  report.push({
    ep,
    file: path.basename(webpPath),
    bytes: fs.statSync(webpPath).size,
    dimensions: `${meta.width}x${meta.height}`,
    ...grade,
    edges,
  });

  thumbs.push(await sharp(webpPath).resize(256, 320).png().toBuffer());
}

const tw = 256;
const th = 320;
const pad = 8;
const sheetW = COLS * tw + (COLS + 1) * pad;
const sheetH = ROWS * th + (ROWS + 1) * pad;
const composites = [];
let index = 0;
for (let row = 0; row < ROWS; row += 1) {
  for (let col = 0; col < COLS; col += 1) {
    if (thumbs[index]) {
      composites.push({
        input: thumbs[index],
        left: pad + col * (tw + pad),
        top: pad + row * (th + pad),
      });
    }
    index += 1;
  }
}

await sharp({
  create: { width: sheetW, height: sheetH, channels: 3, background: '#111827' },
})
  .composite(composites)
  .png()
  .toFile(path.join(outDir, 'contact-sheet.png'));

const summary = {
  source: `${sourceMeta.width}x${sourceMeta.height}`,
  outputFormat: `${OUTPUT_WIDTH}x${OUTPUT_HEIGHT}`,
  gutters,
  outputs: report,
  pass: report.filter((r) => r.status === 'PASS').length,
  warn: report.filter((r) => r.status === 'WARN').length,
  artifacts: [
    'src/assets/story-covers/sources/_crop-verify/source-crop-overlay.png',
    'src/assets/story-covers/sources/_crop-verify/contact-sheet.png',
  ],
};

console.log(JSON.stringify(summary, null, 2));
process.exit(summary.warn > 0 ? 1 : 0);
