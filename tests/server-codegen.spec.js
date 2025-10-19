import { test, expect } from '@playwright/test';

test('Scene Editor can generate server code and toggle view', async ({ page }) => {
  await page.goto('/scene/new');

  // Fill minimal valid scene
  await page.fill('#scene-id', 'scene_playwright_test');
  await page.fill('#scene-text', 'Hello from Playwright');

  // Select chapter if available, otherwise create via inline
  // Try to pick first option that is not empty and not __new__
  const select = page.locator('#chapter-select');
  await expect(select).toBeVisible();
  // If no chapters, we skip and rely on server-side fallback
  try { await select.selectOption({ index: 1 }); } catch {}

  // Save locally to ensure validation passes; then trigger server codegen
  await page.getByRole('button', { name: 'Save Scene' }).click();

  // Generate on server and switch to server code
  await page.getByRole('button', { name: 'Generate on Server' }).click();
  await page.getByRole('button', { name: 'Server Code' }).click();

  // Expect code preview to contain the function name
  await expect(page.locator('pre')).toContainText('void scene_playwright_test');
});

