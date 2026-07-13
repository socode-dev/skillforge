import { test, expect } from '@playwright/test';

test('login button disabled until valid form', async ({ page }) => {
  await page.goto('/login');

  const loginBtn = page.getByRole('button', { name: 'Login' });
  await expect(loginBtn).toBeDisabled();

  await page.getByLabel('Email').fill('user@example.com');
  await page.locator('input[name="password"]').fill('short');
  await expect(loginBtn).toBeDisabled();

  await page.locator('input[name="password"]').fill('Password123!');
  await expect(loginBtn).toBeEnabled();
});

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
    localStorage.setItem('current-user-storage', data);
  }, full);

  await page.goto('/login');
  await page.waitForLoadState('load');

  await expect(page).toHaveURL(/\/home/);
});
