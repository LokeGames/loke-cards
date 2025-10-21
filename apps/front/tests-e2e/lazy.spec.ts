import { test, expect } from '@playwright/test';

test.describe('Lazy-loaded Micro-Apps', () => {
  test('loads Cards micro-app placeholder', async ({ page }) => {
    await page.goto('/cards');
    await expect(page.getByRole('heading', { name: /Cards Micro-App/i })).toBeVisible();
  });

  test('loads Graph micro-app placeholder', async ({ page }) => {
    await page.goto('/graph');
    await expect(page.getByRole('heading', { name: /Graph Micro-App/i })).toBeVisible();
  });
});

