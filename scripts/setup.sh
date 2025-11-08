#!/bin/bash

# ReelByte Initial Setup Script
# This script sets up the development environment for the first time

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
echo -e "${BLUE}  ReelByte Initial Setup${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check and install required tools
echo -e "${BLUE}Checking required tools...${NC}"

if ! command_exists docker; then
    echo -e "${RED}Error: Docker is not installed${NC}"
    echo -e "${YELLOW}Please install Docker: https://docs.docker.com/get-docker/${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker is installed${NC}"

if ! command_exists docker-compose; then
    echo -e "${RED}Error: Docker Compose is not installed${NC}"
    echo -e "${YELLOW}Please install Docker Compose: https://docs.docker.com/compose/install/${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker Compose is installed${NC}"

if ! command_exists uv; then
    echo -e "${YELLOW}UV is not installed. Installing...${NC}"
    curl -LsSf https://astral.sh/uv/install.sh | sh
    export PATH="$HOME/.cargo/bin:$PATH"
else
    echo -e "${GREEN}✓ UV is installed${NC}"
fi

if ! command_exists bun; then
    echo -e "${YELLOW}Bun is not installed. Installing...${NC}"
    curl -fsSL https://bun.sh/install | bash
    export BUN_INSTALL="$HOME/.bun"
    export PATH="$BUN_INSTALL/bin:$PATH"
else
    echo -e "${GREEN}✓ Bun is installed${NC}"
fi

echo ""

# Copy .env.example files
echo -e "${BLUE}Setting up environment files...${NC}"

if [ -f "$PROJECT_ROOT/.env.example" ]; then
    if [ ! -f "$PROJECT_ROOT/.env" ]; then
        cp "$PROJECT_ROOT/.env.example" "$PROJECT_ROOT/.env"
        echo -e "${GREEN}✓ Created .env from .env.example${NC}"
        echo -e "${YELLOW}Please review and update .env with your configuration${NC}"
    else
        echo -e "${YELLOW}Warning: .env already exists, skipping...${NC}"
    fi
else
    echo -e "${YELLOW}Warning: .env.example not found${NC}"
fi

if [ -f "$PROJECT_ROOT/backend/.env.example" ] && [ ! -f "$PROJECT_ROOT/backend/.env" ]; then
    cp "$PROJECT_ROOT/backend/.env.example" "$PROJECT_ROOT/backend/.env"
    echo -e "${GREEN}✓ Created backend/.env${NC}"
fi

if [ -f "$PROJECT_ROOT/frontend/.env.example" ] && [ ! -f "$PROJECT_ROOT/frontend/.env" ]; then
    cp "$PROJECT_ROOT/frontend/.env.example" "$PROJECT_ROOT/frontend/.env"
    echo -e "${GREEN}✓ Created frontend/.env${NC}"
fi

echo ""

# Install backend dependencies
echo -e "${BLUE}Installing backend dependencies with UV...${NC}"
cd "$PROJECT_ROOT/backend"
if [ -f "pyproject.toml" ]; then
    uv sync
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
else
    echo -e "${YELLOW}Warning: backend/pyproject.toml not found${NC}"
fi

echo ""

# Install frontend dependencies
echo -e "${BLUE}Installing frontend dependencies with Bun...${NC}"
cd "$PROJECT_ROOT/frontend"
if [ -f "package.json" ]; then
    bun install
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
else
    echo -e "${YELLOW}Warning: frontend/package.json not found${NC}"
fi

echo ""

# Start Docker containers
echo -e "${BLUE}Starting Docker containers...${NC}"
cd "$PROJECT_ROOT"
docker-compose up -d postgres redis

# Wait for PostgreSQL to be ready
echo -e "${BLUE}Waiting for PostgreSQL to be ready...${NC}"
until docker-compose exec -T postgres pg_isready -U reelbyte >/dev/null 2>&1; do
    sleep 1
    echo -n "."
done
echo ""
echo -e "${GREEN}✓ PostgreSQL is ready${NC}"

echo ""

# Initialize database
echo -e "${BLUE}Initializing database...${NC}"
cd "$PROJECT_ROOT/backend"

# Check if Alembic is set up
if [ -d "alembic" ] || [ -f "alembic.ini" ]; then
    echo -e "${BLUE}Running database migrations...${NC}"
    uv run alembic upgrade head
    echo -e "${GREEN}✓ Database migrations completed${NC}"
else
    echo -e "${YELLOW}Warning: Alembic not configured. Skipping migrations.${NC}"
fi

# Run any initial data seeding
if [ -f "scripts/seed_db.py" ]; then
    echo -e "${BLUE}Seeding database with initial data...${NC}"
    uv run python scripts/seed_db.py
    echo -e "${GREEN}✓ Database seeded${NC}"
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo -e "  1. Review and update ${YELLOW}.env${NC} with your configuration"
echo -e "  2. Run ${GREEN}make dev${NC} or ${GREEN}./scripts/dev.sh${NC} to start development"
echo -e "  3. Visit ${GREEN}http://localhost:5173${NC} to see your app"
echo ""
echo -e "${BLUE}Useful commands:${NC}"
echo -e "  ${GREEN}make dev${NC}   - Start all services"
echo -e "  ${GREEN}make test${NC}  - Run tests"
echo -e "  ${GREEN}make clean${NC} - Clean up containers and dependencies"
echo ""
