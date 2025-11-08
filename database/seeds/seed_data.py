"""
ReelByte Database Seed Data
This module contains all seed data for populating the database with realistic test data.
"""

import asyncio
import uuid
from datetime import datetime, timedelta
from decimal import Decimal
from typing import List, Dict, Any
import random

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

# Import password hashing (we'll use passlib directly here)
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    return pwd_context.hash(password)


# ============================================================================
# USER DATA
# ============================================================================

CREATOR_USERS = [
    {
        "email": "sarah.videoedits@gmail.com",
        "display_name": "Sarah Martinez",
        "tagline": "Professional Video Editor | 5+ Years Experience",
        "bio": "I specialize in creating engaging short-form content for Instagram Reels, TikTok, and YouTube Shorts. My expertise includes dynamic transitions, color grading, and viral-worthy editing that keeps viewers hooked.",
        "years_of_experience": 6,
        "hourly_rate": Decimal("75.00"),
        "instagram_handle": "@videoeditor_pro",
        "tiktok_handle": "@sarahedits",
        "youtube_channel": "https://youtube.com/@sarahedits",
        "website_url": "https://sarahmarinez.com",
    },
    {
        "email": "mike.animations@outlook.com",
        "display_name": "Mike Chen",
        "tagline": "Motion Graphics & Animation Specialist",
        "bio": "Award-winning animator with expertise in 2D/3D animation, motion graphics, and visual effects. I bring your ideas to life with stunning visuals and smooth animations.",
        "years_of_experience": 8,
        "hourly_rate": Decimal("95.00"),
        "instagram_handle": "@animationqueen",
        "tiktok_handle": "@mikeanimations",
        "youtube_channel": "https://youtube.com/@mikechenanimation",
        "website_url": "https://mikechen.studio",
    },
    {
        "email": "jessica.reels@gmail.com",
        "display_name": "Jessica Taylor",
        "tagline": "Social Media Content Creator | Viral Reels Expert",
        "bio": "I create scroll-stopping content that goes viral. Specialized in Instagram Reels, TikToks, and YouTube Shorts with a focus on trending sounds and effects.",
        "years_of_experience": 4,
        "hourly_rate": Decimal("65.00"),
        "instagram_handle": "@jessicareels",
        "tiktok_handle": "@jtaylor_creative",
        "youtube_channel": "https://youtube.com/@jessicataylor",
        "website_url": None,
    },
    {
        "email": "david.motion@yahoo.com",
        "display_name": "David Rodriguez",
        "tagline": "Motion Graphics Designer | After Effects Expert",
        "bio": "10 years of experience in motion design for brands like Nike, Adidas, and Red Bull. I create eye-catching motion graphics and animated logos that leave a lasting impression.",
        "years_of_experience": 10,
        "hourly_rate": Decimal("120.00"),
        "instagram_handle": "@motionbydavid",
        "tiktok_handle": None,
        "youtube_channel": "https://youtube.com/@davidmotion",
        "website_url": "https://davidrodriguez.design",
    },
    {
        "email": "emily.shorts@gmail.com",
        "display_name": "Emily Watson",
        "tagline": "YouTube Shorts & TikTok Specialist",
        "bio": "I help creators and brands grow on YouTube Shorts and TikTok with data-driven content strategies and professional editing.",
        "years_of_experience": 3,
        "hourly_rate": Decimal("55.00"),
        "instagram_handle": "@emilyshortseditor",
        "tiktok_handle": "@emilywatson",
        "youtube_channel": "https://youtube.com/@emilywatson",
        "website_url": None,
    },
    {
        "email": "alex.colorist@gmail.com",
        "display_name": "Alex Johnson",
        "tagline": "Professional Colorist & Video Editor",
        "bio": "Certified colorist specializing in cinematic grading and professional video editing. I make your footage look like it came straight from Hollywood.",
        "years_of_experience": 7,
        "hourly_rate": Decimal("85.00"),
        "instagram_handle": "@alexcolorgrading",
        "tiktok_handle": None,
        "youtube_channel": "https://youtube.com/@alexjohnson",
        "website_url": "https://alexjohnson.pro",
    },
    {
        "email": "maria.social@gmail.com",
        "display_name": "Maria Garcia",
        "tagline": "Social Media Video Content Strategist",
        "bio": "I combine creative editing with data-driven strategies to create content that not only looks great but also drives engagement and conversions.",
        "years_of_experience": 5,
        "hourly_rate": Decimal("70.00"),
        "instagram_handle": "@maria_socialmedia",
        "tiktok_handle": "@mariagarcia",
        "youtube_channel": "https://youtube.com/@mariagarcia",
        "website_url": "https://mariagarcia.co",
    },
    {
        "email": "chris.vfx@outlook.com",
        "display_name": "Chris Anderson",
        "tagline": "VFX Artist & Compositing Specialist",
        "bio": "Visual effects artist with experience in film and advertising. I create stunning VFX for commercials, music videos, and social media content.",
        "years_of_experience": 9,
        "hourly_rate": Decimal("110.00"),
        "instagram_handle": "@chrisvfx",
        "tiktok_handle": None,
        "youtube_channel": "https://youtube.com/@chrisandersonvfx",
        "website_url": "https://chrisanderson.vfx",
    },
    {
        "email": "sophie.creative@gmail.com",
        "display_name": "Sophie Brown",
        "tagline": "Creative Video Editor | Brand Content Specialist",
        "bio": "I create polished, professional video content for brands and businesses. Specialized in product videos, testimonials, and brand storytelling.",
        "years_of_experience": 5,
        "hourly_rate": Decimal("75.00"),
        "instagram_handle": "@sophiecreative",
        "tiktok_handle": "@sophiebrown",
        "youtube_channel": "https://youtube.com/@sophiebrown",
        "website_url": None,
    },
    {
        "email": "ryan.transitions@gmail.com",
        "display_name": "Ryan Mitchell",
        "tagline": "Transition Specialist | Fast-Paced Editing",
        "bio": "Known for creative transitions and fast-paced editing that keeps viewers engaged. Perfect for action sports, lifestyle content, and high-energy brands.",
        "years_of_experience": 4,
        "hourly_rate": Decimal("65.00"),
        "instagram_handle": "@ryantransitions",
        "tiktok_handle": "@ryanmitchell",
        "youtube_channel": "https://youtube.com/@ryanmitchell",
        "website_url": "https://ryanmitchell.video",
    },
]

CLIENT_USERS = [
    {
        "email": "contact@techstartup.com",
        "company_name": "TechFlow Innovations",
        "industry": "Technology",
        "company_size": "11-50",
        "website_url": "https://techflow.io",
        "description": "We're a fast-growing SaaS startup building the future of project management. We need engaging video content for our social media presence.",
    },
    {
        "email": "marketing@fitnessbrand.com",
        "company_name": "Peak Performance Fitness",
        "industry": "Health & Fitness",
        "company_size": "51-200",
        "website_url": "https://peakperformance.fit",
        "description": "Leading fitness apparel and supplement brand looking for high-quality video content for Instagram Reels and TikTok.",
    },
    {
        "email": "social@fashionhouse.com",
        "company_name": "Urban Style Co",
        "industry": "Fashion & Retail",
        "company_size": "201-500",
        "website_url": "https://urbanstyle.co",
        "description": "Trendy fashion brand targeting Gen Z and Millennials. We need creative video editors who understand current trends and viral content.",
    },
    {
        "email": "content@fooddelivery.com",
        "company_name": "Gourmet Bites",
        "industry": "Food & Beverage",
        "company_size": "11-50",
        "website_url": "https://gourmetbites.app",
        "description": "Food delivery app looking for mouth-watering video content to showcase our restaurant partners and promote our app.",
    },
    {
        "email": "team@digitalagency.com",
        "company_name": "Pixel Perfect Agency",
        "industry": "Marketing & Advertising",
        "company_size": "51-200",
        "website_url": "https://pixelperfect.agency",
        "description": "Full-service digital marketing agency seeking talented video editors for ongoing client work across various industries.",
    },
]


# ============================================================================
# GIG DATA
# ============================================================================

