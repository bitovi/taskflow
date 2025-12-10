
"test:e2e:headed": "playwright test --headed",

"test:e2e:debug": "node scripts/test-e2e-with-server.js",

"test:docker": "docker compose -f docker-compose.test.yaml -p taskflow-tests up --build --abort-on-container-exit && docker compose -f docker-compose.test.yaml -p taskflow-tests down -v",

"test:docker:logs": "docker compose -f docker-compose.test.yaml -p taskflow-tests up --build",
