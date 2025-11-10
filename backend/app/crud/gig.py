"""CRUD operations for gigs."""

from typing import List, Optional, Dict, Any
from uuid import UUID
from decimal import Decimal
from datetime import datetime

from sqlalchemy import select, func, or_, and_, desc, asc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.gig import Gig
from app.schemas.gig import GigCreate, GigUpdate, GigSearchFilters


async def create_gig(
    db: AsyncSession,
    gig_data: GigCreate,
    creator_profile_id: UUID,
    slug: str
) -> Gig:
    """
    Create a new gig in the database.

    Args:
        db: Database session
        gig_data: Gig creation data
        creator_profile_id: ID of the creator profile
        slug: URL-friendly slug for the gig

    Returns:
        Created Gig instance
    """
    # Convert video_samples list to JSONB format
    video_samples_jsonb = None
    if gig_data.video_samples:
        video_samples_jsonb = {"urls": gig_data.video_samples}

    gig = Gig(
        creator_profile_id=creator_profile_id,
        slug=slug,
        title=gig_data.title,
        description=gig_data.description,
        category=gig_data.category,
        subcategory=gig_data.subcategory,
        video_type=gig_data.video_type,
        requirements=gig_data.requirements,
        search_tags=gig_data.search_tags,
        # Basic package
        basic_price=gig_data.basic_price,
        basic_description=gig_data.basic_description,
        basic_delivery_days=gig_data.basic_delivery_days,
        basic_revisions=gig_data.basic_revisions,
        # Standard package
        standard_price=gig_data.standard_price,
        standard_description=gig_data.standard_description,
        standard_delivery_days=gig_data.standard_delivery_days,
        standard_revisions=gig_data.standard_revisions,
        # Premium package
        premium_price=gig_data.premium_price,
        premium_description=gig_data.premium_description,
        premium_delivery_days=gig_data.premium_delivery_days,
        premium_revisions=gig_data.premium_revisions,
        # Media
        thumbnail_url=gig_data.thumbnail_url,
        video_samples=video_samples_jsonb,
    )

    db.add(gig)
    await db.flush()
    await db.refresh(gig)
    return gig


async def get_gig_by_id(db: AsyncSession, gig_id: UUID) -> Optional[Gig]:
    """
    Get a gig by its ID.

    Args:
        db: Database session
        gig_id: Gig UUID

    Returns:
        Gig instance or None if not found
    """
    result = await db.execute(
        select(Gig).options(selectinload(Gig.creator)).where(Gig.id == gig_id)
    )
    return result.scalar_one_or_none()


async def get_gig_by_slug(db: AsyncSession, slug: str) -> Optional[Gig]:
    """
    Get a gig by its slug.

    Args:
        db: Database session
        slug: Gig slug

    Returns:
        Gig instance or None if not found
    """
    result = await db.execute(
        select(Gig).where(Gig.slug == slug)
    )
    return result.scalar_one_or_none()


async def update_gig(
    db: AsyncSession,
    gig: Gig,
    gig_update: GigUpdate
) -> Gig:
    """
    Update a gig with new data.

    Args:
        db: Database session
        gig: Existing Gig instance
        gig_update: Update data

    Returns:
        Updated Gig instance
    """
    update_data = gig_update.model_dump(exclude_unset=True)

    # Handle video_samples conversion
    if 'video_samples' in update_data and update_data['video_samples'] is not None:
        update_data['video_samples'] = {"urls": update_data['video_samples']}

    # Update published_at when status changes to active
    if update_data.get('status') == 'active' and gig.status != 'active':
        update_data['published_at'] = datetime.utcnow()

    for field, value in update_data.items():
        setattr(gig, field, value)

    await db.flush()
    await db.refresh(gig)
    return gig


async def delete_gig(db: AsyncSession, gig: Gig) -> bool:
    """
    Soft delete a gig by setting status to 'deleted'.

    Args:
        db: Database session
        gig: Gig instance to delete

    Returns:
        True if successful
    """
    gig.status = "deleted"
    await db.flush()
    return True


async def increment_view_count(db: AsyncSession, gig: Gig) -> Gig:
    """
    Increment the view count for a gig.

    Args:
        db: Database session
        gig: Gig instance

    Returns:
        Updated Gig instance
    """
    gig.view_count += 1
    await db.flush()
    await db.refresh(gig)
    return gig


