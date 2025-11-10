"""
Project schemas for job postings, proposals, and contracts.
"""

from datetime import date, datetime
from decimal import Decimal
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Field, HttpUrl, ConfigDict, field_validator


# ============================================================================
# Job (Project) Schemas
# ============================================================================

class JobCreate(BaseModel):
    """Schema for creating a job posting."""

    title: str = Field(..., min_length=10, max_length=200, description="Job title")
    description: str = Field(..., min_length=50, max_length=5000, description="Detailed job description")

    # Project Details
    category: str = Field(..., min_length=2, max_length=50, description="Job category")
    video_type: Optional[str] = Field(None, max_length=50, description="Video type needed")
    video_duration_preference: Optional[str] = Field(None, max_length=50, description="Preferred video duration")
    platform_preference: Optional[str] = Field(None, max_length=50, description="Target platform")

    # Budget
    budget_type: str = Field(..., description="Budget type: fixed, hourly, or range")
    budget_min: Optional[Decimal] = Field(None, ge=0, decimal_places=2, description="Minimum budget")
    budget_max: Optional[Decimal] = Field(None, ge=0, decimal_places=2, description="Maximum budget")

    # Timeline
    deadline_date: Optional[date] = Field(None, description="Project deadline")
    estimated_duration_days: Optional[int] = Field(None, ge=1, description="Estimated project duration")

    # Requirements
    required_skills: Optional[List[str]] = Field(None, max_length=15, description="Required skills")
    experience_level: str = Field(default="any", description="Required experience level")

    # Attachments
    attachments: Optional[List[HttpUrl]] = Field(None, max_length=10, description="Attachment URLs")

    @field_validator("budget_type")
    @classmethod
    def validate_budget_type(cls, v: str) -> str:
        """Validate budget type."""
        allowed_types = {"fixed", "hourly", "range"}
        if v not in allowed_types:
            raise ValueError(f"budget_type must be one of: {', '.join(allowed_types)}")
        return v

    @field_validator("experience_level")
    @classmethod
    def validate_experience_level(cls, v: str) -> str:
        """Validate experience level."""
        allowed_levels = {"entry", "intermediate", "expert", "any"}
        if v not in allowed_levels:
            raise ValueError(f"experience_level must be one of: {', '.join(allowed_levels)}")
        return v

    @field_validator("budget_min", "budget_max")
    @classmethod
    def validate_budget_range(cls, v: Optional[Decimal], info) -> Optional[Decimal]:
        """Validate budget range makes sense."""
        if v is not None and v < 0:
            raise ValueError("Budget cannot be negative")
        return v


class JobUpdate(BaseModel):
    """Schema for updating a job posting."""

    title: Optional[str] = Field(None, min_length=10, max_length=200)
    description: Optional[str] = Field(None, min_length=50, max_length=5000)
    category: Optional[str] = Field(None, min_length=2, max_length=50)
    video_type: Optional[str] = Field(None, max_length=50)
    video_duration_preference: Optional[str] = Field(None, max_length=50)
    platform_preference: Optional[str] = Field(None, max_length=50)
    budget_type: Optional[str] = None
    budget_min: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    budget_max: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    deadline_date: Optional[date] = None
    estimated_duration_days: Optional[int] = Field(None, ge=1)
    required_skills: Optional[List[str]] = Field(None, max_length=15)
    experience_level: Optional[str] = None
    attachments: Optional[List[HttpUrl]] = Field(None, max_length=10)
    status: Optional[str] = None

    @field_validator("budget_type")
    @classmethod
    def validate_budget_type(cls, v: Optional[str]) -> Optional[str]:
        """Validate budget type."""
        if v is not None:
            allowed_types = {"fixed", "hourly", "range"}
            if v not in allowed_types:
                raise ValueError(f"budget_type must be one of: {', '.join(allowed_types)}")
        return v

    @field_validator("experience_level")
    @classmethod
    def validate_experience_level(cls, v: Optional[str]) -> Optional[str]:
        """Validate experience level."""
        if v is not None:
            allowed_levels = {"entry", "intermediate", "expert", "any"}
            if v not in allowed_levels:
                raise ValueError(f"experience_level must be one of: {', '.join(allowed_levels)}")
        return v

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: Optional[str]) -> Optional[str]:
        """Validate job status."""
        if v is not None:
            allowed_statuses = {"draft", "open", "in_progress", "completed", "cancelled", "closed"}
            if v not in allowed_statuses:
                raise ValueError(f"status must be one of: {', '.join(allowed_statuses)}")
        return v


