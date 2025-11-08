.PHONY: help setup dev test test-backend test-frontend test-coverage lint format clean logs db-migrate db-seed docker-up docker-down docker-restart install-backend install-frontend

# Default target
.DEFAULT_GOAL := help

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m # No Color

##@ General

help: ## Display this help message
	@echo "$(BLUE)ReelByte Development Commands$(NC)"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"; printf "Usage:\n  make $(YELLOW)<target>$(NC)\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2 } /^##@/ { printf "\n$(BLUE)%s$(NC)\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Setup & Installation

setup: ## Run initial project setup (install dependencies, setup env, init db)
	@echo "$(BLUE)Running initial setup...$(NC)"
	@./scripts/setup.sh

install-backend: ## Install backend dependencies only
	@echo "$(BLUE)Installing backend dependencies...$(NC)"
	@cd backend && uv sync
	@echo "$(GREEN)✓ Backend dependencies installed$(NC)"

install-frontend: ## Install frontend dependencies only
	@echo "$(BLUE)Installing frontend dependencies...$(NC)"
	@cd frontend && bun install
	@echo "$(GREEN)✓ Frontend dependencies installed$(NC)"

##@ Development

dev: ## Start development environment (all services)
	@echo "$(BLUE)Starting development environment...$(NC)"
	@./scripts/dev.sh

dev-backend: docker-up ## Start only backend development server
	@echo "$(BLUE)Starting backend development server...$(NC)"
	@cd backend && uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

dev-frontend: ## Start only frontend development server
	@echo "$(BLUE)Starting frontend development server...$(NC)"
	@cd frontend && bun run dev

##@ Testing

test: ## Run all tests (backend + frontend)
	@./scripts/test.sh

test-backend: ## Run backend tests only
	@./scripts/test.sh --backend-only

test-frontend: ## Run frontend tests only
	@./scripts/test.sh --frontend-only

test-coverage: ## Run tests with coverage report
	@./scripts/test.sh --coverage

test-watch: ## Run tests in watch mode
	@./scripts/test.sh --watch

##@ Code Quality

lint: ## Lint all code (backend + frontend)
	@echo "$(BLUE)Linting backend...$(NC)"
	@cd backend && uv run ruff check .
	@echo "$(BLUE)Linting frontend...$(NC)"
	@cd frontend && bun run lint
	@echo "$(GREEN)✓ Linting complete$(NC)"

lint-backend: ## Lint backend code only
	@echo "$(BLUE)Linting backend...$(NC)"
	@cd backend && uv run ruff check .
	@echo "$(GREEN)✓ Backend linting complete$(NC)"

lint-frontend: ## Lint frontend code only
	@echo "$(BLUE)Linting frontend...$(NC)"
	@cd frontend && bun run lint
	@echo "$(GREEN)✓ Frontend linting complete$(NC)"

format: ## Format all code (backend + frontend)
	@echo "$(BLUE)Formatting backend...$(NC)"
	@cd backend && uv run ruff format .
	@echo "$(BLUE)Formatting frontend...$(NC)"
	@cd frontend && bun run format
	@echo "$(GREEN)✓ Formatting complete$(NC)"

format-backend: ## Format backend code only
	@echo "$(BLUE)Formatting backend...$(NC)"
	@cd backend && uv run ruff format .
	@echo "$(GREEN)✓ Backend formatting complete$(NC)"

format-frontend: ## Format frontend code only
	@echo "$(BLUE)Formatting frontend...$(NC)"
	@cd frontend && bun run format
	@echo "$(GREEN)✓ Frontend formatting complete$(NC)"

typecheck: ## Run type checking (backend + frontend)
	@echo "$(BLUE)Type checking backend...$(NC)"
	@cd backend && uv run mypy app
	@echo "$(BLUE)Type checking frontend...$(NC)"
	@cd frontend && bun run type-check
	@echo "$(GREEN)✓ Type checking complete$(NC)"

##@ Database

db-migrate: ## Run database migrations
	@echo "$(BLUE)Running database migrations...$(NC)"
	@cd backend && uv run alembic upgrade head
	@echo "$(GREEN)✓ Migrations complete$(NC)"

db-rollback: ## Rollback last database migration
	@echo "$(BLUE)Rolling back last migration...$(NC)"
	@cd backend && uv run alembic downgrade -1
	@echo "$(GREEN)✓ Rollback complete$(NC)"

db-revision: ## Create new database migration (usage: make db-revision MSG="your message")
	@if [ -z "$(MSG)" ]; then \
		echo "$(RED)Error: MSG is required. Usage: make db-revision MSG='your message'$(NC)"; \
		exit 1; \
	fi
	@echo "$(BLUE)Creating new migration: $(MSG)$(NC)"
	@cd backend && uv run alembic revision --autogenerate -m "$(MSG)"
	@echo "$(GREEN)✓ Migration created$(NC)"

