#!/usr/bin/env python3
"""
Enhanced script to find restaurants in Amsterdam with contact information.
Supports multiple data sources including Google Places API.
"""

import json
import csv
import time
import re
import os
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
    def __init__(self, google_api_key: Optional[str] = None):
        self.restaurants = []
        self.google_api_key = google_api_key or os.getenv('GOOGLE_PLACES_API_KEY')
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }

    def fetch_google_places(self, limit: int = 60) -> List[Dict]:
        """
        Fetch restaurants using Google Places API.
        Get a free API key at: https://console.cloud.google.com/
        Enable Places API and set GOOGLE_PLACES_API_KEY environment variable.
        """
        if not self.google_api_key:
            print("⚠️  No Google Places API key found.")
            print("   Set GOOGLE_PLACES_API_KEY environment variable or pass --api-key")
            print("   Get a free key at: https://console.cloud.google.com/")
            return []

        print("Fetching restaurants from Google Places API...")

        restaurants = []
        base_url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"

        # Amsterdam center coordinates
        location = "52.3676,4.9041"
        radius = 5000  # 5km radius

        params = {
            'location': location,
            'radius': radius,
            'type': 'restaurant',
            'key': self.google_api_key
        }

        try:
            # Initial request
            response = requests.get(base_url, params=params)
            response.raise_for_status()
            data = response.json()

            if data.get('status') != 'OK':
                print(f"Google Places API error: {data.get('status')}")
                if data.get('error_message'):
                    print(f"Error message: {data['error_message']}")
                return []

            # Process results
            for place in data.get('results', [])[:limit]:
                place_id = place.get('place_id')

                # Get detailed info
                details = self._get_place_details(place_id)

                restaurant = {
                    'name': place.get('name', ''),
                    'address': place.get('vicinity', ''),
                    'phone': details.get('phone', ''),
                    'website': details.get('website', ''),
                    'email': details.get('email', ''),
                    'instagram': details.get('instagram', ''),
                    'rating': place.get('rating', ''),
                    'price_level': place.get('price_level', ''),
                    'lat': place.get('geometry', {}).get('location', {}).get('lat', ''),
                    'lon': place.get('geometry', {}).get('location', {}).get('lng', ''),
                }

                restaurants.append(restaurant)
                time.sleep(0.1)  # Rate limiting

            # Handle pagination
            next_page_token = data.get('next_page_token')
            while next_page_token and len(restaurants) < limit:
                time.sleep(2)  # Required delay for next_page_token
                params['pagetoken'] = next_page_token
                response = requests.get(base_url, params=params)
                data = response.json()

                for place in data.get('results', []):
                    if len(restaurants) >= limit:
                        break

                    place_id = place.get('place_id')
                    details = self._get_place_details(place_id)

                    restaurant = {
                        'name': place.get('name', ''),
                        'address': place.get('vicinity', ''),
                        'phone': details.get('phone', ''),
                        'website': details.get('website', ''),
                        'email': details.get('email', ''),
                        'instagram': details.get('instagram', ''),
                        'rating': place.get('rating', ''),
                        'price_level': place.get('price_level', ''),
                        'lat': place.get('geometry', {}).get('location', {}).get('lat', ''),
                        'lon': place.get('geometry', {}).get('location', {}).get('lng', ''),
                    }

                    restaurants.append(restaurant)
                    time.sleep(0.1)

                next_page_token = data.get('next_page_token')

            print(f"✓ Found {len(restaurants)} restaurants from Google Places")
            return restaurants

        except Exception as e:
            print(f"Error fetching from Google Places: {e}")
            return []

    def _get_place_details(self, place_id: str) -> Dict:
        """Get detailed information for a place."""
        if not self.google_api_key:
            return {}

        url = "https://maps.googleapis.com/maps/api/place/details/json"
        params = {
            'place_id': place_id,
            'fields': 'formatted_phone_number,website,url',
            'key': self.google_api_key
        }

        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            data = response.json()

            result = data.get('result', {})
            details = {
                'phone': result.get('formatted_phone_number', ''),
                'website': result.get('website', ''),
            }

            # Try to extract Instagram from website
            if details['website']:
                details['instagram'] = self._extract_instagram_from_website(details['website'])

            return details

        except Exception as e:
            return {}

    def _extract_instagram_from_website(self, website: str) -> str:
        """Try to find Instagram handle from a website."""
        try:
            response = requests.get(website, headers=self.headers, timeout=5)
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')

                # Look for Instagram links
                instagram_links = soup.find_all('a', href=re.compile(r'instagram\.com/'))
                if instagram_links:
                    href = instagram_links[0].get('href', '')
                    match = re.search(r'instagram\.com/([a-zA-Z0-9._]+)', href)
                    if match:
                        return f"@{match.group(1)}"

        except Exception:
            pass
        return ''

    def fetch_yelp_data(self) -> List[Dict]:
        """
        Placeholder for Yelp API integration.
        Yelp Fusion API: https://www.yelp.com/developers
        """
        print("Yelp API integration not implemented yet.")
        print("Get a free API key at: https://www.yelp.com/developers")
        return []

    def get_sample_data(self) -> List[Dict]:
        """
        Provide sample Amsterdam restaurant data as a fallback.
        This is manually curated data for well-known restaurants.
        """
        print("Using sample restaurant data...")

        return [
            {
                'name': 'De Kas',
                'address': 'Kamerlingh Onneslaan 3, 1097 DE Amsterdam',
                'phone': '+31 20 462 4562',
                'website': 'https://www.restaurantdekas.nl',
                'email': 'info@restaurantdekas.nl',
                'instagram': '@restaurantdekas',
                'cuisine': 'Modern European',
            },
            {
                'name': 'Restaurant Greetje',
                'address': 'Peperstraat 23-25, 1011 TJ Amsterdam',
                'phone': '+31 20 779 7450',
                'website': 'https://www.restaurantgreetje.nl',
                'email': 'info@restaurantgreetje.nl',
                'instagram': '@restaurantgreetje',
                'cuisine': 'Dutch',
            },
            {
                'name': 'Restaurant Vinkeles',
                'address': 'Keizersgracht 384, 1016 GB Amsterdam',
                'phone': '+31 20 530 2010',
                'website': 'https://www.vinkeles.com',
                'email': 'info@vinkeles.com',
                'instagram': '@restaurantvinkeles',
                'cuisine': 'Fine Dining',
            },
            {
                'name': 'Bord\'Eau Restaurant Gastronomique',
                'address': 'Prof. Tulpplein 1, 1018 GX Amsterdam',
                'phone': '+31 20 531 1705',
                'website': 'https://www.bordeau.nl',
                'email': 'reservations@bordeau.nl',
                'instagram': '@bordeauamsterdam',
                'cuisine': 'French',
            },
            {
                'name': 'Restaurant Vermeer',
                'address': 'Prins Hendrikkade 59-72, 1012 AD Amsterdam',
                'phone': '+31 20 556 4885',
                'website': 'https://www.restaurantvermeer.nl',
                'email': 'vermeer@nhcollection.com',
                'instagram': '@restaurantvermeer',
                'cuisine': 'Contemporary European',
            },
            {
                'name': 'Rijks',
                'address': 'Museumstraat 2, 1071 XX Amsterdam',
                'phone': '+31 20 674 7555',
                'website': 'https://www.rijksrestaurant.nl',
                'email': 'info@rijksrestaurant.nl',
                'instagram': '@rijksrestaurant',
                'cuisine': 'Dutch Contemporary',
            },
            {
                'name': 'The Duchess',
                'address': 'Spuistraat 172, 1012 VT Amsterdam',
                'phone': '+31 20 811 3322',
                'website': 'https://www.the-duchess.com',
                'email': 'reservations@the-duchess.com',
                'instagram': '@theduchessamsterdam',
                'cuisine': 'International',
            },
            {
                'name': 'Cafe de Klos',
                'address': 'Kerkstraat 41, 1017 GB Amsterdam',
                'phone': '+31 20 625 0306',
                'website': 'https://www.cafedeklos.nl',
                'email': 'info@cafedeklos.nl',
                'instagram': '@cafedeklos',
                'cuisine': 'Grill',
            },
            {
                'name': 'Moeders',
                'address': 'Rozengracht 251, 1016 SX Amsterdam',
                'phone': '+31 20 626 7957',
                'website': 'https://www.moeders.com',
                'email': 'info@moeders.com',
                'instagram': '@moedersrestaurant',
                'cuisine': 'Traditional Dutch',
            },
            {
                'name': 'Bistro Bij Ons',
                'address': 'Prinsengracht 287, 1016 GW Amsterdam',
                'phone': '+31 20 627 9013',
                'website': 'https://www.bistrobijons.nl',
                'email': 'info@bistrobijons.nl',
                'instagram': '@bistrobijons',
                'cuisine': 'French Bistro',
            },
        ]

    def save_to_csv(self, filename: str = "amsterdam_restaurants.csv"):
        """Save restaurants to CSV file."""
        if not self.restaurants:
            print("No restaurants to save!")
            return

        output_path = Path(__file__).parent / filename

        fieldnames = ['name', 'address', 'phone', 'email', 'website', 'instagram', 'cuisine', 'rating', 'lat', 'lon']

        with open(output_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction='ignore')
            writer.writeheader()

            for restaurant in self.restaurants:
                writer.writerow(restaurant)

        print(f"\n✓ Saved {len(self.restaurants)} restaurants to {output_path}")

    def save_to_json(self, filename: str = "amsterdam_restaurants.json"):
        """Save restaurants to JSON file."""
        if not self.restaurants:
            print("No restaurants to save!")
            return

        output_path = Path(__file__).parent / filename

        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(self.restaurants, f, indent=2, ensure_ascii=False)

        print(f"✓ Saved {len(self.restaurants)} restaurants to {output_path}")

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

        print("\n" + "="*70)
        print("📊 SUMMARY")
        print("="*70)
        print(f"Total restaurants: {total}")
        print(f"With phone:     {with_phone:3d} ({with_phone/total*100:5.1f}%)")
        print(f"With email:     {with_email:3d} ({with_email/total*100:5.1f}%)")
        print(f"With website:   {with_website:3d} ({with_website/total*100:5.1f}%)")
        print(f"With Instagram: {with_instagram:3d} ({with_instagram/total*100:5.1f}%)")
        print("="*70)

    def print_examples(self, count: int = 5):
        """Print example restaurants."""
        if not self.restaurants:
            return

        print(f"\n📋 First {min(count, len(self.restaurants))} restaurants:\n")

        for i, restaurant in enumerate(self.restaurants[:count], 1):
            print(f"{i}. {restaurant['name']}")
            if restaurant.get('address'):
                print(f"   📍 {restaurant['address']}")
            if restaurant.get('phone'):
                print(f"   📞 {restaurant['phone']}")
            if restaurant.get('website'):
                print(f"   🌐 {restaurant['website']}")
            if restaurant.get('email'):
                print(f"   📧 {restaurant['email']}")
            if restaurant.get('instagram'):
                print(f"   📸 {restaurant['instagram']}")
            print()

    def run(self, limit: int = 60, use_sample: bool = False):
        """Main execution method."""
        print("\n" + "="*70)
        print("🍽️  AMSTERDAM RESTAURANT SCRAPER")
        print("="*70 + "\n")

        if use_sample:
            # Use sample data
            self.restaurants = self.get_sample_data()
        elif self.google_api_key:
            # Try Google Places API
            google_restaurants = self.fetch_google_places(limit=limit)
            self.restaurants.extend(google_restaurants)
        else:
            print("⚠️  No API keys configured. Using sample data.")
            print("\nTo get real data, you need a Google Places API key:")
            print("1. Go to https://console.cloud.google.com/")
            print("2. Create a project and enable Places API")
            print("3. Create API key")
            print("4. Run: export GOOGLE_PLACES_API_KEY='your_key_here'")
            print("   Or pass: --api-key YOUR_KEY\n")

            use_sample_fallback = input("Use sample data instead? (y/n): ").lower()
            if use_sample_fallback == 'y':
                self.restaurants = self.get_sample_data()
            else:
                print("Exiting...")
                return

        # Save results
        if self.restaurants:
            self.save_to_csv()
            self.save_to_json()
            self.print_summary()
            self.print_examples()

            print("\n" + "="*70)
            print("✅ DONE! Check the CSV and JSON files for complete data.")
            print("="*70)
        else:
            print("\n❌ No restaurants found!")


def main():
    import argparse

    parser = argparse.ArgumentParser(
        description='Scrape Amsterdam restaurants with contact information',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Use Google Places API
  python scrape_amsterdam_restaurants_v2.py --api-key YOUR_API_KEY --limit 100

  # Use sample data
  python scrape_amsterdam_restaurants_v2.py --sample

  # Set API key as environment variable
  export GOOGLE_PLACES_API_KEY='your_key_here'
  python scrape_amsterdam_restaurants_v2.py
        """
    )

    parser.add_argument('--limit', type=int, default=60,
                       help='Maximum number of restaurants to fetch (default: 60)')
    parser.add_argument('--api-key', type=str,
                       help='Google Places API key')
    parser.add_argument('--sample', action='store_true',
                       help='Use sample restaurant data instead of API')
    parser.add_argument('--output-csv', default='amsterdam_restaurants.csv',
                       help='Output CSV filename')
    parser.add_argument('--output-json', default='amsterdam_restaurants.json',
                       help='Output JSON filename')

    args = parser.parse_args()

    scraper = RestaurantScraper(google_api_key=args.api_key)
    scraper.run(limit=args.limit, use_sample=args.sample)


if __name__ == "__main__":
    main()
