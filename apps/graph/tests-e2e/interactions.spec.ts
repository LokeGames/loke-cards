import { test, expect } from '@playwright/test';

test.describe('Graph Interactions', () => {
  test.beforeEach(async ({ page }) => {
    // Mock initial graph data
    await page.evaluate(() => {
      window.initialGraphData = {
        nodes: [
          { id: 'node_1', type: 'LiteGraph.LGraphNode', label: 'Test Node 1', pos: [100, 100] },
        ],
        edges: [],
      };
    });
    await page.goto('/graph');
    // Wait for the graph canvas to be visible
    await page.waitForSelector('[data-testid="graph-canvas"]');
  });

  test('should load the graph page', async ({ page }) => {
    await expect(page.locator('body')).toContainText('Test Node 1');
  });

  test('should drag a node and trigger worker update', async ({ page }) => {
    const node = page.locator('text=Test Node 1');
    const initialPosition = await node.boundingBox();
    expect(initialPosition).toBeDefined();

    let workerConsoleMessage = '';
    page.on('console', msg => {
      if (msg.text().includes('Node moved')) {
        workerConsoleMessage = msg.text();
      }
    });

    // Drag the node
    await node.dragTo(node, { targetPosition: { x: 50, y: 50 } });

    // Check if the worker console message was captured
    await expect.poll(() => workerConsoleMessage).toContain('Node node_1 moved to');

    // Verify node position changed (visual check, not exact coordinates)
    const newPosition = await node.boundingBox();
    expect(newPosition).toBeDefined();
    expect(newPosition.x).not.toBe(initialPosition.x);
    expect(newPosition.y).not.toBe(initialPosition.y);
  });
});