"""Project (job posting), proposal, and contract models."""

from datetime import datetime, date
from decimal import Decimal
from typing import Optional, TYPE_CHECKING
from uuid import UUID, uuid4

from sqlalchemy import (
    Boolean, Integer, String, Text, TIMESTAMP, DECIMAL, Date,
    CheckConstraint, ForeignKey, Index, text
)
from sqlalchemy.dialects.postgresql import UUID as PGUUID, JSONB, ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.client import ClientProfile
    from app.models.creator import CreatorProfile
    from app.models.gig import Gig
    from app.models.transaction import Transaction
    from app.models.review import Review
    from app.models.message import Conversation


class Project(Base):
    """Job postings by clients looking for creators."""

    __tablename__ = "projects"

    # Primary key
    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
        server_default=func.gen_random_uuid(),
    )
    client_profile_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("client_profiles.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Basic Information
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)

    # Project Details
    category: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    video_type: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    video_duration_preference: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    platform_preference: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)

    # Budget
    budget_type: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    budget_min: Mapped[Optional[Decimal]] = mapped_column(DECIMAL(10, 2), nullable=True)
    budget_max: Mapped[Optional[Decimal]] = mapped_column(DECIMAL(10, 2), nullable=True)

    # Timeline
    deadline_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    estimated_duration_days: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    # Requirements
    required_skills: Mapped[Optional[list[str]]] = mapped_column(ARRAY(Text), nullable=True)
    experience_level: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)

    # Attachments
    attachments: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    # Stats
    view_count: Mapped[int] = mapped_column(Integer, default=0, server_default="0")
    proposal_count: Mapped[int] = mapped_column(Integer, default=0, server_default="0")

    # Status
    status: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="open",
        server_default="open",
        index=True,
    )

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
    closed_at: Mapped[Optional[datetime]] = mapped_column(TIMESTAMP(timezone=True), nullable=True)

    # Relationships
    client: Mapped["ClientProfile"] = relationship("ClientProfile", back_populates="projects")
    proposals: Mapped[list["Proposal"]] = relationship(
        "Proposal",
        back_populates="project",
        cascade="all, delete-orphan",
    )
    contracts: Mapped[list["Contract"]] = relationship(
        "Contract",
        back_populates="project",
        foreign_keys="[Contract.project_id]",
    )
    conversations: Mapped[list["Conversation"]] = relationship(
        "Conversation",
        back_populates="project",
        foreign_keys="[Conversation.project_id]",
    )

    # Constraints and Indexes
    __table_args__ = (
        CheckConstraint(
            "budget_type IN ('fixed', 'hourly', 'range')",
            name="check_budget_type",
        ),
        CheckConstraint(
            "experience_level IN ('entry', 'intermediate', 'expert', 'any')",
            name="check_experience_level",
        ),
        CheckConstraint(
            "status IN ('draft', 'open', 'in_progress', 'completed', 'cancelled', 'closed')",
            name="check_project_status",
        ),
        Index("idx_projects_published_at", "published_at", postgresql_where="status = 'open'"),
        # TODO: Add via Alembic migration - GIN indexes need special handling
        # Index("idx_projects_required_skills", "required_skills", postgresql_using="gin"),
        # Index("idx_projects_full_text", ..., postgresql_using="gin"),
    )

    def __repr__(self) -> str:
        return f"<Project(id={self.id}, title={self.title}, status={self.status})>"


class Proposal(Base):
    """Creator proposals for job postings."""

    __tablename__ = "proposals"

    # Primary key
    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
        server_default=func.gen_random_uuid(),
    )
    project_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    creator_profile_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("creator_profiles.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Proposal Details
    cover_letter: Mapped[str] = mapped_column(Text, nullable=False)
    proposed_budget: Mapped[Decimal] = mapped_column(DECIMAL(10, 2), nullable=False)
    proposed_timeline_days: Mapped[int] = mapped_column(Integer, nullable=False)

    # Attachments
    attachments: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    portfolio_samples: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    # Status
    status: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="pending",
        server_default="pending",
        index=True,
    )

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
    reviewed_at: Mapped[Optional[datetime]] = mapped_column(TIMESTAMP(timezone=True), nullable=True)
    accepted_at: Mapped[Optional[datetime]] = mapped_column(TIMESTAMP(timezone=True), nullable=True)

    # Relationships
    project: Mapped["Project"] = relationship("Project", back_populates="proposals")
    creator: Mapped["CreatorProfile"] = relationship("CreatorProfile", back_populates="proposals")
    contract: Mapped[Optional["Contract"]] = relationship(
        "Contract",
        back_populates="proposal",
        uselist=False,
        foreign_keys="[Contract.proposal_id]",
    )

    # Constraints and Indexes
    __table_args__ = (
        CheckConstraint(
            "status IN ('pending', 'shortlisted', 'accepted', 'rejected', 'withdrawn')",
            name="check_proposal_status",
        ),
        Index("idx_proposals_unique", "project_id", "creator_profile_id", unique=True),
    )

    def __repr__(self) -> str:
        return f"<Proposal(id={self.id}, status={self.status})>"


