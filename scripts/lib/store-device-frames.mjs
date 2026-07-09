/**
 * App Store screenshot device specs.
 *
 * - FRAMED_DEVICE_PROFILES: simulator captures composited inside a device bezel
 * - DEVICE_PROFILES: Playwright full-bleed capture (browser preview)
 */

/** Device bezel + marketing background (exact App Store canvas size). */
export const FRAMED_DEVICE_PROFILES = {
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

async function roundedMask(width, height, radius, sharp) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect width="${width}" height="${height}" rx="${radius}" ry="${radius}" fill="white"/>
  </svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

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

/** Composite a raw simulator capture into the device frame at exact App Store dimensions. */
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

export async function assertFramedDimensions(buffer, profile, sharp) {
  const meta = await sharp(buffer).metadata();
  const ok = meta.width === profile.outputWidth && meta.height === profile.outputHeight;
  return { ok, width: meta.width ?? 0, height: meta.height ?? 0 };
}

/** Playwright full-bleed capture at native logical viewport × deviceScaleFactor. */
export const DEVICE_PROFILES = {
  'iphone-6.5': {
    slug: 'iphone-6.5',
    label: 'iPhone 6.5"',
    viewportWidth: 428,
    viewportHeight: 926,
    deviceScaleFactor: 3,
    width: 1284,
    height: 2778,
    safeTop: 47,
    safeBottom: 34,
    platformClass: 'platform-ios',
  },
  'ipad-13': {
    slug: 'ipad-13',
    label: 'iPad 13"',
    viewportWidth: 1032,
    viewportHeight: 1376,
    deviceScaleFactor: 2,
    width: 2064,
    height: 2752,
    safeTop: 24,
    safeBottom: 20,
    platformClass: 'platform-ios platform-ipad',
  },
  'pixel-7': {
    slug: 'pixel-7',
    label: 'Pixel 7 (Play phone)',
    viewportWidth: 360,
    viewportHeight: 800,
    deviceScaleFactor: 3,
    width: 1080,
    height: 2400,
    safeTop: 24,
    safeBottom: 20,
    platformClass: 'platform-android',
  },
};

export async function assertExactDimensions(buffer, profile, sharp) {
  const meta = await sharp(buffer).metadata();
  const ok = meta.width === profile.width && meta.height === profile.height;
  return { ok, width: meta.width ?? 0, height: meta.height ?? 0 };
}

export async function normalizeScreenshot(buffer, profile, sharp) {
  const meta = await sharp(buffer).metadata();
  if (meta.width === profile.width && meta.height === profile.height) {
    return buffer;
  }
  return sharp(buffer)
    .resize(profile.width, profile.height, { fit: 'cover', position: 'top' })
    .png()
    .toBuffer();
}

/** CSS injected during capture — mirrors Capacitor native shell + store polish. */
export function captureStyleSheet(profile) {
  const isIpad = profile.slug === 'ipad-13';
  return `
html.store-capture,
html.store-capture body {
  height: 100%;
  overflow: hidden;
  margin: 0;
  background: #f9fafb;
}
html.store-capture #root {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
html.store-capture .family-hub-theme,
html.store-capture .hub-app-shell {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
html.store-capture #family-hub-main {
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
html.store-capture #family-hub-main > div {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
}
html.store-capture .hub-standalone-page {
  min-height: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
html.store-capture .hub-standalone-page > .flex-1.justify-center {
  justify-content: flex-start !important;
  padding-top: 1.5rem;
  padding-bottom: 1rem;
}
html.store-capture .hub-standalone-page > p.text-center {
  padding-bottom: 0.75rem !important;
}
html.store-capture .hub-welcome-landing {
  min-height: 100%;
}
${
  isIpad
    ? `
html.store-capture .hub-page-inner {
  max-width: 80rem;
  padding-inline: 2.5rem;
}
html.store-capture .hub-standalone-page .mx-auto.max-w-xl {
  max-width: 42rem;
}
`
    : ''
}
`.trim();
}
