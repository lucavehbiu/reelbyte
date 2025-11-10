"""API endpoints for projects (restaurant collaboration opportunities)."""

from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.base import get_db
from app.schemas.project import (
    ProjectWithClient,
    ProjectSearchFilters,
    ProjectsListResponse
)
from app.services import project_service


router = APIRouter()


@router.get("/", response_model=ProjectsListResponse)
async def list_projects(
    status: Optional[str] = Query("open", description="Filter by project status"),
    category: Optional[str] = Query(None, description="Filter by category"),
    video_type: Optional[str] = Query(None, description="Filter by video type"),
    experience_level: Optional[str] = Query(None, description="Filter by experience level"),
    min_budget: Optional[float] = Query(None, ge=0, description="Minimum budget"),
    max_budget: Optional[float] = Query(None, ge=0, description="Maximum budget"),
    search: Optional[str] = Query(None, description="Search in title and description"),
    client_profile_id: Optional[UUID] = Query(None, description="Filter by client"),
    sort_by: str = Query("created_at", description="Sort field: created_at, budget, deadline, proposals, views"),
    sort_order: str = Query("desc", description="Sort order: asc or desc"),
    page: int = Query(1, ge=1, description="Page number (1-indexed)"),
    page_size: int = Query(12, ge=1, le=100, description="Number of records per page"),
    db: AsyncSession = Depends(get_db)
):
    """
    List and search restaurant collaboration projects with filters and pagination.

    - **status**: Filter by project status (default: open)
    - **category**: Filter by category
    - **video_type**: Filter by video type (Instagram Reel, TikTok, etc.)
    - **experience_level**: Filter by required experience level
    - **min_budget**: Minimum budget filter
    - **max_budget**: Maximum budget filter
    - **search**: Search term for title and description
    - **client_profile_id**: Filter by specific restaurant/client
    - **sort_by**: Field to sort by
    - **sort_order**: Sort order (asc or desc)
    - **page**: Page number (1-indexed)
    - **page_size**: Number of records per page (default: 12)
    """
    # Convert page to skip offset (page is 1-indexed)
    skip = (page - 1) * page_size

    filters = ProjectSearchFilters(
        status=status,
        category=category,
        video_type=video_type,
        experience_level=experience_level,
        min_budget=min_budget,
        max_budget=max_budget,
        search=search,
        client_profile_id=client_profile_id,
        sort_by=sort_by,
        sort_order=sort_order,
        skip=skip,
        limit=page_size
    )

    return await project_service.list_projects(db, filters)


@router.get("/{project_id}", response_model=ProjectWithClient)
async def get_project(
    project_id: UUID,
    increment_views: bool = Query(False, description="Increment view count"),
    db: AsyncSession = Depends(get_db)
):
    """
    Get a single project by ID.

    - **project_id**: Project UUID
    - **increment_views**: Whether to increment the view count (default: false)
    """
    return await project_service.get_project_by_id(db, project_id, increment_views=increment_views)


@router.get("/client/{client_profile_id}", response_model=ProjectsListResponse)
async def get_client_projects(
    client_profile_id: UUID,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: Optional[str] = Query(None, description="Filter by status"),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all projects for a specific restaurant/client.

    - **client_profile_id**: Client profile UUID
    - **page**: Page number (1-indexed)
    - **page_size**: Number of records per page
    - **status**: Optional status filter
    """
    skip = (page - 1) * page_size
    return await project_service.get_client_projects(
        db, client_profile_id, skip, page_size, status
    )
