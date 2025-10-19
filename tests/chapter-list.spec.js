import { test, expect } from '@playwright/test';

test('chapter list shows heading and new link', async ({ page }) => {
  await page.goto('/chapters');
  await expect(page.getByRole('heading', { name: 'Chapters' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'New Chapter' })).toBeVisible();
});

