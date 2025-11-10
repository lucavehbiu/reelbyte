"""Business logic for client profile operations."""

from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud import client as client_crud
from app.schemas.client import ClientProfileResponse


async def get_client_by_id(
    db: AsyncSession,
    client_id: UUID
) -> ClientProfileResponse:
    """
    Get a client profile by ID.

    Args:
        db: Database session
        client_id: Client profile UUID

    Returns:
        ClientProfileResponse

    Raises:
        HTTPException: If client profile not found
    """
    client = await client_crud.get_client_by_id(db, client_id)

    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client profile not found"
        )

    return ClientProfileResponse.model_validate(client)
