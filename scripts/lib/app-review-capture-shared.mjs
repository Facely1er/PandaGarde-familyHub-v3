/**
 * Shared helpers for Family Hub App Review recordings and store captures.
 */

export const PREVIEW_PORT = 4174;

/** App Store 6.7" iPhone — logical viewport × scale = export pixels. */
export const IPHONE_67 = {
  viewportW: 428,
  viewportH: 926,
  scale: 3,
  exportW: 1284,
  exportH: 2778,
};

export const IPHONE_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';

/** Playwright context tuned for native phone layout. */
export function phonePlaywrightContextOptions(overrides = {}) {
  return {
    viewport: { width: IPHONE_67.viewportW, height: IPHONE_67.viewportH },
    screen: { width: IPHONE_67.viewportW, height: IPHONE_67.viewportH },
    deviceScaleFactor: IPHONE_67.scale,
    isMobile: true,
    hasTouch: true,
    userAgent: IPHONE_UA,
    colorScheme: 'light',
    locale: 'en-US',
    ...overrides,
  };
}

/** ffmpeg scale to phone store size. */
export function phoneVideoExportFilter(exportW = IPHONE_67.exportW, exportH = IPHONE_67.exportH) {
  return [
    'trim=start=0.3',
    'setpts=PTS-STARTPTS',
    `scale=${exportW}:${exportH}:flags=lanczos`,
    'format=yuv420p',
  ].join(',');
}

/** High-quality simctl .mov → App Store MP4 (matches Playwright export polish). */
export function simulatorMovToMp4FfmpegArgs(movPath, mp4Path, exportW = IPHONE_67.exportW, exportH = IPHONE_67.exportH) {
  return [
    '-y',
    '-i',
    movPath,
    '-vf',
    phoneVideoExportFilter(exportW, exportH),
    '-c:v',
    'libx264',
    '-profile:v',
    'high',
    '-pix_fmt',
    'yuv420p',
    '-crf',
    '18',
    '-movflags',
    '+faststart',
    '-color_primaries',
    'bt709',
    '-color_trc',
    'bt709',
    '-colorspace',
    'bt709',
    '-an',
    mp4Path,
  ];
}

export function previewBase(port = PREVIEW_PORT) {
  return `http://127.0.0.1:${port}`;
}

export async function waitForServer(url, timeoutMs = 120_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        return;
      }
    } catch {
      // retry
    }
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  throw new Error(`Server not ready at ${url}`);
}
