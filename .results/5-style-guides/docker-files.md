# Docker Files Style Guide

## Unique Conventions

### 1. Multi-Stage Dockerfile

Production Dockerfile uses multi-stage build:

```dockerfile
# Stage 1: Dependencies
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Stage 3: Runner
FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

CMD ["npm", "start"]
```

**Why unique**: Three-stage build for optimized production image.

### 2. Prisma Generate in Builder Stage

Prisma client generated during build:

```dockerfile
RUN npx prisma generate
```

**Why unique**: Generated client included in final image.

### 3. Separate Test Dockerfile

Test environment has own Dockerfile:

```dockerfile
# Dockerfile.test
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate

CMD ["npm", "test"]
```

**Why unique**: Dedicated test container with full dependencies.

### 4. Three Docker Compose Configurations

Separate compose files for environments:

- `docker-compose.yaml` - Production
- `docker-compose.dev.yaml` - Development with volume mounts
- `docker-compose.test.yaml` - Testing with test database

**Why unique**: Environment-specific compose configurations.

### 5. Development Volume Mounts

Dev compose mounts source code:

```yaml
# docker-compose.dev.yaml
services:
  app:
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
```

**Why unique**: Hot reload in Docker via volume mounts, excludes node_modules/.next.

### 6. PostgreSQL Service in All Environments

All compose files include PostgreSQL:

```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: taskflow
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
```

**Why unique**: Consistent database setup across environments.

## File Structure

Docker files in root:

```
Dockerfile           # Production multi-stage
Dockerfile.test      # Test environment
docker-compose.yaml  # Production compose
docker-compose.dev.yaml   # Development compose
docker-compose.test.yaml  # Test compose
```

## Key Takeaways

1. Use multi-stage Dockerfile for production
2. Generate Prisma client in builder stage
3. Separate Dockerfile for test environment
4. Maintain three docker-compose files (prod/dev/test)
5. Mount volumes in dev mode for hot reload
6. Include PostgreSQL in all environments
7. Exclude node_modules and .next from volume mounts
