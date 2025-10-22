#!/bin/bash

# Loke Cards Vue Stop Script
# Stops both C++ server and Vue cards app

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🛑 Stopping Loke Cards Vue...${NC}"

# Kill Vue dev server
echo "Stopping Vue dev server..."
pkill -f "vite.*3001" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true

# Kill C++ server
echo "Stopping C++ server..."
pkill -f "./server" 2>/dev/null || true

# Kill any remaining processes on ports 3000 and 3001
echo "Cleaning up ports..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

echo -e "${GREEN}✅ All services stopped${NC}"