GIGS = [
    # Sarah's Gigs
    {
        "creator_index": 0,
        "title": "I will edit professional Instagram Reels that go viral",
        "category": "Video Editing",
        "subcategory": "Social Media",
        "video_type": "Instagram Reel",
        "description": """Get professional, engaging Instagram Reels that are designed to go viral!

I'll transform your raw footage into scroll-stopping Reels with:
✓ Dynamic transitions and effects
✓ Professional color grading
✓ Trending music and sound effects
✓ Eye-catching text animations
✓ Fast-paced editing that hooks viewers

Perfect for influencers, brands, and content creators who want to grow their Instagram presence.

What you'll get:
• Professionally edited Reel optimized for Instagram
• Trending effects and transitions
• Color correction and grading
• Text overlays and captions
• Music syncing
• Delivered in Instagram's preferred format (1080x1920, MP4)

I use Adobe Premiere Pro and After Effects to ensure top-quality results.""",
        "basic_price": Decimal("75.00"),
        "basic_description": "1 Instagram Reel (up to 30 seconds)",
        "basic_delivery_days": 2,
        "basic_revisions": 2,
        "standard_price": Decimal("200.00"),
        "standard_description": "3 Instagram Reels (up to 30 seconds each)",
        "standard_delivery_days": 4,
        "standard_revisions": 3,
        "premium_price": Decimal("450.00"),
        "premium_description": "7 Instagram Reels (up to 30 seconds each) + Content Strategy Session",
        "premium_delivery_days": 7,
        "premium_revisions": 4,
        "tags": ["instagram", "reels", "social media", "viral", "video editing"],
    },
    {
        "creator_index": 0,
        "title": "I will create engaging TikTok videos that drive engagement",
        "category": "Video Editing",
        "subcategory": "Social Media",
        "video_type": "TikTok",
        "description": """Transform your footage into engaging TikTok videos that capture attention and drive engagement!

With 6 years of experience and 500+ successful TikTok edits, I know exactly what makes content go viral on this platform.

What makes my service special:
✓ Deep understanding of TikTok trends and algorithm
✓ Creative transitions and effects unique to TikTok
✓ Attention-grabbing hooks in the first 3 seconds
✓ Perfect music syncing and sound design
✓ Optimized pacing for maximum watch time

I'll make your TikToks stand out and keep viewers watching until the end!""",
        "basic_price": Decimal("65.00"),
        "basic_description": "1 TikTok video (up to 60 seconds)",
        "basic_delivery_days": 2,
        "basic_revisions": 2,
        "standard_price": Decimal("180.00"),
        "standard_description": "3 TikTok videos (up to 60 seconds each)",
        "standard_delivery_days": 4,
        "standard_revisions": 3,
        "premium_price": Decimal("400.00"),
        "premium_description": "7 TikTok videos + Hashtag & Caption Suggestions",
        "premium_delivery_days": 6,
        "premium_revisions": 4,
        "tags": ["tiktok", "social media", "short form", "viral", "engagement"],
    },
    # Mike's Gigs
    {
        "creator_index": 1,
        "title": "I will create stunning 2D animation for your brand",
        "category": "Animation",
        "subcategory": "2D Animation",
        "video_type": "Animation",
        "description": """Bring your ideas to life with professional 2D animation!

As an award-winning animator with 8 years of experience, I create custom 2D animations that engage your audience and elevate your brand.

Services include:
✓ Character animation
✓ Explainer videos
✓ Logo animations
✓ Promotional videos
✓ Educational content
✓ Social media animations

I work with industry-standard tools including Adobe After Effects, Animate, and Cinema 4D.

Perfect for:
• Startups launching new products
• Brands creating marketing content
• Educators developing course materials
• Businesses explaining complex concepts

Let's create something amazing together!""",
        "basic_price": Decimal("350.00"),
        "basic_description": "15-second 2D animation with 1 character",
        "basic_delivery_days": 5,
        "basic_revisions": 2,
        "standard_price": Decimal("750.00"),
        "standard_description": "30-second 2D animation with multiple characters",
        "standard_delivery_days": 7,
        "standard_revisions": 3,
        "premium_price": Decimal("1500.00"),
        "premium_description": "60-second professional animation + storyboard + script consultation",
        "premium_delivery_days": 14,
        "premium_revisions": 5,
        "tags": ["2d animation", "motion graphics", "explainer video", "brand animation"],
    },
    {
        "creator_index": 1,
        "title": "I will design motion graphics for your social media",
        "category": "Motion Graphics",
        "subcategory": "Social Media",
        "video_type": "Motion Graphics",
        "description": """Eye-catching motion graphics that make your social media stand out!

I create dynamic, professional motion graphics perfect for Instagram, Facebook, LinkedIn, and TikTok.

What you'll get:
✓ Custom motion graphic designs
✓ Smooth animations and transitions
✓ Brand-aligned color schemes
✓ Professional typography
✓ Optimized for all social platforms
✓ Source files included (Premium package)

Types of motion graphics I create:
• Animated statistics and data visualization
• Product showcases
• Service explanations
• Event announcements
• Quote graphics
• Call-to-action animations

All work is 100% original and delivered in the format you need.""",
        "basic_price": Decimal("200.00"),
        "basic_description": "3 motion graphic posts (15 seconds each)",
        "basic_delivery_days": 3,
        "basic_revisions": 2,
        "standard_price": Decimal("450.00"),
        "standard_description": "7 motion graphic posts with custom templates",
        "standard_delivery_days": 5,
        "standard_revisions": 3,
        "premium_price": Decimal("900.00"),
        "premium_description": "15 motion graphics + source files + unlimited revisions",
        "premium_delivery_days": 10,
        "premium_revisions": 999,
        "tags": ["motion graphics", "social media", "animation", "after effects"],
    },
    # Jessica's Gigs
    {
        "creator_index": 2,
        "title": "I will create viral-worthy content for Instagram and TikTok",
        "category": "Social Media Content",
        "subcategory": "Viral Content",
        "video_type": "Short Form",
        "description": """Want to go viral? Let me create content that gets millions of views!

I've helped over 100 creators and brands go viral on Instagram and TikTok with my proven content creation formula.

What I offer:
✓ Trend analysis and research
✓ Creative concept development
✓ Professional video editing
✓ Trending audio selection
✓ Engagement optimization
✓ Hashtag strategy

My content has generated:
• 50M+ total views
• Average 200K+ views per video
• 95% client satisfaction rate

Perfect for:
• Content creators wanting to grow
• Brands looking to increase reach
• Influencers building their presence
• Businesses targeting Gen Z

Let's make your content go viral!""",
        "basic_price": Decimal("120.00"),
        "basic_description": "2 viral-optimized videos with trending effects",
        "basic_delivery_days": 3,
        "basic_revisions": 2,
        "standard_price": Decimal("300.00"),
        "standard_description": "5 videos + trend research + hashtag strategy",
        "standard_delivery_days": 5,
        "standard_revisions": 3,
        "premium_price": Decimal("650.00"),
        "premium_description": "10 videos + full content strategy + posting schedule",
        "premium_delivery_days": 7,
        "premium_revisions": 4,
        "tags": ["viral content", "tiktok", "instagram", "social media strategy"],
    },
    {
        "creator_index": 2,
        "title": "I will edit YouTube Shorts optimized for maximum views",
        "category": "Video Editing",
        "subcategory": "YouTube",
        "video_type": "YouTube Short",
        "description": """Maximize your YouTube Shorts views with professional editing optimized for the algorithm!

I understand the YouTube Shorts algorithm inside and out and will edit your content to maximize:
• Watch time
• Click-through rate
• Viewer retention
• Engagement

What you get:
✓ Algorithm-optimized editing
✓ Attention-grabbing thumbnails (included in Standard+)
✓ Strategic text placement
✓ Perfect pacing for retention
✓ Trending effects and transitions
✓ Delivered in YouTube's preferred format

Great for YouTubers, businesses, and creators looking to grow their channel with Shorts!""",
        "basic_price": Decimal("80.00"),
        "basic_description": "2 YouTube Shorts (up to 60 seconds each)",
        "basic_delivery_days": 2,
        "basic_revisions": 2,
        "standard_price": Decimal("220.00"),
        "standard_description": "5 YouTube Shorts + custom thumbnails",
        "standard_delivery_days": 4,
        "standard_revisions": 3,
        "premium_price": Decimal("500.00"),
        "premium_description": "12 YouTube Shorts + thumbnails + posting strategy",
        "premium_delivery_days": 7,
        "premium_revisions": 4,
        "tags": ["youtube shorts", "youtube", "short form video", "algorithm optimization"],
    },
    # David's Gigs
    {
        "creator_index": 3,
        "title": "I will create premium motion graphics for commercials",
        "category": "Motion Graphics",
        "subcategory": "Commercial",
        "video_type": "Commercial",
        "description": """Premium motion graphics for brands that demand excellence.

With 10 years of experience working with top brands like Nike, Adidas, and Red Bull, I deliver broadcast-quality motion graphics that elevate your brand.

Services include:
✓ Commercial video production
✓ Broadcast graphics
✓ Product animations
✓ Logo animations
✓ Lower thirds and title sequences
✓ 3D integration

Software I use:
• Adobe After Effects
• Cinema 4D
• Element 3D
• Red Giant Universe
• DaVinci Resolve

My work has been featured on national television, social media campaigns, and major sporting events.

Ideal for:
• Established brands
• Marketing agencies
• Production companies
• Corporate communications""",
        "basic_price": Decimal("500.00"),
        "basic_description": "15-second commercial motion graphics",
        "basic_delivery_days": 5,
        "basic_revisions": 2,
        "standard_price": Decimal("1200.00"),
        "standard_description": "30-second commercial with 3D elements",
        "standard_delivery_days": 10,
        "standard_revisions": 3,
        "premium_price": Decimal("3000.00"),
        "premium_description": "60-second premium commercial + storyboard + 3D animation",
        "premium_delivery_days": 21,
        "premium_revisions": 5,
        "tags": ["motion graphics", "commercial", "broadcast", "premium", "3d"],
    },
    {
        "creator_index": 3,
        "title": "I will animate your logo with professional motion graphics",
        "category": "Motion Graphics",
        "subcategory": "Logo Animation",
        "video_type": "Logo Animation",
        "description": """Make your brand memorable with a stunning animated logo!

A professional logo animation adds polish and professionalism to your brand. Perfect for:
• Video intros/outros
• Social media posts
• Website headers
• Presentations
• Email signatures
• Marketing materials

What you get:
✓ Custom logo animation
✓ Multiple versions (horizontal, vertical, square)
✓ Various formats (MP4, MOV, GIF)
✓ Transparent background option
✓ Source files (Premium only)
✓ Commercial license

I create animations that are:
• On-brand and professional
• Smooth and polished
• Optimized for various platforms
• Memorable and impactful""",
        "basic_price": Decimal("250.00"),
        "basic_description": "Simple logo animation (5 seconds)",
        "basic_delivery_days": 3,
        "basic_revisions": 2,
        "standard_price": Decimal("500.00"),
        "standard_description": "Complex logo animation with effects (10 seconds)",
        "standard_delivery_days": 5,
        "standard_revisions": 3,
        "premium_price": Decimal("1000.00"),
        "premium_description": "Premium 3D logo animation + source files + multiple versions",
        "premium_delivery_days": 7,
        "premium_revisions": 5,
        "tags": ["logo animation", "branding", "motion graphics", "intro"],
    },
    # Emily's Gigs
    {
        "creator_index": 4,
        "title": "I will help you grow on YouTube Shorts with data-driven editing",
        "category": "Video Editing",
        "subcategory": "YouTube",
        "video_type": "YouTube Short",
        "description": """Grow your YouTube channel with Shorts that are scientifically optimized for views!

I don't just edit videos - I analyze data and implement proven strategies that make your Shorts perform.

My approach:
✓ Analytics-based editing decisions
✓ A/B testing different styles
✓ Retention curve optimization
✓ Click-through rate enhancement
✓ Algorithm-friendly formatting
✓ Competitor analysis

I've helped channels:
• Gain 100K+ subscribers in 6 months
• Generate 10M+ views from Shorts
• Achieve 80%+ retention rates
• Improve CTR by 300%

You'll receive:
• Professionally edited Shorts
• Performance report
• Optimization recommendations
• Thumbnail options (Standard+)

Perfect for serious YouTubers who want measurable growth!""",
        "basic_price": Decimal("100.00"),
        "basic_description": "3 data-optimized YouTube Shorts",
        "basic_delivery_days": 3,
        "basic_revisions": 2,
        "standard_price": Decimal("280.00"),
        "standard_description": "7 Shorts + thumbnails + performance report",
        "standard_delivery_days": 5,
        "standard_revisions": 3,
        "premium_price": Decimal("600.00"),
        "premium_description": "15 Shorts + thumbnails + growth strategy + monthly consulting",
        "premium_delivery_days": 10,
        "premium_revisions": 4,
        "tags": ["youtube shorts", "channel growth", "data driven", "analytics"],
    },
    {
        "creator_index": 4,
        "title": "I will edit TikTok videos that follow trending formats",
        "category": "Video Editing",
        "subcategory": "Social Media",
        "video_type": "TikTok",
        "description": """Stay ahead of trends with TikTok videos edited in the latest viral formats!

I spend hours daily researching TikTok trends so you don't have to. I'll edit your videos using:
• Current trending formats
• Popular transitions
• Viral effects
• Trending sounds
• Optimal pacing

Benefits:
✓ Higher chance of going viral
✓ Better algorithm performance
✓ More engagement
✓ Professional quality
✓ Fast turnaround

I track trends in:
• Dance challenges
• Comedy skits
• Educational content
• Product reviews
• Day-in-the-life vlogs
• And more!

Perfect for brands and creators who want to stay relevant and maximize their TikTok presence.""",
        "basic_price": Decimal("90.00"),
        "basic_description": "3 trend-optimized TikTok videos",
        "basic_delivery_days": 2,
        "basic_revisions": 2,
        "standard_price": Decimal("240.00"),
        "standard_description": "7 videos + trend report + hashtag suggestions",
        "standard_delivery_days": 4,
        "standard_revisions": 3,
        "premium_price": Decimal("500.00"),
        "premium_description": "15 videos + trend forecasting + content calendar",
        "premium_delivery_days": 7,
        "premium_revisions": 4,
        "tags": ["tiktok", "trends", "viral", "social media"],
    },
    # Alex's Gigs
    {
        "creator_index": 5,
        "title": "I will color grade your footage for a cinematic look",
        "category": "Video Editing",
        "subcategory": "Color Grading",
        "video_type": "Cinematic",
        "description": """Transform your footage with professional color grading that rivals Hollywood productions!

As a certified colorist, I'll elevate your video with:
✓ Cinematic color grading
✓ Professional color correction
✓ Mood and atmosphere enhancement
✓ Skin tone perfection
✓ Consistent look across all shots
✓ Custom LUTs (Premium)

I work with:
• DaVinci Resolve Studio
• Adobe Premiere Pro
• Final Cut Pro
• Custom color science

Services include:
• Music videos
• Short films
• Commercials
• Social media content
• Wedding videos
• Corporate videos

What you'll get:
• Professionally graded footage
• Color-matched shots
• Cinematic atmosphere
• Multiple look options
• Fast delivery

Before/after examples available upon request!""",
        "basic_price": Decimal("150.00"),
        "basic_description": "Color grade up to 3 minutes of footage",
        "basic_delivery_days": 3,
        "basic_revisions": 2,
        "standard_price": Decimal("400.00"),
        "standard_description": "Color grade up to 10 minutes + color correction",
        "standard_delivery_days": 5,
        "standard_revisions": 3,
        "premium_price": Decimal("900.00"),
        "premium_description": "Color grade up to 30 minutes + custom LUTs + unlimited revisions",
        "premium_delivery_days": 7,
        "premium_revisions": 999,
        "tags": ["color grading", "color correction", "cinematic", "davinci resolve"],
    },
    {
        "creator_index": 5,
        "title": "I will edit your promotional video with professional quality",
        "category": "Video Editing",
        "subcategory": "Commercial",
        "video_type": "Promotional",
        "description": """Create promotional videos that convert viewers into customers!

With 7 years of experience editing promos for brands across all industries, I know how to create videos that sell.

What makes my promos effective:
✓ Clear messaging
✓ Professional pacing
✓ Attention-grabbing hooks
✓ Strong call-to-action
✓ Optimized for conversions
✓ Platform-specific formatting

Perfect for:
• Product launches
• Service promotions
• Event announcements
• App demonstrations
• Company overviews
• Sales campaigns

Services include:
• Professional editing
• Color grading
• Sound design
• Text animations
• Motion graphics
• Music licensing assistance

Delivered in any format you need: Instagram, Facebook, YouTube, LinkedIn, TikTok, website, or broadcast.""",
        "basic_price": Decimal("200.00"),
        "basic_description": "30-second promotional video",
        "basic_delivery_days": 4,
        "basic_revisions": 2,
        "standard_price": Decimal("450.00"),
        "standard_description": "60-second promo + multiple format exports",
        "standard_delivery_days": 6,
        "standard_revisions": 3,
        "premium_price": Decimal("1000.00"),
        "premium_description": "2-minute premium promo + motion graphics + multiple versions",
        "premium_delivery_days": 10,
        "premium_revisions": 5,
        "tags": ["promotional video", "commercial", "marketing", "professional"],
    },
    # Maria's Gigs
    {
        "creator_index": 6,
        "title": "I will create a complete social media video content strategy",
        "category": "Social Media Content",
        "subcategory": "Strategy",
        "video_type": "Multiple",
        "description": """Stop posting random content - get a data-driven strategy that works!

I combine creative editing with marketing analytics to create content that drives real business results.

What's included:
✓ Audience analysis
✓ Competitor research
✓ Content calendar (30 days)
✓ Video content creation
✓ Platform optimization
✓ Performance tracking
✓ Monthly strategy sessions

I'll create videos for:
• Instagram (Reels, Stories, Posts)
• TikTok
• YouTube (Shorts, regular videos)
• Facebook
• LinkedIn

Results my clients have achieved:
• 300% increase in engagement
• 150% follower growth in 90 days
• 5x improvement in reach
• Higher conversion rates

Perfect for:
• Small businesses
• Personal brands
• Startups
• E-commerce brands
• Service providers

Let's build a strategy that actually works!""",
        "basic_price": Decimal("500.00"),
        "basic_description": "Strategy + 5 videos + content calendar",
        "basic_delivery_days": 7,
        "basic_revisions": 2,
        "standard_price": Decimal("1200.00"),
        "standard_description": "Complete strategy + 15 videos + 2 platforms",
        "standard_delivery_days": 14,
        "standard_revisions": 3,
        "premium_price": Decimal("3000.00"),
        "premium_description": "Full strategy + 30 videos + 4 platforms + monthly consulting",
        "premium_delivery_days": 30,
        "premium_revisions": 5,
        "tags": ["social media strategy", "content marketing", "business growth"],
    },
    {
        "creator_index": 6,
        "title": "I will create product demo videos that drive sales",
        "category": "Video Editing",
        "subcategory": "Product Videos",
        "video_type": "Product Demo",
        "description": """Showcase your product with videos that actually convert!

I create product demo videos that highlight benefits, solve objections, and drive purchasing decisions.

What you'll get:
✓ Professional product showcase
✓ Benefit-focused messaging
✓ Clear calls-to-action
✓ Multiple format exports
✓ A/B testing versions (Premium)
✓ Sales-optimized editing

Perfect for:
• E-commerce products
• SaaS platforms
• Mobile apps
• Physical products
• Digital products
• Service demonstrations

Video types I create:
• Product features
• How-to guides
• Comparison videos
• Unboxing videos
• Testimonial integration
• Before/after showcases

All videos are optimized for your specific platform and audience. I can also provide multiple versions for A/B testing.""",
        "basic_price": Decimal("180.00"),
        "basic_description": "30-second product demo video",
        "basic_delivery_days": 4,
        "basic_revisions": 2,
        "standard_price": Decimal("400.00"),
        "standard_description": "60-second demo + multiple angles + CTA optimization",
        "standard_delivery_days": 6,
        "standard_revisions": 3,
        "premium_price": Decimal("850.00"),
        "premium_description": "2-minute comprehensive demo + A/B versions + platform optimization",
        "premium_delivery_days": 10,
        "premium_revisions": 4,
        "tags": ["product video", "demo", "e-commerce", "conversion"],
    },
    # Chris's Gigs
    {
        "creator_index": 7,
        "title": "I will create professional VFX for your videos and commercials",
        "category": "Visual Effects",
        "subcategory": "VFX",
        "video_type": "Multiple",
        "description": """Bring your vision to life with stunning visual effects!

With 9 years of VFX experience in film and advertising, I create photorealistic effects that amaze audiences.

Services include:
✓ Green screen compositing
✓ 3D object integration
✓ Particle effects
✓ Motion tracking
✓ Clean-up and removal
✓ Face replacement
✓ CGI integration

Software I master:
• Adobe After Effects
• Cinema 4D
• Nuke
• Mocha Pro
• Element 3D
• Particular

Perfect for:
• Music videos
• Commercials
• Short films
• Social media content
• Product visualizations
• Impossible shots

I've worked on projects for major brands and independent productions. Let's create something impossible!""",
        "basic_price": Decimal("300.00"),
        "basic_description": "Simple VFX shot (10 seconds)",
        "basic_delivery_days": 5,
        "basic_revisions": 2,
        "standard_price": Decimal("750.00"),
        "standard_description": "Complex VFX sequence (30 seconds)",
        "standard_delivery_days": 10,
        "standard_revisions": 3,
        "premium_price": Decimal("2000.00"),
        "premium_description": "Advanced VFX with 3D integration (60 seconds)",
        "premium_delivery_days": 21,
        "premium_revisions": 4,
        "tags": ["vfx", "visual effects", "cgi", "compositing", "3d"],
    },
    {
        "creator_index": 7,
        "title": "I will do green screen compositing and background replacement",
        "category": "Visual Effects",
        "subcategory": "Compositing",
        "video_type": "Green Screen",
        "description": """Professional green screen keying and compositing for flawless results!

I'll make your green screen footage look like it was shot on location with:
✓ Clean, professional keying
✓ Perfect edge detail
✓ Color matching
✓ Realistic shadows
✓ Atmospheric effects
✓ Motion blur matching

What I can do:
• Replace backgrounds
• Create impossible locations
• Combine multiple elements
• Add virtual sets
• Integrate stock footage
• Create composite scenes

I use advanced techniques including:
• Multi-pass keying
• Spill suppression
• Edge refinement
• Color grading matching
• Realistic lighting integration

Perfect for:
• Content creators
• Corporate videos
• Music videos
• Educational content
• Product videos
• Social media content

Send me your green screen footage and let me work my magic!""",
        "basic_price": Decimal("200.00"),
        "basic_description": "Green screen keying for up to 2 minutes",
        "basic_delivery_days": 3,
        "basic_revisions": 2,
        "standard_price": Decimal("450.00"),
        "standard_description": "Complex keying + color matching + shadows (5 minutes)",
        "standard_delivery_days": 5,
        "standard_revisions": 3,
        "premium_price": Decimal("1000.00"),
        "premium_description": "Advanced compositing + VFX integration (10 minutes)",
        "premium_delivery_days": 10,
        "premium_revisions": 4,
        "tags": ["green screen", "compositing", "background replacement", "keying"],
    },
    # Sophie's Gigs
    {
        "creator_index": 8,
        "title": "I will create professional brand videos for your business",
        "category": "Video Editing",
        "subcategory": "Brand Content",
        "video_type": "Brand Video",
        "description": """Elevate your brand with polished, professional video content!

I specialize in creating brand videos that tell your story and connect with your audience on an emotional level.

What I create:
✓ Brand story videos
✓ Company culture videos
✓ Mission and values videos
✓ Team introduction videos
✓ Customer testimonial videos
✓ About us videos

My approach:
• Strategic storytelling
• Professional editing
• Brand consistency
• Emotional connection
• Clear messaging
• Call-to-action focus

Perfect for:
• Websites
• Social media
• Investor presentations
• Trade shows
• Email campaigns
• Sales materials

I'll work closely with you to understand your brand and create videos that authentically represent your business.

5+ years experience with brands across technology, healthcare, retail, and professional services.""",
        "basic_price": Decimal("250.00"),
        "basic_description": "1-minute brand video",
        "basic_delivery_days": 5,
        "basic_revisions": 2,
        "standard_price": Decimal("550.00"),
        "standard_description": "2-minute brand story + testimonial integration",
        "standard_delivery_days": 7,
        "standard_revisions": 3,
        "premium_price": Decimal("1200.00"),
        "premium_description": "3-minute premium brand video + motion graphics + multiple versions",
        "premium_delivery_days": 14,
        "premium_revisions": 5,
        "tags": ["brand video", "corporate", "business", "professional"],
    },
    {
        "creator_index": 8,
        "title": "I will edit customer testimonial videos that build trust",
        "category": "Video Editing",
        "subcategory": "Testimonials",
        "video_type": "Testimonial",
        "description": """Turn customer testimonials into powerful sales tools!

Testimonial videos are one of the most effective marketing tools. I'll edit your customer interviews into compelling videos that build trust and drive conversions.

What I do:
✓ Remove awkward pauses and filler words
✓ Highlight key benefits and results
✓ Add professional polish
✓ Include text highlights
✓ Add your branding
✓ Optimize pacing for engagement

Video formats:
• Full testimonials (1-3 minutes)
• Short social clips (15-30 seconds)
• Compilation videos
• Case study videos
• Before/after showcases

I'll make your customers' stories shine and help prospects see themselves in your success stories.

Perfect for:
• Service businesses
• SaaS companies
• E-commerce brands
• B2B companies
• Professional services
• Healthcare providers""",
        "basic_price": Decimal("150.00"),
        "basic_description": "1 testimonial video (up to 2 minutes)",
        "basic_delivery_days": 3,
        "basic_revisions": 2,
        "standard_price": Decimal("400.00"),
        "standard_description": "3 testimonials + social media clips",
        "standard_delivery_days": 5,
        "standard_revisions": 3,
        "premium_price": Decimal("850.00"),
        "premium_description": "5 testimonials + compilation video + multiple formats",
        "premium_delivery_days": 10,
        "premium_revisions": 4,
        "tags": ["testimonial", "customer video", "social proof", "conversion"],
    },
    # Ryan's Gigs
    {
        "creator_index": 9,
        "title": "I will create high-energy videos with creative transitions",
        "category": "Video Editing",
        "subcategory": "Action/Sports",
        "video_type": "Action",
        "description": """Electrify your audience with fast-paced, high-energy video editing!

Known for my creative transitions and dynamic editing style, I create videos that keep viewers on the edge of their seats.

My specialty:
✓ Unique, creative transitions
✓ Fast-paced cutting
✓ Perfect music syncing
✓ High-energy pacing
✓ Action-packed sequences
✓ Viewer engagement optimization

Perfect for:
• Action sports videos
• Fitness content
• Lifestyle brands
• Travel videos
• Event highlights
• Product launches
• Extreme sports
• Adventure content

My editing style is influenced by top action sports cinematographers and is perfect for brands targeting active, adventurous audiences.

I use:
• Adobe Premiere Pro
• After Effects
• Sound design tools
• Color grading software

Let's create something that gets hearts racing!""",
        "basic_price": Decimal("180.00"),
        "basic_description": "1-minute high-energy video",
        "basic_delivery_days": 3,
        "basic_revisions": 2,
        "standard_price": Decimal("400.00"),
        "standard_description": "2-3 minute video + sound design + color grade",
        "standard_delivery_days": 5,
        "standard_revisions": 3,
        "premium_price": Decimal("850.00"),
        "premium_description": "5-minute premium edit + slow-mo + VFX + music license",
        "premium_delivery_days": 10,
        "premium_revisions": 4,
        "tags": ["action", "sports", "high energy", "transitions", "creative"],
    },
    {
        "creator_index": 9,
        "title": "I will edit your travel videos with cinematic storytelling",
        "category": "Video Editing",
        "subcategory": "Travel",
        "video_type": "Travel",
        "description": """Transform your travel footage into cinematic stories that inspire wanderlust!

I specialize in editing travel videos that capture the essence of adventure and make viewers feel like they're there with you.

What you'll get:
✓ Cinematic storytelling
✓ Creative transitions between locations
✓ Perfect music selection
✓ Color grading for atmosphere
✓ Dynamic pacing
✓ Emotional impact

Video types:
• Destination highlights
• Travel vlogs
• Adventure montages
• City guides
• Travel commercials
• Tourism videos

My editing style combines:
• Epic establishing shots
• Intimate moments
• Cultural insights
• Adventure sequences
• Beautiful landscapes
• Human connections

Perfect for:
• Travel content creators
• Tourism boards
• Hotels and resorts
• Travel agencies
• Personal travel videos
• YouTube channels

Let me help you share your adventures with the world!""",
        "basic_price": Decimal("200.00"),
        "basic_description": "2-minute travel highlight video",
        "basic_delivery_days": 4,
        "basic_revisions": 2,
        "standard_price": Decimal("450.00"),
        "standard_description": "5-minute cinematic travel video + color grade",
        "standard_delivery_days": 7,
        "standard_revisions": 3,
        "premium_price": Decimal("1000.00"),
        "premium_description": "10-minute travel film + motion graphics + soundtrack",
        "premium_delivery_days": 14,
        "premium_revisions": 4,
        "tags": ["travel", "cinematic", "adventure", "storytelling"],
    },
    # Additional diverse gigs
    {
        "creator_index": 0,
        "title": "I will edit podcast clips for social media promotion",
        "category": "Video Editing",
        "subcategory": "Podcast",
        "video_type": "Podcast Clips",
        "description": """Turn your podcast into viral social media clips!

I'll help you promote your podcast by creating engaging video clips optimized for Instagram, TikTok, YouTube Shorts, and LinkedIn.

What I do:
✓ Identify the most engaging moments
✓ Add animated captions for sound-off viewing
✓ Include animated waveforms
✓ Add your branding and graphics
✓ Optimize for each platform
✓ Create thumbnail-worthy moments

Perfect for:
• Growing your podcast audience
• Promoting new episodes
• Repurposing long-form content
• Building social media presence
• Driving traffic to full episodes

I'll make your podcast content work harder for you!""",
        "basic_price": Decimal("100.00"),
        "basic_description": "3 podcast clips (30 seconds each)",
        "basic_delivery_days": 2,
        "basic_revisions": 2,
        "standard_price": Decimal("250.00"),
        "standard_description": "10 clips with captions + waveforms",
        "standard_delivery_days": 4,
        "standard_revisions": 3,
        "premium_price": Decimal("500.00"),
        "premium_description": "20 clips + custom graphics + platform optimization",
        "premium_delivery_days": 7,
        "premium_revisions": 4,
        "tags": ["podcast", "audiogram", "social media", "clips"],
    },
    {
        "creator_index": 3,
        "title": "I will create animated explainer videos for your product or service",
        "category": "Animation",
        "subcategory": "Explainer",
        "video_type": "Explainer",
        "description": """Explain complex concepts simply with engaging animated explainer videos!

I create clear, concise explainer videos that help your audience understand your product or service in minutes.

Perfect for:
✓ Product launches
✓ SaaS onboarding
✓ Service explanations
✓ App demonstrations
✓ Process walkthroughs
✓ Educational content

My explainer videos include:
• Custom illustrations
• Professional voiceover coordination
• Background music
• Smooth animations
• Clear messaging
• Strong call-to-action

Styles available:
• 2D character animation
• Motion graphics
• Whiteboard animation
• Kinetic typography
• Icon animation

Used by startups, enterprises, and everyone in between to increase conversion rates and reduce customer confusion.""",
        "basic_price": Decimal("400.00"),
        "basic_description": "30-second explainer video",
        "basic_delivery_days": 7,
        "basic_revisions": 2,
        "standard_price": Decimal("850.00"),
        "standard_description": "60-second explainer + script consultation",
        "standard_delivery_days": 14,
        "standard_revisions": 3,
        "premium_price": Decimal("1800.00"),
        "premium_description": "90-second premium explainer + custom characters + voiceover",
        "premium_delivery_days": 21,
        "premium_revisions": 5,
        "tags": ["explainer video", "animation", "product demo", "educational"],
    },
    {
        "creator_index": 6,
        "title": "I will create UGC-style content that converts",
        "category": "Social Media Content",
        "subcategory": "UGC",
        "video_type": "User Generated Content",
        "description": """Create authentic UGC-style videos that build trust and drive sales!

User-generated content style videos convert 5x better than traditional ads. I'll create authentic-looking content that resonates with your audience.

What you get:
✓ Authentic, relatable videos
✓ Native platform feel
✓ Multiple hooks tested
✓ Clear call-to-action
✓ Platform optimization
✓ High conversion focus

Perfect for:
• E-commerce brands
• DTC products
• Beauty and skincare
• Fashion brands
• Tech products
• Food and beverage

Formats I create:
• Product unboxings
• Before/after showcases
• Product reviews
• Tutorial-style content
• Problem-solution videos
• Testimonial-style content

All videos are created to look natural and authentic, not like traditional advertising.""",
        "basic_price": Decimal("150.00"),
        "basic_description": "3 UGC-style videos (15-30 seconds)",
        "basic_delivery_days": 3,
        "basic_revisions": 2,
        "standard_price": Decimal("350.00"),
        "standard_description": "7 videos with multiple hooks tested",
        "standard_delivery_days": 5,
        "standard_revisions": 3,
        "premium_price": Decimal("750.00"),
        "premium_description": "15 videos + A/B testing + platform variants",
        "premium_delivery_days": 10,
        "premium_revisions": 4,
        "tags": ["ugc", "user generated content", "conversion", "e-commerce"],
    },
    {
        "creator_index": 8,
        "title": "I will create wedding video highlights that capture your special day",
        "category": "Video Editing",
        "subcategory": "Wedding",
        "video_type": "Wedding",
        "description": """Preserve your wedding memories with beautiful, emotional highlight videos!

I create wedding videos that capture the love, joy, and magic of your special day in a way that you'll want to watch over and over.

What's included:
✓ Ceremony highlights
✓ Reception moments
✓ Emotional speeches
✓ First dance
✓ Key moments
✓ Beautiful music selection
✓ Professional color grading

My wedding editing style:
• Cinematic and romantic
• Emotionally impactful
• Well-paced storytelling
• Natural and authentic
• Professionally polished

Video deliverables:
• Full highlight video (4-8 minutes)
• Social media teaser (1 minute)
• Ceremony edit (Optional)
• Speeches edit (Optional)

I'll work with your footage to create a video that perfectly captures the emotions and memories of your wedding day.""",
        "basic_price": Decimal("300.00"),
        "basic_description": "4-minute wedding highlight video",
        "basic_delivery_days": 7,
        "basic_revisions": 2,
        "standard_price": Decimal("600.00"),
        "standard_description": "8-minute highlight + 1-minute teaser + color grade",
        "standard_delivery_days": 10,
        "standard_revisions": 3,
        "premium_price": Decimal("1200.00"),
        "premium_description": "Full edit + ceremony + speeches + same-day edit",
        "premium_delivery_days": 14,
        "premium_revisions": 4,
        "tags": ["wedding", "wedding video", "highlight reel", "cinematic"],
    },
    {
        "creator_index": 1,
        "title": "I will create custom animated stickers and GIFs for social media",
        "category": "Animation",
        "subcategory": "Stickers & GIFs",
        "video_type": "Animation",
        "description": """Boost engagement with custom animated stickers and GIFs for your brand!

I create fun, shareable animated content that increases brand awareness and engagement on social media platforms.

What I create:
✓ Animated stickers for Instagram Stories
✓ Branded GIFs for GIPHY
✓ Reaction GIFs
✓ Animated emojis
✓ Looping animations
✓ Character animations

Perfect for:
• Building brand identity
• Increasing social engagement
• Making your brand shareable
• Standing out on social media
• Creating brand assets

Platforms supported:
• Instagram Stories
• GIPHY
• WhatsApp
• Telegram
• Discord
• Social media posts

I'll design and animate custom stickers that reflect your brand personality and give your audience fun ways to engage with your brand.""",
        "basic_price": Decimal("200.00"),
        "basic_description": "5 animated stickers/GIFs",
        "basic_delivery_days": 5,
        "basic_revisions": 2,
        "standard_price": Decimal("450.00"),
        "standard_description": "15 stickers + GIPHY upload",
        "standard_delivery_days": 7,
        "standard_revisions": 3,
        "premium_price": Decimal("900.00"),
        "premium_description": "30 stickers + character design + all platforms",
        "premium_delivery_days": 14,
        "premium_revisions": 4,
        "tags": ["animation", "stickers", "gifs", "social media", "branding"],
    },
    {
        "creator_index": 4,
        "title": "I will repurpose your long-form content into viral short clips",
        "category": "Video Editing",
        "subcategory": "Content Repurposing",
        "video_type": "Short Clips",
        "description": """Get more mileage from your content by repurposing it into viral short-form videos!

I'll analyze your long-form content (YouTube videos, webinars, podcasts, interviews) and transform the best moments into platform-optimized short clips.

What I do:
✓ Identify viral-worthy moments
✓ Optimize for each platform
✓ Add engaging captions
✓ Include hooks and CTAs
✓ Format for vertical video
✓ Maximize engagement potential

From one piece of content, get:
• Multiple Instagram Reels
• TikTok videos
• YouTube Shorts
• LinkedIn videos
• Twitter clips

This service is perfect for:
• Podcasters
• YouTubers
• Course creators
• Coaches and consultants
• Webinar hosts
• Conference speakers

Maximize your content ROI by reaching new audiences on multiple platforms!""",
        "basic_price": Decimal("120.00"),
        "basic_description": "5 clips from your long-form content",
        "basic_delivery_days": 3,
        "basic_revisions": 2,
        "standard_price": Decimal("300.00"),
        "standard_description": "15 clips optimized for 3 platforms",
        "standard_delivery_days": 5,
        "standard_revisions": 3,
        "premium_price": Decimal("650.00"),
        "premium_description": "30 clips + captions + platform optimization + posting schedule",
        "premium_delivery_days": 10,
        "premium_revisions": 4,
        "tags": ["content repurposing", "short form", "clips", "multi-platform"],
    },
    {
        "creator_index": 7,
        "title": "I will create stunning music video effects and visuals",
        "category": "Visual Effects",
        "subcategory": "Music Video",
        "video_type": "Music Video",
        "description": """Make your music video unforgettable with professional visual effects!

I create eye-catching VFX and visual elements that elevate music videos from good to extraordinary.

Services include:
✓ Creative visual effects
✓ Color grading and correction
✓ Particle effects
✓ Glitch effects
✓ Trippy visuals
✓ Green screen work
✓ 3D elements

Effects I specialize in:
• Kaleidoscope effects
• Duplications and cloning
• Speed ramping
• Distortion effects
• Light effects
• Abstract visuals
• Surreal compositions

Genres I work with:
• Hip-hop/Rap
• Electronic/EDM
• Pop
• Rock
• R&B
• Alternative
• Indie

I stay current with music video trends and can recreate popular effects or create completely original visuals for your video.""",
        "basic_price": Decimal("350.00"),
        "basic_description": "VFX for one music video scene",
        "basic_delivery_days": 5,
        "basic_revisions": 2,
        "standard_price": Decimal("800.00"),
        "standard_description": "Complete music video VFX (3-4 minutes)",
        "standard_delivery_days": 10,
        "standard_revisions": 3,
        "premium_price": Decimal("2000.00"),
        "premium_description": "Premium music video VFX + 3D elements + color grade",
        "premium_delivery_days": 21,
        "premium_revisions": 5,
        "tags": ["music video", "vfx", "visual effects", "creative"],
    },
]


