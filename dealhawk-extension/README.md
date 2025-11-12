# 🦅 DealHawk - Lego Arbitrage Alerts

**Automated Chrome extension for finding profitable Lego arbitrage opportunities**

DealHawk automatically monitors Lego.com for retiring sets and cross-checks prices across Amazon, Walmart, and Target to alert you when sets are available below MSRP — perfect for reselling at a profit.

---

## 🚀 Features

- **Automated Scanning**: Checks every 30 minutes (configurable)
- **Multi-Retailer Support**: Amazon, Walmart, Target
- **Smart Alerts**: Browser notifications when opportunities are found
- **Price Tracking**: Monitors MSRP vs retailer prices
- **Profit Calculator**: Shows estimated profit potential
- **Customizable Thresholds**: Set your own discount % requirements
- **Clean UI**: Beautiful, modern popup interface

---

## 📦 Installation

### Option 1: Load Unpacked (Development)

1. **Clone or download this extension**:
   ```bash
   cd /path/to/reelbyte
   # Extension is already in: dealhawk-extension/
   ```

2. **Open Chrome Extensions page**:
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" (top right toggle)

3. **Load the extension**:
   - Click "Load unpacked"
   - Select the `dealhawk-extension` folder
   - Extension should now appear in your toolbar

4. **Pin the extension** (optional):
   - Click the puzzle icon in Chrome toolbar
   - Find "DealHawk" and click the pin icon

### Option 2: Install Icons (Required for Production)

The extension needs icons to work properly. You have two options:

**A) Use placeholder icons** (quick start):
```bash
cd dealhawk-extension/icons
# Create simple colored squares as placeholders
convert -size 16x16 xc:#667eea icon16.png
convert -size 48x48 xc:#667eea icon48.png
convert -size 128x128 xc:#667eea icon128.png
```

**B) Design real icons**:
- Create 16x16, 48x48, and 128x128 PNG images
- Should feature a hawk/eagle theme
- Save as `icon16.png`, `icon48.png`, `icon128.png` in `icons/` folder

---

## 🎯 How It Works

### Scanning Process

1. **Lego.com Scraping**:
   - Fetches the "Last Chance" category
   - Parses product data (name, set number, MSRP)
   - Identifies retiring and limited stock sets

2. **Retailer Price Checking**:
   - Searches Amazon, Walmart, Target for each set
   - Extracts current prices and availability
   - Compares against MSRP

3. **Opportunity Detection**:
   - Calculates discount percentage
   - Filters by your price threshold (default: 20% off)
   - Estimates profit potential (assumes 50% markup on resale)

4. **Alert System**:
   - Browser notifications for top 3 deals
   - Saves all opportunities in extension storage
   - Updates popup UI in real-time

### First Run

On first install, the extension will:
- Create default settings
- Start scanning in 1 minute
- Show mock data if Lego.com scraping fails (for testing)

---

## ⚙️ Configuration

### Settings Panel

Access via the gear icon or Settings tab:

**General Settings**:
- **Enable DealHawk**: Turn scanning on/off
- **Browser Notifications**: Toggle desktop alerts
- **Scan Interval**: 15min / 30min / 1hr / 2hr
- **Price Threshold**: Minimum discount % to trigger alerts (0-100%)

**Retailers**:
- Toggle each retailer individually
- Disabled retailers won't be checked (saves time)

### Storage

All data is stored locally using `chrome.storage.local`:
- Settings
- Opportunities (last 100)
- Error logs (last 20)
- Statistics

---

## 🛠️ Technical Details

### Architecture

```
dealhawk-extension/
├── manifest.json              # Extension configuration
├── background/
│   └── service-worker.js      # Background script (scraping logic)
├── popup/
│   ├── popup.html            # Extension popup UI
│   ├── popup.css             # Styles
│   └── popup.js              # Popup logic
├── utils/
│   ├── lego-scraper.js       # Lego.com scraper
│   ├── retailer-checker.js   # Multi-retailer price checker
│   └── storage.js            # Chrome storage wrapper
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

### Permissions

- `storage`: Save settings and opportunities locally
- `alarms`: Schedule periodic scraping
- `notifications`: Show desktop alerts
- `host_permissions`: Access Lego.com and retailer websites

### Tech Stack

- **Manifest V3**: Latest Chrome extension format
- **ES Modules**: Modern JavaScript with imports
- **Async/Await**: Clean async code
- **Service Workers**: Background execution
- **Chrome Storage API**: Local data persistence

---

## 🧪 Testing

### Manual Testing

1. **Trigger immediate scan**:
   - Open extension popup
   - Click "Scan Now" button
   - Watch for results (may take 30-60 seconds)

2. **Check background process**:
   - Go to `chrome://extensions/`
   - Click "Service worker" under DealHawk
   - View console logs

