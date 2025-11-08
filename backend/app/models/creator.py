"""Creator profile and related models."""

from datetime import datetime
from decimal import Decimal
from typing import Optional, TYPE_CHECKING
from uuid import UUID, uuid4

from sqlalchemy import Boolean, Integer, String, Text, TIMESTAMP, DECIMAL, CheckConstraint, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.gig import Gig
    from app.models.project import Proposal, Contract


class CreatorProfile(Base):
    """Creator profile with professional information and statistics."""

    __tablename__ = "creator_profiles"

    # Primary key
    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
        server_default=func.gen_random_uuid(),
    )
    user_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
    )

    # Profile Information
    display_name: Mapped[str] = mapped_column(String(100), nullable=False)
    tagline: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    bio: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    profile_image_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    cover_image_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    portfolio_video_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Professional Info
    years_of_experience: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    hourly_rate: Mapped[Optional[Decimal]] = mapped_column(DECIMAL(10, 2), nullable=True)
    availability_status: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="available",
        server_default="available",
        index=True,
    )
    response_time_hours: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    # Statistics (denormalized for performance)
    total_jobs_completed: Mapped[int] = mapped_column(Integer, default=0, server_default="0")
    total_earnings: Mapped[Decimal] = mapped_column(DECIMAL(12, 2), default=Decimal("0"), server_default="0")
    success_rate: Mapped[Decimal] = mapped_column(DECIMAL(5, 2), default=Decimal("0"), server_default="0")
    on_time_delivery_rate: Mapped[Decimal] = mapped_column(DECIMAL(5, 2), default=Decimal("0"), server_default="0")
    average_rating: Mapped[Decimal] = mapped_column(
        DECIMAL(3, 2),
        default=Decimal("0"),
        server_default="0",
        index=True,
    )
    total_reviews: Mapped[int] = mapped_column(Integer, default=0, server_default="0")

    # Verification
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false", index=True)
    verification_level: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    verified_at: Mapped[Optional[datetime]] = mapped_column(TIMESTAMP(timezone=True), nullable=True)

    # Social Links
    instagram_handle: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    tiktok_handle: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    youtube_channel: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    website_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        nullable=False,
        default=datetime.utcnow,
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        nullable=False,
        default=datetime.utcnow,
        server_default=func.now(),
        onupdate=datetime.utcnow,
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="creator_profile")
    gigs: Mapped[list["Gig"]] = relationship(
        "Gig",
        back_populates="creator",
        cascade="all, delete-orphan",
    )
    proposals: Mapped[list["Proposal"]] = relationship(
        "Proposal",
        back_populates="creator",
        cascade="all, delete-orphan",
    )
    contracts_as_creator: Mapped[list["Contract"]] = relationship(
        "Contract",
        foreign_keys="[Contract.creator_profile_id]",
        back_populates="creator",
    )

    # Constraints
    __table_args__ = (
        CheckConstraint(
            "availability_status IN ('available', 'busy', 'unavailable')",
            name="check_availability_status",
        ),
        CheckConstraint(
            "verification_level IN ('none', 'basic', 'pro', 'elite')",
            name="check_verification_level",
        ),
    )

    def __repr__(self) -> str:
        return f"<CreatorProfile(id={self.id}, display_name={self.display_name})>"


class CreatorSkill(Base):
    """Skills and expertise tags for creators."""

    __tablename__ = "creator_skills"

    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
        server_default=func.gen_random_uuid(),
    )
    creator_profile_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("creator_profiles.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    skill_name: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    proficiency_level: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    years_experience: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        nullable=False,
        default=datetime.utcnow,
        server_default=func.now(),
    )

    # Constraints
    __table_args__ = (
        CheckConstraint(
            "proficiency_level IN ('beginner', 'intermediate', 'expert')",
            name="check_proficiency_level",
        ),
        Index("idx_creator_skills_unique", "creator_profile_id", "skill_name", unique=True),
    )

    def __repr__(self) -> str:
        return f"<CreatorSkill(skill_name={self.skill_name}, proficiency={self.proficiency_level})>"


class CreatorCategory(Base):
    """Content categories/niches creators specialize in."""

    __tablename__ = "creator_categories"

    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
        server_default=func.gen_random_uuid(),
    )
    creator_profile_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("creator_profiles.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    category: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    is_primary: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false")

    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        nullable=False,
        default=datetime.utcnow,
        server_default=func.now(),
    )

    def __repr__(self) -> str:
        return f"<CreatorCategory(category={self.category}, is_primary={self.is_primary})>"


class PortfolioItem(Base):
    """Video samples and past work for creator portfolios."""

    __tablename__ = "portfolio_items"

    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
        server_default=func.gen_random_uuid(),
    )
    creator_profile_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("creator_profiles.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Content
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    video_url: Mapped[str] = mapped_column(Text, nullable=False)
    thumbnail_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    video_duration_seconds: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    # Metrics
    view_count: Mapped[int] = mapped_column(Integer, default=0, server_default="0")
    like_count: Mapped[int] = mapped_column(Integer, default=0, server_default="0")

    # Project Context
    project_type: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    platform: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)

    # Ordering
    display_order: Mapped[int] = mapped_column(Integer, default=0, server_default="0")
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false")

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        nullable=False,
        default=datetime.utcnow,
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        nullable=False,
        default=datetime.utcnow,
        server_default=func.now(),
        onupdate=datetime.utcnow,
    )

    # Indexes
    __table_args__ = (
        Index("idx_portfolio_items_featured", "is_featured", "display_order"),
    )

    def __repr__(self) -> str:
        return f"<PortfolioItem(id={self.id}, title={self.title})>"
