import { test, expect, type Page } from '@playwright/test';
import { E2E_SERVICE_IDS } from './helpers/seed-dfa';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:4173';

async function gotoAndWait(page: Page, path: string) {
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
  await expect(page.locator('#root')).toBeVisible();
}

test.describe('Core features advertised (How it works + CONTENT_TRUTH)', () => {
  test('Home — hero and primary journey CTA', async ({ page }) => {
    await gotoAndWait(page, '/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/digital life/i);
    const primary = page.getByRole('link', { name: /Continue your journey|Start Digital Footprint Analysis/i });
    await expect(primary.first()).toBeVisible();
    await expect(page.locator('.premium-hero').getByRole('link', { name: /How it works/i })).toBeVisible();
  });

  test('How it works — three-step flow', async ({ page }) => {
    await gotoAndWait(page, '/how-it-works');
    await expect(page.getByRole('heading', { name: /Discover your privacy exposure/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Learn what matters/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Take action in Family Hub/i })).toBeVisible();
    await expect(page.getByText(/Does PandaGarde monitor what my child does online/i)).toBeVisible();
  });

  test('Get started — DFA journey stepper', async ({ page }) => {
    await gotoAndWait(page, '/get-started');
    await expect(page.getByRole('heading', { name: /Digital Footprint Analysis Journey/i })).toBeVisible();
    await expect(page.getByText(/revolves around Digital Footprint Analysis/i)).toBeVisible();
  });

  test('Service catalog — add services UI', async ({ page }) => {
    await gotoAndWait(page, '/service-catalog');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('main, #main-content').first()).toContainText(/service|catalog|app/i);
  });

  test('Digital footprint — empty state or analysis', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('familyMembers');
      localStorage.removeItem('pandagarde_family_services');
    });
    await gotoAndWait(page, '/digital-footprint');
    const empty = page.getByText(/Add at least 3 services|digital footprint/i);
    await expect(empty.first()).toBeVisible();
  });

  test('Privacy assessment — loads', async ({ page }) => {
    await gotoAndWait(page, '/privacy-assessment');
    await expect(page.locator('main, #main-content').first()).toBeVisible();
    await expect(page.getByRole('heading').first()).toBeVisible();
  });

  test('Guides & stories — hub page', async ({ page }) => {
    await gotoAndWait(page, '/for-families');
    await expect(page.getByRole('heading', { name: /Guides & stories/i })).toBeVisible();
  });

  test('Guides & stories — key cards are not 404', async ({ page }) => {
    await gotoAndWait(page, '/for-families');
    for (const name of [/Family privacy guide/i, /Printables/i, /Privacy Panda/i]) {
      const link = page.getByRole('link', { name }).first();
      await expect(link).toBeVisible();
      const href = await link.getAttribute('href');
      expect(href).toBeTruthy();
      await page.goto(`${BASE}${href}`, { waitUntil: 'networkidle' });
      await expect(page.getByText(/^404$/)).toHaveCount(0);
      await expect(page.getByRole('heading').first()).toBeVisible();
    }
  });

  test('Legacy resource URLs redirect instead of 404', async ({ page }) => {
    for (const path of ['/resources', '/privacy-tools', '/parent-resources', '/worksheets']) {
      await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
      await expect(page.getByText(/^404$/)).toHaveCount(0);
    }
  });

  test('Stories — list and foundation story player', async ({ page }) => {
    await gotoAndWait(page, '/stories');
    await expect(page.getByRole('heading').first()).toBeVisible();
    await gotoAndWait(page, '/stories/privacy-panda-and-the-digital-bamboo-forest');
    await expect(page.getByText(/Interactive journey|Chapter reader/i).first()).toBeVisible();
    await expect(page.locator('.interactive-story-player, #story-player').first()).toBeVisible();
  });

  test('Stories — continuation episode interactive player', async ({ page }) => {
    await gotoAndWait(page, '/stories/miki-and-the-photo-that-flew-away');
    await expect(page.getByText(/Interactive journey|Chapter reader/i).first()).toBeVisible();
    await expect(page.locator('.interactive-story-player, #story-player').first()).toBeVisible();
  });

  test('Retired safety-alerts route forwards to SocialCaution funnel', async ({ page }) => {
    await page.goto(`${BASE}/safety-alerts`, { waitUntil: 'domcontentloaded' });
    await page.waitForURL(/socialcaution\.com/, { timeout: 15_000 });
    expect(page.url()).toMatch(/socialcaution\.com/);
  });

  test('DFA happy path — catalog seed → footprint → stories CTA', async ({ page }) => {
    await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
    await page.evaluate((ids) => {
      localStorage.setItem('pandagarde_family_services', JSON.stringify(ids));
    }, [...E2E_SERVICE_IDS]);
    await gotoAndWait(page, '/digital-footprint');
    await expect(page.getByRole('heading', { level: 1, name: /Footprint Review/i })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /Launch-grade scoring|Executive summary/i }).first()
    ).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/Services analyzed/i)).toBeVisible();
    const toStory = page.getByRole('link', { name: /Read Privacy Panda story/i }).first();
    await expect(toStory).toBeVisible();
    await toStory.click();
    await page.waitForURL(/\/stories\//);
    await expect(page.locator('main, #main-content').first()).toBeVisible();
  });

  test('Retired privacy-assessment route forwards to SocialCaution', async ({ page }) => {
    await page.goto(`${BASE}/privacy-assessment`, { waitUntil: 'domcontentloaded' });
    await page.waitForURL(/socialcaution\.com/, { timeout: 15_000 });
    expect(page.url()).toMatch(/socialcaution\.com/);
  });

  test('Family Hub — local gate then dashboard', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('pandagarde_local_auth_v1', 'false');
      localStorage.removeItem('pandagarde_hub_welcomed');
    });
    await gotoAndWait(page, '/family-hub');
    await expect(page.getByRole('heading', { name: /PandaGarde Family Hub/i })).toBeVisible();
    await page.getByRole('button', { name: /Let's go!/i }).click();
    await page.waitForURL(/\/family-hub\/(welcome|dashboard)/);
    if (page.url().includes('/welcome')) {
      await page.getByRole('button', { name: /Start fresh in Family Hub/i }).click();
      await page.waitForURL(/\/family-hub\/dashboard/);
    }
    await expect(page.locator('main, [class*="dashboard"]').first()).toBeVisible();
    await gotoAndWait(page, '/family-hub/kids');
    await expect(page.getByRole('heading').first()).toBeVisible();
    await gotoAndWait(page, '/family-hub/activities');
    await expect(page.locator('main').first()).toBeVisible();
  });
});
