# TaskFlow - AI Task Management App

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Bootstrap and Setup
- Install dependencies: `npm install` -- takes ~49 seconds. Works reliably.
- **NETWORK LIMITATIONS**: The following commands fail due to firewall restrictions:
  - `npm run db:setup` -- fails due to Prisma binary download restrictions (binaries.prisma.sh blocked)
  - `npm run build` -- fails due to Google Fonts access restrictions (fonts.googleapis.com blocked)
  - `npx prisma generate` -- fails due to Prisma binary download restrictions

### Core Commands That Work
- `npm run lint` -- takes ~5 seconds. ALWAYS run before committing. Shows TypeScript warnings/errors.
- Basic file operations, TypeScript compilation checks work normally
- Git operations work normally

### Database & Prisma Limitations
- **CRITICAL**: Database commands require network access to download Prisma binaries
- Database setup commands in package.json:
  - `npm run db:setup` -- Create, migrate and populate database (FAILS due to network restrictions)
  - `npm run db:clear` -- Clear all data from database
  - `npm run db:seed` -- Populate database with sample data
  - `npm run db:reset` -- Clear and re-seed database
- **WORKAROUND**: In environments with network restrictions, document that these commands cannot be executed
- Prisma client generates to `app/generated/prisma` directory
- Uses SQLite database (`prisma/app.db` file)

### Build System Limitations
- **CRITICAL**: Build fails due to Google Fonts network access
- `npm run build` fails because:
  - `app/layout.tsx` imports `Inter` from `next/font/google`
  - `lib/fonts.ts` imports `Poppins` from `next/font/google`
  - `components/ui/card.tsx` imports `Poppins` from `next/font/google`
- **TypeScript Compilation Issues**: `npx tsc --noEmit` reveals:
  - 12 errors in 11 files
  - All Prisma client imports fail: `Cannot find module '@/app/generated/prisma'`
  - Missing generated types in: tasks/actions.ts, login/actions.ts, signup/actions.ts, components
- **WORKAROUND**: In restricted environments, font imports must be replaced with local alternatives

### Development Server
- `npm run dev --turbopack` -- starts development server on port 3000
- **TIMING**: Development server startup typically takes 10-15 seconds
- **LIMITATION**: Will fail due to missing Prisma client and font dependencies in restricted environments
- Uses Next.js 15.4.6 with App Router and Turbopack for fast refresh

## Validation Scenarios

When the application is fully functional, ALWAYS test these complete user workflows:

### Authentication Flow
1. Visit http://localhost:3000 
2. Navigate to /login
3. Use default credentials: `alice@example.com` / `password123`
4. Verify successful login redirects to dashboard

### Task Management Flow
1. Navigate to /tasks page
2. Click "New Task" to create a task
3. Fill out task form with title, description, priority, status, due date, assignee
4. Verify task appears in task list
5. Test task status updates via checkbox
6. Test task editing via dropdown menu
7. Test task deletion

### Dashboard Verification
1. Navigate to dashboard (/)
2. Verify statistics cards show correct data
3. Verify charts render properly with task data
4. Check recent tasks display

## Codebase Structure

### Key Directories
```
app/
├── (dashboard)/           # Main application pages
│   ├── page.tsx          # Dashboard with stats and charts
│   ├── tasks/            # Task management
│   │   ├── page.tsx      # Task list page
│   │   ├── actions.ts    # Server actions for CRUD
│   │   └── new/          # Create task page
│   ├── board/            # Kanban board view
│   └── team/             # Team management
├── login/                # Authentication pages
├── signup/
└── generated/prisma/     # Generated Prisma client (network dependent)

components/
├── ui/                   # shadcn/ui components
├── task-list.tsx         # Main task listing component
├── kanban-board.tsx      # Drag-drop kanban board
├── dashboard-charts.tsx  # Charts for dashboard
└── sidebar.tsx           # Navigation sidebar

prisma/
├── schema.prisma         # Database schema
├── seed.js              # Sample data generation
├── clear.js             # Database cleanup
└── migrations/          # Database migrations
```

### Server Actions Pattern
- Actions located in `app/(dashboard)/tasks/actions.ts`
- Uses Prisma ORM with TypeScript
- Key actions: `createTask`, `getAllTasks`, `deleteTask`, `updateTaskStatus`, `updateTask`
- Always use `revalidatePath("/tasks")` after mutations

### UI Component Pattern
- Uses shadcn/ui + Radix UI components
- Tailwind CSS for styling
- Custom fonts: Inter (main), Poppins (headings)
- Icons from Lucide React

