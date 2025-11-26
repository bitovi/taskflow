import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: 'tests/e2e',
    globalSetup: require.resolve('./tests/e2e/global-setup.js'),
    globalTeardown: require.resolve('./tests/e2e/global-teardown.js'),
    timeout: 30 * 1000,
    expect: { timeout: 5000 },
    fullyParallel: true,
    retries: 0,
    workers: 1,
    use: {
        headless: true,
        viewport: { width: 1280, height: 720 },
        actionTimeout: 5000,
        baseURL: 'http://localhost:3000',
        trace: 'on-first-retry',
    },
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    ],
});