# ============================================================================
# SEED FUNCTIONS
# ============================================================================

async def seed_users_and_profiles(session: AsyncSession) -> Dict[str, List[uuid.UUID]]:
    """Seed users (creators and clients) with their profiles."""
    print("Seeding users and profiles...")

    creator_profile_ids = []
    client_profile_ids = []
    user_ids = {"creators": [], "clients": []}

    # Create creator users
    for creator_data in CREATOR_USERS:
        # Create user
        user_id = uuid.uuid4()
        await session.execute(
            text("""
                INSERT INTO users (id, email, password_hash, user_type, email_verified, created_at, updated_at)
                VALUES (:id, :email, :password_hash, 'creator', TRUE, NOW(), NOW())
            """),
            {
                "id": user_id,
                "email": creator_data["email"],
                "password_hash": hash_password("password123"),
            }
        )
        user_ids["creators"].append(user_id)

        # Create creator profile
        profile_id = uuid.uuid4()
        await session.execute(
            text("""
                INSERT INTO creator_profiles (
                    id, user_id, display_name, tagline, bio,
                    years_of_experience, hourly_rate, availability_status,
                    response_time_hours, is_verified, verification_level,
                    instagram_handle, tiktok_handle, youtube_channel, website_url,
                    average_rating, total_reviews, created_at, updated_at
                )
                VALUES (
                    :id, :user_id, :display_name, :tagline, :bio,
                    :years_of_experience, :hourly_rate, 'available',
                    :response_time, TRUE, :verification_level,
                    :instagram_handle, :tiktok_handle, :youtube_channel, :website_url,
                    :average_rating, :total_reviews, NOW(), NOW()
                )
            """),
            {
                "id": profile_id,
                "user_id": user_id,
                "display_name": creator_data["display_name"],
                "tagline": creator_data["tagline"],
                "bio": creator_data["bio"],
                "years_of_experience": creator_data["years_of_experience"],
                "hourly_rate": creator_data["hourly_rate"],
                "response_time": random.randint(1, 6),
                "verification_level": "pro" if creator_data["years_of_experience"] > 5 else "basic",
                "instagram_handle": creator_data.get("instagram_handle"),
                "tiktok_handle": creator_data.get("tiktok_handle"),
                "youtube_channel": creator_data.get("youtube_channel"),
                "website_url": creator_data.get("website_url"),
                "average_rating": Decimal(str(round(random.uniform(4.5, 5.0), 2))),
                "total_reviews": random.randint(10, 150),
            }
        )
        creator_profile_ids.append(profile_id)

    # Create client users
    for client_data in CLIENT_USERS:
        # Create user
        user_id = uuid.uuid4()
        await session.execute(
            text("""
                INSERT INTO users (id, email, password_hash, user_type, email_verified, created_at, updated_at)
                VALUES (:id, :email, :password_hash, 'client', TRUE, NOW(), NOW())
            """),
            {
                "id": user_id,
                "email": client_data["email"],
                "password_hash": hash_password("password123"),
            }
        )
        user_ids["clients"].append(user_id)

        # Create client profile
        profile_id = uuid.uuid4()
        await session.execute(
            text("""
                INSERT INTO client_profiles (
                    id, user_id, company_name, industry, company_size,
                    website_url, description, is_verified, payment_verified,
                    created_at, updated_at
                )
                VALUES (
                    :id, :user_id, :company_name, :industry, :company_size,
                    :website_url, :description, TRUE, TRUE,
                    NOW(), NOW()
                )
            """),
            {
                "id": profile_id,
                "user_id": user_id,
                "company_name": client_data["company_name"],
                "industry": client_data["industry"],
                "company_size": client_data["company_size"],
                "website_url": client_data["website_url"],
                "description": client_data["description"],
            }
        )
        client_profile_ids.append(profile_id)

    await session.commit()
    print(f"✓ Created {len(creator_profile_ids)} creators and {len(client_profile_ids)} clients")

    return {
        "creator_profile_ids": creator_profile_ids,
        "client_profile_ids": client_profile_ids,
        "user_ids": user_ids,
    }


