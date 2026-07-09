#!/usr/bin/env node
/**
 * Capture App Store screenshots — full-bleed app UI at exact Apple dimensions.
 *
 * Output:
 *   store-assets/app-store/iphone-6.5/*.png  (1284×2778)
 *   store-assets/app-store/ipad-13/*.png     (2064×2752)
 *
 * These are edge-to-edge app screenshots (what Apple expects), not marketing
 * mockups with outer device bezels.
 *
 * Usage:
 *   npm run assets:screenshots
 *   npm run assets:screenshots -- --build
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import {
  assertExactDimensions,
  captureStyleSheet,
  DEVICE_PROFILES,
  normalizeScreenshot,
} from './lib/store-device-frames.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.HUB_SCREENSHOT_PORT ?? 4174);
const BASE = `http://127.0.0.1:${PORT}`;
const OUT_ROOT = path.join(root, 'store-assets', 'app-store');

const DEVICES = [DEVICE_PROFILES['iphone-6.5'], DEVICE_PROFILES['ipad-13']];

const SCREENS = [
  {
    file: '01-login',
    path: '/',
    auth: false,
    welcomed: false,
    waitFor: /Let's go!/i,
  },
  {
    file: '02-dashboard',
    path: '/dashboard',
    auth: true,
    welcomed: true,
    waitFor: /Today's mission|Browse missions|Family Hub/i,
  },
  {
    file: '03-activities',
    path: '/activities',
    auth: true,
    welcomed: true,
    waitFor: /All missions|Real-life situation/i,
  },
  {
    file: '04-mission-intro',
    path: '/activities',
    auth: true,
    welcomed: true,
    missionIntro: 'Pack Your Digital Backpack',
    waitFor: /Real-life scenario|Family prompt/i,
  },
  {
    file: '05-journey',
    path: '/journey',
    auth: true,
    welcomed: true,
    waitFor: /Mission progress|Family rewards/i,
  },
  {
    file: '06-kids',
    path: '/kids',
    auth: true,
    welcomed: true,
    waitFor: /Family members|Maya|Jordan/i,
  },
  {
    file: '07-settings',
    path: '/settings',
    auth: true,
    welcomed: true,
    waitFor: /Settings|Privacy Policy|Help & Support/i,
  },
];

const SAMPLE_FAMILY = [
  {
    id: 1,
    name: 'Maya',
    age: 9,
    role: 'child',
    privacyScore: 72,
    completedActivities: 3,
    badges: ['first_mission'],
    lastActive: '2026-07-01T12:00:00.000Z',
  },
  {
    id: 2,
    name: 'Jordan',
    age: 14,
    role: 'teen',
    privacyScore: 68,
    completedActivities: 2,
    badges: [],
    lastActive: '2026-07-02T12:00:00.000Z',
  },
];

const SAMPLE_PROGRESS = {
  completedActivities: ['pack-digital-backpack', 'password-treasure-hunt', 'traffic-light-safety'],
  activityDetails: {
    'pack-digital-backpack': {
      activityId: 'pack-digital-backpack',
      completed: true,
      score: 92,
      completedAt: '2026-07-01T10:00:00.000Z',
    },
    'password-treasure-hunt': {
      activityId: 'password-treasure-hunt',
      completed: true,
      score: 88,
      completedAt: '2026-07-02T10:00:00.000Z',
    },
    'traffic-light-safety': {
      activityId: 'traffic-light-safety',
      completed: true,
      score: 95,
      completedAt: '2026-07-03T10:00:00.000Z',
    },
  },
  totalTimeSpent: 36,
  achievements: ['first_activity'],
  lastUpdated: '2026-07-08T10:00:00.000Z',
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(url, timeoutMs = 120_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
          res.resume();
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 500) {
            resolve(undefined);
          } else {
            reject(new Error(`HTTP ${res.statusCode}`));
          }
        });
        req.on('error', reject);
      });
      return;
    } catch {
      await sleep(500);
    }
  }
  throw new Error(`Preview server did not start at ${url}`);
}

function runCommand(command, args, label) {
  return new Promise((resolve, reject) => {
    console.log(`[assets:screenshots] ${label}…`);
    const child = spawn(command, args, { cwd: root, stdio: 'inherit', shell: process.platform === 'win32' });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve(undefined);
      } else {
        reject(new Error(`${label} failed with exit code ${code}`));
      }
    });
  });
}

function startPreview() {
  return spawn(
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
      String(PORT),
    ],
    { cwd: root, stdio: 'pipe', shell: process.platform === 'win32' }
  );
}

function baseStorage(auth, welcomed) {
  return {
    'pandagarde-theme': 'light',
    'pandagarde-language': 'en',
    'pandagarde_local_auth_v1': auth ? 'true' : 'false',
    'pandagarde_hub_welcomed': welcomed ? 'true' : 'false',
    'pandagarde_hub_origin': 'standalone',
    pandagarde_hub_tour_done: 'true',
    pandagarde_hub_welcome_dismissed: 'true',
    pandagarde_hub_mission_hint_dismissed: 'true',
  };
}

function seedStorage(auth, welcomed) {
  const entries = baseStorage(auth, welcomed);
  if (auth) {
    entries['pandagarde_family'] = JSON.stringify(SAMPLE_FAMILY);
    entries['pandagarde_progress'] = JSON.stringify(SAMPLE_PROGRESS);
  }
  return entries;
}

async function preparePage(page, profile) {
  await page.addStyleTag({ content: captureStyleSheet(profile) });
  await page.evaluate(({ safeTop, safeBottom, platformClass }) => {
    const root = document.documentElement;
    root.classList.add('store-capture', 'capacitor', ...platformClass.split(/\s+/));
    root.style.setProperty('--hub-safe-top', `${safeTop}px`);
    root.style.setProperty('--hub-nav-safe-bottom', `${safeBottom}px`);
    root.style.setProperty('--hub-safe-left', '0px');
    root.style.setProperty('--hub-safe-right', '0px');
    root.style.setProperty('--hub-chrome-top-trim', '10px');
    root.style.setProperty('--hub-nav-bottom-trim', '6px');
    root.style.setProperty('--hub-content-pt', '0.625rem');
  }, {
    safeTop: profile.safeTop,
    safeBottom: profile.safeBottom,
    platformClass: profile.platformClass,
  });
}

async function dismissOverlays(page) {
  const skipTour = page.getByRole('button', { name: /skip tour/i });
  if (await skipTour.isVisible().catch(() => false)) {
    await skipTour.click();
    await page.waitForTimeout(250);
  }
}

async function captureScreenBuffer(page, screen, profile) {
  await page.goto(`${BASE}${screen.path}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await preparePage(page, profile);
  await dismissOverlays(page);

  if (screen.missionIntro) {
    const card = page.getByRole('button', { name: new RegExp(screen.missionIntro, 'i') }).first();
    await card.waitFor({ state: 'visible', timeout: 15_000 });
    await card.click();
    await page.waitForTimeout(600);
    await preparePage(page, profile);
  }

  if (screen.waitFor) {
    await page.getByText(screen.waitFor).first().waitFor({ state: 'visible', timeout: 15_000 });
  }

  if (screen.file === '01-login') {
    await page.getByRole('button', { name: /Let's go!/i }).scrollIntoViewIfNeeded();
  } else {
    await page.evaluate(() => {
      const main = document.getElementById('family-hub-main');
      if (main) {
        main.scrollTop = 0;
      }
      window.scrollTo(0, 0);
    });
  }

  await page.waitForTimeout(300);
  return page.screenshot({ fullPage: false, animations: 'disabled', type: 'png' });
}

async function main() {
  const shouldBuild = process.argv.includes('--build') || !fs.existsSync(path.join(root, 'dist-familyhub', 'index.html'));

  if (shouldBuild) {
    await runCommand('npm', ['run', 'build:familyhub'], 'Building Family Hub bundle');
  }

  console.log(`[assets:screenshots] Starting preview on ${BASE}`);
  console.log('[assets:screenshots] Mode: full-bleed app UI (exact App Store dimensions)');
  const preview = startPreview();

  try {
    await waitForServer(`${BASE}/`);
    const browser = await chromium.launch({ headless: true });
    let hadError = false;

    for (const device of DEVICES) {
      const deviceDir = path.join(OUT_ROOT, device.slug);
      fs.mkdirSync(deviceDir, { recursive: true });

      console.log(
        `\n[assets:screenshots] ${device.label} — ${device.viewportWidth}×${device.viewportHeight} @${device.deviceScaleFactor}x → ${device.width}×${device.height}px`
      );

      const context = await browser.newContext({
        viewport: { width: device.viewportWidth, height: device.viewportHeight },
        deviceScaleFactor: device.deviceScaleFactor,
        colorScheme: 'light',
        locale: 'en-US',
        isMobile: device.slug === 'iphone-6.5',
        hasTouch: true,
      });

      for (const screen of SCREENS) {
        const page = await context.newPage();
        await page.addInitScript((entries) => {
          localStorage.clear();
          for (const [key, value] of Object.entries(entries)) {
            localStorage.setItem(key, value);
          }
        }, seedStorage(screen.auth, screen.welcomed));

        const captureBuffer = await captureScreenBuffer(page, screen, device);
        await page.close();

        const finalBuffer = await normalizeScreenshot(captureBuffer, device, sharp);
        const outFile = path.join(deviceDir, `${screen.file}.png`);
        await fs.promises.writeFile(outFile, finalBuffer);

        const { ok, width, height } = await assertExactDimensions(finalBuffer, device, sharp);
        console.log(`  ${ok ? '✓' : '✗'} ${path.relative(root, outFile)} (${width}×${height})`);
        if (!ok) {
          hadError = true;
        }
      }

      await context.close();
    }

    await browser.close();

    if (hadError) {
      throw new Error('One or more screenshots failed dimension verification');
    }

    console.log('\n[assets:screenshots] Done.');
    console.log(`Upload PNGs from ${path.relative(root, OUT_ROOT)}/{iphone-6.5|ipad-13}/`);
  } finally {
    preview.kill('SIGTERM');
  }
}

main().catch((error) => {
  console.error('[assets:screenshots] Failed:', error.message);
  process.exit(1);
});
