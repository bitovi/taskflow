import { test, expect } from '@playwright/test';

test.describe('Auth flows', () => {

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