async def seed_gigs(session: AsyncSession, creator_profile_ids: List[uuid.UUID]) -> List[uuid.UUID]:
    """Seed gigs with packages."""
    print("Seeding gigs...")

    gig_ids = []

    for gig_data in GIGS:
        gig_id = uuid.uuid4()
        creator_profile_id = creator_profile_ids[gig_data["creator_index"]]

        # Generate slug from title
        slug = gig_data["title"].lower()
        slug = slug.replace("i will ", "").replace(" ", "-")[:100]
        slug = f"{slug}-{str(gig_id)[:8]}"

        await session.execute(
            text("""
                INSERT INTO gigs (
                    id, creator_profile_id, title, slug, description,
                    category, subcategory, video_type,
                    basic_price, basic_description, basic_delivery_days, basic_revisions,
                    standard_price, standard_description, standard_delivery_days, standard_revisions,
                    premium_price, premium_description, premium_delivery_days, premium_revisions,
                    status, search_tags, view_count, order_count,
                    created_at, updated_at, published_at
                )
                VALUES (
                    :id, :creator_profile_id, :title, :slug, :description,
                    :category, :subcategory, :video_type,
                    :basic_price, :basic_description, :basic_delivery_days, :basic_revisions,
                    :standard_price, :standard_description, :standard_delivery_days, :standard_revisions,
                    :premium_price, :premium_description, :premium_delivery_days, :premium_revisions,
                    'active', :search_tags, :view_count, :order_count,
                    NOW(), NOW(), NOW()
                )
            """),
            {
                "id": gig_id,
                "creator_profile_id": creator_profile_id,
                "title": gig_data["title"],
                "slug": slug,
                "description": gig_data["description"],
                "category": gig_data["category"],
                "subcategory": gig_data.get("subcategory"),
                "video_type": gig_data.get("video_type"),
                "basic_price": gig_data["basic_price"],
                "basic_description": gig_data["basic_description"],
                "basic_delivery_days": gig_data["basic_delivery_days"],
                "basic_revisions": gig_data["basic_revisions"],
                "standard_price": gig_data.get("standard_price"),
                "standard_description": gig_data.get("standard_description"),
                "standard_delivery_days": gig_data.get("standard_delivery_days"),
                "standard_revisions": gig_data.get("standard_revisions"),
                "premium_price": gig_data.get("premium_price"),
                "premium_description": gig_data.get("premium_description"),
                "premium_delivery_days": gig_data.get("premium_delivery_days"),
                "premium_revisions": gig_data.get("premium_revisions"),
                "search_tags": gig_data.get("tags", []),
                "view_count": random.randint(50, 5000),
                "order_count": random.randint(5, 100),
            }
        )
        gig_ids.append(gig_id)

    await session.commit()
    print(f"✓ Created {len(gig_ids)} gigs with packages")

    return gig_ids


