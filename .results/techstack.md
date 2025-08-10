# Tech Stack Analysis

## Core Technology Analysis

**Programming Language:** TypeScript/JavaScript
- Primary language: TypeScript for type safety
- JavaScript runtime: Node.js with Next.js framework

**Primary Framework:** Next.js 15.4.6
- App Router architecture (Next.js 13+ pattern)
- Server and Client Components
- Server Actions for data mutations
- File-based routing system

**Secondary/Tertiary Frameworks:**
- **React 19.1.0** - UI library with modern features (useOptimistic, useActionState, useTransition)
- **Prisma 6.13.0** - Database ORM and migration tool
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Headless component primitives (@radix-ui/react-*)
- **@hello-pangea/dnd 18.0.1** - Drag and drop functionality (Beautiful DnD fork)
- **Lucide React 0.537.0** - Icon library
- **Recharts 3.1.2** - Charting/data visualization library

**State Management Approach:**
- **Server State**: Prisma + Next.js Server Actions
- **Client State**: React built-in hooks (useState, useReducer)
- **Optimistic Updates**: React 19's useOptimistic hook
- **Form State**: useActionState hook for server action integration
- **Database**: SQLite with Prisma ORM

**Additional Technologies:**
- **class-variance-authority (cva)** - Component variant management
- **date-fns** - Date utility library
- **bcryptjs** - Password hashing
- **TypeScript 5** - Static type checking

## Domain Specificity Analysis

**Problem Domain:** Task Management Application
- Core focus: Team-based task tracking and project management
- Primary use case: Kanban-style task organization with drag-and-drop functionality
- Secondary features: Task analytics, team collaboration, productivity metrics

**Core Business Concepts:**
- **Task Management**: Creating, updating, deleting, and organizing tasks
- **Team Collaboration**: Multi-user assignment and ownership
- **Status Workflows**: Todo → In Progress → Review → Done pipeline
- **Priority Management**: High/Medium/Low priority classification
- **Analytics**: Task completion tracking, team performance metrics

**User Interaction Types:**
- **Task CRUD Operations**: Create, read, update, delete tasks
- **Drag-and-Drop Interface**: Kanban board interaction for status changes
- **Dashboard Analytics**: Visual charts and metrics viewing
- **Authentication Workflows**: Login/logout, session management
- **Form-based Data Entry**: Task creation and editing forms

**Primary Data Types and Structures:**
- **Task Entity**: id, name, description, priority, status, dueDate, assigneeId, creatorId
- **User Entity**: id, email, password, name with task relationships
- **Session Entity**: Authentication session management
- **Kanban Data Structure**: Column-based task organization (todo, in_progress, review, done)
- **Team Analytics**: Aggregated statistics and performance metrics

## Application Boundaries

**Features Clearly Within Scope:**
- Task creation, editing, and deletion
- Kanban board with drag-and-drop functionality
- User authentication and session management
- Task assignment to team members
- Priority and status management
- Due date tracking
- Team analytics and performance dashboards
- Task filtering and organization
- Real-time optimistic UI updates

**Architecturally Consistent Features:**
- Additional task fields (labels, attachments, comments)
- Team/project-based task organization
- More granular permission systems
- Advanced filtering and search capabilities
- Notification systems
- Time tracking features
- Calendar integration
- Enhanced analytics and reporting

**Architecturally Inconsistent Features:**
- Real-time chat/messaging (would require WebSocket infrastructure)
- File storage/document management (lacks blob storage setup)
- Third-party integrations requiring complex authentication flows
- Complex workflow automation (no workflow engine)
- Advanced AI/ML features (no ML infrastructure)
- Video conferencing or real-time collaboration tools

**Domain Constraints:**
- **Database**: Limited to SQLite (development) - production might need PostgreSQL/MySQL
- **Authentication**: Session-based (no OAuth/SSO built-in)
- **File Handling**: No file upload/storage capabilities currently implemented
- **Real-time Features**: Limited to optimistic updates, no WebSocket support
- **Deployment**: Configured for single-instance deployment

**Specialized Libraries and Patterns:**
- **@hello-pangea/dnd**: Constrains drag-and-drop to this specific implementation
- **Prisma Schema**: Defines rigid data relationships and structure
- **Server Actions**: All mutations must follow Next.js server action patterns
- **shadcn/ui + Radix**: Component library constraints requiring specific patterns
- **Tailwind CSS**: Utility-first styling approach throughout
