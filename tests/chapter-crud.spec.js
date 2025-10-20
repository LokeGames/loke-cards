import { test, expect } from '@playwright/test';

test('create and delete chapter via UI', async ({ page }) => {
  const chapterId = 'chapter_e2e_test';

  // Create
  await page.goto('/chapter/new');
  await page.fill('#chapter-id', chapterId);
  await page.fill('#chapter-name', 'E2E Test Chapter');
  await page.getByRole('button', { name: 'Save Chapter' }).click();

  // Verify in list
  await page.goto('/chapters');
  await expect(page.getByText(chapterId)).toBeVisible();

  // Delete
  const row = page.locator('li', { hasText: chapterId });
  await row.getByRole('button', { name: 'Delete' }).click();

  // Confirm via modal (AppModal component)
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Confirm' }).click();

  // Wait for modal to close and re-check list
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByText(chapterId)).toHaveCount(0);
});

