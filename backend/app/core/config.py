"""Application configuration settings."""

from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # App
    APP_NAME: str = "ReelByte"
    DEBUG: bool = False
    ENVIRONMENT: str = "production"

    # API
    API_V1_PREFIX: str = "/v1"
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "https://reelbyte.com"]
    ALLOWED_HOSTS: List[str] = ["*"]  # Allow all hosts in development
    CORS_ORIGINS: str = ""  # Comma-separated list of allowed origins for production

    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/reelbyte"
    DB_POOL_SIZE: int = 20
    DB_MAX_OVERFLOW: int = 40

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    REDIS_TTL: int = 3600

    # Security
    SECRET_KEY: str = "change-this-to-a-secure-secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    PASSWORD_MIN_LENGTH: int = 8

    # Mollie Payment Integration
    MOLLIE_API_KEY: str = ""
    MOLLIE_PARTNER_ID: str = ""
    PLATFORM_FEE_PERCENTAGE: float = 15.0
    MINIMUM_PAYOUT: float = 20.0

    # Cloudinary File Storage
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""
    MAX_VIDEO_SIZE_MB: int = 500
    MAX_IMAGE_SIZE_MB: int = 10

    # CORS
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: List[str] = ["*"]
    CORS_ALLOW_HEADERS: List[str] = ["*"]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # If CORS_ORIGINS is set, use it to override ALLOWED_ORIGINS
        if self.CORS_ORIGINS:
            self.ALLOWED_ORIGINS = [origin.strip() for origin in self.CORS_ORIGINS.split(",")]


settings = Settings()
