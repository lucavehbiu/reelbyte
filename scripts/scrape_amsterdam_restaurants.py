#!/usr/bin/env python3
"""
Script to find restaurants in Amsterdam with contact information.
Collects: name, address, phone, email, website, Instagram
"""

import json
import csv
import time
import re
from typing import List, Dict, Optional
import sys
from pathlib import Path

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print("Installing required packages...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "requests", "beautifulsoup4", "lxml"])
    import requests
    from bs4 import BeautifulSoup


class RestaurantScraper:
    def __init__(self):
        self.restaurants = []
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }

    def extract_email(self, text: str) -> Optional[str]:
        """Extract email from text using regex."""
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        match = re.search(email_pattern, text)
        return match.group(0) if match else None

    def extract_instagram(self, text: str, html: str = "") -> Optional[str]:
        """Extract Instagram handle from text or HTML."""
        # Look for instagram.com links
        ig_patterns = [
            r'instagram\.com/([a-zA-Z0-9._]+)',
            r'@([a-zA-Z0-9._]+)',
        ]

        combined_text = text + " " + html
        for pattern in ig_patterns:
            match = re.search(pattern, combined_text)
            if match:
                handle = match.group(1)
                if handle and len(handle) > 2:
                    return f"@{handle}" if not handle.startswith('@') else handle
        return None

    def extract_phone(self, text: str) -> Optional[str]:
        """Extract phone number from text."""
        # Dutch phone patterns
        phone_patterns = [
            r'\+31\s?\d{1,2}\s?\d{7,8}',
            r'0\d{2,3}[-\s]?\d{6,7}',
            r'\(\+31\)\s?\d{1,2}\s?\d{7,8}',
        ]

        for pattern in phone_patterns:
            match = re.search(pattern, text)
            if match:
                return match.group(0).strip()
        return None

    def scrape_overpass_api(self, limit: int = 100) -> List[Dict]:
        """
        Use OpenStreetMap Overpass API to get restaurants in Amsterdam.
        This is a free API with good coverage.
        """
        print("Fetching restaurants from OpenStreetMap...")

        # Amsterdam bounding box coordinates
        # [south, west, north, east]
        bbox = "52.3,4.8,52.4,5.0"

        overpass_url = "http://overpass-api.de/api/interpreter"
        query = f"""
        [out:json][timeout:25];
        (
          node["amenity"="restaurant"](52.3,4.8,52.4,5.0);
          way["amenity"="restaurant"](52.3,4.8,52.4,5.0);
        );
        out body;
        >;
        out skel qt;
        """

        try:
            response = requests.post(overpass_url, data=query, timeout=30)
            response.raise_for_status()
            data = response.json()

            restaurants = []
            for element in data.get('elements', [])[:limit]:
                tags = element.get('tags', {})
                if tags.get('amenity') == 'restaurant' and tags.get('name'):
                    restaurant = {
                        'name': tags.get('name', ''),
                        'address': self._format_address(tags),
                        'phone': tags.get('phone', tags.get('contact:phone', '')),
                        'website': tags.get('website', tags.get('contact:website', '')),
                        'email': tags.get('email', tags.get('contact:email', '')),
                        'instagram': tags.get('contact:instagram', ''),
                        'cuisine': tags.get('cuisine', ''),
                        'lat': element.get('lat', ''),
                        'lon': element.get('lon', ''),
                    }
                    restaurants.append(restaurant)

            print(f"Found {len(restaurants)} restaurants from OpenStreetMap")
            return restaurants

        except Exception as e:
            print(f"Error fetching from Overpass API: {e}")
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
        return ', '.join(parts) if parts else ''

    def enrich_with_google_search(self, restaurant: Dict) -> Dict:
        """
        Try to find additional contact info via Google search.
        Note: This is basic scraping and may not always work.
        """
        if not restaurant.get('name'):
            return restaurant

        try:
            # Search for restaurant website
            query = f"{restaurant['name']} Amsterdam restaurant contact"
            search_url = f"https://www.google.com/search?q={query.replace(' ', '+')}"

            response = requests.get(search_url, headers=self.headers, timeout=10)
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')
                text = soup.get_text()

                # Try to extract missing info
                if not restaurant.get('email'):
                    restaurant['email'] = self.extract_email(text) or ''

                if not restaurant.get('instagram'):
                    restaurant['instagram'] = self.extract_instagram(text, str(soup)) or ''

                if not restaurant.get('phone'):
                    restaurant['phone'] = self.extract_phone(text) or ''

            time.sleep(2)  # Be polite with requests

        except Exception as e:
            print(f"Error enriching {restaurant['name']}: {e}")

        return restaurant

    def scrape_tripadvisor_amsterdam(self, limit: int = 50) -> List[Dict]:
        """
        Scrape basic restaurant info from TripAdvisor Amsterdam.
        Note: TripAdvisor has anti-scraping measures, so this may be limited.
        """
        print("Attempting to fetch from TripAdvisor (may be limited)...")

        restaurants = []
        base_url = "https://www.tripadvisor.com/Restaurants-g188590-Amsterdam_North_Holland_Province.html"

        try:
            response = requests.get(base_url, headers=self.headers, timeout=10)
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')

                # This is a simplified example - TripAdvisor structure changes often
                restaurant_elements = soup.find_all('div', class_='restaurants-list')

                print("TripAdvisor scraping is complex due to their anti-bot measures.")
                print("Consider using their API or manual data entry for best results.")

        except Exception as e:
            print(f"TripAdvisor scraping limited: {e}")

        return restaurants

    def save_to_csv(self, filename: str = "amsterdam_restaurants.csv"):
        """Save restaurants to CSV file."""
        if not self.restaurants:
            print("No restaurants to save!")
            return

        output_path = Path(__file__).parent / filename

        fieldnames = ['name', 'address', 'phone', 'email', 'website', 'instagram', 'cuisine', 'lat', 'lon']

        with open(output_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()

            for restaurant in self.restaurants:
                # Ensure all fields exist
                row = {field: restaurant.get(field, '') for field in fieldnames}
                writer.writerow(row)

        print(f"\nSaved {len(self.restaurants)} restaurants to {output_path}")

    def save_to_json(self, filename: str = "amsterdam_restaurants.json"):
        """Save restaurants to JSON file."""
        if not self.restaurants:
            print("No restaurants to save!")
            return

        output_path = Path(__file__).parent / filename

        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(self.restaurants, f, indent=2, ensure_ascii=False)

        print(f"Saved {len(self.restaurants)} restaurants to {output_path}")

    def print_summary(self):
        """Print summary statistics."""
        if not self.restaurants:
            print("No restaurants found!")
            return

        total = len(self.restaurants)
        with_phone = sum(1 for r in self.restaurants if r.get('phone'))
        with_email = sum(1 for r in self.restaurants if r.get('email'))
        with_website = sum(1 for r in self.restaurants if r.get('website'))
        with_instagram = sum(1 for r in self.restaurants if r.get('instagram'))

        print("\n" + "="*60)
        print("SUMMARY")
        print("="*60)
        print(f"Total restaurants: {total}")
        print(f"With phone: {with_phone} ({with_phone/total*100:.1f}%)")
        print(f"With email: {with_email} ({with_email/total*100:.1f}%)")
        print(f"With website: {with_website} ({with_website/total*100:.1f}%)")
        print(f"With Instagram: {with_instagram} ({with_instagram/total*100:.1f}%)")
        print("="*60)

    def run(self, limit: int = 100, enrich: bool = False):
        """Main execution method."""
        print("Amsterdam Restaurant Scraper")
        print("="*60)

        # Fetch from OpenStreetMap
        osm_restaurants = self.scrape_overpass_api(limit=limit)
        self.restaurants.extend(osm_restaurants)

        # Optionally enrich with Google search
        if enrich and self.restaurants:
            print(f"\nEnriching restaurant data (this may take a while)...")
            for i, restaurant in enumerate(self.restaurants[:20]):  # Limit enrichment
                print(f"Enriching {i+1}/{min(20, len(self.restaurants))}: {restaurant['name']}")
                self.restaurants[i] = self.enrich_with_google_search(restaurant)

        # Save results
        if self.restaurants:
            self.save_to_csv()
            self.save_to_json()
            self.print_summary()

            # Print first 5 examples
            print("\nFirst 5 restaurants:")
            for i, restaurant in enumerate(self.restaurants[:5], 1):
                print(f"\n{i}. {restaurant['name']}")
                print(f"   Address: {restaurant.get('address', 'N/A')}")
                print(f"   Phone: {restaurant.get('phone', 'N/A')}")
                print(f"   Website: {restaurant.get('website', 'N/A')}")
                print(f"   Email: {restaurant.get('email', 'N/A')}")
                print(f"   Instagram: {restaurant.get('instagram', 'N/A')}")
        else:
            print("No restaurants found!")


def main():
    import argparse

    parser = argparse.ArgumentParser(description='Scrape Amsterdam restaurants')
    parser.add_argument('--limit', type=int, default=100, help='Maximum number of restaurants to fetch')
    parser.add_argument('--enrich', action='store_true', help='Enrich data with Google search (slower)')
    parser.add_argument('--output-csv', default='amsterdam_restaurants.csv', help='Output CSV filename')
    parser.add_argument('--output-json', default='amsterdam_restaurants.json', help='Output JSON filename')

    args = parser.parse_args()

    scraper = RestaurantScraper()
    scraper.run(limit=args.limit, enrich=args.enrich)


if __name__ == "__main__":
    main()
