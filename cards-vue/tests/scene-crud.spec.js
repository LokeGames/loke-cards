import { test, expect } from '@playwright/test';

test('create and delete scene via UI', async ({ page }) => {
  const chapterId = 'chapter_e2e_scene';
  const sceneId = 'scene_e2e_test';

  // Ensure chapter exists
  await page.goto('/chapter/new');
  await page.fill('#chapter-id', chapterId);
  await page.getByRole('button', { name: 'Save Chapter' }).click();

  // Create scene
  await page.goto('/scene/new');
  await page.fill('#scene-id', sceneId);
  await page.fill('#scene-text', 'E2E scene text');
  await page.selectOption('#chapter-select', { label: chapterId });

  // Save and wait for success indicator
  await page.getByRole('button', { name: 'Save Scene' }).click();

  // Wait for save success message or timeout
  try {
    await expect(page.locator('text=/saved|success/i').first()).toBeVisible({ timeout: 3000 });
  } catch {
    // Continue even if no success message
  }

  // Give API time to propagate
  await page.waitForTimeout(2000);

  // Verify in list - reload to ensure fresh data
  await page.goto('/scenes');
  await page.waitForLoadState('networkidle');
  await expect(page.getByText(sceneId)).toBeVisible({ timeout: 10000 });

  // Delete
  const row = page.locator('li', { hasText: sceneId });
  await row.getByRole('button', { name: 'Delete' }).click();

  // Confirm via modal (AppModal component)
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Confirm' }).click();

  // Wait for modal to close and re-check list
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByText(sceneId)).toHaveCount(0);
});

