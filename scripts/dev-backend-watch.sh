#!/usr/bin/env bash
set -euo pipefail

BACKEND_DIR="server"
BACKEND_BIN="server"
PORT="${BACKEND_PORT:-3000}"

kill_port() {
  local p="$1"
  if command -v lsof >/dev/null 2>&1; then
    if lsof -tiTCP:"$p" -sTCP:LISTEN >/dev/null 2>&1; then
      echo "[watch] Killing process on port $p..."
      lsof -tiTCP:"$p" -sTCP:LISTEN | xargs -r kill || true
      sleep 0.2
      if lsof -tiTCP:"$p" -sTCP:LISTEN >/dev/null 2>&1; then
        lsof -tiTCP:"$p" -sTCP:LISTEN | xargs -r kill -9 || true
      fi
    fi
  fi
}

build_and_run() {
  echo "[watch] Building backend..."
  (cd "$BACKEND_DIR" && make)
  echo "[watch] Restarting backend..."
  kill_port "$PORT"
  (cd "$BACKEND_DIR" && ./${BACKEND_BIN}) &
  BACK_PID=$!
}

calc_hash() {
  # Hash of all cpp/h files; portable and simple
  find "$BACKEND_DIR" -type f \( -name '*.cpp' -o -name '*.h' \) -print0 \
    | sort -z \
    | xargs -0 cat 2>/dev/null | shasum | awk '{print $1}'
}

trap 'echo "[watch] Shutting down..."; kill 0 || true' EXIT

# Initial build and run
build_and_run

LAST_HASH="$(calc_hash || true)"

echo "[watch] Watching $BACKEND_DIR for changes..."
while true; do
  sleep 0.5
  CUR_HASH="$(calc_hash || true)"
  if [[ "$CUR_HASH" != "$LAST_HASH" && -n "$CUR_HASH" ]]; then
    echo "[watch] Change detected. Rebuilding..."
    build_and_run
    LAST_HASH="$CUR_HASH"
  fi
done

