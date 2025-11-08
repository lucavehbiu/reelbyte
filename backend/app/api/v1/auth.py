"""Authentication API endpoints."""

from typing import Dict, Any
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.base import get_db
from app.schemas.user import UserCreate, UserResponse
from app.schemas.auth import (
    LoginRequest,
    AuthResponse,
    RefreshTokenRequest,
    TokenResponse,
    MessageResponse,
)
from app.services import auth_service
from app.core.security import get_current_user

router = APIRouter()


@router.post(
    "/register",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
    description="Create a new user account (creator or client) and return authentication tokens"
)
async def register(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db)
) -> AuthResponse:
    """Register a new user.

    Args:
        user_data: User registration data
        db: Database session

    Returns:
        User data and authentication tokens

    Raises:
        HTTPException: If registration fails
    """
    # Create new user
    user = await auth_service.create_user(db, user_data)

    # Generate tokens
    tokens = await auth_service.create_user_tokens(user)

    # Return user data and tokens
    return AuthResponse(
        user=UserResponse.model_validate(user),
        access_token=tokens["access_token"],
        refresh_token=tokens["refresh_token"],
        token_type="bearer"
    )


@router.post(
    "/login",
    response_model=AuthResponse,
    summary="Login with email and password",
    description="Authenticate user with email and password, return JWT tokens"
)
async def login(
    login_data: LoginRequest,
    db: AsyncSession = Depends(get_db)
) -> AuthResponse:
    """Login with email and password.

    Args:
        login_data: Login credentials
        db: Database session

    Returns:
        User data and authentication tokens

    Raises:
        HTTPException: If authentication fails
    """
    # Authenticate user
    user = await auth_service.authenticate_user(
        db,
        login_data.email,
        login_data.password
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Generate tokens
    tokens = await auth_service.create_user_tokens(user)

    # Return user data and tokens
    return AuthResponse(
        user=UserResponse.model_validate(user),
        access_token=tokens["access_token"],
        refresh_token=tokens["refresh_token"],
        token_type="bearer"
    )


@router.post(
    "/refresh",
    response_model=TokenResponse,
    summary="Refresh access token",
    description="Get a new access token using a valid refresh token"
)
async def refresh_token(
    refresh_data: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db)
) -> TokenResponse:
    """Refresh access token.

    Args:
        refresh_data: Refresh token
        db: Database session

    Returns:
        New access and refresh tokens

    Raises:
        HTTPException: If refresh token is invalid
    """
    # Get new tokens
    tokens = await auth_service.refresh_access_token(
        db,
        refresh_data.refresh_token
    )

    return TokenResponse(
        access_token=tokens["access_token"],
        refresh_token=tokens["refresh_token"],
        token_type="bearer"
    )


@router.post(
    "/logout",
    response_model=MessageResponse,
    summary="Logout user",
    description="Invalidate all user tokens by incrementing token version"
)
async def logout(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> MessageResponse:
    """Logout user.

    This invalidates all existing tokens by incrementing the user's token version.

    Args:
        current_user: Current authenticated user from token
        db: Database session

    Returns:
        Success message

    Raises:
        HTTPException: If logout fails
    """
    user_id = UUID(current_user.get("sub"))

    # Logout user (client-side token discarding)
    await auth_service.logout_user(db, user_id)

    return MessageResponse(message="Successfully logged out")


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current user information",
    description="Get the currently authenticated user's profile information"
)
async def get_current_user_info(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> UserResponse:
    """Get current user information.

    Args:
        current_user: Current authenticated user from token
        db: Database session

    Returns:
        Current user's profile information

    Raises:
        HTTPException: If user not found
    """
    # Get full user data from database
    user = await auth_service.get_current_user_from_token(db, current_user)

    return UserResponse.model_validate(user)