class Contract(Base):
    """Formal agreements between clients and creators."""

    __tablename__ = "contracts"

    # Primary key
    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
        server_default=func.gen_random_uuid(),
    )

    # Related Entities
    project_id: Mapped[Optional[UUID]] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("projects.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    proposal_id: Mapped[Optional[UUID]] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("proposals.id", ondelete="SET NULL"),
        nullable=True,
    )
    gig_id: Mapped[Optional[UUID]] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("gigs.id", ondelete="SET NULL"),
        nullable=True,
    )

    # Parties
    client_profile_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("client_profiles.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )
    creator_profile_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("creator_profiles.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    # Contract Details
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    scope_of_work: Mapped[str] = mapped_column(Text, nullable=False)

    # Financials
    total_amount: Mapped[Decimal] = mapped_column(DECIMAL(10, 2), nullable=False)
    platform_fee: Mapped[Decimal] = mapped_column(DECIMAL(10, 2), nullable=False)
    creator_payout: Mapped[Decimal] = mapped_column(DECIMAL(10, 2), nullable=False)

    # Timeline
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    deadline_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    estimated_hours: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    # Deliverables
    deliverable_description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    revision_count: Mapped[int] = mapped_column(Integer, default=0, server_default="0")

    # Status
    status: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="pending_acceptance",
        server_default="pending_acceptance",
        index=True,
    )

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        nullable=False,
        default=datetime.utcnow,
        server_default=func.now(),
    )
    accepted_at: Mapped[Optional[datetime]] = mapped_column(TIMESTAMP(timezone=True), nullable=True)
    started_at: Mapped[Optional[datetime]] = mapped_column(TIMESTAMP(timezone=True), nullable=True)
    submitted_at: Mapped[Optional[datetime]] = mapped_column(TIMESTAMP(timezone=True), nullable=True)
    completed_at: Mapped[Optional[datetime]] = mapped_column(TIMESTAMP(timezone=True), nullable=True)
    cancelled_at: Mapped[Optional[datetime]] = mapped_column(TIMESTAMP(timezone=True), nullable=True)

    # Relationships
    project: Mapped[Optional["Project"]] = relationship("Project", back_populates="contracts")
    proposal: Mapped[Optional["Proposal"]] = relationship("Proposal", back_populates="contract")
    gig: Mapped[Optional["Gig"]] = relationship("Gig", back_populates="contracts")
    client: Mapped["ClientProfile"] = relationship(
        "ClientProfile",
        back_populates="contracts_as_client",
        foreign_keys=[client_profile_id],
    )
    creator: Mapped["CreatorProfile"] = relationship(
        "CreatorProfile",
        back_populates="contracts_as_creator",
        foreign_keys=[creator_profile_id],
    )
    transactions: Mapped[list["Transaction"]] = relationship(
        "Transaction",
        back_populates="contract",
        cascade="all, delete-orphan",
    )
    reviews: Mapped[list["Review"]] = relationship(
        "Review",
        back_populates="contract",
        cascade="all, delete-orphan",
    )
    conversations: Mapped[list["Conversation"]] = relationship(
        "Conversation",
        back_populates="contract",
        foreign_keys="[Conversation.contract_id]",
    )

    # Constraints
    __table_args__ = (
        CheckConstraint(
            "status IN ('pending_acceptance', 'active', 'in_review', 'revision_requested', 'completed', 'cancelled', 'disputed')",
            name="check_contract_status",
        ),
    )

    def __repr__(self) -> str:
        return f"<Contract(id={self.id}, title={self.title}, status={self.status})>"
