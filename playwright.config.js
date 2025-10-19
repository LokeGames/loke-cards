import { defineConfig, devices } from '@playwright/test';

// Allow overriding the base URL, e.g.: PW_BASE_URL=http://127.0.0.1:8083 npm test
const BASE_URL = process.env.PW_BASE_URL || 'http://127.0.0.1:8081';

const config = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
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
    command: 'npm run dev',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
  };
}

export default config;
