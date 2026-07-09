#!/usr/bin/env node
/**
 * Replace oversized iOS Splash.imageset PNGs (often 8MB+ each) with compressed assets.
 * Huge splash files make Xcode appear to freeze on "Compile Asset Catalog".
 *
 * Usage: node scripts/optimize-ios-splash.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const splashDir = path.join(root, 'ios', 'App', 'App', 'Assets.xcassets', 'Splash.imageset');

const SPLASH_SOURCES = [
  path.join(root, 'assets', 'splash.png'),
  path.join(root, 'assets', 'icon.png'),
  path.join(root, 'public', 'LogoPandagarde.png'),
];

const LIGHT_BG = '#f0fdfa';
const DARK_BG = '#134e4a';

/** Matches LaunchScreen.storyboard reference size; avoid 2732px sources. */
const SIZES = [
  { name: 'Default@1x~universal~anyany.png', edge: 512, darkName: 'Default@1x~universal~anyany-dark.png' },
  { name: 'Default@2x~universal~anyany.png', edge: 1024, darkName: 'Default@2x~universal~anyany-dark.png' },
  { name: 'Default@3x~universal~anyany.png', edge: 1366, darkName: 'Default@3x~universal~anyany-dark.png' },
];

function resolveSplashSource() {
  for (const candidate of SPLASH_SOURCES) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  throw new Error('No splash source found (assets/splash.png or assets/icon.png).');
}

async function renderSplash(outPath, edge, background, logoSource) {
  const logoEdge = Math.round(edge * 0.38);
  const logo = await sharp(logoSource)
    .resize(logoEdge, logoEdge, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: edge,
      height: edge,
      channels: 4,
      background,
    },
  })
    .composite([{ input: logo, gravity: 'center' }])
    .png({ compressionLevel: 9, quality: 82 })
    .toFile(outPath);
}

async function main() {
  if (!fs.existsSync(splashDir)) {
    console.log('[optimize-ios-splash] Splash.imageset not found — skipping.');
    return;
  }

  const logoSource = resolveSplashSource();
  console.log(`[optimize-ios-splash] Generating compressed splash PNGs from ${path.relative(root, logoSource)}…`);

  for (const { name, edge, darkName } of SIZES) {
    await renderSplash(path.join(splashDir, name), edge, LIGHT_BG, logoSource);
    await renderSplash(path.join(splashDir, darkName), edge, DARK_BG, logoSource);
  }

  const totalKb = Math.round(
    fs.readdirSync(splashDir)
      .filter((f) => f.endsWith('.png'))
      .reduce((sum, f) => sum + fs.statSync(path.join(splashDir, f)).size, 0) / 1024
  );
  console.log(`[optimize-ios-splash] Done — Splash.imageset total ~${totalKb} KB (was ~24 MB).`);
}

main().catch((error) => {
  console.error('[optimize-ios-splash] Failed:', error.message);
  process.exit(1);
});
