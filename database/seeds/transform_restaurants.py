#!/usr/bin/env python3
"""
Transform OpenStreetMap Amsterdam restaurant data into ReelByte seed format.
"""

import json
import re
from pathlib import Path
from typing import List, Dict
from datetime import datetime
import random


def slugify(text: str) -> str:
    """Convert text to URL-friendly slug."""
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text.strip('-')


def calculate_data_score(restaurant: Dict) -> int:
    """Calculate completeness score for restaurant data."""
    score = 0
    if restaurant.get('name'): score += 10
    if restaurant.get('address') and len(restaurant.get('address', '')) > 10: score += 15
    if restaurant.get('phone'): score += 20
    if restaurant.get('website'): score += 25
    if restaurant.get('email'): score += 15
    if restaurant.get('instagram'): score += 20
    if restaurant.get('cuisine'): score += 10
    if restaurant.get('opening_hours'): score += 10
    if restaurant.get('lat') and restaurant.get('lon'): score += 5
    return score


def estimate_company_size(cuisine: str) -> str:
    """Estimate company size based on cuisine type."""
    if not cuisine:
        return "11-50"

    cuisine_lower = cuisine.lower()

    # Small operations
    if any(word in cuisine_lower for word in ['pizza', 'burger', 'sandwich', 'coffee', 'ice_cream']):
        return "1-10"

    # Large operations
    if any(word in cuisine_lower for word in ['international', 'fine_dining', 'seafood', 'steakhouse']):
        return "51-200"

    # Default to mid-size
    return "11-50"


def estimate_budget_range(cuisine: str, has_website: bool) -> tuple[int, int]:
    """Estimate collaboration budget range based on restaurant tier."""
    if not cuisine:
        return (100, 250)

    cuisine_lower = cuisine.lower()

    # Fine dining / upscale
    if any(word in cuisine_lower for word in ['fine_dining', 'french', 'fusion', 'seafood', 'japanese', 'sushi']):
        return (300, 500)

    # Casual / fast casual
    if any(word in cuisine_lower for word in ['pizza', 'burger', 'sandwich', 'kebab', 'falafel']):
        return (50, 150)

    # Mid-range with website
    if has_website:
        return (150, 300)

    # Default mid-range
    return (100, 250)


def generate_description(name: str, cuisine: str, address: str) -> str:
    """Generate restaurant description from available data."""
    descriptions = []

    if cuisine:
        cuisine_pretty = cuisine.replace('_', ' ').title()
        descriptions.append(f"Authentic {cuisine_pretty} restaurant")
    else:
        descriptions.append("Restaurant")

    descriptions.append("in Amsterdam")

    if 'centrum' in address.lower() or '1012' in address:
        descriptions.append("located in the historic city center")
    elif any(area in address.lower() for area in ['zuid', 'oud-zuid']):
        descriptions.append("in the upscale Zuid district")
    elif 'oost' in address.lower():
        descriptions.append("in the vibrant Oost neighborhood")
    elif 'west' in address.lower():
        descriptions.append("in trendy West")

    base_desc = ", ".join(descriptions) + "."

    # Add second sentence based on cuisine
    if cuisine:
        cuisine_lower = cuisine.lower()
        if 'italian' in cuisine_lower:
            base_desc += " We serve traditional Italian dishes made with fresh, high-quality ingredients."
        elif 'asian' in cuisine_lower or 'thai' in cuisine_lower or 'chinese' in cuisine_lower:
            base_desc += " Experience authentic Asian flavors in the heart of Amsterdam."
        elif 'french' in cuisine_lower:
            base_desc += " Classic French cuisine with a modern Amsterdam twist."
        elif 'turkish' in cuisine_lower or 'mediterranean' in cuisine_lower:
            base_desc += " Fresh Mediterranean cuisine with warm hospitality."
        else:
            base_desc += " We're looking for talented influencers to showcase our unique dining experience."
    else:
        base_desc += " Looking to collaborate with food influencers to share our story."

    return base_desc


def generate_email(name: str, existing_email: str = None, index: int = 0) -> str:
    """Generate business email from restaurant name."""
    # Always generate unique email with index to avoid duplicates
    slug = slugify(name)
    # Clean up common restaurant words
    slug = re.sub(r'\b(restaurant|cafe|bar|bistro|brasserie)\b', '', slug)
    slug = slug.strip('-')

    if not slug:
        slug = f"restaurant{index}"

    # Randomly choose email prefix
    prefixes = ['info', 'contact', 'marketing', 'hello']
    prefix = random.choice(prefixes)

    # Most Dutch restaurants use .nl domain
    # Add index to ensure uniqueness
    return f"{prefix}@{slug}{index}.nl"