db-seed: ## Seed database with sample data
	@echo "$(BLUE)Seeding database...$(NC)"
	@cd backend && uv run python -m app.scripts.seed_db
	@echo "$(GREEN)✓ Database seeded$(NC)"

db-reset: docker-down docker-up db-migrate db-seed ## Reset database (WARNING: deletes all data)
	@echo "$(YELLOW)Database reset complete$(NC)"

db-shell: ## Open PostgreSQL shell
	@docker-compose exec postgres psql -U reelbyte -d reelbyte

redis-shell: ## Open Redis CLI
	@docker-compose exec redis redis-cli

##@ Docker

docker-up: ## Start Docker containers (postgres, redis)
	@echo "$(BLUE)Starting Docker containers...$(NC)"
	@docker-compose up -d postgres redis
	@echo "$(GREEN)✓ Docker containers started$(NC)"

docker-down: ## Stop Docker containers
	@echo "$(BLUE)Stopping Docker containers...$(NC)"
	@docker-compose down
	@echo "$(GREEN)✓ Docker containers stopped$(NC)"

docker-restart: docker-down docker-up ## Restart Docker containers

docker-logs: ## View Docker container logs
	@docker-compose logs -f

docker-ps: ## List running Docker containers
	@docker-compose ps

docker-clean: ## Remove Docker containers and volumes (WARNING: deletes data)
	@echo "$(YELLOW)Warning: This will delete all Docker volumes and data$(NC)"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker-compose down -v; \
		echo "$(GREEN)✓ Docker cleanup complete$(NC)"; \
	else \
		echo "$(YELLOW)Cancelled$(NC)"; \
	fi

##@ Cleanup

clean: ## Clean up all build artifacts and caches
	@echo "$(BLUE)Cleaning up...$(NC)"
	@find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	@find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	@find . -type d -name ".mypy_cache" -exec rm -rf {} + 2>/dev/null || true
	@find . -type d -name ".ruff_cache" -exec rm -rf {} + 2>/dev/null || true
	@find . -type d -name "htmlcov" -exec rm -rf {} + 2>/dev/null || true
	@find . -type d -name "dist" -exec rm -rf {} + 2>/dev/null || true
	@find . -type d -name "build" -exec rm -rf {} + 2>/dev/null || true
	@find . -type d -name "*.egg-info" -exec rm -rf {} + 2>/dev/null || true
	@find . -type f -name "*.pyc" -delete 2>/dev/null || true
	@find . -type f -name "*.pyo" -delete 2>/dev/null || true
	@find . -type f -name ".coverage" -delete 2>/dev/null || true
	@cd frontend && rm -rf dist node_modules/.cache 2>/dev/null || true
	@echo "$(GREEN)✓ Cleanup complete$(NC)"

clean-all: clean docker-clean ## Clean everything (build artifacts, Docker volumes, dependencies)
	@echo "$(YELLOW)Warning: This will delete all dependencies$(NC)"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		rm -rf backend/.venv 2>/dev/null || true; \
		rm -rf frontend/node_modules 2>/dev/null || true; \
		echo "$(GREEN)✓ Complete cleanup finished$(NC)"; \
	else \
		echo "$(YELLOW)Cancelled$(NC)"; \
	fi

##@ Utilities

logs: docker-logs ## View all Docker logs (alias for docker-logs)

shell-backend: ## Open shell in backend container
	@docker-compose exec backend bash

shell-frontend: ## Open shell in frontend container
	@docker-compose exec frontend bash

check: lint typecheck test ## Run all checks (lint, typecheck, test)
	@echo "$(GREEN)✓ All checks passed!$(NC)"

update: ## Update all dependencies
	@echo "$(BLUE)Updating backend dependencies...$(NC)"
	@cd backend && uv sync --upgrade
	@echo "$(BLUE)Updating frontend dependencies...$(NC)"
	@cd frontend && bun update
	@echo "$(GREEN)✓ Dependencies updated$(NC)"

api-docs: ## Open API documentation in browser
	@echo "$(BLUE)Opening API documentation...$(NC)"
	@python -m webbrowser http://localhost:8000/docs 2>/dev/null || \
	open http://localhost:8000/docs 2>/dev/null || \
	xdg-open http://localhost:8000/docs 2>/dev/null || \
	echo "$(YELLOW)Please open http://localhost:8000/docs in your browser$(NC)"

##@ Production

build: ## Build production Docker images
	@echo "$(BLUE)Building production images...$(NC)"
	@docker-compose build
	@echo "$(GREEN)✓ Build complete$(NC)"

prod: ## Run production environment
	@echo "$(BLUE)Starting production environment...$(NC)"
	@docker-compose up -d
	@echo "$(GREEN)✓ Production environment started$(NC)"

prod-logs: ## View production logs
	@docker-compose logs -f

prod-stop: ## Stop production environment
	@docker-compose down
	@echo "$(GREEN)✓ Production environment stopped$(NC)"
