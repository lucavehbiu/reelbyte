# ReelByte Database Seeds

This directory contains seed data scripts to populate your ReelByte database with realistic test data for development and testing purposes.

## What Gets Created

The seed script creates comprehensive test data including:

### Users & Profiles
- **10 Creator Users** with complete profiles
  - Professional video editors
  - Animators and motion graphics designers
  - Social media content specialists
  - VFX artists
  - Each with unique skills, experience levels, and pricing

- **5 Client Users** with company profiles
  - Tech startups
  - Fitness brands
  - Fashion companies
  - Food delivery services
  - Digital agencies

### Gigs (28 total)
- **Video Editing** (Instagram Reels, TikTok, YouTube Shorts, Podcasts, etc.)
- **Animation** (2D Animation, Explainer Videos, Stickers & GIFs)
- **Motion Graphics** (Commercial, Logo Animation, Social Media)
- **Visual Effects** (VFX, Compositing, Green Screen, Music Videos)
- **Social Media Content** (Viral Content, UGC, Content Strategy)
- **Specialized Services** (Color Grading, Product Videos, Travel, Weddings)

Each gig includes:
- Basic, Standard, and Premium pricing tiers
- Detailed descriptions
- Delivery timelines
- Revision counts
- Search tags
- Realistic view and order counts

### Projects & Proposals
- **5 Open Projects** from various clients
- **15-25 Proposals** from different creators
- Range from $500 to $3000 budgets
- Various categories and requirements

### Contracts & Reviews
- **10-15 Completed Contracts**
- Client reviews of creators (4-5 star ratings)
- Creator reviews of clients (mutual feedback)
- Realistic completion dates and timelines

### Conversations & Messages
- **5-8 Direct Conversations** between clients and creators
- **3-7 Messages per conversation**
- Realistic inquiry and collaboration discussions

## Prerequisites

Before running the seeds, ensure you have:

1. **PostgreSQL 17** installed and running
2. **Database created** using `/database/init.sql`
3. **Python 3.11+** installed
4. **Required Python packages** installed:
   ```bash
   pip install sqlalchemy asyncpg passlib[bcrypt]
   ```

## How to Run

### Option 1: Using Python directly

1. Navigate to the seeds directory:
   ```bash
   cd /home/user/reelbyte/database/seeds
   ```

2. Make the script executable (optional):
   ```bash
   chmod +x run_seeds.py
   ```

3. Run the seeder:
   ```bash
   python run_seeds.py
   ```

   Or if you made it executable:
   ```bash
   ./run_seeds.py
   ```

### Option 2: Using Docker

If you're running ReelByte in Docker:

```bash
docker-compose exec backend python /app/database/seeds/run_seeds.py
```

### Option 3: From the Makefile

If you have a Makefile with seed commands:

```bash
make seed-db
```

## Environment Variables

The seeder uses the `DATABASE_URL` environment variable if set. If not set, it defaults to:

```
postgresql://reelbyte:reelbyte123@localhost:5432/reelbyte
```

You can override this by setting the environment variable:

```bash
export DATABASE_URL="postgresql://user:password@host:port/database"
python run_seeds.py
```

## Clearing Existing Data

When you run the script, it will ask if you want to clear existing data first:

```
Do you want to clear existing data first? (y/N):
```

- Type `y` to clear all existing data before seeding (recommended for clean start)
- Type `n` or press Enter to keep existing data and add seed data

**Warning:** Clearing data will remove ALL records from the database, including any data you've manually created.

## Test Accounts

After seeding, you can log in with any of these test accounts:

### Creator Accounts

| Email | Creator Type | Specialty |
|-------|-------------|-----------|
| sarah.videoedits@gmail.com | Video Editor | Instagram Reels, TikTok |
| mike.animations@outlook.com | Animator | 2D Animation, Motion Graphics |
| jessica.reels@gmail.com | Content Creator | Viral Content, Social Media |
| david.motion@yahoo.com | Motion Designer | Premium Motion Graphics |
| emily.shorts@gmail.com | YouTube Specialist | YouTube Shorts, Data-Driven |
| alex.colorist@gmail.com | Colorist | Color Grading, Cinematic |
| maria.social@gmail.com | Strategist | Social Media Strategy |
| chris.vfx@outlook.com | VFX Artist | Visual Effects, Compositing |
| sophie.creative@gmail.com | Brand Specialist | Brand Videos, Testimonials |
| ryan.transitions@gmail.com | Action Editor | High-Energy, Travel |

### Client Accounts

| Email | Company | Industry |
|-------|---------|----------|
| contact@techstartup.com | TechFlow Innovations | Technology/SaaS |
| marketing@fitnessbrand.com | Peak Performance Fitness | Health & Fitness |
| social@fashionhouse.com | Urban Style Co | Fashion & Retail |
| content@fooddelivery.com | Gourmet Bites | Food & Beverage |
| team@digitalagency.com | Pixel Perfect Agency | Marketing Agency |

**All accounts use the password:** `password123`

## Data Characteristics

### Realistic Pricing
- Gig prices range from $65 to $3000
- Based on real market rates for video editing services
- Three-tier pricing structure (Basic, Standard, Premium)

### Diverse Categories
- Video Editing (multiple subcategories)
- Animation (2D, Explainer, Stickers)
- Motion Graphics (Commercial, Social Media)
- Visual Effects (VFX, Compositing, Green Screen)
- Social Media Content (Strategy, UGC, Viral)

### Professional Profiles
- Real-looking names and emails
- Professional bios and taglines
- Years of experience (3-10 years)
- Social media handles
- Portfolio URLs
- Verified status

### Engagement Metrics
- View counts (50-5000 per gig)
- Order counts (5-100 per gig)
- Average ratings (4.5-5.0 stars)
- Review counts (10-150 per creator)

## File Structure

```
database/seeds/
├── README.md           # This file
├── seed_data.py        # Seed data and seeding functions
└── run_seeds.py        # Main execution script
```

## Troubleshooting

### Connection Issues

If you get connection errors:

1. Check PostgreSQL is running:
   ```bash
   pg_isready
   ```

2. Verify database exists:
   ```bash
   psql -l | grep reelbyte
   ```

3. Check credentials in `.env` or `DATABASE_URL`

### Import Errors

If you get import errors:

1. Install required packages:
   ```bash
   pip install sqlalchemy asyncpg passlib[bcrypt]
   ```

2. Ensure you're running from the correct directory

### Permission Errors

If you get permission errors:

1. Make sure your database user has appropriate permissions:
   ```sql
   GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO reelbyte;
   GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO reelbyte;
   ```

## Notes

- The seed data is for **development and testing only**
- Do not use in production environments
- All passwords are set to `password123` for easy testing
- User IDs, profile IDs, and other IDs are randomly generated UUIDs
- Running the seeder multiple times without clearing will create duplicate data

## Customization

To customize the seed data:

1. Edit `seed_data.py`
2. Modify the data dictionaries:
   - `CREATOR_USERS` - Creator user profiles
   - `CLIENT_USERS` - Client company profiles
   - `GIGS` - Gig listings
3. Adjust the number of records created in each function
4. Re-run the seeder

## Support

For issues or questions:
1. Check the main README.md in the project root
2. Review the database schema in `/database/init.sql`
3. Check application logs for detailed error messages

---

**Happy Testing!** 🎬
