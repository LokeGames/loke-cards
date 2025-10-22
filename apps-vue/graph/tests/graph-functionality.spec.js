import { test, expect } from '@playwright/test';

test.describe('Graph App - Core Functionality', () => {
  test('Global graph should render chapters and scenes', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.vue-flow')).toBeVisible();

    const chapterNodes = page.locator('.vue-flow__node.chapter-node');
    const sceneNodes = page.locator('.vue-flow__node.scene-node');

    // Expect at least one chapter and one scene node to be visible
    await expect(chapterNodes).toHaveCount(1); // Assuming one chapter for now
    await expect(sceneNodes).toHaveCount(4); // Assuming 4 scenes for chapter01

    // Check if the chapter node has the correct title
    await expect(chapterNodes.first().locator('h3')).toHaveText('chapter01');
  });

  test('Double-clicking a chapter node should navigate to chapter view', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.vue-flow')).toBeVisible();

    const chapterNode = page.locator('.vue-flow__node.chapter-node').first();
    await chapterNode.dblclick();

    // Expect the URL to change to the chapter view
    await expect(page).toHaveURL(/.*\/chapter\/chapter01/);

    // Expect chapter view to render nodes
    const sceneNodes = page.locator('.vue-flow__node.scene-node');
    await expect(sceneNodes).toHaveCount(4); // Assuming 4 scenes for chapter01
  });

  test('Chapter view should only show scenes for that chapter', async ({ page }) => {
    await page.goto('/chapter/chapter01');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.vue-flow')).toBeVisible();

    const chapterNodes = page.locator('.vue-flow__node.chapter-node');
    const sceneNodes = page.locator('.vue-flow__node.scene-node');

    // Expect no chapter nodes in chapter view
    await expect(chapterNodes).toHaveCount(0);
    // Expect only scenes for chapter01
    await expect(sceneNodes).toHaveCount(4); // Assuming 4 scenes for chapter01
  });
});
