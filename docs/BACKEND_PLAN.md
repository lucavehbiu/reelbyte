# ReelByte Backend Architecture Plan

**Platform**: Freelancer Marketplace for Video Content Creators
**Tech Stack**: FastAPI 0.115+, PostgreSQL 17, Redis, UV Package Manager
**Date**: November 2025
**Version**: 1.0

---

## Table of Contents

1. [API Architecture](#1-api-architecture)
2. [Core Features](#2-core-features)
3. [Project Structure](#3-project-structure)
4. [Database Schema](#4-database-schema)
5. [Security & Best Practices](#5-security--best-practices)
6. [Third-party Integrations](#6-third-party-integrations)
7. [Development Roadmap](#7-development-roadmap)

---

## 1. API Architecture

### 1.1 RESTful API Structure

The API follows REST principles with versioned endpoints for future-proofing:

**Base URL**: `https://api.reelbyte.com/v1`

**Core Principles**:
- Resource-based URLs
- HTTP methods for CRUD operations
- JSON request/response format
- Consistent error responses
- API versioning via URL path

### 1.2 API Endpoints

#### Authentication & Users (`/auth`, `/users`)

```
POST   /v1/auth/register                    # Register new user (creator/client)
POST   /v1/auth/login                       # Login user
POST   /v1/auth/logout                      # Logout user
POST   /v1/auth/refresh                     # Refresh access token
POST   /v1/auth/forgot-password             # Request password reset
POST   /v1/auth/reset-password              # Reset password with token
POST   /v1/auth/verify-email                # Verify email address

GET    /v1/users/me                         # Get current user profile
PUT    /v1/users/me                         # Update current user profile
DELETE /v1/users/me                         # Deactivate account
GET    /v1/users/{user_id}                  # Get public user profile
GET    /v1/users/{user_id}/portfolio        # Get user portfolio items
POST   /v1/users/me/portfolio               # Add portfolio item
DELETE /v1/users/me/portfolio/{item_id}     # Remove portfolio item
```

#### Gigs/Services (`/gigs`)

```
GET    /v1/gigs                             # List all gigs (with filters)
POST   /v1/gigs                             # Create new gig (creators only)
GET    /v1/gigs/{gig_id}                    # Get gig details
PUT    /v1/gigs/{gig_id}                    # Update gig
DELETE /v1/gigs/{gig_id}                    # Delete gig
GET    /v1/gigs/{gig_id}/packages           # Get gig pricing packages
POST   /v1/gigs/{gig_id}/packages           # Add pricing package
PUT    /v1/gigs/{gig_id}/packages/{pkg_id}  # Update pricing package
DELETE /v1/gigs/{gig_id}/packages/{pkg_id}  # Delete pricing package
```

#### Projects & Proposals (`/projects`, `/proposals`)

```
GET    /v1/projects                         # List projects (with filters)
POST   /v1/projects                         # Create project posting (clients only)
GET    /v1/projects/{project_id}            # Get project details
PUT    /v1/projects/{project_id}            # Update project
DELETE /v1/projects/{project_id}            # Delete project
GET    /v1/projects/{project_id}/proposals  # Get project proposals

POST   /v1/proposals                        # Submit proposal (creators only)
GET    /v1/proposals/{proposal_id}          # Get proposal details
PUT    /v1/proposals/{proposal_id}          # Update proposal
DELETE /v1/proposals/{proposal_id}          # Withdraw proposal
POST   /v1/proposals/{proposal_id}/accept   # Accept proposal (clients only)
POST   /v1/proposals/{proposal_id}/reject   # Reject proposal (clients only)
```

#### Orders & Contracts (`/orders`)

```
GET    /v1/orders                           # List user orders
POST   /v1/orders                           # Create order from gig/proposal
GET    /v1/orders/{order_id}                # Get order details
PUT    /v1/orders/{order_id}                # Update order status
POST   /v1/orders/{order_id}/deliver        # Submit delivery (creator)
POST   /v1/orders/{order_id}/approve        # Approve delivery (client)
POST   /v1/orders/{order_id}/request-revision  # Request revision
POST   /v1/orders/{order_id}/cancel         # Cancel order
GET    /v1/orders/{order_id}/deliverables   # Get order deliverables
POST   /v1/orders/{order_id}/deliverables   # Upload deliverable
```

#### Payments (`/payments`)

```
POST   /v1/payments/checkout                # Create payment session (Mollie)
GET    /v1/payments/{payment_id}            # Get payment status
POST   /v1/payments/webhook                 # Mollie webhook handler
GET    /v1/payments/me/balance              # Get user balance
POST   /v1/payments/me/withdraw             # Request payout (creators)
GET    /v1/payments/me/transactions         # Get transaction history
```

#### Messaging (`/messages`, `/conversations`)

```
GET    /v1/conversations                    # List user conversations
POST   /v1/conversations                    # Start new conversation
GET    /v1/conversations/{conv_id}          # Get conversation details
DELETE /v1/conversations/{conv_id}          # Archive conversation
GET    /v1/conversations/{conv_id}/messages # Get conversation messages
POST   /v1/conversations/{conv_id}/messages # Send message
PUT    /v1/messages/{message_id}            # Edit message
DELETE /v1/messages/{message_id}            # Delete message
POST   /v1/messages/{message_id}/read       # Mark message as read
```

#### Search & Discovery (`/search`)

```
GET    /v1/search/gigs                      # Search gigs
GET    /v1/search/creators                  # Search creators
GET    /v1/search/projects                  # Search projects
GET    /v1/search/suggestions               # Get search suggestions (autocomplete)
```

#### Reviews & Ratings (`/reviews`)

```
GET    /v1/reviews/gigs/{gig_id}            # Get gig reviews
GET    /v1/reviews/users/{user_id}          # Get user reviews
POST   /v1/reviews                          # Create review (after order completion)
PUT    /v1/reviews/{review_id}              # Update review
DELETE /v1/reviews/{review_id}              # Delete review
POST   /v1/reviews/{review_id}/reply        # Reply to review
POST   /v1/reviews/{review_id}/helpful      # Mark review as helpful
```

#### Categories & Tags (`/categories`)

```
GET    /v1/categories                       # List all categories
GET    /v1/categories/{category_id}         # Get category details
GET    /v1/categories/{category_id}/subcategories  # Get subcategories
GET    /v1/tags                             # List popular tags
```

#### Notifications (`/notifications`)

```
GET    /v1/notifications                    # Get user notifications
PUT    /v1/notifications/{notif_id}/read    # Mark notification as read
PUT    /v1/notifications/read-all           # Mark all as read
DELETE /v1/notifications/{notif_id}         # Delete notification
```

#### File Uploads (`/uploads`)

```
POST   /v1/uploads/video                    # Upload video to Cloudinary
POST   /v1/uploads/image                    # Upload image
POST   /v1/uploads/document                 # Upload document
GET    /v1/uploads/{upload_id}              # Get upload metadata
DELETE /v1/uploads/{upload_id}              # Delete upload
```

#### Admin (`/admin`)

```
GET    /v1/admin/users                      # List all users (admin only)
PUT    /v1/admin/users/{user_id}/verify     # Verify user account
PUT    /v1/admin/users/{user_id}/suspend    # Suspend user
GET    /v1/admin/analytics                  # Platform analytics
GET    /v1/admin/reports                    # User reports
PUT    /v1/admin/reports/{report_id}/resolve  # Resolve report
```

### 1.3 Authentication & Authorization

**Strategy**: JWT (JSON Web Tokens)

**Implementation**:
```python
# Access token: Short-lived (15 minutes)
# Refresh token: Long-lived (7 days), stored in httpOnly cookie

# Token payload structure:
{
  "sub": "user_id",
  "type": "access|refresh",
  "role": "creator|client|admin",
  "exp": 1699999999,
  "iat": 1699999000
}
```

**Authorization Levels**:
1. **Public**: No authentication required (browse gigs, view profiles)
2. **Authenticated**: Any logged-in user (create orders, send messages)
3. **Creator**: Creator-specific actions (create gigs, submit proposals)
4. **Client**: Client-specific actions (post projects, accept proposals)
5. **Admin**: Platform administration

**Implementation Pattern**:
```python
from fastapi import Depends, HTTPException
from app.core.security import get_current_user, require_role

# Require authentication
@router.get("/protected")
async def protected_route(current_user = Depends(get_current_user)):
    return {"user_id": current_user.id}

# Require specific role
@router.post("/gigs")
async def create_gig(
    gig_data: GigCreate,
    current_user = Depends(require_role("creator"))
):
    return await gig_service.create(gig_data, current_user)
```

### 1.4 Rate Limiting

**Strategy**: Redis-based rate limiting with different tiers

**Rate Limits**:
```python
RATE_LIMITS = {
    "public": "100/minute",           # Public endpoints
    "authenticated": "1000/minute",   # Authenticated users
    "creator": "2000/minute",         # Creators
    "admin": "unlimited",             # Admins

    # Specific endpoints
    "auth/login": "5/minute",         # Prevent brute force
    "auth/register": "3/hour",        # Prevent spam
    "uploads": "50/hour",             # File uploads
    "messages": "100/hour",           # Messaging
}
```

**Implementation**:
```python
from fastapi_limiter import FastAPILimiter
from fastapi_limiter.depends import RateLimiter

@router.post("/auth/login")
@limiter.limit("5/minute")
async def login(request: Request, credentials: LoginRequest):
    # Login logic
    pass
```

### 1.5 WebSocket Endpoints

**Real-time Communication**:
```
WS  /v1/ws/chat                            # Real-time chat connection
WS  /v1/ws/notifications                   # Real-time notifications
```

**WebSocket Message Format**:
```json
{
  "type": "message|notification|typing|read",
  "data": {
    "conversation_id": "uuid",
    "message": "...",
    "timestamp": "ISO8601"
  }
}
```

---

## 2. Core Features

### 2.1 User Authentication System

**Features**:
- Email/password registration and login
- Email verification
- Password reset flow
- JWT-based authentication
- Refresh token rotation
- Role-based access control (RBAC)
- Account deactivation/deletion

**User Types**:
1. **Creators**: Offer video creation services
2. **Clients**: Hire video creators
3. **Hybrid**: Can be both (toggle mode)
4. **Admin**: Platform management

**Profile Information**:
```python
class UserProfile:
    # Basic info
    email: str
    username: str
    full_name: str
    bio: str
    avatar_url: str

    # Creator-specific
    skills: List[str]
    portfolio: List[PortfolioItem]
    hourly_rate: Optional[Decimal]
    availability: str

    # Verification & reputation
    is_verified: bool
    rating: float
    total_reviews: int
    total_orders: int
    response_time: str

    # Settings
    notification_preferences: dict
    timezone: str
    language: str
```

### 2.2 Gig/Service Management

**Gig Structure**:
```python
class Gig:
    id: UUID
    creator_id: UUID
    title: str
    description: str
    category_id: UUID
    subcategory_id: UUID
    tags: List[str]

    # Media
    thumbnail_url: str
    gallery_urls: List[str]
    video_preview_url: Optional[str]

    # Pricing packages
    packages: List[GigPackage]  # Basic, Standard, Premium

    # Metadata
    delivery_time: int  # days
    revisions: int
    requirements: str

    # Stats
    views: int
    orders: int
    rating: float
    is_active: bool
    created_at: datetime
```

**Gig Packages**:
```python
class GigPackage:
    name: str  # "Basic", "Standard", "Premium"
    description: str
    price: Decimal
    delivery_days: int
    revisions: int
    features: List[str]
```

### 2.3 Project Posting & Proposal System

**Project Workflow**:
1. Client posts project with requirements
2. Creators submit proposals
3. Client reviews proposals
4. Client accepts proposal → becomes order
5. Work begins

**Project Structure**:
```python
class Project:
    id: UUID
    client_id: UUID
    title: str
    description: str
    category_id: UUID
    budget_min: Decimal
    budget_max: Decimal
    deadline: date
    required_skills: List[str]
    attachments: List[str]
    status: str  # "open", "in_progress", "completed", "cancelled"
    proposals_count: int
    created_at: datetime
```

**Proposal Structure**:
```python
class Proposal:
    id: UUID
    project_id: UUID
    creator_id: UUID
    cover_letter: str
    proposed_price: Decimal
    delivery_time: int
    attachments: List[str]
    status: str  # "pending", "accepted", "rejected", "withdrawn"
    created_at: datetime
```

### 2.4 Payment Integration (Mollie)

**Payment Flow**:

**For Gig Orders**:
1. Client selects gig package
2. Create order (status: "pending_payment")
3. Initiate Mollie payment session
4. Client completes payment
5. Mollie webhook confirms payment
6. Order status → "in_progress"
7. Funds held in escrow

**For Project Orders**:
1. Client accepts proposal
2. Create order from proposal
3. Same payment flow as gig orders

**Payout Flow**:
1. Creator delivers work
2. Client approves delivery
3. Order status → "completed"
4. Platform fee deducted (e.g., 15%)
5. Funds released to creator balance
6. Creator requests payout
7. Process payout via Mollie Connect

**Payment Models**:
```python
class Payment:
    id: UUID
    order_id: UUID
    amount: Decimal
    currency: str
    status: str  # "pending", "paid", "failed", "refunded"
    mollie_payment_id: str
    mollie_checkout_url: str
    created_at: datetime

class Transaction:
    id: UUID
    user_id: UUID
    type: str  # "payment", "earning", "withdrawal", "refund"
    amount: Decimal
    fee: Decimal
    balance_after: Decimal
    reference_type: str  # "order", "payout"
    reference_id: UUID
    created_at: datetime
```

**Platform Fees**:
- Service fee: 15% on completed orders
- Payment processing: Passed to client (Mollie fees)
- Minimum payout: €20

### 2.5 File Upload System (Cloudinary)

**Supported File Types**:
- Videos: MP4, MOV, AVI (max 500MB)
- Images: JPG, PNG, GIF (max 10MB)
- Documents: PDF (max 5MB)

**Upload Flow**:
1. Client requests signed upload URL
2. Direct upload to Cloudinary
3. Cloudinary webhook confirms upload
4. Store metadata in PostgreSQL

**Cloudinary Configuration**:
```python
CLOUDINARY_CONFIG = {
    "cloud_name": "reelbyte",
    "folder_structure": {
        "portfolio": "users/{user_id}/portfolio/",
        "gig_gallery": "gigs/{gig_id}/gallery/",
        "deliverables": "orders/{order_id}/deliverables/",
        "avatars": "users/{user_id}/avatar/",
        "attachments": "messages/{conversation_id}/"
    },
    "transformations": {
        "thumbnail": {"width": 400, "height": 300, "crop": "fill"},
        "avatar": {"width": 200, "height": 200, "crop": "fill", "gravity": "face"},
        "video_preview": {"duration": 10, "quality": "auto"}
    }
}
```

**Upload Model**:
```python
class Upload:
    id: UUID
    user_id: UUID
    cloudinary_public_id: str
    cloudinary_url: str
    file_type: str  # "video", "image", "document"
    file_size: int
    mime_type: str
    width: Optional[int]
    height: Optional[int]
    duration: Optional[int]  # for videos
    created_at: datetime
```

### 2.6 Real-time Messaging (WebSockets)

**Features**:
- One-on-one conversations
- Real-time message delivery
- Typing indicators
- Read receipts
- File attachments
- Message history

**WebSocket Connection Management**:
```python
class ConnectionManager:
    active_connections: Dict[UUID, WebSocket] = {}

    async def connect(user_id: UUID, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    async def send_message(user_id: UUID, message: dict):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_json(message)

    async def broadcast_to_conversation(conversation_id: UUID, message: dict):
        # Send to all participants
        pass
```

**Message Model**:
```python
class Message:
    id: UUID
    conversation_id: UUID
    sender_id: UUID
    content: str
    attachment_url: Optional[str]
    is_read: bool
    created_at: datetime
    edited_at: Optional[datetime]

class Conversation:
    id: UUID
    participant_ids: List[UUID]
    last_message: Optional[Message]
    unread_count: Dict[UUID, int]  # per participant
    created_at: datetime
```

**Redis for Message Queue**:
- Store undelivered messages
- Cache recent conversations
- Track online users

### 2.7 Search & Filtering

**Search Implementation**:
- PostgreSQL full-text search for basic queries
- Redis for caching popular searches
- Elasticsearch (optional for advanced search)

**Gig Search Filters**:
```python
class GigSearchFilters:
    query: Optional[str]
    category_id: Optional[UUID]
    subcategory_id: Optional[UUID]
    tags: Optional[List[str]]
    min_price: Optional[Decimal]
    max_price: Optional[Decimal]
    delivery_time: Optional[int]
    creator_level: Optional[str]  # "new", "rising", "pro", "top"
    rating_min: Optional[float]
    sort_by: str = "relevance"  # "price_asc", "price_desc", "rating", "popular"
```

**Search Indexing**:
```sql
-- PostgreSQL full-text search
CREATE INDEX idx_gigs_search ON gigs USING GIN(
    to_tsvector('english', title || ' ' || description || ' ' || tags)
);
```

### 2.8 Review & Rating System

**Review Rules**:
- Only after order completion
- One review per order
- 1-5 star rating
- Review categories (communication, quality, timeliness)
- Reply capability for creators
- Flag inappropriate reviews

**Review Model**:
```python
class Review:
    id: UUID
    order_id: UUID
    reviewer_id: UUID  # client
    reviewee_id: UUID  # creator
    rating: float  # 1-5

    # Category ratings
    communication_rating: float
    quality_rating: float
    timeliness_rating: float

    # Content
    comment: str
    reply: Optional[str]
    reply_at: Optional[datetime]

    # Moderation
    is_flagged: bool
    helpful_count: int

    created_at: datetime
```

**Rating Calculation**:
- Overall rating = Average of all reviews
- Weighted by recency (recent reviews count more)
- Display rating breakdown by category

---

## 3. Project Structure

### 3.1 Directory Structure

```
reelbyte/
├── app/
│   ├── __init__.py
│   ├── main.py                      # FastAPI application entry point
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py                # Configuration settings
│   │   ├── security.py              # JWT, password hashing
│   │   ├── database.py              # Database connection
│   │   ├── redis.py                 # Redis connection
│   │   ├── dependencies.py          # Shared dependencies
│   │   └── exceptions.py            # Custom exceptions
│   │
│   ├── models/                      # SQLAlchemy ORM models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── gig.py
│   │   ├── project.py
│   │   ├── order.py
│   │   ├── payment.py
│   │   ├── message.py
│   │   ├── review.py
│   │   ├── category.py
│   │   ├── notification.py
│   │   └── upload.py
│   │
│   ├── schemas/                     # Pydantic schemas (request/response)
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── auth.py
│   │   ├── gig.py
│   │   ├── project.py
│   │   ├── order.py
│   │   ├── payment.py
│   │   ├── message.py
│   │   ├── review.py
│   │   └── common.py
│   │
│   ├── api/
│   │   ├── __init__.py
│   │   ├── v1/
│   │   │   ├── __init__.py
│   │   │   ├── router.py            # Main v1 router
│   │   │   ├── auth.py              # Authentication endpoints
│   │   │   ├── users.py             # User endpoints
│   │   │   ├── gigs.py              # Gig endpoints
│   │   │   ├── projects.py          # Project endpoints
│   │   │   ├── proposals.py         # Proposal endpoints
│   │   │   ├── orders.py            # Order endpoints
│   │   │   ├── payments.py          # Payment endpoints
│   │   │   ├── messages.py          # Messaging endpoints
│   │   │   ├── reviews.py           # Review endpoints
│   │   │   ├── search.py            # Search endpoints
│   │   │   ├── uploads.py           # Upload endpoints
│   │   │   ├── categories.py        # Category endpoints
│   │   │   ├── notifications.py     # Notification endpoints
│   │   │   ├── admin.py             # Admin endpoints
│   │   │   └── websocket.py         # WebSocket endpoints
│   │
│   ├── services/                    # Business logic layer
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── user_service.py
│   │   ├── gig_service.py
│   │   ├── project_service.py
│   │   ├── order_service.py
│   │   ├── payment_service.py
│   │   ├── message_service.py
│   │   ├── review_service.py
│   │   ├── search_service.py
│   │   ├── notification_service.py
│   │   └── upload_service.py
│   │
│   ├── repositories/                # Data access layer (optional)
│   │   ├── __init__.py
│   │   ├── base.py
│   │   ├── user_repository.py
│   │   ├── gig_repository.py
│   │   └── ...
│   │
│   ├── integrations/                # Third-party integrations
│   │   ├── __init__.py
│   │   ├── mollie.py                # Mollie payment integration
│   │   ├── cloudinary.py            # Cloudinary integration
│   │   └── email.py                 # Email service (SendGrid/SES)
│   │
│   ├── utils/                       # Utility functions
│   │   ├── __init__.py
│   │   ├── validators.py
│   │   ├── helpers.py
│   │   ├── pagination.py
│   │   └── rate_limiter.py
│   │
│   └── websocket/                   # WebSocket handlers
│       ├── __init__.py
│       ├── manager.py               # Connection manager
│       └── handlers.py              # Message handlers
│
├── migrations/                      # Alembic migrations
│   ├── versions/
│   └── env.py
│
├── tests/
│   ├── __init__.py
│   ├── conftest.py                  # Pytest fixtures
│   ├── test_auth.py
│   ├── test_gigs.py
│   ├── test_orders.py
│   └── ...
│
├── scripts/
│   ├── seed_data.py                 # Database seeding
│   └── migrate.py                   # Migration helper
│
├── docs/
│   ├── BACKEND_PLAN.md              # This document
│   ├── API.md                       # API documentation
│   └── DEPLOYMENT.md                # Deployment guide
│
├── .env.example                     # Environment variables template
├── .gitignore
├── pyproject.toml                   # UV/pip configuration
├── README.md
└── docker-compose.yml               # Docker setup
```

### 3.2 FastAPI Application Setup

**main.py**:
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi_limiter import FastAPILimiter
import redis.asyncio as redis

from app.core.config import settings
from app.core.database import engine, Base
from app.api.v1.router import api_router

# Create FastAPI app
app = FastAPI(
    title="ReelByte API",
    description="Freelancer marketplace for video content creators",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Trusted host middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.ALLOWED_HOSTS
)

@app.on_event("startup")
async def startup():
    # Initialize database
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Initialize Redis for rate limiting
    redis_connection = redis.from_url(
        settings.REDIS_URL,
        encoding="utf-8",
        decode_responses=True
    )
    await FastAPILimiter.init(redis_connection)

@app.on_event("shutdown")
async def shutdown():
    # Clean up connections
    await engine.dispose()

# Include API routers
app.include_router(api_router, prefix="/v1")

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
```

### 3.3 Configuration Management

**core/config.py**:
```python
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # App
    APP_NAME: str = "ReelByte"
    DEBUG: bool = False
    ENVIRONMENT: str = "production"

    # API
    API_V1_PREFIX: str = "/v1"
    ALLOWED_ORIGINS: List[str] = ["https://reelbyte.com"]
    ALLOWED_HOSTS: List[str] = ["api.reelbyte.com"]

    # Database
    DATABASE_URL: str
    DB_POOL_SIZE: int = 20
    DB_MAX_OVERFLOW: int = 40

    # Redis
    REDIS_URL: str
    REDIS_TTL: int = 3600

    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    PASSWORD_MIN_LENGTH: int = 8

    # Mollie
    MOLLIE_API_KEY: str
    MOLLIE_PARTNER_ID: str
    PLATFORM_FEE_PERCENTAGE: float = 15.0
    MINIMUM_PAYOUT: float = 20.0

    # Cloudinary
    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str
    MAX_VIDEO_SIZE_MB: int = 500
    MAX_IMAGE_SIZE_MB: int = 10

    # Email
    EMAIL_SERVICE: str = "sendgrid"  # or "ses"
    SENDGRID_API_KEY: str = ""
    FROM_EMAIL: str = "noreply@reelbyte.com"

    # Rate Limiting
    RATE_LIMIT_ENABLED: bool = True

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
```

### 3.4 Dependencies & Requirements

**pyproject.toml** (for UV package manager):
```toml
[project]
name = "reelbyte"
version = "1.0.0"
description = "Freelancer marketplace for video content creators"
requires-python = ">=3.11"
dependencies = [
    "fastapi>=0.115.0",
    "uvicorn[standard]>=0.24.0",
    "pydantic>=2.5.0",
    "pydantic-settings>=2.1.0",
    "sqlalchemy>=2.0.23",
    "asyncpg>=0.29.0",              # PostgreSQL async driver
    "alembic>=1.13.0",               # Database migrations
    "redis>=5.0.0",
    "python-jose[cryptography]>=3.3.0",  # JWT
    "passlib[bcrypt]>=1.7.4",        # Password hashing
    "python-multipart>=0.0.6",       # File uploads
    "cloudinary>=1.36.0",
    "mollie-api-python>=2.3.0",
    "fastapi-limiter>=0.1.6",        # Rate limiting
    "websockets>=12.0",
    "python-dotenv>=1.0.0",
    "httpx>=0.25.0",                 # Async HTTP client
    "sendgrid>=6.11.0",              # Email service
    "jinja2>=3.1.2",                 # Email templates
    "python-slugify>=8.0.1",
    "pillow>=10.1.0",                # Image processing
]

[project.optional-dependencies]
dev = [
    "pytest>=7.4.3",
    "pytest-asyncio>=0.21.1",
    "pytest-cov>=4.1.0",
    "httpx>=0.25.0",                 # For testing
    "faker>=20.1.0",                 # Fake data
    "black>=23.11.0",                # Code formatting
    "ruff>=0.1.6",                   # Linting
    "mypy>=1.7.0",                   # Type checking
]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.black]
line-length = 100
target-version = ["py311"]

[tool.ruff]
line-length = 100
select = ["E", "F", "I"]

[tool.mypy]
python_version = "3.11"
strict = true
```

**Install dependencies with UV**:
```bash
# Install UV package manager
curl -LsSf https://astral.sh/uv/install.sh | sh

# Create virtual environment and install dependencies
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv pip install -e ".[dev]"
```

---

## 4. Database Schema

### 4.1 Core Tables

**users**:
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    bio TEXT,
    avatar_url VARCHAR(500),

    -- Account type
    is_creator BOOLEAN DEFAULT FALSE,
    is_client BOOLEAN DEFAULT FALSE,

    -- Verification
    is_email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,  -- Platform verification

    -- Settings
    notification_preferences JSONB DEFAULT '{}',
    timezone VARCHAR(50) DEFAULT 'UTC',
    language VARCHAR(10) DEFAULT 'en',

    -- Stats (denormalized for performance)
    rating DECIMAL(3,2) DEFAULT 0.0,
    total_reviews INT DEFAULT 0,
    total_orders INT DEFAULT 0,
    response_time_hours INT,

    -- Balance for creators
    balance DECIMAL(10,2) DEFAULT 0.0,

    -- Timestamps
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_is_creator ON users(is_creator) WHERE is_creator = TRUE;
```

**creator_profiles**:
```sql
CREATE TABLE creator_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    skills TEXT[] DEFAULT '{}',
    hourly_rate DECIMAL(10,2),
    availability VARCHAR(50),  -- "full-time", "part-time", "unavailable"

    -- Social links
    portfolio_website VARCHAR(500),
    youtube_url VARCHAR(500),
    instagram_url VARCHAR(500),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**categories**:
```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);
```

**gigs**:
```sql
CREATE TABLE gigs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Content
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(300) UNIQUE NOT NULL,
    description TEXT NOT NULL,

    -- Categorization
    category_id UUID REFERENCES categories(id),
    subcategory_id UUID REFERENCES categories(id),
    tags TEXT[] DEFAULT '{}',

    -- Media
    thumbnail_url VARCHAR(500),
    gallery_urls TEXT[] DEFAULT '{}',
    video_preview_url VARCHAR(500),

    -- Metadata
    requirements TEXT,

    -- Stats
    views INT DEFAULT 0,
    orders INT DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.0,
    total_reviews INT DEFAULT 0,

    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_gigs_creator ON gigs(creator_id);
CREATE INDEX idx_gigs_category ON gigs(category_id);
CREATE INDEX idx_gigs_active ON gigs(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_gigs_search ON gigs USING GIN(to_tsvector('english', title || ' ' || description));
```

**gig_packages**:
```sql
CREATE TABLE gig_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gig_id UUID NOT NULL REFERENCES gigs(id) ON DELETE CASCADE,

    name VARCHAR(50) NOT NULL,  -- "Basic", "Standard", "Premium"
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    delivery_days INT NOT NULL,
    revisions INT NOT NULL,
    features TEXT[] DEFAULT '{}',

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_gig_packages_gig ON gig_packages(gig_id);
```

**projects**:
```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Content
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,

    -- Categorization
    category_id UUID REFERENCES categories(id),
    required_skills TEXT[] DEFAULT '{}',

    -- Budget
    budget_min DECIMAL(10,2),
    budget_max DECIMAL(10,2),

    -- Timeline
    deadline DATE,

    -- Attachments
    attachments TEXT[] DEFAULT '{}',

    -- Status
    status VARCHAR(50) DEFAULT 'open',  -- "open", "in_progress", "completed", "cancelled"

    -- Stats
    proposals_count INT DEFAULT 0,
    views INT DEFAULT 0,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_projects_client ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_category ON projects(category_id);
```

**proposals**:
```sql
CREATE TABLE proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    cover_letter TEXT NOT NULL,
    proposed_price DECIMAL(10,2) NOT NULL,
    delivery_days INT NOT NULL,
    attachments TEXT[] DEFAULT '{}',

    status VARCHAR(50) DEFAULT 'pending',  -- "pending", "accepted", "rejected", "withdrawn"

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(project_id, creator_id)  -- One proposal per creator per project
);

CREATE INDEX idx_proposals_project ON proposals(project_id);
CREATE INDEX idx_proposals_creator ON proposals(creator_id);
CREATE INDEX idx_proposals_status ON proposals(status);
```

**orders**:
```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Parties
    client_id UUID NOT NULL REFERENCES users(id),
    creator_id UUID NOT NULL REFERENCES users(id),

    -- Source (gig or project)
    gig_id UUID REFERENCES gigs(id),
    gig_package_id UUID REFERENCES gig_packages(id),
    proposal_id UUID REFERENCES proposals(id),

    -- Details
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,

    -- Pricing
    amount DECIMAL(10,2) NOT NULL,
    platform_fee DECIMAL(10,2) NOT NULL,
    creator_earnings DECIMAL(10,2) NOT NULL,

    -- Timeline
    delivery_date DATE NOT NULL,
    delivered_at TIMESTAMP WITH TIME ZONE,
    approved_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,

    -- Revisions
    revisions_allowed INT DEFAULT 0,
    revisions_used INT DEFAULT 0,

    -- Status
    status VARCHAR(50) DEFAULT 'pending_payment',
    -- "pending_payment", "in_progress", "delivered", "revision_requested",
    -- "completed", "cancelled", "disputed"

    -- Deliverables
    deliverables TEXT[] DEFAULT '{}',

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_orders_client ON orders(client_id);
CREATE INDEX idx_orders_creator ON orders(creator_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_gig ON orders(gig_id);
```

**payments**:
```sql
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,

    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',

    -- Mollie
    mollie_payment_id VARCHAR(255) UNIQUE,
    mollie_checkout_url VARCHAR(500),

    status VARCHAR(50) DEFAULT 'pending',
    -- "pending", "paid", "failed", "expired", "cancelled", "refunded"

    paid_at TIMESTAMP WITH TIME ZONE,
    refunded_at TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_mollie_id ON payments(mollie_payment_id);
```

**transactions**:
```sql
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),

    type VARCHAR(50) NOT NULL,  -- "payment", "earning", "withdrawal", "refund", "fee"
    amount DECIMAL(10,2) NOT NULL,
    fee DECIMAL(10,2) DEFAULT 0.0,
    balance_after DECIMAL(10,2) NOT NULL,

    -- Reference
    reference_type VARCHAR(50),  -- "order", "payout"
    reference_id UUID,

    description TEXT,
    metadata JSONB DEFAULT '{}',

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_created ON transactions(created_at DESC);
```

**conversations**:
```sql
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    participant_ids UUID[] NOT NULL,

    -- Related to order/project (optional)
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,

    last_message_at TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_conversations_participants ON conversations USING GIN(participant_ids);
CREATE INDEX idx_conversations_order ON conversations(order_id);
```

**messages**:
```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id),

    content TEXT NOT NULL,
    attachment_url VARCHAR(500),

    -- Read tracking
    read_by UUID[] DEFAULT '{}',

    -- Editing
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMP WITH TIME ZONE,

    -- Soft delete
    is_deleted BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_sender ON messages(sender_id);
```

**reviews**:
```sql
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES users(id),  -- client
    reviewee_id UUID NOT NULL REFERENCES users(id),  -- creator

    -- Ratings
    rating DECIMAL(3,2) NOT NULL CHECK (rating >= 1 AND rating <= 5),
    communication_rating DECIMAL(3,2) CHECK (communication_rating >= 1 AND communication_rating <= 5),
    quality_rating DECIMAL(3,2) CHECK (quality_rating >= 1 AND quality_rating <= 5),
    timeliness_rating DECIMAL(3,2) CHECK (timeliness_rating >= 1 AND timeliness_rating <= 5),

    -- Content
    comment TEXT,

    -- Reply
    reply TEXT,
    reply_at TIMESTAMP WITH TIME ZONE,

    -- Moderation
    is_flagged BOOLEAN DEFAULT FALSE,
    helpful_count INT DEFAULT 0,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(order_id)  -- One review per order
);

CREATE INDEX idx_reviews_reviewee ON reviews(reviewee_id);
CREATE INDEX idx_reviews_order ON reviews(order_id);
```

**notifications**:
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    type VARCHAR(50) NOT NULL,
    -- "message", "order_update", "proposal_received", "payment_received", etc.

    title VARCHAR(255) NOT NULL,
    content TEXT,

    -- Link
    link_url VARCHAR(500),

    -- Related entities
    reference_type VARCHAR(50),
    reference_id UUID,

    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;
```

**uploads**:
```sql
CREATE TABLE uploads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),

    cloudinary_public_id VARCHAR(500) NOT NULL,
    cloudinary_url VARCHAR(500) NOT NULL,

    file_type VARCHAR(50) NOT NULL,  -- "video", "image", "document"
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100),

    -- Media dimensions
    width INT,
    height INT,
    duration INT,  -- seconds for videos

    -- Purpose
    purpose VARCHAR(50),  -- "portfolio", "gig_gallery", "deliverable", "avatar", etc.

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_uploads_user ON uploads(user_id);
CREATE INDEX idx_uploads_cloudinary_id ON uploads(cloudinary_public_id);
```

### 4.2 Database Migrations

Using **Alembic** for database migrations:

```bash
# Initialize Alembic
alembic init migrations

# Create migration
alembic revision --autogenerate -m "Create initial tables"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

---

## 5. Security & Best Practices

### 5.1 Password Security

**Implementation**:
```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
```

**Password Requirements**:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### 5.2 JWT Security

**Token Management**:
```python
from datetime import datetime, timedelta
from jose import JWTError, jwt
from app.core.config import settings

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def create_refresh_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
```

**Token Storage**:
- Access token: In memory (localStorage/state)
- Refresh token: httpOnly cookie (secure, sameSite: strict)

### 5.3 Input Validation

**Pydantic Schemas**:
```python
from pydantic import BaseModel, EmailStr, field_validator, Field
import re

class UserRegister(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8)

    @field_validator('username')
    def validate_username(cls, v):
        if not re.match(r'^[a-zA-Z0-9_-]+$', v):
            raise ValueError('Username can only contain letters, numbers, hyphens, and underscores')
        return v

    @field_validator('password')
    def validate_password(cls, v):
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one number')
        return v
```

### 5.4 SQL Injection Prevention

- Use SQLAlchemy ORM (parameterized queries)
- Never concatenate user input into SQL
- Use bound parameters for all queries

```python
# GOOD - Parameterized
user = await session.execute(
    select(User).where(User.email == email)
)

# BAD - String concatenation (DON'T DO THIS)
query = f"SELECT * FROM users WHERE email = '{email}'"
```

### 5.5 CORS Configuration

```python
ALLOWED_ORIGINS = [
    "https://reelbyte.com",
    "https://www.reelbyte.com",
]

# In development only
if settings.DEBUG:
    ALLOWED_ORIGINS.append("http://localhost:3000")
```

### 5.6 Error Handling

**Custom Exception Handler**:
```python
from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "validation_error",
            "message": "Invalid request data",
            "details": exc.errors()
        }
    )

class APIException(Exception):
    def __init__(self, status_code: int, error: str, message: str):
        self.status_code = status_code
        self.error = error
        self.message = message

@app.exception_handler(APIException)
async def api_exception_handler(request: Request, exc: APIException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.error,
            "message": exc.message
        }
    )
