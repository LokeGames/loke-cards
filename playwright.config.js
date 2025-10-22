import { defineConfig, devices } from '@playwright/test';

// Cards app (SvelteKit in /cards)
const CARDS_BASE = process.env.PW_CARDS_BASE_URL || 'http://127.0.0.1:5173';
// Front shell (SvelteKit in /apps/front)
const FRONT_BASE = process.env.PW_FRONT_BASE_URL || 'http://127.0.0.1:5183';

const config = defineConfig({
  testDir: '.',
  testMatch: [
    'cards/tests-e2e/**/*.spec.ts',
    'apps/front/tests-e2e/**/*.spec.ts',
    'apps/graph/tests-e2e/**/*.spec.ts',
  ],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 4,
  reporter: 'html',
  timeout: 60000,
  use: {
    trace: 'on-first-retry',
    actionTimeout: 10000,
    navigationTimeout: 10000,
  },

  projects: [
    {
      name: 'cards-chromium',
      testDir: 'cards/tests-e2e',
      use: { ...devices['Desktop Chrome'], baseURL: CARDS_BASE },
    },
    {
      name: 'front-chromium',
      testDir: 'apps/front/tests-e2e',
      use: { ...devices['Desktop Chrome'], baseURL: FRONT_BASE },
    },
  ],
});

// Optional auto web servers per project
if (process.env.PW_WEB_SERVER_CARDS) {
  // @ts-ignore add per-project webServer config when running cards project
  config.projects.find(p => p.name === 'cards-chromium').webServer = {
    command: 'npm run dev:cards',
    url: CARDS_BASE,
    reuseExistingServer: !process.env.CI,
  };
}
if (process.env.PW_WEB_SERVER_FRONT) {
  // @ts-ignore add per-project webServer config when running front project
  config.projects.find(p => p.name === 'front-chromium').webServer = {
    command: 'npm run dev:front',
    url: FRONT_BASE,
    reuseExistingServer: !process.env.CI,
  };
}

export default config;
