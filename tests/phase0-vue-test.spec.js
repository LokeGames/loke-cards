import { test, expect } from '@playwright/test';

test.describe.skip('Phase 0.2 - Vue 3 Basic Test (DEPRECATED)', () => {
  test('should load Vue app with Tailwind CSS', async ({ page }) => {
    await page.goto('/');

    // Check page title
    await expect(page).toHaveTitle(/Loke Cards/);

    // Check main heading exists
    const heading = page.locator('h1');
    await expect(heading).toContainText('Loke Cards');

    // Check Vue 3 + Tailwind subtitle
    const subtitle = page.locator('p.text-blue-200');
    await expect(subtitle).toContainText('Vue 3 + Tailwind CSS');

    // Check navigation is visible
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();

    // Check sync status badge
    const syncBadge = page.locator('text=Synced');
    await expect(syncBadge).toBeVisible();

    // Check welcome card
    const welcomeCard = page.locator('h2:has-text("Welcome to Loke Cards")');
    await expect(welcomeCard).toBeVisible();

    // Check stats cards exist
    const scenesCard = page.locator('text=Scenes');
    await expect(scenesCard).toBeVisible();

    const chaptersCard = page.locator('text=Chapters');
    await expect(chaptersCard).toBeVisible();

    const statusCard = page.locator('text=Online');
    await expect(statusCard).toBeVisible();

    // Check Getting Started section
    const gettingStarted = page.locator('h3:has-text("Getting Started")');
    await expect(gettingStarted).toBeVisible();

    // Check responsive test section
    const responsiveTest = page.locator('h3:has-text("Responsive Test")');
    await expect(responsiveTest).toBeVisible();

    console.log('✅ Phase 0.2 Test Passed: Vue 3 + Tailwind CSS working!');
  });

  test('should have proper Tailwind responsive classes', async ({ page }) => {
    await page.goto('/');

    // Check responsive grid exists
    const responsiveGrid = page.locator('.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4');
    await expect(responsiveGrid).toBeVisible();

    console.log('✅ Responsive Tailwind classes working!');
  });

  test('should test mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check page is visible on mobile
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();

    // Check hamburger menu button exists (md:hidden)
    const hamburgerButton = page.locator('nav button');
    await expect(hamburgerButton).toBeVisible();

    console.log('✅ Mobile responsive layout working!');
  });

  test('should test desktop viewport', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    // Check 4-column layout on desktop
    const responsiveGrid = page.locator('.lg\\:grid-cols-4');
    await expect(responsiveGrid).toBeVisible();

    console.log('✅ Desktop responsive layout working!');
  });
});