```

**Standard Error Response Format**:
```json
{
  "error": "error_code",
  "message": "Human-readable error message",
  "details": {}
}
```

### 5.7 File Upload Security

**Validations**:
- Check file type (MIME type)
- Limit file size
- Scan for malware (optional: ClamAV)
- Generate random filenames
- Store in cloud (Cloudinary)

```python
ALLOWED_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/x-msvideo"]
ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"]
MAX_VIDEO_SIZE = 500 * 1024 * 1024  # 500MB
MAX_IMAGE_SIZE = 10 * 1024 * 1024   # 10MB

def validate_upload(file: UploadFile, file_type: str):
    if file_type == "video":
        if file.content_type not in ALLOWED_VIDEO_TYPES:
            raise APIException(400, "invalid_file_type", "Invalid video format")
        if file.size > MAX_VIDEO_SIZE:
            raise APIException(400, "file_too_large", "Video exceeds 500MB limit")
    # Similar for images...
```

### 5.8 Environment Variables

**.env.example**:
```env
# App
DEBUG=False
ENVIRONMENT=production
SECRET_KEY=your-secret-key-here

# Database
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/reelbyte

# Redis
REDIS_URL=redis://localhost:6379/0

# Mollie
MOLLIE_API_KEY=your-mollie-api-key
MOLLIE_PARTNER_ID=your-partner-id

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email
SENDGRID_API_KEY=your-sendgrid-key
FROM_EMAIL=noreply@reelbyte.com

