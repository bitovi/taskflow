# Tech Stack Analysis

## Core Technology Analysis

### Programming Language(s)
- **TypeScript** - Primary language for the entire application (strict mode enabled)
- **JavaScript** - Used in configuration and seed files

### Primary Framework
- **Next.js 15.5.7** - React meta-framework with App Router
  - Using Turbopack for development
  - Server Actions enabled (experimental)
  - Server-side rendering capabilities

### Secondary/Tertiary Frameworks
- **React 19.1.0** - UI library (latest version)
- **Prisma 6.13.0** - ORM for database management
  - PostgreSQL database
  - Custom output directory (`app/generated/prisma`)
  - Binary engine type
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Headless component library for:
  - Dialogs, dropdowns, checkboxes, labels, select, avatars, slots
- **Testing Frameworks**:
  - Jest 29 - Unit testing (with jsdom environment)
  - React Testing Library - Component testing
  - Playwright - End-to-end testing

### State Management Approach
- **Server Actions** - Primary data mutation pattern (Next.js 15 native)
- **React Hooks** - Client-side state (`useState`, `useEffect`)
- **No external state management library** (Redux, Zustand, etc.)
- Direct database calls through Prisma in server actions

### Other Relevant Technologies
- **PostgreSQL** - Relational database
- **bcryptjs** - Password hashing
- **date-fns** - Date manipulation
- **Recharts** - Data visualization library
- **@hello-pangea/dnd** - Drag and drop functionality (Kanban board)
- **Lucide React** - Icon library
- **class-variance-authority** - Component variant management
- **ESLint** - Code linting (Next.js config)

## Domain Specificity Analysis

### Problem Domain
**Team Task Management Application** - A collaborative project and task tracking system focused on organizing work across teams with visual boards and status tracking.

### Core Business Concepts
- **Task Management**: Creating, assigning, tracking, and completing tasks
- **User Management**: Authentication, authorization, team member profiles
- **Task Status Workflow**: Tasks progress through states (in_progress, done, etc.)
- **Task Assignment**: Assigning tasks to specific team members
- **Task Prioritization**: Priority levels for task organization
- **Team Collaboration**: Multiple users working on shared tasks
- **Dashboard Analytics**: Visual representation of task metrics and team performance

### User Interactions Supported
1. **Authentication Workflows**: Login, signup, session management
2. **Task CRUD Operations**: Create, read, update, delete tasks
3. **Visual Task Organization**: Kanban board with drag-and-drop
4. **Task List Views**: Table/list views with filtering and sorting
5. **Dashboard Visualization**: Charts showing task distribution, completion rates
6. **Team Overview**: Viewing team members and their task assignments
7. **Form-based Interactions**: Creating and editing tasks through forms

### Primary Data Types and Structures

**Core Models** (from Prisma schema):
```typescript
User {
  id, email, password, name
  createdTasks[], assignedTasks[], sessions[]
}

Task {
  id, name, description, priority, status, dueDate
  assignee, creator
  createdAt, updatedAt
}

Session {
  id, token, userId
  createdAt
}
```

**Data Patterns**:
- Relational data with foreign keys (creator/assignee relationships)
- Timestamps for auditing (createdAt, updatedAt)
- Enum-like fields (status, priority stored as strings)
- Many-to-many relationships through task assignments

## Application Boundaries

### Features/Functionality Within Scope

**Implemented Features**:
1. User authentication (login/signup with sessions)
2. Task creation, editing, and management
3. Task assignment to team members
4. Multiple views: Dashboard, Task List, Kanban Board, Team Page
5. Visual analytics (charts for task status, priority distribution)
6. Drag-and-drop task organization
7. Task filtering and status management
8. Date-based task tracking (due dates)

**Architectural Patterns**:
- Server-first architecture (Next.js App Router)
- File-based routing with route groups `(dashboard)`
- Server actions for mutations (`actions.ts` files)
- Component-based UI architecture
- Separation of concerns (components, lib, app directories)

### Architecturally Inconsistent Features

**Would NOT fit the current design**:
1. **Real-time collaboration** (no WebSocket/SSE infrastructure)
2. **Complex multi-tenant architecture** (single-database design)
3. **Mobile native app** (web-first architecture)
4. **File attachments/storage** (no file upload infrastructure)
5. **Advanced access control** (simple creator/assignee model)
6. **Audit logging** (basic timestamps only)
7. **API-first design** (UI-centric, no dedicated API routes)
8. **Microservices** (monolithic Next.js app)
9. **GraphQL** (uses Prisma directly, not GraphQL layer)
10. **Third-party integrations** (no webhook/API integration patterns)

### Specialized Libraries Suggesting Domain Constraints

1. **@hello-pangea/dnd** - Indicates Kanban/board-based workflows are central
2. **Recharts** - Analytics and data visualization are key features
3. **Radix UI components** - Accessibility-focused UI patterns
4. **bcryptjs** - Traditional username/password auth (not OAuth/SSO)
5. **date-fns** - Time-based task management (due dates, scheduling)

### Technology Constraints

**Database**: PostgreSQL-specific (Prisma config), not database-agnostic
**Deployment**: Likely Vercel-optimized (Next.js Turbopack, server actions)
**Testing**: Jest/Playwright ecosystem (not Vitest or Cypress)
**Styling**: Tailwind CSS 4 conventions (utility classes, not CSS-in-JS)
**Type Safety**: TypeScript strict mode (type checking required)

## Architecture Type

**Full-Stack Monolithic Web Application**
- Next.js App Router with server-side rendering
- Collocated frontend and backend
- Database-first design pattern
- Component-driven UI architecture
- Server actions for data mutations
- File-based routing convention

## Development Workflow

**Build & Dev**:
- Development: Turbopack-powered dev server
- Testing: Unit tests (Jest) and E2E tests (Playwright)
- Linting: ESLint with Next.js config
- Database: Prisma migrations and seeding scripts

**Conventions**:
- TypeScript for type safety
- Server actions in `actions.ts` files
- UI components in `components/` directory
- Route groups for layout organization
- Prisma schema as source of truth for data model
