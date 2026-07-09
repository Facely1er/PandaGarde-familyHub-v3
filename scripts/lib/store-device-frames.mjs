/**
 * App Store device profiles + frame compositing (exact output dimensions).
 *
 * Apple accepts these portrait sizes:
 * - iPhone 6.5" Display: 1284×2778
 * - iPad 13" Display: 2064×2752
 */

/** Inner screen capture rect (app pixels) — placed inside the device bezel on the canvas. */
export const DEVICE_PROFILES = {
  'iphone-6.5': {
    slug: 'iphone-6.5',
    label: 'iPhone 6.5"',
    outputWidth: 1284,
    outputHeight: 2778,
    captureWidth: 1152,
    captureHeight: 2496,
    screen: { x: 66, y: 111, width: 1152, height: 2496, radius: 44 },
    safeArea: { top: 54, bottom: 32 },
    type: 'iphone',
  },
  'ipad-13': {
    slug: 'ipad-13',
    label: 'iPad 13"',
    outputWidth: 2064,
    outputHeight: 2752,
    captureWidth: 1840,
    captureHeight: 2528,
    screen: { x: 112, y: 112, width: 1840, height: 2528, radius: 28 },
    safeArea: { top: 24, bottom: 20 },
    type: 'ipad',
  },
};

/**
 * Rounded-corner mask PNG for the screen capture.
 */
async function roundedMask(width, height, radius, sharp) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect width="${width}" height="${height}" rx="${radius}" ry="${radius}" fill="white"/>
  </svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

/**
 * Device bezel + marketing background SVG (exact output canvas size).
 */
function frameSvg(profile) {
  const { outputWidth, outputHeight, screen, type } = profile;
  const bodyX = screen.x - 14;
  const bodyY = screen.y - 14;
  const bodyW = screen.width + 28;
  const bodyH = screen.height + 28;
  const bodyRadius = screen.radius + 10;
  const island =
    type === 'iphone'
      ? `<rect x="${screen.x + screen.width / 2 - 62}" y="${screen.y + 10}" width="124" height="36" rx="18" fill="#0a0a0a"/>`
      : '';
  const camera =
    type === 'ipad'
      ? `<circle cx="${screen.x + screen.width / 2}" cy="${bodyY + 8}" r="5" fill="#2d2d2d"/>`
      : '';

  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${outputWidth}" height="${outputHeight}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ecfdf5"/>
      <stop offset="55%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#ccfbf1"/>
    </linearGradient>
    <filter id="deviceShadow" x="-20%" y="-10%" width="140%" height="130%">
      <feDropShadow dx="0" dy="28" stdDeviation="32" flood-color="#0f766e" flood-opacity="0.18"/>
    </filter>
  </defs>
  <rect width="${outputWidth}" height="${outputHeight}" fill="url(#bg)"/>
  <rect x="${bodyX}" y="${bodyY}" width="${bodyW}" height="${bodyH}" rx="${bodyRadius}" fill="#111827" filter="url(#deviceShadow)"/>
  <rect x="${screen.x - 2}" y="${screen.y - 2}" width="${screen.width + 4}" height="${screen.height + 4}" rx="${screen.radius + 2}" fill="#030712"/>
  ${camera}
  ${island}
</svg>`);
}

/**
 * Composite a raw app capture into the device frame at exact App Store dimensions.
 */
export async function compositeWithDeviceFrame(captureBuffer, profile, sharp) {
  const { screen, outputWidth, outputHeight, captureWidth, captureHeight } = profile;

  const resizedCapture = await sharp(captureBuffer)
    .resize(captureWidth, captureHeight, { fit: 'cover', position: 'top' })
    .png()
    .toBuffer();

  const mask = await roundedMask(captureWidth, captureHeight, screen.radius, sharp);
  const clippedScreen = await sharp(resizedCapture)
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  const frame = frameSvg(profile);

  const output = await sharp(frame)
    .composite([{ input: clippedScreen, left: screen.x, top: screen.y }])
    .png()
    .toBuffer();

  const meta = await sharp(output).metadata();
  if (meta.width !== outputWidth || meta.height !== outputHeight) {
    return sharp(output)
      .resize(outputWidth, outputHeight, { fit: 'fill' })
      .png()
      .toBuffer();
  }

  return output;
}

/**
 * Full-bleed capture normalized to exact store dimensions (no outer bezel).
 */
export async function normalizeFullBleed(captureBuffer, profile, sharp) {
  return sharp(captureBuffer)
    .resize(profile.outputWidth, profile.outputHeight, { fit: 'cover', position: 'top' })
    .png()
    .toBuffer();
}

export async function assertExactDimensions(buffer, profile, sharp) {
  const meta = await sharp(buffer).metadata();
  const ok = meta.width === profile.outputWidth && meta.height === profile.outputHeight;
  return { ok, width: meta.width ?? 0, height: meta.height ?? 0 };
}
