#!/usr/bin/env bash
set -euo pipefail

PORT="${VITE_DEV_PORT:-8081}"
BACKEND_PORT="${BACKEND_PORT:-3000}"

kill_port() {
  local p="$1"
  if command -v lsof >/dev/null 2>&1; then
    if lsof -tiTCP:"$p" -sTCP:LISTEN >/dev/null 2>&1; then
      echo "Killing process on port $p..."
      # Try graceful first
      lsof -tiTCP:"$p" -sTCP:LISTEN | xargs -r kill || true
      sleep 0.2
      # Force if still listening
      if lsof -tiTCP:"$p" -sTCP:LISTEN >/dev/null 2>&1; then
        lsof -tiTCP:"$p" -sTCP:LISTEN | xargs -r kill -9 || true
      fi
    fi
  else
    echo "lsof not found; skipping auto-kill for port $p" >&2
  fi
}

trap 'echo "Shutting down..."; kill 0 || true' EXIT

# Ensure clean ports before start
kill_port "$PORT"
kill_port "$BACKEND_PORT"

# Start backend
(
  cd server
  make
  ./server &
)

# Start frontend on fixed port
VITE_DEV_PORT="$PORT" pnpm run dev:front

