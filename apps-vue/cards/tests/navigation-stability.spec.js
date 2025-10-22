// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Sidebar navigation stability', () => {
  test('Navigate Scenes ⇄ Dashboard repeatedly without errors', async ({ page }) => {
    /** @type {string[]} */
    const errors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(String(err)));

    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    // Run multiple cycles to catch intermittent issues
    for (let i = 0; i < 3; i++) {
      // Scenes
      await page.getByRole('link', { name: 'Scenes' }).first().click();
      await expect(page.getByRole('heading', { name: 'Scenes' })).toBeVisible();

      // Back to Dashboard
      await page.getByRole('link', { name: 'Dashboard' }).first().click();
      await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    }

    // Chapters → Dashboard
    await page.getByRole('link', { name: 'Chapters' }).first().click();
    await expect(page.getByRole('heading', { name: 'Chapters' })).toBeVisible();
    await page.getByRole('link', { name: 'Dashboard' }).first().click();
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    // Settings → Dashboard
    await page.getByRole('link', { name: 'Settings' }).first().click();
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
    await page.getByRole('link', { name: 'Dashboard' }).first().click();
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    // Assert no console errors (filter out known proxy noise if backend is offline)
    const relevantErrors = errors.filter(e => !/proxy error/i.test(e));
    expect.soft(relevantErrors, `Console errors detected:\n${relevantErrors.join('\n')}`).toHaveLength(0);
  });
});

