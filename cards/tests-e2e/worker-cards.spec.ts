import { test, expect } from '@playwright/test';

test.describe('Data Worker Cards', () => {
  test('creates and lists scenes', async ({ page }) => {
    await page.goto('/worker-cards');
    await expect(page.getByTestId('worker-cards-count')).toHaveText('1');
    await expect(page.getByTestId('worker-card-id')).toContainText('e2e-scene-1');
  });
});

