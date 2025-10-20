import { test, expect } from '@playwright/test';

test('chapter list shows heading and new link', async ({ page }) => {
  await page.goto('/chapters');
  await expect(page.getByRole('heading', { name: 'Chapters' })).toBeVisible();
  // New Chapter link appears in main content
  await expect(page.getByRole('main').getByRole('link', { name: 'New Chapter' })).toBeVisible();
});

