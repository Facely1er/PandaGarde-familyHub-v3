#!/usr/bin/env node
/**
 * Capture App Store screenshots for Family Hub.
 *
 * Output (exact Apple dimensions, device contour):
 *   store-assets/app-store/iphone-6.5/*.png  (1284×2778)
 *   store-assets/app-store/ipad-13/*.png     (2064×2752)
 *
 * Raw screen captures (no bezel): store-assets/app-store/_raw/{device}/
 *
 * Usage:
 *   npm run assets:screenshots
 *   npm run assets:screenshots -- --build
 *   npm run assets:screenshots -- --no-frame   # full-bleed only
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
  compositeWithDeviceFrame,
  DEVICE_PROFILES,
  normalizeFullBleed,
} from './lib/store-device-frames.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.HUB_SCREENSHOT_PORT ?? 4174);
const BASE = `http://127.0.0.1:${PORT}`;
const OUT_ROOT = path.join(root, 'store-assets', 'app-store');
const RAW_ROOT = path.join(OUT_ROOT, '_raw');
const USE_FRAME = !process.argv.includes('--no-frame');

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
    seedFamily: true,
    waitFor: /Family members|Add a child/i,
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
  completedActivities: ['pack-digital-backpack', 'password-treasure-hunt'],
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
  },
  totalTimeSpent: 28,
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

function seedStorage(auth, welcomed, seedFamily) {
  const entries = {
    'pandagarde-theme': 'light',
    'pandagarde-language': 'en',
    'pandagarde_local_auth_v1': auth ? 'true' : 'false',
    'pandagarde_hub_welcomed': welcomed ? 'true' : 'false',
    'pandagarde_hub_origin': 'standalone',
    pandagarde_hub_tour_done: 'true',
    pandagarde_hub_welcome_dismissed: 'true',
    pandagarde_hub_mission_hint_dismissed: 'true',
  };

  if (seedFamily) {
    entries['pandagarde_family'] = JSON.stringify(SAMPLE_FAMILY);
    entries['pandagarde_progress'] = JSON.stringify(SAMPLE_PROGRESS);
  }

  return entries;
}

async function applyDeviceChrome(page, profile) {
  await page.evaluate(({ safeTop, safeBottom, deviceType }) => {
    const root = document.documentElement;
    root.classList.add('capacitor', 'platform-ios', 'store-screenshot-capture');
    root.style.setProperty('--hub-safe-top', `${safeTop}px`);
    root.style.setProperty('--hub-nav-safe-bottom', `${safeBottom}px`);
    root.style.setProperty('--hub-safe-left', '0px');
    root.style.setProperty('--hub-safe-right', '0px');

    const existing = document.getElementById('store-screenshot-status-bar');
    if (existing) {
      existing.remove();
    }

    const bar = document.createElement('div');
    bar.id = 'store-screenshot-status-bar';
    bar.setAttribute('aria-hidden', 'true');
    bar.style.cssText = [
      'position:fixed',
      'top:0',
      'left:0',
      'right:0',
      `height:${safeTop}px`,
      'z-index:99999',
      'pointer-events:none',
      'display:flex',
      'align-items:flex-end',
      'justify-content:space-between',
      'padding:0 22px 7px',
      'box-sizing:border-box',
      'font:600 14px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
      'color:#111827',
      'background:linear-gradient(180deg,#ffffff 0%,#f9fafb 100%)',
    ].join(';');

    const time = document.createElement('span');
    time.textContent = '9:41';

    const icons = document.createElement('span');
    icons.style.cssText = 'display:flex;align-items:center;gap:5px;font-size:12px;letter-spacing:0.02em';
    icons.textContent = deviceType === 'ipad' ? 'WiFi  100%' : '●●●●  WiFi  100%';

    bar.append(time, icons);
    document.body.prepend(bar);

    const home = document.getElementById('store-screenshot-home-indicator');
    if (home) {
      home.remove();
    }
    const indicator = document.createElement('div');
    indicator.id = 'store-screenshot-home-indicator';
    indicator.setAttribute('aria-hidden', 'true');
    indicator.style.cssText = [
      'position:fixed',
      'left:50%',
      `bottom:${Math.max(6, safeBottom - 18)}px`,
      'transform:translateX(-50%)',
      'width:134px',
      'height:5px',
      'border-radius:999px',
      'background:#111827',
      'opacity:0.28',
      'z-index:99999',
      'pointer-events:none',
    ].join(';');
    document.body.append(indicator);
  }, { safeTop: profile.safeArea.top, safeBottom: profile.safeArea.bottom, deviceType: profile.type });
}

async function dismissOverlays(page) {
  const skipTour = page.getByRole('button', { name: /skip tour/i });
  if (await skipTour.isVisible().catch(() => false)) {
    await skipTour.click();
    await page.waitForTimeout(300);
  }
}

async function captureScreenBuffer(page, screen, profile) {
  await page.goto(`${BASE}${screen.path}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await applyDeviceChrome(page, profile);
  await dismissOverlays(page);

  if (screen.missionIntro) {
    const card = page.getByRole('button', { name: new RegExp(screen.missionIntro, 'i') }).first();
    await card.waitFor({ state: 'visible', timeout: 15_000 });
    await card.click();
    await page.waitForTimeout(700);
    await applyDeviceChrome(page, profile);
  }

  if (screen.waitFor) {
    await page.getByText(screen.waitFor).first().waitFor({ state: 'visible', timeout: 15_000 });
  }

  await page.waitForTimeout(350);
  return page.screenshot({ fullPage: false, animations: 'disabled', type: 'png' });
}

async function main() {
  const shouldBuild = process.argv.includes('--build') || !fs.existsSync(path.join(root, 'dist-familyhub', 'index.html'));

  if (shouldBuild) {
    await runCommand('npm', ['run', 'build:familyhub'], 'Building Family Hub bundle');
  }

  console.log(`[assets:screenshots] Starting preview on ${BASE}`);
  console.log(`[assets:screenshots] Mode: ${USE_FRAME ? 'device frame (App Store dimensions)' : 'full-bleed'}`);
  const preview = startPreview();

  try {
    await waitForServer(`${BASE}/`);
    const browser = await chromium.launch({ headless: true });
    let hadError = false;

    for (const device of DEVICES) {
      const deviceDir = path.join(OUT_ROOT, device.slug);
      const rawDir = path.join(RAW_ROOT, device.slug);
      fs.mkdirSync(deviceDir, { recursive: true });
      fs.mkdirSync(rawDir, { recursive: true });

      console.log(`\n[assets:screenshots] ${device.label}`);
      console.log(`  Capture ${device.captureWidth}×${device.captureHeight} → output ${device.outputWidth}×${device.outputHeight}`);

      const context = await browser.newContext({
        viewport: { width: device.captureWidth, height: device.captureHeight },
        deviceScaleFactor: 1,
        colorScheme: 'light',
        locale: 'en-US',
        isMobile: device.type === 'iphone',
        hasTouch: true,
      });

      for (const screen of SCREENS) {
        const page = await context.newPage();
        await page.addInitScript((entries) => {
          localStorage.clear();
          for (const [key, value] of Object.entries(entries)) {
            localStorage.setItem(key, value);
          }
        }, seedStorage(screen.auth, screen.welcomed, Boolean(screen.seedFamily)));

        const captureBuffer = await captureScreenBuffer(page, screen, device);
        await page.close();

        const rawFile = path.join(rawDir, `${screen.file}.png`);
        await fs.promises.writeFile(rawFile, captureBuffer);

        const finalBuffer = USE_FRAME
          ? await compositeWithDeviceFrame(captureBuffer, device, sharp)
          : await normalizeFullBleed(captureBuffer, device, sharp);

        const outFile = path.join(deviceDir, `${screen.file}.png`);
        await fs.promises.writeFile(outFile, finalBuffer);

        const { ok, width, height } = await assertExactDimensions(finalBuffer, device, sharp);
        console.log(
          `  ${ok ? '✓' : '✗'} ${path.relative(root, outFile)} (${width}×${height})${
            USE_FRAME ? ' · device contour' : ''
          }`
        );
        if (!ok) {
          hadError = true;
          console.error(`    Expected exactly ${device.outputWidth}×${device.outputHeight}`);
        }
      }

      await context.close();
    }

    await browser.close();

    if (hadError) {
      throw new Error('One or more screenshots failed dimension verification');
    }

    console.log('\n[assets:screenshots] Done.');
    console.log(`Upload framed PNGs from ${path.relative(root, OUT_ROOT)}/{iphone-6.5|ipad-13}/`);
    console.log(`Raw captures saved to ${path.relative(root, RAW_ROOT)}/`);
  } finally {
    preview.kill('SIGTERM');
  }
}

main().catch((error) => {
  console.error('[assets:screenshots] Failed:', error.message);
  process.exit(1);
});
