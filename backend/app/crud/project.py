"""CRUD operations for projects."""

from typing import List, Optional, Tuple
from uuid import UUID
from datetime import datetime

from sqlalchemy import select, func, or_, and_, desc, asc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.project import Project
from app.models.client import ClientProfile


async def get_project_by_id(
    db: AsyncSession,
    project_id: UUID,
    include_client: bool = True
) -> Optional[Project]:
    """
    Get a project by its ID.

    Args:
        db: Database session
        project_id: Project UUID
        include_client: Whether to include client relationship

    Returns:
        Project instance or None if not found
    """
    query = select(Project).where(Project.id == project_id)

    if include_client:
        query = query.options(selectinload(Project.client))

    result = await db.execute(query)
    return result.scalar_one_or_none()


async def increment_view_count(db: AsyncSession, project: Project) -> Project:
    """
    Increment the view count for a project.

    Args:
        db: Database session
        project: Project instance

    Returns:
        Updated Project instance
    """
    project.view_count += 1
    await db.flush()
    await db.refresh(project)
    return project


async def list_projects(
    db: AsyncSession,
    status: Optional[str] = None,
    category: Optional[str] = None,
    video_type: Optional[str] = None,
    experience_level: Optional[str] = None,
    min_budget: Optional[float] = None,
    max_budget: Optional[float] = None,
    search: Optional[str] = None,
    client_profile_id: Optional[UUID] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    skip: int = 0,
    limit: int = 20
) -> Tuple[List[Project], int]:
    """
    List projects with pagination, search, and filters.

    Args:
        db: Database session
        status: Filter by project status
        category: Filter by category
        video_type: Filter by video type
        experience_level: Filter by experience level
        min_budget: Minimum budget filter
        max_budget: Maximum budget filter
        search: Search term for title and description
        client_profile_id: Filter by specific client
        sort_by: Field to sort by
        sort_order: Sort order (asc or desc)
        skip: Number of records to skip
        limit: Maximum number of records to return

    Returns:
        Tuple of (list of projects, total count)
    """
    # Build base query with client relationship loaded
    query = select(Project).options(selectinload(Project.client))
    count_query = select(func.count()).select_from(Project)

    # Build WHERE conditions
    conditions = []

    # Status filter
    if status:
        conditions.append(Project.status == status)

    # Category filter
    if category:
        conditions.append(Project.category == category)

    # Video type filter
    if video_type:
        conditions.append(Project.video_type == video_type)

    # Experience level filter
    if experience_level:
        conditions.append(Project.experience_level == experience_level)

    # Client filter
    if client_profile_id:
        conditions.append(Project.client_profile_id == client_profile_id)

    # Budget range filter
    if min_budget is not None:
        # Check both budget_min and budget_max for range budgets
        conditions.append(
            or_(
                Project.budget_min >= min_budget,
                and_(
                    Project.budget_max.isnot(None),
                    Project.budget_max >= min_budget
                )
            )
        )

    if max_budget is not None:
        # For max budget filter, check that minimum budget is within range
        conditions.append(
            or_(
                Project.budget_min <= max_budget,
                and_(
                    Project.budget_max.isnot(None),
                    Project.budget_max <= max_budget
                )
            )
        )

    # Search in title and description
    if search:
        search_term = f"%{search}%"
        conditions.append(
            or_(
                Project.title.ilike(search_term),
                Project.description.ilike(search_term)
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
    sort_column = Project.created_at  # Default
    if sort_by == "budget":
        sort_column = Project.budget_min
    elif sort_by == "deadline":
        sort_column = Project.deadline_date
    elif sort_by == "proposals":
        sort_column = Project.proposal_count
    elif sort_by == "views":
        sort_column = Project.view_count
    elif sort_by == "created_at":
        sort_column = Project.created_at

    if sort_order == "asc":
        query = query.order_by(asc(sort_column))
    else:
        query = query.order_by(desc(sort_column))

    # Apply pagination
    query = query.offset(skip).limit(limit)

    # Execute query
    result = await db.execute(query)
    projects = result.scalars().all()

    return list(projects), total


async def get_projects_by_client(
    db: AsyncSession,
    client_profile_id: UUID,
    skip: int = 0,
    limit: int = 20,
    status: Optional[str] = None
) -> Tuple[List[Project], int]:
    """
    Get all projects for a specific client.

    Args:
        db: Database session
        client_profile_id: Client profile UUID
        skip: Number of records to skip
        limit: Maximum number of records to return
        status: Optional status filter

    Returns:
        Tuple of (list of projects, total count)
    """
    # Build query
    conditions = [Project.client_profile_id == client_profile_id]

    if status:
        conditions.append(Project.status == status)

    query = select(Project).where(and_(*conditions))
    count_query = select(func.count()).select_from(Project).where(and_(*conditions))

    # Get total count
    total_result = await db.execute(count_query)
    total = total_result.scalar_one()

    # Apply pagination and sorting
    query = query.order_by(desc(Project.created_at)).offset(skip).limit(limit)

    # Execute query
    result = await db.execute(query)
    projects = result.scalars().all()

    return list(projects), total