async def seed_projects_and_proposals(
    session: AsyncSession,
    client_profile_ids: List[uuid.UUID],
    creator_profile_ids: List[uuid.UUID]
) -> Dict[str, List[uuid.UUID]]:
    """Seed projects and proposals."""
    print("Seeding projects and proposals...")

    project_ids = []
    proposal_ids = []

    project_templates = [
        {
            "title": "Need 10 Instagram Reels for Product Launch",
            "description": "We're launching a new fitness app and need 10 high-quality Instagram Reels to promote it. Looking for someone who understands fitness content and can create engaging, scroll-stopping videos.",
            "category": "Video Editing",
            "video_type": "Instagram Reel",
            "budget_min": Decimal("800.00"),
            "budget_max": Decimal("1500.00"),
        },
        {
            "title": "Animated Explainer Video for SaaS Product",
            "description": "We need a 90-second animated explainer video for our project management software. Should be professional, clear, and help potential customers understand our value proposition quickly.",
            "category": "Animation",
            "video_type": "Explainer",
            "budget_min": Decimal("1200.00"),
            "budget_max": Decimal("2000.00"),
        },
        {
            "title": "TikTok Content Creator for Fashion Brand",
            "description": "Looking for a TikTok expert to create 20 videos per month for our fashion brand. Must understand current trends and have experience creating viral content.",
            "category": "Social Media Content",
            "video_type": "TikTok",
            "budget_min": Decimal("1500.00"),
            "budget_max": Decimal("3000.00"),
        },
        {
            "title": "Professional Color Grading for Short Film",
            "description": "We've completed filming a 15-minute short film and need professional color grading to give it a cinematic look. Looking for someone with DaVinci Resolve experience.",
            "category": "Video Editing",
            "video_type": "Cinematic",
            "budget_min": Decimal("500.00"),
            "budget_max": Decimal("1000.00"),
        },
        {
            "title": "YouTube Shorts Series (12 episodes)",
            "description": "Need an editor for a 12-episode YouTube Shorts series about cooking. Each episode will be 45-60 seconds. Fast turnaround required.",
            "category": "Video Editing",
            "video_type": "YouTube Short",
            "budget_min": Decimal("600.00"),
            "budget_max": Decimal("1200.00"),
        },
    ]

    # Create projects
    for i, template in enumerate(project_templates):
        project_id = uuid.uuid4()
        client_profile_id = client_profile_ids[i % len(client_profile_ids)]

        await session.execute(
            text("""
                INSERT INTO projects (
                    id, client_profile_id, title, description, category,
                    video_type, budget_type, budget_min, budget_max,
                    deadline_date, experience_level, status,
                    view_count, proposal_count, created_at, updated_at, published_at
                )
                VALUES (
                    :id, :client_profile_id, :title, :description, :category,
                    :video_type, 'range', :budget_min, :budget_max,
                    :deadline_date, :experience_level, :status,
                    :view_count, :proposal_count, NOW(), NOW(), NOW()
                )
            """),
            {
                "id": project_id,
                "client_profile_id": client_profile_id,
                "title": template["title"],
                "description": template["description"],
                "category": template["category"],
                "video_type": template.get("video_type"),
                "budget_min": template["budget_min"],
                "budget_max": template["budget_max"],
                "deadline_date": (datetime.now() + timedelta(days=random.randint(14, 60))).date(),
                "experience_level": random.choice(["intermediate", "expert"]),
                "status": random.choice(["open", "open", "open", "in_progress"]),
                "view_count": random.randint(20, 500),
                "proposal_count": random.randint(3, 15),
            }
        )
        project_ids.append(project_id)

        # Create 3-5 proposals for each project
        num_proposals = random.randint(3, 5)
        selected_creators = random.sample(creator_profile_ids, min(num_proposals, len(creator_profile_ids)))

        for creator_profile_id in selected_creators:
            proposal_id = uuid.uuid4()

            cover_letters = [
                "Hi! I'd love to work on this project. I have extensive experience with this type of content and can deliver high-quality results within your timeline. Check out my portfolio for similar work!",
                "Hello! I'm very interested in this project. I've completed over 50 similar projects and have a 5-star rating. I can start immediately and deliver exactly what you're looking for.",
                "Hi there! This project is perfect for me. I specialize in this type of content and have worked with similar brands before. I'd love to discuss your vision and bring it to life!",
                "Hey! I'm confident I can exceed your expectations on this project. My editing style aligns perfectly with what you're looking for. Let's chat about the details!",
            ]

            await session.execute(
                text("""
                    INSERT INTO proposals (
                        id, project_id, creator_profile_id, cover_letter,
                        proposed_budget, proposed_timeline_days, status,
                        created_at, updated_at
                    )
                    VALUES (
                        :id, :project_id, :creator_profile_id, :cover_letter,
                        :proposed_budget, :proposed_timeline_days, :status,
                        NOW(), NOW()
                    )
                """),
                {
                    "id": proposal_id,
                    "project_id": project_id,
                    "creator_profile_id": creator_profile_id,
                    "cover_letter": random.choice(cover_letters),
                    "proposed_budget": Decimal(str(random.uniform(
                        float(template["budget_min"]),
                        float(template["budget_max"])
                    ))).quantize(Decimal("0.01")),
                    "proposed_timeline_days": random.randint(7, 30),
                    "status": random.choice(["pending", "pending", "pending", "shortlisted"]),
                }
            )
            proposal_ids.append(proposal_id)

    await session.commit()
    print(f"✓ Created {len(project_ids)} projects and {len(proposal_ids)} proposals")

    return {"project_ids": project_ids, "proposal_ids": proposal_ids}


