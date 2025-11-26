import { test, expect, Page } from '@playwright/test';

// Helper to log in as a seeded user
async function login(page: Page, email = 'alice@example.com', password = 'password123') {
    await page.goto('/login');
    await page.fill('input#email', email);
    await page.fill('input#password', password);
    await Promise.all([
        page.waitForNavigation(),
        page.click('button:has-text("Log\u00A0In")'),
    ]);
    await expect(page).toHaveURL(/\//);
}

// Helper to create a new task via the UI and return the title used
async function createTaskViaUI(page: Page, titlePrefix = 'E2E Task') {
    const title = `${titlePrefix} ${Date.now()}`;
    await page.goto('/tasks/new');
    await page.fill('input#title', title);
    await page.fill('textarea#description', 'Created by e2e test');
    // Use defaults for status/priority/assignee
    await Promise.all([
        page.waitForNavigation(),
        page.click('button:has-text("Create Task")'),
    ]);
    await expect(page).toHaveURL(/\/tasks/);
    // Ensure the new task is visible in the list
    await expect(page.locator('h3', { hasText: title }).first()).toBeVisible({ timeout: 5000 });
    return title;
}

test.describe('Task CRUD flows', () => {
    test('create task', async ({ page }) => {
        await login(page);
        const title = await createTaskViaUI(page, 'E2E Create');
        // Verify task card contains the title
        await expect(page.locator('h3', { hasText: title })).toBeVisible();
    });

    test('edit task via modal form', async ({ page }) => {
        await login(page);
        const title = await createTaskViaUI(page, 'E2E Edit');

        const card = page.locator(`[data-testid^="task-card-"]`).filter({ has: page.locator('h3', { hasText: title }) }).first();

        // Open the dropdown menu and click Edit (scoped to the task card)
        const menuTrigger = card.locator(`[data-testid^="task-menu-"]`).first();
        await expect(menuTrigger).toBeVisible();
        await menuTrigger.click();
        // Dropdown content is rendered in a portal; click the visible edit item
        await page.locator('[data-testid^="task-edit-"]:visible').first().click();

        // In the edit dialog, change the title and save
        const newTitle = `${title} (edited)`;
        const titleInput = page.locator('input#title').first();
        await expect(titleInput).toBeVisible({ timeout: 5000 });
        await titleInput.fill(newTitle);
        await Promise.all([
            // on submit the dialog closes and the UI revalidates
            page.waitForResponse((resp) => resp.url().includes('/api') || resp.status() === 200, { timeout: 5000 }).catch(() => true),
            page.click('button:has-text("Save Changes")'),
        ]);

        // Verify the updated title is visible
        await expect(page.locator('h3', { hasText: newTitle })).toBeVisible({ timeout: 5000 });
    });

    test('delete task', async ({ page }) => {
        await login(page);
        const title = await createTaskViaUI(page, 'E2E Delete');

        const card = page.locator(`[data-testid^="task-card-"]`).filter({ has: page.locator('h3', { hasText: title }) }).first();

        // Click the menu trigger (icon button) inside the card and choose Delete
        const menuTrigger = card.locator(`[data-testid^="task-menu-"]`).first();
        await expect(menuTrigger).toBeVisible();
        await menuTrigger.click();
        await page.click(`[data-testid^="task-delete-"]`);

        // The task should be removed from the list
        await expect(page.locator('h3', { hasText: title })).toHaveCount(0, { timeout: 5000 });
    });
});
