"""Review and rating models."""

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
    from app.models.project import Contract


class Review(Base):
    """Reviews and ratings between clients and creators."""

    __tablename__ = "reviews"

    # Primary key
    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
        server_default=func.gen_random_uuid(),
    )
    contract_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("contracts.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    reviewer_user_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    reviewee_user_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    reviewer_type: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)

    # Rating
    overall_rating: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        index=True,
    )

    # Detailed Ratings (optional)
    communication_rating: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    quality_rating: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    professionalism_rating: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    value_rating: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    # Review Text
    title: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    comment: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Response
    response_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    response_at: Mapped[Optional[datetime]] = mapped_column(TIMESTAMP(timezone=True), nullable=True)

    # Status
    is_public: Mapped[bool] = mapped_column(Boolean, default=True, server_default="true")
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false")
    flagged: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false")

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
    contract: Mapped["Contract"] = relationship(
        "Contract",
        back_populates="reviews",
    )
    reviewer: Mapped["User"] = relationship(
        "User",
        foreign_keys=[reviewer_user_id],
        back_populates="reviews_written",
    )
    reviewee: Mapped["User"] = relationship(
        "User",
        foreign_keys=[reviewee_user_id],
        back_populates="reviews_received",
    )

    # Constraints
    __table_args__ = (
        CheckConstraint(
            "reviewer_type IN ('client', 'creator')",
            name="check_reviewer_type",
        ),
        CheckConstraint(
            "overall_rating BETWEEN 1 AND 5",
            name="check_overall_rating",
        ),
        CheckConstraint(
            "communication_rating IS NULL OR communication_rating BETWEEN 1 AND 5",
            name="check_communication_rating",
        ),
        CheckConstraint(
            "quality_rating IS NULL OR quality_rating BETWEEN 1 AND 5",
            name="check_quality_rating",
        ),
        CheckConstraint(
            "professionalism_rating IS NULL OR professionalism_rating BETWEEN 1 AND 5",
            name="check_professionalism_rating",
        ),
        CheckConstraint(
            "value_rating IS NULL OR value_rating BETWEEN 1 AND 5",
            name="check_value_rating",
        ),
        Index("idx_reviews_unique", "contract_id", "reviewer_user_id", unique=True),
    )

    def __repr__(self) -> str:
        return f"<Review(id={self.id}, contract_id={self.contract_id}, rating={self.overall_rating})>"
