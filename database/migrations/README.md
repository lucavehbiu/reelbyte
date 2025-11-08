# Database Migrations with Alembic

This directory contains database migration scripts managed by Alembic, the database migration tool for SQLAlchemy.

## Overview

Alembic provides version control for your database schema, allowing you to:
- Track database schema changes over time
- Apply schema updates to different environments consistently
- Roll back changes if needed
- Maintain a history of all database modifications

## Directory Structure

```
database/migrations/
├── versions/               # Migration scripts
│   ├── 001_initial_schema.py
│   ├── 002_add_user_verification.py
│   └── ...
├── env.py                 # Alembic environment configuration
├── script.py.mako        # Template for new migrations
└── alembic.ini           # Alembic configuration file
```

## Setup

### 1. Initialize Alembic (One-time setup)

If Alembic is not yet initialized in your project:

```bash
cd backend
alembic init migrations
```

### 2. Configure Alembic

Edit `alembic.ini` to set your database URL:

```ini
# Option 1: Hardcode URL (not recommended for production)
sqlalchemy.url = postgresql+asyncpg://reelbyte:password@localhost:5432/reelbyte

# Option 2: Use environment variables (recommended)
# Leave sqlalchemy.url blank and set it in env.py
```

### 3. Update env.py

Modify `migrations/env.py` to import your SQLAlchemy models:

```python
from app.models import Base
from app.core.config import settings

# Set target metadata
target_metadata = Base.metadata

# Use environment variable for database URL
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)
```

## Common Commands

### Create a New Migration

After modifying your SQLAlchemy models, generate a migration script:

```bash
# Auto-generate migration from model changes
alembic revision --autogenerate -m "Description of changes"

# Example:
alembic revision --autogenerate -m "Add email verification to users"
```

This will create a new file in `versions/` with upgrade and downgrade functions.

### Apply Migrations

```bash
# Upgrade to the latest version
alembic upgrade head

# Upgrade by one version
alembic upgrade +1

# Upgrade to a specific revision
alembic upgrade <revision_id>
```

### Rollback Migrations

```bash
# Downgrade by one version
alembic downgrade -1

# Downgrade to a specific revision
alembic downgrade <revision_id>

# Rollback all migrations
alembic downgrade base
```

### View Migration History

```bash
# Show current revision
alembic current

# Show migration history
alembic history

# Show detailed history
alembic history --verbose
```

### Create Empty Migration (Manual)

For complex migrations that can't be auto-generated:

```bash
alembic revision -m "Custom migration description"
```

Then manually edit the generated file to add your SQL or SQLAlchemy operations.

## Migration Best Practices

### 1. Always Review Auto-Generated Migrations

While `--autogenerate` is convenient, always review the generated migration:

```bash
# After creating migration, check the file
cat migrations/versions/001_description.py
```

Alembic may miss:
- Index renames
- Table renames
- Column type changes in some cases
- Custom constraints

### 2. Test Migrations

Before applying to production:

```bash
# Test upgrade
alembic upgrade head

# Test downgrade
alembic downgrade -1

# Re-apply
alembic upgrade head
```

### 3. Handling Data Migrations

For migrations that require data transformation:

```python
from alembic import op
import sqlalchemy as sa

def upgrade():
    # Schema change
    op.add_column('users', sa.Column('full_name', sa.String(255)))

    # Data migration
    connection = op.get_bind()
    connection.execute("""
        UPDATE users
        SET full_name = first_name || ' ' || last_name
        WHERE full_name IS NULL
    """)

    # Clean up old columns
    op.drop_column('users', 'first_name')
    op.drop_column('users', 'last_name')

def downgrade():
    # Reverse the changes
    op.add_column('users', sa.Column('first_name', sa.String(100)))
    op.add_column('users', sa.Column('last_name', sa.String(100)))

    connection = op.get_bind()
    connection.execute("""
        UPDATE users
        SET first_name = split_part(full_name, ' ', 1),
            last_name = split_part(full_name, ' ', 2)
        WHERE first_name IS NULL
    """)

    op.drop_column('users', 'full_name')
```

