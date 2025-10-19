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
  // Confirm dialog
  page.once('dialog', (dialog) => dialog.accept());
  // Re-check list after delete
  await expect(page.getByText(chapterId)).toHaveCount(0);
});

