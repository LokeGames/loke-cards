// Offline-first scaffold: kept skipped until Phase 7 completes.
// Tip: run dev server on 8081 (`npm run dev`) before tests.

import { test, expect } from '@playwright/test';

test.describe.skip('Offline app-shell navigation', () => {
  test('loads index while offline after first visit', async ({ context, page }) => {
    // First, go online and visit once to warm caches
    await context.setOffline(false);
    await page.goto('http://127.0.0.1:8081/');
    await expect(page.getByText('Loke Cards')).toBeVisible();

    // Now go offline and reload
    await context.setOffline(true);
    await page.reload();

    // App shell should still render (from cache)
    await expect(page.getByText('Loke Cards')).toBeVisible();
  });
});

