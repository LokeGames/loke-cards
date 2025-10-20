import { test } from '@playwright/test';

test.describe('Visual Testing - Screenshots', () => {
  test('Mobile viewport (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForTimeout(1000); // Wait for CSS to load
    await page.screenshot({ path: 'screenshots/mobile-375px.png', fullPage: true });
    console.log('📱 Mobile screenshot saved: screenshots/mobile-375px.png');
  });

  test('Tablet viewport (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/tablet-768px.png', fullPage: true });
    console.log('📱 Tablet screenshot saved: screenshots/tablet-768px.png');
  });

  test('Desktop viewport (1920px)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/desktop-1920px.png', fullPage: true });
    console.log('💻 Desktop screenshot saved: screenshots/desktop-1920px.png');
  });
});
