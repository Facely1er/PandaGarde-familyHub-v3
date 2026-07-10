/**
 * Records an App Review walkthrough video from the Family Hub production build.
 *
 * Prereq: npm run build:familyhub && npx playwright install chromium
 * Run: npm run app-review:record:web
 *
 * The app auto-tours when ?appReviewDemo=1 (login → mission → family → clear data).
 * Output: store-assets/app-review/app-review-recording.mp4 (+ .mov copy)
 *
 * On Mac with Xcode: npm run app-review:record (iOS Simulator, preferred for Apple).
 */
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, unlinkSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import {
  IPHONE_67,
  phonePlaywrightContextOptions,
  phoneVideoExportFilter,
  previewBase,
  waitForServer,
} from './lib/app-review-capture-shared.mjs';

/** Keep in sync with APP_REVIEW_RECORD_MS in src/lib/appReviewDemo.ts */
const APP_REVIEW_RECORD_MS = 75_000;
const APP_REVIEW_TOUR_DONE_FALLBACK_MS = 75_000;

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'store-assets', 'app-review');
const captureDir = join(outDir, 'capture');
const port = Number(process.env.APP_REVIEW_PORT ?? 4174);
const baseUrl = `${previewBase(port)}/?appReviewDemo=1`;
const durationMs = Number(process.env.APP_REVIEW_RECORD_MS ?? APP_REVIEW_RECORD_MS);

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { stdio: 'inherit', cwd: root, ...opts });
  if ((r.status ?? 1) !== 0) {
    process.exit(r.status ?? 1);
  }
}

async function frameBrightnessFromVideo(mp4Path, atSec) {
  const tmp = join(captureDir, 'probe-frame.png');
  spawnSync(process.env.FFMPEG ?? 'ffmpeg', ['-y', '-ss', String(atSec), '-i', mp4Path, '-frames:v', '1', tmp]);
  if (!existsSync(tmp)) {
    return 0;
  }
  const { data, info } = await sharp(tmp).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels ?? 3;
  let sum = 0;
  for (let i = 0; i < data.length; i += ch) {
    sum += (data[i] + data[i + 1] + data[i + 2]) / 3;
  }
  return sum / (data.length / ch);
}

function exportVideo(webmPath, outPath) {
  const ffmpegBin = process.env.FFMPEG ?? 'ffmpeg';
  return spawnSync(
    ffmpegBin,
    [
      '-y',
      '-i',
      webmPath,
      '-vf',
      phoneVideoExportFilter(),
      '-c:v',
      'libx264',
      '-profile:v',
      'high',
      '-pix_fmt',
      'yuv420p',
      '-crf',
      '20',
      '-movflags',
      '+faststart',
      '-color_primaries',
      'bt709',
      '-color_trc',
      'bt709',
      '-colorspace',
      'bt709',
      outPath,
    ],
    { encoding: 'utf8' }
  );
}

function launchOptions(headless) {
  const opts = { headless };
  if (process.platform === 'darwin' && process.env.APP_REVIEW_NO_CHROME !== '1') {
    opts.channel = 'chrome';
  }
  return opts;
}

function assertReviewBuildBundle() {
  const assetDirs = [
    join(root, 'dist-familyhub', 'assets'),
    join(root, 'dist-familyhub', 'js'),
  ];
  let bundleFile = null;
  let bundleText = '';
  for (const dir of assetDirs) {
    if (!existsSync(dir)) {
      continue;
    }
    const files = readdirSync(dir).filter((f) => /^index-.*\.js$/.test(f));
    if (files.length === 0) {
      continue;
    }
    const bundle = files.sort(
      (a, b) => statSync(join(dir, b)).size - statSync(join(dir, a)).size
    )[0];
    bundleFile = join(dir, bundle);
    bundleText = readFileSync(bundleFile, 'utf8');
    break;
  }
  if (!bundleFile) {
    throw new Error('Missing dist-familyhub js bundle after build');
  }
  if (
    !bundleText.includes('appReviewDemo') &&
    !bundleText.includes('pg-app-review-start-mission') &&
    !bundleText.includes("Let's go!")
  ) {
    throw new Error(`Build missing App Review demo tour in ${bundleFile}. Re-run with VITE_APP_REVIEW_DEMO=true.`);
  }
  console.log(`[app-review:record] Review bundle: ${bundleFile.replace(root + '\\', '').replace(root + '/', '')}`);
}

