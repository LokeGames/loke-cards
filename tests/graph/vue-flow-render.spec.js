import { test, expect } from '@playwright/test';

test.describe('Graph App - Vue Flow Rendering', () => {
  test('should render Vue Flow canvas on Global Graph', async ({ page }) => {
    // Navigate to graph app
    await page.goto('http://localhost:8092');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Wait a bit for Vue Flow to initialize
    await page.waitForTimeout(2000);

    // Take screenshot for debugging
    await page.screenshot({ path: 'tests/graph/screenshots/global-graph.png', fullPage: true });

    // Check that Vue Flow container exists
    const vueFlowContainer = page.locator('.vue-flow');
    await expect(vueFlowContainer).toBeVisible();

    // Check that the container has actual size
    const box = await vueFlowContainer.boundingBox();
    expect(box).not.toBeNull();
    expect(box.width).toBeGreaterThan(0);
    expect(box.height).toBeGreaterThan(0);

    console.log(`Vue Flow size: ${box.width}x${box.height}`);

    // Check for Vue Flow internal elements
    const vueFlowViewport = page.locator('.vue-flow__viewport');
    await expect(vueFlowViewport).toBeVisible();

    // Check if nodes are rendered
    const nodes = page.locator('.vue-flow__node');
    const nodeCount = await nodes.count();
    console.log(`Found ${nodeCount} nodes`);
    expect(nodeCount).toBeGreaterThan(0);

    // Check buttons are visible
    await expect(page.getByRole('button', { name: 'Fit View' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Auto Layout' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save Layout' })).toBeVisible();
  });

  test('should render chapter graph', async ({ page }) => {
    // Navigate to chapter01 graph
    await page.goto('http://localhost:8092/chapter/chapter01');

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Take screenshot
    await page.screenshot({ path: 'tests/graph/screenshots/chapter-graph.png', fullPage: true });

    // Check Vue Flow is visible
    const vueFlowContainer = page.locator('.vue-flow');
    await expect(vueFlowContainer).toBeVisible();

    // Check nodes
    const nodes = page.locator('.vue-flow__node');
    const nodeCount = await nodes.count();
    console.log(`Chapter graph has ${nodeCount} nodes`);
    expect(nodeCount).toBeGreaterThan(0);
  });
});
