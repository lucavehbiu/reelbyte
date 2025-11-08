"""Authentication service with business logic."""

from typing import Optional, Dict, Any
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.models.user import User
from app.schemas.user import UserCreate
from app.schemas.auth import TokenData
from app.crud import user as user_crud
from app.core.security import (
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
)


async def create_user(db: AsyncSession, user_data: UserCreate) -> User:
    """Create a new user with hashed password.

    Args:
        db: Database session
        user_data: User creation data

    Returns:
        Created User object

    Raises:
        HTTPException: If user creation fails
    """
    try:
        user = await user_crud.create_user(db, user_data)
        return user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


async def authenticate_user(
    db: AsyncSession,
    email: str,
    password: str
) -> Optional[User]:
    """Authenticate a user by email and password.

    Args:
        db: Database session
        email: User email
        password: Plain text password

    Returns:
        User object if authentication successful, None otherwise
    """
    # Get user by email
    user = await get_user_by_email(db, email)
    if not user:
        return None

    # Verify password
    if not verify_password(password, user.password_hash):
        return None

    # Check if user is active
    if user.status not in ["active", "pending_verification"]:
        return None

    # Update last login time
    await user_crud.update_last_login(db, user.id)
    # Refresh user object to get updated login info
    await db.refresh(user)

    return user


async def get_user_by_email(db: AsyncSession, email: str) -> Optional[User]:
    """Get user by email.

    Args:
        db: Database session
        email: User email

    Returns:
        User object if found, None otherwise
    """
    return await user_crud.get_user_by_email(db, email)


async def create_user_tokens(user: User) -> Dict[str, str]:
    """Create access and refresh tokens for a user.

    Args:
        user: User object

    Returns:
        Dictionary with access_token and refresh_token
    """
    token_data = {
        "sub": str(user.id),
        "email": user.email,
        "user_type": user.user_type,
    }

    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
    }


async def refresh_access_token(
    db: AsyncSession,
    refresh_token: str
) -> Dict[str, str]:
    """Create a new access token from a refresh token.

    Args:
        db: Database session
        refresh_token: Refresh token string

    Returns:
        Dictionary with new access_token and refresh_token

    Raises:
        HTTPException: If refresh token is invalid
    """
    # Decode refresh token
    payload = decode_token(refresh_token)

    # Verify token type
    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type",
        )

    # Get user ID from token
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )

    # Get user from database
    try:
        user_uuid = UUID(user_id)
        user = await user_crud.get_user_by_id(db, user_uuid)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    # Check if user is active
    if user.status not in ["active", "pending_verification"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is inactive",
        )

    # Create new tokens
    return await create_user_tokens(user)


async def get_current_user_from_token(
    db: AsyncSession,
    token_payload: Dict[str, Any]
) -> User:
    """Get the current user from a decoded token payload.

    Args:
        db: Database session
        token_payload: Decoded JWT token payload

    Returns:
        User object

    Raises:
        HTTPException: If user not found or inactive
    """
    user_id = token_payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )

    # Get user from database
    try:
        user_uuid = UUID(user_id)
        user = await user_crud.get_user_by_id(db, user_uuid)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    # Check if user is active
    if user.status not in ["active", "pending_verification"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is inactive",
        )

    return user


async def logout_user(db: AsyncSession, user_id: UUID) -> bool:
    """Logout a user.

    Note: With JWT tokens, actual logout is handled client-side by discarding the tokens.
    This function can be used for server-side cleanup like invalidating sessions
    or adding tokens to a blacklist in Redis (not implemented here).

    Args:
        db: Database session
        user_id: User UUID

    Returns:
        True if successful

    Raises:
        HTTPException: If user not found
    """
    user = await user_crud.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    # In a production system, you might want to:
    # 1. Add the token to a Redis blacklist
    # 2. Store a logout timestamp and check it on token validation
    # 3. Implement short-lived tokens with refresh tokens

    return True
