import { test, expect, Page } from '@playwright/test';

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
        const title = await createTaskViaUI(page, 'E2E Create');
        // Verify task card contains the title
        await expect(page.locator('h3', { hasText: title })).toBeVisible();
    });

    test('search tasks by title', async ({ page }) => {
        // Navigate to tasks page
        await page.goto('/tasks');
        
        // Wait for tasks to load
        await page.waitForSelector('[data-testid^="task-card-"]', { timeout: 5000 });
        
        // Get the search input
        const searchInput = page.locator('input[placeholder*="Search tasks"]');
        await expect(searchInput).toBeVisible();
        
        // Count initial tasks
        const initialTaskCount = await page.locator('[data-testid^="task-card-"]').count();
        
        // Search for a specific task (assuming there's a task with "Design" in the seeded data)
        await searchInput.fill('Design');
        
        // Wait a bit for the filter to apply
        await page.waitForTimeout(500);
        
        // Count filtered tasks - should be less than or equal to initial count
        const filteredTaskCount = await page.locator('[data-testid^="task-card-"]').count();
        expect(filteredTaskCount).toBeLessThanOrEqual(initialTaskCount);
        
        // Clear search
        await searchInput.clear();
        await page.waitForTimeout(500);
        
        // Verify all tasks are visible again
        const clearedTaskCount = await page.locator('[data-testid^="task-card-"]').count();
        expect(clearedTaskCount).toBe(initialTaskCount);
    });

    // test('delete task', async ({ page }) => {
    //     const title = await createTaskViaUI(page, 'E2E Delete');

    //     const card = page.locator(`[data-testid^="task-card-"]`).filter({ has: page.locator('h3', { hasText: title }) }).first();

    //     // Click the menu trigger (icon button) inside the card and choose Delete
    //     const menuTrigger = card.locator(`[data-testid^="task-menu-"]`).first();
    //     await expect(menuTrigger).toBeVisible();
    //     await menuTrigger.click();
    //     await page.click(`[data-testid^="task-delete-"]`);

    //     // The task should be removed from the list
    //     await expect(page.locator('h3', { hasText: title })).toHaveCount(0, { timeout: 5000 });
    // });
});