async def seed_contracts_and_reviews(
    session: AsyncSession,
    client_profile_ids: List[uuid.UUID],
    creator_profile_ids: List[uuid.UUID],
    user_ids: Dict[str, List[uuid.UUID]],
    gig_ids: List[uuid.UUID]
) -> None:
    """Seed contracts and reviews."""
    print("Seeding contracts and reviews...")

    contract_ids = []

    # Create 10-15 completed contracts
    num_contracts = random.randint(10, 15)

    for _ in range(num_contracts):
        contract_id = uuid.uuid4()
        client_profile_id = random.choice(client_profile_ids)
        creator_profile_id = random.choice(creator_profile_ids)
        gig_id = random.choice(gig_ids)

        # Get gig details for pricing
        result = await session.execute(
            text("SELECT title, basic_price, standard_price, premium_price FROM gigs WHERE id = :gig_id"),
            {"gig_id": gig_id}
        )
        gig = result.fetchone()

        if gig:
            price = random.choice([gig[1], gig[2] or gig[1], gig[3] or gig[1]])
            platform_fee = price * Decimal("0.15")
            creator_payout = price - platform_fee

            start_date = datetime.now() - timedelta(days=random.randint(30, 90))
            deadline_date = start_date + timedelta(days=random.randint(7, 21))
            completed_date = deadline_date - timedelta(days=random.randint(0, 3))

            await session.execute(
                text("""
                    INSERT INTO contracts (
                        id, gig_id, client_profile_id, creator_profile_id,
                        title, description, scope_of_work,
                        total_amount, platform_fee, creator_payout,
                        start_date, deadline_date, status,
                        created_at, accepted_at, started_at, completed_at
                    )
                    VALUES (
                        :id, :gig_id, :client_profile_id, :creator_profile_id,
                        :title, :description, :scope_of_work,
                        :total_amount, :platform_fee, :creator_payout,
                        :start_date, :deadline_date, 'completed',
                        :created_at, :accepted_at, :started_at, :completed_at
                    )
                """),
                {
                    "id": contract_id,
                    "gig_id": gig_id,
                    "client_profile_id": client_profile_id,
                    "creator_profile_id": creator_profile_id,
                    "title": gig[0],
                    "description": f"Contract for: {gig[0]}",
                    "scope_of_work": "Deliver high-quality video content as per gig description.",
                    "total_amount": price,
                    "platform_fee": platform_fee,
                    "creator_payout": creator_payout,
                    "start_date": start_date.date(),
                    "deadline_date": deadline_date.date(),
                    "created_at": start_date,
                    "accepted_at": start_date + timedelta(hours=2),
                    "started_at": start_date + timedelta(hours=3),
                    "completed_at": completed_date,
                }
            )
            contract_ids.append(contract_id)

            # Create reviews (80% chance)
            if random.random() < 0.8:
                # Client reviews creator
                await session.execute(
                    text("""
                        INSERT INTO reviews (
                            id, contract_id, reviewer_user_id, reviewee_user_id,
                            reviewer_type, overall_rating, communication_rating,
                            quality_rating, professionalism_rating, value_rating,
                            title, comment, is_public, created_at, updated_at
                        )
                        VALUES (
                            :id, :contract_id, :reviewer_user_id, :reviewee_user_id,
                            'client', :overall_rating, :communication_rating,
                            :quality_rating, :professionalism_rating, :value_rating,
                            :title, :comment, TRUE, :created_at, :created_at
                        )
                    """),
                    {
                        "id": uuid.uuid4(),
                        "contract_id": contract_id,
                        "reviewer_user_id": user_ids["clients"][client_profile_ids.index(client_profile_id)],
                        "reviewee_user_id": user_ids["creators"][creator_profile_ids.index(creator_profile_id)],
                        "overall_rating": random.randint(4, 5),
                        "communication_rating": random.randint(4, 5),
                        "quality_rating": random.randint(4, 5),
                        "professionalism_rating": random.randint(4, 5),
                        "value_rating": random.randint(4, 5),
                        "title": random.choice([
                            "Excellent work!",
                            "Amazing results",
                            "Highly recommend",
                            "Great experience",
                            "Professional and talented"
                        ]),
                        "comment": random.choice([
                            "Fantastic work! The videos turned out even better than I expected. Will definitely work together again.",
                            "Very professional and delivered on time. The quality exceeded my expectations. Highly recommended!",
                            "Great communication throughout the project. The final product was exactly what I was looking for.",
                            "Exceeded expectations! Very talented editor who understands what makes content engaging.",
                            "Quick turnaround and excellent quality. Will be using their services again for future projects."
                        ]),
                        "created_at": completed_date + timedelta(days=1),
                    }
                )

                # Creator reviews client (60% chance)
                if random.random() < 0.6:
                    await session.execute(
                        text("""
                            INSERT INTO reviews (
                                id, contract_id, reviewer_user_id, reviewee_user_id,
                                reviewer_type, overall_rating, communication_rating,
                                professionalism_rating, title, comment, is_public,
                                created_at, updated_at
                            )
                            VALUES (
                                :id, :contract_id, :reviewer_user_id, :reviewee_user_id,
                                'creator', :overall_rating, :communication_rating,
                                :professionalism_rating, :title, :comment, TRUE,
                                :created_at, :created_at
                            )
                        """),
                        {
                            "id": uuid.uuid4(),
                            "contract_id": contract_id,
                            "reviewer_user_id": user_ids["creators"][creator_profile_ids.index(creator_profile_id)],
                            "reviewee_user_id": user_ids["clients"][client_profile_ids.index(client_profile_id)],
                            "overall_rating": random.randint(4, 5),
                            "communication_rating": random.randint(4, 5),
                            "professionalism_rating": random.randint(4, 5),
                            "title": random.choice([
                                "Great client!",
                                "Pleasure to work with",
                                "Smooth project",
                                "Highly professional"
                            ]),
                            "comment": random.choice([
                                "Clear communication and knew exactly what they wanted. A pleasure to work with!",
                                "Very professional client. Would love to work together again on future projects.",
                                "Great feedback and easy to collaborate with. Highly recommend!",
                                "Prompt payments and clear requirements. Excellent client!"
                            ]),
                            "created_at": completed_date + timedelta(days=2),
                        }
                    )

    await session.commit()
    print(f"✓ Created {len(contract_ids)} contracts with reviews")


