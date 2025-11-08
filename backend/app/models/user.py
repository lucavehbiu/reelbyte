"""User models for authentication and base user data."""

from datetime import datetime
from typing import Optional, TYPE_CHECKING
from uuid import UUID, uuid4

from sqlalchemy import Boolean, Integer, String, Text, TIMESTAMP, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.creator import CreatorProfile
    from app.models.client import ClientProfile
    from app.models.notification import Notification
    from app.models.message import Message, ConversationParticipant
    from app.models.review import Review
    from app.models.transaction import Transaction


class User(Base):
    """User model for authentication and base user information."""

    __tablename__ = "users"

    # Primary key
    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
        server_default=func.gen_random_uuid(),
    )

    # Authentication
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    user_type: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        index=True,
    )
    status: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="active",
        server_default="active",
        index=True,
    )

    # Verification
    email_verified: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false")
    phone_number: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    phone_verified: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false")
    two_factor_enabled: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false")

    # Activity tracking
    last_login_at: Mapped[Optional[datetime]] = mapped_column(TIMESTAMP(timezone=True), nullable=True)
    login_count: Mapped[int] = mapped_column(Integer, default=0, server_default="0")

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        nullable=False,
        default=datetime.utcnow,
        server_default=func.now(),
        index=True,
    )
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        nullable=False,
        default=datetime.utcnow,
        server_default=func.now(),
        onupdate=datetime.utcnow,
    )
    deleted_at: Mapped[Optional[datetime]] = mapped_column(TIMESTAMP(timezone=True), nullable=True)

    # Relationships
    creator_profile: Mapped[Optional["CreatorProfile"]] = relationship(
        "CreatorProfile",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )
    client_profile: Mapped[Optional["ClientProfile"]] = relationship(
        "ClientProfile",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )
    notifications: Mapped[list["Notification"]] = relationship(
        "Notification",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    sent_messages: Mapped[list["Message"]] = relationship(
        "Message",
        foreign_keys="[Message.sender_user_id]",
        back_populates="sender",
        cascade="all, delete-orphan",
    )
    conversation_participations: Mapped[list["ConversationParticipant"]] = relationship(
        "ConversationParticipant",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    reviews_written: Mapped[list["Review"]] = relationship(
        "Review",
        foreign_keys="[Review.reviewer_user_id]",
        back_populates="reviewer",
        cascade="all, delete-orphan",
    )
    reviews_received: Mapped[list["Review"]] = relationship(
        "Review",
        foreign_keys="[Review.reviewee_user_id]",
        back_populates="reviewee",
    )
    transactions_as_payer: Mapped[list["Transaction"]] = relationship(
        "Transaction",
        foreign_keys="[Transaction.payer_user_id]",
        back_populates="payer",
    )
    transactions_as_payee: Mapped[list["Transaction"]] = relationship(
        "Transaction",
        foreign_keys="[Transaction.payee_user_id]",
        back_populates="payee",
    )

    # Constraints
    __table_args__ = (
        CheckConstraint(
            "user_type IN ('creator', 'client', 'both')",
            name="check_user_type",
        ),
        CheckConstraint(
            "status IN ('active', 'suspended', 'deleted', 'pending_verification')",
            name="check_user_status",
        ),
    )

    def __repr__(self) -> str:
        return f"<User(id={self.id}, email={self.email}, user_type={self.user_type})>"
