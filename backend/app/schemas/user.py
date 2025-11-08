"""
User authentication and profile schemas.
"""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_validator


# ============================================================================
# User Authentication Schemas
# ============================================================================

class UserCreate(BaseModel):
    """Schema for creating a new user account."""

    email: EmailStr = Field(..., description="User's email address")
    password: str = Field(..., min_length=8, max_length=100, description="User password (min 8 characters)")
    user_type: str = Field(..., description="User type: creator, client, or both")

    @field_validator("user_type")
    @classmethod
    def validate_user_type(cls, v: str) -> str:
        """Validate user type is one of the allowed values."""
        allowed_types = {"creator", "client", "both"}
        if v not in allowed_types:
            raise ValueError(f"user_type must be one of: {', '.join(allowed_types)}")
        return v

    @field_validator("password")
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        """Validate password strength requirements."""
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(c.islower() for c in v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one digit")
        return v


class UserLogin(BaseModel):
    """Schema for user login."""

    email: EmailStr = Field(..., description="User's email address")
    password: str = Field(..., description="User password")


class UserUpdate(BaseModel):
    """Schema for updating user information."""

    email: Optional[EmailStr] = Field(None, description="Updated email address")
    phone_number: Optional[str] = Field(None, max_length=20, description="Phone number")
    two_factor_enabled: Optional[bool] = Field(None, description="Enable/disable two-factor authentication")

    @field_validator("phone_number")
    @classmethod
    def validate_phone_number(cls, v: Optional[str]) -> Optional[str]:
        """Validate phone number format."""
        if v is not None and v != "":
            # Remove common separators
            cleaned = v.replace("-", "").replace("(", "").replace(")", "").replace(" ", "")
            if not cleaned.startswith("+") and not cleaned.isdigit():
                raise ValueError("Invalid phone number format")
        return v


class UserResponse(BaseModel):
    """Schema for user response (excludes sensitive data like password)."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID = Field(..., description="User's unique identifier")
    email: EmailStr = Field(..., description="User's email address")
    user_type: str = Field(..., description="User type: creator, client, or both")
    status: str = Field(..., description="Account status")
    email_verified: bool = Field(..., description="Whether email is verified")
    phone_number: Optional[str] = Field(None, description="User's phone number")
    phone_verified: bool = Field(..., description="Whether phone is verified")
    two_factor_enabled: bool = Field(..., description="Whether 2FA is enabled")
    last_login_at: Optional[datetime] = Field(None, description="Last login timestamp")
    login_count: int = Field(..., description="Total login count")
    created_at: datetime = Field(..., description="Account creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")


class UserPublicProfile(BaseModel):
    """Schema for public user information (minimal data)."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID = Field(..., description="User's unique identifier")
    user_type: str = Field(..., description="User type")
    created_at: datetime = Field(..., description="Account creation timestamp")


# ============================================================================
# Token Schemas
# ============================================================================

class Token(BaseModel):
    """Schema for JWT access token response."""

    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field(default="bearer", description="Token type")
    expires_in: int = Field(..., description="Token expiration time in seconds")


class TokenData(BaseModel):
    """Schema for token payload data."""

    user_id: UUID = Field(..., description="User ID from token")
    email: str = Field(..., description="User email from token")
    user_type: str = Field(..., description="User type from token")


class RefreshToken(BaseModel):
    """Schema for refresh token request."""

    refresh_token: str = Field(..., description="Refresh token")


# ============================================================================
# Password Reset Schemas
# ============================================================================

class PasswordResetRequest(BaseModel):
    """Schema for requesting a password reset."""

    email: EmailStr = Field(..., description="Email address for password reset")


class PasswordResetConfirm(BaseModel):
    """Schema for confirming password reset with token."""

    token: str = Field(..., description="Password reset token")
    new_password: str = Field(..., min_length=8, max_length=100, description="New password")

    @field_validator("new_password")
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        """Validate password strength requirements."""
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(c.islower() for c in v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one digit")
        return v


class PasswordChange(BaseModel):
    """Schema for changing password (when logged in)."""

    current_password: str = Field(..., description="Current password")
    new_password: str = Field(..., min_length=8, max_length=100, description="New password")

    @field_validator("new_password")
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        """Validate password strength requirements."""
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(c.islower() for c in v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one digit")
        return v


# ============================================================================
# Email Verification Schemas
# ============================================================================

class EmailVerificationRequest(BaseModel):
    """Schema for requesting email verification."""

    email: EmailStr = Field(..., description="Email to verify")


class EmailVerificationConfirm(BaseModel):
    """Schema for confirming email verification."""

    token: str = Field(..., description="Email verification token")
