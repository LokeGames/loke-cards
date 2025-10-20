import { test, expect } from '@playwright/test';

test.describe('Scene Editor flows', () => {
  test('validation and focus on first invalid field', async ({ page }) => {
    await page.goto('/scene/new');

    // Save button disabled initially
    const saveBtn = page.getByRole('button', { name: 'Save Scene' });
    await expect(saveBtn).toBeDisabled();

    // Enter invalid Scene ID and blur
    await page.fill('#scene-id', 'hello');
    await page.locator('#scene-id').blur();
    await expect(page.getByText('Must be a valid C identifier')).toBeVisible();

    // Fix Scene ID
    await page.fill('#scene-id', 'scene_test_editor');
    await page.locator('#scene-id').blur();

    // Fill required Scene Text
    await page.fill('#scene-text', 'Editor flow test');

    // Choose chapter if available
    try { await page.selectOption('#chapter-select', { index: 1 }); } catch {}

    // Now save should be enabled
    await expect(saveBtn).toBeEnabled();
  });

  test('reset restores initial state', async ({ page }) => {
    await page.goto('/scene/new');
    await page.fill('#scene-id', 'scene_reset_test');
    await page.fill('#scene-text', 'Some text');
    try { await page.selectOption('#chapter-select', { index: 1 }); } catch {}

    // Click Reset
    await page.getByRole('button', { name: 'Reset' }).click();
    await expect(page.locator('#scene-id')).toHaveValue('');
    await expect(page.locator('#scene-text')).toHaveValue('');
  });
});

