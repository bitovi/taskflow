import { test, expect } from '@playwright/test';

test.describe('Auth flows', () => {
    test('signup, see avatar, and logout', async ({ page }) => {
        // Use a unique email to avoid conflicts
        const email = `e2e-${Date.now()}@example.com`;
        await page.goto('/signup');

        await page.fill('input#name', 'E2E Tester');
        await page.fill('input#email', email);
        await page.fill('input#password', 'testpassword');
        await Promise.all([
            page.waitForNavigation(),
            page.click('button:has-text("Sign Up")'),
        ]);

        // After signup we should be redirected to home and see the avatar
        await expect(page).toHaveURL(/\//);

        // Use a stable test id on the avatar trigger
        const avatarTrigger = page.locator('[data-testid="auth-avatar"]');
        await expect(avatarTrigger).toBeVisible({ timeout: 5000 });
        await avatarTrigger.first().click();
        await page.click('text=Log out');
        await expect(page).toHaveURL(/\/login/);
    });

    test('login with seeded user and logout', async ({ page }) => {
        // Seeded user alice@example.com with password password123
        await page.goto('/login');
        await page.fill('input#email', 'alice@example.com');
        await page.fill('input#password', 'password123');
        await Promise.all([
            page.waitForNavigation(),
            page.click('button:has-text("Log In")'),
        ]);

        await expect(page).toHaveURL(/\//);

        // Use a stable test id on the avatar trigger
        const avatarTrigger = page.locator('[data-testid="auth-avatar"]');
        await expect(avatarTrigger).toBeVisible({ timeout: 5000 });
        await avatarTrigger.first().click();
        await page.click('text=Log out');
        await expect(page).toHaveURL(/\/login/);
    });
});
