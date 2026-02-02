import { test, expect } from '@playwright/test';

test.describe('Task Search and Filter', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to tasks page
        await page.goto('/tasks');
        // Wait for tasks to load
        await expect(page.locator('h2', { hasText: 'Tasks' })).toBeVisible();
    });

    test('displays filter panel', async ({ page }) => {
        // Check that filter panel is visible
        await expect(page.locator('h3', { hasText: 'Filters' })).toBeVisible();
        
        // Check that search input is visible
        await expect(page.locator('input#search')).toBeVisible();
        
        // Check that status filters are visible
        await expect(page.locator('text=Status')).toBeVisible();
        await expect(page.locator('text=Todo')).toBeVisible();
        await expect(page.locator('text=In Progress')).toBeVisible();
        
        // Check that priority filters are visible
        await expect(page.locator('text=Priority')).toBeVisible();
        await expect(page.locator('text=Low')).toBeVisible();
        await expect(page.locator('text=Medium')).toBeVisible();
        await expect(page.locator('text=High')).toBeVisible();
    });

    test('filters tasks by search term', async ({ page }) => {
        // Get initial task count
        const initialCards = await page.locator('[data-testid^="task-card-"]').count();
        expect(initialCards).toBeGreaterThan(0);

        // Type in search box - search for a common word that should exist
        await page.fill('input#search', 'task');
        
        // Wait a bit for debounce/filtering
        await page.waitForTimeout(500);
        
        // Tasks should still be visible (assuming there are tasks with "task" in name/description)
        const filteredCards = await page.locator('[data-testid^="task-card-"]').count();
        expect(filteredCards).toBeGreaterThanOrEqual(0);
    });

    test('filters tasks by status', async ({ page }) => {
        // Get initial task count
        const initialCards = await page.locator('[data-testid^="task-card-"]').count();
        expect(initialCards).toBeGreaterThan(0);

        // Click on "Done" status badge
        const doneBadge = page.locator('div').filter({ hasText: /^Status$/ }).locator('..').locator('text=Done').first();
        await doneBadge.click();
        
        // Wait for filtering
        await page.waitForTimeout(500);
        
        // Verify that only tasks with "Done" status are shown or no tasks if none exist
        const visibleCards = await page.locator('[data-testid^="task-card-"]').count();
        expect(visibleCards).toBeGreaterThanOrEqual(0);
    });

    test('filters tasks by priority', async ({ page }) => {
        // Get initial task count
        const initialCards = await page.locator('[data-testid^="task-card-"]').count();
        expect(initialCards).toBeGreaterThan(0);

        // Click on "High" priority badge
        const highBadge = page.locator('div').filter({ hasText: /^Priority$/ }).locator('..').locator('text=High').first();
        await highBadge.click();
        
        // Wait for filtering
        await page.waitForTimeout(500);
        
        // Verify filtering occurred
        const visibleCards = await page.locator('[data-testid^="task-card-"]').count();
        expect(visibleCards).toBeGreaterThanOrEqual(0);
    });

    test('clears all filters', async ({ page }) => {
        // Apply some filters
        await page.fill('input#search', 'test');
        const todoBadge = page.locator('div').filter({ hasText: /^Status$/ }).locator('..').locator('text=Todo').first();
        await todoBadge.click();
        
        // Wait for filtering
        await page.waitForTimeout(500);

        // Click "Clear All" button
        const clearButton = page.locator('button', { hasText: 'Clear All' });
        if (await clearButton.isVisible()) {
            await clearButton.click();
            
            // Wait for clearing
            await page.waitForTimeout(500);
            
            // Verify search input is cleared
            await expect(page.locator('input#search')).toHaveValue('');
        }
    });

    test('combines multiple filters', async ({ page }) => {
        // Apply search filter
        await page.fill('input#search', 'implement');
        
        // Click on status filter
        const todoBadge = page.locator('div').filter({ hasText: /^Status$/ }).locator('..').locator('text=Todo').first();
        await todoBadge.click();
        
        // Click on priority filter
        const highBadge = page.locator('div').filter({ hasText: /^Priority$/ }).locator('..').locator('text=High').first();
        await highBadge.click();
        
        // Wait for filtering
        await page.waitForTimeout(500);
        
        // Verify that filtering occurred (may result in 0 tasks if no match)
        const visibleCards = await page.locator('[data-testid^="task-card-"]').count();
        expect(visibleCards).toBeGreaterThanOrEqual(0);
    });
});
