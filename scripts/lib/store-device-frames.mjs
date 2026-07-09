/**
 * App Store screenshot device specs (portrait, full-bleed).
 *
 * Capture at native logical viewport × deviceScaleFactor = exact pixel output.
 * - iPhone 6.5": 428×926 @3x → 1284×2778
 * - iPad 13": 1032×1376 @2x → 2064×2752
 */

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
