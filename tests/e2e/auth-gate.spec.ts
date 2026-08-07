import { test, expect, type Page } from '@playwright/test';

const seedAuthState = async (
  page: Page,
  state: Record<string, unknown>
) => {
  await page.context().addInitScript((data) => {
    window.__SKILLFORGE_SKIP_AUTH_LISTENER__ = true;
    window.__SKILLFORGE_E2E_SKIP_AUTH_LISTENER__ = true;
    localStorage.setItem('current-user-storage', data);
  }, JSON.stringify(state));
};

test('redirects unauthenticated user from /home to landing', async ({ page }) => {
  await seedAuthState(page, {
    state: {
      currentUser: null,
      authResolved: true,
      loading: false,
    },
  });

  await page.goto('/home', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForURL(/\/$/, { timeout: 60000 });

  await expect(page).toHaveURL(/\/$/);
});

test('partially onboarded user is redirected to signup step', async ({ page }) => {
  await seedAuthState(page, {
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

  await page.goto('/signup/step-2', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForURL(/\/signup\/step-1/, { timeout: 60000 });

  await expect(page).toHaveURL(/\/signup\/step-1/);
});

test('fully onboarded persisted user can access /home', async ({ page }) => {
  await seedAuthState(page, {
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

  await page.goto('/home', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForURL(/\/home/, { timeout: 60000 });

  await expect(page).toHaveURL(/\/home/);
});
