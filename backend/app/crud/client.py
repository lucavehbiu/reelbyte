"""CRUD operations for client profiles."""

from typing import Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.client import ClientProfile


async def get_client_by_id(db: AsyncSession, client_id: UUID) -> Optional[ClientProfile]:
    """
    Get a client profile by its ID.

    Args:
        db: Database session
        client_id: Client profile UUID

    Returns:
        ClientProfile instance or None if not found
    """
    result = await db.execute(
        select(ClientProfile)
        .options(selectinload(ClientProfile.user))
        .where(ClientProfile.id == client_id)
    )
    return result.scalar_one_or_none()


async def get_client_by_user_id(db: AsyncSession, user_id: UUID) -> Optional[ClientProfile]:
    """
    Get a client profile by user ID.

    Args:
        db: Database session
        user_id: User UUID

    Returns:
        ClientProfile instance or None if not found
    """
    result = await db.execute(
        select(ClientProfile)
        .options(selectinload(ClientProfile.user))
        .where(ClientProfile.user_id == user_id)
    )
    return result.scalar_one_or_none()