class JobResponse(BaseModel):
    """Schema for job response."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    client_profile_id: UUID
    title: str
    description: str

    # Project Details
    category: str
    video_type: Optional[str]
    video_duration_preference: Optional[str]
    platform_preference: Optional[str]

    # Budget
    budget_type: str
    budget_min: Optional[Decimal]
    budget_max: Optional[Decimal]

    # Timeline
    deadline_date: Optional[date]
    estimated_duration_days: Optional[int]

    # Requirements
    required_skills: Optional[List[str]]
    experience_level: str

    # Attachments
    attachments: Optional[List[str]]

    # Stats
    view_count: int
    proposal_count: int

    # Status
    status: str

    # Metadata
    created_at: datetime
    updated_at: datetime
    published_at: Optional[datetime]
    closed_at: Optional[datetime]


class JobListResponse(BaseModel):
    """Schema for job list item (summary view)."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    client_profile_id: UUID
    title: str
    category: str
    budget_type: str
    budget_min: Optional[Decimal]
    budget_max: Optional[Decimal]
    status: str
    proposal_count: int
    created_at: datetime
    deadline_date: Optional[date]


# ============================================================================
# Proposal Schemas
# ============================================================================

class ProposalCreate(BaseModel):
    """Schema for creating a proposal."""

    job_id: UUID = Field(..., description="Job ID to submit proposal for")
    cover_letter: str = Field(..., min_length=50, max_length=2000, description="Cover letter")
    proposed_budget: Decimal = Field(..., gt=0, decimal_places=2, description="Proposed budget in USD")
    proposed_timeline_days: int = Field(..., ge=1, le=365, description="Proposed timeline in days")

    # Attachments
    attachments: Optional[List[HttpUrl]] = Field(None, max_length=5, description="Attachment URLs")
    portfolio_samples: Optional[List[UUID]] = Field(None, max_length=5, description="Portfolio item IDs")


class ProposalUpdate(BaseModel):
    """Schema for updating a proposal."""

    cover_letter: Optional[str] = Field(None, min_length=50, max_length=2000)
    proposed_budget: Optional[Decimal] = Field(None, gt=0, decimal_places=2)
    proposed_timeline_days: Optional[int] = Field(None, ge=1, le=365)
    attachments: Optional[List[HttpUrl]] = Field(None, max_length=5)
    portfolio_samples: Optional[List[UUID]] = Field(None, max_length=5)
    status: Optional[str] = None

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: Optional[str]) -> Optional[str]:
        """Validate proposal status."""
        if v is not None:
            allowed_statuses = {"pending", "shortlisted", "accepted", "rejected", "withdrawn"}
            if v not in allowed_statuses:
                raise ValueError(f"status must be one of: {', '.join(allowed_statuses)}")
        return v


class ProposalResponse(BaseModel):
    """Schema for proposal response."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    job_id: UUID
    creator_profile_id: UUID

    # Proposal Details
    cover_letter: str
    proposed_budget: Decimal
    proposed_timeline_days: int

    # Attachments
    attachments: Optional[List[str]]
    portfolio_samples: Optional[List[str]]

    # Status
    status: str

    # Timestamps
    created_at: datetime
    updated_at: datetime
    reviewed_at: Optional[datetime]
    accepted_at: Optional[datetime]


class ProposalListResponse(BaseModel):
    """Schema for proposal list item (summary view)."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    job_id: UUID
    creator_profile_id: UUID
    proposed_budget: Decimal
    proposed_timeline_days: int
    status: str
    created_at: datetime