async def list_gigs(
    db: AsyncSession,
    filters: GigSearchFilters
) -> tuple[List[Gig], int]:
    """
    List gigs with pagination, search, and filters.

    Args:
        db: Database session
        filters: Search and filter parameters

    Returns:
        Tuple of (list of gigs, total count)
    """
    # Build base query with eager loading of creator profile
    query = select(Gig).options(selectinload(Gig.creator))
    count_query = select(func.count()).select_from(Gig)

    # Build WHERE conditions
    conditions = []

    # Status filter
    if filters.status:
        conditions.append(Gig.status == filters.status.value)

    # Category filter
    if filters.category:
        conditions.append(Gig.category == filters.category)

    # Subcategory filter
    if filters.subcategory:
        conditions.append(Gig.subcategory == filters.subcategory)

    # Video type filter
    if filters.video_type:
        conditions.append(Gig.video_type == filters.video_type)

    # Creator filter
    if filters.creator_profile_id:
        conditions.append(Gig.creator_profile_id == filters.creator_profile_id)

    # Price range filter (check basic price)
    if filters.min_price is not None:
        conditions.append(Gig.basic_price >= filters.min_price)

    if filters.max_price is not None:
        conditions.append(Gig.basic_price <= filters.max_price)

    # Tags filter (gig must have at least one of the provided tags)
    if filters.tags:
        conditions.append(Gig.search_tags.overlap(filters.tags))

    # Search in title and description
    if filters.search:
        search_term = f"%{filters.search}%"
        conditions.append(
            or_(
                Gig.title.ilike(search_term),
                Gig.description.ilike(search_term)
            )
        )

    # Apply conditions to queries
    if conditions:
        query = query.where(and_(*conditions))
        count_query = count_query.where(and_(*conditions))

    # Get total count
    total_result = await db.execute(count_query)
    total = total_result.scalar_one()

    # Apply sorting
    sort_column = Gig.created_at  # Default
    if filters.sort_by == "price":
        sort_column = Gig.basic_price
    elif filters.sort_by == "popularity":
        sort_column = Gig.order_count
    elif filters.sort_by == "views":
        sort_column = Gig.view_count
    elif filters.sort_by == "created_at":
        sort_column = Gig.created_at

    if filters.sort_order == "asc":
        query = query.order_by(asc(sort_column))
    else:
        query = query.order_by(desc(sort_column))

    # Apply pagination
    query = query.offset(filters.skip).limit(filters.limit)

    # Execute query
    result = await db.execute(query)
    gigs = result.scalars().all()

    return list(gigs), total


async def get_gigs_by_creator(
    db: AsyncSession,
    creator_profile_id: UUID,
    skip: int = 0,
    limit: int = 20,
    status: Optional[str] = None
) -> tuple[List[Gig], int]:
    """
    Get all gigs for a specific creator.

    Args:
        db: Database session
        creator_profile_id: Creator profile UUID
        skip: Number of records to skip
        limit: Maximum number of records to return
        status: Optional status filter

    Returns:
        Tuple of (list of gigs, total count)
    """
    # Build query
    conditions = [Gig.creator_profile_id == creator_profile_id]

    if status:
        conditions.append(Gig.status == status)

    query = select(Gig).where(and_(*conditions))
    count_query = select(func.count()).select_from(Gig).where(and_(*conditions))

    # Get total count
    total_result = await db.execute(count_query)
    total = total_result.scalar_one()

    # Apply pagination and sorting
    query = query.order_by(desc(Gig.created_at)).offset(skip).limit(limit)

    # Execute query
    result = await db.execute(query)
    gigs = result.scalars().all()

    return list(gigs), total


async def check_slug_exists(db: AsyncSession, slug: str, exclude_id: Optional[UUID] = None) -> bool:
    """
    Check if a slug already exists.

    Args:
        db: Database session
        slug: Slug to check
        exclude_id: Optional gig ID to exclude from check (for updates)

    Returns:
        True if slug exists, False otherwise
    """
    query = select(Gig).where(Gig.slug == slug)

    if exclude_id:
        query = query.where(Gig.id != exclude_id)

    result = await db.execute(query)
    return result.scalar_one_or_none() is not None
