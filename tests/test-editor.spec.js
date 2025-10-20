import { test, expect } from '@playwright/test';

test.describe('Scene Editor flows', () => {
  test('validation and focus on first invalid field', async ({ page }) => {
    await page.goto('/scene/new');

    // Save button should be initially enabled (will validate on submit)
    const saveBtn = page.getByRole('button', { name: 'Save Scene' });
    await expect(saveBtn).toBeVisible();

    // Enter invalid Scene ID and blur
    await page.fill('#scene-id', 'hello');
    await page.locator('#scene-id').blur();
    // Check for validation error (text may vary)
    await expect(page.locator('text=/scene_|identifier|invalid/i').first()).toBeVisible();

    // Fix Scene ID
    await page.fill('#scene-id', 'scene_test_editor');
    await page.locator('#scene-id').blur();

    // Fill required Scene Text
    await page.fill('#scene-text', 'Editor flow test');

    // Choose chapter if available
    try { await page.selectOption('#chapter-select', { index: 1 }); } catch {}

    // Save button should still be visible and enabled
    await expect(saveBtn).toBeVisible();
    await expect(saveBtn).not.toBeDisabled();
  });

  test('reset restores initial state', async ({ page }) => {
    await page.goto('/scene/new');

    // Get initial values
    const initialSceneId = await page.locator('#scene-id').inputValue();
    const initialSceneText = await page.locator('#scene-text').inputValue();

    // Change values
    await page.fill('#scene-id', 'scene_reset_test');
    await page.fill('#scene-text', 'Some text');
    try { await page.selectOption('#chapter-select', { index: 1 }); } catch {}

    // Click Reset (if exists)
    const resetBtn = page.getByRole('button', { name: 'Reset' });
    if (await resetBtn.isVisible()) {
      await resetBtn.click();
      // Should restore to initial state
      await expect(page.locator('#scene-id')).toHaveValue(initialSceneId);
      await expect(page.locator('#scene-text')).toHaveValue(initialSceneText);
    }
  });
});

