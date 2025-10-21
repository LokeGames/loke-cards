import { test, expect } from '@playwright/test';

test.describe('Cards Editor flow', () => {
  test('create and list a scene', async ({ page }) => {
    await page.goto('/cards/editor');
    await page.getByLabel('Title').fill('My First Scene');
    await page.getByLabel('Scene ID').fill('my_first_scene');
    // ChapterSelect may be empty; if option exists, choose first non-empty
    const sel = page.getByLabel('Chapter');
    if (await sel.count()) {
      const options = await sel.locator('option:not([disabled])').all();
      if (options.length) await sel.selectOption({ index: 1 }).catch(() => {});
    }
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByTestId('save-status')).toHaveText('saved');

    await page.goto('/cards/scenes');
    await expect(page.getByTestId('scene-row')).toContainText('my_first_scene');
  });
});

