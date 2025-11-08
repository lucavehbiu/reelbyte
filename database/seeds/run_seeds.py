#!/usr/bin/env python3
"""
ReelByte Database Seeder
Execute this script to populate the database with test data.
"""

import asyncio
import sys
import os
from pathlib import Path

# Add the backend directory to the Python path
backend_dir = Path(__file__).parent.parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

from sqlalchemy import create_engine, text
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker

# Import seed functions
from seed_data import run_all_seeds


async def check_database_connection(database_url: str) -> bool:
    """Check if database is accessible."""
    try:
        engine = create_async_engine(database_url, echo=False)
        async with engine.begin() as conn:
            await conn.execute(text("SELECT 1"))
        await engine.dispose()
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False


async def clear_existing_data(session: AsyncSession) -> None:
    """Clear existing seed data (optional)."""
    print("\n⚠️  Clearing existing data...")

    tables = [
        "messages",
        "conversation_participants",
        "conversations",
        "notifications",
        "transactions",
        "reviews",
        "contracts",
        "proposals",
        "projects",
        "gigs",
        "creator_profiles",
        "client_profiles",
        "users",
    ]

    for table in tables:
        try:
            await session.execute(text(f"TRUNCATE TABLE {table} CASCADE"))
            print(f"  ✓ Cleared {table}")
        except Exception as e:
            print(f"  ⚠️  Could not clear {table}: {e}")

    await session.commit()
    print("✓ Data cleared\n")


async def main():
    """Main function to run database seeding."""
    print("\n" + "=" * 70)
    print(" " * 15 + "ReelByte Database Seeder")
    print("=" * 70)

    # Get database URL from environment or use default
    database_url = os.getenv(
        "DATABASE_URL",
        "postgresql://reelbyte:reelbyte123@localhost:5432/reelbyte"
    )

    # Convert to async format
    if database_url.startswith("postgresql://"):
        database_url = database_url.replace("postgresql://", "postgresql+asyncpg://", 1)

    print(f"\nDatabase: {database_url.split('@')[1] if '@' in database_url else 'Unknown'}")

    # Check database connection
    print("\nChecking database connection...")
    if not await check_database_connection(database_url):
        print("\n❌ Cannot connect to database. Please check:")
        print("  1. PostgreSQL is running")
        print("  2. Database 'reelbyte' exists")
        print("  3. Credentials are correct")
        print("  4. DATABASE_URL environment variable is set (optional)")
        sys.exit(1)

    print("✓ Database connection successful")

    # Ask if user wants to clear existing data
    print("\n" + "-" * 70)
    clear_data = input("Do you want to clear existing data first? (y/N): ").lower().strip()

    # Create async engine and session
    engine = create_async_engine(
        database_url,
        echo=False,
        pool_pre_ping=True,
    )

    AsyncSessionLocal = async_sessionmaker(
        engine,
        class_=AsyncSession,
        expire_on_commit=False,
        autocommit=False,
        autoflush=False,
    )

    try:
        async with AsyncSessionLocal() as session:
            # Clear data if requested
            if clear_data == "y":
                await clear_existing_data(session)

            # Run all seeds
            await run_all_seeds(session)

        print("\n✅ Seeding completed successfully!")

    except Exception as e:
        print(f"\n❌ Seeding failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

    finally:
        await engine.dispose()

    print("\n" + "=" * 70)
    print("You can now log in with any of these accounts:")
    print("-" * 70)
    print("\nCreator Accounts:")
    print("  • sarah.videoedits@gmail.com")
    print("  • mike.animations@outlook.com")
    print("  • jessica.reels@gmail.com")
    print("  • david.motion@yahoo.com")
    print("  • emily.shorts@gmail.com")
    print("  • alex.colorist@gmail.com")
    print("  • maria.social@gmail.com")
    print("  • chris.vfx@outlook.com")
    print("  • sophie.creative@gmail.com")
    print("  • ryan.transitions@gmail.com")
    print("\nClient Accounts:")
    print("  • contact@techstartup.com")
    print("  • marketing@fitnessbrand.com")
    print("  • social@fashionhouse.com")
    print("  • content@fooddelivery.com")
    print("  • team@digitalagency.com")
    print("\nPassword for all accounts: password123")
    print("=" * 70 + "\n")


if __name__ == "__main__":
    asyncio.run(main())
