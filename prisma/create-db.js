#!/usr/bin/env node

/**
 * Creates the PostgreSQL database if it doesn't exist.
 * This is only needed for local development (non-Docker).
 * In Docker/DevContainer, POSTGRES_DB env var auto-creates the database.
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Load .env file manually (simple dotenv implementation)
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
            const [key, ...valueParts] = trimmed.split('=');
            if (key && valueParts.length > 0) {
                const value = valueParts.join('=').replace(/^["']|["']$/g, '');
                process.env[key.trim()] = value.trim();
            }
        }
    });
}

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
    console.error('DATABASE_URL environment variable is not set');
    console.error('Please create a .env file with DATABASE_URL or set it in your environment');
    process.exit(1);
}

async function createDatabase() {
    let client;
    try {
        const url = new URL(dbUrl);
        const targetUser = url.username;
        const targetPassword = url.password;
        const database = url.pathname.slice(1); // Remove leading slash

        // Create connection URL to 'postgres' database (default DB that always exists)
        // Try to connect with the target user first, fall back to default connection if that fails
        const adminUrl = new URL(dbUrl);
        adminUrl.pathname = '/postgres';

        console.log(`Connecting to PostgreSQL...`);

        // Try to connect with target credentials first
        try {
            client = new Client({ connectionString: adminUrl.toString() });
            await client.connect();
        } catch (initialError) {
            // If target user doesn't exist, try alternative connection methods
            if (initialError.message && initialError.message.includes('does not exist')) {
                console.log(`User '${targetUser}' doesn't exist, trying alternative connections...`);

                // Try 1: Connect without username (uses OS user) - works on Mac/Linux
                try {
                    const defaultUrl = new URL(adminUrl);
                    defaultUrl.username = '';
                    defaultUrl.password = '';
                    client = new Client({ connectionString: defaultUrl.toString() });
                    await client.connect();
                    console.log('Connected using OS user credentials');
                } catch (osUserError) {
                    // Try 2: Connect as 'postgres' superuser (common on Windows)
                    try {
                        const postgresUrl = new URL(adminUrl);
                        postgresUrl.username = 'postgres';
                        postgresUrl.password = '';
                        client = new Client({ connectionString: postgresUrl.toString() });
                        await client.connect();
                        console.log('Connected as postgres superuser');
                    } catch (postgresError) {
                        console.error('\n❌ Could not connect to PostgreSQL.');
                        console.error('Please ensure PostgreSQL is running and you have appropriate credentials.');
                        console.error('\nTried:');
                        console.error(`  1. Target user: ${targetUser}`);
                        console.error('  2. OS user (peer authentication)');
                        console.error('  3. postgres superuser');
                        console.error('\nYou may need to update DATABASE_URL in .env with valid credentials.');
                        throw postgresError;
                    }
                }

                // Create the user if it doesn't exist
                if (targetUser && client) {
                    console.log(`Creating user '${targetUser}'...`);
                    const userCheck = await client.query(
                        "SELECT 1 FROM pg_roles WHERE rolname = $1",
                        [targetUser]
                    );

                    if (userCheck.rows.length === 0) {
                        const passwordClause = targetPassword ? `PASSWORD '${targetPassword}'` : '';
                        await client.query(`CREATE USER "${targetUser}" ${passwordClause} CREATEDB`);
                        console.log(`✓ User '${targetUser}' created successfully`);
                    } else {
                        console.log(`✓ User '${targetUser}' already exists`);
                    }
                }
            } else {
                throw initialError;
            }
        }

        // Check if database exists
        console.log(`Checking if database '${database}' exists...`);
        const result = await client.query(
            "SELECT 1 FROM pg_database WHERE datname = $1",
            [database]
        );

        if (result.rows.length === 0) {
            // Database doesn't exist, create it
            console.log(`Creating database '${database}'...`);
            const ownerClause = targetUser ? `OWNER "${targetUser}"` : '';
            await client.query(`CREATE DATABASE "${database}" ${ownerClause}`);
            console.log(`✓ Database '${database}' created successfully`);
        } else {
            console.log(`✓ Database '${database}' already exists`);
        }

        await client.end();
    } catch (error) {
        if (client) {
            await client.end().catch(() => { });
        }

        // If connection fails, it might be in a Docker environment where DB is already created
        // or PostgreSQL isn't running yet
        if (error.code === 'ECONNREFUSED') {
            console.log('⚠ Could not connect to PostgreSQL. Make sure it is running.');
            console.log('  In Docker/DevContainer, the database will be created automatically.');
        } else if (error.message && error.message.includes('already exists')) {
            console.log(`✓ Database already exists`);
        } else {
            console.log('ℹ Skipping database creation:', error.message);
        }
    }
}

createDatabase();

