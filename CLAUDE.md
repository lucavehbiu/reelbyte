# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ReelByte is a full-stack freelance marketplace platform for video content creators. The platform connects video creators with clients seeking video production services through gigs, projects, and proposals.

**Tech Stack:**
- **Backend:** FastAPI 0.115+, Python 3.12+, PostgreSQL 17, Redis 7.4, SQLAlchemy 2.0, Alembic
- **Frontend:** React 19, TypeScript, Vite 6, Bun, TailwindCSS, shadcn/ui, React Router v7, TanStack Query v5
- **Infrastructure:** Docker Compose, Cloudinary (media), Mollie (payments), SendGrid (email)
- **Package Managers:** UV (Python), Bun (JavaScript)

## Essential Development Commands

### Setup & Installation
```bash
make setup              # Initial project setup (dependencies, env, database)
make install-backend    # Backend dependencies only (cd backend && uv sync)
make install-frontend   # Frontend dependencies only (cd frontend && bun install)
```

### Development
```bash
make dev                # Start all services (Docker + backend + frontend)
make dev-backend        # Start backend only (starts Docker, then uvicorn at :8000)
make dev-frontend       # Start frontend only (Vite dev server at :5173)
make docker-up          # Start Docker containers (PostgreSQL, Redis)
```

### Testing
```bash
make test               # Run all tests (backend + frontend)
make test-backend       # Backend tests: ./scripts/test.sh --backend-only
make test-frontend      # Frontend tests: ./scripts/test.sh --frontend-only
make test-coverage      # Tests with coverage report
make test-watch         # Tests in watch mode
```

### Code Quality
```bash
make lint               # Lint backend (ruff) + frontend (eslint)
make format             # Format backend (ruff) + frontend (prettier)
make typecheck          # Type check backend (mypy) + frontend (tsc)
make check              # Run lint + typecheck + test
```

### Database Operations
```bash
make db-migrate         # Apply migrations: cd backend && uv run alembic upgrade head
make db-rollback        # Rollback last migration: alembic downgrade -1
make db-revision MSG="description"  # Create new migration
make db-seed            # Seed database with sample data
make db-reset           # Reset database (WARNING: deletes all data)
make db-shell           # Open PostgreSQL shell
make redis-shell        # Open Redis CLI
```

### Individual Tool Commands

**Backend (from `backend/` directory):**
```bash
uv sync                                      # Install/update dependencies
uv run uvicorn app.main:app --reload        # Start dev server
uv run alembic revision --autogenerate -m "msg"  # Create migration
uv run alembic upgrade head                 # Apply migrations
uv run pytest                               # Run tests
uv run ruff check .                         # Lint
uv run ruff format .                        # Format
uv run mypy app                             # Type check
```

**Frontend (from `frontend/` directory):**
```bash
bun install              # Install dependencies
bun run dev              # Start dev server
bun run build            # Build for production (tsc && vite build)
bun run preview          # Preview production build
bun run lint             # Lint with ESLint
bun run format           # Format with Prettier
bun run type-check       # Type check with tsc
```

## Architecture & Code Structure

### Backend Architecture (FastAPI)

**Key Pattern: Layered Architecture**
- **Routes** (`app/api/v1/*.py`) → **Services** (`app/services/*_service.py`) → **CRUD** (`app/crud/*.py`) → **Models** (`app/models/*.py`)
- Dependency injection via FastAPI's `Depends()` for database sessions and authentication
- Async/await throughout using SQLAlchemy 2.0 async API

**Important Files:**
- `backend/app/main.py` - Application entry point with CORS, middleware, router inclusion
- `backend/app/core/config.py` - Settings via Pydantic BaseSettings (loads from `.env`)
- `backend/app/core/security.py` - JWT authentication, password hashing
- `backend/app/db/base.py` - AsyncSession factory, `get_db()` dependency
- `backend/app/api/v1/router.py` - Main router that includes all endpoint modules

**Database Session Pattern:**
```python
from app.db.base import get_db
from sqlalchemy.ext.asyncio import AsyncSession

@router.get("/endpoint")
async def endpoint(db: AsyncSession = Depends(get_db)):
    # Use db for queries
    result = await db.execute(select(Model))
```

**Models Structure:**
- All models use SQLAlchemy 2.0 with `Mapped` type annotations
- UUIDs as primary keys with `uuid4()` default
- Common fields: `created_at`, `updated_at` timestamps
- Relationships use `relationship()` with TYPE_CHECKING imports to avoid circular imports
- Example: `User` model has `user_type` field ("creator"/"client"), separate `CreatorProfile`/`ClientProfile` models

**Authentication Flow:**
- JWT tokens with access token (15 min default) + refresh token (7 days)
- `app/core/security.py` provides `create_access_token()`, `verify_password()`, etc.
- Protected routes use `get_current_user()` dependency from `app/api/v1/auth.py`

**API Versioning:**
- All routes prefixed with `/v1` via `settings.API_V1_PREFIX`
- Swagger docs at `/docs`, ReDoc at `/redoc`

