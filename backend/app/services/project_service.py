"""Business logic for project operations."""

from typing import List
from uuid import UUID
import math

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud import project as project_crud
from app.schemas.project import (
    ProjectWithClient,
    ProjectSearchFilters,
    ProjectsListResponse,
    ClientSummary
)


async def list_projects(
    db: AsyncSession,
    filters: ProjectSearchFilters
) -> ProjectsListResponse:
    """
    List projects with pagination, search, and filters.

    Args:
        db: Database session
        filters: Search and filter parameters

    Returns:
        ProjectsListResponse with projects and pagination info
    """
    projects, total = await project_crud.list_projects(
        db,
        status=filters.status,
        category=filters.category,
        video_type=filters.video_type,
        experience_level=filters.experience_level,
        min_budget=filters.min_budget,
        max_budget=filters.max_budget,
        search=filters.search,
        client_profile_id=filters.client_profile_id,
        sort_by=filters.sort_by,
        sort_order=filters.sort_order,
        skip=filters.skip,
        limit=filters.limit
    )

    # Convert to response models with nested client data
    project_responses = []
    for project in projects:
        # Create client summary from nested relationship
        client_summary = ClientSummary(
            id=project.client.id,
            user_id=project.client.user_id,
            company_name=project.client.company_name,
            company_logo_url=project.client.company_logo_url,
            industry=project.client.industry,
            website_url=project.client.website_url,
            is_verified=project.client.is_verified,
            total_jobs_posted=project.client.total_jobs_posted,
            average_rating=project.client.average_rating,
            total_reviews=project.client.total_reviews,
            description=project.client.description
        )

        # Create project response with client
        project_response = ProjectWithClient(
            id=project.id,
            client_profile_id=project.client_profile_id,
            title=project.title,
            description=project.description,
            category=project.category,
            video_type=project.video_type,
            video_duration_preference=project.video_duration_preference,
            platform_preference=project.platform_preference,
            budget_type=project.budget_type,
            budget_min=project.budget_min,
            budget_max=project.budget_max,
            deadline_date=project.deadline_date,
            estimated_duration_days=project.estimated_duration_days,
            required_skills=project.required_skills,
            experience_level=project.experience_level,
            view_count=project.view_count,
            proposal_count=project.proposal_count,
            status=project.status,
            created_at=project.created_at,
            updated_at=project.updated_at,
            published_at=project.published_at,
            closed_at=project.closed_at,
            client=client_summary
        )
        project_responses.append(project_response)

    # Calculate pagination info
    page = (filters.skip // filters.limit) + 1
    total_pages = math.ceil(total / filters.limit) if total > 0 else 0

    return ProjectsListResponse(
        projects=project_responses,
        total=total,
        page=page,
        page_size=filters.limit,
        total_pages=total_pages
    )


async def get_project_by_id(
    db: AsyncSession,
    project_id: UUID,
    increment_views: bool = False
) -> ProjectWithClient:
    """
    Get a project by ID.

    Args:
        db: Database session
        project_id: Project UUID
        increment_views: Whether to increment view count

    Returns:
        ProjectWithClient

    Raises:
        HTTPException: If project not found
    """
    project = await project_crud.get_project_by_id(db, project_id, include_client=True)

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    # Increment view count if requested
    if increment_views:
        project = await project_crud.increment_view_count(db, project)

    # Create client summary
    client_summary = ClientSummary(
        id=project.client.id,
        user_id=project.client.user_id,
        company_name=project.client.company_name,
        company_logo_url=project.client.company_logo_url,
        industry=project.client.industry,
        website_url=project.client.website_url,
        is_verified=project.client.is_verified,
        total_jobs_posted=project.client.total_jobs_posted,
        average_rating=project.client.average_rating,
        total_reviews=project.client.total_reviews,
        description=project.client.description
    )

    # Create project response
    return ProjectWithClient(
        id=project.id,
        client_profile_id=project.client_profile_id,
        title=project.title,
        description=project.description,
        category=project.category,
        video_type=project.video_type,
        video_duration_preference=project.video_duration_preference,
        platform_preference=project.platform_preference,
        budget_type=project.budget_type,
        budget_min=project.budget_min,
        budget_max=project.budget_max,
        deadline_date=project.deadline_date,
        estimated_duration_days=project.estimated_duration_days,
        required_skills=project.required_skills,
        experience_level=project.experience_level,
        view_count=project.view_count,
        proposal_count=project.proposal_count,
        status=project.status,
        created_at=project.created_at,
        updated_at=project.updated_at,
        published_at=project.published_at,
        closed_at=project.closed_at,
        client=client_summary
    )


async def get_client_projects(
    db: AsyncSession,
    client_profile_id: UUID,
    skip: int = 0,
    limit: int = 20,
    status: str = None
) -> ProjectsListResponse:
    """
    Get all projects for a specific client.

    Args:
        db: Database session
        client_profile_id: Client profile UUID
        skip: Number of records to skip
        limit: Maximum number of records to return
        status: Optional status filter

    Returns:
        ProjectsListResponse
    """
    projects, total = await project_crud.get_projects_by_client(
        db, client_profile_id, skip, limit, status
    )

    # Convert to response models
    project_responses = []
    for project in projects:
        client_summary = ClientSummary(
            id=project.client.id,
            user_id=project.client.user_id,
            company_name=project.client.company_name,
            company_logo_url=project.client.company_logo_url,
            industry=project.client.industry,
            website_url=project.client.website_url,
            is_verified=project.client.is_verified,
            total_jobs_posted=project.client.total_jobs_posted,
            average_rating=project.client.average_rating,
            total_reviews=project.client.total_reviews,
            description=project.client.description
        )

        project_response = ProjectWithClient(
            id=project.id,
            client_profile_id=project.client_profile_id,
            title=project.title,
            description=project.description,
            category=project.category,
            video_type=project.video_type,
            video_duration_preference=project.video_duration_preference,
            platform_preference=project.platform_preference,
            budget_type=project.budget_type,
            budget_min=project.budget_min,
            budget_max=project.budget_max,
            deadline_date=project.deadline_date,
            estimated_duration_days=project.estimated_duration_days,
            required_skills=project.required_skills,
            experience_level=project.experience_level,
            view_count=project.view_count,
            proposal_count=project.proposal_count,
            status=project.status,
            created_at=project.created_at,
            updated_at=project.updated_at,
            published_at=project.published_at,
            closed_at=project.closed_at,
            client=client_summary
        )
        project_responses.append(project_response)

    page = (skip // limit) + 1
    total_pages = math.ceil(total / limit) if total > 0 else 0

    return ProjectsListResponse(
        projects=project_responses,
        total=total,
        page=page,
        page_size=limit,
        total_pages=total_pages
    )
