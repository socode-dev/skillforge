import { test, expect } from '@playwright/test';

test('already authenticated user is redirected from login to home', async ({ page }) => {
  const full = JSON.stringify({
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

  await page.context().addInitScript((data) => {
    window.__SKILLFORGE_E2E_SKIP_AUTH_LISTENER__ = true;
    localStorage.setItem('current-user-storage', data);
  }, full);

  await page.goto('/login');
  await page.waitForLoadState('load');

  await expect(page).toHaveURL(/\/home/);
});
