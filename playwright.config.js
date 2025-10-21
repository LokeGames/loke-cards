import { defineConfig, devices } from '@playwright/test';

// Allow overriding the base URL, e.g.: PW_BASE_URL=http://127.0.0.1:5174 npm test
const BASE_URL = process.env.PW_BASE_URL || 'http://127.0.0.1:5173';

const config = defineConfig({
  // Limit E2E to Svelte app (none yet by default)
  testDir: ['./cards/tests-e2e'],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 4, // Limit to 4 workers for better stability
  reporter: 'html',
  timeout: 30000, // 30s default timeout per test
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    actionTimeout: 10000, // 10s for actions like click, fill
    navigationTimeout: 10000, // 10s for page navigations
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

// Optional: let Playwright start the dev server when PW_WEB_SERVER=1
if (process.env.PW_WEB_SERVER) {
  config.webServer = {
    command: 'npm run dev:cards',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
  };
}

export default config;
