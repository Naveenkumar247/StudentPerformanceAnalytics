from pydantic_settings import BaseSettings
from pydantic import Field
from typing import Optional


class Settings(BaseSettings):
    """
    All application settings are read from environment variables.
    Pydantic Settings will look for a .env file automatically.
    """

    # ── Project metadata ──────────────────────────────────────────────────────
    PROJECT_NAME: str = Field(default="Advanced Student Management System")
    API_V1_STR: str = Field(default="/api/v1")

    # ── PostgreSQL connection parts (used for local fallback) ─────────────────
    POSTGRES_SERVER: str = Field(default="localhost")
    POSTGRES_PORT: int = Field(default=5432)
    POSTGRES_USER: str = Field(default="postgres")
    POSTGRES_PASSWORD: str = Field(default="postgres")
    POSTGRES_DB: str = Field(default="student_erp")

    # 1. Allow Pydantic to read DATABASE_URL directly from Render environment variables
    DATABASE_URL_ENV: Optional[str] = Field(default=None, alias="DATABASE_URL")

    # ── Computed sync URL (Fallback logic) ────────────────────────────────────
    @property
    def DATABASE_URL(self) -> str:
        """
        Synchronous PostgreSQL URL.
        Prioritizes the raw DATABASE_URL env var from Render, fixes the prefix,
        and falls back to constructing it from parts locally.
        """
        # If Render provided a raw DATABASE_URL, use it!
        if self.DATABASE_URL_ENV:
            url = self.DATABASE_URL_ENV
            # Fix Render's 'postgres://' vs 'postgresql://' driver issue
            if url.startswith("postgres://"):
                url = url.replace("postgres://", "postgresql+psycopg2://", 1)
            elif url.startswith("postgresql://"):
                url = url.replace("postgresql://", "postgresql+psycopg2://", 1)
            return url

        # Local fallback using individual pieces
        return (
            f"postgresql+psycopg2://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        # Allows matching the incoming "DATABASE_URL" env var to our "DATABASE_URL_ENV" field
        populate_by_name = True 


# Create a single shared instance — import this everywhere
settings = Settings()
