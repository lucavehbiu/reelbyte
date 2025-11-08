"""Client profile models."""

from datetime import datetime
from decimal import Decimal
from typing import Optional, TYPE_CHECKING
from uuid import UUID, uuid4

from sqlalchemy import Boolean, Integer, String, Text, TIMESTAMP, DECIMAL, CheckConstraint, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.project import Project, Contract


class ClientProfile(Base):
    """Client profile for brands and businesses."""

    __tablename__ = "client_profiles"

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

    # Company Information
    company_name: Mapped[str] = mapped_column(String(200), nullable=False)
    company_logo_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    industry: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    company_size: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    website_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Statistics
    total_jobs_posted: Mapped[int] = mapped_column(Integer, default=0, server_default="0")
    total_spent: Mapped[Decimal] = mapped_column(DECIMAL(12, 2), default=Decimal("0"), server_default="0")
    average_rating: Mapped[Decimal] = mapped_column(DECIMAL(3, 2), default=Decimal("0"), server_default="0")
    total_reviews: Mapped[int] = mapped_column(Integer, default=0, server_default="0")

    # Verification
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false", index=True)
    verified_at: Mapped[Optional[datetime]] = mapped_column(TIMESTAMP(timezone=True), nullable=True)
    payment_verified: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false")

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
    user: Mapped["User"] = relationship("User", back_populates="client_profile")
    projects: Mapped[list["Project"]] = relationship(
        "Project",
        back_populates="client",
        cascade="all, delete-orphan",
    )
    contracts_as_client: Mapped[list["Contract"]] = relationship(
        "Contract",
        foreign_keys="[Contract.client_profile_id]",
        back_populates="client",
    )

    # Constraints
    __table_args__ = (
        CheckConstraint(
            "company_size IN ('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+')",
            name="check_company_size",
        ),
    )

    def __repr__(self) -> str:
        return f"<ClientProfile(id={self.id}, company_name={self.company_name})>"
