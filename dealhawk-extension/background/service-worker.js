/**
 * DealHawk Background Service Worker
 * Handles periodic scraping of Lego.com and retailer price checks
 */

import { LegoScraper } from '../utils/lego-scraper.js';
import { RetailerChecker } from '../utils/retailer-checker.js';
import { StorageManager } from '../utils/storage.js';

// Configuration
const CONFIG = {
  SCRAPE_INTERVAL_MINUTES: 30, // Check every 30 minutes
  PRICE_THRESHOLD_PERCENTAGE: 20, // Alert if retailer price is 20%+ below MSRP
  MAX_ALERTS_PER_DAY: 50
};

// Initialize on installation
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('DealHawk installed:', details.reason);

  // Set default settings
  if (details.reason === 'install') {
    await StorageManager.setSettings({
      enabled: true,
      scrapeInterval: CONFIG.SCRAPE_INTERVAL_MINUTES,
      priceThreshold: CONFIG.PRICE_THRESHOLD_PERCENTAGE,
      notificationsEnabled: true,
      retailers: {
        amazon: true,
        walmart: true,
        target: true
      }
    });
  }

  // Create periodic alarm
  chrome.alarms.create('legoScrape', {
    periodInMinutes: CONFIG.SCRAPE_INTERVAL_MINUTES,
    delayInMinutes: 1 // Start first scrape in 1 minute
  });

  console.log('DealHawk: Alarm created, will scrape every', CONFIG.SCRAPE_INTERVAL_MINUTES, 'minutes');
});

// Handle alarms
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'legoScrape') {
    console.log('DealHawk: Starting Lego scrape cycle...');
    await runScrapeCycle();
  }
});

/**
 * Main scraping cycle
 */
async function runScrapeCycle() {
  try {
    const settings = await StorageManager.getSettings();

    if (!settings.enabled) {
      console.log('DealHawk: Scraping disabled in settings');
      return;
    }

    // Step 1: Scrape Lego.com for retiring/sold out sets
    console.log('DealHawk: Fetching retiring Lego sets...');
    const retiringSets = await LegoScraper.getRetiringSets();

    if (!retiringSets || retiringSets.length === 0) {
      console.log('DealHawk: No retiring sets found');
      return;
    }

    console.log(`DealHawk: Found ${retiringSets.length} retiring sets`);

    // Step 2: Check each set against retailers
    const opportunities = [];

    for (const legoSet of retiringSets) {
      const prices = await RetailerChecker.checkPrices(legoSet, settings.retailers);

      // Check if any retailer has it below threshold
      for (const [retailer, priceData] of Object.entries(prices)) {
        if (!priceData.available) continue;

        const discount = ((legoSet.msrp - priceData.price) / legoSet.msrp) * 100;

        if (discount >= settings.priceThreshold) {
          opportunities.push({
            setId: legoSet.id,
            setName: legoSet.name,
            setNumber: legoSet.setNumber,
            msrp: legoSet.msrp,
            retailer: retailer,
            retailerPrice: priceData.price,
            retailerUrl: priceData.url,
            discount: discount.toFixed(1),
            potentialProfit: (legoSet.msrp * 1.5 - priceData.price).toFixed(2), // Conservative 50% markup
            timestamp: Date.now()
          });
        }
      }
    }

    // Step 3: Save opportunities and send notifications
    if (opportunities.length > 0) {
      console.log(`DealHawk: Found ${opportunities.length} arbitrage opportunities!`);
      await StorageManager.addOpportunities(opportunities);

      if (settings.notificationsEnabled) {
        await sendNotifications(opportunities);
      }
    } else {
      console.log('DealHawk: No opportunities found this cycle');
    }

    // Update last scrape time
    await StorageManager.updateLastScrape();

  } catch (error) {
    console.error('DealHawk: Scrape cycle error:', error);
    await StorageManager.logError({
      message: error.message,
      stack: error.stack,
      timestamp: Date.now()
    });
  }
}

/**
 * Send notifications for new opportunities
 */
async function sendNotifications(opportunities) {
  // Limit notifications to avoid spam
  const topOpportunities = opportunities
    .sort((a, b) => b.discount - a.discount)
    .slice(0, 3);

  for (const opp of topOpportunities) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: '../icons/icon128.png',
      title: `🦅 DealHawk Alert: ${opp.discount}% Discount!`,
      message: `${opp.setName} (#${opp.setNumber})\n${opp.retailer}: $${opp.retailerPrice} (MSRP: $${opp.msrp})\nPotential profit: $${opp.potentialProfit}`,
      priority: 2,
      requireInteraction: true
    });
  }
}

// Handle notification clicks
chrome.notifications.onClicked.addListener(async (notificationId) => {
  // Open popup when notification is clicked
  chrome.action.openPopup();
});

// Message handler for popup/content script communication
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'manualScrape') {
    runScrapeCycle().then(() => {
      sendResponse({ success: true });
    }).catch(error => {
      sendResponse({ success: false, error: error.message });
    });
    return true; // Keep channel open for async response
  }

  if (request.action === 'getOpportunities') {
    StorageManager.getOpportunities().then(opportunities => {
      sendResponse({ opportunities });
    });
    return true;
  }

  if (request.action === 'clearOpportunities') {
    StorageManager.clearOpportunities().then(() => {
      sendResponse({ success: true });
    });
    return true;
  }
});

console.log('DealHawk: Service worker loaded');
