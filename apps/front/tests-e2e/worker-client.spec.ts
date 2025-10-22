
import { test, expect } from '@playwright/test';

test.describe('Worker Client Communication', () => {
  test('should be able to communicate with the shared worker', async ({ page }) => {
    await page.goto('/'); // Navigate to a basic page

    const result = await page.evaluate(async () => {
      const { getWorkerApi } = await import('@loke/worker-client');
      const workerApi = await getWorkerApi();
      // Assuming cards.list() exists and returns an array
      const cards = await workerApi.cards.list();
      return Array.isArray(cards);
    });

    expect(result).toBe(true);
  });
});
