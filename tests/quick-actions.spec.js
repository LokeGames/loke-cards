import { test, expect } from '@playwright/test';

test('dashboard shows quick actions including New Chapter', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Quick Actions' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'New Scene' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'New Chapter' })).toBeVisible();
});

