"""
Seed script for adding sample influencer gigs to the database.
Creates realistic influencer service offerings like:
- "I'm coming to Amsterdam Thursday, available for content creation"
- Restaurant review services
- Social media content packages
"""

import asyncio
import random
from datetime import datetime, timedelta
from decimal import Decimal
from uuid import UUID
import sys
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent.parent.parent / "backend"
sys.path.insert(0, str(backend_path))

from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.base import AsyncSessionLocal
from app.models.gig import Gig
from app.models.creator import CreatorProfile
from app.models.user import User
import bcrypt


# Gig templates for Amsterdam-based influencers
GIG_TEMPLATES = [
    {
        "title": "I'm in Amsterdam this week - Restaurant content creation available",
        "description": """🎥 Hey restaurants! I'm visiting Amsterdam {date_range} and I'm available for last-minute content creation!

I specialize in creating engaging restaurant content that drives footfall and bookings.

What I offer:
✓ Instagram Reels showcasing your dishes
✓ TikTok videos highlighting the dining experience
✓ Instagram Stories with genuine reactions
✓ Professional food photography
✓ Authentic reviews from a foodie perspective

Perfect for restaurants looking to boost their social media presence with authentic, high-quality content.

My content typically gets:
• {engagement}K+ avg views per post
• {followers}K+ engaged followers
• High engagement rate in food & lifestyle niche

Quick turnaround - content delivered within 24-48 hours!""",
        "category": "Social Media Marketing",
        "video_type": "Instagram Reels",
        "basic_price": (150, 300),
        "basic_description": "1 Instagram Reel + 3 Stories featuring your restaurant",
        "basic_delivery_days": 2,
        "standard_price": (400, 600),
        "standard_description": "2 Instagram Reels + 1 TikTok + 5 Stories + 10 photos",
        "standard_delivery_days": 3,
        "premium_price": (800, 1200),
        "premium_description": "Full day content creation: 3 Reels + 2 TikToks + Full story takeover + 20 photos + Dedicated post",
        "premium_delivery_days": 4,
    },
    {
        "title": "Amsterdam Food & Lifestyle Influencer - Ready to promote your restaurant",
        "description": """📍 Based in Amsterdam | {followers}K Followers | Food & Lifestyle Content Creator

Looking to collaborate with Amsterdam restaurants for authentic content creation!

My Specialty:
• Cinematic food videography
• Storytelling through short-form content
• Highlighting unique dining experiences
• Creating scroll-stopping Reels and TikToks

What makes me different:
✨ I focus on the STORY behind the food
✨ Professional equipment (Sony A7IV + DJI Ronin)
✨ Fast turnaround times
✨ Proven track record of viral content

Past collaborations have resulted in:
📈 Average {engagement}K views per video
📈 Significant increase in restaurant bookings
📈 Strong engagement from local Amsterdam audience

Let's create something amazing for your restaurant!""",
        "category": "Content Creation",
        "video_type": "TikTok",
        "basic_price": (200, 350),
        "basic_description": "1 TikTok video (30-60 sec) + usage rights",
        "basic_delivery_days": 3,
        "standard_price": (500, 750),
        "standard_description": "2 TikToks + 1 Instagram Reel + Story series",
        "standard_delivery_days": 5,
        "premium_price": (1000, 1500),
        "premium_description": "Complete campaign: 3 TikToks + 2 Reels + Dedicated feed post + Stories + Full commercial rights",
        "premium_delivery_days": 7,
    },
    {
        "title": "Available this weekend in Amsterdam - Restaurant reviews & content",
        "description": """🍽️ Amsterdam-based food content creator available THIS WEEKEND!

Perfect timing for restaurants wanting weekend exposure!

Quick Info:
📱 {followers}K Instagram followers
📱 {tiktok}K TikTok followers
📍 Amsterdam local with deep knowledge of the food scene
⚡ Quick turnaround - same day story posts possible

Weekend Special Services:
🎬 Live story coverage of your restaurant
🎬 Professional food photography
🎬 Short-form video content (Reels/TikToks)
🎬 Authentic dining experience reviews

My content style:
✓ Cinematic and aesthetic
✓ Focuses on the experience, not just the food
✓ Engages with followers through polls and Q&As
✓ Always includes clear CTA for bookings

Typical Results:
- Stories reach: {engagement}K+ viewers
- Reel views: {reel_views}K+
- Direct restaurant mentions and tags
- Increased weekend bookings

Available for collaborations starting at €{min_price}!""",
        "category": "Restaurant Marketing",
        "video_type": "Instagram Stories",
        "basic_price": (180, 280),
        "basic_description": "Full story takeover (8-10 stories) + 1 Reel",
        "basic_delivery_days": 1,
        "standard_price": (450, 650),
        "standard_description": "Story coverage + 2 Reels + Grid post + Saved highlights",
        "standard_delivery_days": 2,
        "premium_price": (900, 1300),
        "premium_description": "Full weekend coverage: Multiple visits + Stories + 3 Reels + TikTok + Grid post + Long-term highlights",
        "premium_delivery_days": 3,
    },
    {
        "title": "Amsterdam Food Vlogger - YouTube & Instagram content for restaurants",
        "description": """🎥 Professional Food Content Creator | Amsterdam

Specializing in creating high-quality video content that tells your restaurant's story.

Content Formats:
📹 YouTube vlogs and reviews
📹 Instagram Reels and feed posts
📹 TikTok short-form content
📹 Behind-the-scenes kitchen tours

My Audience:
👥 {followers}K+ combined following across platforms
📍 75% based in Amsterdam & Netherlands
🎯 Food enthusiasts, travelers, and locals looking for dining recommendations
💰 Avg. spending power: €50-100 per dining experience

Why Work With Me:
✓ Professional videography equipment
✓ 5+ years experience in food content
✓ SEO-optimized YouTube descriptions
✓ Strong engagement rates (7-12%)
✓ Authentic, honest reviews that build trust

Recent Success Stories:
• Helped a new restaurant get 200+ reservations in first month
• Multiple videos with 50K+ views
• Featured in Amsterdam food guides

Let's boost your restaurant's visibility!""",
        "category": "Video Production",
        "video_type": "YouTube Videos",
        "basic_price": (300, 450),
        "basic_description": "1 YouTube video (8-10 min) + Instagram promotion",
        "basic_delivery_days": 7,
        "standard_price": (700, 1000),
        "standard_description": "YouTube video + 2 Instagram Reels + TikTok + Full social promotion",
        "standard_delivery_days": 10,
        "premium_price": (1500, 2000),
        "premium_description": "Full documentary-style feature + Multiple platform promotion + Behind-the-scenes + Chef interview + Recipe feature",
        "premium_delivery_days": 14,
    },
    {
        "title": "Micro-Influencer Package - Perfect for local Amsterdam restaurants",
        "description": """🌟 Amsterdam Micro-Influencer | High Engagement | Local Audience

Why micro-influencers are perfect for restaurants:
✓ Higher engagement rates (my avg: 8-15%)
✓ More authentic connections with followers
✓ Better ROI for local businesses
✓ Trusted recommendations

My Profile:
📊 {followers}K engaged followers
📍 100% Amsterdam/Netherlands audience
🎯 Niche: Food, lifestyle, and local experiences
💬 Average engagement: {engagement} likes + 100+ comments per post

Services Included:
🎬 Content Creation (Reels, TikToks, Stories)
📸 Professional food photography
📝 Authentic written reviews
🔄 Reposting and engagement with your content
🎯 Tagged location and clear call-to-action

Perfect For:
• Newly opened restaurants
• Local hidden gems
• Restaurants targeting Amsterdam locals
• Budget-conscious marketing

All content is created with love for Amsterdam's food scene!""",
        "category": "Influencer Marketing",
        "video_type": "Instagram Reels",
        "basic_price": (120, 200),
        "basic_description": "1 Instagram Reel + 5 Stories + Grid post",
        "basic_delivery_days": 3,
        "standard_price": (300, 450),
        "standard_description": "2 Reels + 1 TikTok + Stories + Grid post + Engagement package",
        "standard_delivery_days": 5,
        "premium_price": (600, 850),
        "premium_description": "Monthly partnership: 4 Reels + 2 TikToks + Weekly stories + 2 Grid posts + Priority support",
        "premium_delivery_days": 30,
    },
]

