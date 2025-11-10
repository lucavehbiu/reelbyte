#!/usr/bin/env python3
"""
Free restaurant scraper for Amsterdam using OpenStreetMap (Overpass API).
No API key required!
"""

import json
import csv
import time
import requests
from typing import List, Dict
import sys
from pathlib import Path

class OSMRestaurantScraper:
    def __init__(self):
        self.restaurants = []
        self.overpass_url = "https://overpass-api.de/api/interpreter"

    def fetch_restaurants(self, limit: int = 60) -> List[Dict]:
        """
        Fetch restaurants from OpenStreetMap using Overpass API.
        Completely free, no API key required!
        """
        print("Fetching restaurants from OpenStreetMap...")

        # Amsterdam bounding box: [south, west, north, east]
        # Amsterdam center: ~52.37, 4.89
        bbox = "52.3,4.8,52.4,5.0"  # Covers central Amsterdam

        # Overpass QL query for restaurants
        query = f"""
        [out:json][timeout:25];
        (
          node["amenity"="restaurant"]({bbox});
          way["amenity"="restaurant"]({bbox});
          relation["amenity"="restaurant"]({bbox});
        );
        out body;
        >;
        out skel qt;
        """

        try:
            response = requests.post(
                self.overpass_url,
                data={'data': query},
                timeout=30
            )
            response.raise_for_status()
            data = response.json()

            restaurants = []
            elements = data.get('elements', [])

            print(f"Found {len(elements)} restaurant entries in OSM data...")

            for element in elements[:limit]:
                if element.get('type') not in ['node', 'way']:
                    continue

                tags = element.get('tags', {})

                # Skip if no name
                if not tags.get('name'):
                    continue

                # Get coordinates
                lat = element.get('lat', '')
                lon = element.get('lon', '')

                # For ways, use center coordinates if available
                if not lat and element.get('type') == 'way':
                    if 'center' in element:
                        lat = element['center'].get('lat', '')
                        lon = element['center'].get('lon', '')

                restaurant = {
                    'name': tags.get('name', ''),
                    'address': self._format_address(tags),
                    'phone': tags.get('phone', tags.get('contact:phone', '')),
                    'website': tags.get('website', tags.get('contact:website', '')),
                    'email': tags.get('email', tags.get('contact:email', '')),
                    'instagram': self._extract_instagram(tags),
                    'cuisine': tags.get('cuisine', ''),
                    'opening_hours': tags.get('opening_hours', ''),
                    'lat': lat,
                    'lon': lon,
                    'osm_id': element.get('id', ''),
                }

                restaurants.append(restaurant)

                if len(restaurants) >= limit:
                    break

            print(f"✓ Found {len(restaurants)} restaurants with names")
            return restaurants

        except requests.exceptions.RequestException as e:
            print(f"Error fetching from OpenStreetMap: {e}")
            return []
        except Exception as e:
            print(f"Unexpected error: {e}")
            return []

    def _format_address(self, tags: Dict) -> str:
        """Format address from OSM tags."""
        parts = []

        if tags.get('addr:street'):
            street = tags['addr:street']
            if tags.get('addr:housenumber'):
                street += f" {tags['addr:housenumber']}"
            parts.append(street)

        if tags.get('addr:postcode'):
            parts.append(tags['addr:postcode'])

        if tags.get('addr:city'):
            parts.append(tags['addr:city'])
        elif not tags.get('addr:city'):
            parts.append('Amsterdam')

        return ', '.join(parts) if parts else ''

    def _extract_instagram(self, tags: Dict) -> str:
        """Extract Instagram handle from tags."""
        # Check contact:instagram
        instagram = tags.get('contact:instagram', '')
        if instagram:
            # Clean up the handle
            if 'instagram.com/' in instagram:
                return '@' + instagram.split('instagram.com/')[-1].strip('/')
            elif instagram.startswith('@'):
                return instagram
            else:
                return '@' + instagram

        # Check in website field
        website = tags.get('website', '')
        if 'instagram.com/' in website:
            return '@' + website.split('instagram.com/')[-1].strip('/')

        return ''

    def save_to_csv(self, restaurants: List[Dict], filename: str = "amsterdam_restaurants_osm.csv"):
        """Save restaurant data to CSV file."""
        if not restaurants:
            print("No data to save!")
            return

        script_dir = Path(__file__).parent
        filepath = script_dir / filename

        with open(filepath, 'w', newline='', encoding='utf-8') as f:
            fieldnames = [
                'name', 'address', 'phone', 'website', 'email', 'instagram',
                'cuisine', 'opening_hours', 'lat', 'lon', 'osm_id'
            ]
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(restaurants)

        print(f"\n✓ Saved {len(restaurants)} restaurants to {filepath}")

    def save_to_json(self, restaurants: List[Dict], filename: str = "amsterdam_restaurants_osm.json"):
        """Save restaurant data to JSON file."""
        if not restaurants:
            print("No data to save!")
            return

        script_dir = Path(__file__).parent
        filepath = script_dir / filename

        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(restaurants, f, indent=2, ensure_ascii=False)

        print(f"✓ Saved {len(restaurants)} restaurants to {filepath}")

    def print_summary(self, restaurants: List[Dict]):
        """Print a summary of the scraped data."""
        if not restaurants:
            return

        print("\n" + "="*70)
        print("SUMMARY")
        print("="*70)
        print(f"Total restaurants found: {len(restaurants)}")

        with_phone = sum(1 for r in restaurants if r.get('phone'))
        with_website = sum(1 for r in restaurants if r.get('website'))
        with_email = sum(1 for r in restaurants if r.get('email'))
        with_instagram = sum(1 for r in restaurants if r.get('instagram'))

        print(f"  - With phone: {with_phone} ({with_phone/len(restaurants)*100:.1f}%)")
        print(f"  - With website: {with_website} ({with_website/len(restaurants)*100:.1f}%)")
        print(f"  - With email: {with_email} ({with_email/len(restaurants)*100:.1f}%)")
        print(f"  - With Instagram: {with_instagram} ({with_instagram/len(restaurants)*100:.1f}%)")

        # Show cuisines
        cuisines = {}
        for r in restaurants:
            cuisine = r.get('cuisine', 'Unknown')
            if cuisine:
                cuisines[cuisine] = cuisines.get(cuisine, 0) + 1

        if cuisines:
            print(f"\nTop cuisines:")
            for cuisine, count in sorted(cuisines.items(), key=lambda x: x[1], reverse=True)[:5]:
                print(f"  - {cuisine}: {count}")

        print("\nSample restaurants:")
        for i, restaurant in enumerate(restaurants[:5], 1):
            print(f"\n{i}. {restaurant['name']}")
            if restaurant.get('address'):
                print(f"   Address: {restaurant['address']}")
            if restaurant.get('phone'):
                print(f"   Phone: {restaurant['phone']}")
            if restaurant.get('website'):
                print(f"   Website: {restaurant['website']}")
            if restaurant.get('cuisine'):
                print(f"   Cuisine: {restaurant['cuisine']}")

def main():
    import argparse

    parser = argparse.ArgumentParser(description='Scrape Amsterdam restaurants from OpenStreetMap')
    parser.add_argument('--limit', type=int, default=60, help='Maximum number of restaurants to fetch (default: 60)')
    parser.add_argument('--csv', type=str, default='amsterdam_restaurants_osm.csv', help='CSV output filename')
    parser.add_argument('--json', type=str, default='amsterdam_restaurants_osm.json', help='JSON output filename')

    args = parser.parse_args()

    print("="*70)
    print("🍽️  AMSTERDAM RESTAURANT SCRAPER (OpenStreetMap)")
    print("="*70)
    print("Using FREE OpenStreetMap data - No API key required!")
    print()

    scraper = OSMRestaurantScraper()
    restaurants = scraper.fetch_restaurants(limit=args.limit)

    if restaurants:
        scraper.save_to_csv(restaurants, args.csv)
        scraper.save_to_json(restaurants, args.json)
        scraper.print_summary(restaurants)
    else:
        print("❌ No restaurants found!")

if __name__ == "__main__":
    main()
