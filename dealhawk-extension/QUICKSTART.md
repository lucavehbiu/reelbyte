# 🦅 DealHawk - Quick Start Guide

Get DealHawk running in **5 minutes** and start finding Lego arbitrage deals automatically.

---

## Installation (3 steps)

### 1. Run Setup Script

```bash
cd /home/user/reelbyte/dealhawk-extension
./setup.sh
```

This will create placeholder icons for the extension.

### 2. Load Extension in Chrome

1. Open Chrome and navigate to: `chrome://extensions/`
2. Toggle **"Developer mode"** (top right corner)
3. Click **"Load unpacked"**
4. Select the directory: `/home/user/reelbyte/dealhawk-extension`
5. DealHawk should now appear in your extensions list

### 3. Pin to Toolbar (Optional)

1. Click the puzzle piece icon in Chrome toolbar
2. Find "DealHawk - Lego Arbitrage Alerts"
3. Click the pin icon to keep it visible

**That's it!** The extension will start scanning in 1 minute.

---

## First Use

### Open the Extension

Click the DealHawk icon (🦅) in your toolbar.

You'll see:
- **Status bar** showing last check time and opportunity count
- **Opportunities tab** listing profitable deals
- **Settings tab** for customization

### Initial Scan

The extension auto-scans every 30 minutes, but you can trigger a manual scan:

1. Open DealHawk popup
2. Click the refresh button (↻) in the header
3. Wait 30-60 seconds for results

**Note**: On first run, the extension may show mock data if Lego.com scraping encounters issues. This is normal for testing.

---

## Understanding Opportunities

Each opportunity card shows:

- **Set Name & Number**: The Lego set identifier
- **Discount Badge**: % off from MSRP
- **MSRP**: Official Lego.com price
- **Retailer Price**: Current sale price
- **Potential Profit**: Estimated profit if resold at 50% markup
- **Found**: When the opportunity was discovered
- **Retailer**: Where to buy (Amazon/Walmart/Target)

### Taking Action

Click **"View Deal →"** to open the retailer product page in a new tab.

**Before buying**:
1. Verify the price hasn't changed
2. Check that it's the correct set number
3. Confirm it's actually in stock
4. Calculate your total cost (including tax/shipping)

---

## Customizing Settings

### Adjust Price Threshold

By default, DealHawk alerts when sets are **20% or more** below MSRP.

To change this:
1. Open Settings tab
2. Adjust "Price Threshold (%)" slider
3. Click "Save Settings"

**Recommended thresholds**:
- **15-20%**: Moderate opportunities, decent profit
- **25-30%**: Rare deals, high profit potential
- **10-15%**: More opportunities, lower profit margins

### Change Scan Frequency

To scan more or less frequently:
1. Open Settings tab
2. Select "Scan Interval" dropdown
3. Choose: 15min / 30min / 1hr / 2hr
4. Click "Save Settings"

**Note**: More frequent scans use more resources and may be rate-limited by retailers.

### Enable/Disable Retailers

To check only specific retailers:
1. Open Settings tab
2. Scroll to "Retailers" section
3. Toggle checkboxes for Amazon / Walmart / Target
4. Click "Save Settings"

**Tip**: If one retailer consistently blocks requests, disable it temporarily.

---

## Interpreting Results

### Good Opportunities

Look for:
- ✅ **Large sets** ($100+ MSRP) — Higher profit potential
- ✅ **25%+ discount** — Good margin after fees/shipping
- ✅ **Popular licenses** — Star Wars, Harry Potter, Marvel
- ✅ **"Retiring Soon"** status — Will appreciate post-retirement

### Skip These

Avoid:
- ❌ Small sets (<$50) — Not worth the hassle
- ❌ <15% discount — Profit margin too thin
- ❌ "Limited stock" only — May not actually retire
- ❌ Generic themes — Lower resale demand

### Example Good Deal

```
Set: Millennium Falcon #75192
MSRP: $849.99
Walmart: $679.99 (20% off)
Potential Profit: $520 (assuming 50% markup)
```

**Action**: Buy 1-2, hold 6-12 months, sell on eBay for $1,200-1,500.

---

## Troubleshooting

### "No opportunities found"

**Solutions**:
1. Lower your price threshold to 15%
2. Enable all three retailers
3. Try scanning at different times (weekends/holidays)
4. Check if Lego has any retiring sets currently

The Lego retirement cycle is seasonal — some months have more opportunities than others.

### Extension not scanning

**Check**:
1. Extension is enabled (not paused)
2. Settings → "Enable DealHawk" is checked
3. Service worker is running: `chrome://extensions/` → click "Service worker"
4. No errors in console logs

**Fix**:
- Refresh the extension (reload button on `chrome://extensions/`)
- Try manual scan (refresh icon in popup)

### Notifications not showing

**Enable notifications**:
1. Chrome → Settings → Privacy and Security → Site Settings → Notifications
2. Allow notifications for Chrome extensions
3. DealHawk → Settings → "Browser Notifications" checked

### "Failed to fetch" errors

