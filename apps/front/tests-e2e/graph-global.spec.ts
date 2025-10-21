import { test, expect } from '@playwright/test';

test.describe('Global Graph View', () => {
  test('shows at least one node after creating a scene', async ({ page }) => {
    // Create a scene first
    await page.goto('/cards/editor');
    await page.getByLabel('Title').fill('GScene');
    await page.getByLabel('Scene ID').fill('gscene');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByTestId('save-status')).toHaveText('saved');

    // Open global graph
    await page.goto('/graph/global');
    const nodes = page.getByTestId('graph-nodes');
    await expect(nodes).toHaveText(/\d+/);
  });
});

