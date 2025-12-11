# Build Scripts Style Guide

## Unique Conventions

### 1. E2E Test Server Script

Custom script runs E2E tests with server:

```js
// scripts/test-e2e-with-server.js
const { spawn } = require("child_process")

async function runTests() {
  // 1. Start server
  console.log("Starting server...")
  const server = spawn("npm", ["start"], { stdio: "inherit" })
  
  // 2. Wait for server
  await waitForServer("http://localhost:3000", 30000)
  
  // 3. Run tests
  console.log("Running E2E tests...")
  const tests = spawn("npm", ["run", "test:e2e"], { stdio: "inherit" })
  
  // 4. Cleanup on exit
  tests.on("exit", (code) => {
    server.kill()
    process.exit(code)
  })
}

runTests()
```

**Why unique**: Orchestrates server lifecycle around E2E test execution.

### 2. Server Readiness Check

Script polls server before running tests:

```js
async function waitForServer(url, timeout) {
  const startTime = Date.now()
  
  while (Date.now() - startTime < timeout) {
    try {
      const response = await fetch(url)
      if (response.ok) return
    } catch (err) {
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }
  
  throw new Error("Server failed to start")
}
```

**Why unique**: Prevents test failures from server startup timing.

### 3. Cleanup on Exit

Script ensures server stops on test completion:

```js
tests.on("exit", (code) => {
  server.kill()
  process.exit(code)
})
```

**Why unique**: Guaranteed server shutdown regardless of test outcome.

## File Structure

Build scripts in `scripts/`:

```
scripts/
├── test-e2e-with-server.js
└── backup-scripts.md
```

## Key Takeaways

1. Orchestrate server lifecycle in build scripts
2. Poll for server readiness before tests
3. Cleanup processes on test exit
4. Locate in `scripts/` directory
