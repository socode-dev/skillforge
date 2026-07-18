import { test, expect } from '@playwright/test';

test.describe('Protected route coverage for authenticated-only pages', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().addInitScript(() => {
      localStorage.removeItem('current-user-storage');
      localStorage.removeItem('request-store');
      localStorage.removeItem('chat-store');
    });
  });

  test('redirects unauthenticated users from dashboard to landing', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForLoadState('domcontentloaded');
    await page.waitForURL(/\/$/, { timeout: 60000 });
    await expect(page).toHaveURL(/\/$/);
  });

  test('redirects unauthenticated users from discover page to landing', async ({ page }) => {
    await page.goto('/home/discover', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForLoadState('domcontentloaded');
    await page.waitForURL(/\/$/, { timeout: 60000 });
    await expect(page).toHaveURL(/\/$/);
  });

  test('redirects unauthenticated users from skill requests page to landing', async ({ page }) => {
    await page.goto('/home/skill-requests', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForLoadState('domcontentloaded');
    await page.waitForURL(/\/$/, { timeout: 60000 });
    await expect(page).toHaveURL(/\/$/);
  });

  test('redirects unauthenticated users from chat list and thread routes', async ({ page }) => {
    await page.goto('/home/messages', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForLoadState('domcontentloaded');
    await page.waitForURL(/\/$/, { timeout: 60000 });
    await expect(page).toHaveURL(/\/$/);

    await page.goto('/home/messages/thread/test-thread', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForLoadState('domcontentloaded');
    await page.waitForURL(/\/$/, { timeout: 60000 });
    await expect(page).toHaveURL(/\/$/);
  });

  test('redirects unauthenticated users from settings to landing', async ({ page }) => {
    await page.goto('/home/settings', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForLoadState('domcontentloaded');
    await page.waitForURL(/\/$/, { timeout: 60000 });
    await expect(page).toHaveURL(/\/$/);
  });
});