# Frontend
FRONTEND_URL=https://reelbyte.com
ALLOWED_ORIGINS=https://reelbyte.com,https://www.reelbyte.com
```

**Never commit .env file to version control!**

---

## 6. Third-party Integrations

### 6.1 Mollie Payment Integration

**Setup**:
```python
from mollie.api.client import Client

class MollieService:
    def __init__(self):
        self.client = Client()
        self.client.set_api_key(settings.MOLLIE_API_KEY)

    async def create_payment(
        self,
        amount: Decimal,
        description: str,
        order_id: UUID,
        redirect_url: str
    ):
        payment = self.client.payments.create({
            'amount': {
                'currency': 'EUR',
                'value': str(amount)
            },
            'description': description,
            'redirectUrl': redirect_url,
            'webhookUrl': f'{settings.API_URL}/v1/payments/webhook',
            'metadata': {
                'order_id': str(order_id)
            }
        })
        return payment

    async def get_payment(self, payment_id: str):
        return self.client.payments.get(payment_id)

    async def create_payout(self, creator_id: UUID, amount: Decimal):
        # Mollie Connect required for payouts
        # Implementation depends on Connect setup
        pass
```

**Webhook Handler**:
```python
@router.post("/webhook")
async def mollie_webhook(request: Request):
    form_data = await request.form()
    payment_id = form_data.get("id")

    mollie_service = MollieService()
    payment = await mollie_service.get_payment(payment_id)

    if payment.is_paid():
        # Update order status
        order_id = payment.metadata.get("order_id")
        await order_service.mark_as_paid(order_id)

    return {"status": "ok"}
