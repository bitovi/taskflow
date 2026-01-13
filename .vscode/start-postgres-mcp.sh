#!/bin/bash

CONTAINER_NAME="taskflow-postgres-mcp"

# Remove container if it exists (running or stopped)
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    docker rm -f "${CONTAINER_NAME}" >/dev/null 2>&1
fi

# Create and run new container
docker run -i --rm \
    --name="${CONTAINER_NAME}" \
    --network=host \
    -e DATABASE_URI \
    crystaldba/postgres-mcp \
    --access-mode=unrestricted
