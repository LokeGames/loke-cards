import { test, expect } from '@playwright/test';

test.describe('Data Worker Cards CRUD', () => {
  test('create, update, delete scene', async ({ page }) => {
    await page.goto('/worker-cards-crud');
    await expect(page.getByTestId('worker-cards-crud-updated-title')).toHaveText('S2-Updated');
    await expect(page.getByTestId('worker-cards-crud-after-delete')).toHaveText('null');
  });
});

