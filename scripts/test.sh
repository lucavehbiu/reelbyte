#!/bin/bash

# ReelByte Test Runner Script
# This script runs all tests for backend and frontend

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
echo -e "${BLUE}  Running ReelByte Tests${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Parse arguments
RUN_BACKEND=true
RUN_FRONTEND=true
COVERAGE=false
WATCH=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --backend-only)
            RUN_FRONTEND=false
            shift
            ;;
        --frontend-only)
            RUN_BACKEND=false
            shift
            ;;
        --coverage)
            COVERAGE=true
            shift
            ;;
        --watch)
            WATCH=true
            shift
            ;;
        --help)
            echo "Usage: ./scripts/test.sh [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --backend-only   Run only backend tests"
            echo "  --frontend-only  Run only frontend tests"
            echo "  --coverage       Run tests with coverage report"
            echo "  --watch          Run tests in watch mode"
            echo "  --help           Show this help message"
            echo ""
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Track test results
BACKEND_RESULT=0
FRONTEND_RESULT=0

# Run backend tests
if [ "$RUN_BACKEND" = true ]; then
    echo -e "${BLUE}Running backend tests with pytest...${NC}"
    echo ""
    cd "$PROJECT_ROOT/backend"

    if [ -f "pyproject.toml" ] || [ -f "pytest.ini" ]; then
        if [ "$COVERAGE" = true ]; then
            if [ "$WATCH" = true ]; then
                uv run pytest --cov=app --cov-report=html --cov-report=term -v --watch || BACKEND_RESULT=$?
            else
                uv run pytest --cov=app --cov-report=html --cov-report=term -v || BACKEND_RESULT=$?
            fi

            if [ $BACKEND_RESULT -eq 0 ]; then
                echo ""
                echo -e "${GREEN}✓ Backend tests passed${NC}"
                echo -e "${BLUE}Coverage report generated at: backend/htmlcov/index.html${NC}"
            fi
        else
            if [ "$WATCH" = true ]; then
                uv run pytest -v --watch || BACKEND_RESULT=$?
            else
                uv run pytest -v || BACKEND_RESULT=$?
            fi

            if [ $BACKEND_RESULT -eq 0 ]; then
                echo ""
                echo -e "${GREEN}✓ Backend tests passed${NC}"
            fi
        fi
    else
        echo -e "${YELLOW}Warning: No pytest configuration found in backend${NC}"
        BACKEND_RESULT=1
    fi
    echo ""
fi

# Run frontend tests
if [ "$RUN_FRONTEND" = true ]; then
    echo -e "${BLUE}Running frontend tests with vitest...${NC}"
    echo ""
    cd "$PROJECT_ROOT/frontend"

    if [ -f "package.json" ]; then
        # Check if vitest is configured
        if grep -q "vitest" package.json; then
            if [ "$COVERAGE" = true ]; then
                if [ "$WATCH" = true ]; then
                    bun run test:watch --coverage || FRONTEND_RESULT=$?
                else
                    bun run test --coverage || FRONTEND_RESULT=$?
                fi

                if [ $FRONTEND_RESULT -eq 0 ]; then
                    echo ""
                    echo -e "${GREEN}✓ Frontend tests passed${NC}"
                    echo -e "${BLUE}Coverage report generated at: frontend/coverage/index.html${NC}"
                fi
            else
                if [ "$WATCH" = true ]; then
                    bun run test:watch || FRONTEND_RESULT=$?
                else
                    bun run test || FRONTEND_RESULT=$?
                fi

                if [ $FRONTEND_RESULT -eq 0 ]; then
                    echo ""
                    echo -e "${GREEN}✓ Frontend tests passed${NC}"
                fi
            fi
        else
            echo -e "${YELLOW}Warning: Vitest not configured in frontend/package.json${NC}"
            FRONTEND_RESULT=1
        fi
    else
        echo -e "${YELLOW}Warning: No package.json found in frontend${NC}"
        FRONTEND_RESULT=1
    fi
    echo ""
fi

# Print summary
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Test Summary${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

if [ "$RUN_BACKEND" = true ]; then
    if [ $BACKEND_RESULT -eq 0 ]; then
        echo -e "Backend:  ${GREEN}✓ PASSED${NC}"
    else
        echo -e "Backend:  ${RED}✗ FAILED${NC}"
    fi
fi

if [ "$RUN_FRONTEND" = true ]; then
    if [ $FRONTEND_RESULT -eq 0 ]; then
        echo -e "Frontend: ${GREEN}✓ PASSED${NC}"
    else
        echo -e "Frontend: ${RED}✗ FAILED${NC}"
    fi
fi

echo ""

# Exit with error if any tests failed
if [ $BACKEND_RESULT -ne 0 ] || [ $FRONTEND_RESULT -ne 0 ]; then
    echo -e "${RED}Some tests failed. Please review the output above.${NC}"
    exit 1
else
    echo -e "${GREEN}All tests passed successfully!${NC}"
    exit 0
fi
