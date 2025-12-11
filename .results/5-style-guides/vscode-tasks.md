# VS Code Tasks Style Guide

## Unique Conventions

### 1. Task Definitions with Dependencies

Tasks configured with dependency chains:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "kill-port-3000",
      "type": "shell",
      "command": "fuser -k 3000/tcp || true"
    },
    {
      "label": "dev",
      "type": "shell",
      "command": "npm run dev",
      "group": {
        "kind": "build",
        "isDefault": true
      },
      "isBackground": true,
      "dependsOn": ["kill-port-3000"]
    }
  ]
}
```

**Why unique**: `dev` task depends on `kill-port-3000` to prevent port conflicts.

### 2. Background Tasks for Servers

Server tasks marked as background:

```json
{
  "label": "dev",
  "isBackground": true
}
```

**Why unique**: Prevents VS Code from waiting for server to exit.

### 3. Default Build Task

Dev task set as default build:

```json
{
  "label": "dev",
  "group": {
    "kind": "build",
    "isDefault": true
  }
}
```

**Why unique**: `Cmd+Shift+B` runs dev server directly.

### 4. Database Management Tasks

Tasks for database operations:

```json
{
  "label": "db:setup",
  "command": "npm run db:setup"
},
{
  "label": "db:seed",
  "command": "npm run db:seed"
},
{
  "label": "db:reset",
  "command": "npm run db:reset"
}
```

**Why unique**: Quick access to database commands from VS Code.

### 5. Test Tasks

Separate tasks for unit and E2E tests:

```json
{
  "label": "test",
  "command": "npm test",
  "group": {
    "kind": "test",
    "isDefault": true
  }
},
{
  "label": "test:e2e",
  "command": "npm run test:e2e",
  "group": "test"
}
```

**Why unique**: Unit tests as default, E2E as secondary test task.

## File Structure

VS Code config in `.vscode/`:

```
.vscode/
└── tasks.json
```

## Key Takeaways

1. Use task dependencies to prevent port conflicts
2. Mark server tasks as `isBackground: true`
3. Set dev as default build task for keyboard shortcut
4. Provide tasks for database operations
5. Separate unit and E2E test tasks
6. Locate in `.vscode/` directory
