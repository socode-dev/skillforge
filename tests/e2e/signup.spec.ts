import { test, expect } from '@playwright/test';

test('signup onboarding completes through all steps', async ({ page }) => {
  const email = `johndoe+${Date.now()}@example.com`;

  await page.goto('/signup/step-1');

  await expect(page.getByRole('heading', { name: 'Create You Account' })).toBeVisible();

  await page.getByLabel('Full Name').fill('John Doe');
  await page.getByLabel('Email').fill(email);
  await page.locator('input[name="password"]').fill('Password123!');
  await page.locator('input[name="confirmPassword"]').fill('Password123!');
  await page.getByRole('button', { name: 'Next' }).click();

  await page.waitForURL(/\/signup\/step-2/);
  await expect(page.getByRole('heading', { name: 'Share Your Expertise' })).toBeVisible();

  await page.getByRole('button', { name: 'Add Skill' }).click();
  await page.getByLabel('Skill Name').fill('JavaScript Fundamentals');
  await page.getByLabel('Skill Description').fill('Learn the core concepts of JavaScript.');
  await page.getByRole('button', { name: 'Add', exact: true }).click();

  await page.getByLabel('Your Role or Expertise').fill('Frontend Developer');
  await page.getByRole('button', { name: 'Next' }).click();

  await expect(page.getByRole('heading', { name: 'Set Up Your Profile' })).toBeVisible();

  await page.getByLabel('Bio (Optional)').fill('Experienced developer who loves teaching.');
  const profileNext = page.getByRole('button', { name: 'Next' });
  await expect(profileNext).toBeEnabled();
  await profileNext.click({ force: true });
  await page.waitForURL(/\/signup\/step-4/);

  await expect(page.getByRole('heading', { name: 'Welcome to SkillForge!' })).toBeVisible();
  const proceedButton = page.getByRole('button', { name: 'Proceed' });
  await proceedButton.scrollIntoViewIfNeeded();
  await expect(proceedButton).toBeEnabled();
  await proceedButton.click();
  await page.waitForURL(/\/home/, { timeout: 15000 });
});