# ============================================================================
# Contract Schemas
# ============================================================================

class ContractCreate(BaseModel):
    """Schema for creating a contract."""

    # Related entities
    job_id: Optional[UUID] = Field(None, description="Related job ID (if from proposal)")
    proposal_id: Optional[UUID] = Field(None, description="Related proposal ID")
    gig_id: Optional[UUID] = Field(None, description="Related gig ID (if gig-based)")

    creator_profile_id: UUID = Field(..., description="Creator profile ID")

    # Contract Details
    title: str = Field(..., min_length=10, max_length=200, description="Contract title")
    description: str = Field(..., min_length=50, max_length=5000, description="Contract description")
    scope_of_work: str = Field(..., min_length=50, max_length=5000, description="Detailed scope of work")

    # Financials
    total_amount: Decimal = Field(..., gt=0, decimal_places=2, description="Total contract amount")

    # Timeline
    start_date: date = Field(..., description="Contract start date")
    deadline_date: date = Field(..., description="Contract deadline")
    estimated_hours: Optional[int] = Field(None, ge=1, description="Estimated hours")

    # Deliverables
    deliverable_description: Optional[str] = Field(None, max_length=2000, description="Deliverable requirements")
    revision_count: int = Field(default=0, ge=0, le=10, description="Number of revisions allowed")


class ContractUpdate(BaseModel):
    """Schema for updating a contract."""

    description: Optional[str] = Field(None, min_length=50, max_length=5000)
    scope_of_work: Optional[str] = Field(None, min_length=50, max_length=5000)
    deadline_date: Optional[date] = None
    deliverable_description: Optional[str] = Field(None, max_length=2000)
    status: Optional[str] = None

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: Optional[str]) -> Optional[str]:
        """Validate contract status."""
        if v is not None:
            allowed_statuses = {
                "pending_acceptance", "active", "in_review",
                "revision_requested", "completed", "cancelled", "disputed"
            }
            if v not in allowed_statuses:
                raise ValueError(f"status must be one of: {', '.join(allowed_statuses)}")
        return v


class ContractResponse(BaseModel):
    """Schema for contract response."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    job_id: Optional[UUID]
    proposal_id: Optional[UUID]
    gig_id: Optional[UUID]
    client_profile_id: UUID
    creator_profile_id: UUID

    # Contract Details
    title: str
    description: str
    scope_of_work: str

    # Financials
    total_amount: Decimal
    platform_fee: Decimal
    creator_payout: Decimal

    # Timeline
    start_date: date
    deadline_date: date
    estimated_hours: Optional[int]

    # Deliverables
    deliverable_description: Optional[str]
    revision_count: int

    # Status
    status: str

    # Timestamps
    created_at: datetime
    accepted_at: Optional[datetime]
    started_at: Optional[datetime]
    submitted_at: Optional[datetime]
    completed_at: Optional[datetime]
    cancelled_at: Optional[datetime]


class ContractListResponse(BaseModel):
    """Schema for contract list item (summary view)."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    title: str
    client_profile_id: UUID
    creator_profile_id: UUID
    total_amount: Decimal
    status: str
    deadline_date: date
    created_at: datetime


# ============================================================================
# Deliverable Schemas
# ============================================================================

class DeliverableCreate(BaseModel):
    """Schema for creating/submitting a deliverable."""

    contract_id: UUID = Field(..., description="Contract ID")
    title: Optional[str] = Field(None, max_length=200, description="Deliverable title")
    description: Optional[str] = Field(None, max_length=2000, description="Deliverable description")
    video_urls: List[HttpUrl] = Field(..., min_length=1, description="Video file URLs")
    file_urls: Optional[List[HttpUrl]] = Field(None, description="Additional file URLs")


