# Database Schema Style Guide

## Unique Conventions

### 1. Custom Output Directory

Prisma client generated to custom location:

```prisma
generator client {
  provider      = "prisma-client-js"
  output        = "../app/generated/prisma"
  binaryTargets = ["native", "linux-arm64-openssl-3.0.x", "darwin-arm64"]
}
```

**Why unique**: Output to `app/generated/prisma` for Next.js app directory.

### 2. Multi-Platform Binary Targets

Support for local and containerized development:

```prisma
binaryTargets = ["native", "linux-arm64-openssl-3.0.x", "darwin-arm64"]
```

**Why unique**: Docker ARM64 Linux + macOS ARM64 support.

### 3. Session-Based Authentication Schema

User + Session + Task models:

```prisma
model User {
  id       Int       @id @default(autoincrement())
  email    String    @unique
  password String
  name     String
  sessions Session[]
  assignedTasks Task[] @relation("AssignedTasks")
  createdTasks  Task[] @relation("CreatedTasks")
}

model Session {
  id        Int      @id @default(autoincrement())
  token     String   @unique
  userId    Int
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
}

model Task {
  id          Int       @id @default(autoincrement())
  name        String
  description String?
  priority    String
  status      String
  dueDate     DateTime?
  assigneeId  Int?
  creatorId   Int
  assignee    User?     @relation("AssignedTasks", fields: [assigneeId], references: [id])
  creator     User      @relation("CreatedTasks", fields: [creatorId], references: [id])
}
```

**Why unique**: Named relations ("AssignedTasks", "CreatedTasks") for self-referencing.

### 4. Cascade Delete on Sessions

Sessions deleted when user is deleted:

```prisma
user User @relation(fields: [userId], references: [id], onDelete: Cascade)
```

**Why unique**: Explicit cascade for session cleanup.

### 5. Optional assigneeId but Required creatorId

Tasks can be unassigned but must have creator:

```prisma
assigneeId Int?     // Optional
creatorId  Int      // Required
```

**Why unique**: Asymmetric nullability for task ownership.

## File Structure

Schema in `prisma/`:

```
prisma/
└── schema.prisma
```

## Key Takeaways

1. Generate Prisma client to `app/generated/prisma` directory
2. Include binary targets for Docker (ARM64 Linux) and macOS (ARM64)
3. Use named relations for self-referencing models
4. Set `onDelete: Cascade` for dependent records
5. Allow optional assignee but require creator
6. Locate schema in `prisma/` directory
