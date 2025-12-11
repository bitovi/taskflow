# Testing Domain

## Overview

Testing uses **Jest for unit tests** and **Playwright for E2E tests**. Unit tests use React Testing Library with jsdom environment. E2E tests use Chromium browser with global setup/teardown.

## Required Patterns

### 1. Unit Tests with Jest + React Testing Library

```tsx
// tests/unit/button.test.tsx
import { render, screen } from "@testing-library/react"
import { Button } from "@/components/ui/button"

describe("Button", () => {
  it("renders with default variant", () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole("button", { name: /click me/i })
    expect(button).toBeInTheDocument()
  })

  it("applies variant classes", () => {
    render(<Button variant="destructive">Delete</Button>)
    const button = screen.getByRole("button", { name: /delete/i })
    expect(button).toHaveClass("bg-destructive")
  })
})
```

Pattern: Use `render()`, `screen` queries, and `expect()` matchers.

### 2. Test File Naming

Unit tests: `*.test.tsx` or `*.test.ts`
E2E tests: `*.spec.ts`

```
tests/
├── unit/
│   ├── button.test.tsx
│   ├── input.test.tsx
│   ├── date-utils.test.ts
│   ├── utils-cn.test.ts
│   ├── create-task-form.test.tsx
│   ├── login-actions.test.ts
│   ├── tasks-actions.test.ts
│   └── seed-helpers.test.js
└── e2e/
    ├── auth.spec.ts
    ├── kanban.spec.ts
    └── tasks.spec.ts
```

### 3. Jest Configuration

```javascript
// jest.config.cjs
const nextJest = require("next/jest")

const createJestConfig = nextJest({
  dir: "./",
})

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
  collectCoverageFrom: [
    "app/**/*.{js,jsx,ts,tsx}",
    "components/**/*.{js,jsx,ts,tsx}",
    "lib/**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],
}

module.exports = createJestConfig(customJestConfig)
```

### 4. Jest Setup File

```typescript
// jest.setup.ts
import "@testing-library/jest-dom"
```

Pattern: Import jest-dom matchers globally.

### 5. Testing Library Queries

```tsx
// tests/unit/input.test.tsx
import { render, screen } from "@testing-library/react"
import { Input } from "@/components/ui/input"

it("renders input with placeholder", () => {
  render(<Input placeholder="Enter text" />)
  
  // Query by placeholder
  const input = screen.getByPlaceholderText(/enter text/i)
  expect(input).toBeInTheDocument()
  
  // Query by role
  const inputByRole = screen.getByRole("textbox")
  expect(inputByRole).toBeInTheDocument()
})
```

Common queries:
- `getByRole()` - Most accessible
- `getByLabelText()` - For form inputs
- `getByPlaceholderText()` - Placeholder text
- `getByText()` - Text content
- `getByTestId()` - data-testid attribute

### 6. Playwright E2E Tests

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from "@playwright/test"

test.describe("Authentication", () => {
  test("user can login with valid credentials", async ({ page }) => {
    await page.goto("http://localhost:3000/login")
    
    await page.fill('input[name="email"]', "test@example.com")
    await page.fill('input[name="password"]', "password123")
    await page.click('button[type="submit"]')
    
    await expect(page).toHaveURL("http://localhost:3000/")
    await expect(page.locator("text=Dashboard")).toBeVisible()
  })

  test("login fails with invalid credentials", async ({ page }) => {
    await page.goto("http://localhost:3000/login")
    
    await page.fill('input[name="email"]', "wrong@example.com")
    await page.fill('input[name="password"]', "wrongpass")
    await page.click('button[type="submit"]')
    
    await expect(page.locator("text=Invalid email or password")).toBeVisible()
  })
})
```

### 7. Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
})
```

### 8. Global Setup/Teardown

```typescript
// tests/e2e/global-setup.js
module.exports = async () => {
  console.log("Setting up E2E test environment...")
  // Setup test database, seed data, etc.
}
```

```typescript
// tests/e2e/global-teardown.js
module.exports = async () => {
  console.log("Tearing down E2E test environment...")
  // Cleanup test data
}
```

## Test Scripts

```json
// package.json
{
  "scripts": {
    "test": "jest --passWithNoTests",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug"
  }
}
```

## Real-World Unit Test Examples

### Testing Utility Functions

