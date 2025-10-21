import { test, expect } from '@playwright/test';

test.describe('Data Worker', () => {
  test('responds to ping with pong', async ({ page }) => {
    await page.goto('/worker-test');
    await expect(page.getByTestId('worker-status')).toHaveText('pong');
  });
});

