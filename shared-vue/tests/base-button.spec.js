import { test, expect } from '@playwright/test';

// DEPRECATED: Test route /test/base-button doesn't exist in app
// BaseButton is tested indirectly through other component tests
test.describe.skip('BaseButton component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/base-button');
  });

  test('should display primary button', async ({ page }) => {
    const primaryButton = page.getByText('Primary Button');
    await expect(primaryButton).toBeVisible();
    await expect(primaryButton).toHaveCSS('background-color', 'rgb(37, 99, 235)'); // Tailwind blue-600
  });

  test('should display secondary button', async ({ page }) => {
    const secondaryButton = page.getByText('Secondary Button');
    await expect(secondaryButton).toBeVisible();
    await expect(secondaryButton).toHaveCSS('background-color', 'rgb(229, 231, 235)'); // Tailwind gray-200
  });

  test('should display danger button', async ({ page }) => {
    const dangerButton = page.getByText('Danger Button');
    await expect(dangerButton).toBeVisible();
    await expect(dangerButton).toHaveCSS('background-color', 'rgb(220, 38, 38)'); // Tailwind red-600
  });

  test('should display success button', async ({ page }) => {
    const successButton = page.getByText('Success Button');
    await expect(successButton).toBeVisible();
    await expect(successButton).toHaveCSS('background-color', 'rgb(22, 163, 74)'); // Tailwind green-600
  });

  test('should display ghost button', async ({ page }) => {
    const ghostButton = page.getByText('Ghost Button');
    await expect(ghostButton).toBeVisible();
    await expect(ghostButton).toHaveCSS('color', 'rgb(55, 65, 81)'); // Tailwind gray-700
  });

  test('should display small button', async ({ page }) => {
    const smallButton = page.getByText('Small Button');
    await expect(smallButton).toBeVisible();
    await expect(smallButton).toHaveCSS('font-size', '14px'); // Tailwind text-sm
  });

  test('should display medium button', async ({ page }) => {
    const mediumButton = page.getByText('Medium Button');
    await expect(mediumButton).toBeVisible();
    await expect(mediumButton).toHaveCSS('font-size', '16px'); // Tailwind text-base
  });

  test('should display large button', async ({ page }) => {
    const largeButton = page.getByText('Large Button');
    await expect(largeButton).toBeVisible();
    await expect(largeButton).toHaveCSS('font-size', '18px'); // Tailwind text-lg
  });

  test('should display loading button', async ({ page }) => {
    const loadingButton = page.getByText('Loading Button');
    await expect(loadingButton).toBeVisible();
    await expect(loadingButton).toBeDisabled();
    await expect(page.locator('svg.animate-spin')).toBeVisible();
  });
});
