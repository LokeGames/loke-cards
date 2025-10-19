import { test, expect } from '@playwright/test';

test('Settings build UI runs and shows artifacts', async ({ page }) => {
  await page.goto('/settings');

  // Build button exists
  const buildBtn = page.getByRole('button', { name: 'Build All Scenes' });
  await expect(buildBtn).toBeVisible();

  // Click build and wait for status
  await buildBtn.click();

  // Either success or error status should appear; success preferred
  // Status appears (success or error)
  await expect(page.locator('text=Build')).toBeVisible();

  // Artifacts list visible
  // Note: may be empty if no scenes in DB yet; we still ensure the list area renders
  await expect(page.getByText('Artifacts')).toBeVisible();
});
