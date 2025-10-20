import { test, expect } from '@playwright/test';

test('dashboard shows quick actions including New Chapter', async ({ page }) => {
  await page.goto('/');
  // Quick Actions appears both in sidebar and main - check main content
  await expect(page.getByRole('main').getByRole('heading', { name: 'Quick Actions' })).toBeVisible();
  // New Scene link in Quick Actions section (first one)
  await expect(page.getByRole('main').getByRole('link', { name: 'New Scene' }).first()).toBeVisible();
  await expect(page.getByRole('main').getByRole('link', { name: 'New Chapter' }).first()).toBeVisible();
});