# Realistic creator names for Amsterdam
CREATOR_NAMES = [
    "Sophie van der Berg", "Lucas Jansen", "Emma de Vries",
    "Noah Bakker", "Mila Visser", "Finn de Jong",
    "Lotte Mulder", "Daan Peters", "Evi Smit", "Lars Bosch"
]

AMSTERDAM_AREAS = ["Jordaan", "De Pijp", "Centrum", "Oud-West", "Noord", "Oost"]


def hash_password(password: str) -> str:
    """Hash password using bcrypt."""
    password_bytes = password.encode('utf-8')
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')


def generate_slug(title: str, gig_id: str) -> str:
    """Generate URL-friendly slug."""
    import re
    slug = title.lower().strip()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[\s-]+', '-', slug)
    slug = slug.strip('-')[:50]
    return f"{slug}-{gig_id[:8]}"


async def create_influencer_gigs():
    """Create sample influencer gigs."""
    async with AsyncSessionLocal() as db:
        print("🎬 Seeding influencer gigs...")

        # Get or create influencer users with creator profiles
        creators = []
        for i, name in enumerate(CREATOR_NAMES[:5]):  # Create 5 influencers
            email = f"influencer{i+1}@reelbyte.com"

            # Check if user exists
            result = await db.execute(
                select(User).where(User.email == email)
            )
            user = result.scalar_one_or_none()

            if not user:
                # Create user
                user = User(
                    email=email,
                    password_hash=hash_password("password123"),
                    user_type="creator",
                    email_verified=True
                )
                db.add(user)
                await db.flush()

                # Create creator profile
                followers = random.choice([15, 25, 35, 50, 75]) * 1000
                creator_profile = CreatorProfile(
                    user_id=user.id,
                    display_name=name,
                    tagline=f"Amsterdam Food & Lifestyle Influencer | {followers//1000}K followers",
                    bio=f"📍 Amsterdam based content creator specializing in food, restaurants, and lifestyle. Creating engaging content that drives results for local businesses.",
                    profile_image_url=f"https://i.pravatar.cc/400?u={email}",
                    hourly_rate=Decimal(random.randint(50, 150)),
                    total_earnings=Decimal(random.randint(5000, 25000)),
                    total_jobs_completed=random.randint(10, 50),
                    average_rating=Decimal(random.uniform(4.5, 5.0)).quantize(Decimal('0.1')),
                    total_reviews=random.randint(8, 30),
                    response_time_hours=random.randint(1, 6),
                    is_verified=True
                )
                db.add(creator_profile)
                await db.flush()
                creators.append((user, creator_profile, followers))
            else:
                # Get existing creator profile
                result = await db.execute(
                    select(CreatorProfile).where(CreatorProfile.user_id == user.id)
                )
                creator_profile = result.scalar_one_or_none()
                if creator_profile:
                    followers = random.choice([15, 25, 35, 50, 75]) * 1000
                    creators.append((user, creator_profile, followers))

        print(f"✓ Created/found {len(creators)} influencer profiles")

        # Create gigs from templates
        gigs_created = 0
        for creator_data in creators:
            user, creator_profile, followers = creator_data

            # Each influencer gets 1-2 random gig templates
            templates = random.sample(GIG_TEMPLATES, k=random.randint(1, 2))

            for template in templates:
                # Randomize some values
                date_range = random.choice([
                    "Thursday-Sunday",
                    "this weekend",
                    "next week Monday-Wednesday",
                    "Friday-Sunday",
                    "this Thursday and Friday"
                ])

                engagement = random.randint(10, 100)
                reel_views = random.randint(20, 150)
                tiktok = random.randint(10, 60)
                min_price = template["basic_price"][0]

                # Fill in template variables
                description = template["description"].format(
                    date_range=date_range,
                    engagement=engagement,
                    followers=followers//1000,
                    reel_views=reel_views,
                    tiktok=tiktok,
                    min_price=min_price
                )

                # Random prices within range
                basic_price = Decimal(random.randint(*template["basic_price"]))
                standard_price = Decimal(random.randint(*template.get("standard_price", (0, 0)))) if template.get("standard_price") else None
                premium_price = Decimal(random.randint(*template.get("premium_price", (0, 0)))) if template.get("premium_price") else None

                gig = Gig(
                    creator_profile_id=creator_profile.id,
                    title=template["title"],
                    slug=generate_slug(template["title"], str(creator_profile.id)),
                    description=description,
                    category=template["category"],
                    subcategory="Amsterdam Restaurants",
                    video_type=template["video_type"],
                    basic_price=basic_price,
                    basic_description=template["basic_description"],
                    basic_delivery_days=template["basic_delivery_days"],
                    basic_revisions=random.randint(1, 3),
                    standard_price=standard_price,
                    standard_description=template.get("standard_description"),
                    standard_delivery_days=template.get("standard_delivery_days"),
                    standard_revisions=random.randint(2, 4) if standard_price else None,
                    premium_price=premium_price,
                    premium_description=template.get("premium_description"),
                    premium_delivery_days=template.get("premium_delivery_days"),
                    premium_revisions=random.randint(3, 5) if premium_price else None,
                    requirements=f"Please provide:\n• Restaurant name and location\n• Specific dishes/items to feature\n• Any specific messaging or CTA\n• Preferred time slot for visit\n• Any brand guidelines",
                    search_tags=[
                        "amsterdam", "restaurant", "food", "content creation",
                        template["video_type"].lower().replace(" ", "-"),
                        "influencer", "social media"
                    ],
                    status="active",
                    view_count=random.randint(50, 500),
                    order_count=random.randint(0, 15),
                    favorite_count=random.randint(5, 50)
                )

                db.add(gig)
                gigs_created += 1

        await db.commit()
        print(f"✓ Created {gigs_created} influencer gigs")
        print("🎉 Gig seeding complete!")


if __name__ == "__main__":
    asyncio.run(create_influencer_gigs())
