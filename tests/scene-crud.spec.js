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
  await page.getByRole('button', { name: 'Save Scene' }).click();

  // Verify in list
  await page.goto('/scenes');
  await expect(page.getByText(sceneId)).toBeVisible();

  // Delete
  const row = page.locator('li', { hasText: sceneId });
  await row.getByRole('button', { name: 'Delete' }).click();
  page.once('dialog', (dialog) => dialog.accept());
  await expect(page.getByText(sceneId)).toHaveCount(0);
});

