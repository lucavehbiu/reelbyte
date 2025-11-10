"""API endpoints for client profiles."""

from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.base import get_db
from app.schemas.client import ClientProfileResponse
from app.services import client_service


router = APIRouter()


@router.get("/{client_id}", response_model=ClientProfileResponse)
async def get_client(
    client_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get a single client profile by ID."""
    return await client_service.get_client_by_id(db, client_id)
