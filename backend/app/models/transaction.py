"""Transaction and payment models."""

from datetime import datetime
from decimal import Decimal
from typing import Optional, TYPE_CHECKING
from uuid import UUID, uuid4

from sqlalchemy import Integer, String, Text, TIMESTAMP, DECIMAL, CheckConstraint, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID as PGUUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.project import Contract


class Transaction(Base):
    """All financial transactions in the platform."""

    __tablename__ = "transactions"

    # Primary key
    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
        server_default=func.gen_random_uuid(),
    )

    # Parties
    payer_user_id: Mapped[Optional[UUID]] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    payee_user_id: Mapped[Optional[UUID]] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # Related Entities
    contract_id: Mapped[Optional[UUID]] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("contracts.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # Transaction Details
    transaction_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
    )

    amount: Mapped[Decimal] = mapped_column(DECIMAL(10, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), default="USD", server_default="USD")

    platform_fee: Mapped[Decimal] = mapped_column(DECIMAL(10, 2), default=Decimal("0"), server_default="0")
    processing_fee: Mapped[Decimal] = mapped_column(DECIMAL(10, 2), default=Decimal("0"), server_default="0")
    net_amount: Mapped[Decimal] = mapped_column(DECIMAL(10, 2), nullable=False)

    # Payment Provider
    payment_provider: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    provider_transaction_id: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    # Status
    status: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="pending",
        server_default="pending",
        index=True,
    )

    # Metadata
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    metadata: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        nullable=False,
        default=datetime.utcnow,
        server_default=func.now(),
        index=True,
    )
    completed_at: Mapped[Optional[datetime]] = mapped_column(TIMESTAMP(timezone=True), nullable=True)
    failed_at: Mapped[Optional[datetime]] = mapped_column(TIMESTAMP(timezone=True), nullable=True)
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationships
    payer: Mapped[Optional["User"]] = relationship(
        "User",
        foreign_keys=[payer_user_id],
        back_populates="transactions_as_payer",
    )
    payee: Mapped[Optional["User"]] = relationship(
        "User",
        foreign_keys=[payee_user_id],
        back_populates="transactions_as_payee",
    )
    contract: Mapped[Optional["Contract"]] = relationship(
        "Contract",
        back_populates="transactions",
    )

    # Constraints
    __table_args__ = (
        CheckConstraint(
            "transaction_type IN ('payment', 'refund', 'payout', 'escrow_hold', 'escrow_release', 'platform_fee', 'tip', 'adjustment')",
            name="check_transaction_type",
        ),
        CheckConstraint(
            "status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled')",
            name="check_transaction_status",
        ),
    )

    def __repr__(self) -> str:
        return f"<Transaction(id={self.id}, type={self.transaction_type}, amount={self.amount}, status={self.status})>"
