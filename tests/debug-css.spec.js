import { test } from '@playwright/test';

test('Debug CSS loading', async ({ page }) => {
  // Enable console logging
  page.on('console', msg => console.log('BROWSER:', msg.text()));

  await page.goto('http://127.0.0.1:8081/');

  // Check what resources are loaded
  const resources = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    const styles = Array.from(document.querySelectorAll('style'));
    return {
      stylesheetLinks: links.map(l => l.href),
      inlineStyles: styles.length,
      bodyBgColor: window.getComputedStyle(document.body).backgroundColor,
      hasViteClient: !!document.querySelector('script[src*="@vite/client"]')
    };
  });

  console.log('📊 CSS Debug Info:', JSON.stringify(resources, null, 2));

  // Check if CSS file exists
  const cssResponse = await page.goto('http://127.0.0.1:8081/src/styles/main.css');
  console.log('📄 CSS file status:', cssResponse?.status());

  // Get first 500 chars of CSS
  const cssContent = await page.content();
  console.log('📝 HTML head section:', cssContent.substring(0, 1000));
});
