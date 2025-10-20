import { test, expect } from '@playwright/test';

// Backend /api/scenes/:id/code endpoint not fully implemented yet
test.skip('Scene Editor can generate server code and toggle view', async ({ page }) => {
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

  // Wait for save to complete
  await page.waitForTimeout(1000);

  // Generate on server and wait for it to complete
  await page.getByRole('button', { name: 'Generate on Server' }).click();

  // Wait for server generation to complete (check button is no longer disabled)
  const serverCodeBtn = page.getByRole('button', { name: 'Server Code' });
  await expect(serverCodeBtn).not.toBeDisabled({ timeout: 10000 });

  await serverCodeBtn.click();

  // Expect code preview to contain the function name
  await expect(page.locator('pre')).toContainText('void scene_playwright_test');
});

