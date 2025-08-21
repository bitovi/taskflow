# Configuration Files Style Guide

## Unique Patterns in TaskFlow

### TypeScript Configuration
Uses Next.js-optimized TypeScript configuration:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext", 
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{"name": "next"}],
    "paths": {"@/*": ["./*"]}
  }
}
```

### Path Alias Convention
Uses `@/*` for root-level imports:

```json
"paths": {
  "@/*": ["./*"]
}
```

### Package.json Scripts
Includes custom database management scripts:

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build", 
    "start": "next start",
    "lint": "next lint",
    "db:setup": "npx prisma db push && npm run db:reset",
    "db:clear": "node prisma/clear.js",
    "db:seed": "node prisma/seed.js", 
    "db:reset": "npm run db:clear && npm run db:seed"
  }
}
```

### ESLint Configuration (ESM)
Uses .mjs extension for ESLint config:

```javascript
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
];

export default eslintConfig;
```

### PostCSS Tailwind Setup
Minimal PostCSS configuration for Tailwind:

```javascript
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;
```

### Dependency Management
- Exact versions for framework dependencies (Next.js, React)
- Caret ranges for utility libraries
- Prisma client and generator versions match exactly