### 4. Multiple Developers

To avoid conflicts:

```bash
# Before creating a new migration
git pull origin main
alembic upgrade head

# Create your migration
alembic revision --autogenerate -m "Your changes"

# Commit and push
git add migrations/versions/
git commit -m "Add migration: Your changes"
git push
```

If you have merge conflicts in migrations:

```bash
# Merge the branches
alembic merge <revision1> <revision2> -m "Merge migrations"
```

### 5. Production Deployment

For production deployments:

```bash
# 1. Backup database first
pg_dump reelbyte > backup_$(date +%Y%m%d_%H%M%S).sql

# 2. Apply migrations
alembic upgrade head

# 3. Verify
alembic current
```

## Common Migration Operations

### Add Column

```python
def upgrade():
    op.add_column('users', sa.Column('bio', sa.Text(), nullable=True))

def downgrade():
    op.drop_column('users', 'bio')
```

### Drop Column

```python
def upgrade():
    op.drop_column('users', 'old_field')

def downgrade():
    op.add_column('users', sa.Column('old_field', sa.String(255)))
```

### Rename Column

```python
def upgrade():
    op.alter_column('users', 'old_name', new_column_name='new_name')

def downgrade():
    op.alter_column('users', 'new_name', new_column_name='old_name')
```

### Add Index

```python
def upgrade():
    op.create_index('idx_users_email', 'users', ['email'])

def downgrade():
    op.drop_index('idx_users_email', 'users')
```

### Add Foreign Key

```python
def upgrade():
    op.create_foreign_key(
        'fk_orders_user_id',
        'orders', 'users',
        ['user_id'], ['id'],
        ondelete='CASCADE'
    )

def downgrade():
    op.drop_constraint('fk_orders_user_id', 'orders', type_='foreignkey')
```

### Create Table

```python
def upgrade():
    op.create_table(
        'new_table',
        sa.Column('id', sa.UUID(), primary_key=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now())
    )

def downgrade():
    op.drop_table('new_table')
```

## Docker Integration

When running in Docker, migrations are typically applied during container startup:

### Option 1: Run Manually

```bash
# Access backend container
docker exec -it reelbyte-backend bash

# Run migrations
alembic upgrade head
```

### Option 2: Automatic on Startup

Add to your backend Dockerfile or entrypoint script:

```bash
#!/bin/bash
# Wait for database
while ! pg_isready -h postgres -p 5432 -U reelbyte; do
    echo "Waiting for database..."
    sleep 2
done

# Run migrations
alembic upgrade head

# Start application
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## Troubleshooting

### Migration Fails

```bash
# Check current state
alembic current

# Check for errors in migration file
cat migrations/versions/<revision>.py

# Try downgrading first
alembic downgrade -1
alembic upgrade head
```

### Database Out of Sync

```bash
# Stamp database with current revision (use carefully!)
alembic stamp head

# Or stamp to a specific revision
alembic stamp <revision_id>
```

### Reset All Migrations (Development Only!)

```bash
# WARNING: This will destroy all data!
alembic downgrade base
dropdb reelbyte
createdb reelbyte
alembic upgrade head
```

## Environment-Specific Migrations

### Development

```bash
export DATABASE_URL="postgresql+asyncpg://user:pass@localhost/reelbyte_dev"
alembic upgrade head
```

### Staging

```bash
export DATABASE_URL="postgresql+asyncpg://user:pass@staging-db/reelbyte_staging"
alembic upgrade head
```

### Production

```bash
export DATABASE_URL="postgresql+asyncpg://user:pass@prod-db/reelbyte"
alembic upgrade head
```

## Resources

- [Alembic Documentation](https://alembic.sqlalchemy.org/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## Notes

- **Never edit existing migrations** - Create new ones instead
- **Always backup production databases** before running migrations
- **Test migrations thoroughly** in staging before production
- **Keep migrations small** - One logical change per migration
- **Document complex migrations** with comments in the migration file