```

### 6.2 Cloudinary Integration

**Setup**:
```python
import cloudinary
import cloudinary.uploader

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)

class CloudinaryService:
    async def upload_video(
        self,
        file: UploadFile,
        user_id: UUID,
        folder: str = "videos"
    ):
        result = cloudinary.uploader.upload(
            file.file,
            resource_type="video",
            folder=f"{folder}/{user_id}",
            eager=[
                {"width": 1280, "height": 720, "crop": "limit", "quality": "auto"},
                {"width": 640, "height": 360, "crop": "limit", "quality": "auto"}
            ],
            eager_async=True
        )
        return result

    async def upload_image(
        self,
        file: UploadFile,
        user_id: UUID,
        transformation: dict = None
    ):
        result = cloudinary.uploader.upload(
            file.file,
            folder=f"images/{user_id}",
            transformation=transformation
        )
        return result

    async def delete_file(self, public_id: str, resource_type: str = "image"):
        result = cloudinary.uploader.destroy(public_id, resource_type=resource_type)
        return result
```

### 6.3 Email Service (SendGrid)

**Setup**:
```python
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

class EmailService:
    def __init__(self):
        self.sg = SendGridAPIClient(settings.SENDGRID_API_KEY)

    async def send_email(
        self,
        to_email: str,
        subject: str,
        html_content: str
    ):
        message = Mail(
            from_email=settings.FROM_EMAIL,
            to_emails=to_email,
            subject=subject,
            html_content=html_content
        )

        try:
            response = self.sg.send(message)
            return response
        except Exception as e:
            # Log error
            raise

    async def send_verification_email(self, user_email: str, token: str):
        verification_url = f"{settings.FRONTEND_URL}/verify-email?token={token}"
        html_content = f"""
        <h1>Verify Your Email</h1>
        <p>Click the link below to verify your email address:</p>
        <a href="{verification_url}">Verify Email</a>
        """
        await self.send_email(user_email, "Verify Your ReelByte Account", html_content)

    async def send_order_notification(self, user_email: str, order_id: UUID):
        # Implementation...
        pass