class DeliverableResponse(BaseModel):
    """Schema for deliverable response."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    contract_id: UUID
    version_number: int
    title: Optional[str]
    description: Optional[str]
    video_urls: List[str]
    file_urls: Optional[List[str]]
    status: str
    client_feedback: Optional[str]
    revision_notes: Optional[str]
    created_at: datetime
    reviewed_at: Optional[datetime]
    approved_at: Optional[datetime]


# ============================================================================
# Project-specific schemas (for browsing projects by influencers)
# ============================================================================

class ClientSummary(BaseModel):
    """Summary of client information for project listings."""

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: UUID
    user_id: UUID = Field(alias="userId")
    company_name: str
    companyName: Optional[str] = None  # Alias for company_name
    company_logo_url: Optional[str] = Field(None, alias="companyLogoUrl")
    companyLogoUrl: Optional[str] = None  # Alias for company_logo_url
    industry: Optional[str] = None
    website_url: Optional[str] = None
    is_verified: bool = Field(default=False, alias="isVerified")
    total_jobs_posted: int = Field(default=0, alias="totalJobsPosted")
    totalJobsPosted: Optional[int] = None  # Alias for total_jobs_posted
    average_rating: Decimal = Field(default=Decimal("0.00"), alias="averageRating")
    averageRating: Optional[Decimal] = None  # Alias for average_rating
    total_reviews: int = Field(default=0, alias="totalReviews")
    totalReviews: Optional[int] = None  # Alias for total_reviews
    description: Optional[str] = None

    def model_post_init(self, __context):
        """Set aliases after initialization."""
        if self.company_name and not self.companyName:
            self.companyName = self.company_name
        if self.company_logo_url and not self.companyLogoUrl:
            self.companyLogoUrl = self.company_logo_url
        if self.total_jobs_posted is not None and not self.totalJobsPosted:
            self.totalJobsPosted = self.total_jobs_posted
        if self.average_rating is not None and not self.averageRating:
            self.averageRating = self.average_rating
        if self.total_reviews is not None and not self.totalReviews:
            self.totalReviews = self.total_reviews


class ProjectWithClient(BaseModel):
    """Project response with nested client information."""

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: UUID
    client_profile_id: UUID
    title: str
    description: str

    # Project Details
    category: str
    video_type: Optional[str]
    video_duration_preference: Optional[str]
    platform_preference: Optional[str]

    # Budget
    budget_type: Optional[str]
    budget_min: Optional[Decimal]
    budget_max: Optional[Decimal]

    # Computed budgetFixed field for frontend
    @property
    def budget_fixed(self) -> Optional[Decimal]:
        """Return budget_min as budgetFixed when budget_type is 'fixed'."""
        if self.budget_type == 'fixed':
            return self.budget_min
        return None

    # Timeline
    deadline_date: Optional[date]
    estimated_duration_days: Optional[int]

    # Requirements
    required_skills: Optional[List[str]]
    experience_level: Optional[str]

    # Stats
    view_count: int
    proposal_count: int

    # Status
    status: str

    # Metadata
    created_at: datetime
    updated_at: datetime
    published_at: Optional[datetime]
    closed_at: Optional[datetime]

    # Nested client information
    client: ClientSummary
    clientProfile: Optional[ClientSummary] = None  # Alias for client

    def model_post_init(self, __context):
        """Set aliases after initialization."""
        if self.client and not self.clientProfile:
            self.clientProfile = self.client


class ProjectSearchFilters(BaseModel):
    """Filters for searching projects."""

    status: Optional[str] = None
    category: Optional[str] = None
    video_type: Optional[str] = None
    experience_level: Optional[str] = None
    min_budget: Optional[float] = None
    max_budget: Optional[float] = None
    search: Optional[str] = None
    client_profile_id: Optional[UUID] = None
    sort_by: str = "created_at"
    sort_order: str = "desc"
    skip: int = 0
    limit: int = 20


class ProjectsListResponse(BaseModel):
    """Response for project list with pagination."""

    projects: List[ProjectWithClient]
    total: int
    page: int
    page_size: int
    total_pages: int
