# E2E Tests Style Guide

## Unique Conventions

### 1. Page Object Pattern

Tests use page locators and actions:

```ts
// tests/e2e/auth.spec.ts
import { test, expect } from "@playwright/test"

test("login flow", async ({ page }) => {
  await page.goto("/login")
  
  await page.fill('input[type="email"]', "admin@example.com")
  await page.fill('input[type="password"]', "password123")
  await page.click('button[type="submit"]')
  
  await expect(page).toHaveURL("/")
})
```

**Why unique**: Direct page locators, no separate page object classes.

### 2. Global Setup/Teardown

Server lifecycle managed globally:

```js
// tests/e2e/global-setup.js
module.exports = async () => {
  // Start server
  global.__SERVER__ = spawn("npm", ["start"])
  await waitForServer("http://localhost:3000")
}

// tests/e2e/global-teardown.js
module.exports = async () => {
  // Stop server
  global.__SERVER__.kill()
}
```

**Why unique**: Server started once for all tests, not per-file.

### 3. File Naming Convention

E2E tests named `*.spec.ts`:

```
tests/e2e/
├── auth.spec.ts
├── kanban.spec.ts
└── tasks.spec.ts
```

**Why unique**: `.spec.ts` suffix for E2E, `.test.tsx` for unit tests.

### 4. baseURL in Tests

Tests use relative URLs:

```ts
await page.goto("/login")  // Not "http://localhost:3000/login"
await page.goto("/tasks/new")
```

**playwright.config.ts:**
```ts
use: {
  baseURL: "http://localhost:3000",
}
```

**Why unique**: Relative URLs with baseURL configuration.

### 5. Drag and Drop Testing

Kanban drag tests use Playwright DnD:

```ts
// tests/e2e/kanban.spec.ts
test("drag task between columns", async ({ page }) => {
  await page.goto("/board")
  
  const task = page.locator('[data-task-id="1"]')
  const targetColumn = page.locator('[data-column="in-progress"]')
  
  await task.dragTo(targetColumn)
  
  await expect(targetColumn.locator('[data-task-id="1"]')).toBeVisible()
})
```

**Why unique**: Uses data attributes for drag-and-drop selectors.

## File Structure

E2E tests in `tests/e2e/`:

```
tests/e2e/
├── auth.spec.ts
├── kanban.spec.ts
├── tasks.spec.ts
├── global-setup.js
├── global-teardown.js
└── console-log-proxy.js
```

## Key Takeaways

1. Use page locators directly (no page object classes)
2. Manage server in global setup/teardown
3. Name files with `.spec.ts` suffix
4. Use relative URLs with baseURL config
5. Use data attributes for drag-and-drop testing
6. Locate in `tests/e2e/` directory
