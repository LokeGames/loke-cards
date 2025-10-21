import { test, expect } from '@playwright/test';

test.describe('PWA Manifest', () => {
  test('has a manifest link and loads manifest.json', async ({ page, request }) => {
    await page.goto('/');
    const link = page.locator('link[rel="manifest"]');
    await expect(link).toHaveAttribute('href', /manifest\.json/);
    const href = await link.getAttribute('href');
    const res = await request.get(href!);
    expect(res.ok()).toBeTruthy();
    const json = await res.json();
    expect(json.name).toContain('Loke');
  });
});

