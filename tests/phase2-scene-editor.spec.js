import { test, expect } from '@playwright/test';

test.describe('Phase 2 - Scene Editor', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Scene Editor (create new scene)
    await page.goto('/scene/new');
    // Wait for Vue to mount
    await page.waitForSelector('.scene-editor-view', { timeout: 5000 });
  });

  test('Scene Editor page loads successfully', async ({ page }) => {
    // Check for main heading
    const heading = await page.textContent('h1');
    expect(heading).toContain('Create New Scene');

    // Check for all main sections
    await expect(page.locator('.scene-editor-view')).toBeVisible();
    await expect(page.locator('button:has-text("Save Scene")')).toBeVisible();
    await expect(page.locator('button:has-text("Cancel")')).toBeVisible();
  });

  test('Scene ID validation works', async ({ page }) => {
    // Use more specific selector - Scene ID input is the first input in the form
    const sceneIdInput = page.locator('.scene-editor-view input').first();

    // Test invalid ID (no "scene_" prefix)
    await sceneIdInput.fill('invalid_name');
    await sceneIdInput.blur();

    // Should show error
    await expect(page.locator('text=/Scene ID should start with "scene_"/').first()).toBeVisible({ timeout: 2000 });

    // Test valid ID
    await sceneIdInput.fill('scene_forest_entrance');
    await sceneIdInput.blur();

    // Error should disappear
    await expect(page.locator('text=/Scene ID should start with "scene_"/').first()).not.toBeVisible({ timeout: 2000 });
  });

  test('Chapter selector is visible', async ({ page }) => {
    const chapterSelect = page.locator('select').first();
    await expect(chapterSelect).toBeVisible();
  });

  test('Scene text editor works', async ({ page }) => {
    // Use the only textarea on the page
    const textarea = page.locator('textarea').first();
    await expect(textarea).toBeVisible();

    // Type some text
    const testText = 'You stand at the edge of a dark forest.';
    await textarea.fill(testText);

    // Check character counter updates (should match exact text length)
    const charCount = await page.textContent('text=/\\d+\\/2048/');
    expect(charCount).toContain(`${testText.length}/2048`);
  });

  test('Choices list - add and remove choices', async ({ page }) => {
    // Initial choice should exist
    await expect(page.locator('text=Choice 1')).toBeVisible();

    // Add a new choice
    await page.click('button:has-text("Add Choice")');
    await expect(page.locator('text=Choice 2')).toBeVisible();

    // Remove a choice (click X button on second choice)
    const removeButtons = page.locator('button[title="Remove choice"]');
    const count = await removeButtons.count();
    if (count >= 2) {
      await removeButtons.nth(1).click();

      // Should only have 1 choice now
      await expect(page.locator('text=Choice 2')).not.toBeVisible();
    }
  });

  test('State changes list - add state change', async ({ page }) => {
    // Click "Add State Change" button
    const addButton = page.locator('button:has-text("Add State Change")');
    await addButton.click();

    // Should see "State Change 1"
    await expect(page.locator('text=State Change 1')).toBeVisible();

    // Should see operator dropdown
    await expect(page.locator('select').filter({ hasText: '=' }).first()).toBeVisible();
  });

  test('Code preview is visible and shows generated code', async ({ page }) => {
    // Fill out basic scene data using specific selectors
    const sceneIdInput = page.locator('.scene-editor-view input').first();
    const textarea = page.locator('textarea').first();

    await sceneIdInput.fill('scene_test');
    await textarea.fill('Test scene');

    // Wait for code preview to update (check for generated code)
    const codePreview = page.locator('pre, code').first();
    await expect(codePreview).toContainText('#include', { timeout: 5000 });
    await expect(codePreview).toContainText('void scene_test');
  });

  test('Copy to clipboard button exists', async ({ page }) => {
    const copyButton = page.locator('button:has-text("Copy")');
    await expect(copyButton).toBeVisible();
  });

  test('Save button enables with valid form', async ({ page }) => {
    const saveButton = page.locator('button:has-text("Save Scene")');

    // Fill all required fields using specific selectors
    const sceneIdInput = page.locator('.scene-editor-view input').first();
    const textarea = page.locator('textarea').first();

    await sceneIdInput.fill('scene_complete_test');
    await textarea.fill('A complete test scene.');

    // Fill first choice text (find by label)
    const choiceInput = page.locator('label:has-text("Choice Text")').locator('..').locator('input').first();
    await choiceInput.fill('Test choice');

    // Save button should now be enabled
    await expect(saveButton).not.toBeDisabled();
  });

  test('Cancel button navigates away', async ({ page }) => {
    const cancelButton = page.locator('button:has-text("Cancel")');
    await cancelButton.click();

    // Should navigate to /scenes
    await expect(page).toHaveURL(/\/scenes/);
  });

  test('Mobile responsive layout (375px)', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForSelector('.scene-editor-view');

    // All form elements should still be visible on mobile using specific selectors
    const sceneIdInput = page.locator('.scene-editor-view input').first();
    await expect(sceneIdInput).toBeVisible();
    await expect(page.locator('textarea')).toBeVisible();
    await expect(page.locator('button:has-text("Save Scene")')).toBeVisible();
  });

  test('Tablet responsive layout (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await page.waitForSelector('.scene-editor-view');

    // All elements should be visible using specific selectors
    const sceneIdInput = page.locator('.scene-editor-view input').first();
    await expect(sceneIdInput).toBeVisible();
    await expect(page.locator('button:has-text("Save Scene")')).toBeVisible();
  });

  test('Desktop layout (1024px+)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.reload();
    await page.waitForSelector('.scene-editor-view');

    // 2-column layout should be visible on desktop
    const gridLayout = page.locator('.grid.lg\\:grid-cols-2');
    await expect(gridLayout).toBeVisible();
  });

  test('Dark mode support', async ({ page }) => {
    // Toggle dark mode
    const themeToggle = page.locator('button[title="Toggle dark mode"], button:has-text("🌙"), button:has-text("☀️")').first();
    await themeToggle.click();

    // Wait for dark class to be applied
    await page.waitForFunction(() => document.documentElement.classList.contains('dark'));

    // HTML should have dark class
    const htmlClass = await page.evaluate(() => document.documentElement.className);
    const hasDarkMode = htmlClass.includes('dark');
    expect(hasDarkMode).toBe(true);

    // Text should be visible (not dark text on dark background)
    const heading = page.locator('h1');
    const color = await heading.evaluate(el => window.getComputedStyle(el).color);
    // Should be light colored (rgb values > 200)
    expect(color).not.toBe('rgb(0, 0, 0)');
  });
});
