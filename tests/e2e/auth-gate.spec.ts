import { test, expect } from '@playwright/test';

test('redirects unauthenticated user from /home to landing', async ({ page }) => {
  await page.context().addInitScript(() => {
    localStorage.removeItem('current-user-storage');
  });

  await page.goto('/home', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForLoadState('domcontentloaded');
  await page.waitForURL(/\/$/, { timeout: 60000 });

  await expect(page).toHaveURL(/\/$/);
});

test('partially onboarded user is redirected to signup step', async ({ page }) => {
  const partial = JSON.stringify({
    state: {
      currentUser: {
        profile: {
          userId: 'u-test',
          name: 'Partial',
          email: 'partial@example.com',
          signupStepsCompleted: 2,
          role: 'student',
          skillsReview: [],
        },
        skills: [],
      },
      authResolved: true,
      loading: false,
    },
  });

  await page.context().addInitScript((data) => {
    window.__SKILLFORGE_E2E_SKIP_AUTH_LISTENER__ = true;
    localStorage.setItem('current-user-storage', data);
  }, partial);

  await page.goto('/signup/step-2', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForLoadState('domcontentloaded');
  await page.waitForURL(/\/signup\/step-1/, { timeout: 60000 });

  await expect(page).toHaveURL(/\/signup\/step-1/);
});

test('fully onboarded persisted user can access /home', async ({ page }) => {
  const full = JSON.stringify({
    state: {
      currentUser: {
        profile: {
          userId: 'u-full',
          name: 'Full',
          email: 'full@example.com',
          signupStepsCompleted: 4,
          role: 'mentor',
          skillsReview: [],
        },
        skills: [],
      },
      authResolved: true,
      loading: false,
    },
  });

  await page.context().addInitScript((data) => {
    window.__SKILLFORGE_E2E_SKIP_AUTH_LISTENER__ = true;
    localStorage.setItem('current-user-storage', data);
  }, full);

  await page.goto('/home', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForLoadState('domcontentloaded');
  await page.waitForURL(/\/home/, { timeout: 60000 });

  await expect(page).toHaveURL(/\/home/);
});