async def seed_conversations_and_messages(
    session: AsyncSession,
    user_ids: Dict[str, List[uuid.UUID]]
) -> None:
    """Seed conversations and messages."""
    print("Seeding conversations and messages...")

    # Create 5-8 conversations
    num_conversations = random.randint(5, 8)

    for _ in range(num_conversations):
        conversation_id = uuid.uuid4()

        # Random client and creator
        client_user_id = random.choice(user_ids["clients"])
        creator_user_id = random.choice(user_ids["creators"])

        await session.execute(
            text("""
                INSERT INTO conversations (
                    id, conversation_type, last_message_at, created_at
                )
                VALUES (
                    :id, 'direct', NOW(), NOW()
                )
            """),
            {"id": conversation_id}
        )

        # Add participants
        for user_id in [client_user_id, creator_user_id]:
            await session.execute(
                text("""
                    INSERT INTO conversation_participants (
                        id, conversation_id, user_id, last_read_at, unread_count, joined_at
                    )
                    VALUES (
                        :id, :conversation_id, :user_id, NOW(), 0, NOW()
                    )
                """),
                {
                    "id": uuid.uuid4(),
                    "conversation_id": conversation_id,
                    "user_id": user_id,
                }
            )

        # Create 3-7 messages
        num_messages = random.randint(3, 7)
        message_templates = [
            "Hi! I'm interested in working with you on my project.",
            "Hello! I'd love to discuss the details. What's your availability?",
            "I'm available this week. Can you share more about what you need?",
            "Sure! I need 5 Instagram Reels for a product launch.",
            "That sounds great! I can definitely help with that. What's your timeline?",
            "I need them within 2 weeks. Is that doable?",
            "Yes, absolutely! Let's discuss the specific requirements.",
        ]

        for i in range(num_messages):
            sender_id = creator_user_id if i % 2 == 1 else client_user_id
            created_at = datetime.now() - timedelta(days=random.randint(1, 7), hours=random.randint(0, 23))

            await session.execute(
                text("""
                    INSERT INTO messages (
                        id, conversation_id, sender_user_id, message_type,
                        content, created_at
                    )
                    VALUES (
                        :id, :conversation_id, :sender_user_id, 'text',
                        :content, :created_at
                    )
                """),
                {
                    "id": uuid.uuid4(),
                    "conversation_id": conversation_id,
                    "sender_user_id": sender_id,
                    "content": message_templates[i % len(message_templates)],
                    "created_at": created_at,
                }
            )

    await session.commit()
    print(f"✓ Created {num_conversations} conversations with messages")