```

**Email Templates** (using Jinja2):
```python
from jinja2 import Environment, FileSystemLoader

env = Environment(loader=FileSystemLoader("app/templates/emails"))

def render_email_template(template_name: str, context: dict) -> str:
    template = env.get_template(template_name)
    return template.render(**context)
```

---

## 7. Development Roadmap

### Phase 1: Foundation (Weeks 1-2)

- [ ] Set up project structure
- [ ] Configure FastAPI application
- [ ] Set up PostgreSQL 17 database
- [ ] Set up Redis
- [ ] Implement authentication system (JWT)
- [ ] Create user registration and login
- [ ] Set up Alembic migrations
- [ ] Basic error handling

### Phase 2: Core Features (Weeks 3-5)

- [ ] User profile management
- [ ] Category system
- [ ] Gig creation and management
- [ ] Gig listing and search
- [ ] Project posting system
- [ ] Proposal submission system
- [ ] File upload integration (Cloudinary)

### Phase 3: Payments (Weeks 6-7)

- [ ] Mollie integration
- [ ] Order creation flow
- [ ] Payment processing
- [ ] Escrow system
- [ ] Payout system
- [ ] Transaction history

### Phase 4: Communication (Week 8)

- [ ] Real-time messaging (WebSockets)
- [ ] Conversation management
- [ ] Notification system
- [ ] Email notifications

### Phase 5: Reviews & Discovery (Week 9)

- [ ] Review and rating system
- [ ] Advanced search and filtering
- [ ] User recommendations
- [ ] Featured gigs

### Phase 6: Admin & Analytics (Week 10)

- [ ] Admin dashboard
- [ ] User management
- [ ] Analytics and reporting
- [ ] Content moderation

### Phase 7: Testing & Optimization (Weeks 11-12)

- [ ] Unit tests
- [ ] Integration tests
- [ ] Load testing
- [ ] Performance optimization
- [ ] Security audit
- [ ] Documentation

### Phase 8: Deployment (Week 13)

- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Production deployment
- [ ] Monitoring and logging
- [ ] Backup strategy

---

## 8. Performance Optimization

### 8.1 Database Optimization

**Indexing Strategy**:
- Index all foreign keys
- Index frequently queried columns
- Use partial indexes for filtered queries
- Use GIN indexes for full-text search and array columns

**Query Optimization**:
- Use `select_related` for joins
- Implement pagination for large result sets
- Use database views for complex queries
- Cache expensive queries in Redis

**Connection Pooling**:
```python
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession

engine = create_async_engine(
    settings.DATABASE_URL,
    pool_size=20,
    max_overflow=40,
    pool_pre_ping=True,
    echo=settings.DEBUG
)
```

### 8.2 Caching Strategy

**Redis Caching**:
```python
import redis.asyncio as redis
import json
from typing import Optional

class CacheService:
    def __init__(self):
        self.redis = redis.from_url(settings.REDIS_URL)

    async def get(self, key: str) -> Optional[dict]:
        value = await self.redis.get(key)
        return json.loads(value) if value else None

    async def set(self, key: str, value: dict, ttl: int = 3600):
        await self.redis.set(key, json.dumps(value), ex=ttl)

    async def delete(self, key: str):
        await self.redis.delete(key)
```

**Cache Patterns**:
- User profiles: 1 hour TTL
- Gig listings: 15 minutes TTL
- Search results: 5 minutes TTL
- Categories: 24 hours TTL

### 8.3 API Response Optimization

**Pagination**:
```python
from typing import Generic, TypeVar, List
from pydantic import BaseModel

T = TypeVar('T')

class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    page_size: int
    total_pages: int

async def paginate(
    query,
    page: int = 1,
    page_size: int = 20
) -> PaginatedResponse:
    total = await session.scalar(select(func.count()).select_from(query))
    items = await session.execute(
        query.offset((page - 1) * page_size).limit(page_size)
    )

    return PaginatedResponse(
        items=items.scalars().all(),
        total=total,
        page=page,
        page_size=page_size,
        total_pages=(total + page_size - 1) // page_size
    )
