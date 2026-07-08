#!/usr/bin/env node
/**
 * Generate Play Store + App Store marketing assets from assets/icon.png.
 *
 * Output: store-assets/
 *   play-store-icon-512.png
 *   apple-app-store-icon-1024.png
 *   play-feature-graphic-1024x500.png
 *
 * Usage: npm run assets:store
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'store-assets');

const ICON_CANDIDATES = [
  path.join(root, 'assets', 'icon.png'),
  path.join(root, 'android', 'app', 'src', 'main', 'res', 'mipmap-xxxhdpi', 'ic_launcher.png'),
];

const BRAND_BG = '#f0fdfa';
const BRAND_TEAL = '#0f766e';
const BRAND_TEAL_MID = '#115e59';
const BRAND_TEAL_DARK = '#134e4a';

function resolveIconSource() {
  for (const candidate of ICON_CANDIDATES) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  throw new Error('No icon source found. Add assets/icon.png first.');
}

async function iconOnSquare(size, iconScale) {
  const iconSrc = resolveIconSource();
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
    .png();
}

function playFeatureGraphic() {
  const iconSrc = resolveIconSource();
  const logoSize = 340;
  return sharp(iconSrc)
    .resize(logoSize, logoSize, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer()
    .then((logo) => {
      const textLayer = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="500">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${BRAND_BG}"/>
      <stop offset="100%" stop-color="#99f6e4"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="500" fill="url(#bg)"/>
  <text x="400" y="185" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="46" font-weight="700" fill="${BRAND_TEAL}">PandaGarde Family Hub</text>
  <text x="400" y="250" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="28" fill="${BRAND_TEAL_MID}">18 privacy missions · Ages 5–17</text>
  <text x="400" y="305" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="22" fill="${BRAND_TEAL_DARK}">Practice together · On your device only</text>
</svg>`);

      return sharp(textLayer).composite([{ input: logo, left: 36, top: 80 }]).png();
    });
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });

  const playIcon = path.join(outDir, 'play-store-icon-512.png');
  const appleIcon = path.join(outDir, 'apple-app-store-icon-1024.png');
  const feature = path.join(outDir, 'play-feature-graphic-1024x500.png');

  await iconOnSquare(512, 440).then((img) => img.toFile(playIcon));
  await iconOnSquare(1024, 880).then((img) => img.toFile(appleIcon));
  await playFeatureGraphic().then((img) => img.toFile(feature));

  const meta = await Promise.all([
    sharp(playIcon).metadata(),
    sharp(appleIcon).metadata(),
    sharp(feature).metadata(),
  ]);

  console.log('[assets:store] Generated store marketing assets:');
  console.log(`  ${path.relative(root, playIcon)} (${meta[0].width}×${meta[0].height})`);
  console.log(`  ${path.relative(root, appleIcon)} (${meta[1].width}×${meta[1].height})`);
  console.log(`  ${path.relative(root, feature)} (${meta[2].width}×${meta[2].height})`);
  console.log('');
  console.log('Upload play-store-icon-512.png + play-feature-graphic-1024x500.png to Google Play.');
  console.log('Upload apple-app-store-icon-1024.png in App Store Connect (or use Xcode asset catalog).');
}

main().catch((error) => {
  console.error('[assets:store] Failed:', error.message);
  process.exit(1);
});
