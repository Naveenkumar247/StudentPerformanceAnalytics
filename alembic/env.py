"""
Alembic environment configuration.

Key integrations:
1. Reads DATABASE_URL from the app's Settings (which reads from Render Env).
2. Sets target_metadata to Base.metadata so autogenerate works.
3. Overrides the sqlalchemy.url in alembic.ini so you only manage the
   database URL in one place (Render Dashboard), not two places.
"""

import os
import sys
from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool
from alembic import context

# ── Make the project root importable ─────────────────────────────────────────
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# ── Import application settings and ALL models ────────────────────────────────
from app.core.config import settings   # noqa: E402
import app.models                      # noqa: E402
from app.models.base import Base       # noqa: E402

# ── Alembic Config object ─────────────────────────────────────────────────────
config = context.config

# Set up Python logging as defined in alembic.ini
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Override the main option with your runtime environment variable
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

# Tell Alembic which metadata to compare against
target_metadata = Base.metadata


# ── Offline migration mode ────────────────────────────────────────────────────
def run_migrations_offline() -> None:
    """
    Run migrations without a live database connection.
    Generates raw SQL that can be applied manually.
    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


# ── Online migration mode ─────────────────────────────────────────────────────
def run_migrations_online() -> None:
    """
    Run migrations with a live database connection.
    This forces Alembic to use the Neon URL injected via Render.
    """
    # Grab the dictionary block from alembic.ini configurations
    alembic_config = config.get_section(config.config_ini_section, {})
    
    # Explicitly overwrite the connection string with your live database URL
    alembic_config["sqlalchemy.url"] = settings.DATABASE_URL

    connectable = engine_from_config(
        alembic_config,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,  # Don't pool connections during database migrations
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,            # Automatically detect column type modifications
            compare_server_default=True,  # Automatically detect server configuration default updates
        )

        with context.begin_transaction():
            context.run_migrations()


# ── Entry point execution check ───────────────────────────────────────────────
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
   
