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
        baseURL: process.env.BASE_URL || 'http://localhost:3000',
        trace: 'on-first-retry',
    },
    projects: [
        // Setup project to authenticate once
        {
            name: 'setup',
            testMatch: /auth\.setup\.ts/,
        },
        // Auth tests run without stored state (testing login/logout)
        {
            name: 'auth-tests',
            testMatch: /auth\.spec\.ts/,
            use: {
                ...devices['Desktop Chrome'],
                launchOptions: {
                    args: ['--no-sandbox'],
                },
            },
        },
        // Main test project that depends on setup
        {
            name: 'chromium',
            testMatch: /.*\.spec\.ts/,
            testIgnore: /auth\.spec\.ts/,
            use: {
                ...devices['Desktop Chrome'],
                launchOptions: {
                    args: ['--no-sandbox'],
                },
                // Use stored authentication state
                storageState: '.auth/user.json',
            },
            dependencies: ['setup'],
        },
    ],
});
