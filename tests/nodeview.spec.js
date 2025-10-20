// @ts-check
import { test, expect } from '@playwright/test';

test.describe('NodeView Graph', () => {
  test('Global graph renders and toolbar works', async ({ page }) => {
    await page.goto('/nodes');
    await expect(page.locator('.vue-flow')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Fit View' })).toBeVisible();
    await page.getByRole('button', { name: 'Fit View' }).click();
    // There may be zero nodes depending on data, but the canvas should be present
    await expect(page.locator('.vue-flow__renderer, .vue-flow__pane')).toBeVisible();
  });

  test('Chapter graph route renders (default chapter)', async ({ page }) => {
    await page.goto('/chapter/chapter01/nodes');
    await expect(page.locator('.vue-flow')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Fit View' })).toBeVisible();
  });
});

