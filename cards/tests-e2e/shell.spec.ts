import { test, expect } from '@playwright/test';

test.describe('App Shell', () => {
  test('renders header title', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Loke Cards (Svelte)' })).toBeVisible();
  });
});

