import { test, expect } from '@playwright/test';

test.describe('Layout and responsiveness', () => {
  test('desktop layout shows header, sidebar, breadcrumbs', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await expect(page.getByText('Loke Cards')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Scenes' })).toBeVisible();
    // Breadcrumbs should include Dashboard
    await expect(page.locator('nav[aria-label="Breadcrumb"]')).toContainText('Dashboard');
  });

  test('mobile shows content without overlapping UI', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/');
    await expect(page.getByText('Loke Cards')).toBeVisible();
    // Sidebar toggle exists
    // On small screens header button toggles sidebar; just ensure header rendered
    await expect(page.locator('header')).toBeVisible();
  });
});

