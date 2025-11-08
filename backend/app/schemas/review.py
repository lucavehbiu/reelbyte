"""
Review and rating schemas for creator and client reviews.
"""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field, ConfigDict, field_validator


# ============================================================================
# Review Schemas
# ============================================================================

class ReviewCreate(BaseModel):
    """Schema for creating a review."""

    contract_id: UUID = Field(..., description="Contract ID being reviewed")

    # Rating (required)
    overall_rating: int = Field(..., ge=1, le=5, description="Overall rating (1-5 stars)")

    # Detailed Ratings (optional)
    communication_rating: Optional[int] = Field(None, ge=1, le=5, description="Communication rating (1-5)")
    quality_rating: Optional[int] = Field(None, ge=1, le=5, description="Quality rating (1-5)")
    professionalism_rating: Optional[int] = Field(None, ge=1, le=5, description="Professionalism rating (1-5)")
    value_rating: Optional[int] = Field(None, ge=1, le=5, description="Value for money rating (1-5)")

    # Review Text
    title: Optional[str] = Field(None, max_length=200, description="Review title/summary")
    comment: Optional[str] = Field(None, max_length=2000, description="Detailed review comment")

    # Visibility
    is_public: bool = Field(default=True, description="Whether review is publicly visible")


class ReviewUpdate(BaseModel):
    """Schema for updating a review."""

    # Rating
    overall_rating: Optional[int] = Field(None, ge=1, le=5)
    communication_rating: Optional[int] = Field(None, ge=1, le=5)
    quality_rating: Optional[int] = Field(None, ge=1, le=5)
    professionalism_rating: Optional[int] = Field(None, ge=1, le=5)
    value_rating: Optional[int] = Field(None, ge=1, le=5)

    # Review Text
    title: Optional[str] = Field(None, max_length=200)
    comment: Optional[str] = Field(None, max_length=2000)

    # Visibility
    is_public: Optional[bool] = None


class ReviewResponse(BaseModel):
    """Schema for review response."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    contract_id: UUID
    reviewer_user_id: UUID
    reviewee_user_id: UUID
    reviewer_type: str

    # Rating
    overall_rating: int
    communication_rating: Optional[int]
    quality_rating: Optional[int]
    professionalism_rating: Optional[int]
    value_rating: Optional[int]

    # Review Text
    title: Optional[str]
    comment: Optional[str]

    # Response
    response_text: Optional[str]
    response_at: Optional[datetime]

    # Status
    is_public: bool
    is_featured: bool
    flagged: bool

    # Metadata
    created_at: datetime
    updated_at: datetime


class ReviewListResponse(BaseModel):
    """Schema for review list item (summary view)."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    reviewer_user_id: UUID
    reviewee_user_id: UUID
    reviewer_type: str
    overall_rating: int
    title: Optional[str]
    created_at: datetime


# ============================================================================
# Review Response (Reply) Schemas
# ============================================================================

class ReviewResponseCreate(BaseModel):
    """Schema for responding to a review."""

    response_text: str = Field(..., min_length=10, max_length=1000, description="Response to the review")


class ReviewResponseUpdate(BaseModel):
    """Schema for updating a review response."""

    response_text: str = Field(..., min_length=10, max_length=1000, description="Updated response")


# ============================================================================
# Review Statistics Schemas
# ============================================================================

class ReviewStatistics(BaseModel):
    """Schema for review statistics."""

    total_reviews: int = Field(..., description="Total number of reviews")
    average_rating: float = Field(..., ge=0, le=5, description="Average overall rating")

    # Rating breakdown
    rating_5_count: int = Field(default=0, description="Number of 5-star reviews")
    rating_4_count: int = Field(default=0, description="Number of 4-star reviews")
    rating_3_count: int = Field(default=0, description="Number of 3-star reviews")
    rating_2_count: int = Field(default=0, description="Number of 2-star reviews")
    rating_1_count: int = Field(default=0, description="Number of 1-star reviews")

    # Detailed ratings averages
    average_communication_rating: Optional[float] = Field(None, ge=0, le=5)
    average_quality_rating: Optional[float] = Field(None, ge=0, le=5)
    average_professionalism_rating: Optional[float] = Field(None, ge=0, le=5)
    average_value_rating: Optional[float] = Field(None, ge=0, le=5)


# ============================================================================
# Review Filter Schemas
# ============================================================================

class ReviewFilters(BaseModel):
    """Schema for filtering reviews."""

    # Filter by rating
    min_rating: Optional[int] = Field(None, ge=1, le=5, description="Minimum rating")
    max_rating: Optional[int] = Field(None, ge=1, le=5, description="Maximum rating")
    specific_rating: Optional[int] = Field(None, ge=1, le=5, description="Specific rating value")

    # Filter by user
    reviewee_user_id: Optional[UUID] = Field(None, description="User being reviewed")
    reviewer_user_id: Optional[UUID] = Field(None, description="User who wrote review")
    reviewer_type: Optional[str] = Field(None, description="Reviewer type: client or creator")

    # Filter by status
    is_public_only: bool = Field(default=True, description="Show only public reviews")
    featured_only: bool = Field(default=False, description="Show only featured reviews")

    # Pagination
    page: int = Field(default=1, ge=1, description="Page number")
    page_size: int = Field(default=20, ge=1, le=100, description="Items per page")

    # Sorting
    sort_by: str = Field(default="created_at", description="Sort field")
    sort_order: str = Field(default="desc", description="Sort order: asc or desc")

    @field_validator("reviewer_type")
    @classmethod
    def validate_reviewer_type(cls, v: Optional[str]) -> Optional[str]:
        """Validate reviewer type."""
        if v is not None:
            allowed_types = {"client", "creator"}
            if v not in allowed_types:
                raise ValueError(f"reviewer_type must be one of: {', '.join(allowed_types)}")
        return v

    @field_validator("sort_by")
    @classmethod
    def validate_sort_by(cls, v: str) -> str:
        """Validate sort field."""
        allowed_fields = {"created_at", "rating", "helpful_count"}
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
# Review Moderation Schemas
# ============================================================================

class ReviewFlagRequest(BaseModel):
    """Schema for flagging a review."""

    reason: str = Field(..., min_length=10, max_length=500, description="Reason for flagging")


class ReviewFeatureRequest(BaseModel):
    """Schema for featuring/unfeaturing a review."""

    is_featured: bool = Field(..., description="Whether to feature this review")
