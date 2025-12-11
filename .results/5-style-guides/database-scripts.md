# Database Scripts Style Guide

## Unique Conventions

### 1. Custom Prisma Client Path

All scripts import from custom output directory:

```js
const { PrismaClient } = require("./app/generated/prisma/client")
```

**Why unique**: Prisma client in `app/generated/prisma`, not default location.

### 2. Bcrypt for Seeding Passwords

Seed script hashes passwords:

```js
const bcrypt = require("bcryptjs")

const hashedPassword = await bcrypt.hash("password123", 10)

await prisma.user.create({
  data: {
    email: "admin@example.com",
    password: hashedPassword,
    name: "Admin User",
  },
})
```

**Why unique**: Seed data uses production-ready hashed passwords.

### 3. Session Generation in Seed

Creates sessions with expiry:

```js
const token = randomBytes(32).toString("hex")
const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

await prisma.session.create({
  data: {
    token,
    userId: user.id,
    expiresAt,
  },
})
```

**Why unique**: Seeds include valid sessions for testing.

### 4. Clear Script Deletes All Data

Clear script removes all records:

```js
async function clear() {
  await prisma.task.deleteMany({})
  await prisma.session.deleteMany({})
  await prisma.user.deleteMany({})
  console.log("Database cleared successfully")
}
```

**Why unique**: Explicit clear utility for development.

### 5. Create-DB Script for Docker

Database creation script for containerized environments:

```js
// prisma/create-db.js
// Used in Docker setup to ensure database exists before migrations
```

**Why unique**: Database initialization for Docker compose setup.

## File Structure

Scripts in `prisma/`:

```
prisma/
├── seed.js       # Seed data with hashed passwords
├── clear.js      # Delete all records
└── create-db.js  # Docker database initialization
```

## NPM Scripts

Database management commands:

```json
{
  "db:setup": "npx prisma migrate dev",
  "db:seed": "node prisma/seed.js",
  "db:reset": "npx prisma migrate reset --force",
  "db:clear": "node prisma/clear.js"
}
```

## Key Takeaways

1. Import Prisma client from `app/generated/prisma/client`
2. Hash passwords in seed data with bcryptjs
3. Generate sessions with token and expiry in seed
4. Provide clear script for development database reset
5. Include create-db script for Docker environment
6. Locate scripts in `prisma/` directory
