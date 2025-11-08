"""CRUD operations for User model."""

from typing import Optional
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import hash_password


async def get_user_by_id(db: AsyncSession, user_id: UUID) -> Optional[User]:
    """Get a user by their ID.

    Args:
        db: Database session
        user_id: User UUID

    Returns:
        User object if found, None otherwise
    """
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    return result.scalar_one_or_none()


async def get_user_by_email(db: AsyncSession, email: str) -> Optional[User]:
    """Get a user by their email address.

    Args:
        db: Database session
        email: User email address

    Returns:
        User object if found, None otherwise
    """
    result = await db.execute(
        select(User).where(User.email == email)
    )
    return result.scalar_one_or_none()


async def create_user(db: AsyncSession, user_data: UserCreate) -> User:
    """Create a new user.

    Args:
        db: Database session
        user_data: User creation data

    Returns:
        Created User object

    Raises:
        ValueError: If user with email already exists
    """
    # Check if user with email already exists
    existing_user = await get_user_by_email(db, user_data.email)
    if existing_user:
        raise ValueError("User with this email already exists")

    # Create new user with hashed password
    db_user = User(
        email=user_data.email,
        password_hash=hash_password(user_data.password),
        user_type=user_data.user_type,
        phone_number=user_data.phone_number,
        status="pending_verification",  # New users start with pending_verification
    )

    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)

    return db_user


async def update_user(
    db: AsyncSession,
    user_id: UUID,
    user_data: UserUpdate
) -> Optional[User]:
    """Update user information.

    Args:
        db: Database session
        user_id: User UUID
        user_data: User update data

    Returns:
        Updated User object if found, None otherwise

    Raises:
        ValueError: If email already exists for another user
    """
    # Get existing user
    user = await get_user_by_id(db, user_id)
    if not user:
        return None

    # Check if new email is already taken by another user
    if user_data.email and user_data.email != user.email:
        existing_user = await get_user_by_email(db, user_data.email)
        if existing_user:
            raise ValueError("Email already exists")

    # Update user fields
    update_data = user_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)

    await db.commit()
    await db.refresh(user)

    return user


async def delete_user(db: AsyncSession, user_id: UUID) -> bool:
    """Delete a user (soft delete by setting status to 'deleted').

    Args:
        db: Database session
        user_id: User UUID

    Returns:
        True if user was deleted, False if not found
    """
    user = await get_user_by_id(db, user_id)
    if not user:
        return False

    user.status = "deleted"
    await db.commit()

    return True


async def verify_user_email(db: AsyncSession, user_id: UUID) -> Optional[User]:
    """Verify a user's email and activate their account.

    Args:
        db: Database session
        user_id: User UUID

    Returns:
        Updated User object if found, None otherwise
    """
    user = await get_user_by_id(db, user_id)
    if not user:
        return None

    user.email_verified = True
    user.status = "active"
    await db.commit()
    await db.refresh(user)

    return user


async def update_last_login(db: AsyncSession, user_id: UUID) -> Optional[User]:
    """Update user's last login timestamp and increment login count.

    Args:
        db: Database session
        user_id: User UUID

    Returns:
        Updated User object if found, None otherwise
    """
    from datetime import datetime

    user = await get_user_by_id(db, user_id)
    if not user:
        return None

    user.last_login_at = datetime.utcnow()
    user.login_count += 1
    await db.commit()
    await db.refresh(user)

    return user
