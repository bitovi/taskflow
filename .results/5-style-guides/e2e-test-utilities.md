# E2E Test Utilities Style Guide

## Unique Conventions

### 1. Global Setup Starts Server

Server spawned before all tests:

```js
// tests/e2e/global-setup.js
const { spawn } = require("child_process")

module.exports = async () => {
  console.log("Starting server...")
  
  global.__SERVER__ = spawn("npm", ["start"], {
    stdio: "inherit",
    shell: true,
  })
  
  await waitForServer("http://localhost:3000", 30000)
  console.log("Server ready!")
}

function waitForServer(url, timeout) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()
    
    const check = async () => {
      try {
        const response = await fetch(url)
        if (response.ok) resolve()
      } catch (err) {
        if (Date.now() - startTime > timeout) {
          reject(new Error("Server failed to start"))
        } else {
          setTimeout(check, 500)
        }
      }
    }
    
    check()
  }
}
```

**Why unique**: Server lifecycle outside test files, with timeout and retry logic.

### 2. Global Teardown Kills Server

Server terminated after all tests:

```js
// tests/e2e/global-teardown.js
module.exports = async () => {
  console.log("Stopping server...")
  
  if (global.__SERVER__) {
    global.__SERVER__.kill()
  }
}
```

**Why unique**: Graceful server shutdown after test suite.

### 3. Console Log Proxy

Console output captured for debugging:

```js
// tests/e2e/console-log-proxy.js
// Captures console output during E2E tests
```

**Why unique**: Utility for debugging E2E test failures.

## File Structure

Utilities in `tests/e2e/`:

```
tests/e2e/
├── global-setup.js
├── global-teardown.js
└── console-log-proxy.js
```

## Key Takeaways

1. Use global setup to start server before tests
2. Implement retry logic with timeout for server readiness
3. Use global teardown to stop server after tests
4. Store server process in global variable
5. Provide console proxy for debugging
6. Locate in `tests/e2e/` directory
