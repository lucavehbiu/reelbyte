"""Gig (service listing) models."""

from datetime import datetime
from decimal import Decimal
from typing import Optional, TYPE_CHECKING
from uuid import UUID, uuid4

from sqlalchemy import Boolean, Integer, String, Text, TIMESTAMP, DECIMAL, CheckConstraint, ForeignKey, Index, text
from sqlalchemy.dialects.postgresql import UUID as PGUUID, JSONB, ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.creator import CreatorProfile
    from app.models.project import Contract


class Gig(Base):
    """Pre-packaged services offered by creators (similar to Fiverr gigs)."""

    __tablename__ = "gigs"

    # Primary key
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

    # Basic Information
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(250), unique=True, nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)

    # Pricing Tiers - Basic (Required)
    basic_price: Mapped[Decimal] = mapped_column(DECIMAL(10, 2), nullable=False)
    basic_description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    basic_delivery_days: Mapped[int] = mapped_column(Integer, nullable=False)
    basic_revisions: Mapped[int] = mapped_column(Integer, default=0, server_default="0")

    # Pricing Tiers - Standard (Optional)
    standard_price: Mapped[Optional[Decimal]] = mapped_column(DECIMAL(10, 2), nullable=True)
    standard_description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    standard_delivery_days: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    standard_revisions: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    # Pricing Tiers - Premium (Optional)
    premium_price: Mapped[Optional[Decimal]] = mapped_column(DECIMAL(10, 2), nullable=True)
    premium_description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    premium_delivery_days: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    premium_revisions: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    # Details
    category: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    subcategory: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    video_type: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)

    # Media
    thumbnail_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    video_samples: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    # Requirements
    requirements: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Stats
    view_count: Mapped[int] = mapped_column(Integer, default=0, server_default="0")
    order_count: Mapped[int] = mapped_column(Integer, default=0, server_default="0")
    favorite_count: Mapped[int] = mapped_column(Integer, default=0, server_default="0")

    # Status
    status: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="draft",
        server_default="draft",
        index=True,
    )

    # SEO
    search_tags: Mapped[Optional[list[str]]] = mapped_column(ARRAY(Text), nullable=True)

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
    published_at: Mapped[Optional[datetime]] = mapped_column(TIMESTAMP(timezone=True), nullable=True)

    # Relationships
    creator: Mapped["CreatorProfile"] = relationship("CreatorProfile", back_populates="gigs")
    contracts: Mapped[list["Contract"]] = relationship(
        "Contract",
        back_populates="gig",
        foreign_keys="[Contract.gig_id]",
    )

    # Constraints and Indexes
    __table_args__ = (
        CheckConstraint(
            "status IN ('draft', 'active', 'paused', 'deleted')",
            name="check_gig_status",
        ),
        Index("idx_gigs_published_at", "published_at", postgresql_where=text("status = 'active'")),
        Index("idx_gigs_search_tags", "search_tags", postgresql_using="gin"),
    )

    def __repr__(self) -> str:
        return f"<Gig(id={self.id}, title={self.title}, status={self.status})>"
