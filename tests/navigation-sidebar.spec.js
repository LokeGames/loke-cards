// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Sidebar navigation updates view', () => {
  test('Navigate across all main routes without console errors', async ({ page }) => {
    /** @type {string[]} */
    const errors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(String(err)));

    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    // Scenes
    await page.getByRole('link', { name: 'Scenes' }).first().click();
    await expect(page.getByRole('heading', { name: 'Scenes' })).toBeVisible();

    // Chapters
    await page.getByRole('link', { name: 'Chapters' }).first().click();
    await expect(page.getByRole('heading', { name: 'Chapters' })).toBeVisible();

    // Node View moved to external app; skip here

    // Settings
    await page.getByRole('link', { name: 'Settings' }).first().click();
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();

    // Back to Dashboard (twice to reproduce reported issue)
    await page.getByRole('link', { name: 'Dashboard' }).first().click();
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await page.getByRole('link', { name: 'Dashboard' }).first().click();
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    // Assert no console errors
    expect.soft(errors.filter(e => !e.includes('proxy error')), `Console errors detected:\n${errors.join('\n')}`).toHaveLength(0);
  });
});
