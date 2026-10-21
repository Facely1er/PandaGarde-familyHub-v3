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
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/kids are online|calm way to talk/i);
    const primary = page.getByRole('link', {
      name: /Continue footprint review|Continue adding apps|big picture|Footprint Review/i,
    });
    await expect(primary.first()).toBeVisible();
    await expect(
      page.locator('.homepage-hero').getByRole('link', { name: /See how it works|How it works/i }),
    ).toBeVisible();
  });

  test('Big picture — plain-language result, no scores, story as next step', async ({ page }) => {
    await page.addInitScript(() => localStorage.removeItem('pandagarde_family_snapshot_v1'));
    await gotoAndWait(page, '/family-snapshot');
    await page.waitForURL(/\/big-picture/);
    await expect(page.getByRole('heading', { level: 1, name: /big picture/i })).toBeVisible();
    const show = page.getByRole('button', { name: /Show our big picture/i });
    await expect(show).toBeDisabled();
    await page.getByText('Classwork & homework apps', { exact: true }).click();
    await page.getByText('Online games and consoles', { exact: true }).click();
    await show.click();
    await expect(page.getByText('Start here', { exact: true })).toBeVisible();
    await expect(page.getByText('Ask your child', { exact: true })).toBeVisible();
    await expect(page.locator('main, #main-content').first()).not.toContainText(/\/100|score/i);
    await page.getByText(/Questions to ask your child.s school/i).click();
    await expect(page.getByRole('link', { name: /Share EduSoluce with your school/i })).toHaveAttribute('target', '_blank');
    await page.getByRole('link', { name: /^Pick your apps/i }).click();
    await page.waitForURL(/\/service-catalog/);
  });

  test('Guided path — big picture suggestions → action plan with tickable steps', async ({ page }) => {
    await page.addInitScript(() => {
      if (sessionStorage.getItem('e2e-seeded')) {return;}
      sessionStorage.setItem('e2e-seeded', '1');
      localStorage.removeItem('pandagarde_family_services');
      localStorage.removeItem('pandagarde_action_plan_v1');
      localStorage.setItem('pandagarde_family_snapshot_v1', JSON.stringify({ ages: ['9-12'], kinds: ['play-worlds', 'home-smart'] }));
    });
    await gotoAndWait(page, '/service-catalog');
    await expect(page.getByRole('heading', { name: /Suggested from your big picture/i })).toBeVisible();
    await page.getByRole('button', { name: 'Add Roblox' }).click();
    await expect(page.getByRole('button', { name: 'Remove Roblox' })).toBeVisible();
    await page.getByRole('link', { name: /See your action plan/i }).click();
    await page.waitForURL(/\/digital-footprint/);
    await expect(page.getByRole('heading', { level: 1, name: /action plan/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Roblox' })).toBeVisible();
    await expect(page.getByRole('heading', { name: /From your big picture/i })).toBeVisible();
    await expect(page.getByText(/^0 of \d+ steps done$/)).toBeVisible();
    await page.getByRole('listitem').filter({ has: page.getByRole('heading', { name: 'Roblox' }) }).getByRole('checkbox').first().check();
    await expect(page.getByText(/^1 of \d+ steps done$/)).toBeVisible();
    await page.reload({ waitUntil: 'networkidle' });
    await expect(page.getByText(/^1 of \d+ steps done$/)).toBeVisible();
  });

  test('How it works — three-step flow', async ({ page }) => {
    await gotoAndWait(page, '/how-it-works');
    await expect(page.getByRole('heading', { level: 1, name: /How PandaGarde Works/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Stories & guides/i }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: /Footprint from (your )?catalog/i }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: /Family Hub/i }).first()).toBeVisible();
    await expect(page.getByText(/Does PandaGarde monitor what my child does online/i)).toBeVisible();
  });

  test('Get started — resumes the guided apps / plan path', async ({ page }) => {
    await gotoAndWait(page, '/get-started');
    await expect(page).toHaveURL(/\/(service-catalog|digital-footprint)/);
    await expect(page.getByRole('heading', { level: 1, name: /Your apps|action plan/i })).toBeVisible();
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
    const empty = page.getByRole('heading', { name: /Pick your apps first/i });
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
    for (const name of [
      /Family privacy guide/i,
      /Device setup guide/i,
      /Coloring sheets/i,
      /Privacy Panda & the Digital Bamboo Forest/i,
    ]) {
      await gotoAndWait(page, '/for-families');
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

  test('Safety alerts alias routes render in-app alerts page', async ({ page }) => {
    for (const path of ['/safety-alerts', '/alerts']) {
      await page.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded' });
      await page.waitForURL(/\/child-safety-alerts/, { timeout: 15_000 });
      await expect(
        page.getByRole('heading', { level: 1, name: /Safety Alerts & Notifications/i }),
      ).toBeVisible();
    }
  });

  test('Footprint review happy path — catalog seed → footprint → stories CTA', async ({ page }) => {
    await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
    await page.evaluate((ids) => {
      localStorage.setItem('pandagarde_family_services', JSON.stringify(ids));
    }, [...E2E_SERVICE_IDS]);
    await gotoAndWait(page, '/digital-footprint');
    await expect(page.getByRole('heading', { level: 1, name: /action plan/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Your family action plan/i })).toBeVisible();
    await page.locator('summary', { hasText: 'Detailed footprint review' }).click();
    await expect(
      page.getByRole('heading', { name: /Launch-grade scoring|Executive summary/i }).first()
    ).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/Services analyzed/i)).toBeVisible();
    const toStory = page
      .getByRole('link', { name: /Privacy Panda stories|Read a story|Read Privacy Panda/i })
      .first();
    await expect(toStory).toBeVisible();
    await toStory.click();
    await page.waitForURL(/\/(stories|family-hub)/);
    await expect(page.locator('main, #main-content').first()).toBeVisible();
  });

  test('Assessment alias route renders in-app privacy assessment', async ({ page }) => {
    await page.goto(`${BASE}/assessment`, { waitUntil: 'domcontentloaded' });
    await page.waitForURL(/\/privacy-assessment/, { timeout: 15_000 });
    await expect(
      page.getByRole('heading', { level: 1, name: /How is your family doing on privacy/i }),
    ).toBeVisible();
  });

  test('Family Hub — local gate then dashboard', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('pandagarde_local_auth_v1', 'false');
      localStorage.removeItem('pandagarde_hub_welcomed');
    });
    await gotoAndWait(page, '/family-hub');
    const localGate = page.getByRole('button', { name: /Let's go!/i });
    if (await localGate.isVisible().catch(() => false)) {
      await localGate.click();
    }
    await page.waitForURL(/\/family-hub\/(welcome|dashboard)/, { timeout: 15_000 });
    if (page.url().includes('/welcome')) {
      await expect(page.getByRole('heading', { name: /Welcome to your Family Hub/i })).toBeVisible();
      await page.getByRole('button', { name: /Add your family to start/i }).click();
      await page.waitForURL(/\/family-hub\/dashboard/);
    }
    await expect(page.locator('main, [class*="dashboard"]').first()).toBeVisible();
    await gotoAndWait(page, '/family-hub/kids');
    await expect(page.getByRole('heading').first()).toBeVisible();
    await gotoAndWait(page, '/family-hub/activities');
    await expect(page.locator('main').first()).toBeVisible();
  });
});
