#!/usr/bin/env node
/**
 * Generate PWA manifest icons (192 + 512) from assets/icon.png.
 * Output: public/icons/pwa-icon-192.png, public/icons/pwa-icon-512.png
 *
 * Usage: npm run assets:pwa
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'public', 'icons');
const iconSrc = path.join(root, 'assets', 'icon.png');

const BRAND_BG = '#f0fdfa';

const SIZES = [
  { size: 192, name: 'pwa-icon-192.png' },
  { size: 512, name: 'pwa-icon-512.png' },
];

async function renderIcon(size) {
  const iconScale = Math.round(size * 0.82);
  const iconBuffer = await sharp(iconSrc)
    .resize(iconScale, iconScale, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: BRAND_BG,
    },
  })
    .composite([{ input: iconBuffer, gravity: 'centre' }])
    .flatten({ background: BRAND_BG })
    .removeAlpha()
    .png();
}

async function main() {
  if (!fs.existsSync(iconSrc)) {
    console.error('[assets:pwa] Missing assets/icon.png');
    process.exit(1);
  }

  fs.mkdirSync(outDir, { recursive: true });

  for (const { size, name } of SIZES) {
    const dest = path.join(outDir, name);
    const pipeline = await renderIcon(size);
    await pipeline.toFile(dest);
    console.log(`[assets:pwa] Wrote ${path.relative(root, dest)} (${size}×${size})`);
  }
}

main().catch((error) => {
  console.error('[assets:pwa] Failed:', error);
  process.exit(1);
});
