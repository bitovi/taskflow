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

test.describe('Task Search', () => {
    test('displays search input with icons', async ({ page }) => {
        await login(page);
        await page.goto('/tasks');

        // Verify search input is visible
        const searchInput = page.locator('input[placeholder="Search tasks..."]');
        await expect(searchInput).toBeVisible();

        // Verify filter button is visible (but disabled)
        const filterButton = page.locator('[data-testid="filter-button"]');
        await expect(filterButton).toBeVisible();
        await expect(filterButton).toBeDisabled();
    });

    test('shows all tasks initially with no search', async ({ page }) => {
        await login(page);
        await page.goto('/tasks');

        // Wait for tasks to load
        const taskCards = page.locator('[data-testid^="task-card-"]');
        await expect(taskCards.first()).toBeVisible();

        // Should have multiple tasks
        const count = await taskCards.count();
        expect(count).toBeGreaterThan(0);
    });

    test('does not filter with less than 3 characters', async ({ page }) => {
        await login(page);
        await page.goto('/tasks');

        const searchInput = page.locator('input[placeholder="Search tasks..."]');
        const initialTaskCards = page.locator('[data-testid^="task-card-"]');
        const initialCount = await initialTaskCards.count();

        // Type 1-2 characters
        await searchInput.fill('te');
        await page.waitForTimeout(500);

        // Should still show all tasks
        const afterCount = await initialTaskCards.count();
        expect(afterCount).toBe(initialCount);
    });

    test('filters tasks with 3+ characters', async ({ page }) => {
        await login(page);
        await page.goto('/tasks');

        const searchInput = page.locator('input[placeholder="Search tasks..."]');
        
        // Type at least 3 characters
        await searchInput.fill('Add');
        
        // Wait for navigation/update
        await page.waitForTimeout(1000);

        // Should show loading or filtered results
        const taskCards = page.locator('[data-testid^="task-card-"]');
        
        // Wait for the page to stabilize
        await page.waitForLoadState('networkidle');

        // Verify URL contains search param
        expect(page.url()).toContain('search=Add');
    });

    test('shows empty state when no results match', async ({ page }) => {
        await login(page);
        await page.goto('/tasks');

        const searchInput = page.locator('input[placeholder="Search tasks..."]');
        
        // Type a search that won't match anything
        await searchInput.fill('xyzabc123notfound');
        
        // Wait for the search to complete
        await page.waitForTimeout(1000);
        await page.waitForLoadState('networkidle');

        // Should show empty state
        const emptyStateHeading = page.locator('h3:has-text("No tasks found")');
        await expect(emptyStateHeading).toBeVisible();

        const emptyStateMessage = page.locator('text=No tasks match your current search');
        await expect(emptyStateMessage).toBeVisible();
    });

    test('clears search when X button is clicked', async ({ page }) => {
        await login(page);
        await page.goto('/tasks');

        const searchInput = page.locator('input[placeholder="Search tasks..."]');
        
        // Type a search
        await searchInput.fill('test');
        await page.waitForTimeout(500);

        // Click the clear button
        const clearButton = page.locator('button[aria-label="Clear search"]');
        await expect(clearButton).toBeVisible();
        await clearButton.click();

        // Search input should be empty
        await expect(searchInput).toHaveValue('');

        // URL should not have search param
        await page.waitForTimeout(500);
        expect(page.url()).not.toContain('search=');
    });

    test('persists search query in URL', async ({ page }) => {
        await login(page);
        await page.goto('/tasks');

        const searchInput = page.locator('input[placeholder="Search tasks..."]');
        
        // Type a search query
        await searchInput.fill('test search');
        
        // Wait for URL to update
        await page.waitForTimeout(1000);
        await page.waitForLoadState('networkidle');

        // Verify URL contains the search query
        expect(page.url()).toContain('search=test+search');

        // Reload the page
        await page.reload();

        // Search query should still be in the input
        await expect(searchInput).toHaveValue('test search');

        // URL should still contain the search query
        expect(page.url()).toContain('search=test+search');
    });

    test('handles browser back button', async ({ page }) => {
        await login(page);
        await page.goto('/tasks');

        const searchInput = page.locator('input[placeholder="Search tasks..."]');
        
        // Perform a search
        await searchInput.fill('first');
        await page.waitForTimeout(1000);
        await page.waitForLoadState('networkidle');
        
        // Verify first search is in URL
        expect(page.url()).toContain('search=first');

        // Perform another search
        await searchInput.fill('second');
        await page.waitForTimeout(1000);
        await page.waitForLoadState('networkidle');
        
        // Verify second search is in URL
        expect(page.url()).toContain('search=second');

        // Go back
        await page.goBack();
        await page.waitForTimeout(1000);
        await page.waitForLoadState('networkidle');

        // Should show first search in URL
        expect(page.url()).toContain('search=first');
        
        // Input should eventually sync with URL (give it time to hydrate)
        await expect(searchInput).toHaveValue('first', { timeout: 3000 });
    });
});
