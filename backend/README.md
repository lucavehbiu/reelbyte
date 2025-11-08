# ReelByte Backend

FastAPI backend for ReelByte - A freelancer marketplace for video content creators.

## Tech Stack

- **Framework:** FastAPI 0.115+
- **Language:** Python 3.12+
- **Database:** PostgreSQL 17
- **Cache:** Redis
- **ORM:** SQLAlchemy 2.0+
- **Package Manager:** UV
- **Migrations:** Alembic
- **Authentication:** JWT (python-jose)
- **Password Hashing:** Bcrypt (passlib)

## Third-Party Integrations

- **Payments:** Mollie API
- **File Storage:** Cloudinary
- **Real-time:** Socket.IO

## Getting Started

### Prerequisites

- Python 3.12+
- PostgreSQL 17
- Redis
- UV package manager

### Installation

1. **Install UV package manager:**
   ```bash
   curl -LsSf https://astral.sh/uv/install.sh | sh
   ```

2. **Create virtual environment and install dependencies:**
   ```bash
   cd backend
   uv venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   uv pip install -e .
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

4. **Run database migrations:**
   ```bash
   alembic upgrade head
   ```

5. **Start the development server:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

6. **Access the API documentation:**
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                  # FastAPI application entry point
│   ├── core/
│   │   ├── config.py            # Configuration settings
│   │   └── security.py          # Authentication & security
│   ├── db/
│   │   └── base.py              # Database setup
│   ├── api/
│   │   └── v1/
│   │       └── router.py        # API v1 router
│   ├── models/                  # SQLAlchemy models (to be implemented)
│   ├── schemas/                 # Pydantic schemas (to be implemented)
│   ├── services/                # Business logic (to be implemented)
│   └── integrations/            # Third-party integrations (to be implemented)
├── migrations/                  # Alembic migrations
├── tests/                       # Test suite
├── pyproject.toml              # UV/pip configuration
├── Dockerfile                  # Docker configuration
├── .env.example                # Environment variables template
└── README.md                   # This file
```

## API Endpoints

### Current Endpoints

- `GET /` - Root endpoint
- `GET /health` - Health check
- `GET /v1/health` - API v1 health check

### Planned Endpoints

See `/home/user/reelbyte/docs/BACKEND_PLAN.md` for complete API specification.

## Development

### Running Tests

```bash
pytest
```

### Code Formatting

```bash
black app/
```

### Linting

```bash
ruff app/
```

## Docker

### Build Docker image:

```bash
docker build -t reelbyte-backend .
```

### Run container:

```bash
docker run -p 8000:8000 --env-file .env reelbyte-backend
```

## Environment Variables

See `.env.example` for all required environment variables.

## License

Proprietary - All rights reserved

## Documentation

For detailed architecture and implementation plans, see:
- `/home/user/reelbyte/docs/BACKEND_PLAN.md`
