# PostgreSQL Setup Guide

This project uses PostgreSQL as its database, running in Docker for easy local development and deployment.

## Quick Start

### Local Development (Recommended)

1. **Start PostgreSQL in Docker:**
   ```bash
   docker-compose up -d db
   ```

2. **Install dependencies and setup database:**
   ```bash
   npm install
   npm run db:setup
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

The app will be available at http://localhost:3000 and PostgreSQL at localhost:5432.

### GitHub Codespaces

When you open this project in a Codespace, the PostgreSQL database will automatically start. Just run:

```bash
npm install
npm run db:setup
npm run dev
```

### Full Docker Deployment

To run both the database and app in Docker:

```bash
docker-compose up --build
```

## Database Configuration

### Environment Variables

The project uses a `.env` file for database configuration:

```env
DATABASE_URL="postgresql://taskflow:taskflow@localhost:5432/taskflow"
```

- For **local development** with Next.js running outside Docker: use `localhost:5432`
- For **containerized app** (when app runs in Docker): use `db:5432`

### Database Credentials

Default PostgreSQL credentials (defined in `docker-compose.yml`):
- **User:** taskflow
- **Password:** taskflow
- **Database:** taskflow
- **Port:** 5432

**⚠️ Change these for production deployments!**

## Database Commands

```bash
# Run migrations
npm run db:migrate

# Clear all data
npm run db:clear

# Seed the database with sample data
npm run db:seed

# Reset database (clear + seed)
npm run db:reset

# Full setup (migrate + reset)
npm run db:setup
```

## Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations (production)
npx prisma migrate deploy

# Open Prisma Studio (database GUI)
npx prisma studio
```

## Docker Commands

```bash
# Start only PostgreSQL
docker-compose up -d db

# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Stop and remove volumes (deletes all data)
docker-compose down -v

# View logs
docker-compose logs -f

# Access PostgreSQL CLI
docker-compose exec db psql -U taskflow -d taskflow
```

## Connecting with PostgreSQL MCP

To use the PostgreSQL MCP server with GitHub Copilot for debugging:

1. Ensure PostgreSQL is running: `docker-compose up -d db`
2. Configure the MCP server to connect to `localhost:5432`
3. Use credentials: `taskflow` / `taskflow`

The MCP server can then query the database, inspect schema, and help debug issues.

## Troubleshooting

### Connection Issues

If you can't connect to PostgreSQL:

1. **Check if container is running:**
   ```bash
   docker-compose ps
   ```

2. **Check logs:**
   ```bash
   docker-compose logs db
   ```

3. **Verify DATABASE_URL:**
   - Local dev: `postgresql://taskflow:taskflow@localhost:5432/taskflow`
   - In Docker: `postgresql://taskflow:taskflow@db:5432/taskflow`

### Migration Issues

If migrations fail:

1. **Reset the database:**
   ```bash
   docker-compose down -v
   docker-compose up -d db
   npm run db:setup
   ```

2. **Check migration status:**
   ```bash
   npx prisma migrate status
   ```

### Port Already in Use

If port 5432 is already in use:

1. **Stop existing PostgreSQL:**
   ```bash
   # macOS/Linux
   sudo systemctl stop postgresql
   # or
   sudo service postgresql stop
   ```

2. **Or change the port in docker-compose.yml:**
   ```yaml
   ports:
     - "5433:5432"  # Use 5433 on host
   ```

## Project Structure

```
prisma/
  schema.prisma          # Database schema
  migrations/            # Database migrations
  seed.js               # Sample data seeder
  clear.js              # Database cleanup script

.env                    # Environment variables (not in git)
.env.example           # Example environment config
docker-compose.yml     # Docker services configuration
.devcontainer/         # Codespaces/Dev Container config
```

## Production Deployment

For production, use a managed PostgreSQL service like:
- AWS RDS
- Heroku Postgres
- Supabase
- DigitalOcean Managed Databases

Update `DATABASE_URL` environment variable with your production connection string and run:

```bash
npx prisma migrate deploy
npm run build
npm start
```
