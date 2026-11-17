import { defineConfig, devices } from '@playwright/test';

const PORT = 4321;

export default defineConfig({
  testDir: 'tests/e2e',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['github']] : 'list',
  use: {
    // Trailing slash matters: page.goto('./') resolves to the site root under base.
    baseURL: `http://127.0.0.1:${PORT}/deutsch-regeln/`,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'phone', use: { ...devices['Pixel 7'] } },
  ],
  // Tests run against the production build, as deployed (Pagefind only exists there).
  webServer: {
    command: `npm run build && npm run preview -- --host 127.0.0.1 --port ${PORT}`,
    url: `http://127.0.0.1:${PORT}/deutsch-regeln/`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
