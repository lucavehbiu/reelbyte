"""Authentication Pydantic schemas for request/response validation."""

from pydantic import BaseModel, EmailStr, Field

from app.schemas.user import UserResponse


class LoginRequest(BaseModel):
    """Schema for login request."""

    email: EmailStr
    password: str = Field(..., min_length=1)


class TokenResponse(BaseModel):
    """Schema for token response."""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshTokenRequest(BaseModel):
    """Schema for refresh token request."""

    refresh_token: str


class TokenData(BaseModel):
    """Schema for decoded token data."""

    user_id: int
    email: str
    role: str


class AuthResponse(BaseModel):
    """Schema for authentication response with user data and tokens."""

    user: UserResponse
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class MessageResponse(BaseModel):
    """Schema for simple message responses."""

    message: str
