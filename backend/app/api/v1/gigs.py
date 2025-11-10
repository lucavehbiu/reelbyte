"""API endpoints for gigs/marketplace."""

from typing import List, Dict, Any, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.base import get_db
from app.core.security import get_current_user
from app.schemas.gig import (
    GigCreate, GigUpdate, GigResponse, GigsListResponse,
    GigSearchFilters, GigPackageResponse, GigStatus
)
from app.services import gig_service


router = APIRouter()


@router.get("/", response_model=GigsListResponse)
async def list_gigs(
    search: Optional[str] = Query(None, description="Search in title and description"),
    category: Optional[str] = Query(None, description="Filter by category"),
    subcategory: Optional[str] = Query(None, description="Filter by subcategory"),
    video_type: Optional[str] = Query(None, description="Filter by video type"),
    min_price: Optional[float] = Query(None, ge=0, description="Minimum price"),
    max_price: Optional[float] = Query(None, ge=0, description="Maximum price"),
    tags: Optional[List[str]] = Query(None, description="Filter by tags"),
    creator_profile_id: Optional[UUID] = Query(None, description="Filter by creator"),
    gig_status: Optional[GigStatus] = Query(GigStatus.active, description="Filter by status"),
    sort_by: str = Query("created_at", description="Sort field: created_at, price, popularity, views"),
    sort_order: str = Query("desc", description="Sort order: asc or desc"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=100, description="Number of records to return"),
    db: AsyncSession = Depends(get_db)
):
    """
    List and search gigs with filters and pagination.

    - **search**: Search term for title and description
    - **category**: Filter by category
    - **subcategory**: Filter by subcategory
    - **video_type**: Filter by video type
    - **min_price**: Minimum price filter
    - **max_price**: Maximum price filter
    - **tags**: Filter by tags (can provide multiple)
    - **creator_profile_id**: Filter by specific creator
    - **gig_status**: Filter by gig status (default: active)
    - **sort_by**: Field to sort by
    - **sort_order**: Sort order (asc or desc)
    - **skip**: Number of records to skip for pagination
    - **limit**: Maximum number of records to return
    """
    filters = GigSearchFilters(
        search=search,
        category=category,
        subcategory=subcategory,
        video_type=video_type,
        min_price=min_price,
        max_price=max_price,
        tags=tags,
        creator_profile_id=creator_profile_id,
        status=gig_status,
        sort_by=sort_by,
        sort_order=sort_order,
        skip=skip,
        limit=limit
    )

    return await gig_service.list_gigs(db, filters)


@router.get("/{gig_id}", response_model=GigResponse)
async def get_gig(
    gig_id: UUID,
    increment_views: bool = Query(False, description="Increment view count"),
    db: AsyncSession = Depends(get_db)
):
    """
    Get a single gig by ID.

    - **gig_id**: Gig UUID
    - **increment_views**: Whether to increment the view count (default: false)
    """
    return await gig_service.get_gig_by_id(db, gig_id, increment_views=increment_views)


@router.get("/{gig_id}/packages", response_model=List[GigPackageResponse])
async def get_gig_packages(
    gig_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """
    Get all pricing packages for a specific gig.

    Returns basic, standard (if available), and premium (if available) packages.

    - **gig_id**: Gig UUID
    """
    return await gig_service.get_gig_packages(db, gig_id)


@router.post("/", response_model=GigResponse, status_code=status.HTTP_201_CREATED)
async def create_gig(
    gig_data: GigCreate,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new gig (creator only).

    Requires authentication with 'creator' role.

    - **gig_data**: Gig creation data including:
      - Basic package (required)
      - Standard package (optional)
      - Premium package (optional)
      - Category, description, media, etc.
    """
    # Verify user has creator role
    user_role = current_user.get("role")
    if user_role not in ["creator", "both"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only creators can create gigs"
        )

    # Get creator_profile_id from token
    # In a real implementation, you would fetch this from the database
    # For now, we'll use a placeholder from the token
    creator_profile_id = current_user.get("creator_profile_id")
    if not creator_profile_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Creator profile not found"
        )

    return await gig_service.create_gig(db, gig_data, UUID(creator_profile_id))


@router.put("/{gig_id}", response_model=GigResponse)
async def update_gig(
    gig_id: UUID,
    gig_update: GigUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Update an existing gig (owner only).

    Requires authentication and ownership of the gig.

    - **gig_id**: Gig UUID to update
    - **gig_update**: Fields to update (all optional)
    """
    # Verify user has creator role
    user_role = current_user.get("role")
    if user_role not in ["creator", "both"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only creators can update gigs"
        )

    # Get creator_profile_id from token
    creator_profile_id = current_user.get("creator_profile_id")
    if not creator_profile_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Creator profile not found"
        )

    return await gig_service.update_gig(
        db, gig_id, gig_update, UUID(creator_profile_id)
    )


@router.delete("/{gig_id}", response_model=Dict[str, str])
async def delete_gig(
    gig_id: UUID,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Delete a gig (owner only).

    Soft deletes the gig by setting status to 'deleted'.
    Requires authentication and ownership of the gig.

    - **gig_id**: Gig UUID to delete
    """
    # Verify user has creator role
    user_role = current_user.get("role")
    if user_role not in ["creator", "both"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only creators can delete gigs"
        )

    # Get creator_profile_id from token
    creator_profile_id = current_user.get("creator_profile_id")
    if not creator_profile_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Creator profile not found"
        )

    return await gig_service.delete_gig(db, gig_id, UUID(creator_profile_id))


@router.get("/creator/{creator_profile_id}", response_model=GigsListResponse)
async def get_creator_gigs(
    creator_profile_id: UUID,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    gig_status: Optional[str] = Query(None, description="Filter by status"),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all gigs for a specific creator.

    - **creator_profile_id**: Creator profile UUID
    - **skip**: Number of records to skip
    - **limit**: Maximum number of records to return
    - **gig_status**: Optional status filter
    """
    return await gig_service.get_creator_gigs(
        db, creator_profile_id, skip, limit, gig_status
    )