3. **View errors**:
   - Open popup
   - Click "View Errors" in footer
   - Check for any scraping failures

### Mock Data

The extension includes mock data for testing:
- 5 example retiring Lego sets
- Simulated retailer prices
- Random discount scenarios

If live scraping fails, mock data will be used automatically.

---

## 📊 Arbitrage Strategy

### Lego Investment Basics

**Why Lego sets appreciate**:
- Limited production runs
- Official retirement = scarcity
- Strong collector market
- Licensed sets (Star Wars, Harry Potter) appreciate most

**Profit Timeline**:
- Buy at or below MSRP when retiring
- Wait 6-12 months after retirement
- Sell on eBay/Facebook Marketplace for 50-200% markup

**Best Sets to Target**:
- Large sets ($100-500 MSRP)
- Licensed themes (Star Wars, Marvel, Harry Potter)
- Creator Expert / Architecture lines
- Sets marked "Retiring Soon" on Lego.com

### Example Opportunity

```
Set: Millennium Falcon #75192
MSRP: $849.99
Walmart Price: $679.99 (20% off)
Estimated Resale (12 months): $1,200-1,500
Potential Profit: $400-700
```

---

## 🚨 Important Notes

### Legal & Ethical

- **Retailer ToS**: Automated scraping may violate some retailer terms of service
- **Use Responsibly**: Don't spam retailers with requests
- **Rate Limiting**: Extension includes delays to avoid detection
- **For Personal Use**: Not for large-scale commercial operations

### Limitations

1. **Scraping Reliability**:
   - Websites change frequently
   - Captchas may block requests
   - Not all sets will be found

2. **Price Accuracy**:
   - Prices may be outdated (check before buying)
   - Availability can change instantly
   - Shipping costs not included in profit calculations

3. **No Guarantees**:
   - Past appreciation doesn't predict future value
   - Market demand varies
   - Storage costs and fees reduce profit

---

## 🔧 Troubleshooting

### Extension not scanning

1. Check if DealHawk is enabled in settings
2. Verify alarm is created: `chrome.alarms.getAll()`
3. Check service worker logs for errors
4. Try manual scan

### No opportunities found

- Lower your price threshold (try 10-15%)
- Enable all retailers
- Manually scan during peak times (weekends)
- Check if Lego has any retiring sets currently

### Notifications not showing

1. Check Chrome notification permissions
2. Enable notifications in extension settings
3. Verify system notifications are allowed

### "Failed to fetch" errors

- Retailer websites may be blocking requests
- Try changing your IP (VPN)
- Check if retailers are blocking Chrome extensions
- Review error logs for details

---

## 🚀 Future Enhancements

Planned features for v2.0:

- [ ] Best Buy open-box integration (using GraphQL API)
- [ ] eBay sold listings for profit estimation
- [ ] Historical price tracking
- [ ] Export opportunities to CSV
- [ ] Mobile app companion
- [ ] Community-shared opportunities
- [ ] Auto-purchase with Selenium/Puppeteer
- [ ] Portfolio tracking (what you've bought/sold)

---

## 📝 Development

### Build from Source

```bash
cd dealhawk-extension

# No build process needed - pure JavaScript
# Just load unpacked in Chrome

# To test changes:
# 1. Edit files
# 2. Go to chrome://extensions/
# 3. Click refresh icon on DealHawk
```

### Contributing

This is a personal project, but feel free to fork and customize!

Ideas for improvements:
- Better scraping logic for specific retailers
- More accurate profit estimation
- UI/UX enhancements
- Additional retailer support

---

## 📄 License

MIT License - use at your own risk

**Disclaimer**: This tool is for educational purposes. Use responsibly and respect retailer terms of service.

---

## 🙏 Credits

Built with:
- Chrome Extensions Manifest V3
- Modern JavaScript (ES2022)
- Love for Lego bricks

**Made by**: Your arbitrage-loving developer friend 🦅

---

## 💰 The $200 Bet

This extension was built to prove that automated arbitrage alerts could beat manual methods.

**The challenge**: Make a couple dollars per day in 2025 with minimal setup.

**The solution**: Automated Lego arbitrage tracking that runs 24/7 and alerts you to profitable opportunities while you sleep.

**Potential revenue**: 1-2 good flips per week = $100-300/week = **$400-1200/month** passive income.

Let's see who wins the bet. 🚀
