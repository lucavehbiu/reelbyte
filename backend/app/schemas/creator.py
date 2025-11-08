"""
Creator profile schemas for video content creators.
"""

from datetime import datetime
from decimal import Decimal
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Field, HttpUrl, ConfigDict, field_validator


# ============================================================================
# Creator Profile Schemas
# ============================================================================

class CreatorProfileCreate(BaseModel):
    """Schema for creating a creator profile."""

    display_name: str = Field(..., min_length=2, max_length=100, description="Public display name")
    tagline: Optional[str] = Field(None, max_length=200, description="Brief professional tagline")
    bio: Optional[str] = Field(None, max_length=2000, description="Detailed biography")
    profile_image_url: Optional[HttpUrl] = Field(None, description="Profile image URL")
    cover_image_url: Optional[HttpUrl] = Field(None, description="Cover image URL")
    portfolio_video_url: Optional[HttpUrl] = Field(None, description="Portfolio showcase video URL")

    # Professional Info
    years_of_experience: Optional[int] = Field(None, ge=0, le=50, description="Years of experience")
    hourly_rate: Optional[Decimal] = Field(None, ge=0, decimal_places=2, description="Hourly rate in USD")
    availability_status: str = Field(default="available", description="Availability status")
    response_time_hours: Optional[int] = Field(None, ge=1, description="Average response time in hours")

    # Social Links
    instagram_handle: Optional[str] = Field(None, max_length=100, description="Instagram username (without @)")
    tiktok_handle: Optional[str] = Field(None, max_length=100, description="TikTok username (without @)")
    youtube_channel: Optional[str] = Field(None, max_length=255, description="YouTube channel URL or handle")
    website_url: Optional[HttpUrl] = Field(None, description="Personal website URL")

    @field_validator("availability_status")
    @classmethod
    def validate_availability_status(cls, v: str) -> str:
        """Validate availability status."""
        allowed_statuses = {"available", "busy", "unavailable"}
        if v not in allowed_statuses:
            raise ValueError(f"availability_status must be one of: {', '.join(allowed_statuses)}")
        return v

    @field_validator("instagram_handle", "tiktok_handle")
    @classmethod
    def validate_social_handle(cls, v: Optional[str]) -> Optional[str]:
        """Remove @ symbol if present."""
        if v:
            return v.lstrip("@")
        return v


class CreatorProfileUpdate(BaseModel):
    """Schema for updating a creator profile."""

    display_name: Optional[str] = Field(None, min_length=2, max_length=100)
    tagline: Optional[str] = Field(None, max_length=200)
    bio: Optional[str] = Field(None, max_length=2000)
    profile_image_url: Optional[HttpUrl] = None
    cover_image_url: Optional[HttpUrl] = None
    portfolio_video_url: Optional[HttpUrl] = None

    # Professional Info
    years_of_experience: Optional[int] = Field(None, ge=0, le=50)
    hourly_rate: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    availability_status: Optional[str] = None
    response_time_hours: Optional[int] = Field(None, ge=1)

    # Social Links
    instagram_handle: Optional[str] = Field(None, max_length=100)
    tiktok_handle: Optional[str] = Field(None, max_length=100)
    youtube_channel: Optional[str] = Field(None, max_length=255)
    website_url: Optional[HttpUrl] = None

    @field_validator("availability_status")
    @classmethod
    def validate_availability_status(cls, v: Optional[str]) -> Optional[str]:
        """Validate availability status."""
        if v is not None:
            allowed_statuses = {"available", "busy", "unavailable"}
            if v not in allowed_statuses:
                raise ValueError(f"availability_status must be one of: {', '.join(allowed_statuses)}")
        return v

    @field_validator("instagram_handle", "tiktok_handle")
    @classmethod
    def validate_social_handle(cls, v: Optional[str]) -> Optional[str]:
        """Remove @ symbol if present."""
        if v:
            return v.lstrip("@")
        return v


class CreatorProfileResponse(BaseModel):
    """Schema for creator profile response."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    display_name: str
    tagline: Optional[str]
    bio: Optional[str]
    profile_image_url: Optional[str]
    cover_image_url: Optional[str]
    portfolio_video_url: Optional[str]

    # Professional Info
    years_of_experience: Optional[int]
    hourly_rate: Optional[Decimal]
    availability_status: str
    response_time_hours: Optional[int]

    # Statistics
    total_jobs_completed: int
    total_earnings: Decimal
    success_rate: Decimal
    on_time_delivery_rate: Decimal
    average_rating: Decimal
    total_reviews: int

    # Verification
    is_verified: bool
    verification_level: Optional[str]
    verified_at: Optional[datetime]

    # Social Links
    instagram_handle: Optional[str]
    tiktok_handle: Optional[str]
    youtube_channel: Optional[str]
    website_url: Optional[str]

    # Metadata
    created_at: datetime
    updated_at: datetime


class CreatorPublicProfile(BaseModel):
    """Schema for public creator profile (limited information)."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    display_name: str
    tagline: Optional[str]
    profile_image_url: Optional[str]
    availability_status: str
    average_rating: Decimal
    total_reviews: int
    total_jobs_completed: int
    is_verified: bool
    created_at: datetime


