"""
Gig (service listing) schemas for pre-packaged creator services.
"""

from datetime import datetime
from decimal import Decimal
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Field, HttpUrl, ConfigDict, field_validator


# ============================================================================
# Gig Package Schemas
# ============================================================================

class GigPackageBase(BaseModel):
    """Base schema for gig pricing packages."""

    name: str = Field(..., description="Package name (Basic, Standard, Premium)")
    description: str = Field(..., min_length=10, max_length=500, description="Package description")
    price: Decimal = Field(..., gt=0, decimal_places=2, description="Package price in USD")
    delivery_days: int = Field(..., ge=1, le=90, description="Delivery time in days")
    revisions: int = Field(default=0, ge=0, le=10, description="Number of revisions included")


class GigPackageCreate(GigPackageBase):
    """Schema for creating a gig package."""
    pass


class GigPackageResponse(GigPackageBase):
    """Schema for gig package response."""

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# Gig Schemas
# ============================================================================

class GigCreate(BaseModel):
    """Schema for creating a gig."""

    title: str = Field(..., min_length=10, max_length=200, description="Gig title")
    description: str = Field(..., min_length=50, max_length=5000, description="Detailed gig description")

    # Pricing Tiers - Basic is required
    basic_price: Decimal = Field(..., gt=0, decimal_places=2, description="Basic package price")
    basic_description: str = Field(..., min_length=10, max_length=500, description="Basic package description")
    basic_delivery_days: int = Field(..., ge=1, le=90, description="Basic delivery days")
    basic_revisions: int = Field(default=0, ge=0, le=10, description="Basic revisions")

    # Standard package (optional)
    standard_price: Optional[Decimal] = Field(None, gt=0, decimal_places=2, description="Standard package price")
    standard_description: Optional[str] = Field(None, min_length=10, max_length=500, description="Standard package description")
    standard_delivery_days: Optional[int] = Field(None, ge=1, le=90, description="Standard delivery days")
    standard_revisions: Optional[int] = Field(None, ge=0, le=10, description="Standard revisions")

    # Premium package (optional)
    premium_price: Optional[Decimal] = Field(None, gt=0, decimal_places=2, description="Premium package price")
    premium_description: Optional[str] = Field(None, min_length=10, max_length=500, description="Premium package description")
    premium_delivery_days: Optional[int] = Field(None, ge=1, le=90, description="Premium delivery days")
    premium_revisions: Optional[int] = Field(None, ge=0, le=10, description="Premium revisions")

    # Details
    category: str = Field(..., min_length=2, max_length=50, description="Main category")
    subcategory: Optional[str] = Field(None, max_length=50, description="Subcategory")
    video_type: Optional[str] = Field(None, max_length=50, description="Video type (Reel, Short, TikTok, etc.)")

    # Media
    thumbnail_url: Optional[HttpUrl] = Field(None, description="Gig thumbnail image URL")
    video_samples: Optional[List[HttpUrl]] = Field(None, max_length=5, description="Sample video URLs (max 5)")

    # Requirements
    requirements: Optional[str] = Field(None, max_length=2000, description="What you need from the buyer")

    # SEO
    search_tags: Optional[List[str]] = Field(None, max_length=10, description="Search tags (max 10)")

    @field_validator("search_tags")
    @classmethod
    def validate_search_tags(cls, v: Optional[List[str]]) -> Optional[List[str]]:
        """Validate and clean search tags."""
        if v:
            # Remove duplicates and clean
            cleaned = list(set(tag.lower().strip() for tag in v if tag.strip()))
            if len(cleaned) > 10:
                raise ValueError("Maximum 10 search tags allowed")
            return cleaned
        return v


class GigUpdate(BaseModel):
    """Schema for updating a gig."""

    title: Optional[str] = Field(None, min_length=10, max_length=200)
    description: Optional[str] = Field(None, min_length=50, max_length=5000)

    # Basic package
    basic_price: Optional[Decimal] = Field(None, gt=0, decimal_places=2)
    basic_description: Optional[str] = Field(None, min_length=10, max_length=500)
    basic_delivery_days: Optional[int] = Field(None, ge=1, le=90)
    basic_revisions: Optional[int] = Field(None, ge=0, le=10)

    # Standard package
    standard_price: Optional[Decimal] = Field(None, gt=0, decimal_places=2)
    standard_description: Optional[str] = Field(None, min_length=10, max_length=500)
    standard_delivery_days: Optional[int] = Field(None, ge=1, le=90)
    standard_revisions: Optional[int] = Field(None, ge=0, le=10)

    # Premium package
    premium_price: Optional[Decimal] = Field(None, gt=0, decimal_places=2)
    premium_description: Optional[str] = Field(None, min_length=10, max_length=500)
    premium_delivery_days: Optional[int] = Field(None, ge=1, le=90)
    premium_revisions: Optional[int] = Field(None, ge=0, le=10)

    # Details
    category: Optional[str] = Field(None, min_length=2, max_length=50)
    subcategory: Optional[str] = Field(None, max_length=50)
    video_type: Optional[str] = Field(None, max_length=50)

    # Media
    thumbnail_url: Optional[HttpUrl] = None
    video_samples: Optional[List[HttpUrl]] = Field(None, max_length=5)

    # Requirements
    requirements: Optional[str] = Field(None, max_length=2000)

    # Status
    status: Optional[str] = None

    # SEO
    search_tags: Optional[List[str]] = Field(None, max_length=10)

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: Optional[str]) -> Optional[str]:
        """Validate gig status."""
        if v is not None:
            allowed_statuses = {"draft", "active", "paused", "deleted"}
            if v not in allowed_statuses:
                raise ValueError(f"status must be one of: {', '.join(allowed_statuses)}")
        return v

    @field_validator("search_tags")
    @classmethod
    def validate_search_tags(cls, v: Optional[List[str]]) -> Optional[List[str]]:
        """Validate and clean search tags."""
        if v:
            cleaned = list(set(tag.lower().strip() for tag in v if tag.strip()))
            if len(cleaned) > 10:
                raise ValueError("Maximum 10 search tags allowed")
            return cleaned
        return v


