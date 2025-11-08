# ReelByte

A modern, high-performance video sharing platform built with cutting-edge technologies.

## Overview

ReelByte is a full-stack video sharing application that allows users to upload, share, and discover short-form video content. Built with a focus on performance, scalability, and user experience.

## Tech Stack

### Backend
- **FastAPI 0.115+** - Modern Python web framework for building APIs
- **PostgreSQL 17** - Powerful relational database for data persistence
- **Redis 7.4** - In-memory cache and message broker
- **SQLAlchemy 2.0** - SQL toolkit and ORM
- **Alembic** - Database migration tool
- **UV** - Fast Python package installer and resolver
- **Celery** - Distributed task queue for video processing
- **FFmpeg** - Video processing and transcoding

### Frontend
- **React** - UI library for building interactive interfaces
- **TypeScript** - Type-safe JavaScript
- **Vite** - Next-generation frontend build tool
- **Bun** - Fast all-in-one JavaScript runtime and package manager
- **TailwindCSS** - Utility-first CSS framework
- **React Query** - Data fetching and state management
- **React Router** - Client-side routing

### Infrastructure
- **Docker & Docker Compose** - Containerization and orchestration
- **Cloudinary** - Media storage and CDN
- **Mollie** - Payment processing
- **SendGrid** - Email service

## Features

- User authentication and authorization
- Video upload and processing
- Multiple video quality transcoding (360p, 480p, 720p, 1080p)
- Automatic thumbnail generation
- Video search and discovery
- Social features (likes, comments, shares)
- User profiles and followers
- Real-time notifications
- Responsive design for all devices

## Prerequisites

Before you begin, ensure you have the following installed:

