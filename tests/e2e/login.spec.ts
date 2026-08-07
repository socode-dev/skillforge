import { test, expect, type Page } from '@playwright/test';

const seedAuthState = async (
  page: Page,
  state: Record<string, unknown>
) => {
  await page.context().addInitScript((data) => {
    window.__SKILLFORGE_SKIP_AUTH_LISTENER__ = true;
    window.__SKILLFORGE_E2E_SKIP_AUTH_LISTENER__ = true;
    localStorage.removeItem('current-user-storage');
    localStorage.setItem('current-user-storage', data);
  }, JSON.stringify(state));
};

test('already authenticated user is redirected from login to home', async ({ page }) => {
  await seedAuthState(page, {
    state: {
      currentUser: {
        profile: {
          userId: 'u-login',
          name: 'LoggedIn',
          email: 'loggedin@example.com',
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

  await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForLoadState('domcontentloaded');
  await page.waitForURL(/\/home/, { timeout: 60000 });

  await expect(page).toHaveURL(/\/home/);
});
