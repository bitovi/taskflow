# TaskFlow — AI Feature Generation Demo

TaskFlow is a modern task management app built with Next.js 15, React, TypeScript, and Prisma. It provides a comprehensive solution for managing tasks and projects with an intuitive drag-and-drop Kanban board interface.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Bootstrap, Build, and Test the Repository

- Install dependencies:
  - `npm install` -- takes 45-50 seconds. NEVER CANCEL. Set timeout to 90+ seconds.
  
- Database setup (may fail in restricted environments):
  - `npm run db:setup` -- Creates, migrates and populates SQLite database with sample data
  - **KNOWN ISSUE**: In environments with restricted network access, this fails with "getaddrinfo ENOTFOUND binaries.prisma.sh" because Prisma engines cannot be downloaded
  - **WORKAROUND**: Use `npx prisma generate` first, or create mock Prisma client in `app/generated/prisma/` if engines unavailable
  
- Build the application:
  - `npm run build` -- takes 15-20 seconds normally. NEVER CANCEL. Set timeout to 60+ minutes.
  - **KNOWN ISSUE**: In environments with restricted network access, this fails with "Failed to fetch fonts from Google Fonts" because the app uses `Inter` and `Poppins` fonts from Google Fonts
  - **WORKAROUND**: Temporarily comment out Google Font imports in `app/layout.tsx`, `components/ui/card.tsx`, and `lib/fonts.ts`
  
- Lint the code:
  - `npm run lint` -- takes 3-5 seconds. Shows warnings and errors but runs successfully.

### Run the Application

- Development server:
  - ALWAYS run the database setup first if possible
  - `npm run dev` -- starts on http://localhost:3000, ready in ~1 second
  - Uses Turbopack for fast refresh
  
- Production server:
  - `npm run build && npm run start`

### Default Credentials
- Email: `alice@example.com`
- Password: `password123`
- **NOTE**: These only work if database seeding was successful

## Validation

- **CRITICAL**: Always manually test login functionality after making authentication changes
- Test the Kanban board drag-and-drop functionality when modifying task components
- Always run `npm run lint` before finishing - the CI would fail on linting errors (though no CI is currently configured)
- ALWAYS test at least one complete end-to-end scenario after making changes:
  - Login → View dashboard → Navigate to tasks → Create/edit/delete a task
  - Login → View board → Drag tasks between columns

## Network Restrictions and Workarounds

The following external dependencies may be blocked in restricted environments:

1. **Prisma Binary Downloads** (`binaries.prisma.sh`)
   - Affects: `npm run db:setup`, `npx prisma generate`
   - Workaround: Create mock Prisma client with proper TypeScript interfaces
   
2. **Google Fonts** (`fonts.googleapis.com`)
   - Affects: `npm run build`, `npm run dev`
   - Files using fonts: `app/layout.tsx`, `components/ui/card.tsx`, `lib/fonts.ts`
   - Workaround: Comment out font imports and className usage

## Key Projects and Structure

### App Structure (Next.js App Router)
```
app/
├── (dashboard)/           # Protected dashboard routes
│   ├── board/            # Kanban board view
│   ├── tasks/            # Task list and task creation
│   ├── team/             # Team overview
│   └── page.tsx          # Dashboard home
├── login/                # Authentication
├── signup/               # User registration
├── layout.tsx            # Root layout with fonts
└── globals.css           # Global styles
```

### Key Components
```
components/
├── ui/                   # shadcn/ui components (Button, Card, etc.)
├── kanban-board.tsx      # Drag-and-drop board
├── task-list.tsx         # Task list view
├── create-task-form.tsx  # Task creation form
├── edit-task-form.tsx    # Task editing form
└── sidebar.tsx           # Navigation sidebar
```

### Database and Actions
```
prisma/
├── schema.prisma         # Database schema (SQLite)
├── seed.js              # Sample data (7 users, 30+ tasks)
└── clear.js             # Database cleanup

app/(dashboard)/tasks/actions.ts  # Server actions for CRUD operations
app/login/actions.ts              # Authentication actions
```

## Common Tasks

### Database Management
- `npm run db:seed` — Populate with sample data
- `npm run db:clear` — Clear all data  
- `npm run db:reset` — Clear and re-seed
- `npm run db:setup` — Push schema and reset data

### Key Files to Check When Making Changes
- Always check `app/(dashboard)/tasks/actions.ts` after modifying task-related functionality
- Always check `app/login/actions.ts` after modifying authentication
- Check `prisma/schema.prisma` when adding new fields or relationships
- Check component files in `components/` when modifying UI

### Dependencies and Tech Stack
- **Framework**: Next.js 15 with App Router and Turbopack
- **UI**: shadcn/ui + Radix UI + Tailwind CSS v4
- **Database**: Prisma ORM with SQLite
- **Drag & Drop**: @hello-pangea/dnd for Kanban board
- **Auth**: Custom session-based authentication with bcryptjs
- **Charts**: Recharts for dashboard analytics

### File Extensions and Imports
- Use `.tsx` for React components
- Use `.ts` for utilities and server actions  
- Import paths use `@/` alias for root directory
- Database imports: `import { PrismaClient } from "@/app/generated/prisma"`
- Use `"use server"` directive for server actions

### Branches for Reference
- `main` — Baseline application
- `user-13-search-and-filter` — Example AI-implemented feature with search and filters

## Environment Limitations Documentation

When working in restricted environments, document these known issues:

1. **Prisma Setup Failure**: "Cannot download Prisma engines" - requires manual mock or pre-built client
2. **Google Fonts Failure**: "Cannot fetch fonts" - requires commenting out font imports  
3. **No CI/CD**: No `.github/workflows` directory exists, so no automated testing pipeline
4. **No Test Framework**: No Jest, Vitest, or other testing setup detected

Always include timeout values of 60+ minutes for build commands and 30+ minutes for database operations when they work normally.