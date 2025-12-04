/**
 * Orchestration script for running E2E tests with dev server
 * 
 * This script:
 * 1. Starts the Next.js dev server
 * 2. Waits for it to be ready
 * 3. Runs Playwright tests with browser console logging
 * 4. Cleans up the dev server on exit
 * 
 * All logs (server and browser) are piped to the terminal with prefixes for clarity.
 */

const { spawn } = require('child_process');
const http = require('http');

const SERVER_URL = 'http://localhost:3000';
const MAX_RETRIES = 30;
const RETRY_INTERVAL = 1000;

let devServer = null;

// Get additional args to pass to playwright (e.g., test file, --headed)
const playwrightArgs = process.argv.slice(2);

function log(message) {
    console.log(`[Orchestrator] ${message}`);
}

function separator() {
    console.log('[Orchestrator] ----------------------------------------\n');
}

async function waitForServer(retries = MAX_RETRIES) {
    for (let i = 0; i < retries; i++) {
        try {
            await new Promise((resolve, reject) => {
                const req = http.get(SERVER_URL, (res) => {
                    resolve();
                });
                req.on('error', reject);
                req.setTimeout(2000, () => {
                    req.destroy();
                    reject(new Error('Timeout'));
                });
            });
            return true;
        } catch (error) {
            if (i < retries - 1) {
                process.stdout.write('.');
                await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL));
            }
        }
    }
    return false;
}

function cleanup() {
    if (devServer) {
        log('Shutting down dev server...');
        devServer.kill('SIGTERM');

        // Force kill after 5 seconds if still running
        setTimeout(() => {
            if (devServer && !devServer.killed) {
                devServer.kill('SIGKILL');
            }
        }, 5000);
    }
}

async function main() {
    log('Starting dev server...');
    separator();

    // Start dev server
    devServer = spawn('npm', ['run', 'dev'], {
        stdio: ['ignore', 'pipe', 'pipe'],
        shell: true
    });

    // Pipe server output with prefix
    devServer.stdout.on('data', (data) => {
        const lines = data.toString().split('\n');
        lines.forEach(line => {
            if (line.trim()) {
                console.log(`[Server] ${line}`);
            }
        });
    });

    devServer.stderr.on('data', (data) => {
        const lines = data.toString().split('\n');
        lines.forEach(line => {
            if (line.trim()) {
                console.error(`[Server] ${line}`);
            }
        });
    });

    devServer.on('exit', (code) => {
        if (code !== null && code !== 0) {
            console.error(`[Server] Dev server exited with code ${code}`);
        }
    });

    // Wait for server to be ready
    log('Waiting for server to be ready...');
    separator();
    const isReady = await waitForServer();

    if (!isReady) {
        console.error('\n[Orchestrator] Server failed to start');
        cleanup();
        process.exit(1);
    }

    console.log('\n');
    log('Server is ready!');
    separator();

    // Run Playwright tests with browser console logging
    log('Running Playwright tests in debug mode...');
    separator();

    const playwrightProcess = spawn(
        'npx',
        ['playwright', 'test', ...playwrightArgs],
        {
            stdio: 'inherit',
            shell: true,
            env: {
                ...process.env,
                NODE_OPTIONS: '--require ./tests/e2e/console-log-proxy.js'
            }
        }
    );

    playwrightProcess.on('exit', (code) => {
        separator();
        log(`Tests completed with exit code: ${code}`);
        separator();
        cleanup();
        process.exit(code);
    });

    // Handle script termination
    process.on('SIGINT', () => {
        log('Received SIGINT, cleaning up...');
        cleanup();
        process.exit(130);
    });

    process.on('SIGTERM', () => {
        log('Received SIGTERM, cleaning up...');
        cleanup();
        process.exit(143);
    });
}

main().catch(error => {
    console.error('[Orchestrator] Error:', error);
    cleanup();
    process.exit(1);
});