# ============================================================================
# Creator Skills Schemas
# ============================================================================

class CreatorSkillCreate(BaseModel):
    """Schema for adding a skill to creator profile."""

    skill_name: str = Field(..., min_length=2, max_length=50, description="Skill name")
    proficiency_level: str = Field(..., description="Proficiency level")
    years_experience: Optional[int] = Field(None, ge=0, le=50, description="Years of experience with this skill")

    @field_validator("proficiency_level")
    @classmethod
    def validate_proficiency_level(cls, v: str) -> str:
        """Validate proficiency level."""
        allowed_levels = {"beginner", "intermediate", "expert"}
        if v not in allowed_levels:
            raise ValueError(f"proficiency_level must be one of: {', '.join(allowed_levels)}")
        return v


class CreatorSkillResponse(BaseModel):
    """Schema for creator skill response."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    creator_profile_id: UUID
    skill_name: str
    proficiency_level: str
    years_experience: Optional[int]
    created_at: datetime


# ============================================================================
# Creator Categories Schemas
# ============================================================================

class CreatorCategoryCreate(BaseModel):
    """Schema for adding a category to creator profile."""

    category: str = Field(..., min_length=2, max_length=50, description="Content category/niche")
    is_primary: bool = Field(default=False, description="Whether this is the primary category")


class CreatorCategoryResponse(BaseModel):
    """Schema for creator category response."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    creator_profile_id: UUID
    category: str
    is_primary: bool
    created_at: datetime


# ============================================================================
# Portfolio Items Schemas
# ============================================================================

class PortfolioItemCreate(BaseModel):
    """Schema for creating a portfolio item."""

    title: str = Field(..., min_length=2, max_length=200, description="Portfolio item title")
    description: Optional[str] = Field(None, max_length=1000, description="Item description")
    video_url: HttpUrl = Field(..., description="Video URL")
    thumbnail_url: Optional[HttpUrl] = Field(None, description="Thumbnail image URL")
    video_duration_seconds: Optional[int] = Field(None, ge=1, description="Video duration in seconds")

    # Project Context
    project_type: Optional[str] = Field(None, max_length=50, description="Type of project")
    platform: Optional[str] = Field(None, max_length=50, description="Target platform (TikTok, Instagram, etc.)")

    # Display
    display_order: int = Field(default=0, description="Display order (lower = shown first)")
    is_featured: bool = Field(default=False, description="Whether to feature this item")


class PortfolioItemUpdate(BaseModel):
    """Schema for updating a portfolio item."""

    title: Optional[str] = Field(None, min_length=2, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    video_url: Optional[HttpUrl] = None
    thumbnail_url: Optional[HttpUrl] = None
    video_duration_seconds: Optional[int] = Field(None, ge=1)
    project_type: Optional[str] = Field(None, max_length=50)
    platform: Optional[str] = Field(None, max_length=50)
    display_order: Optional[int] = None
    is_featured: Optional[bool] = None


class PortfolioItemResponse(BaseModel):
    """Schema for portfolio item response."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    creator_profile_id: UUID
    title: str
    description: Optional[str]
    video_url: str
    thumbnail_url: Optional[str]
    video_duration_seconds: Optional[int]
    view_count: int
    like_count: int
    project_type: Optional[str]
    platform: Optional[str]
    display_order: int
    is_featured: bool
    created_at: datetime
    updated_at: datetime


# ============================================================================
# Creator Search & Filter Schemas
# ============================================================================

class CreatorSearchFilters(BaseModel):
    """Schema for filtering creator search results."""

    # Search query
    search_query: Optional[str] = Field(None, description="Text search in name, bio, skills")

    # Filters
    categories: Optional[List[str]] = Field(None, description="Filter by categories")
    skills: Optional[List[str]] = Field(None, description="Filter by skills")
    availability_status: Optional[List[str]] = Field(None, description="Filter by availability")

    # Rating & Experience
    min_rating: Optional[Decimal] = Field(None, ge=0, le=5, description="Minimum average rating")
    min_jobs_completed: Optional[int] = Field(None, ge=0, description="Minimum jobs completed")
    min_years_experience: Optional[int] = Field(None, ge=0, description="Minimum years of experience")

    # Budget
    max_hourly_rate: Optional[Decimal] = Field(None, ge=0, description="Maximum hourly rate")

    # Verification
    verified_only: bool = Field(default=False, description="Show only verified creators")

    # Pagination
    page: int = Field(default=1, ge=1, description="Page number")
    page_size: int = Field(default=20, ge=1, le=100, description="Items per page")

    # Sorting
    sort_by: str = Field(default="rating", description="Sort field")
    sort_order: str = Field(default="desc", description="Sort order: asc or desc")

    @field_validator("sort_by")
    @classmethod
    def validate_sort_by(cls, v: str) -> str:
        """Validate sort field."""
        allowed_fields = {"rating", "jobs_completed", "created_at", "hourly_rate"}
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
