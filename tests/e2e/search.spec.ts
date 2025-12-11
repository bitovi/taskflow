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

// Helper to create a new task via the UI
async function createTaskViaUI(page: Page, title: string, description: string) {
    await page.goto('/tasks/new');
    await page.fill('input#title', title);
    await page.fill('textarea#description', description);
    await Promise.all([
        page.waitForNavigation(),
        page.click('button:has-text("Create Task")'),
    ]);
    await expect(page).toHaveURL(/\/tasks/);
}

test.describe('Task Search', () => {
    test.beforeEach(async ({ page }) => {
        await login(page);
        
        // Create some test tasks with unique titles
        const timestamp = Date.now();
        await createTaskViaUI(page, `Video Upload Feature ${timestamp}`, 'Add video upload functionality to the app');
        await createTaskViaUI(page, `Image Processing ${timestamp}`, 'Process images before upload');
        await createTaskViaUI(page, `Database Migration ${timestamp}`, 'Migrate database schema');
    });

    test('search input is visible with placeholder', async ({ page }) => {
        await page.goto('/tasks');
        const searchInput = page.getByTestId('search-input');
        await expect(searchInput).toBeVisible();
        await expect(searchInput).toHaveAttribute('placeholder', 'Search tasks...');
    });

    test('filter button is visible', async ({ page }) => {
        await page.goto('/tasks');
        const filterButton = page.getByTestId('filter-button');
        await expect(filterButton).toBeVisible();
    });

    test('does not filter with less than 3 characters', async ({ page }) => {
        await page.goto('/tasks');
        const searchInput = page.getByTestId('search-input');
        
        // Type 2 characters
        await searchInput.fill('Vi');
        
        // Wait a moment for any potential filtering
        await page.waitForTimeout(500);
        
        // All tasks should still be visible
        await expect(page.locator('h3:has-text("Video Upload Feature")')).toBeVisible();
        await expect(page.locator('h3:has-text("Image Processing")')).toBeVisible();
        await expect(page.locator('h3:has-text("Database Migration")')).toBeVisible();
    });

    test('filters tasks with 3 or more characters', async ({ page }) => {
        const timestamp = Date.now();
        await page.goto('/tasks');
        const searchInput = page.getByTestId('search-input');
        
        // Search for "Video"
        await searchInput.fill('Video');
        
        // Wait for search to complete
        await page.waitForTimeout(500);
        
        // Only the Video Upload task should be visible
        await expect(page.locator('h3:has-text("Video Upload Feature")')).toBeVisible();
        await expect(page.locator('h3:has-text("Image Processing")')).not.toBeVisible();
        await expect(page.locator('h3:has-text("Database Migration")')).not.toBeVisible();
    });

    test('search is case-insensitive', async ({ page }) => {
        await page.goto('/tasks');
        const searchInput = page.getByTestId('search-input');
        
        // Search with lowercase
        await searchInput.fill('video');
        
        // Wait for search to complete
        await page.waitForTimeout(500);
        
        // Video Upload task should be visible
        await expect(page.locator('h3:has-text("Video Upload Feature")')).toBeVisible();
    });

    test('shows clear button when search query is present', async ({ page }) => {
        await page.goto('/tasks');
        const searchInput = page.getByTestId('search-input');
        
        // Initially, clear button should not be visible
        await expect(page.getByTestId('clear-search')).not.toBeVisible();
        
        // Type in search input
        await searchInput.fill('test');
        
        // Clear button should now be visible
        await expect(page.getByTestId('clear-search')).toBeVisible();
    });

    test('clears search when clear button is clicked', async ({ page }) => {
        await page.goto('/tasks');
        const searchInput = page.getByTestId('search-input');
        
        // Search for something
        await searchInput.fill('Video');
        await page.waitForTimeout(500);
        
        // Click clear button
        await page.getByTestId('clear-search').click();
        
        // Search input should be empty
        await expect(searchInput).toHaveValue('');
        
        // All tasks should be visible again
        await expect(page.locator('h3:has-text("Video Upload Feature")')).toBeVisible();
        await expect(page.locator('h3:has-text("Image Processing")')).toBeVisible();
        await expect(page.locator('h3:has-text("Database Migration")')).toBeVisible();
    });

    test('shows empty state when no tasks match', async ({ page }) => {
        await page.goto('/tasks');
        const searchInput = page.getByTestId('search-input');
        
        // Search for something that doesn't exist
        await searchInput.fill('NonexistentTask123');
        
        // Wait for search to complete
        await page.waitForTimeout(500);
        
        // Empty state should be visible
        await expect(page.locator('text=No tasks found')).toBeVisible();
        await expect(page.locator('text=No tasks match your current search and filter criteria')).toBeVisible();
    });

    test('persists search in URL', async ({ page }) => {
        await page.goto('/tasks');
        const searchInput = page.getByTestId('search-input');
        
        // Search for "Database"
        await searchInput.fill('Database');
        
        // Wait for search to complete and URL to update
        await page.waitForTimeout(500);
        
        // Check URL contains search parameter
        const url = page.url();
        expect(url).toContain('search=Database');
    });

    test('restores search from URL on page load', async ({ page }) => {
        // Navigate to tasks page with search parameter
        await page.goto('/tasks?search=Video');
        
        // Wait for page to load and search to be applied
        await page.waitForTimeout(500);
        
        // Search input should contain "Video"
        const searchInput = page.getByTestId('search-input');
        await expect(searchInput).toHaveValue('Video');
        
        // Only Video task should be visible
        await expect(page.locator('h3:has-text("Video Upload Feature")')).toBeVisible();
        await expect(page.locator('h3:has-text("Image Processing")')).not.toBeVisible();
    });

    test('handles browser back button', async ({ page }) => {
        await page.goto('/tasks');
        const searchInput = page.getByTestId('search-input');
        
        // Perform first search
        await searchInput.fill('Video');
        await page.waitForTimeout(500);
        
        // Perform second search
        await searchInput.fill('Database');
        await page.waitForTimeout(500);
        
        // Go back
        await page.goBack();
        await page.waitForTimeout(500);
        
        // Should show Video search results
        await expect(searchInput).toHaveValue('Video');
        await expect(page.locator('h3:has-text("Video Upload Feature")')).toBeVisible();
    });

    test('searches in description field', async ({ page }) => {
        await page.goto('/tasks');
        const searchInput = page.getByTestId('search-input');
        
        // Search for text that's only in description
        await searchInput.fill('functionality');
        
        // Wait for search to complete
        await page.waitForTimeout(500);
        
        // Video Upload task should be visible (has "functionality" in description)
        await expect(page.locator('h3:has-text("Video Upload Feature")')).toBeVisible();
    });
});
