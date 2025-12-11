# Git Ignore Style Guide

## Unique Conventions

### 1. Next.js Build Artifacts

Ignores Next.js-specific outputs:

```gitignore
# Next.js
/.next/
/out/
```

**Why unique**: Next.js build directories excluded.

### 2. Prisma Generated Client

Ignores custom Prisma output:

```gitignore
# Prisma generated client
/app/generated/
```

**Why unique**: Generated Prisma client in custom location ignored.

### 3. Test Outputs

Ignores test results and coverage:

```gitignore
# Test results
/coverage/
/test-results/
/.playwright/
```

**Why unique**: Playwright and Jest artifacts excluded.

### 4. Environment Files

Local environment configuration ignored:

```gitignore
# Environment
.env
.env*.local
```

**Why unique**: Protects sensitive environment variables.

### 5. Standard Node.js Ignores

Common Node.js patterns:

```gitignore
# Dependencies
/node_modules/

# Production
/build/

# Misc
.DS_Store
*.log
```

**Why unique**: Standard Node.js + macOS files.

## File Structure

Git ignore in root:

```
.gitignore
```

## Key Takeaways

1. Ignore Next.js build directories (`.next/`, `out/`)
2. Ignore Prisma generated client (`app/generated/`)
3. Ignore test outputs (`test-results/`, `coverage/`)
4. Ignore environment files (`.env`, `.env*.local`)
5. Include standard Node.js ignores
6. Locate in project root