```

---

## 9. Monitoring & Logging

### 9.1 Logging

**Setup**:
```python
import logging
from pythonjsonlogger import jsonlogger

logger = logging.getLogger()
handler = logging.StreamHandler()
formatter = jsonlogger.JsonFormatter()
handler.setFormatter(formatter)
logger.addHandler(handler)
logger.setLevel(logging.INFO)
```

**Log Levels**:
- ERROR: System errors, exceptions
- WARNING: Deprecated features, unusual behavior
- INFO: Important events (user registration, payments)
- DEBUG: Detailed information for debugging

### 9.2 Error Tracking

**Sentry Integration** (recommended):
```python
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

sentry_sdk.init(
    dsn=settings.SENTRY_DSN,
    integrations=[FastApiIntegration()],
    environment=settings.ENVIRONMENT,
    traces_sample_rate=0.1
)
```

### 9.3 Metrics

**Prometheus Integration**:
- Request count
- Response time
- Error rate
- Active users
- Database connections
- Redis cache hit rate

---

## 10. Testing Strategy

### 10.1 Unit Tests

```python
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_register_user():
    response = client.post("/v1/auth/register", json={
        "email": "test@example.com",
        "username": "testuser",
        "password": "Test1234!"
    })
    assert response.status_code == 201
    assert "id" in response.json()
