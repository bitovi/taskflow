import { test as setup } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../../.auth/user.json');

setup('authenticate', async ({ page }) => {
  // Navigate to login page
  await page.goto('/login');
  
  // Fill in credentials for Alice (seeded user)
  await page.fill('input#email', 'alice@example.com');
  await page.fill('input#password', 'password123');
  
  // Click login button and wait for navigation
  await Promise.all([
    page.waitForNavigation(),
    page.click('button:has-text("Log\u00A0In")'),
  ]);
  
  // Wait for successful login (should redirect to dashboard)
  await page.waitForURL(/\//);
  
  // Save signed-in state to be reused across all tests
  await page.context().storageState({ path: authFile });
});
