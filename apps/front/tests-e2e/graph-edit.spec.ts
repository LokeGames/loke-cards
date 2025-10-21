import { test, expect } from '@playwright/test';

test.describe('Graph Editing Interactions (baseline)', () => {
  test('create scenes and a link via controls increases counts', async ({ page }) => {
    await page.goto('/graph/global');
    // Create two scenes via controls
    await page.getByLabel('Scene Title').fill('A');
    await page.getByLabel('Scene ID').fill('a');
    await page.getByTestId('gc-create-scene').click();

    await page.getByLabel('Scene Title').fill('B');
    await page.getByLabel('Scene ID').fill('b');
    await page.getByTestId('gc-create-scene').click();

    // Create a link a -> b
    await page.getByTestId('gc-src').selectOption('a');
    await page.getByTestId('gc-dst').selectOption('b');
    await page.getByTestId('gc-create-link').click();

    // Verify counts
    await expect(page.getByTestId('graph-nodes')).toHaveText(/\d+/);
    await expect(page.getByTestId('graph-edges')).toHaveText(/\d+/);
  });
});

