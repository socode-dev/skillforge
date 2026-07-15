import { test, expect } from '@playwright/test';

test('redirects unauthenticated user from /home to landing', async ({ page }) => {
  await page.context().addInitScript(() => {
    localStorage.removeItem('current-user-storage');
  });

  await page.goto('/home');

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
    localStorage.setItem('current-user-storage', data);
  }, partial);

  await page.goto('/signup/step-2');
  await page.waitForLoadState('load');

  await expect(page).toHaveURL(/\/signup\/step-1/);
});

test('stale fully onboarded persisted user is redirected from /home', async ({ page }) => {
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
    localStorage.setItem('current-user-storage', data);
  }, full);

  await page.goto('/home');

  await expect(page).toHaveURL(/\/$/);
});