```

### 10.2 Integration Tests

Test complete workflows:
- User registration → email verification → login
- Create gig → browse gigs → order gig → payment → delivery
- Post project → submit proposal → accept proposal → payment

### 10.3 Test Coverage

Aim for:
- 80%+ overall code coverage
- 100% coverage for critical paths (auth, payments)
- All API endpoints tested
- All service functions tested

---

## Conclusion

This backend architecture plan provides a comprehensive roadmap for building ReelByte, a modern freelancer marketplace for video content creators. The architecture is designed to be:

- **Scalable**: Horizontal scaling with load balancers, database replicas
- **Secure**: Industry-standard security practices (JWT, bcrypt, input validation)
- **Maintainable**: Clean architecture with separation of concerns
- **Modern**: Latest technologies (FastAPI 0.115+, PostgreSQL 17, UV)
- **Performant**: Caching, indexing, query optimization

**Next Steps**:
1. Set up development environment
2. Initialize project structure
3. Configure database and migrations
4. Implement authentication system
5. Build core features iteratively
6. Test thoroughly at each phase
7. Deploy to production with monitoring

**Estimated Timeline**: 13 weeks for MVP
**Team Size**: 2-3 backend developers

---

**Document Version**: 1.0
**Last Updated**: November 2025
**Maintained By**: ReelByte Engineering Team
