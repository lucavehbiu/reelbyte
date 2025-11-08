"""
Messaging system schemas for conversations and messages.
"""

from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Field, HttpUrl, ConfigDict, field_validator


# ============================================================================
# Conversation Schemas
# ============================================================================

class ConversationCreate(BaseModel):
    """Schema for creating a conversation."""

    # Related entities (optional)
    job_id: Optional[UUID] = Field(None, description="Related job ID")
    contract_id: Optional[UUID] = Field(None, description="Related contract ID")

    # Conversation type
    conversation_type: str = Field(default="direct", description="Conversation type")

    # Participants
    participant_user_ids: List[UUID] = Field(..., min_length=1, max_length=10, description="User IDs to add to conversation")

    @field_validator("conversation_type")
    @classmethod
    def validate_conversation_type(cls, v: str) -> str:
        """Validate conversation type."""
        allowed_types = {"direct", "job_inquiry", "contract_discussion"}
        if v not in allowed_types:
            raise ValueError(f"conversation_type must be one of: {', '.join(allowed_types)}")
        return v


class ConversationResponse(BaseModel):
    """Schema for conversation response."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    job_id: Optional[UUID]
    contract_id: Optional[UUID]
    conversation_type: str
    last_message_at: Optional[datetime]
    created_at: datetime

    # Additional computed fields
    unread_count: Optional[int] = Field(None, description="Unread message count for current user")
    last_message: Optional[str] = Field(None, description="Preview of last message")


class ConversationListResponse(BaseModel):
    """Schema for conversation list item."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    conversation_type: str
    last_message_at: Optional[datetime]
    unread_count: int
    participant_count: int
    created_at: datetime


# ============================================================================
# Conversation Participant Schemas
# ============================================================================

class ConversationParticipantCreate(BaseModel):
    """Schema for adding a participant to a conversation."""

    user_id: UUID = Field(..., description="User ID to add")


class ConversationParticipantUpdate(BaseModel):
    """Schema for updating participant settings."""

    is_muted: Optional[bool] = Field(None, description="Mute/unmute conversation")
    is_archived: Optional[bool] = Field(None, description="Archive/unarchive conversation")


class ConversationParticipantResponse(BaseModel):
    """Schema for conversation participant response."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    conversation_id: UUID
    user_id: UUID
    is_muted: bool
    is_archived: bool
    last_read_at: Optional[datetime]
    unread_count: int
    joined_at: datetime


# ============================================================================
# Message Schemas
# ============================================================================

class MessageCreate(BaseModel):
    """Schema for creating a message."""

    conversation_id: UUID = Field(..., description="Conversation ID")
    message_type: str = Field(default="text", description="Message type")
    content: str = Field(..., min_length=1, max_length=10000, description="Message content")

    # Attachments
    attachments: Optional[List[HttpUrl]] = Field(None, max_length=10, description="Attachment URLs")

    @field_validator("message_type")
    @classmethod
    def validate_message_type(cls, v: str) -> str:
        """Validate message type."""
        allowed_types = {"text", "file", "video", "image", "system"}
        if v not in allowed_types:
            raise ValueError(f"message_type must be one of: {', '.join(allowed_types)}")
        return v


class MessageUpdate(BaseModel):
    """Schema for updating a message."""

    content: str = Field(..., min_length=1, max_length=10000, description="Updated message content")


class MessageResponse(BaseModel):
    """Schema for message response."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    conversation_id: UUID
    sender_user_id: UUID
    message_type: str
    content: str
    attachments: Optional[List[str]]
    is_edited: bool
    is_deleted: bool
    created_at: datetime
    edited_at: Optional[datetime]


class MessageListResponse(BaseModel):
    """Schema for paginated message list."""

    messages: List[MessageResponse]
    total: int
    has_more: bool


# ============================================================================
# Message Actions
# ============================================================================

class MarkAsReadRequest(BaseModel):
    """Schema for marking messages as read."""

    message_ids: Optional[List[UUID]] = Field(None, description="Specific message IDs to mark as read")
    mark_all: bool = Field(default=False, description="Mark all messages in conversation as read")


class MessageDeleteRequest(BaseModel):
    """Schema for deleting a message."""

    message_id: UUID = Field(..., description="Message ID to delete")
    delete_for_everyone: bool = Field(default=False, description="Delete for all participants or just sender")


# ============================================================================
# Real-time Message Schemas
# ============================================================================

class MessageTypingIndicator(BaseModel):
    """Schema for typing indicator."""

    conversation_id: UUID = Field(..., description="Conversation ID")
    is_typing: bool = Field(..., description="Whether user is typing")


class MessageDeliveryStatus(BaseModel):
    """Schema for message delivery status."""

    message_id: UUID = Field(..., description="Message ID")
    status: str = Field(..., description="Delivery status: sent, delivered, read")
    timestamp: datetime = Field(..., description="Status timestamp")

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        """Validate delivery status."""
        allowed_statuses = {"sent", "delivered", "read"}
        if v not in allowed_statuses:
            raise ValueError(f"status must be one of: {', '.join(allowed_statuses)}")
        return v
