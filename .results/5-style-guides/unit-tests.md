# Unit Tests Style Guide

## Unique Conventions

### 1. Testing Library Queries

Use Testing Library query hierarchy:

```tsx
import { render, screen } from "@testing-library/react"

// 1. getByRole (preferred)
const button = screen.getByRole("button", { name: /submit/i })

// 2. getByLabelText (forms)
const input = screen.getByLabelText(/email/i)

// 3. getByText (last resort)
const text = screen.getByText(/welcome/i)
```

**Why unique**: Strict query hierarchy for accessibility.

### 2. User Event for Interactions

Use `@testing-library/user-event`:

```tsx
import userEvent from "@testing-library/user-event"

const user = userEvent.setup()
await user.type(input, "test@example.com")
await user.click(button)
```

**Why unique**: userEvent simulates real interactions, not fireEvent.

### 3. Mock Server Actions

Server actions mocked with jest.mock:

```tsx
jest.mock("@/app/login/actions", () => ({
  loginUser: jest.fn(),
}))

import { loginUser } from "@/app/login/actions"

(loginUser as jest.Mock).mockResolvedValue({ success: true })
```

**Why unique**: Server actions mocked at module level.

### 4. Async waitFor for State Updates

Wait for async updates:

```tsx
import { waitFor } from "@testing-library/react"

await waitFor(() => {
  expect(screen.getByText(/success/i)).toBeInTheDocument()
})
```

**Why unique**: waitFor for async state changes, not arbitrary delays.

### 5. Test File Naming

Test files colocated with source or in tests/unit/:

```
tests/unit/
├── button.test.tsx
├── input.test.tsx
├── create-task-form.test.tsx
├── date-utils.test.ts
├── utils-cn.test.ts
├── login-actions.test.ts
└── tasks-actions.test.ts
```

**Why unique**: `.test.tsx` suffix, separate unit test directory.

### 6. Describe Blocks for Grouping

Group related tests:

```tsx
describe("Button", () => {
  describe("variants", () => {
    it("renders default variant", () => {})
    it("renders destructive variant", () => {})
  })

  describe("interactions", () => {
    it("handles click events", () => {})
  })
})
```

**Why unique**: Nested describe blocks for clear test organization.

## File Structure

Unit tests in `tests/unit/`:

```
tests/unit/
└── *.test.tsx
```

## Key Takeaways

1. Use Testing Library queries in order: getByRole → getByLabelText → getByText
2. Use userEvent for interactions, not fireEvent
3. Mock server actions at module level with jest.mock
4. Use waitFor for async state updates
5. Name test files with `.test.tsx` suffix
6. Organize tests with nested describe blocks
7. Locate in `tests/unit/` directory