```typescript
// tests/unit/date-utils.test.ts
import { parseDateString } from "@/lib/date-utils"

describe("parseDateString", () => {
  it("parses valid date string", () => {
    const result = parseDateString("2024-01-15")
    expect(result).toBeInstanceOf(Date)
    expect(result?.getFullYear()).toBe(2024)
  })

  it("returns null for invalid date", () => {
    const result = parseDateString("invalid-date")
    expect(result).toBeNull()
  })

  it("returns null for empty string", () => {
    const result = parseDateString("")
    expect(result).toBeNull()
  })
})
```

### Testing cn() Utility

```typescript
// tests/unit/utils-cn.test.ts
import { cn } from "@/lib/utils"

describe("cn utility", () => {
  it("joins multiple classes", () => {
    expect(cn("class1", "class2")).toBe("class1 class2")
  })

  it("filters out falsy values", () => {
    expect(cn("class1", false, "class2", null, undefined)).toBe("class1 class2")
  })

  it("handles conditional classes", () => {
    const isActive = true
    expect(cn("base", isActive && "active")).toBe("base active")
  })
})
```

### Testing Components

```tsx
// tests/unit/create-task-form.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { CreateTaskForm } from "@/components/create-task-form"

describe("CreateTaskForm", () => {
  it("displays validation error for empty title", async () => {
    render(<CreateTaskForm users={[]} />)
    
    const submitButton = screen.getByRole("button", { name: /create task/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument()
    })
  })

  it("submits form with valid data", async () => {
    const users = [{ id: 1, name: "John Doe", email: "john@example.com" }]
    render(<CreateTaskForm users={users} />)
    
    fireEvent.change(screen.getByPlaceholderText(/task title/i), {
      target: { value: "New Task" },
    })
    
    fireEvent.click(screen.getByRole("button", { name: /create task/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/task created/i)).toBeInTheDocument()
    })
  })
})
```

## Real-World E2E Test Examples

### Testing Task Creation

```typescript
// tests/e2e/tasks.spec.ts
import { test, expect } from "@playwright/test"

test.describe("Task Management", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto("http://localhost:3000/login")
    await page.fill('input[name="email"]', "test@example.com")
    await page.fill('input[name="password"]', "password")
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL("http://localhost:3000/")
  })

  test("creates a new task", async ({ page }) => {
    await page.goto("http://localhost:3000/tasks/new")
    
    await page.fill('input[name="title"]', "Test Task")
    await page.fill('textarea[name="description"]', "Test Description")
    await page.selectOption('select[name="priority"]', "high")
    await page.click('button[type="submit"]')
    
    await expect(page).toHaveURL("http://localhost:3000/tasks")
    await expect(page.locator("text=Test Task")).toBeVisible()
  })

  test("deletes a task", async ({ page }) => {
    await page.goto("http://localhost:3000/tasks")
    
    await page.click('button[aria-label="Delete task"]')
    await page.click('button:has-text("Confirm")')
    
    await expect(page.locator("text=Task deleted")).toBeVisible()
  })
})
```

### Testing Kanban Board

```typescript
// tests/e2e/kanban.spec.ts
import { test, expect } from "@playwright/test"

test.describe("Kanban Board", () => {
  test("moves task between columns", async ({ page }) => {
    await page.goto("http://localhost:3000/board")
    
    const task = page.locator('[data-testid="task-1"]')
    const todoColumn = page.locator('[data-column="todo"]')
    const inProgressColumn = page.locator('[data-column="in_progress"]')
    
    // Drag task from To Do to In Progress
    await task.dragTo(inProgressColumn)
    
    // Verify task moved
    await expect(inProgressColumn.locator("text=Task Name")).toBeVisible()
  })
})
```

## Constraints

1. **Jest for unit tests**: Use Jest + React Testing Library
2. **Playwright for E2E**: Use Playwright with Chromium
3. **jsdom environment**: Unit tests run in jsdom
4. **Test file naming**: `*.test.tsx` for units, `*.spec.ts` for E2E
5. **Setup file location**: `jest.setup.ts` for Jest setup
6. **Global hooks location**: `tests/e2e/global-setup.js` and `global-teardown.js`
7. **--passWithNoTests flag**: Jest configured to pass with no tests
8. **Path aliases**: Tests use `@/*` path aliases
9. **Coverage collection**: Configured for app/, components/, lib/

## Tools and Technologies

- **Jest 29**: Unit test framework
- **React Testing Library**: Component testing utilities
- **@testing-library/jest-dom**: Custom matchers
- **Playwright**: E2E testing framework
- **jsdom**: DOM implementation for Node.js
- **Chromium**: E2E test browser