async function recordOnce(headless) {
  const { chromium } = await import('playwright');
  mkdirSync(captureDir, { recursive: true });
  for (const f of readdirSync(captureDir).filter((n) => n.endsWith('.webm'))) {
    unlinkSync(join(captureDir, f));
  }

  const browser = await chromium.launch(launchOptions(headless));
  const context = await browser.newContext(
    phonePlaywrightContextOptions({
      recordVideo: {
        dir: captureDir,
        size: { width: IPHONE_67.viewportW, height: IPHONE_67.viewportH },
      },
    })
  );

  const page = await context.newPage();
  page.setDefaultTimeout(120_000);
  await page.addInitScript(() => {
    document.documentElement.dataset.appReviewCapture = '1';
    localStorage.setItem('pandagarde_local_auth_v1', 'false');
    localStorage.removeItem('pandagarde_hub_welcomed');
  });

  console.log(
    `[app-review:record] Recording until tour completes (max ${durationMs / 1000}s) @ ${IPHONE_67.viewportW}×${IPHONE_67.viewportH} (${headless ? 'headless' : 'headed'})\n${baseUrl}\n`
  );
  await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 90_000 });
  await page.waitForFunction(
    () => {
      const view = document.documentElement.dataset.appReviewView;
      return view === 'login' || view === 'welcome' || view === 'dashboard';
    },
    { timeout: 90_000 }
  );
  console.log('[app-review:record] App visible — auto-tour recording…\n');
  await page.waitForFunction(
    () => document.documentElement.dataset.appReviewTourDone === '1',
    { timeout: APP_REVIEW_TOUR_DONE_FALLBACK_MS }
  );
  await page.waitForTimeout(1500);

  const errorText = await page.evaluate(() => {
    const text = document.body?.innerText ?? '';
    const tourError = document.documentElement.dataset.appReviewTourError ?? '';
    const tourFailed = document.documentElement.dataset.appReviewTourFailed === '1';
    if (/Navigation error|Something went wrong|Page update needed/i.test(text)) {
      return text.slice(0, 200);
    }
    if (tourFailed) {
      return `Tour failed: ${tourError || 'unknown step'}`;
    }
    if (/mission complete/i.test(text) && /back to activities|continue to next mission/i.test(text)) {
      return 'Recording ended on mission celebration modal (tour did not dismiss)';
    }
    return tourError ? `Tour error: ${tourError}` : '';
  });
  if (errorText) {
    throw new Error(`Tour ended on error screen: ${errorText}`);
  }

  const video = page.video();
  await context.close();
  await browser.close();

  if (!video) {
    throw new Error('No video handle from Playwright');
  }
  const webmPath = await video.path();
  if (!existsSync(webmPath)) {
    throw new Error(`Missing webm: ${webmPath}`);
  }
  return webmPath;
}

async function recordWithPlaywright() {
  const mp4Path = join(outDir, 'app-review-recording.mp4');
  let webmPath;

  const tryHeadless = process.env.APP_REVIEW_HEADED === '0' || process.platform !== 'darwin';
  for (const headless of tryHeadless ? [true, false] : [false, true]) {
    try {
      webmPath = await recordOnce(headless);
      const probe = exportVideo(webmPath, join(captureDir, 'probe.mp4'));
      if (probe.status !== 0) {
        throw new Error(probe.stderr || 'ffmpeg probe failed');
      }
      const bright = await frameBrightnessFromVideo(join(captureDir, 'probe.mp4'), 5);
      console.log(`\n[app-review:record] Brightness @ 5s: ${bright.toFixed(0)} (want >100)`);
      if (bright < 80) {
        console.warn(`[app-review:record] Recording looks blank (${bright.toFixed(0)}) — ${headless ? 'retrying headed' : 'failed'}`);
        if (!headless) {
          throw new Error('Video still blank after headed capture');
        }
        continue;
      }
      break;
    } catch (err) {
      if (headless && !tryHeadless) {
        continue;
      }
      throw err;
    }
  }

  const ffmpeg = exportVideo(webmPath, mp4Path);
  if (ffmpeg.status !== 0) {
    throw new Error(ffmpeg.stderr || 'ffmpeg export failed');
  }

  const movPath = join(outDir, 'app-review-recording.mov');
  spawnSync(process.env.FFMPEG ?? 'ffmpeg', ['-y', '-i', mp4Path, '-c', 'copy', movPath], {
    stdio: 'inherit',
  });

  const dur = spawnSync(
    process.env.FFPROBE ?? 'ffprobe',
    ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', mp4Path],
    { encoding: 'utf8' }
  );
  console.log(
    `\n[app-review:record] ✓ ${mp4Path} (${IPHONE_67.exportW}×${IPHONE_67.exportH}, ${Math.round(statSync(mp4Path).size / 1024)} KB, ${Number(dur.stdout).toFixed(1)}s)`
  );
  if (existsSync(movPath)) {
    console.log(`[app-review:record] ✓ ${movPath}`);
  }
  return mp4Path;
}

async function main() {
  const buildEnv = { ...process.env, VITE_APP_REVIEW_DEMO: 'true', VITE_HUB_STANDALONE: 'true' };
  if (!existsSync(join(root, 'dist-familyhub', 'index.html')) || process.env.APP_REVIEW_FORCE_BUILD === '1') {
    console.log('[app-review:record] Building Family Hub (App Review demo mode)…\n');
    run('npm', ['run', 'build:familyhub'], { env: buildEnv });
  }
  assertReviewBuildBundle();

  mkdirSync(outDir, { recursive: true });

  const preview = spawn(
    'npx',
    [
      'vite',
      'preview',
      '--config',
      'vite.familyhub.config.ts',
      '--outDir',
      'dist-familyhub',
      '--host',
      '127.0.0.1',
      '--port',
      String(port),
    ],
    { cwd: root, shell: true, stdio: 'pipe' }
  );

  try {
    await waitForServer(`${previewBase(port)}/`);
    await recordWithPlaywright();
  } finally {
    preview.kill('SIGTERM');
  }

  console.log('\n[app-review:record] Upload store-assets/app-review/app-review-recording.mp4 to App Store Connect → App Review.');
  console.log('[app-review:record] On Mac, prefer: npm run app-review:record (iOS Simulator native capture).');
}

main().catch((err) => {
  console.error('[app-review:record] Failed:', err.message ?? err);
  process.exit(1);
});
