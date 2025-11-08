"""
Pydantic schemas for request/response validation.
Comprehensive schemas for ReelByte backend API.
"""

# User schemas
from app.schemas.user import (
    UserCreate,
    UserLogin,
    UserUpdate,
    UserResponse,
    UserPublicProfile,
    Token,
    TokenData,
    RefreshToken,
    PasswordResetRequest,
    PasswordResetConfirm,
    PasswordChange,
    EmailVerificationRequest,
    EmailVerificationConfirm,
)

# Creator profile schemas
from app.schemas.creator import (
    CreatorProfileCreate,
    CreatorProfileUpdate,
    CreatorProfileResponse,
    CreatorPublicProfile,
    CreatorSkillCreate,
    CreatorSkillResponse,
    CreatorCategoryCreate,
    CreatorCategoryResponse,
    PortfolioItemCreate,
    PortfolioItemUpdate,
    PortfolioItemResponse,
    CreatorSearchFilters,
)

# Client profile schemas
from app.schemas.client import (
    ClientProfileCreate,
    ClientProfileUpdate,
    ClientProfileResponse,
    ClientPublicProfile,
)

# Gig schemas
from app.schemas.gig import (
    GigPackageBase,
    GigPackageCreate,
    GigPackageResponse,
    GigCreate,
    GigUpdate,
    GigResponse,
    GigListResponse,
    GigSearchFilters,
    GigOrderCreate,
)

# Project schemas (jobs, proposals, contracts)
from app.schemas.project import (
    JobCreate,
    JobUpdate,
    JobResponse,
    JobListResponse,
    ProposalCreate,
    ProposalUpdate,
    ProposalResponse,
    ProposalListResponse,
    ContractCreate,
    ContractUpdate,
    ContractResponse,
    ContractListResponse,
    DeliverableCreate,
    DeliverableResponse,
)

# Message schemas
from app.schemas.message import (
    ConversationCreate,
    ConversationResponse,
    ConversationListResponse,
    ConversationParticipantCreate,
    ConversationParticipantUpdate,
    ConversationParticipantResponse,
    MessageCreate,
    MessageUpdate,
    MessageResponse,
    MessageListResponse,
    MarkAsReadRequest,
    MessageDeleteRequest,
    MessageTypingIndicator,
    MessageDeliveryStatus,
)

# Review schemas
from app.schemas.review import (
    ReviewCreate,
    ReviewUpdate,
    ReviewResponse,
    ReviewListResponse,
    ReviewResponseCreate,
    ReviewResponseUpdate,
    ReviewStatistics,
    ReviewFilters,
    ReviewFlagRequest,
    ReviewFeatureRequest,
)

__all__ = [
    # User schemas
    "UserCreate",
    "UserLogin",
    "UserUpdate",
    "UserResponse",
    "UserPublicProfile",
    "Token",
    "TokenData",
    "RefreshToken",
    "PasswordResetRequest",
    "PasswordResetConfirm",
    "PasswordChange",
    "EmailVerificationRequest",
    "EmailVerificationConfirm",
    # Creator schemas
    "CreatorProfileCreate",
    "CreatorProfileUpdate",
    "CreatorProfileResponse",
    "CreatorPublicProfile",
    "CreatorSkillCreate",
    "CreatorSkillResponse",
    "CreatorCategoryCreate",
    "CreatorCategoryResponse",
    "PortfolioItemCreate",
    "PortfolioItemUpdate",
    "PortfolioItemResponse",
    "CreatorSearchFilters",
    # Client schemas
    "ClientProfileCreate",
    "ClientProfileUpdate",
    "ClientProfileResponse",
    "ClientPublicProfile",
    # Gig schemas
    "GigPackageBase",
    "GigPackageCreate",
    "GigPackageResponse",
    "GigCreate",
    "GigUpdate",
    "GigResponse",
    "GigListResponse",
    "GigSearchFilters",
    "GigOrderCreate",
    # Project schemas
    "JobCreate",
    "JobUpdate",
    "JobResponse",
    "JobListResponse",
    "ProposalCreate",
    "ProposalUpdate",
    "ProposalResponse",
    "ProposalListResponse",
    "ContractCreate",
    "ContractUpdate",
    "ContractResponse",
    "ContractListResponse",
    "DeliverableCreate",
    "DeliverableResponse",
    # Message schemas
    "ConversationCreate",
    "ConversationResponse",
    "ConversationListResponse",
    "ConversationParticipantCreate",
    "ConversationParticipantUpdate",
    "ConversationParticipantResponse",
    "MessageCreate",
    "MessageUpdate",
    "MessageResponse",
    "MessageListResponse",
    "MarkAsReadRequest",
    "MessageDeleteRequest",
    "MessageTypingIndicator",
    "MessageDeliveryStatus",
    # Review schemas
    "ReviewCreate",
    "ReviewUpdate",
    "ReviewResponse",
    "ReviewListResponse",
    "ReviewResponseCreate",
    "ReviewResponseUpdate",
    "ReviewStatistics",
    "ReviewFilters",
    "ReviewFlagRequest",
    "ReviewFeatureRequest",
]
