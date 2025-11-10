"""Main API v1 router that includes all endpoint modules."""

from fastapi import APIRouter
from app.api.v1 import auth, gigs, projects, clients

# Create main v1 router
api_router = APIRouter()

# Placeholder routes - these will be implemented in separate modules
# and included here as the application grows

# Health check endpoint
@api_router.get("/health", tags=["health"])
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "reelbyte-api",
        "version": "1.0.0"
    }


# Authentication endpoints
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])

# User endpoints
# api_router.include_router(users.router, prefix="/users", tags=["users"])

# Gig endpoints
api_router.include_router(gigs.router, prefix="/gigs", tags=["gigs"])

# Project endpoints
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])

# Client endpoints
api_router.include_router(clients.router, prefix="/clients", tags=["clients"])

# Proposal endpoints
# api_router.include_router(proposals.router, prefix="/proposals", tags=["proposals"])

# Order endpoints
# api_router.include_router(orders.router, prefix="/orders", tags=["orders"])

# Payment endpoints
# api_router.include_router(payments.router, prefix="/payments", tags=["payments"])

# Message endpoints
# api_router.include_router(messages.router, prefix="/messages", tags=["messages"])
# api_router.include_router(conversations.router, prefix="/conversations", tags=["conversations"])

# Review endpoints
# api_router.include_router(reviews.router, prefix="/reviews", tags=["reviews"])

# Search endpoints
# api_router.include_router(search.router, prefix="/search", tags=["search"])

# Upload endpoints
# api_router.include_router(uploads.router, prefix="/uploads", tags=["uploads"])

# Category endpoints
# api_router.include_router(categories.router, prefix="/categories", tags=["categories"])

# Notification endpoints
# api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])

# Admin endpoints
# api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
