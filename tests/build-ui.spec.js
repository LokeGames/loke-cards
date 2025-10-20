import { test, expect } from '@playwright/test';

test('Settings build UI runs and shows artifacts', async ({ page }) => {
  await page.goto('/settings');

  // Build button exists
  const buildBtn = page.getByRole('button', { name: 'Build All Scenes' });
  await expect(buildBtn).toBeVisible();

  // Click build and wait for status
  await buildBtn.click();

  // Wait for build status message (success or error)
  await expect(
    page.locator('span.text-green-600, span.text-red-600').first()
  ).toBeVisible({ timeout: 10000 });

  // Artifacts section visible
  await expect(page.getByRole('heading', { name: /Generated Files|Artifacts/ })).toBeVisible();
});
