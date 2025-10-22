#!/bin/bash

# Loke Cards Vue Starter Script
# Starts both C++ server and Vue cards app

set -e

echo "🚀 Starting Loke Cards Vue..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Function to kill processes on specific ports
cleanup() {
    echo -e "${YELLOW}🧹 Cleaning up existing processes...${NC}"
    
    # Kill Vue dev server
    if check_port 3001; then
        echo "Stopping Vue dev server on port 3001..."
        pkill -f "vite.*3001" 2>/dev/null || true
        sleep 1
    fi
    
    # Kill C++ server
    if check_port 3000; then
        echo "Stopping C++ server on port 3000..."
        pkill -f "./server" 2>/dev/null || true
        sleep 1
    fi
    
    # Kill any remaining npm processes
    pkill -f "npm run dev" 2>/dev/null || true
}

# Function to build C++ server
build_server() {
    echo -e "${BLUE}🔨 Building C++ server...${NC}"
    cd server
    if make clean >/dev/null 2>&1; then
        echo "Cleaned previous build"
    fi
    
    if make; then
        echo -e "${GREEN}✅ C++ server built successfully${NC}"
    else
        echo -e "${RED}❌ Failed to build C++ server${NC}"
        exit 1
    fi
    cd ..
}

# Function to start servers
start_servers() {
    echo -e "${BLUE}🌟 Starting servers...${NC}"
    
    # Start C++ server in background
    echo "Starting C++ server on port 3000..."
    cd server
    ./server > ../server.log 2>&1 &
    SERVER_PID=$!
    cd ..
    
    # Wait for server to start
    sleep 2
    if check_port 3000; then
        echo -e "${GREEN}✅ C++ server running on http://localhost:3000${NC}"
    else
        echo -e "${RED}❌ C++ server failed to start${NC}"
        cat server.log
        exit 1
    fi
    
    # Start Vue app in background
    echo "Starting Vue app on port 3001..."
    cd cards
    npm run dev > ../vue.log 2>&1 &
    VUE_PID=$!
    cd ..
    
    # Wait for Vue app to start
    sleep 3
    if check_port 3001; then
        echo -e "${GREEN}✅ Vue app running on http://localhost:3001${NC}"
    else
        echo -e "${RED}❌ Vue app failed to start${NC}"
        cat vue.log
        exit 1
    fi
}

# Function to show status
show_status() {
    echo ""
    echo -e "${GREEN}🎉 Loke Cards Vue is running!${NC}"
    echo ""
    echo -e "${BLUE}📱 Frontend (Vue):${NC} http://localhost:3001"
    echo -e "${BLUE}🔧 Backend (C++):${NC} http://localhost:3000"
    echo -e "${BLUE}📊 API Health:${NC} http://localhost:3000/api/health"
    echo ""
    echo -e "${YELLOW}📝 Logs:${NC}"
    echo "  Server: server.log"
    echo "  Vue:    vue.log"
    echo ""
    echo -e "${YELLOW}⏹️  To stop: Press Ctrl+C or run: ./stop-cardsvue.sh${NC}"
    echo ""
}

# Function to handle graceful shutdown
graceful_shutdown() {
    echo -e "\n${YELLOW}🛑 Shutting down gracefully...${NC}"
    
    if [ ! -z "$SERVER_PID" ]; then
        kill $SERVER_PID 2>/dev/null || true
    fi
    
    if [ ! -z "$VUE_PID" ]; then
        kill $VUE_PID 2>/dev/null || true
    fi
    
    # Force cleanup if needed
    cleanup
    
    echo -e "${GREEN}✅ All services stopped${NC}"
    exit 0
}

# Set up signal handlers
trap graceful_shutdown SIGINT SIGTERM

# Main execution
main() {
    echo -e "${BLUE}📍 Working directory: $(pwd)${NC}"
    
    # Check if we're in the right directory
    if [ ! -d "cards" ] || [ ! -d "server" ]; then
        echo -e "${RED}❌ Error: Must be run from apps-vue directory${NC}"
        echo "Expected to find 'cards' and 'server' subdirectories"
        exit 1
    fi
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo -e "${BLUE}📦 Installing root dependencies...${NC}"
        npm install
    fi
    
    if [ ! -d "cards/node_modules" ]; then
        echo -e "${BLUE}📦 Installing cards dependencies...${NC}"
        cd cards && npm install && cd ..
    fi
    
    # Clean up any existing processes
    cleanup
    
    # Build server
    build_server
    
    # Start servers
    start_servers
    
    # Show status
    show_status
    
    # Keep script running
    echo -e "${BLUE}⏳ Monitoring services... (Press Ctrl+C to stop)${NC}"
    
    # Monitor loop
    while true; do
        sleep 10
        
        # Check if servers are still running
        if ! check_port 3000; then
            echo -e "${RED}❌ C++ server died! Restarting...${NC}"
            pkill -f "./server" 2>/dev/null || true
            cd server && ./server > ../server.log 2>&1 &
            cd ..
        fi
        
        if ! check_port 3001; then
            echo -e "${RED}❌ Vue app died! Restarting...${NC}"
            pkill -f "vite.*3001" 2>/dev/null || true
            cd cards && npm run dev > ../vue.log 2>&1 &
            cd ..
        fi
    done
}

# Run main function
main "$@"