async def run_all_seeds(session: AsyncSession) -> None:
    """Run all seed functions in order."""
    print("\n" + "=" * 60)
    print("Starting ReelByte Database Seeding")
    print("=" * 60 + "\n")

    # Seed users and profiles
    result = await seed_users_and_profiles(session)
    creator_profile_ids = result["creator_profile_ids"]
    client_profile_ids = result["client_profile_ids"]
    user_ids = result["user_ids"]

    # Seed gigs
    gig_ids = await seed_gigs(session, creator_profile_ids)

    # Seed projects and proposals
    await seed_projects_and_proposals(session, client_profile_ids, creator_profile_ids)

    # Seed contracts and reviews
    await seed_contracts_and_reviews(
        session,
        client_profile_ids,
        creator_profile_ids,
        user_ids,
        gig_ids
    )

    # Seed conversations and messages
    await seed_conversations_and_messages(session, user_ids)

    print("\n" + "=" * 60)
    print("Database Seeding Complete!")
    print("=" * 60)
    print("\nSummary:")
    print(f"  • {len(creator_profile_ids)} Creator Users")
    print(f"  • {len(client_profile_ids)} Client Users")
    print(f"  • {len(gig_ids)} Gigs (with Basic, Standard, Premium packages)")
    print(f"  • 5 Projects with multiple proposals")
    print(f"  • 10-15 Completed contracts with reviews")
    print(f"  • 5-8 Conversations with messages")
    print("\nAll test users have password: password123")
    print("=" * 60 + "\n")
