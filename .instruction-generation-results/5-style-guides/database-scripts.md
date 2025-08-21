# Database Scripts Style Guide

## Unique Patterns in TaskFlow

### CommonJS Module System
Database scripts use CommonJS require syntax:

```javascript
const { PrismaClient } = require("../app/generated/prisma");
const bcrypt = require("bcryptjs");
```

### Script Structure Pattern
All scripts follow this structure:

```javascript
const prisma = new PrismaClient();

async function main() {
  // Script logic here
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### Password Hashing in Seeds
Seed scripts hash passwords using bcryptjs:

```javascript
const hashedPassword = await bcrypt.hash("password123", 10);
```

### CreateMany Pattern
Bulk data creation uses createMany for efficiency:

```javascript
await prisma.task.createMany({
  data: [
    {
      name: "Task 1",
      description: "Description 1",
      // ... other fields
    },
    // ... more tasks
  ],
});
```

### Clear Script Pattern
Clear scripts use deleteMany to remove all data:

```javascript
await prisma.session.deleteMany({});
await prisma.task.deleteMany({});
await prisma.user.deleteMany({});
```

### Error Handling
Scripts include proper error handling and cleanup:

```javascript
.catch((e) => {
  console.error(e);
  process.exit(1);
})
.finally(async () => {
  await prisma.$disconnect();
});
```

### Test Data Convention
Sample data uses realistic but generic values:

```javascript
email: "alice@example.com",
password: hashedPassword,
name: "Alice Johnson",
```