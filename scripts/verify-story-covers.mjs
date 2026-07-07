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
  isLetterboxRgb,
} from './lib/storyCoverCropUtils.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const coversDir = path.join(root, 'src', 'assets', 'story-covers');
const sourcesDir = path.join(coversDir, 'sources');
const outDir = path.join(sourcesDir, '_crop-verify');

const COLS = 4;
const ROWS = 2;

const SEASON_CONFIGS = [
  {
    label: 'season-1',
    episodeBase: 1,
    episodeCount: 8,
    sourceCandidates: [
      path.join(sourcesDir, 'cover-stories.png'),
      path.join(sourcesDir, 'cover-stories-banner.png'),
      path.join(sourcesDir, 'season-1-covers-4x2.png'),
    ],
    overlayName: 'source-crop-overlay-season-1.png',
    contactSheetName: 'contact-sheet-season-1.png',
  },
  {
    label: 'season-2',
    episodeBase: 9,
    episodeCount: 8,
    sourceCandidates: [
      path.join(sourcesDir, 'cover-stories-season-2.png'),
      path.join(sourcesDir, 'cover-stories-season-2-alt.png'),
    ],
    overlayName: 'source-crop-overlay-season-2.png',
    contactSheetName: 'contact-sheet-season-2.png',
  },
];

function isCleanCropSource(sourceName) {
  return sourceName.startsWith('cover-stories');
}

function edgeStats(data, w, h, edge, sample = 4) {
  let n = 0;
  let r = 0;
  let g = 0;
  let b = 0;
  let nearWhite = 0;
  let nearLetterbox = 0;

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
      if (isLetterboxRgb(ri, gi, bi)) nearLetterbox += 1;
    }
  }

  return {
    avg: [Math.round(r / n), Math.round(g / n), Math.round(b / n)],
    nearWhitePct: +((100 * nearWhite) / n).toFixed(1),
    nearLetterboxPct: +((100 * nearLetterbox) / n).toFixed(1),
  };
}

function gradeEpisode(edges) {
  const flags = [];
  for (const [side, stats] of Object.entries(edges)) {
    if (stats.nearLetterboxPct > 12) flags.push(`${side}:letterbox(${stats.nearLetterboxPct}%)`);
    else if (stats.nearWhitePct > 15) flags.push(`${side}:white-gutter(${stats.nearWhitePct}%)`);
    else if (stats.nearWhitePct > 8) flags.push(`${side}:watch(${stats.nearWhitePct}%)`);
  }
  if (flags.some((f) => f.includes('letterbox') || f.includes('white-gutter'))) {
    return { status: 'WARN', flags };
  }
  if (flags.length) return { status: 'OK', flags };
  return { status: 'PASS', flags: ['clean edges'] };
}

async function verifySeason(config) {
  const sourcePath = config.sourceCandidates.find((candidate) => fs.existsSync(candidate));
  if (!sourcePath) {
    return { label: config.label, skipped: true, reason: 'source missing' };
  }

  const sourceMeta = await sharp(sourcePath).metadata();
  const { data } = await sharp(sourcePath).raw().toBuffer({ resolveWithObject: true });
  const gutters = detectGridGutters(data, sourceMeta.width, sourceMeta.height, COLS, ROWS);
  const cropProfile = isCleanCropSource(path.basename(sourcePath)) ? 'clean' : 'titled';

  const rects = [];
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const bounds = getCellBounds(sourceMeta.width, sourceMeta.height, col, row, COLS, ROWS, gutters);
      const ep = config.episodeBase + row * COLS + col;
      const cell = getCellExtractRect(
        sourceMeta.width,
        sourceMeta.height,
        col,
        row,
        COLS,
        ROWS,
        gutters,
        ep,
        cropProfile,
      );
      rects.push({ bounds, cell, col, row, ep });
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
    .toFile(path.join(outDir, config.overlayName));

  const report = [];
  const thumbs = [];

  for (let offset = 0; offset < config.episodeCount; offset += 1) {
    const ep = config.episodeBase + offset;
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
    .toFile(path.join(outDir, config.contactSheetName));

  return {
    label: config.label,
    source: path.relative(root, sourcePath),
    dimensions: `${sourceMeta.width}x${sourceMeta.height}`,
    cropProfile,
    gutters,
    outputs: report,
    pass: report.filter((r) => r.status === 'PASS').length,
    warn: report.filter((r) => r.status === 'WARN').length,
    missing: report.filter((r) => r.status === 'MISSING').length,
    artifacts: [
      `src/assets/story-covers/sources/_crop-verify/${config.overlayName}`,
      `src/assets/story-covers/sources/_crop-verify/${config.contactSheetName}`,
    ],
  };
}

fs.mkdirSync(outDir, { recursive: true });

const results = [];
for (const config of SEASON_CONFIGS) {
  results.push(await verifySeason(config));
}

const summary = {
  outputFormat: `${OUTPUT_WIDTH}x${OUTPUT_HEIGHT}`,
  seasons: results,
  pass: results.reduce((n, r) => n + (r.pass ?? 0), 0),
  warn: results.reduce((n, r) => n + (r.warn ?? 0), 0),
  missing: results.reduce((n, r) => n + (r.missing ?? 0), 0),
};

console.log(JSON.stringify(summary, null, 2));
process.exit(summary.warn > 0 || summary.missing > 0 ? 1 : 0);