class GigResponse(BaseModel):
    """Schema for gig response."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    creator_profile_id: UUID
    title: str
    slug: str
    description: str

    # Basic package
    basic_price: Decimal
    basic_description: Optional[str]
    basic_delivery_days: int
    basic_revisions: int

    # Standard package
    standard_price: Optional[Decimal]
    standard_description: Optional[str]
    standard_delivery_days: Optional[int]
    standard_revisions: Optional[int]

    # Premium package
    premium_price: Optional[Decimal]
    premium_description: Optional[str]
    premium_delivery_days: Optional[int]
    premium_revisions: Optional[int]

    # Details
    category: str
    subcategory: Optional[str]
    video_type: Optional[str]

    # Media
    thumbnail_url: Optional[str]
    video_samples: Optional[List[str]]

    # Requirements
    requirements: Optional[str]

    # Stats
    view_count: int
    order_count: int
    favorite_count: int

    # Status
    status: str

    # SEO
    search_tags: Optional[List[str]]

    # Metadata
    created_at: datetime
    updated_at: datetime
    published_at: Optional[datetime]


class GigListResponse(BaseModel):
    """Schema for gig list item (summary view)."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    creator_profile_id: UUID
    title: str
    slug: str
    category: str
    video_type: Optional[str]
    thumbnail_url: Optional[str]
    basic_price: Decimal
    view_count: int
    order_count: int
    status: str
    created_at: datetime


# ============================================================================
# Gig Search & Filter Schemas
# ============================================================================

class GigSearchFilters(BaseModel):
    """Schema for filtering gig search results."""

    # Search query
    search_query: Optional[str] = Field(None, description="Text search in title, description, tags")

    # Filters
    category: Optional[str] = Field(None, description="Filter by category")
    subcategory: Optional[str] = Field(None, description="Filter by subcategory")
    video_type: Optional[str] = Field(None, description="Filter by video type")

    # Price range
    min_price: Optional[Decimal] = Field(None, ge=0, description="Minimum price")
    max_price: Optional[Decimal] = Field(None, ge=0, description="Maximum price")

    # Delivery time
    max_delivery_days: Optional[int] = Field(None, ge=1, description="Maximum delivery days")

    # Creator filters
    verified_creators_only: bool = Field(default=False, description="Show only verified creators")
    min_creator_rating: Optional[Decimal] = Field(None, ge=0, le=5, description="Minimum creator rating")

    # Tags
    tags: Optional[List[str]] = Field(None, description="Filter by tags (OR logic)")

    # Pagination
    page: int = Field(default=1, ge=1, description="Page number")
    page_size: int = Field(default=20, ge=1, le=100, description="Items per page")

    # Sorting
    sort_by: str = Field(default="relevance", description="Sort field")
    sort_order: str = Field(default="desc", description="Sort order: asc or desc")

    @field_validator("sort_by")
    @classmethod
    def validate_sort_by(cls, v: str) -> str:
        """Validate sort field."""
        allowed_fields = {"relevance", "price", "popularity", "created_at", "rating"}
        if v not in allowed_fields:
            raise ValueError(f"sort_by must be one of: {', '.join(allowed_fields)}")
        return v

    @field_validator("sort_order")
    @classmethod
    def validate_sort_order(cls, v: str) -> str:
        """Validate sort order."""
        if v not in {"asc", "desc"}:
            raise ValueError("sort_order must be 'asc' or 'desc'")
        return v


# ============================================================================
# Gig Order Schemas
# ============================================================================

class GigOrderCreate(BaseModel):
    """Schema for ordering a gig."""

    gig_id: UUID = Field(..., description="Gig ID to order")
    package_tier: str = Field(..., description="Package tier: basic, standard, or premium")
    requirements_response: Optional[str] = Field(None, max_length=2000, description="Response to gig requirements")

    @field_validator("package_tier")
    @classmethod
    def validate_package_tier(cls, v: str) -> str:
        """Validate package tier."""
        allowed_tiers = {"basic", "standard", "premium"}
        if v not in allowed_tiers:
            raise ValueError(f"package_tier must be one of: {', '.join(allowed_tiers)}")
        return v
