import { test, expect } from '@playwright/test';

test.describe('Data Worker Chapters CRUD', () => {
  test('create, update, delete chapter', async ({ page }) => {
    await page.goto('/worker-chapters');
    await expect(page.getByTestId('worker-chapters-updated-title')).toHaveText('Updated Title');
    await expect(page.getByTestId('worker-chapters-deleted')).toHaveText('true');
    await expect(page.getByTestId('worker-chapters-after-delete')).toHaveText('null');
  });
});

