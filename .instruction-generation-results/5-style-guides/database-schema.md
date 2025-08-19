# Database Schema Style Guide

## Unique Patterns in TaskFlow

### Generator Configuration
Prisma client generates to a custom output directory:

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../app/generated/prisma"
}
```

### SQLite Configuration
Database uses file-based SQLite:

```prisma
datasource db {
  provider = "sqlite"
  url      = "file:app.db"
}
```

### Relationship Naming Convention
Related fields use descriptive relation names:

```prisma
createdTasks  Task[] @relation("CreatedTasks")
assignedTasks Task[] @relation("AssignedTasks")
```

### Optional Relationships
Optional foreign keys use nullable syntax:

```prisma
assigneeId  Int?
assignee    User?    @relation("AssignedTasks", fields: [assigneeId], references: [id])
```

### Timestamp Fields
All models include automatic timestamp management:

```prisma
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
```

### String Field Conventions
String fields are simple without length constraints:

```prisma
name        String
description String
priority    String
status      String
```

### ID Field Pattern
All models use auto-incrementing integer IDs:

```prisma
id Int @id @default(autoincrement())
```

### Unique Constraints
Unique fields explicitly marked:

```prisma
email String @unique
token String @unique
```