# TaskFlow

A modern task management application built with Next.js 15, React, TypeScript, and Prisma. TaskFlow is designed as an example project for testing AI enablement integrations and demonstrating modern web development best practices. The application features multi-user support, an intuitive drag-and-drop Kanban board interface, and comprehensive task management capabilities.

## Tech Stack

- **Frontend:** Next.js 15 App Router, React 19, TypeScript
- **Database:** Prisma ORM with PostgreSQL 16
- **UI:** shadcn/ui, Radix UI, Tailwind CSS 4
- **Testing:** Jest (unit tests), Playwright (E2E tests)
- **Containerization:** Docker & Docker Compose

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
  - **IMPORTANT:** After installing, open Docker Desktop and complete any setup steps before continuing.
- [VS Code](https://code.visualstudio.com/)
  - [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
  - [Docker Container Tools extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker)
  - [Docker extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker)

## Setup Instructions (Dev Container Only)

TaskFlow is designed to be run **exclusively** in a Dev Container using Docker. All dependencies, database, and setup scripts are managed automatically when the Dev Container starts. Local Node.js/PostgreSQL setup is no longer supported.

### 1. Clone the repository

```bash
git clone https://github.com/bitovi/taskflow.git && cd taskflow
```

**IMPORTANT on VS Code:** Load the `taskflow` folder as a single folder in VS Code (not as part of a multi-root workspace). `File` -> `Open Folder` -> `taskflow` . This is required for running it in a dev container.


### 2. Open in Dev Container

- Open the folder in VS Code.
- When prompted, click **"Reopen in Container"**.
- Or use Command Palette (`Cmd/Ctrl + Shift + P`): **Dev Containers: Reopen in Container**.

The Dev Container will automatically:

- Start a PostgreSQL 16 container with the `taskflow` database
- Install all Node.js dependencies
- Run all setup scripts (migrations, seeding, Playwright install)
- Start the Next.js development server on port 3000

If you have any other apps running on port 3000, 

### 3. Access the application

Once setup completes, VS Code will open a preview, or visit [http://localhost:3000](http://localhost:3000)

---

## AI Integration Steps

TaskFlow is designed for AI-enabled development. To use Copilot in Agent Mode:

1. **Set up VS Code with Copilot in Agent Mode**

   - [Enable Agent Mode (Docs)](https://bitovi.atlassian.net/wiki/spaces/AIEnabledDevelopment/pages/1455849479)
   - [Switch to Agent Mode](https://bitovi.atlassian.net/wiki/spaces/AIEnabledDevelopment/pages/1455849536)

2. **Verify Copilot can view project files**
   - Prompt: `Tell me about my current project.`
   - Copilot should be able to see your files and provide context-aware answers.

---

## Environment Configuration

All environment variables are pre-configured in the Dev Container. You do **not** need to manually create or edit a `.env` file for development. For advanced configuration, see `.env.example`.

**Important:** Never commit the `.env` file to version control. It's listed in `.gitignore` for security.

## Database & Seeded Data

The Dev Container automatically sets up the database and seeds it with sample data on first run. No manual steps are required.

**Seeded Users:**

- Alice Johnson (alice@example.com)
- Bob Smith (bob@example.com)
- Charlie Brown (charlie@example.com)
- Diana Prince (diana@example.com)
- Ethan Hunt (ethan@example.com)
- Fiona Green (fiona@example.com)
- George Wilson (george@example.com)

**Password for all users:** `password123`

**Example Login:**

```
Email: alice@example.com
Password: password123
```

## Testing

TaskFlow includes both unit tests (Jest) and end-to-end tests (Playwright). All test dependencies are pre-installed in the Dev Container.

### Unit Tests

Run unit tests with Jest and React Testing Library:

```bash
npm test                # Run all unit tests
npm run test:watch      # Run tests in watch mode
```

**Unit test files are located in:**

- `tests/unit/` - Test files for components, utilities, and actions

### End-to-End Tests

Run E2E tests with Playwright:

```bash
npm run test:e2e        # Run E2E tests headless
```

**E2E test files are located in:**

- `tests/e2e/` - Test files for authentication, tasks, and Kanban board functionality

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
