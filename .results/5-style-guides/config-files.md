# Config Files Style Guide

## Unique Conventions

### 1. Next.js Config with Turbopack

Next.js configured for development with Turbopack:

```ts
// next.config.ts
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
}

export default nextConfig
```

**Package.json dev script:**
```json
"dev": "next dev --turbopack"
```

**Why unique**: Turbopack enabled for faster dev builds, experimental server actions.

### 2. TypeScript Path Aliases

TypeScript configured with `@/*` alias:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

**Why unique**: Root-level alias (not `src/`), enables `@/app`, `@/lib`, etc.

### 3. Jest with Custom Prisma Path

Jest configured to find custom Prisma location:

```js
// jest.config.cjs
moduleNameMapper: {
  "^@/(.*)$": "<rootDir>/$1",
  "^@/app/generated/prisma/client$": "<rootDir>/app/generated/prisma/client",
}
```

**Why unique**: Explicit mapping for non-standard Prisma output directory.

### 4. Playwright E2E Pattern

Playwright configured with global setup/teardown:

```ts
// playwright.config.ts
export default defineConfig({
  globalSetup: require.resolve("./tests/e2e/global-setup.js"),
  globalTeardown: require.resolve("./tests/e2e/global-teardown.js"),
  use: {
    baseURL: "http://localhost:3000",
  },
})
```

**Why unique**: Global setup starts server, teardown stops it.

### 5. Tailwind CSS 4 with Design Tokens

Tailwind configured with CSS custom properties:

```js
// postcss.config.mjs
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
}
```

**globals.css:**
```css
@import "tailwindcss";

@theme {
  --color-background: 0 0% 100%;
  --color-foreground: 222.2 84% 4.9%;
  --color-primary: 222.2 47.4% 11.2%;
  /* ... */
}
```

**Why unique**: Tailwind CSS 4 beta with `@theme` directive for design tokens.

### 6. ESLint with Next.js Core Web Vitals

ESLint extends Next.js config:

```js
// eslint.config.mjs
import { FlatCompat } from "@eslint/eslintrc"

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
})

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
]

export default eslintConfig
```

**Why unique**: Flat config with FlatCompat for Next.js presets.

### 7. Separate Jest Configs

Two TypeScript configs for Jest:

```json
// tsconfig.jest.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "jsx": "react"
  }
}
```

**Why unique**: Jest config extends base, overrides JSX for non-React 19 support.

## File Structure

Configs in root:

```
next.config.ts
tsconfig.json
tsconfig.jest.json
jest.config.cjs
playwright.config.ts
postcss.config.mjs
eslint.config.mjs
package.json
```

## Key Takeaways

1. Enable Turbopack in dev mode: `next dev --turbopack`
2. Use root-level path alias `@/*`
3. Configure Jest for custom Prisma output directory
4. Playwright uses global setup/teardown for server lifecycle
5. Tailwind CSS 4 with `@theme` directive for design tokens
6. ESLint flat config with FlatCompat
7. Separate Jest TypeScript config for JSX handling
