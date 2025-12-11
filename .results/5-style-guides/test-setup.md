# Test Setup Style Guide

## Unique Conventions

### 1. jsdom Environment

Jest configured for React testing:

```ts
// jest.setup.ts
import "@testing-library/jest-dom"
```

**jest.config.cjs:**
```js
testEnvironment: "jsdom"
```

**Why unique**: jsdom for DOM testing, @testing-library/jest-dom for matchers.

### 2. Testing Library Matchers

Global matchers imported:

```ts
import "@testing-library/jest-dom"
```

**Usage in tests:**
```ts
expect(element).toBeInTheDocument()
expect(button).toBeDisabled()
```

**Why unique**: Testing Library matchers available globally without per-file imports.

### 3. Minimal Setup File

Setup file only imports matchers:

```ts
// jest.setup.ts
import "@testing-library/jest-dom"
```

**Why unique**: No global mocks or configuration, just matchers.

## File Structure

Setup in root:

```
jest.setup.ts
```

## Key Takeaways

1. Import `@testing-library/jest-dom` for custom matchers
2. Use jsdom environment for React component tests
3. Keep setup file minimal (no global mocks)
4. Locate in project root