### State Management
- Uses React Server Components for server-side data fetching
- Optimistic updates with `useOptimistic` hook
- Form handling with Server Actions and `useActionState`

## Important Implementation Details

### Authentication
- Session-based auth using cookies
- Sessions stored in database
- Password hashing with bcrypt
- Default test user: alice@example.com / password123

### Database Schema
- Users: id, email, password, name
- Tasks: id, name, description, priority, status, dueDate, assigneeId, creatorId
- Sessions: id, token, userId, createdAt

### Task Statuses
- `todo`, `in_progress`, `done`, `review`

### Task Priorities  
- `low`, `medium`, `high`

## Common Patterns

### Adding New Features
1. Create server action in appropriate `actions.ts` file
2. Build UI component following shadcn/ui patterns
3. Use TypeScript with Prisma-generated types
4. Always run `npm run lint` before committing
5. Test complete user workflow after changes

### TypeScript Usage
- Use Prisma-generated types: `import type { Task, User } from "@/app/generated/prisma"`
- Extend types with relations: `TaskWithProfile` pattern
- Use proper typing for Server Actions and form data

### Styling Conventions
- Use Tailwind CSS utility classes
- Follow shadcn/ui component patterns
- Use Poppins font for headings, Inter for body text
- Consistent color scheme with CSS variables

## Linting and Code Quality

### Before Committing
- ALWAYS run `npm run lint` -- takes ~5 seconds
- Fix TypeScript warnings and errors
- Current TypeScript issues requiring Prisma client generation:
  - 12 compilation errors in 11 files when Prisma client is missing
  - All imports from `@/app/generated/prisma` and `@/app/generated/prisma/client` fail
  - Key affected files: actions.ts files, components with Task types
- Current known lint issues (as of last check):
  - `@typescript-eslint/no-unused-vars` warnings in several files
  - `@typescript-eslint/no-explicit-any` errors in login/signup pages
  - `@typescript-eslint/no-empty-object-type` error in textarea component
  - Implicit 'any' type errors in board/page.tsx and team/page.tsx

### Code Style
- Use TypeScript strict mode
- Prefer Server Components over Client Components when possible
- Use Server Actions for data mutations
- Follow Next.js App Router patterns

## Troubleshooting

### Network-Restricted Environments
- Database setup will fail - document this limitation
- Font loading will fail - replace with local fonts or system fonts
- Build process will fail - address font dependencies first
- **COMPLETE WORKAROUND FOR RESTRICTED ENVIRONMENTS**:
  1. Replace all `next/font/google` imports with local font alternatives
  2. Create mock Prisma client types in `app/generated/prisma/` directory  
  3. Use alternative database solutions or mock data for development
  4. Document these changes as environment-specific modifications

### Development Issues
- If Prisma client missing: Check network access for binary downloads
- If fonts not loading: Check network access to fonts.googleapis.com
- If build fails: Usually network-related font or dependency issues
- If TypeScript errors: Usually missing Prisma client generation

### Common File Locations to Check After Changes
- Always check `app/(dashboard)/tasks/actions.ts` after modifying task-related features
- Always check component files in `components/` after UI changes
- Always check `prisma/schema.prisma` after database changes
- Always check font imports in `app/layout.tsx`, `lib/fonts.ts`, `components/ui/card.tsx` after styling changes

## CRITICAL Timing Information

- **npm install**: ~49 seconds - NEVER CANCEL, set timeout to 120+ seconds
- **npm run lint**: ~5 seconds - safe to use default timeout
- **npm run build**: Network dependent - NEVER CANCEL if network available, set timeout to 300+ seconds
- **npm run dev**: ~10-15 seconds startup - NEVER CANCEL, set timeout to 60+ seconds
- **Database setup**: Network dependent - NEVER CANCEL if network available, set timeout to 180+ seconds

## Environment Requirements

- Node.js (version requirement: "^20" per package.json)
- npm (package-lock.json indicates npm usage)
- Next.js 15.4.6 with App Router and Turbopack
- Prisma 6.13.0 for database ORM
- Network access for:
  - Prisma binary downloads (binaries.prisma.sh) - REQUIRED for database functionality
  - Google Fonts (fonts.googleapis.com) - REQUIRED for build process
  - Build-time dependencies

### Dependency Versions (Validated)
- next@15.4.6
- @prisma/client@6.13.0
- prisma@6.13.0
- react@19.1.0
- TypeScript@5.x

**ALWAYS validate these instructions work in your specific environment and document any additional limitations discovered.**