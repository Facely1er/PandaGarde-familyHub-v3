import { test, expect, type Page } from '@playwright/test';
import {
  ALL_IN_APP_PATHS,
  HUB_PATHS,
  STATIC_APP_PATHS,
  REDIRECT_SOURCE_PATHS,
  STORY_PATHS,
} from './helpers/sitePaths';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:4173';

async function seedHubSession(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem('pandagarde_local_auth_v1', 'true');
    localStorage.setItem('pandagarde_hub_welcomed', 'true');
    localStorage.setItem('pandagarde_hub_welcome_dismissed', 'true');
  });
}

async function assertNot404(page: Page) {
  await expect(page.locator('#root, main, #main-content').first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Page not found' })).toHaveCount(0);
  await expect(page.getByText(/^404$/)).toHaveCount(0);
  await expect(page.getByText(/Navigation error/i)).toHaveCount(0);
  await expect(page.getByText(/Something went wrong while opening this page/i)).toHaveCount(0);
}

async function gotoPath(page: Page, path: string) {
  await page.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded', timeout: 45_000 });
  await page.waitForSelector('#root, main, #main-content', { timeout: 15_000 });
}

test.describe('All advertised routes — no 404', () => {
  test.beforeEach(async ({ page }) => {
    await seedHubSession(page);
  });

  for (const path of STATIC_APP_PATHS) {
    test(`static route ${path}`, async ({ page }) => {
      await gotoPath(page, path);
      await assertNot404(page);
      await expect(page.getByRole('heading').first()).toBeVisible();
    });
  }

  for (const path of REDIRECT_SOURCE_PATHS) {
    test(`redirect source ${path}`, async ({ page }) => {
      await gotoPath(page, path);
      await assertNot404(page);
    });
  }

  for (const path of STORY_PATHS) {
    test(`story ${path}`, async ({ page }) => {
      await gotoPath(page, path);
      await assertNot404(page);
      await expect(page.locator('main, #main-content').first()).toBeVisible();
    });
  }

  for (const path of HUB_PATHS) {
    test(`family hub ${path}`, async ({ page }) => {
      await gotoPath(page, path);
      await assertNot404(page);
      await expect(page.locator('main').first()).toBeVisible();
    });
  }

  test('deduplicated link inventory has no 404', async ({ page }) => {
    const failures: string[] = [];
    for (const path of ALL_IN_APP_PATHS) {
      await gotoPath(page, path);
      try {
        await assertNot404(page);
      } catch {
        failures.push(path);
      }
    }
    expect(failures, `404 or navigation errors on: ${failures.join(', ')}`).toEqual([]);
  });

  test('internal links on /for-families resolve', async ({ page }) => {
    await gotoPath(page, '/for-families');
    const hrefs = await page.locator('main a[href^="/"]').evaluateAll((anchors) =>
      [...new Set(anchors.map((a) => a.getAttribute('href') ?? '').filter(Boolean))],
    );

    expect(hrefs.length).toBeGreaterThan(0);

    for (const href of hrefs) {
      const path = href.split('#')[0].split('?')[0];
      if (!path || path.startsWith('//')) {
        continue;
      }
      if (path.startsWith('/family-hub')) {
        continue;
      }
      await gotoPath(page, path);
      await assertNot404(page);
    }
  });
});
