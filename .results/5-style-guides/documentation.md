# Documentation Style Guide

## Unique Conventions

### 1. README Structure

README includes setup and development instructions:

```md
# Taskflow

Team task management application built with Next.js.

## Features
- Task management (CRUD)
- Kanban board with drag-and-drop
- User authentication
- Team statistics

## Tech Stack
- Next.js 15 with App Router
- React 19
- TypeScript
- Prisma + PostgreSQL
- Tailwind CSS 4

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up database: `npm run db:setup`
4. Seed data: `npm run db:seed`
5. Run dev server: `npm run dev`

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run unit tests
- `npm run test:e2e` - Run E2E tests
- `npm run db:setup` - Run database migrations
- `npm run db:seed` - Seed database
- `npm run db:reset` - Reset database
```

**Why unique**: Focuses on setup steps and available npm scripts.

### 2. Backup Scripts Documentation

Separate doc for database backup procedures:

```md
# Backup Scripts

## Database Backup
- Use `pg_dump` for PostgreSQL backups
- Schedule with cron
```

**Why unique**: Operational documentation separate from README.

## File Structure

Documentation in root and scripts:

```
README.md
scripts/
└── backup-scripts.md
```

## Key Takeaways

1. README focuses on setup and development
2. List all available npm scripts
3. Include tech stack overview
4. Separate operational docs (backups) from main README
5. Locate README in root, operational docs in `scripts/`
