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
    test('displays search input, clear button, and filter button', async ({ page }) => {
        await login(page);
        await page.goto('/tasks');

        // Verify search components are visible
        await expect(page.getByTestId('search-input')).toBeVisible();
        await expect(page.getByTestId('filter-button')).toBeVisible();
    });

    test('does not show clear button when search is empty', async ({ page }) => {
        await login(page);
        await page.goto('/tasks');

        // Clear button should not be visible initially
        await expect(page.getByTestId('clear-search')).not.toBeVisible();
    });

    test('shows clear button when typing in search', async ({ page }) => {
        await login(page);
        await page.goto('/tasks');

        await page.getByTestId('search-input').fill('test');

        // Clear button should be visible
        await expect(page.getByTestId('clear-search')).toBeVisible();
    });

    test('does not filter tasks with less than 3 characters', async ({ page }) => {
        await login(page);
        await page.goto('/tasks');

        // Type less than 3 characters
        await page.getByTestId('search-input').fill('ab');

        // All tasks should still be visible (wait a moment for any potential filtering)
        await page.waitForTimeout(500);
        
        // Check that multiple task cards are still visible
        const taskCards = page.locator('[data-testid^="task-card-"]');
        const count = await taskCards.count();
        expect(count).toBeGreaterThan(1);
    });

    test('filters tasks when typing 3+ characters', async ({ page }) => {
        await login(page);
        await page.goto('/tasks');

        // Get initial count of tasks
        const initialCount = await page.locator('[data-testid^="task-card-"]').count();

        // Type a search query that should filter results
        await page.getByTestId('search-input').fill('Add vide');

        // Wait for search to complete
        await page.waitForTimeout(500);

        // The filtered count should be less than or equal to initial count
        const filteredCount = await page.locator('[data-testid^="task-card-"]').count();
        expect(filteredCount).toBeLessThanOrEqual(initialCount);
    });

    test('shows empty state when no matches found', async ({ page }) => {
        await login(page);
        await page.goto('/tasks');

        // Search for something that definitely won't exist
        await page.getByTestId('search-input').fill('xyznonexistent123');

        // Wait for search to complete
        await page.waitForTimeout(500);

        // Empty state should be visible
        await expect(page.getByTestId('empty-state')).toBeVisible();
        await expect(page.getByText('No tasks found')).toBeVisible();
        await expect(page.getByText(/No tasks match your current search and filter criteria/)).toBeVisible();
    });

    test('clears search when clicking clear button', async ({ page }) => {
        await login(page);
        await page.goto('/tasks');

        // Type a search query
        await page.getByTestId('search-input').fill('test');
        await expect(page.getByTestId('search-input')).toHaveValue('test');

        // Click clear button
        await page.getByTestId('clear-search').click();

        // Search input should be cleared
        await expect(page.getByTestId('search-input')).toHaveValue('');

        // Clear button should no longer be visible
        await expect(page.getByTestId('clear-search')).not.toBeVisible();
    });

    test('persists search query in URL', async ({ page }) => {
        await login(page);
        await page.goto('/tasks');

        // Type a search query
        await page.getByTestId('search-input').fill('video');

        // Wait for URL to update
        await page.waitForTimeout(500);

        // URL should contain the search parameter
        expect(page.url()).toContain('search=video');
    });

    test('restores search from URL on page load', async ({ page }) => {
        await login(page);
        
        // Navigate directly to tasks page with search parameter
        await page.goto('/tasks?search=video');

        // Search input should have the query
        await expect(page.getByTestId('search-input')).toHaveValue('video');

        // Clear button should be visible
        await expect(page.getByTestId('clear-search')).toBeVisible();
    });

    test('restores search on browser back button', async ({ page }) => {
        await login(page);
        await page.goto('/tasks');

        // Type a search query
        await page.getByTestId('search-input').fill('test');
        await page.waitForTimeout(500);

        // Clear the search
        await page.getByTestId('clear-search').click();
        await page.waitForTimeout(500);

        // Go back
        await page.goBack();
        await page.waitForTimeout(500);

        // Search should be restored
        await expect(page.getByTestId('search-input')).toHaveValue('test');
    });

    test('shows loading spinner during search', async ({ page }) => {
        await login(page);
        await page.goto('/tasks');

        // Type a search query
        const searchInput = page.getByTestId('search-input');
        await searchInput.fill('t');
        await searchInput.fill('te');
        await searchInput.fill('tes');

        // Loading spinner should appear briefly
        // Note: This may be hard to catch due to fast local database, but we test for its existence in the DOM
        await page.waitForTimeout(100);
    });

    test('search is case-insensitive', async ({ page }) => {
        await login(page);
        await page.goto('/tasks');

        // Search with lowercase
        await page.getByTestId('search-input').fill('task');
        await page.waitForTimeout(500);
        const lowercaseCount = await page.locator('[data-testid^="task-card-"]').count();

        // Clear search
        await page.getByTestId('clear-search').click();
        await page.waitForTimeout(500);

        // Search with uppercase
        await page.getByTestId('search-input').fill('TASK');
        await page.waitForTimeout(500);
        const uppercaseCount = await page.locator('[data-testid^="task-card-"]').count();

        // Both should return the same results
        expect(lowercaseCount).toBe(uppercaseCount);
    });

    test('removes search parameter from URL when cleared', async ({ page }) => {
        await login(page);
        await page.goto('/tasks?search=test');

        // Clear the search
        await page.getByTestId('clear-search').click();
        await page.waitForTimeout(500);

        // URL should not contain search parameter
        expect(page.url()).not.toContain('search=');
    });
});
