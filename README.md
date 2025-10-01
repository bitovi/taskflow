# TaskFlow — AI Feature Generation Demo

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.13.0-2D3748?logo=prisma)](https://www.prisma.io/)

A modern, full-featured task management application built with Next.js 14, React, TypeScript, and Prisma. TaskFlow provides a comprehensive solution for managing tasks and projects with an intuitive drag-and-drop Kanban board interface, user authentication, and powerful task filtering capabilities.

**🤖 AI Demo Purpose**: This repository is intentionally structured as a demo and sandbox for Bitovi's AI-powered development workflows, showcasing how AI agents can understand codebases and automatically implement features from Jira tickets.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [What You'll Do in This Demo](#-what-youll-do-in-this-demo)
- [Installation](#-installation)
- [Project Structure](#-project-structure)
- [Branches Used in This Demo](#-branches-used-in-this-demo)
- [The AI-Implemented Feature (USER-13)](#-the-ai-implemented-feature-user-13)
- [Tutorial: Running the AI Workflows Yourself](#-tutorial-running-the-ai-workflows-yourself)
- [Development](#-development)
- [Database Management](#-database-management)
- [API Reference](#-api-reference)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### Core Task Management
- **Task Creation & Management**: Create, edit, delete, and organize tasks with detailed descriptions
- **Priority System**: High, Medium, Low priority levels with visual indicators
- **Status Tracking**: Todo, In Progress, Review, Done status workflow
- **Due Date Management**: Set and track task deadlines
- **User Assignment**: Assign tasks to team members

### Kanban Board Interface
- **Drag & Drop**: Intuitive task movement between status columns
- **Real-time Updates**: Status changes reflect immediately across the application
- **Visual Organization**: Clean, modern interface powered by shadcn/ui components

### User Management
- **Secure Authentication**: Bcrypt-hashed passwords and session management
- **User Profiles**: Team member profiles with avatars and contact information
- **Multi-user Support**: Collaborative task management across teams

### Search & Filtering (AI-Implemented Feature)
- **Global Search**: Find tasks by title, description, or keywords
- **Advanced Filters**: Filter by priority, status, assignee, and due date
- **Real-time Results**: Instant filtering as you type

## 🛠 Tech Stack

### Frontend
- **[Next.js 15.4.6](https://nextjs.org/)** - React framework with App Router
- **[React 19.1.0](https://reactjs.org/)** - UI library with latest features
- **[TypeScript 5.x](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Modern React component library
- **[Radix UI](https://www.radix-ui.com/)** - Accessible, unstyled UI primitives
- **[Lucide React](https://lucide.dev/)** - Beautiful & consistent icon library

### Backend & Database
- **[Prisma ORM](https://www.prisma.io/)** - Type-safe database access
- **[SQLite](https://www.sqlite.org/)** - Lightweight database for development
- **[Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)** - Server-side mutations

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting and formatting
- **[Turbopack](https://turbo.build/pack)** - Fast development bundler
- **[bcryptjs](https://www.npmjs.com/package/bcryptjs)** - Password hashing

### Architecture Highlights
- **App Router Structure**: Leverages Next.js 14+ App Router for optimal performance
- **Server Components**: Maximizes server-side rendering where appropriate  
- **Feature-based Organization**: Modular codebase organized by application features
- **Type Safety**: End-to-end TypeScript integration with Prisma-generated types

## 🚀 Reference Materials

- [Instruction generation](https://github.com/bitovi/ai-enablement-prompts/tree/main/understanding-code/instruction-generation) workflow
- [Feature generation](https://github.com/bitovi/ai-enablement-prompts/tree/main/writing-code/generate-feature) workflow 
- Example [Jira ticket](https://bitovi.atlassian.net/browse/PLAY-23) used in this repo
- [Figma designs](https://www.figma.com/design/TvHxpQ3z4Zq5JWOVUkgLlU/Tasks-Search-and-Filter?m=auto&t=ehht6F82l82y3XIW-6)

## What you’ll do in this demo

- Run the app locally with seeded sample data
- Explore the baseline experience on the `main` branch
- Review the AI-completed feature for USER-13 on the `user-13-search-and-filter` branch
- Compare branches and see exactly what the AI changed
- Optionally, follow the Bitovi workflows to reproduce the feature implementation with your own AI agent

## Tech overview

- Next.js 14 App Router, React, TypeScript
- Prisma ORM with SQLite for local development
- shadcn/ui + Radix + Tailwind for UI
- Feature-based structure with server actions and typed components

## 📁 Project Structure

```
taskflow/
├── app/                          # Next.js App Router
│   ├── (dashboard)/             # Dashboard layout group
│   │   ├── board/              # Kanban board page
│   │   ├── tasks/              # Task management pages
│   │   └── team/               # Team overview page
│   ├── login/                  # Authentication pages
│   ├── signup/
│   └── layout.tsx              # Root layout
├── components/                  # Reusable UI components
│   ├── ui/                     # shadcn/ui components
│   ├── kanban-board.tsx        # Drag-and-drop board
│   ├── task-list.tsx           # Task listing component
│   └── sidebar.tsx             # Navigation sidebar
├── lib/                        # Utility functions and types
├── prisma/                     # Database schema and migrations
│   ├── schema.prisma           # Database schema
│   ├── seed.js                 # Sample data generation
│   └── migrations/             # Database migrations
└── public/                     # Static assets
```

### Key Directories Explained
- **`app/(dashboard)/`**: Protected pages requiring authentication
- **`components/ui/`**: Reusable UI components following shadcn/ui patterns
- **`lib/`**: Shared utilities, types, and configuration
- **`prisma/`**: Database schema, migrations, and seeding scripts

## 📦 Installation

### Prerequisites
- **Node.js 18+** (recommended: use [nvm](https://github.com/nvm-sh/nvm) for version management)
- **npm** (comes with Node.js)
- **Git** for repository management

### Quick Start

1. **Clone and Install**
   ```bash
   git clone https://github.com/bitovi/taskflow
   cd taskflow
   npm install
   ```

2. **Database Setup**
   ```bash
   # One command setup: creates database, runs migrations, and seeds data
   npm run db:setup
   ```
   
   This creates sample data including:
   - 7 test users with varied profiles
   - 30+ realistic tasks across all status categories
   - 3 active user sessions for testing

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   🚀 Open [http://localhost:3000](http://localhost:3000) in your browser

### Default Login Credentials
- **Email**: `alice@example.com`  
- **Password**: `password123`

### Alternative Setup (Docker)
```bash
# Build and run with Docker
docker build -t taskflow .
docker run -p 3000:3000 taskflow
```

### Troubleshooting
- **Port 3000 in use**: Use `npm run dev -- -p 3001` to run on a different port
- **Database issues**: Run `npm run db:reset` to clear and re-seed the database
- **Permission errors**: Ensure you have write permissions in the project directory

## Branches used in this demo

- main
  - Baseline application used as the starting point for AI feature work
  - Visit /tasks to see the tasks page before the feature is implemented

- user-13-search-and-filter
  - Contains the implementation of Jira ticket PLAY-23
  - Adds a searchable task bar and filter controls to the /tasks page
  - Follows the project’s patterns (server actions, Prisma, shadcn/ui, accessibility)

Common Git operations for exploring the demo:
```bash
# Fetch all branches
git fetch --all

# Switch between the baseline and AI-implemented feature
git switch main
git switch user-13-search-and-filter

# See what changed between branches
git diff main...user-13-search-and-filter
```

## 🌿 Branches Used in This Demo

### Branch Overview

| Branch | Purpose | Key Features |
|--------|---------|--------------|
| `main` | **Baseline Application** | Core task management, Kanban board, user auth |
| `user-13-search-and-filter` | **AI-Implemented Feature** | Search functionality, advanced filtering |

### Branch Details

#### 🔵 `main` Branch
- **Purpose**: Starting point for AI feature development
- **Features**: Complete task management system without search functionality
- **Demo Usage**: Navigate to `/tasks` to see the baseline task interface
- **Key Pages**: Dashboard, Tasks, Kanban Board, Team overview

#### 🟢 `user-13-search-and-filter` Branch  
- **Purpose**: Demonstrates AI implementation of search/filter functionality
- **Jira Ticket**: [USER-13](https://bitovi-training.atlassian.net/browse/USER-13)
- **New Features**:
  - Global task search by title/description
  - Filter by priority (High, Medium, Low)
  - Filter by status (Todo, In Progress, Review, Done)
  - Filter by assignee
  - Real-time filtering as you type
- **AI Adherence**: Follows established patterns (server actions, Prisma, shadcn/ui, accessibility)

### Git Operations for Demo Exploration

```bash
# Initial setup
git fetch --all
git checkout main

# Explore baseline functionality
npm run dev  # Visit http://localhost:3000/tasks

# Switch to AI-implemented feature
git checkout user-13-search-and-filter
# Refresh browser to see new functionality

# Compare what the AI changed
git diff main...user-13-search-and-filter

# View specific file changes
git diff main...user-13-search-and-filter -- app/\(dashboard\)/tasks/
```

### Understanding the Changes
- **Files Modified**: Primarily in `app/(dashboard)/tasks/` directory
- **Patterns Maintained**: Server Actions for data fetching, TypeScript types, component structure
- **UI Components**: New search and filter components following shadcn/ui patterns

## 🤖 The AI-Implemented Feature (USER-13)

### 📄 Jira Ticket Reference
**Ticket**: [USER-13](https://bitovi-training.atlassian.net/browse/USER-13)

### ✨ Feature Summary
The AI agent successfully implemented a comprehensive search and filtering system for the tasks page:

- **Global Search**: Search tasks by title, description, or keywords with real-time results
- **Priority Filters**: Filter by High, Medium, Low priority levels
- **Status Filters**: Filter by Todo, In Progress, Review, Done statuses  
- **Assignee Filters**: Filter tasks by assigned team member
- **Combined Filtering**: Use multiple filters simultaneously for precise results
- **Responsive Design**: Mobile-friendly interface following existing design patterns

### 🎮 How to Experience the Feature

1. **Start the Application**
   ```bash
   npm run dev
   # Navigate to http://localhost:3000
   ```

2. **Login with Test Account**
   - Email: `alice@example.com`
   - Password: `password123`

3. **Compare Before/After**
   - **Baseline (`main` branch)**: Navigate to `/tasks` - simple task list
   - **Enhanced (`user-13-search-and-filter` branch)**: Same page with search bar and filter controls

4. **Test the Features**
   - Type in search box to find tasks by title/description
   - Use dropdown filters to narrow results by priority and status
   - Try combinations like "High priority + In Progress status"
   - Notice real-time updates as you type and filter

### 🧠 AI Implementation Quality
- ✅ **Code Patterns**: Follows existing Next.js App Router and Server Actions patterns
- ✅ **UI Consistency**: Uses established shadcn/ui components and styling
- ✅ **TypeScript**: Maintains type safety throughout the implementation
- ✅ **Accessibility**: Proper ARIA labels and keyboard navigation
- ✅ **Performance**: Efficient database queries with Prisma
- ✅ **User Experience**: Intuitive interface matching Figma designs

## 🎓 Tutorial: Running the AI Workflows Yourself

Want to recreate this AI-powered development experience? Follow the Bitovi AI enablement workflows to implement your own features.

### 📚 Prerequisites Knowledge
- Basic understanding of Next.js and React
- Familiarity with Git workflows
- Access to an AI coding assistant (e.g., GitHub Copilot, Claude, ChatGPT)

### 🔄 Two-Phase Workflow

#### Phase 1: Instruction Generation
**Goal**: Create codebase-specific instructions that your AI will follow

1. **Setup**
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Follow the Guide**
   - 📖 [Instruction Generation Workflow](https://github.com/bitovi/ai-enablement-prompts/tree/main/understanding-code/instruction-generation)
   - **Input**: Your codebase structure and patterns
   - **Output**: Tailored coding instructions for your AI agent

3. **Expected Outcome**: A comprehensive instruction file covering:
   - Code organization patterns
   - Technology stack preferences
   - UI/UX guidelines
   - Testing approaches

#### Phase 2: Feature Generation
**Goal**: Point your AI at a Jira ticket and have it implement the feature

1. **Prepare Feature Implementation**
   ```bash
   # Start from clean main branch
   git checkout main
   git checkout -b your-feature-branch
   ```

2. **Follow the Guide**
   - 📖 [Feature Generation Workflow](https://github.com/bitovi/ai-enablement-prompts/tree/main/writing-code/generate-feature)
   - **Input**: Jira ticket (use USER-13 as example) + your instruction file
   - **Output**: Fully implemented feature following your codebase patterns

3. **Test Implementation**
   ```bash
   npm run dev
   # Test your AI's implementation
   ```

### 🏆 Success Comparison

After your AI implements the feature, compare results:

```bash
# See what your AI changed
git diff main...your-feature-branch

# Compare to the reference implementation
git diff your-feature-branch...user-13-search-and-filter

# Analyze differences
git log --oneline user-13-search-and-filter
```

### 📊 Evaluation Criteria
Rate your AI's implementation on:
- **Code Quality**: Following established patterns
- **Feature Completeness**: Meeting all ticket requirements  
- **UI/UX Consistency**: Matching design standards
- **Performance**: Efficient queries and rendering
- **Accessibility**: Proper ARIA and keyboard support

### 🎯 Challenge Variations
1. **Easy**: Use the exact USER-13 ticket
2. **Medium**: Modify USER-13 requirements (e.g., add date filtering)
3. **Hard**: Create a new feature ticket and see if your AI can implement it

### 💡 Tips for Success
- **Be Specific**: Provide clear, detailed requirements in your tickets
- **Iterate**: Review and refine your AI's output
- **Test Thoroughly**: Verify functionality across different browsers and devices
- **Document**: Keep notes on what works well with your AI setup

## 🛠 Development

### Available Scripts

| Command | Description | Use Case |
|---------|-------------|----------|
| `npm run dev` | Start development server with hot reload | Daily development |
| `npm run build` | Create production build | Pre-deployment testing |
| `npm run start` | Start production server | Production deployment |
| `npm run lint` | Check code for errors and style issues | Code quality |
| `npm run ci` | Run continuous integration checks | Automated testing |

### Development Workflow

1. **Start Development Environment**
   ```bash
   npm run dev
   # Server starts on http://localhost:3000
   # Hot reload enabled for instant changes
   ```

2. **Code Style & Quality**
   ```bash
   # Check for linting issues
   npm run lint
   
   # Fix auto-fixable issues
   npm run lint -- --fix
   ```

3. **Database Operations During Development**
   ```bash
   # Reset database with fresh seed data
   npm run db:reset
   
   # Add new seed data only
   npm run db:seed
   
   # Clear all data
   npm run db:clear
   ```

### Key Development Patterns

#### Server Actions (app/(dashboard)/tasks/actions.ts)
```typescript
// Example: Server-side data fetching
export async function getAllTasks() {
  try {
    const tasks = await prisma.task.findMany({
      include: { assignee: true, creator: true }
    })
    return { tasks, error: null }
  } catch (error) {
    return { tasks: null, error: 'Failed to fetch tasks' }
  }
}
```

#### Component Structure
- **Server Components**: Default for data fetching and static content
- **Client Components**: Use "use client" for interactivity
- **shadcn/ui**: Consistent component library with Tailwind styling

#### Type Safety
- All database operations use Prisma-generated types
- TypeScript strict mode enabled
- Interface definitions in `lib/types.ts`

### Debugging Tips

- **Database Issues**: Check `app.db` SQLite file exists and has correct permissions
- **TypeScript Errors**: Run `npx prisma generate` after schema changes
- **UI Components**: Use browser dev tools to inspect Tailwind classes
- **Server Actions**: Check terminal output for server-side errors

## 🗄 Database Management

### Schema Overview
The application uses SQLite with Prisma ORM for type-safe database operations:

```sql
-- Core tables
Users (id, email, password, name)
Tasks (id, name, description, priority, status, dueDate, assigneeId, creatorId)
Sessions (id, token, userId) -- for authentication
```

### Available Scripts

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `npm run db:setup` | **Full setup** - Create DB, migrate, seed | Initial setup, clean slate |
| `npm run db:seed` | **Add sample data** | Need more test data |
| `npm run db:clear` | **Remove all data** | Clean database, keep structure |
| `npm run db:reset` | **Clear + re-seed** | Fresh data for testing |

### Sample Data Details

#### 👥 Users (7 total)
- **alice@example.com** - Primary test account (password: `password123`)
- **bob@example.com** through **george@example.com** - Additional team members
- All users have the same password for easy testing

#### 📋 Tasks (30+ total)
- **Priorities**: Distributed across High, Medium, Low
- **Statuses**: Todo (3), In Progress (9), Review (9), Done (9)
- **Assignments**: 80% have assignees, 20% unassigned
- **Due Dates**: 70% have due dates, varied time ranges
- **Realistic Content**: Task names and descriptions mirror real development work

#### 🔑 Sessions (3 active)
- Pre-created sessions for testing login persistence
- Sessions tied to different users for multi-user testing

### Database Schema Management

```bash
# View current schema
cat prisma/schema.prisma

# Generate Prisma client after schema changes
npx prisma generate

# Create migration (if using migrations instead of db push)
npx prisma migrate dev --name your-migration-name

# View data in browser (launches Prisma Studio)
npx prisma studio
```

### Production Considerations
- **SQLite** is suitable for demos and small applications
- For production, consider PostgreSQL or MySQL
- Update `prisma/schema.prisma` datasource for other databases
- Environment variables for database URLs

- Environment variables for database URLs

## 📡 API Reference

TaskFlow uses Next.js Server Actions for API operations. Here are the key endpoints:

### Task Operations

#### `getAllTasks()`
```typescript
// Location: app/(dashboard)/tasks/actions.ts
// Purpose: Fetch all tasks with user relationships
// Returns: { tasks: Task[], error: string | null }

const { tasks, error } = await getAllTasks()
```

#### `createTask(formData: FormData)`
```typescript
// Purpose: Create a new task
// Required fields: name, description, priority
// Optional fields: assigneeId, dueDate
// Returns: { success: boolean, task?: Task, error?: string }
```

#### `updateTask(id: number, data: Partial<Task>)`
```typescript
// Purpose: Update existing task
// Supports: status changes, reassignment, priority updates
// Returns: { success: boolean, error?: string }
```

#### `deleteTask(id: number)`
```typescript
// Purpose: Remove task from database
// Returns: { success: boolean, error?: string }
```

### User Operations

#### `loginUser(formData: FormData)`
```typescript
// Location: app/login/actions.ts
// Purpose: Authenticate user and create session
// Required: email, password
// Returns: Redirect or error
```

#### `createUser(formData: FormData)`
```typescript
// Location: app/signup/actions.ts  
// Purpose: Register new user account
// Required: name, email, password
// Returns: Redirect or error
```

### Search & Filter (USER-13 Feature)

#### `searchTasks(query: string, filters: TaskFilters)`
```typescript
// Purpose: Search and filter tasks by various criteria
// Filters: priority, status, assigneeId, searchText
// Returns: { tasks: Task[], error: string | null }
```

### Data Types

```typescript
interface Task {
  id: number
  name: string
  description: string
  priority: 'high' | 'medium' | 'low'
  status: 'todo' | 'in_progress' | 'review' | 'done'
  dueDate?: Date
  assigneeId?: number
  creatorId: number
  assignee?: User
  creator: User
  createdAt: Date
  updatedAt: Date
}

interface User {
  id: number
  email: string
  name: string
  createdTasks: Task[]
  assignedTasks: Task[]
}
```

## 🤝 Contributing

We welcome contributions to TaskFlow! This section covers how to contribute effectively.

### 🚀 Quick Start for Contributors

1. **Fork & Clone**
   ```bash
   # Fork the repository on GitHub
   git clone https://github.com/YOUR-USERNAME/taskflow
   cd taskflow
   ```

2. **Setup Development Environment**
   ```bash
   npm install
   npm run db:setup
   npm run dev
   ```

3. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

### 📋 Contribution Guidelines

#### Code Standards
- **TypeScript**: All new code must use TypeScript with proper typing
- **ESLint**: Pass all linting checks (`npm run lint`)
- **Formatting**: Follow existing code style and patterns
- **Components**: Use shadcn/ui components and existing patterns
- **Server Actions**: Follow the established pattern for data operations

#### Git Workflow
```bash
# 1. Keep your branch updated
git checkout main
git pull upstream main
git checkout your-feature-branch
git rebase main

# 2. Make focused commits
git add .
git commit -m "feat: add task search functionality"

# 3. Push and create PR
git push origin your-feature-branch
# Create PR through GitHub interface
```

#### Commit Message Format
Use conventional commits for clear history:
- `feat:` New features
- `fix:` Bug fixes  
- `docs:` Documentation updates
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/updates
- `chore:` Maintenance tasks

### 🧪 Testing Your Changes

1. **Manual Testing**
   ```bash
   npm run dev
   # Test all affected features
   # Verify UI responsiveness
   # Check both desktop and mobile views
   ```

2. **Code Quality**
   ```bash
   npm run lint
   npm run build  # Ensure it builds successfully
   ```

3. **Database Changes**
   ```bash
   # If you modify schema or seed data
   npm run db:reset
   # Verify sample data loads correctly
   ```

### 📝 Pull Request Checklist

Before submitting your PR, ensure:

- [ ] **Code Quality**
  - [ ] Passes `npm run lint` without errors
  - [ ] Builds successfully (`npm run build`)
  - [ ] Follows existing code patterns and structure
  - [ ] Includes TypeScript types for new functions/components

- [ ] **Functionality**  
  - [ ] Feature works as described in issue/requirements
  - [ ] No breaking changes to existing functionality
  - [ ] Handles edge cases and error states appropriately
  - [ ] Mobile-responsive (if UI changes)

- [ ] **Documentation**
  - [ ] Updates README if adding new features
  - [ ] Includes code comments for complex logic
  - [ ] Updates any relevant API documentation

- [ ] **AI Demo Compatibility**
  - [ ] Maintains existing AI workflow examples
  - [ ] Doesn't break the main vs user-13-search-and-filter branch comparison
  - [ ] Follows patterns that AI agents can understand and replicate

### 🎯 Contribution Ideas

#### Beginner-Friendly
- **UI Improvements**: Enhance existing components with better styling
- **Bug Fixes**: Address issues in the GitHub issue tracker
- **Documentation**: Improve setup instructions or add code examples
- **Accessibility**: Add ARIA labels or keyboard navigation improvements

#### Intermediate
- **New Features**: Task categories, due date reminders, task comments
- **Performance**: Optimize database queries or component rendering
- **Testing**: Add unit tests or integration tests
- **Mobile Experience**: Improve responsive design

#### Advanced
- **Real-time Updates**: WebSocket integration for live task updates
- **Advanced Search**: Full-text search with ElasticSearch
- **API Integration**: Connect with external services (Slack, email)
- **AI Enhancements**: Improve the AI workflow examples

### 🤖 AI-Specific Contributions

Since TaskFlow demonstrates AI-powered development:

- **Instruction Improvements**: Enhance the AI instruction generation process
- **Workflow Documentation**: Better examples of AI-human collaboration
- **Pattern Recognition**: Help AI agents better understand the codebase
- **Demo Scenarios**: Create new features that showcase AI capabilities

### 📞 Getting Help

- **Issues**: Check existing GitHub issues before creating new ones
- **Discussions**: Use GitHub Discussions for questions and ideas  
- **Code Review**: Maintainers will review PRs and provide feedback
- **Community**: Join discussions about AI-powered development workflows

- **Community**: Join discussions about AI-powered development workflows

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### What This Means
- ✅ **Commercial Use**: Use this code in commercial projects
- ✅ **Modification**: Modify and adapt the code for your needs
- ✅ **Distribution**: Share and distribute the code
- ✅ **Private Use**: Use in private/internal projects
- ⚠️ **Attribution**: Include the original license and copyright notice

### For AI Development Workflows
The permissive MIT license makes this project ideal for:
- **Learning**: Study and understand AI-powered development patterns
- **Experimentation**: Use as a base for your own AI workflow testing
- **Training**: Teach others about AI-human collaboration in development
- **Extension**: Build upon these patterns for your own projects

---

<div align="center">

**Built with ❤️ by [Bitovi](https://www.bitovi.com/) for the AI development community**

[🐛 Report Bug](https://github.com/bitovi/taskflow/issues/new?labels=bug) • [✨ Request Feature](https://github.com/bitovi/taskflow/issues/new?labels=enhancement) • [❓ Ask Question](https://github.com/bitovi/taskflow/discussions)

</div>