### Frontend Architecture (React)

**Key Pattern: Feature-based organization with Zustand + React Query**

**State Management:**
- **Server State:** TanStack Query v5 (`@/lib/query-client.ts`)
- **Client State:** Zustand stores (`@/stores/*`)
- **Forms:** React Hook Form + Zod validation

**API Client Pattern:**
```typescript
// @/lib/api/client.ts - axios instance with auth interceptor
// @/lib/api/auth.ts, gigs.ts - API functions
// Components use React Query hooks for data fetching
```

**Routing:**
- React Router v7 in `@/routes/` directory
- Configured in `App.tsx` with `RouterProvider`

**Component Structure:**
- `src/components/ui/` - shadcn/ui components (button, card, dialog, etc.)
- `src/components/auth/`, `src/components/gigs/` - Feature-specific components
- `src/pages/` - Page-level components (home, browse-gigs, gig-details, dashboard, auth/*)
- `src/layouts/` - Layout wrappers

**Styling:**
- TailwindCSS with `@/lib/utils.ts` providing `cn()` helper (clsx + tailwind-merge)
- Component variants via class-variance-authority

**Key Patterns:**
- Authentication token stored in localStorage as `auth_token`
- Axios interceptors handle token injection and 401 redirects
- React Query for caching, refetching, optimistic updates

### Database Models & Relationships

**Core Models:**
- `User` (base authentication) → `CreatorProfile` / `ClientProfile`
- `Gig` (creator services) with pricing packages
- `Project` (client postings) → `Proposal` (creator bids)
- `Message` / `Conversation` for messaging
- `Transaction` for payments
- `Review` for ratings
- `Notification` for user notifications

**Key Relationships:**
- User → Creator/Client Profile (one-to-one)
- Creator → Gigs (one-to-many)
- Client → Projects (one-to-many)
- Project → Proposals (one-to-many)

### Third-Party Integrations

**Cloudinary** (Media Storage):
- Video uploads, thumbnails, multi-quality transcoding
- Configuration: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

**Mollie** (Payment Gateway):
- Escrow payments, platform fees (15% default via `PLATFORM_FEE_PERCENTAGE`)
- Configuration: `MOLLIE_API_KEY`, `MOLLIE_PARTNER_ID`

**SendGrid** (Email):
- Transactional emails (verification, notifications)
- Configuration: `SENDGRID_API_KEY`, `FROM_EMAIL`

## Environment Configuration

The project uses a single `.env` file at the root (copy from `.env.example`).

**Critical Variables:**
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `SECRET_KEY` / `JWT_SECRET_KEY` - JWT signing key
- `VITE_API_URL` - Frontend → Backend API URL (default: `http://localhost:8000`)

**See:** `.env.example` for complete list

## Testing Strategy

**Backend:**
- pytest with pytest-asyncio for async tests
- Test files in `backend/tests/`
- Run: `cd backend && uv run pytest`

**Frontend:**
- Configuration exists but test implementation pending
- Run: `cd frontend && bun run test`

## Migrations

**Alembic Configuration:**
- Migrations are managed via Alembic in the backend
- Migration files location: `database/migrations/` (not `backend/alembic/`)
- Run migrations from `backend/` directory using `uv run alembic` commands

**Common Workflow:**
1. Modify SQLAlchemy models in `backend/app/models/`
2. Create migration: `make db-revision MSG="add new field"`
3. Review generated migration in `database/migrations/versions/`
4. Apply: `make db-migrate`
5. Rollback if needed: `make db-rollback`

## Docker & Deployment

**Development:**
- `docker-compose.yml` defines PostgreSQL, Redis, backend (optional), frontend (optional)
- Use `make docker-up` to start only databases locally
- Backend/frontend typically run directly via `make dev-backend` / `make dev-frontend`

**Production:**
```bash
make build      # Build Docker images
make prod       # Run production environment
make prod-logs  # View production logs
```

## Important Notes

1. **Always use UV for backend Python dependencies** - Not pip, poetry, or pipenv
2. **Always use Bun for frontend dependencies** - Not npm or yarn
3. **Use `make` commands when available** - They handle working directory changes
4. **Database URL format** - Automatically converts `postgresql://` to `postgresql+asyncpg://` for async support
5. **API docs are auto-generated** - Access at `http://localhost:8000/docs` when backend is running
6. **Frontend dev server runs on :5173** - Vite default, not :3000 (Docker uses :3000)
7. **All models use UUIDs** - Not integer IDs
8. **Use `uv run` prefix** - For all backend Python commands (uvicorn, alembic, pytest, etc.)

## Documentation

- `docs/BACKEND_PLAN.md` - Detailed API architecture and endpoints
- `docs/DATABASE_PLAN.md` - Complete database schema design
- `database/migrations/README.md` - Migration documentation
- `backend/README.md` - Backend-specific setup
- `frontend/README.md` - Frontend-specific setup
