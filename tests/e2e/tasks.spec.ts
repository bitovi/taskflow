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

test.describe('Task Search', () => {
    test('search tasks by title', async ({ page }) => {
        await page.goto('/tasks');
        
        // Wait for tasks to load
        await page.waitForSelector('[data-testid^="task-card-"]', { timeout: 5000 });
        
        // Get initial task count
        const initialCount = await page.locator('[data-testid^="task-card-"]').count();
        expect(initialCount).toBeGreaterThan(0);
        
        // Find a task to search for
        const firstTask = page.locator('[data-testid^="task-card-"]').first();
        const firstTaskTitle = await firstTask.locator('h3').first().textContent();
        
        if (!firstTaskTitle) {
            throw new Error('No task title found');
        }
        
        // Extract just the task name (remove TASK-# badge if present)
        const taskName = firstTaskTitle.split('TASK-')[0].trim();
        
        // Search for the first few characters of the task name
        const searchTerm = taskName.substring(0, 5);
        await page.fill('[data-testid="task-search-input"]', searchTerm);
        
        // Verify the searched task is still visible
        await expect(page.locator('h3', { hasText: taskName })).toBeVisible();
    });
    
    test('search shows no results message when no matches', async ({ page }) => {
        await page.goto('/tasks');
        
        // Search for something that doesn't exist
        await page.fill('[data-testid="task-search-input"]', 'xyznonexistentquery123');
        
        // Verify no results message appears
        await expect(page.locator('text=No tasks found matching your search.')).toBeVisible();
        
        // Verify no task cards are visible
        const taskCount = await page.locator('[data-testid^="task-card-"]').count();
        expect(taskCount).toBe(0);
    });
    
    test('search updates results in real-time', async ({ page }) => {
        await page.goto('/tasks');
        
        // Wait for tasks to load
        await page.waitForSelector('[data-testid^="task-card-"]', { timeout: 5000 });
        const initialCount = await page.locator('[data-testid^="task-card-"]').count();
        
        // Type a search query
        await page.fill('[data-testid="task-search-input"]', 'test');
        await page.waitForTimeout(100); // Brief wait for filtering
        
        // Clear the search
        await page.fill('[data-testid="task-search-input"]', '');
        await page.waitForTimeout(100); // Brief wait for filtering
        
        const clearedCount = await page.locator('[data-testid^="task-card-"]').count();
        
        // After clearing, we should see all tasks again
        expect(clearedCount).toBe(initialCount);
    });
});
