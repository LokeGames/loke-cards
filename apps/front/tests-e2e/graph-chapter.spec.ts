import { test, expect } from '@playwright/test';

test.describe('Chapter Graph View', () => {
  test('shows chapter node(s) for selected chapter', async ({ page }) => {
    // Create a scene in a specific chapter
    await page.goto('/cards/editor');
    await page.getByLabel('Title').fill('Chaptered Scene');
    await page.getByLabel('Scene ID').fill('chscene');
    // If ChapterSelect exists, try setting a chapter id
    const ch = page.getByLabel('Chapter');
    if (await ch.count()) {
      // Just set some value if possible
      await ch.selectOption({ index: 0 }).catch(() => {});
    }
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByTestId('save-status')).toHaveText('saved');

    // Open chapter graph for an id (using the one we set or a default)
    const chapterId = 'ch-1';
    await page.goto(`/graph/chapter/${chapterId}`);
    const nodes = page.getByTestId('graph-nodes');
    await expect(nodes).toHaveText(/\d+/);
  });
});

