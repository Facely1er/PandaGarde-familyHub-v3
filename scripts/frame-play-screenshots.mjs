#!/usr/bin/env node
/**
 * Composite Play Store phone screenshots inside an Android device frame.
 *
 * Input:  store-assets/play-store/phone-screenshots/*.png (1080×2400)
 * Output: store-assets/play-store/phone-screenshots-framed/*.png (1242×2688)
 *
 * Usage:
 *   npm run assets:screenshots:android:frame
 *   npm run assets:screenshots:android:build   # capture + frame
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import {
  assertFramedDimensions,
  compositeWithDeviceFrame,
  FRAMED_DEVICE_PROFILES,
} from './lib/store-device-frames.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const profile = FRAMED_DEVICE_PROFILES['pixel-7'];
const inDir = path.join(root, 'store-assets', 'play-store', 'phone-screenshots');
const outDir = path.join(root, 'store-assets', 'play-store', 'phone-screenshots-framed');

async function main() {
  if (!fs.existsSync(inDir)) {
    throw new Error(`Missing ${path.relative(root, inDir)} — run npm run assets:screenshots:android first`);
  }

  const inputs = fs
    .readdirSync(inDir)
    .filter((name) => /^\d{2}-.+\.png$/i.test(name))
    .sort();

  if (inputs.length === 0) {
    throw new Error(`No phone screenshots in ${path.relative(root, inDir)}`);
  }

  fs.mkdirSync(outDir, { recursive: true });

  console.log(
    `[frame-play] Pixel 7 frame → ${profile.outputWidth}×${profile.outputHeight}px (${inputs.length} files)`
  );

  let hadError = false;
  for (const name of inputs) {
    const capture = fs.readFileSync(path.join(inDir, name));
    const framed = await compositeWithDeviceFrame(capture, profile, sharp);
    const outPath = path.join(outDir, name);
    fs.writeFileSync(outPath, framed);

    const { ok, width, height } = await assertFramedDimensions(framed, profile, sharp);
    console.log(`  ${ok ? '✓' : '✗'} ${path.relative(root, outPath)} (${width}×${height})`);
    if (!ok) {
      hadError = true;
    }
  }

  if (hadError) {
    throw new Error('One or more framed screenshots failed dimension verification');
  }

  console.log(`\n[frame-play] Done. Upload PNGs from ${path.relative(root, outDir)}/`);
}

main().catch((error) => {
  console.error('[frame-play] Failed:', error.message);
  process.exit(1);
});
