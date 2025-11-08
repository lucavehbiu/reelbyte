"""
Client profile schemas for brands and businesses.
"""

from datetime import datetime
from decimal import Decimal
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field, HttpUrl, ConfigDict, field_validator


# ============================================================================
# Client Profile Schemas
# ============================================================================

class ClientProfileCreate(BaseModel):
    """Schema for creating a client profile."""

    company_name: str = Field(..., min_length=2, max_length=200, description="Company/brand name")
    company_logo_url: Optional[HttpUrl] = Field(None, description="Company logo URL")
    industry: Optional[str] = Field(None, max_length=100, description="Industry sector")
    company_size: Optional[str] = Field(None, description="Company size range")
    website_url: Optional[HttpUrl] = Field(None, description="Company website URL")
    description: Optional[str] = Field(None, max_length=2000, description="Company description")

    @field_validator("company_size")
    @classmethod
    def validate_company_size(cls, v: Optional[str]) -> Optional[str]:
        """Validate company size."""
        if v is not None:
            allowed_sizes = {"1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"}
            if v not in allowed_sizes:
                raise ValueError(f"company_size must be one of: {', '.join(allowed_sizes)}")
        return v


class ClientProfileUpdate(BaseModel):
    """Schema for updating a client profile."""

    company_name: Optional[str] = Field(None, min_length=2, max_length=200)
    company_logo_url: Optional[HttpUrl] = None
    industry: Optional[str] = Field(None, max_length=100)
    company_size: Optional[str] = None
    website_url: Optional[HttpUrl] = None
    description: Optional[str] = Field(None, max_length=2000)

    @field_validator("company_size")
    @classmethod
    def validate_company_size(cls, v: Optional[str]) -> Optional[str]:
        """Validate company size."""
        if v is not None:
            allowed_sizes = {"1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"}
            if v not in allowed_sizes:
                raise ValueError(f"company_size must be one of: {', '.join(allowed_sizes)}")
        return v


class ClientProfileResponse(BaseModel):
    """Schema for client profile response."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    company_name: str
    company_logo_url: Optional[str]
    industry: Optional[str]
    company_size: Optional[str]
    website_url: Optional[str]
    description: Optional[str]

    # Statistics
    total_jobs_posted: int
    total_spent: Decimal
    average_rating: Decimal
    total_reviews: int

    # Verification
    is_verified: bool
    verified_at: Optional[datetime]
    payment_verified: bool

    # Metadata
    created_at: datetime
    updated_at: datetime


class ClientPublicProfile(BaseModel):
    """Schema for public client profile (limited information)."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    company_name: str
    company_logo_url: Optional[str]
    industry: Optional[str]
    total_jobs_posted: int
    is_verified: bool
    created_at: datetime
