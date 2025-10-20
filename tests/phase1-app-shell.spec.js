/**
 * Phase 1 App Shell Layout Tests
 * Tests the full-screen application layout with header, sidebar, and dark mode
 */

import { test, expect } from '@playwright/test';

test.describe('Phase 1 - App Shell Layout', () => {
  test('should display app shell with header and sidebar', async ({ page }) => {
    await page.goto('/');

    // Wait for Vue to mount
    await page.waitForSelector('#app', { timeout: 5000 });

    // Check header is visible
    const header = page.locator('header');
    await expect(header).toBeVisible();
    await expect(header).toContainText('Loke Cards');

    // Check sidebar is visible on desktop (hidden on mobile)
    const desktopSidebar = page.locator('aside.hidden.md\\:block');
    await expect(desktopSidebar).toBeVisible();

    // Check main content area exists
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('should have dark mode toggle in header', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('header', { timeout: 5000 });

    // Check theme toggle button exists
    const themeToggle = page.locator('button').filter({ hasText: /[🌙☀️]/ });
    await expect(themeToggle).toBeVisible();
  });

  test('should toggle dark mode when clicking theme button', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('header', { timeout: 5000 });

    // Get initial theme
    const html = page.locator('html');
    const initialHasDark = await html.evaluate(el => el.classList.contains('dark'));

    // Click theme toggle
    const themeToggle = page.locator('button').filter({ hasText: /[🌙☀️]/ });
    await themeToggle.click();

    // Wait for dark class to change
    await page.waitForFunction(
      (hadDark) => document.documentElement.classList.contains('dark') !== hadDark,
      initialHasDark
    );

    // Check theme changed
    const newHasDark = await html.evaluate(el => el.classList.contains('dark'));
    expect(newHasDark).toBe(!initialHasDark);
  });

  test('should have responsive sidebar on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForSelector('header', { timeout: 5000 });

    // Desktop sidebar should be hidden on mobile
    const desktopSidebar = page.locator('aside.hidden.md\\:block');
    await expect(desktopSidebar).not.toBeVisible();

    // Check hamburger menu button exists
    const hamburger = page.locator('header button').first();
    await expect(hamburger).toBeVisible();
  });

  test('should have StatusPill in header', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('header', { timeout: 5000 });

    // Check status pill exists
    const statusPill = page.locator('span').filter({ hasText: 'Synced' });
    await expect(statusPill).toBeVisible();
  });

  test('should have full viewport layout (h-screen w-screen)', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#app', { timeout: 5000 });

    // Check main #app container (the rendered Vue component, not placeholder)
    await expect(page.locator('#app.h-screen')).toBeVisible();
    await expect(page.locator('#app.w-screen')).toBeVisible();
  });

  test('should navigate between routes', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('aside.hidden.md\\:block', { timeout: 5000 });

    // Click on Scenes link in desktop sidebar
    const scenesLink = page.locator('aside.hidden.md\\:block a[href="/scenes"]');
    await scenesLink.click();

    // Wait for navigation
    await page.waitForURL('**/scenes');

    // Check URL changed
    expect(page.url()).toContain('/scenes');
  });
});
