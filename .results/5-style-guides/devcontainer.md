# Devcontainer Style Guide

## Unique Conventions

### 1. Node.js Development Container

Devcontainer configured for Node.js:

```json
{
  "name": "Taskflow Dev Container",
  "image": "mcr.microsoft.com/devcontainers/javascript-node:18",
  "features": {
    "ghcr.io/devcontainers/features/postgresql:1": {}
  }
}
```

**Why unique**: Includes PostgreSQL feature for database.

### 2. PostgreSQL Feature

Database integrated into devcontainer:

```json
"features": {
  "ghcr.io/devcontainers/features/postgresql:1": {}
}
```

**Why unique**: Self-contained development environment with database.

### 3. Port Forwarding

Ports automatically forwarded:

```json
"forwardPorts": [3000, 5432]
```

**Why unique**: Exposes Next.js (3000) and PostgreSQL (5432).

### 4. Post Create Command

Setup runs after container creation:

```json
"postCreateCommand": "npm install && npm run db:setup"
```

**Why unique**: Automatic dependency install and database setup.

### 5. Extensions Installed

VS Code extensions pre-installed:

```json
"customizations": {
  "vscode": {
    "extensions": [
      "dbaeumer.vscode-eslint",
      "esbenp.prettier-vscode",
      "Prisma.prisma"
    ]
  }
}
```

**Why unique**: Development tools ready immediately.

## File Structure

Devcontainer config in `.devcontainer/`:

```
.devcontainer/
└── devcontainer.json
```

## Key Takeaways

1. Use Node.js base image for development
2. Include PostgreSQL feature for database
3. Forward ports for Next.js and PostgreSQL
4. Run setup commands on container creation
5. Pre-install relevant VS Code extensions
6. Locate in `.devcontainer/` directory
