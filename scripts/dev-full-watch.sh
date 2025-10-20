#!/usr/bin/env bash
set -euo pipefail

FRONT_PORT="${VITE_DEV_PORT:-8081}"
BACKEND_PORT_ENV="${BACKEND_PORT:-3000}"
NODEVIEW_PORT_ENV="${VITE_NODEVIEW_PORT:-8092}"

kill_port() {
  local p="$1"
  if command -v lsof >/dev/null 2>&1; then
    if lsof -tiTCP:"$p" -sTCP:LISTEN >/dev/null 2>&1; then
      echo "Killing process on port $p..."
      lsof -tiTCP:"$p" -sTCP:LISTEN | xargs -r kill || true
      sleep 0.2
      if lsof -tiTCP:"$p" -sTCP:LISTEN >/dev/null 2>&1; then
        lsof -tiTCP:"$p" -sTCP:LISTEN | xargs -r kill -9 || true
      fi
    fi
  fi
}

trap 'echo "Shutting down..."; kill 0 || true' EXIT

# Ensure clean ports
kill_port "$FRONT_PORT"
kill_port "$BACKEND_PORT_ENV"
kill_port "$NODEVIEW_PORT_ENV"

# Start backend watcher
BACKEND_PORT="$BACKEND_PORT_ENV" bash scripts/dev-backend-watch.sh &

# Start external NodeView on fixed port (background)
(
  echo "Starting NodeView on :$NODEVIEW_PORT_ENV..."
  VITE_NODEVIEW_PORT="$NODEVIEW_PORT_ENV" vite --config apps/nodeview/vite.config.js
) &

# Start main Vite on fixed port (foreground)
VITE_DEV_PORT="$FRONT_PORT" vite