This usually means:
- Retailer is blocking the request (Captcha/bot detection)
- Network connectivity issue
- Rate limiting

**Solutions**:
- Reduce scan frequency
- Use a VPN to change IP
- Wait a few hours and try again

### Mock data showing

If you see the same 5 sets every time (Millennium Falcon, Galaxy Explorer, etc.), the extension is using mock data because live scraping failed.

**This is normal** during development/testing. The mock data demonstrates the UI and logic while we refine the scraping.

---

## Next Steps

### 1. Monitor for a Week

Let DealHawk run in the background for 7 days to see what opportunities appear.

Track:
- How many alerts you get per day
- Average discount percentage
- Which retailer has the best deals

### 2. Refine Your Strategy

After a week, adjust:
- Price threshold (higher for fewer, better deals)
- Which retailers to monitor
- Scan frequency

### 3. Take Action on Deals

When a good opportunity appears:
1. Research the set on BrickLink/eBay (check sold listings)
2. Verify it's actually retiring
3. Calculate total cost vs. potential resale
4. Buy 1-3 sets (don't over-invest in one set)
5. Store properly (keep sealed, away from sunlight)
6. Wait 6-12 months
7. List on eBay/Marketplace

### 4. Track Your Results

Create a simple spreadsheet:

| Set # | Name | Buy Price | Buy Date | Sell Price | Sell Date | Profit |
|-------|------|-----------|----------|------------|-----------|--------|
| 75192 | Millennium Falcon | $680 | 2025-01 | $1,250 | 2025-08 | $570 |

This helps you identify:
- Which themes perform best
- Optimal holding period
- Your ROI

---

## Making Money

### Conservative Approach

- **Investment**: $500-1000/month in Lego sets
- **Frequency**: 2-3 good deals per month
- **Hold Time**: 6-12 months
- **Expected Profit**: $100-300 per flip
- **Annual Income**: $1,200-3,600/year

### Aggressive Approach

- **Investment**: $2,000-5,000/month
- **Frequency**: 5-10 deals per month
- **Hold Time**: 6-18 months
- **Expected Profit**: $200-500 per flip
- **Annual Income**: $6,000-30,000/year

### Reality Check

- Not every set appreciates
- Storage space required
- Fees eat into profit (eBay ~13%, PayPal ~3%, shipping ~$15-50)
- Market demand varies
- Time investment (listing, shipping, customer service)

**Bottom line**: Treat this as a side income, not a get-rich-quick scheme.

---

## Advanced Tips

### 1. Stack Discounts

Look for:
- Retailer sales + credit card cash back
- Walmart/Target Red Card (5% extra off)
- Amazon Prime Day deals
- Rakuten/Honey cash back

### 2. Focus on Themes

Specialize in 1-2 themes:
- Star Wars (most liquid market)
- Harry Potter (strong collector base)
- Creator Expert (consistent appreciation)

### 3. Monitor Retirement Announcements

Check these sources:
- Brickset.com (retirement predictions)
- r/legodeal (Reddit community)
- Brick Fanatics (news site)

DealHawk automates the price checking, but you still need to validate the opportunity.

### 4. Diversify

Don't put all your capital in one set. Spread across:
- 3-5 different sets
- Multiple themes
- Various price points

### 5. Sell Smart

Best platforms by set value:
- **$50-200**: Facebook Marketplace (no fees)
- **$200-500**: eBay (largest audience)
- **$500+**: BrickLink (serious collectors)

---

## FAQ

**Q: Is this legal?**
A: Yes, buying and reselling is legal. However, automated scraping may violate retailer ToS.

**Q: How much can I really make?**
A: Realistically, $100-500/month with moderate effort. $1,000+/month if you scale up.

**Q: How long until I see profit?**
A: 6-12 months (you need to wait for sets to appreciate).

**Q: What if a set doesn't appreciate?**
A: Worst case, you break even or take a small loss. Diversification helps.

**Q: Do I need to ship internationally?**
A: No, focus on domestic sales to avoid complexity.

**Q: What about taxes?**
A: Profits are taxable income. Track everything for tax purposes.

---

## Support

**Issues**:
- Check `chrome://extensions/` → DealHawk → "Service worker" → Console
- Click "View Errors" in popup footer
- Review error logs

**Development**:
- Edit source files in `dealhawk-extension/`
- Refresh extension on `chrome://extensions/` to see changes
- Check background script logs for debugging

**Community**:
- r/legodeal (Reddit)
- r/flipping (Reddit)
- BrickLink forums

---

## Final Thoughts

DealHawk **automates the tedious part** (price monitoring), but successful arbitrage still requires:

1. **Research** — Know which sets appreciate
2. **Patience** — Hold 6-12 months minimum
3. **Capital** — Need money to invest upfront
4. **Storage** — Space to store sealed sets
5. **Hustle** — Listing, shipping, customer service

This tool gives you the **edge** by alerting you to opportunities 24/7.

The $200 bet wasn't just about building a tool — it was about proving that **automation beats manual methods**.

Now go make some money. 🦅💰

---

**Next**: [Read the full README](./README.md) for technical details and advanced features.
