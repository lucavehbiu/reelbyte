/**
 * DealHawk Popup Script
 * Handles UI interactions and displays opportunities
 */

import { StorageManager } from '../utils/storage.js';

// DOM Elements
let elements = {};

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  console.log('DealHawk popup loaded');

  // Cache DOM elements
  cacheElements();

  // Setup event listeners
  setupEventListeners();

  // Load initial data
  await loadData();

  // Hide loading state
  hideLoading();
});

/**
 * Cache DOM elements for performance
 */
function cacheElements() {
  elements = {
    // Header
    refreshBtn: document.getElementById('refreshBtn'),
    settingsBtn: document.getElementById('settingsBtn'),

    // Status bar
    lastScrapeTime: document.getElementById('lastScrapeTime'),
    opportunityCount: document.getElementById('opportunityCount'),

    // Tabs
    tabButtons: document.querySelectorAll('.tab-btn'),
    opportunitiesTab: document.getElementById('opportunitiesTab'),
    settingsTab: document.getElementById('settingsTab'),

    // Opportunities
    loadingState: document.getElementById('loadingState'),
    emptyState: document.getElementById('emptyState'),
    opportunitiesList: document.getElementById('opportunitiesList'),
    clearOpportunitiesBtn: document.getElementById('clearOpportunitiesBtn'),
    manualScrapeBtn: document.getElementById('manualScrapeBtn'),

    // Settings
    enabledCheckbox: document.getElementById('enabledCheckbox'),
    notificationsCheckbox: document.getElementById('notificationsCheckbox'),
    scrapeIntervalSelect: document.getElementById('scrapeIntervalSelect'),
    priceThresholdInput: document.getElementById('priceThresholdInput'),
    amazonCheckbox: document.getElementById('amazonCheckbox'),
    walmartCheckbox: document.getElementById('walmartCheckbox'),
    targetCheckbox: document.getElementById('targetCheckbox'),
    saveSettingsBtn: document.getElementById('saveSettingsBtn'),

    // Footer
    viewErrorsLink: document.getElementById('viewErrorsLink')
  };
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
  // Header buttons
  elements.refreshBtn.addEventListener('click', handleRefresh);
  elements.settingsBtn.addEventListener('click', () => switchTab('settings'));

  // Tab switching
  elements.tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      switchTab(tab);
    });
  });

  // Opportunities actions
  elements.clearOpportunitiesBtn.addEventListener('click', handleClearOpportunities);
  elements.manualScrapeBtn.addEventListener('click', handleManualScrape);

  // Settings actions
  elements.saveSettingsBtn.addEventListener('click', handleSaveSettings);

  // Footer
  elements.viewErrorsLink.addEventListener('click', handleViewErrors);
}

/**
 * Load all data from storage
 */
async function loadData() {
  try {
    // Load opportunities
    const opportunities = await StorageManager.getOpportunities();
    displayOpportunities(opportunities);

    // Load last scrape time
    const lastScrape = await StorageManager.getLastScrape();
    updateLastScrapeDisplay(lastScrape);

    // Load settings
    const settings = await StorageManager.getSettings();
    populateSettings(settings);

  } catch (error) {
    console.error('Error loading data:', error);
    showError('Failed to load data');
  }
}

/**
 * Display opportunities in the list
 */
function displayOpportunities(opportunities) {
  elements.opportunityCount.textContent = opportunities.length;

  if (opportunities.length === 0) {
    elements.emptyState.style.display = 'flex';
    elements.opportunitiesList.style.display = 'none';
    return;
  }

  elements.emptyState.style.display = 'none';
  elements.opportunitiesList.style.display = 'flex';

  // Clear existing cards
  elements.opportunitiesList.innerHTML = '';

  // Create cards for each opportunity
  opportunities.forEach(opp => {
    const card = createOpportunityCard(opp);
    elements.opportunitiesList.appendChild(card);
  });
}

/**
 * Create HTML for a single opportunity card
 */
function createOpportunityCard(opp) {
  const card = document.createElement('div');
  card.className = 'opportunity-card';

  const timeAgo = getTimeAgo(opp.timestamp);

  card.innerHTML = `
    <div class="opportunity-header">
      <div>
        <h3 class="opportunity-title">${opp.setName}</h3>
        <p class="set-number">Set #${opp.setNumber}</p>
      </div>
      <div class="discount-badge">${opp.discount}% OFF</div>
    </div>

    <div class="opportunity-details">
      <div class="detail-item">
        <span class="detail-label">MSRP</span>
        <span class="detail-value">$${opp.msrp.toFixed(2)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">${capitalizeFirst(opp.retailer)} Price</span>
        <span class="detail-value sale-price">$${opp.retailerPrice.toFixed(2)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Potential Profit</span>
        <span class="detail-value" style="color: var(--success-color);">$${opp.potentialProfit}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Found</span>
        <span class="detail-value">${timeAgo}</span>
      </div>
    </div>

    <div class="opportunity-footer">
      <span class="retailer-tag">${capitalizeFirst(opp.retailer)}</span>
      <button class="btn-primary btn-small" data-url="${opp.retailerUrl}">View Deal →</button>
    </div>
  `;

  // Add click handler for "View Deal" button
  const viewBtn = card.querySelector('.btn-primary');
  viewBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: opp.retailerUrl });
  });

  return card;
}

