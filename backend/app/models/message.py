"""Messaging system models."""

from datetime import datetime
from typing import Optional, TYPE_CHECKING
from uuid import UUID, uuid4

from sqlalchemy import Boolean, Integer, String, Text, TIMESTAMP, CheckConstraint, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID as PGUUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.project import Project, Contract


class Conversation(Base):
    """Message threads between users."""

    __tablename__ = "conversations"

    # Primary key
    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
        server_default=func.gen_random_uuid(),
    )

    # Related Entity (optional)
    project_id: Mapped[Optional[UUID]] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("projects.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    contract_id: Mapped[Optional[UUID]] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("contracts.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # Conversation Type
    conversation_type: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="direct",
        server_default="direct",
    )

    last_message_at: Mapped[Optional[datetime]] = mapped_column(
        TIMESTAMP(timezone=True),
        nullable=True,
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        nullable=False,
        default=datetime.utcnow,
        server_default=func.now(),
    )

    # Relationships
    project: Mapped[Optional["Project"]] = relationship(
        "Project",
        back_populates="conversations",
    )
    contract: Mapped[Optional["Contract"]] = relationship(
        "Contract",
        back_populates="conversations",
    )
    participants: Mapped[list["ConversationParticipant"]] = relationship(
        "ConversationParticipant",
        back_populates="conversation",
        cascade="all, delete-orphan",
    )
    messages: Mapped[list["Message"]] = relationship(
        "Message",
        back_populates="conversation",
        cascade="all, delete-orphan",
        order_by="Message.created_at.desc()",
    )

    # Constraints
    __table_args__ = (
        CheckConstraint(
            "conversation_type IN ('direct', 'project_inquiry', 'contract_discussion')",
            name="check_conversation_type",
        ),
        Index("idx_conversations_last_message", "last_message_at"),
    )

    def __repr__(self) -> str:
        return f"<Conversation(id={self.id}, type={self.conversation_type})>"


class ConversationParticipant(Base):
    """Users participating in a conversation."""

    __tablename__ = "conversation_participants"

    # Primary key
    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
        server_default=func.gen_random_uuid(),
    )
    conversation_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("conversations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    user_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Status
    is_muted: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false")
    is_archived: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false")

    # Read Status
    last_read_at: Mapped[Optional[datetime]] = mapped_column(TIMESTAMP(timezone=True), nullable=True)
    unread_count: Mapped[int] = mapped_column(Integer, default=0, server_default="0")

    joined_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        nullable=False,
        default=datetime.utcnow,
        server_default=func.now(),
    )

    # Relationships
    conversation: Mapped["Conversation"] = relationship(
        "Conversation",
        back_populates="participants",
    )
    user: Mapped["User"] = relationship(
        "User",
        back_populates="conversation_participations",
    )

    # Constraints
    __table_args__ = (
        Index("idx_conversation_participants_unique", "conversation_id", "user_id", unique=True),
    )

    def __repr__(self) -> str:
        return f"<ConversationParticipant(conversation_id={self.conversation_id}, user_id={self.user_id})>"


class Message(Base):
    """Individual messages in conversations."""

    __tablename__ = "messages"

    # Primary key
    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
        server_default=func.gen_random_uuid(),
    )
    conversation_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("conversations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    sender_user_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Content
    message_type: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="text",
        server_default="text",
    )
    content: Mapped[str] = mapped_column(Text, nullable=False)

    # Attachments
    attachments: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    # Status
    is_edited: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false")
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false")

    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        nullable=False,
        default=datetime.utcnow,
        server_default=func.now(),
    )
    edited_at: Mapped[Optional[datetime]] = mapped_column(TIMESTAMP(timezone=True), nullable=True)

    # Relationships
    conversation: Mapped["Conversation"] = relationship(
        "Conversation",
        back_populates="messages",
    )
    sender: Mapped["User"] = relationship(
        "User",
        foreign_keys=[sender_user_id],
        back_populates="sent_messages",
    )

    # Constraints
    __table_args__ = (
        CheckConstraint(
            "message_type IN ('text', 'file', 'video', 'image', 'system')",
            name="check_message_type",
        ),
        Index("idx_messages_conversation_created", "conversation_id", "created_at"),
    )

    def __repr__(self) -> str:
        return f"<Message(id={self.id}, conversation_id={self.conversation_id}, type={self.message_type})>"
