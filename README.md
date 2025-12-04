# TaskFlow — AI Feature Generation Demo

A modern task management app built with Next.js 14, React, TypeScript, and Prisma. TaskFlow provides a comprehensive solution for managing tasks, and projects with an intuitive drag-and-drop Kanban board interface.

👉 Bitovi can help you integrate this into your own SDLC workflow: [AI for Software Teams](https://www.bitovi.com/ai-for-software-teams)

---

This repository is intentionally structured as a demo and sandbox for Bitovi's AI workflows:
- Understanding a codebase and generating copilot instructions
- Automatically implementing features from a Jira ticket

Reference materials:
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
- Prisma ORM with PostgreSQL database
- shadcn/ui + Radix + Tailwind for UI
- Feature-based structure with server actions and typed components
- Docker and Docker Compose for containerized development and deployment

## Prerequisites

- Node.js version 18 or greater
- Docker and Docker Compose (for containerized development)
- OR PostgreSQL 16+ (for local development without Docker)

## Installation

### Option 1: Using Dev Container (Recommended)

The easiest way to get started is using VS Code's Dev Container feature:

1. Clone the repository
   ```bash
   git clone https://github.com/bitovi/taskflow
   cd taskflow
   ```

2. Open in VS Code and reopen in container
   - VS Code will prompt you to "Reopen in Container"
   - Or use Command Palette: `Dev Containers: Reopen in Container`
   - The container will automatically:
     - Start PostgreSQL with the `taskflow` database pre-created
     - Run `npm run setup` to initialize the schema and seed data
   
3. The app will start automatically and be available at http://localhost:3000

### Option 2: Using Docker Compose

1. Clone the repository
   ```bash
   git clone https://github.com/bitovi/taskflow
   cd taskflow
   ```

2. Start the services
   ```bash
   docker-compose up
   ```
   This will:
   - Start PostgreSQL with the `taskflow` database pre-created
   - Build and start the application
   - Initialize the database schema and seed data
   - Make the app available at http://localhost:3000

### Option 3: Local Development (without Docker)

1. Clone the repository
   ```bash
   git clone https://github.com/bitovi/taskflow
   cd taskflow
   npm install
   ```

2. Set up PostgreSQL
   - Install PostgreSQL 16+ locally (e.g., [Postgres.app](https://postgresapp.com/) for Mac)
   - Start the PostgreSQL service
   - The setup will automatically create the `taskflow` database
   - **Note:** You may need to create a PostgreSQL user or update `.env` to use your existing user:
     - Use Postgres.app's default user (usually your Mac username)
     - Or create a `taskflow` user via GUI/pgAdmin
     - Update `DATABASE_URL` in `.env` accordingly

3. Configure environment variables
   ```bash
   cp .env.example .env
   ```
   Edit `.env` to match your local PostgreSQL setup:
   ```
   DATABASE_URL="postgresql://taskflow:taskflow@localhost:5432/taskflow"
   ```
   Update the username, password, host, or port if your setup differs.

4. Set up the database
   ```bash
   # Initializes schema and seeds data
   npm run db:setup
   ```
   This will create sample users and tasks for testing. Default login credentials:
   - Email: `alice@example.com`
   - Password: `password123`

5. Start the development server
   ```bash
   npm run dev
   ```
   Then open http://localhost:3000

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

## The AI-implemented feature (USER-13)

Ticket: https://bitovi-training.atlassian.net/browse/USER-13

Feature summary:
- Adds a searchable input and filters on the /tasks page
- Lets users quickly find tasks by text, priority, and status

How to try it:
1. Start the app (see Installation above)
2. Log in with the seeded account or create your own 
   - (alice@example.com / password123)
3. On `main`, navigate to /tasks and note the baseline behavior
4. Switch to `user-13-search-and-filter` and refresh /tasks
5. Try searching by task title/description and filtering by priority/status

## Tutorial: Running the AI workflows yourself

If you want to recreate the experience with your own AI agent, follow the Bitovi guides:

1) Instruction generation
- Goal: produce a codebase-specific instruction file the AI will follow when writing code
- Guide: https://github.com/bitovi/ai-enablement-prompts/tree/main/understanding-code/instruction-generation

2) Feature generation
- Goal: point your AI at a Jira ticket (e.g., USER-13) and have it implement the feature
- Guide: https://github.com/bitovi/ai-enablement-prompts/tree/main/writing-code/generate-feature

Suggested flow:
- Start on `main`
- Provide your agent with the instruction generation prompt to build a coding conventions file
- Provide your agent with the feature generation prompt and the USER-13 ticket
- Let the agent create a feature branch and implement the change
- Compare your branch to `user-13-search-and-filter` to see how close you match

## Database management

Available scripts:
- `npm run db:seed` — Populate the database with sample data
- `npm run db:clear` — Clear all data from the database
- `npm run db:reset` — Clear and re-seed the database
- `npm run db:setup` — Push schema and reset the database (initial setup)

The seed script creates:
- 7 sample users with different roles and profiles
- 30+ sample tasks with various priorities, statuses, and assignments
- Realistic task data including descriptions, due dates, and assignments

Database configuration:
- Uses PostgreSQL via Prisma (see `prisma/schema.prisma`)
- Connection configured via `DATABASE_URL` environment variable
- Docker Compose sets up PostgreSQL automatically
- For local development, configure PostgreSQL connection in `.env`
- Seeded data is safe to reset at any time using the scripts above

## Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the established code patterns
4. Test your changes thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