/**
 * Update last scrape time display
 */
function updateLastScrapeDisplay(timestamp) {
  if (!timestamp) {
    elements.lastScrapeTime.textContent = 'Never';
    return;
  }

  elements.lastScrapeTime.textContent = getTimeAgo(timestamp);
}

/**
 * Populate settings form with current values
 */
function populateSettings(settings) {
  elements.enabledCheckbox.checked = settings.enabled;
  elements.notificationsCheckbox.checked = settings.notificationsEnabled;
  elements.scrapeIntervalSelect.value = settings.scrapeInterval;
  elements.priceThresholdInput.value = settings.priceThreshold;
  elements.amazonCheckbox.checked = settings.retailers.amazon;
  elements.walmartCheckbox.checked = settings.retailers.walmart;
  elements.targetCheckbox.checked = settings.retailers.target;
}

/**
 * Switch between tabs
 */
function switchTab(tabName) {
  // Update tab buttons
  elements.tabButtons.forEach(btn => {
    if (btn.dataset.tab === tabName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update tab content
  if (tabName === 'opportunities') {
    elements.opportunitiesTab.classList.add('active');
    elements.settingsTab.classList.remove('active');
  } else if (tabName === 'settings') {
    elements.opportunitiesTab.classList.remove('active');
    elements.settingsTab.classList.add('active');
  }
}

/**
 * Handle refresh button click
 */
async function handleRefresh() {
  showLoading();

  try {
    // Request manual scrape from background script
    const response = await chrome.runtime.sendMessage({ action: 'manualScrape' });

    if (response.success) {
      // Reload opportunities
      await loadData();
      showSuccess('Refreshed successfully');
    } else {
      showError('Refresh failed: ' + response.error);
    }
  } catch (error) {
    console.error('Refresh error:', error);
    showError('Refresh failed');
  } finally {
    hideLoading();
  }
}

/**
 * Handle manual scrape button click
 */
async function handleManualScrape() {
  elements.manualScrapeBtn.disabled = true;
  elements.manualScrapeBtn.textContent = 'Scanning...';

  await handleRefresh();

  elements.manualScrapeBtn.disabled = false;
  elements.manualScrapeBtn.textContent = 'Scan Now';
}

/**
 * Handle clear opportunities button click
 */
async function handleClearOpportunities() {
  if (!confirm('Clear all opportunities? This cannot be undone.')) {
    return;
  }

  try {
    await StorageManager.clearOpportunities();
    displayOpportunities([]);
    showSuccess('Opportunities cleared');
  } catch (error) {
    console.error('Clear error:', error);
    showError('Failed to clear opportunities');
  }
}

/**
 * Handle save settings button click
 */
async function handleSaveSettings() {
  try {
    const settings = {
      enabled: elements.enabledCheckbox.checked,
      notificationsEnabled: elements.notificationsCheckbox.checked,
      scrapeInterval: parseInt(elements.scrapeIntervalSelect.value),
      priceThreshold: parseInt(elements.priceThresholdInput.value),
      retailers: {
        amazon: elements.amazonCheckbox.checked,
        walmart: elements.walmartCheckbox.checked,
        target: elements.targetCheckbox.checked
      }
    };

    await StorageManager.setSettings(settings);

    // Update alarm if interval changed
    chrome.alarms.clear('legoScrape');
    chrome.alarms.create('legoScrape', {
      periodInMinutes: settings.scrapeInterval,
      delayInMinutes: 1
    });

    showSuccess('Settings saved');
  } catch (error) {
    console.error('Save settings error:', error);
    showError('Failed to save settings');
  }
}

/**
 * Handle view errors link click
 */
async function handleViewErrors(e) {
  e.preventDefault();

  try {
    const errors = await StorageManager.getErrors();

    if (errors.length === 0) {
      alert('No errors logged');
      return;
    }

    const errorText = errors
      .map((err, i) => `${i + 1}. ${new Date(err.timestamp).toLocaleString()}\n   ${err.message}`)
      .join('\n\n');

    alert('Recent Errors:\n\n' + errorText);
  } catch (error) {
    console.error('View errors error:', error);
    showError('Failed to load errors');
  }
}

/**
 * Show loading state
 */
function showLoading() {
  elements.loadingState.style.display = 'flex';
  elements.emptyState.style.display = 'none';
  elements.opportunitiesList.style.display = 'none';
}

/**
 * Hide loading state
 */
function hideLoading() {
  elements.loadingState.style.display = 'none';
}

/**
 * Show success message
 */
function showSuccess(message) {
  // Simple implementation - could be improved with toast notifications
  console.log('Success:', message);
}

/**
 * Show error message
 */
function showError(message) {
  // Simple implementation - could be improved with toast notifications
  console.error('Error:', message);
  alert(message);
}

/**
 * Get time ago string from timestamp
 */
function getTimeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

/**
 * Capitalize first letter
 */
function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