- **Docker** (v20.10+) and **Docker Compose** (v2.0+)
- **UV** - Fast Python package manager ([Installation](https://github.com/astral-sh/uv))
- **Bun** - JavaScript runtime and package manager ([Installation](https://bun.sh))
- **Git** - Version control

### Installing UV

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### Installing Bun

```bash
curl -fsSL https://bun.sh/install | bash
```

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/reelbyte.git
cd reelbyte
```

### 2. Initial Setup

Run the setup script to install all dependencies and initialize the database:

```bash
make setup
# or
./scripts/setup.sh
```

This will:
- Install backend dependencies with UV
- Install frontend dependencies with Bun
- Copy `.env.example` to `.env`
- Start Docker containers (PostgreSQL, Redis)
- Run database migrations
- Seed initial data

### 3. Configure Environment

Edit the `.env` file with your configuration:

```bash
nano .env  # or use your preferred editor
```

Update at minimum:
- `JWT_SECRET_KEY` - Generate a secure random key
- `SESSION_SECRET` - Generate a secure random key
- Database credentials (if different from defaults)
- API keys for external services

### 4. Start Development Servers

```bash
make dev
# or
./scripts/dev.sh
```

This will start:
- **Backend API** at [http://localhost:8000](http://localhost:8000)
- **Frontend** at [http://localhost:5173](http://localhost:5173)
- **API Documentation** at [http://localhost:8000/docs](http://localhost:8000/docs)
- **PostgreSQL** on port 5432
- **Redis** on port 6379

### 5. Access the Application

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:8000](http://localhost:8000)
- API Docs (Swagger): [http://localhost:8000/docs](http://localhost:8000/docs)
- API Docs (ReDoc): [http://localhost:8000/redoc](http://localhost:8000/redoc)

## Development Workflow

### Running Tests

Run all tests (backend + frontend):

```bash
make test
# or
./scripts/test.sh
```

Run only backend tests:

```bash
./scripts/test.sh --backend-only
```

Run only frontend tests:

```bash
./scripts/test.sh --frontend-only
```

Run tests with coverage:

```bash
./scripts/test.sh --coverage
```

Run tests in watch mode:

```bash
./scripts/test.sh --watch
```

### Database Migrations

Create a new migration:

```bash
cd backend
uv run alembic revision --autogenerate -m "Description of changes"
```

Apply migrations:

```bash
cd backend
uv run alembic upgrade head
```

Rollback migrations:

```bash
cd backend
uv run alembic downgrade -1
```

### Code Formatting and Linting

Backend (Python):

```bash
cd backend
uv run ruff check .          # Lint
uv run ruff format .         # Format
uv run mypy app              # Type check
```

Frontend (TypeScript):

```bash
cd frontend
bun run lint                 # Lint
bun run format               # Format
bun run type-check           # Type check
```

### API Development

The backend uses FastAPI, which provides automatic API documentation:

- Interactive API docs: [http://localhost:8000/docs](http://localhost:8000/docs)
- Alternative docs: [http://localhost:8000/redoc](http://localhost:8000/redoc)

### Frontend Development

The frontend is built with React and Vite:

```bash
cd frontend
bun run dev          # Start dev server
bun run build        # Build for production
bun run preview      # Preview production build
bun run test         # Run tests
```

## Project Structure

```
reelbyte/
├── backend/                 # FastAPI backend application
│   ├── app/
│   │   ├── api/            # API routes and endpoints
│   │   ├── core/           # Core functionality (config, security)
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   └── main.py         # Application entry point
│   ├── alembic/            # Database migrations
│   ├── tests/              # Backend tests
│   └── pyproject.toml      # Python dependencies
│
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service layer
│   │   ├── utils/          # Utility functions
│   │   └── App.tsx         # Main application component
│   ├── public/             # Static assets
│   └── package.json        # Node dependencies
│
├── database/               # Database schemas and seeds
├── docker/                 # Docker configuration files
├── docs/                   # Project documentation
├── scripts/                # Development and deployment scripts
│   ├── dev.sh             # Start development environment
│   ├── setup.sh           # Initial setup script
│   └── test.sh            # Run tests
│
├── docker-compose.yml      # Docker services configuration
├── Makefile               # Common development commands
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## Available Make Commands

```bash
make setup          # Initial project setup
make dev            # Start development environment
make test           # Run all tests
make test-backend   # Run backend tests only
make test-frontend  # Run frontend tests only
make lint           # Lint code
make format         # Format code
make clean          # Clean up containers and dependencies
make logs           # View Docker logs
make db-migrate     # Run database migrations
make db-seed        # Seed database with sample data
make help           # Show available commands
```

## Environment Variables

See [`.env.example`](./.env.example) for a complete list of environment variables.

Key variables:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET_KEY` - Secret key for JWT tokens
- `CLOUDINARY_*` - Cloudinary credentials for media storage
- `MOLLIE_API_KEY` - Mollie payment API key
- `SENDGRID_API_KEY` - SendGrid API key for emails

## Documentation

- [Database Architecture Plan](./docs/DATABASE_PLAN.md)
- [Backend Architecture Plan](./docs/BACKEND_PLAN.md)
- [Database Migrations Guide](./database/migrations/README.md)

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout user

### Videos
- `GET /videos` - List videos
- `POST /videos` - Upload video
- `GET /videos/{id}` - Get video details
- `PATCH /videos/{id}` - Update video
- `DELETE /videos/{id}` - Delete video

### Users
- `GET /users/me` - Get current user
- `PATCH /users/me` - Update current user
- `GET /users/{id}` - Get user profile
- `GET /users/{id}/videos` - Get user's videos

### Social
- `POST /videos/{id}/like` - Like video
- `DELETE /videos/{id}/like` - Unlike video
- `POST /videos/{id}/comments` - Add comment
- `GET /videos/{id}/comments` - Get comments

See [API Documentation](http://localhost:8000/docs) for complete endpoint list.

## Troubleshooting

### Common Issues

**Docker containers won't start:**
```bash
docker-compose down -v
docker-compose up -d
```

**Database connection issues:**
- Ensure PostgreSQL container is running: `docker-compose ps`
- Check credentials in `.env`
- Verify port 5432 is not in use

**Frontend won't connect to backend:**
- Verify `VITE_API_URL` in `.env`
- Check CORS settings in backend
- Ensure backend is running on port 8000

**Video upload fails:**
- Check upload size limits
- Verify storage configuration
- Check disk space

## Contributing

We welcome contributions! Please see our [Contributing Guide](./docs/contributing.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- Documentation: [./docs](./docs)
- Issues: [GitHub Issues](https://github.com/yourusername/reelbyte/issues)
- Discussions: [GitHub Discussions](https://github.com/yourusername/reelbyte/discussions)

## Acknowledgments

- FastAPI for the excellent Python web framework
- React team for the amazing UI library
- Bun and UV for making dependency management fast and easy
- The open-source community

---

Built with care by the ReelByte team
