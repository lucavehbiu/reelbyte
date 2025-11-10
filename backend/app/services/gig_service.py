"""Business logic for gig operations."""

from typing import List, Optional, Dict, Any
from uuid import UUID
import re
from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud import gig as gig_crud
from app.schemas.gig import (
    GigCreate, GigUpdate, GigResponse, GigsListResponse,
    GigSearchFilters, GigPackageResponse
)
from app.models.gig import Gig


def generate_slug(title: str, creator_id: UUID) -> str:
    """
    Generate a URL-friendly slug from gig title and creator ID.

    Args:
        title: Gig title
        creator_id: Creator profile UUID

    Returns:
        URL-friendly slug
    """
    # Convert to lowercase and replace spaces with hyphens
    slug = title.lower().strip()
    # Remove special characters
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    # Replace multiple spaces/hyphens with single hyphen
    slug = re.sub(r'[\s-]+', '-', slug)
    # Trim hyphens from ends
    slug = slug.strip('-')
    # Add short creator ID suffix for uniqueness
    creator_suffix = str(creator_id).split('-')[0]
    slug = f"{slug}-{creator_suffix}"

    return slug


async def list_gigs(
    db: AsyncSession,
    filters: GigSearchFilters
) -> GigsListResponse:
    """
    List gigs with pagination, search, and filters.

    Args:
        db: Database session
        filters: Search and filter parameters

    Returns:
        GigsListResponse with gigs and pagination info
    """
    gigs, total = await gig_crud.list_gigs(db, filters)

    # Convert to response models
    gig_responses = [GigResponse.model_validate(gig) for gig in gigs]

    return GigsListResponse(
        gigs=gig_responses,
        total=total,
        skip=filters.skip,
        limit=filters.limit,
        has_more=(filters.skip + filters.limit) < total
    )


async def get_gig_by_id(
    db: AsyncSession,
    gig_id: UUID,
    increment_views: bool = False
) -> GigResponse:
    """
    Get a gig by ID.

    Args:
        db: Database session
        gig_id: Gig UUID
        increment_views: Whether to increment view count

    Returns:
        GigResponse

    Raises:
        HTTPException: If gig not found
    """
    gig = await gig_crud.get_gig_by_id(db, gig_id)

    if not gig:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gig not found"
        )

    # Increment view count if requested
    if increment_views:
        gig = await gig_crud.increment_view_count(db, gig)

    return GigResponse.model_validate(gig)


async def get_gig_packages(
    db: AsyncSession,
    gig_id: UUID
) -> List[GigPackageResponse]:
    """
    Get all pricing packages for a gig.

    Args:
        db: Database session
        gig_id: Gig UUID

    Returns:
        List of GigPackageResponse

    Raises:
        HTTPException: If gig not found
    """
    gig = await gig_crud.get_gig_by_id(db, gig_id)

    if not gig:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gig not found"
        )

    packages = []

    # Always include basic package
    packages.append(GigPackageResponse(
        package_type="basic",
        price=gig.basic_price,
        description=gig.basic_description,
        delivery_days=gig.basic_delivery_days,
        revisions=gig.basic_revisions
    ))

    # Include standard package if defined
    if gig.standard_price is not None:
        packages.append(GigPackageResponse(
            package_type="standard",
            price=gig.standard_price,
            description=gig.standard_description,
            delivery_days=gig.standard_delivery_days,
            revisions=gig.standard_revisions
        ))

    # Include premium package if defined
    if gig.premium_price is not None:
        packages.append(GigPackageResponse(
            package_type="premium",
            price=gig.premium_price,
            description=gig.premium_description,
            delivery_days=gig.premium_delivery_days,
            revisions=gig.premium_revisions
        ))

    return packages


async def create_gig(
    db: AsyncSession,
    gig_data: GigCreate,
    creator_profile_id: UUID
) -> GigResponse:
    """
    Create a new gig.

    Args:
        db: Database session
        gig_data: Gig creation data
        creator_profile_id: Creator profile UUID

    Returns:
        GigResponse

    Raises:
        HTTPException: If validation fails
    """
    # Generate slug
    base_slug = generate_slug(gig_data.title, creator_profile_id)
    slug = base_slug

    # Ensure slug is unique
    counter = 1
    while await gig_crud.check_slug_exists(db, slug):
        slug = f"{base_slug}-{counter}"
        counter += 1

    # Create gig
    gig = await gig_crud.create_gig(
        db=db,
        gig_data=gig_data,
        creator_profile_id=creator_profile_id,
        slug=slug
    )

    return GigResponse.model_validate(gig)


async def update_gig(
    db: AsyncSession,
    gig_id: UUID,
    gig_update: GigUpdate,
    creator_profile_id: UUID
) -> GigResponse:
    """
    Update an existing gig.

    Args:
        db: Database session
        gig_id: Gig UUID
        gig_update: Update data
        creator_profile_id: Creator profile UUID (for authorization)

    Returns:
        GigResponse

    Raises:
        HTTPException: If gig not found or unauthorized
    """
    gig = await gig_crud.get_gig_by_id(db, gig_id)

    if not gig:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gig not found"
        )

    # Check ownership
    if gig.creator_profile_id != creator_profile_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this gig"
        )

    # Update gig
    updated_gig = await gig_crud.update_gig(db, gig, gig_update)

    return GigResponse.model_validate(updated_gig)


async def delete_gig(
    db: AsyncSession,
    gig_id: UUID,
    creator_profile_id: UUID
) -> Dict[str, str]:
    """
    Delete a gig (soft delete by setting status to 'deleted').

    Args:
        db: Database session
        gig_id: Gig UUID
        creator_profile_id: Creator profile UUID (for authorization)

    Returns:
        Success message

    Raises:
        HTTPException: If gig not found or unauthorized
    """
    gig = await gig_crud.get_gig_by_id(db, gig_id)

    if not gig:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gig not found"
        )

    # Check ownership
    if gig.creator_profile_id != creator_profile_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this gig"
        )

    # Prevent deletion if gig has active orders
    if gig.order_count > 0 and gig.status == "active":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete gig with active orders. Please pause it instead."
        )

    # Delete gig
    await gig_crud.delete_gig(db, gig)

    return {"message": "Gig deleted successfully"}


async def get_creator_gigs(
    db: AsyncSession,
    creator_profile_id: UUID,
    skip: int = 0,
    limit: int = 20,
    status: Optional[str] = None
) -> GigsListResponse:
    """
    Get all gigs for a specific creator.

    Args:
        db: Database session
        creator_profile_id: Creator profile UUID
        skip: Number of records to skip
        limit: Maximum number of records to return
        status: Optional status filter

    Returns:
        GigsListResponse
    """
    gigs, total = await gig_crud.get_gigs_by_creator(
        db, creator_profile_id, skip, limit, status
    )

    gig_responses = [GigResponse.model_validate(gig) for gig in gigs]

    return GigsListResponse(
        gigs=gig_responses,
        total=total,
        skip=skip,
        limit=limit,
        has_more=(skip + limit) < total
    )


async def validate_gig_ownership(
    db: AsyncSession,
    gig_id: UUID,
    creator_profile_id: UUID
) -> Gig:
    """
    Validate that a gig exists and belongs to the specified creator.

    Args:
        db: Database session
        gig_id: Gig UUID
        creator_profile_id: Creator profile UUID

    Returns:
        Gig instance

    Raises:
        HTTPException: If gig not found or not owned by creator
    """
    gig = await gig_crud.get_gig_by_id(db, gig_id)

    if not gig:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gig not found"
        )

    if gig.creator_profile_id != creator_profile_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this gig"
        )

    return gig
