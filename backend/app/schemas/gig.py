"""
Gig (service listing) schemas for pre-packaged creator services.
"""

from datetime import datetime
from decimal import Decimal
from enum import Enum
from typing import List, Optional, Dict, Any
from uuid import UUID

from pydantic import BaseModel, Field, HttpUrl, ConfigDict, field_validator, computed_field


class CreatorSummary(BaseModel):
    """Simplified creator info for gig listings."""

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: UUID
    user_id: UUID = Field(alias="userId")
    display_name: str
    username: Optional[str] = None  # Alias for display_name
    tagline: Optional[str]
    profile_image_url: Optional[str] = Field(None, alias="profileImageUrl")
    avatar: Optional[str] = None  # Alias for profile_image_url
    average_rating: Decimal = Field(alias="averageRating")
    rating: Optional[Decimal] = None  # Alias for average_rating
    total_reviews: int = Field(alias="totalReviews")
    reviewCount: Optional[int] = None  # Alias for total_reviews
    total_jobs_completed: int = Field(alias="totalJobsCompleted")
    completedProjects: Optional[int] = None  # Alias for total_jobs_completed
    is_verified: bool = Field(alias="isVerified")
    response_time_hours: Optional[int] = Field(None, alias="responseTimeHours")
    level: str = "level1"  # Default level for now

    def model_post_init(self, __context):
        """Set aliases after initialization."""
        if self.display_name and not self.username:
            self.username = self.display_name
        if self.profile_image_url and not self.avatar:
            self.avatar = self.profile_image_url
        if self.average_rating and not self.rating:
            self.rating = self.average_rating
        if self.total_reviews and not self.reviewCount:
            self.reviewCount = self.total_reviews
        if self.total_jobs_completed and not self.completedProjects:
            self.completedProjects = self.total_jobs_completed


class GigStatus(str, Enum):
    """Gig status enum."""
    active = "active"
    paused = "paused"
    draft = "draft"


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
    creator: CreatorSummary
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
    thumbnail: Optional[str] = None  # Alias for thumbnail_url
    video_samples: Optional[List[str]]
    videos: Optional[List[str]] = None  # Alias for video_samples

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
    tags: Optional[List[str]] = None  # Alias for search_tags

    # Metadata
    created_at: datetime
    updated_at: datetime
    published_at: Optional[datetime]

    def model_post_init(self, __context):
        """Set aliases after initialization."""
        # Set thumbnail alias with placeholder if None
        if self.thumbnail_url:
            self.thumbnail = self.thumbnail_url
        else:
            # Use placeholder image if no thumbnail provided
            self.thumbnail = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80"
            self.thumbnail_url = self.thumbnail

        if self.video_samples and not self.videos:
            self.videos = self.video_samples
        if self.search_tags and not self.tags:
            self.tags = self.search_tags
        # Set empty arrays if None to prevent frontend errors
        if self.videos is None:
            self.videos = []
        if self.video_samples is None:
            self.video_samples = []
        if self.tags is None:
            self.tags = []
        if self.search_tags is None:
            self.search_tags = []

    @computed_field
    @property
    def packages(self) -> List[Dict[str, Any]]:
        """Build packages array from individual price fields for frontend compatibility."""
        pkgs = []

        # Always include basic package
        pkgs.append({
            "type": "basic",
            "name": "Basic",
            "description": self.basic_description or "",
            "price": float(self.basic_price),
            "deliveryTime": self.basic_delivery_days,
            "revisions": self.basic_revisions,
            "features": []
        })

        # Include standard package if defined
        if self.standard_price is not None:
            pkgs.append({
                "type": "standard",
                "name": "Standard",
                "description": self.standard_description or "",
                "price": float(self.standard_price),
                "deliveryTime": self.standard_delivery_days or 0,
                "revisions": self.standard_revisions or 0,
                "features": []
            })

        # Include premium package if defined
        if self.premium_price is not None:
            pkgs.append({
                "type": "premium",
                "name": "Premium",
                "description": self.premium_description or "",
                "price": float(self.premium_price),
                "deliveryTime": self.premium_delivery_days or 0,
                "revisions": self.premium_revisions or 0,
                "features": []
            })

        return pkgs


class GigSummary(BaseModel):
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


class GigsListResponse(BaseModel):
    """Response for gigs list with pagination."""
    gigs: List[GigResponse]
    total: int
    skip: int
    limit: int
    has_more: bool


# ============================================================================
# Gig Search & Filter Schemas
# ============================================================================

class GigSearchFilters(BaseModel):
    """Schema for filtering gig search results."""

    # Search query
    search: Optional[str] = Field(None, description="Text search in title, description, tags")

    # Filters
    category: Optional[str] = Field(None, description="Filter by category")
    subcategory: Optional[str] = Field(None, description="Filter by subcategory")
    video_type: Optional[str] = Field(None, description="Filter by video type")
    status: Optional[GigStatus] = Field(None, description="Filter by gig status")
    creator_profile_id: Optional[UUID] = Field(None, description="Filter by creator profile")

    # Price range
    min_price: Optional[float] = Field(None, ge=0, description="Minimum price")
    max_price: Optional[float] = Field(None, ge=0, description="Maximum price")

    # Tags
    tags: Optional[List[str]] = Field(None, description="Filter by tags (OR logic)")

    # Pagination
    skip: int = Field(default=0, ge=0, description="Number of records to skip")
    limit: int = Field(default=20, ge=1, le=100, description="Number of records to return")

    # Sorting
    sort_by: str = Field(default="created_at", description="Sort field")
    sort_order: str = Field(default="desc", description="Sort order: asc or desc")

    @field_validator("sort_by")
    @classmethod
    def validate_sort_by(cls, v: str) -> str:
        """Validate sort field."""
        allowed_fields = {"created_at", "price", "popularity", "views"}
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
