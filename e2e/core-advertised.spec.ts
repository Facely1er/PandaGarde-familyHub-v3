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

  test('Resources — hub page', async ({ page }) => {
    await gotoAndWait(page, '/resources');
    await expect(page.getByRole('heading').first()).toBeVisible();
  });

  test('Stories — list and foundation story player', async ({ page }) => {
    await gotoAndWait(page, '/stories');
    await expect(page.getByRole('heading').first()).toBeVisible();
    await gotoAndWait(page, '/stories/privacy-panda-and-the-digital-bamboo-forest');
    await expect(page.getByText(/Interactive journey|Chapter reader/i).first()).toBeVisible();
    await expect(page.locator('.interactive-story-player, #story-player').first()).toBeVisible();
  });

  test('Safety alerts — catalog + RSS tabs', async ({ page }) => {
    await gotoAndWait(page, '/safety-alerts');
    await expect(
      page.getByRole('heading', { level: 1, name: /Safety Alerts & Notifications/i })
    ).toBeVisible();
    await expect(page.getByText(/catalog-based|RSS/i).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Service Notifications/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /RSS Safety Alerts/i })).toBeVisible();
  });

  test('DFA happy path — catalog seed → footprint scores → assessment', async ({ page }) => {
    await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
    await page.evaluate((ids) => {
      localStorage.setItem('pandagarde_family_services', JSON.stringify(ids));
    }, [...E2E_SERVICE_IDS]);
    await gotoAndWait(page, '/digital-footprint');
    await expect(
      page.getByRole('heading', { level: 1, name: /Your family's digital footprint/i })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /Launch-grade scoring|Executive summary/i }).first()
    ).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/Services analyzed/i)).toBeVisible();
    const toAssessment = page.getByRole('link', { name: /Continue to assessment/i }).first();
    await expect(toAssessment).toBeVisible();
    await toAssessment.click();
    await page.waitForURL(/\/privacy-assessment/);
    await expect(page.getByRole('heading', { name: /Privacy assessment/i })).toBeVisible();
    await expect(page.getByText(/Phase 3|Turn findings into action/i).first()).toBeVisible();
    await expect(page.locator('main, #main-content').first()).toBeVisible();
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
