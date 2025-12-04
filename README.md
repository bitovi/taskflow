# TaskFlow

A modern task management application built with Next.js 15, React, TypeScript, and Prisma. TaskFlow is designed as an example project for testing AI enablement integrations and demonstrating modern web development best practices. The application features multi-user support, an intuitive drag-and-drop Kanban board interface, and comprehensive task management capabilities.

## Tech Stack

- **Frontend:** Next.js 15 App Router, React 19, TypeScript
- **Database:** Prisma ORM with PostgreSQL 16
- **UI:** shadcn/ui, Radix UI, Tailwind CSS 4
- **Testing:** Jest (unit tests), Playwright (E2E tests)
- **Containerization:** Docker & Docker Compose

## Prerequisites

Choose one of the following setup methods:

### For Docker/Dev Container (Recommended)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [VS Code](https://code.visualstudio.com/) with [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

### For Local Development
- Node.js 18 or higher
- PostgreSQL 16 or higher

## Getting Started

### Option 1: Dev Container (Recommended)

This is the easiest way to get started with TaskFlow. The Dev Container provides a fully configured development environment with all dependencies pre-installed.

1. **Clone the repository**
   ```bash
   git clone https://github.com/bitovi/taskflow
   cd taskflow
   ```

2. **Open in VS Code and start the Dev Container**
   - Open the folder in VS Code
   - When prompted, click "Reopen in Container"
   - Or use Command Palette (`Cmd/Ctrl + Shift + P`): **Dev Containers: Reopen in Container**

3. **Wait for automatic setup**
   
   The Dev Container will automatically:
   - Start a PostgreSQL 16 container with the `taskflow` database
   - Install all Node.js dependencies
   - Run the setup script which:
     - Creates/verifies the database exists
     - Runs Prisma migrations to set up the schema
     - Clears any existing data
     - Seeds the database with sample users and tasks
     - Installs Playwright browser binaries for E2E testing
   - Start the Next.js development server on port 3000

4. **Access the application**
   
   Once the setup completes, VS Code will automatically open a preview of the application, or you can navigate to http://localhost:3000

**What's included in the Dev Container:**
- PostgreSQL 16 Alpine container (user: `taskflow`, password: `taskflow`, database: `taskflow`)
- Node.js 24 Alpine with development tools (bash, git, curl, PostgreSQL client)
- ESLint and Prettier extensions pre-configured
- Automatic port forwarding for the app (3000) and PostgreSQL (5432)
- Persistent PostgreSQL data volume

### Option 2: Docker Compose (Production)

Use this method to run the production build with Docker Compose.

1. **Clone the repository**
   ```bash
   git clone https://github.com/bitovi/taskflow
   cd taskflow
   ```

2. **Start the services**
   ```bash
   docker-compose up
   ```

   This will:
   - Start a PostgreSQL 16 container
   - Build the production Docker image (using the root `Dockerfile`)
   - Run database setup (migrations and seeding) during the build
   - Start the optimized Next.js production server
   - Make the app available at http://localhost:3000

**Production Dockerfile details:**
- Uses Node.js 24 Alpine for minimal image size
- Runs `npm ci` for reproducible builds
- Executes database setup: `npm run db:setup` (creates database, runs migrations, seeds data)
- Builds the Next.js application with optimizations
- Runs the production server with `npm run start`

**To rebuild after changes:**
```bash
docker-compose down
docker-compose up --build
```

### Option 3: Local Development (Without Docker)

Run TaskFlow directly on your machine with a local PostgreSQL instance.

1. **Clone the repository**
   ```bash
   git clone https://github.com/bitovi/taskflow
   cd taskflow
   ```

