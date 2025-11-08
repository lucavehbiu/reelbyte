# Amsterdam Restaurant Scraper

Scripts to collect restaurant data in Amsterdam with contact information (phone, email, website, Instagram).

## Files

- `scrape_amsterdam_restaurants_v2.py` - **Main script** (recommended)
- `scrape_amsterdam_restaurants.py` - Original version (has API limitations)
- `requirements-scraper.txt` - Python dependencies

## Quick Start

### Option 1: Use Sample Data (No API Key Required)

```bash
cd scripts
python3 scrape_amsterdam_restaurants_v2.py --sample
```

This will generate 10 high-quality Amsterdam restaurants with all contact details.

### Option 2: Use Google Places API (Recommended for Real Data)

#### Get a Free API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable **Places API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Places API"
   - Click "Enable"
4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key

#### Run the Scraper

```bash
# Option A: Pass API key as argument
python3 scrape_amsterdam_restaurants_v2.py --api-key YOUR_API_KEY --limit 100

# Option B: Set as environment variable
export GOOGLE_PLACES_API_KEY='YOUR_API_KEY'
python3 scrape_amsterdam_restaurants_v2.py --limit 100
```

## Output Files

The script generates two files:

1. **amsterdam_restaurants.csv** - Spreadsheet format (easy to import)
2. **amsterdam_restaurants.json** - JSON format (easy to import into database)

### CSV Columns

- name
- address
- phone
- email
- website
- instagram
- cuisine (if available)
- rating (if available)
- lat/lon (coordinates)

## Usage Examples

### Get 50 restaurants with Google API
```bash
python3 scrape_amsterdam_restaurants_v2.py --api-key YOUR_KEY --limit 50
```

### Use sample data
```bash
python3 scrape_amsterdam_restaurants_v2.py --sample
```

### Custom output filenames
```bash
python3 scrape_amsterdam_restaurants_v2.py --sample \
  --output-csv my_restaurants.csv \
  --output-json my_restaurants.json
```

## Features

### Data Collected

For each restaurant, the script attempts to collect:
- ✅ Restaurant name
- ✅ Full address
- ✅ Phone number
- ✅ Website URL
- ✅ Email address
- ✅ Instagram handle
- ✅ Cuisine type
- ✅ Rating (Google Places)
- ✅ Geographic coordinates

### Data Sources

1. **Google Places API** (Recommended)
   - Most comprehensive data
   - 60-100 restaurants per run
   - Phone numbers and websites included
   - Free tier: 500 requests/day

2. **Sample Data** (No API required)
   - 10 high-quality Amsterdam restaurants
   - 100% complete contact information
   - Good for testing the platform

## Import to Database

### Import CSV to PostgreSQL

```sql
CREATE TABLE restaurants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    website TEXT,
    instagram VARCHAR(100),
    cuisine VARCHAR(100),
    rating DECIMAL(2,1),
    lat DECIMAL(10,7),
    lon DECIMAL(10,7),
    created_at TIMESTAMP DEFAULT NOW()
);

COPY restaurants(name, address, phone, email, website, instagram, cuisine, rating, lat, lon)
FROM '/path/to/amsterdam_restaurants.csv'
DELIMITER ','
CSV HEADER;
```

### Import with Python

```python
import csv
import json

# From CSV
with open('amsterdam_restaurants.csv', 'r') as f:
    reader = csv.DictReader(f)
    restaurants = list(reader)

# From JSON
with open('amsterdam_restaurants.json', 'r') as f:
    restaurants = json.load(f)

# Now use the data with your application
for restaurant in restaurants:
    print(f"{restaurant['name']} - {restaurant['phone']}")
```

## Troubleshooting

### "No API keys configured"

You need to provide a Google Places API key. Either:
- Pass `--api-key YOUR_KEY` argument
- Set environment variable: `export GOOGLE_PLACES_API_KEY='YOUR_KEY'`
- Or use `--sample` flag for sample data

### "Google Places API error: REQUEST_DENIED"

- Make sure you've enabled the Places API in Google Cloud Console
- Check that your API key is valid
- Verify billing is enabled (required for API access, but free tier is generous)

### "Too few results"

- Increase the `--limit` parameter
- Try different search radii or locations (edit script)
- Some restaurants may not have complete contact information

### Installation Issues

Install dependencies manually:
```bash
pip install -r requirements-scraper.txt
```

Or:
```bash
pip install requests beautifulsoup4 lxml
```

## API Costs

### Google Places API Pricing (2024)

- **Free Tier**: $200 credit/month = ~40,000 requests
- **Places Nearby Search**: $0.032 per request
- **Place Details**: $0.017 per request

For this script:
- 100 restaurants ≈ 1 nearby search + 100 detail requests ≈ $1.73
- But within free tier, you can get ~2,300 restaurants/month for FREE

## Next Steps

1. **Run the script** to collect restaurant data
2. **Import to your database** using the CSV or JSON output
3. **Verify contact information** - some data may be incomplete
4. **Reach out to restaurants** through your influencer marketplace

## Advanced Usage

### Extend the Search Area

Edit the script to change coordinates:

```python
# Amsterdam center
location = "52.3676,4.9041"
radius = 5000  # 5km

# Change to cover more area
radius = 10000  # 10km
```

### Filter by Cuisine Type

Modify Google Places query:

```python
params = {
    'location': location,
    'radius': radius,
    'type': 'restaurant',
    'keyword': 'italian',  # Add this
    'key': self.google_api_key
}
```

### Add More Cities

Create similar scripts for other cities by changing coordinates:

- Rotterdam: `51.9244,4.4777`
- Utrecht: `52.0907,5.1214`
- The Hague: `52.0705,4.3007`

## Support

For issues or questions:
1. Check the Google Places API documentation
2. Verify your API key and enabled APIs
3. Review the script output for specific errors

## Legal Notice

- Respect robots.txt and terms of service
- Don't scrape websites excessively
- Google Places API has usage limits
- Verify data accuracy before using commercially
- Comply with GDPR for EU contact data
