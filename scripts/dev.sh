#!/bin/bash

# ReelByte Development Start Script
# This script starts all services needed for local development

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Starting ReelByte Development Environment${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if .env file exists
if [ ! -f "$PROJECT_ROOT/.env" ]; then
    echo -e "${YELLOW}Warning: .env file not found!${NC}"
    echo -e "${YELLOW}Please run 'make setup' first or copy .env.example to .env${NC}"
    exit 1
fi

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check required tools
echo -e "${BLUE}Checking required tools...${NC}"
if ! command_exists docker; then
    echo -e "${RED}Error: Docker is not installed${NC}"
    exit 1
fi

if ! command_exists uv; then
    echo -e "${RED}Error: UV is not installed${NC}"
    echo -e "${YELLOW}Install it with: curl -LsSf https://astral.sh/uv/install.sh | sh${NC}"
    exit 1
fi

if ! command_exists bun; then
    echo -e "${RED}Error: Bun is not installed${NC}"
    echo -e "${YELLOW}Install it with: curl -fsSL https://bun.sh/install | bash${NC}"
    exit 1
fi

echo -e "${GREEN}✓ All required tools are available${NC}"
echo ""

# Start Docker containers
echo -e "${BLUE}Starting Docker containers (PostgreSQL, Redis)...${NC}"
docker-compose up -d postgres redis

# Wait for PostgreSQL to be ready
echo -e "${BLUE}Waiting for PostgreSQL to be ready...${NC}"
until docker-compose exec -T postgres pg_isready -U reelbyte >/dev/null 2>&1; do
    sleep 1
    echo -n "."
done
echo ""
echo -e "${GREEN}✓ PostgreSQL is ready${NC}"

# Wait for Redis to be ready
echo -e "${BLUE}Waiting for Redis to be ready...${NC}"
until docker-compose exec -T redis redis-cli ping >/dev/null 2>&1; do
    sleep 1
    echo -n "."
done
echo ""
echo -e "${GREEN}✓ Redis is ready${NC}"
echo ""

# Function to cleanup background processes on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down services...${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    docker-compose stop postgres redis
    echo -e "${GREEN}✓ All services stopped${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start backend with uvicorn
echo -e "${BLUE}Starting backend server...${NC}"
cd "$PROJECT_ROOT/backend"
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend started on http://localhost:8000${NC}"
echo ""

# Start frontend with bun dev
echo -e "${BLUE}Starting frontend development server...${NC}"
cd "$PROJECT_ROOT/frontend"
bun run dev &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend started on http://localhost:5173${NC}"
echo ""

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  ReelByte is running!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Services:${NC}"
echo -e "  Frontend:  ${GREEN}http://localhost:5173${NC}"
echo -e "  Backend:   ${GREEN}http://localhost:8000${NC}"
echo -e "  API Docs:  ${GREEN}http://localhost:8000/docs${NC}"
echo -e "  PostgreSQL: ${GREEN}localhost:5432${NC}"
echo -e "  Redis:     ${GREEN}localhost:6379${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo ""

# Wait for background processes
wait $BACKEND_PID $FRONTEND_PID