2. **Install PostgreSQL**
   
   Install PostgreSQL 16+ on your system:
   - **macOS:** [Postgres.app](https://postgresapp.com/) or `brew install postgresql@16`
   - **Windows:** [PostgreSQL installer](https://www.postgresql.org/download/windows/)
   - **Linux:** Use your package manager (e.g., `apt install postgresql-16`)

   Start the PostgreSQL service after installation.

3. **Configure environment variables**
   
   Copy the example environment file and update it with your PostgreSQL connection details:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set the `DATABASE_URL`. Examples:

   **For Postgres.app (macOS, no password):**
   ```env
   DATABASE_URL="postgresql://localhost:5432/taskflow"
   ```

   **For PostgreSQL with username and password:**
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/taskflow"
   ```

   Replace `username` and `password` with your PostgreSQL credentials. The database name (`taskflow`) will be created automatically if it doesn't exist.

4. **Run the setup script**
   ```bash
   npm run setup
   ```

   The setup script (`npm run setup`) performs the following operations:
   - **Install dependencies:** Runs `npm install` to install all Node.js packages
   - **Create database:** Runs `npm run db:create` which:
     - Checks if the `taskflow` database exists
     - Creates the database if it doesn't exist
     - Attempts to create the PostgreSQL user if specified in `DATABASE_URL` and it doesn't exist
     - Handles various PostgreSQL authentication methods (peer, password, default user)
   - **Run migrations:** Executes `npx prisma db push` to create/update database tables
   - **Reset data:** Runs `npm run db:reset` which:
     - Clears all existing data (`npm run db:clear`)
     - Seeds the database with sample data (`npm run db:seed`)
   - **Install test browsers:** Runs `npx playwright install chromium` for E2E tests

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at http://localhost:3000

## Environment Configuration

TaskFlow uses environment variables for configuration. The repository includes an `.env.example` file with template values.

**Copy the example file:**
```bash
cp .env.example .env
```

**Environment variables:**

- `DATABASE_URL`: PostgreSQL connection string
  - Docker/Dev Container: `postgresql://taskflow:taskflow@postgres:5432/taskflow`
  - Local (Postgres.app): `postgresql://localhost:5432/taskflow`
  - Local (with auth): `postgresql://username:password@localhost:5432/taskflow`
- `NODE_ENV`: Environment mode (`development` or `production`)

**Important:** Never commit the `.env` file to version control. It's listed in `.gitignore` for security.

## Database Setup & Seeding

TaskFlow includes automated database management scripts:

### Database Scripts

- `npm run db:create` - Creates the `taskflow` database if it doesn't exist (local development only; Docker creates this automatically)
- `npm run db:setup` - Complete database setup: create database, run migrations, and seed data
- `npm run db:clear` - Removes all data from the database
- `npm run db:seed` - Populates the database with sample data
- `npm run db:reset` - Clears and re-seeds the database

### Seeded Data

The seed script (`prisma/seed.js`) creates:

**7 Sample Users:**
- Alice Johnson (alice@example.com)
- Bob Smith (bob@example.com)
- Charlie Brown (charlie@example.com)
- Diana Prince (diana@example.com)
- Ethan Hunt (ethan@example.com)
- Fiona Green (fiona@example.com)
- George Wilson (george@example.com)

**Password for all users:** `password123`

**30 Sample Tasks** with:
- Random assignments to users
- Various statuses: `todo`, `in_progress`, `done`, `review`
- Different priorities: `low`, `medium`, `high`
- Random due dates (70% of tasks have due dates within the next 30 days)
- Realistic task names and descriptions

**Example Login Credentials:**
```
Email: alice@example.com
Password: password123
```

You can log in with any of the seeded users using their email and the password `password123`.

## Testing

TaskFlow includes both unit tests (Jest) and end-to-end tests (Playwright).

### Unit Tests

Run unit tests with Jest and React Testing Library:

```bash
npm test                # Run all unit tests
npm run test:watch      # Run tests in watch mode
```

**Unit test files are located in:**
- `tests/unit/` - Test files for components, utilities, and actions
- Coverage includes: UI components, utility functions, server actions, date helpers

### End-to-End Tests

Run E2E tests with Playwright:

```bash
npm run test:e2e        # Run E2E tests headless
npm run test:e2e:headed # Run E2E tests with browser UI
```

**Important:** The development server must be running before executing E2E tests.

**Running E2E tests (step-by-step):**

1. **Start the development server in one terminal:**
   ```bash
   npm run dev
   ```

2. **Run E2E tests in another terminal:**
   ```bash
   npm run test:e2e
   ```

**E2E test files are located in:**
- `tests/e2e/` - Test files for authentication, tasks, and Kanban board functionality
- Tests use global setup/teardown scripts to manage test data

**Playwright configuration:**
- Browser: Chromium (Desktop Chrome)
- Base URL: http://localhost:3000
- Viewport: 1280x720
- Tests run sequentially (1 worker) to avoid database conflicts
- Traces captured on first retry for debugging

## License

This project is licensed under the MIT License.

---

**Note:** This project is primarily used as an example application for testing AI enablement integrations and demonstrating best practices in modern web development.