def load_restaurant_data(json_path: Path) -> List[Dict]:
    """Load restaurant data from JSON file."""
    with open(json_path, 'r', encoding='utf-8') as f:
        return json.load(f)


def transform_restaurants(restaurants: List[Dict], limit: int = 100) -> List[Dict]:
    """
    Transform OSM restaurant data into ReelByte ClientProfile format.

    Returns list of dicts with:
    - user_email
    - user_password (plaintext - will be hashed in seed script)
    - company_name
    - company_size
    - industry
    - website_url
    - description
    - is_verified
    - lat, lon (for potential future features)
    - original_data (for debugging)
    """
    print(f"Processing {len(restaurants)} restaurants...")

    # Score and sort restaurants by data completeness
    scored = [(r, calculate_data_score(r)) for r in restaurants]
    scored.sort(key=lambda x: x[1], reverse=True)

    print(f"Top score: {scored[0][1]}, Lowest score: {scored[-1][1]}")

    # Take top restaurants with decent data (score >= 50)
    quality_restaurants = [r for r, score in scored if score >= 50][:limit]

    print(f"Selected {len(quality_restaurants)} restaurants with quality data (score >= 50)")

    transformed = []

    for idx, restaurant in enumerate(quality_restaurants):
        name = restaurant.get('name', 'Unknown Restaurant')
        cuisine = restaurant.get('cuisine', '')
        address = restaurant.get('address', 'Amsterdam')
        website = restaurant.get('website', '')

        transformed_restaurant = {
            # User fields
            'user_email': generate_email(name, restaurant.get('email'), idx),
            'user_password': 'password123',  # Will be hashed in seed script
            'user_type': 'client',
            'email_verified': True,

            # ClientProfile fields
            'company_name': name,
            'company_size': estimate_company_size(cuisine),
            'industry': 'Food & Beverage',
            'website_url': website,
            'description': generate_description(name, cuisine, address),
            'is_verified': random.random() < 0.5,  # 50% verified

            # Additional metadata for project generation
            'cuisine': cuisine,
            'address': address,
            'phone': restaurant.get('phone', ''),
            'instagram': restaurant.get('instagram', ''),
            'lat': restaurant.get('lat'),
            'lon': restaurant.get('lon'),
            'budget_range': estimate_budget_range(cuisine, bool(website)),

            # For debugging
            'original_osm_id': restaurant.get('osm_id'),
        }

        transformed.append(transformed_restaurant)

    return transformed


def get_amsterdam_restaurants(limit: int = 100) -> List[Dict]:
    """Main function to get transformed restaurant data."""
    # Find the JSON file (should be in project root)
    json_path = Path(__file__).parent.parent.parent / 'amsterdam_restaurants_osm.json'

    if not json_path.exists():
        raise FileNotFoundError(
            f"Restaurant data not found at {json_path}. "
            "Please run scrape_amsterdam_openstreetmap.py first."
        )

    print(f"Loading restaurant data from {json_path}")
    restaurants = load_restaurant_data(json_path)

    transformed = transform_restaurants(restaurants, limit=limit)

    # Print summary
    print("\n" + "="*70)
    print("TRANSFORMATION SUMMARY")
    print("="*70)
    print(f"Total restaurants transformed: {len(transformed)}")
    print(f"  - With website: {sum(1 for r in transformed if r['website_url'])}")
    print(f"  - With phone: {sum(1 for r in transformed if r['phone'])}")
    print(f"  - With Instagram: {sum(1 for r in transformed if r['instagram'])}")
    print(f"  - Verified: {sum(1 for r in transformed if r['is_verified'])}")

    # Show cuisine distribution
    cuisines = {}
    for r in transformed:
        cuisine = r.get('cuisine', 'Unknown') or 'Unknown'
        cuisines[cuisine] = cuisines.get(cuisine, 0) + 1

    print("\nTop 5 cuisines:")
    for cuisine, count in sorted(cuisines.items(), key=lambda x: x[1], reverse=True)[:5]:
        print(f"  - {cuisine}: {count}")

    print(f"\nSample restaurants:")
    for i, r in enumerate(transformed[:3], 1):
        print(f"\n{i}. {r['company_name']}")
        print(f"   Email: {r['user_email']}")
        print(f"   Cuisine: {r.get('cuisine', 'N/A')}")
        print(f"   Budget range: €{r['budget_range'][0]}-€{r['budget_range'][1]}")
        if r['website_url']:
            print(f"   Website: {r['website_url']}")

    return transformed


if __name__ == "__main__":
    # Test the transformer
    restaurants = get_amsterdam_restaurants(limit=100)
    print(f"\n✅ Successfully transformed {len(restaurants)} restaurants")
