import { test } from '@playwright/test';

test('take screenshots of search functionality', async ({ page }) => {
    // Login
    await page.goto('http://localhost:3000/login');
    await page.fill('input#email', 'alice@example.com');
    await page.fill('input#password', 'password123');
    await page.click('button:has-text("Log In")');
    await page.waitForNavigation();
    
    // Go to tasks page
    await page.goto('http://localhost:3000/tasks');
    await page.waitForTimeout(1000);
    
    // Screenshot 1: Tasks page with search input (empty)
    await page.screenshot({ path: '/tmp/search-empty.png', fullPage: true });
    
    // Type search query "video"
    const searchInput = page.locator('input[type="text"]').first();
    await searchInput.fill('video');
    await page.waitForTimeout(1500);
    
    // Screenshot 2: Search results for "video"
    await page.screenshot({ path: '/tmp/search-results.png', fullPage: true });
    
    // Search for something that doesn't exist
    await searchInput.fill('xyznonexistent123');
    await page.waitForTimeout(1500);
    
    // Screenshot 3: Empty state
    await page.screenshot({ path: '/tmp/search-empty-state.png', fullPage: true });
});
