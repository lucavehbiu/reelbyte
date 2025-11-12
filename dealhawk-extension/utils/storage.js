/**
 * Storage Manager
 * Handles chrome.storage operations for DealHawk
 */

export class StorageManager {
  static KEYS = {
    SETTINGS: 'dealhawk_settings',
    OPPORTUNITIES: 'dealhawk_opportunities',
    LAST_SCRAPE: 'dealhawk_last_scrape',
    ERRORS: 'dealhawk_errors',
    STATS: 'dealhawk_stats'
  };

  /**
   * Get settings
   */
  static async getSettings() {
    const result = await chrome.storage.local.get(this.KEYS.SETTINGS);
    return result[this.KEYS.SETTINGS] || this.getDefaultSettings();
  }

  /**
   * Set settings
   */
  static async setSettings(settings) {
    await chrome.storage.local.set({
      [this.KEYS.SETTINGS]: settings
    });
  }

  /**
   * Update specific setting
   */
  static async updateSetting(key, value) {
    const settings = await this.getSettings();
    settings[key] = value;
    await this.setSettings(settings);
  }

  /**
   * Get default settings
   */
  static getDefaultSettings() {
    return {
      enabled: true,
      scrapeInterval: 30,
      priceThreshold: 20,
      notificationsEnabled: true,
      retailers: {
        amazon: true,
        walmart: true,
        target: true
      }
    };
  }

  /**
   * Get opportunities
   */
  static async getOpportunities() {
    const result = await chrome.storage.local.get(this.KEYS.OPPORTUNITIES);
    return result[this.KEYS.OPPORTUNITIES] || [];
  }

  /**
   * Add opportunities
   */
  static async addOpportunities(newOpportunities) {
    const existing = await this.getOpportunities();

    // Deduplicate by setId + retailer
    const uniqueMap = new Map();

    for (const opp of existing) {
      const key = `${opp.setId}_${opp.retailer}`;
      uniqueMap.set(key, opp);
    }

    for (const opp of newOpportunities) {
      const key = `${opp.setId}_${opp.retailer}`;
      uniqueMap.set(key, opp);
    }

    const allOpportunities = Array.from(uniqueMap.values())
      .sort((a, b) => b.timestamp - a.timestamp) // Most recent first
      .slice(0, 100); // Keep only last 100

    await chrome.storage.local.set({
      [this.KEYS.OPPORTUNITIES]: allOpportunities
    });

    // Update stats
    await this.updateStats({
      totalOpportunities: allOpportunities.length,
      lastOpportunityTime: Date.now()
    });
  }

  /**
   * Clear opportunities
   */
  static async clearOpportunities() {
    await chrome.storage.local.set({
      [this.KEYS.OPPORTUNITIES]: []
    });
  }

  /**
   * Remove single opportunity
   */
  static async removeOpportunity(setId, retailer) {
    const opportunities = await this.getOpportunities();
    const filtered = opportunities.filter(
      opp => !(opp.setId === setId && opp.retailer === retailer)
    );
    await chrome.storage.local.set({
      [this.KEYS.OPPORTUNITIES]: filtered
    });
  }

  /**
   * Get last scrape time
   */
  static async getLastScrape() {
    const result = await chrome.storage.local.get(this.KEYS.LAST_SCRAPE);
    return result[this.KEYS.LAST_SCRAPE] || null;
  }

  /**
   * Update last scrape time
   */
  static async updateLastScrape() {
    await chrome.storage.local.set({
      [this.KEYS.LAST_SCRAPE]: Date.now()
    });
  }

  /**
   * Log error
   */
  static async logError(error) {
    const result = await chrome.storage.local.get(this.KEYS.ERRORS);
    const errors = result[this.KEYS.ERRORS] || [];

    errors.unshift(error);

    // Keep only last 20 errors
    const recentErrors = errors.slice(0, 20);

    await chrome.storage.local.set({
      [this.KEYS.ERRORS]: recentErrors
    });
  }

  /**
   * Get errors
   */
  static async getErrors() {
    const result = await chrome.storage.local.get(this.KEYS.ERRORS);
    return result[this.KEYS.ERRORS] || [];
  }

  /**
   * Clear errors
   */
  static async clearErrors() {
    await chrome.storage.local.set({
      [this.KEYS.ERRORS]: []
    });
  }

  /**
   * Get stats
   */
  static async getStats() {
    const result = await chrome.storage.local.get(this.KEYS.STATS);
    return result[this.KEYS.STATS] || {
      totalOpportunities: 0,
      totalScrapes: 0,
      lastOpportunityTime: null,
      installDate: Date.now()
    };
  }

  /**
   * Update stats
   */
  static async updateStats(updates) {
    const stats = await this.getStats();
    Object.assign(stats, updates);
    await chrome.storage.local.set({
      [this.KEYS.STATS]: stats
    });
  }

  /**
   * Increment scrape count
   */
  static async incrementScrapeCount() {
    const stats = await this.getStats();
    stats.totalScrapes = (stats.totalScrapes || 0) + 1;
    await this.updateStats(stats);
  }
}
