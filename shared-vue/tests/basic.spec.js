import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Loke Cards/);
});

test('take screenshot', async ({ page }) => {
  await page.goto('/');
  await page.screenshot({ path: 'screenshots/basic-test.png' });
});
