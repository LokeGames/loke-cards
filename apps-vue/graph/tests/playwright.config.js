import { defineConfig, devices } from '@playwright/test';

const BASE_URL = 'http://localhost:8092';

export default defineConfig({
  testDir: '.', // Test directory is the current directory
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 4,
  reporter: 'html',
  timeout: 30000,
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    actionTimeout: 10000,
    navigationTimeout: 10000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev:graph',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
  },
});
